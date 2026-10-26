#!/usr/bin/env node
// Check tracked Bash sources without executing their setup or release actions.
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repo = fileURLToPath(new URL("../", import.meta.url));
const files = execFileSync("git", ["ls-files", "-z", "--", "*.sh"], {
  cwd: repo,
  encoding: "utf8",
}).split("\0").filter(Boolean);

let failed = false;
for (const file of files) {
  const result = spawnSync("bash", ["-n", file], { cwd: repo, stdio: "inherit" });
  if (result.error) console.error(result.error.message);
  if (result.status !== 0) failed = true;
}
if (failed) process.exit(1);
console.log(`Bash syntax OK (${files.length} files)`);
