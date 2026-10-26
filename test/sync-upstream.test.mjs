import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

// All remotes are local fixtures; ignore machine-wide signing and hook config.
const env = { ...process.env, GIT_CONFIG_GLOBAL: "/dev/null", GIT_CONFIG_NOSYSTEM: "1" };
const script = fileURLToPath(new URL("../scripts/sync-upstream.sh", import.meta.url));
function git(cwd, ...args) {
  return execFileSync("git", args, { cwd, env, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
}
function configure(cwd) {
  git(cwd, "config", "user.name", "Sync Test");
  git(cwd, "config", "user.email", "sync@example.invalid");
}
function commit(cwd, file, content) {
  writeFileSync(join(cwd, file), content);
  git(cwd, "add", file);
  git(cwd, "commit", "-m", `Update ${file}`);
  return git(cwd, "rev-parse", "HEAD");
}
function fixture(t, { conflict = false, forkChange = true, upstreamChange = true } = {}) {
  const root = mkdtempSync(join(tmpdir(), "skill-sync-test-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const seed = join(root, "seed");
  const origin = join(root, "origin.git");
  const upstream = join(root, "upstream.git");
  const checkout = join(root, "checkout");
  mkdirSync(seed);
  git(seed, "init", "-b", "main");
  configure(seed);
  mkdirSync(join(seed, "scripts"));
  copyFileSync(script, join(seed, "scripts/sync-upstream.sh"));
  writeFileSync(join(seed, "shared.md"), "base\n");
  git(seed, "add", ".");
  git(seed, "commit", "-m", "Baseline");
  git(root, "clone", "--bare", seed, upstream);
  if (upstreamChange) {
    git(seed, "switch", "-c", "upstream-work");
    commit(seed, conflict ? "shared.md" : "upstream.md", "upstream\n");
    git(seed, "push", upstream, "HEAD:main");
    git(seed, "switch", "main");
  }
  if (forkChange) commit(seed, conflict ? "shared.md" : "fork.md", "fork\n");
  git(root, "clone", "--bare", seed, origin);
  git(root, "clone", origin, checkout);
  configure(checkout);
  git(checkout, "remote", "add", "upstream", upstream);
  git(checkout, "switch", "-c", "codex/sync-test");
  const before = git(checkout, "rev-parse", "HEAD");
  const upstreamHead = git(upstream, "rev-parse", "main");
  return {
    checkout, origin, seed, before, upstreamHead,
    run: () => spawnSync("bash", ["scripts/sync-upstream.sh"], { cwd: checkout, env, encoding: "utf8" }),
  };
}
function assertPendingMerge(f) {
  assert.equal(git(f.checkout, "rev-parse", "HEAD"), f.before, "sync must not rewrite or commit HEAD");
  assert.equal(git(f.checkout, "rev-parse", "MERGE_HEAD"), f.upstreamHead);
  assert.equal(git(f.origin, "rev-parse", "main"), f.before, "published main must not move");
  const backups = git(f.checkout, "for-each-ref", "--format=%(objectname)", "refs/heads/backup/");
  assert.equal(backups, f.before, "backup must retain the original fork tip");
}

test("clean divergent sync waits for review and retains both histories after commit", (t) => {
  const f = fixture(t);
  const result = f.run();
  assert.equal(git(f.checkout, "rev-parse", "HEAD"), f.before, "sync must not rewrite HEAD");
  assert.equal(result.status, 0, result.stderr);
  assertPendingMerge(f);
  assert.equal(git(f.checkout, "show", ":upstream.md"), "upstream");
  assert.equal(readFileSync(join(f.checkout, "fork.md"), "utf8"), "fork\n");
  git(f.checkout, "commit", "-m", "Reviewed upstream sync");
  const parents = git(f.checkout, "show", "-s", "--format=%P").split(" ");
  assert.deepEqual(parents, [f.before, f.upstreamHead]);
});

test("fast-forwardable sync also waits for review", (t) => {
  const f = fixture(t, { forkChange: false });
  const result = f.run();
  assert.equal(result.status, 0, result.stderr);
  assertPendingMerge(f);
});

test("conflicts remain recoverable without auto-picking either side", (t) => {
  const f = fixture(t, { conflict: true });
  const result = f.run();
  assert.notEqual(result.status, 0);
  assertPendingMerge(f);
  assert.equal(git(f.checkout, "diff", "--name-only", "--diff-filter=U"), "shared.md");
  assert.match(result.stderr, /resolve conflicts by intent/);
  commit(f.checkout, "shared.md", "reviewed fork and upstream intent\n");
  assert.deepEqual(git(f.checkout, "show", "-s", "--format=%P").split(" "), [f.before, f.upstreamHead]);
});

test("dirty tracked and untracked files are preserved before any merge", (t) => {
  const f = fixture(t);
  writeFileSync(join(f.checkout, "shared.md"), "local edit\n");
  assert.notEqual(f.run().status, 0);
  assert.equal(readFileSync(join(f.checkout, "shared.md"), "utf8"), "local edit\n");
  git(f.checkout, "restore", "shared.md");
  writeFileSync(join(f.checkout, "notes.md"), "untracked notes\n");
  assert.notEqual(f.run().status, 0);
  assert.equal(readFileSync(join(f.checkout, "notes.md"), "utf8"), "untracked notes\n");
  assert.equal(git(f.checkout, "rev-parse", "HEAD"), f.before);
  assert.equal(git(f.checkout, "diff", "--cached", "--name-only"), "");
});

test("main and detached checkouts require a review branch", (t) => {
  const f = fixture(t);
  git(f.checkout, "switch", "main");
  assert.match(f.run().stderr, /create a review branch/);
  git(f.checkout, "switch", "--detach");
  assert.match(f.run().stderr, /requires a named local branch/);
  assert.equal(git(f.checkout, "rev-parse", "HEAD"), f.before);
  assert.equal(git(f.checkout, "for-each-ref", "--format=%(refname)", "refs/heads/backup/"), "");
});

test("stale branch is rejected after refreshing published main", (t) => {
  const f = fixture(t);
  const published = commit(f.seed, "published.md", "new published change\n");
  git(f.seed, "push", f.origin, "HEAD:main");
  const result = f.run();
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /does not contain current origin\/main/);
  assert.equal(git(f.checkout, "rev-parse", "origin/main"), published);
  assert.equal(git(f.checkout, "rev-parse", "HEAD"), f.before);
  assert.equal(git(f.checkout, "diff", "--cached", "--name-only"), "");
});

test("already included upstream is a no-op", (t) => {
  const f = fixture(t, { upstreamChange: false });
  const result = f.run();
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /already includes current upstream\/main/);
  assert.equal(git(f.checkout, "rev-parse", "HEAD"), f.before);
  assert.equal(git(f.checkout, "status", "--porcelain"), "");
  assert.equal(git(f.checkout, "for-each-ref", "--format=%(refname)", "refs/heads/backup/"), "");
});
