import test from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const script = resolve(dirname(fileURLToPath(import.meta.url)), '../sync-local-skills.mjs');
function fixture(t) {
  const temp = mkdtempSync(join(tmpdir(), 'matt-sync-test-'));
  t.after(() => rmSync(temp, { recursive: true, force: true }));
  const repo = join(temp, 'repo');
  const canonical = join(temp, 'canonical');
  const hermes = join(temp, 'hermes');
  for (const path of ['scripts', 'skills/engineering', 'skills/productivity']) mkdirSync(join(repo, path), { recursive: true });
  cpSync(script, join(repo, 'scripts/sync-local-skills.mjs'));
  function put(root, path, text) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), text);
  }
  function source(name, text = 'v1') { put(repo, `skills/engineering/${name}/SKILL.md`, text); }
  function run(args = [], env = {}) {
    return spawnSync(process.execPath, [join(repo, 'scripts/sync-local-skills.mjs'), ...args], {
      encoding: 'utf8', env: { ...process.env, AGENTS_SKILLS_ROOT: canonical, HERMES_SKILLS_ROOT: hermes, ...env },
    });
  }
  function ok(args = []) {
    const result = run(args);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    return result;
  }
  const read = (root, path) => readFileSync(join(root, path), 'utf8');
  return { repo, canonical, hermes, put, source, run, ok, read };
}

test('dry run previews both targets without creating directories or state', (t) => {
  const f = fixture(t); f.source('alpha');
  const result = f.ok(['--dry-run']);
  assert.match(result.stdout, /canonical add alpha/);
  assert.match(result.stdout, /\+ SKILL.md/);
  assert.equal(existsSync(f.canonical), false);
  assert.equal(existsSync(f.hermes), false);
});

test('sync updates managed copies, removes obsolete files and preserves a recoverable backup', (t) => {
  const f = fixture(t); f.source('alpha');
  f.put(f.repo, 'skills/engineering/alpha/old.md', 'old');
  f.ok();
  f.source('alpha', 'v2');
  rmSync(join(f.repo, 'skills/engineering/alpha/old.md'));
  f.put(f.canonical, 'unrelated/SKILL.md', 'user skill');
  f.ok();
  for (const root of [f.canonical, f.hermes]) {
    assert.equal(f.read(root, 'alpha/SKILL.md'), 'v2');
    assert.equal(existsSync(join(root, 'alpha/old.md')), false);
    const backup = readdirSync(root).filter((name) => name.startsWith('.bak-matt-sync-'))
      .find((name) => existsSync(join(root, name, 'alpha/old.md')));
    assert.ok(backup);
    assert.equal(f.read(root, `${backup}/alpha/SKILL.md`), 'v1');
  }
  assert.equal(f.read(f.canonical, 'unrelated/SKILL.md'), 'user skill');
});

test('an existing untracked local edit aborts the entire batch before installing other skills', (t) => {
  const f = fixture(t); f.source('alpha'); f.source('beta');
  f.put(f.canonical, 'beta/SKILL.md', 'local beta');
  const result = f.run();
  assert.equal(result.status, 1);
  assert.match(result.stderr, /local differences/);
  assert.equal(f.read(f.canonical, 'beta/SKILL.md'), 'local beta');
  assert.equal(existsSync(join(f.canonical, 'alpha')), false);
  assert.equal(existsSync(f.hermes), false);
  assert.equal(existsSync(join(f.canonical, '.matt-sync-state.json')), false);
});

test('a Hermes edit blocks canonical updates until that skill is explicitly replaced', (t) => {
  const f = fixture(t); f.source('alpha'); f.ok();
  f.source('alpha', 'v2');
  f.put(f.hermes, 'alpha/SKILL.md', 'Hermes edit');
  assert.equal(f.run().status, 1);
  assert.equal(f.read(f.canonical, 'alpha/SKILL.md'), 'v1');
  f.ok(['--replace-local', 'alpha']);
  assert.equal(f.read(f.hermes, 'alpha/SKILL.md'), 'v2');
  assert.equal(f.read(f.canonical, 'alpha/SKILL.md'), 'v2');
});

test('persistent and one-run exclusions preserve absent and existing skills in both targets', (t) => {
  const f = fixture(t); f.source('code-review'); f.source('alpha'); f.source('beta');
  f.put(f.canonical, '.matt-sync-exclude', '# Personal choices\ncode-review\nalpha # keep my copy\n');
  f.put(f.canonical, 'alpha/SKILL.md', 'canonical custom');
  f.put(f.hermes, 'alpha/SKILL.md', 'Hermes custom');
  f.ok(['--exclude', 'beta']);
  for (const root of [f.canonical, f.hermes]) {
    assert.equal(existsSync(join(root, 'code-review')), false);
    assert.equal(existsSync(join(root, 'beta')), false);
  }
  assert.equal(f.read(f.canonical, 'alpha/SKILL.md'), 'canonical custom');
  assert.equal(f.read(f.hermes, 'alpha/SKILL.md'), 'Hermes custom');
  f.ok();
  assert.equal(existsSync(join(f.canonical, 'code-review')), false);
  assert.equal(f.read(f.canonical, 'beta/SKILL.md'), 'v1');
});

test('a locally removed managed skill stays absent until explicitly reinstalled', (t) => {
  const f = fixture(t); f.source('alpha'); f.ok();
  rmSync(join(f.canonical, 'alpha'), { recursive: true });
  rmSync(join(f.hermes, 'alpha'), { recursive: true });
  f.ok();
  assert.equal(existsSync(join(f.canonical, 'alpha')), false);
  assert.equal(existsSync(join(f.hermes, 'alpha')), false);
  f.ok(['--replace-local', 'alpha']);
  assert.equal(f.read(f.canonical, 'alpha/SKILL.md'), 'v1');
});

test('only selected skills are synced and unknown selections fail without writes', (t) => {
  const f = fixture(t); f.source('alpha'); f.source('beta');
  assert.equal(f.run(['--only', 'typo']).status, 1);
  assert.equal(existsSync(f.canonical), false);
  f.ok(['--only', 'alpha']);
  assert.equal(existsSync(join(f.canonical, 'beta')), false);
});

test('destination and nested symlinks are never followed, even with replacement', (t) => {
  const f = fixture(t); f.source('alpha');
  f.put(f.hermes, 'protected/SKILL.md', 'untouched');
  mkdirSync(f.canonical);
  symlinkSync(join(f.hermes, 'protected'), join(f.canonical, 'alpha'));
  assert.equal(f.run(['--replace-local', 'alpha']).status, 1);
  assert.equal(f.read(f.hermes, 'protected/SKILL.md'), 'untouched');
  rmSync(join(f.canonical, 'alpha'));
  mkdirSync(join(f.canonical, 'alpha'));
  symlinkSync(join(f.hermes, 'protected/SKILL.md'), join(f.canonical, 'alpha/SKILL.md'));
  assert.equal(f.run().status, 1);
});

test('unsafe roots, overlapping roots, malformed state and malformed exclusions fail closed', (t) => {
  const f = fixture(t); f.source('alpha');
  for (const env of [
    { AGENTS_SKILLS_ROOT: '/' },
    { AGENTS_SKILLS_ROOT: f.repo },
    { HERMES_SKILLS_ROOT: join(f.canonical, 'hermes') },
  ]) assert.equal(f.run([], env).status, 1);
  f.put(f.canonical, '.matt-sync-state.json', '{bad json');
  assert.equal(f.run().status, 1);
  rmSync(join(f.canonical, '.matt-sync-state.json'));
  f.put(f.canonical, '.matt-sync-exclude', '../escape');
  assert.equal(f.run().status, 1);
  assert.equal(existsSync(join(f.canonical, 'alpha')), false);
});

test('an existing sync lock prevents mutations and remains owned by the other run', (t) => {
  const f = fixture(t); f.source('alpha');
  mkdirSync(join(f.canonical, '.matt-sync-lock'), { recursive: true });
  assert.equal(f.run().status, 1);
  assert.equal(existsSync(join(f.canonical, '.matt-sync-lock')), true);
  assert.equal(existsSync(join(f.canonical, 'alpha')), false);
});

test('duplicate source names and source symlinks are rejected before mutation', (t) => {
  const f = fixture(t); f.source('alpha');
  f.put(f.repo, 'skills/productivity/alpha/SKILL.md', 'duplicate');
  assert.equal(f.run().status, 1);
  rmSync(join(f.repo, 'skills/productivity/alpha'), { recursive: true });
  symlinkSync(join(f.repo, 'skills/engineering/alpha/SKILL.md'), join(f.repo, 'skills/engineering/alpha/link.md'));
  assert.equal(f.run().status, 1);
  assert.equal(existsSync(f.canonical), false);
});

test('skip-hermes limits both conflict detection and writes to canonical', (t) => {
  const f = fixture(t); f.source('alpha');
  f.put(f.hermes, 'alpha/SKILL.md', 'Hermes local');
  f.ok(['--skip-hermes']);
  assert.equal(f.read(f.hermes, 'alpha/SKILL.md'), 'Hermes local');
  assert.equal(f.read(f.canonical, 'alpha/SKILL.md'), 'v1');
});
