#!/usr/bin/env node
// Sync only this fork's selected promoted skills. No third-party dependencies.
import {
  cpSync, existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync,
  readdirSync, realpathSync, renameSync, rmSync, writeFileSync,
} from 'node:fs';
import { createHash } from 'node:crypto';
import { homedir } from 'node:os';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const stateName = '.matt-sync-state.json';
const excludeName = '.matt-sync-exclude';
const digest = (value) => createHash('sha256').update(value).digest('hex');
const validName = (name) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name);
const stat = (path) => {
  try { return lstatSync(path); } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
};

function canonicalPath(path) {
  return existsSync(path) ? realpathSync(path) : join(canonicalPath(dirname(path)), relative(dirname(path), path));
}

function inside(parent, child) {
  const rel = relative(parent, child);
  return rel === '' || (!rel.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`) && rel !== '..' && !isAbsolute(rel));
}

function safeRoot(path) {
  const root = canonicalPath(resolve(path));
  if (root === dirname(root) || root === realpathSync(homedir()) || inside(root, repo) || inside(repo, root)) {
    throw new Error(`unsafe skill root: ${root}`);
  }
  if (stat(root) && !stat(root).isDirectory()) throw new Error(`not a directory: ${root}`);
  return root;
}

// Include file permissions and empty directories; refuse links rather than following them.
function snapshot(root) {
  if (!stat(root)) return null;
  const entries = {};
  function visit(path, key) {
    const info = lstatSync(path);
    if (info.isSymbolicLink()) throw new Error(`resolve symlink before syncing: ${path}`);
    if (info.isFile()) entries[key] = `${info.mode & 0o777}:${digest(readFileSync(path))}`;
    else if (info.isDirectory()) {
      entries[key] = 'directory';
      for (const name of readdirSync(path).sort()) visit(join(path, name), key ? `${key}/${name}` : name);
    } else throw new Error(`unsupported file type: ${path}`);
  }
  visit(root, '');
  if (!lstatSync(root).isDirectory()) throw new Error(`not a skill directory: ${root}`);
  return { hash: digest(JSON.stringify(entries)), entries };
}

function readState(root) {
  const path = join(root, stateName);
  if (!stat(path)) return { version: 1, skills: {} };
  if (!lstatSync(path).isFile()) throw new Error(`not a regular state file: ${path}`);
  const state = JSON.parse(readFileSync(path, 'utf8'));
  if (state.version !== 1 || !state.skills || Array.isArray(state.skills) || typeof state.skills !== 'object' ||
      Object.entries(state.skills).some(([name, hash]) => !validName(name) || !/^[a-f0-9]{64}$/.test(hash))) {
    throw new Error(`invalid sync state: ${path}`);
  }
  return state;
}

function parseArgs() {
  const options = { dryRun: false, only: new Set(), excluded: new Set(), replace: new Set(), skipHermes: false };
  const flags = { '--only': options.only, '--exclude': options.excluded, '--replace-local': options.replace };
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--dry-run') options.dryRun = true;
    else if (args[i] === '--skip-hermes') options.skipHermes = true;
    else if (args[i] === '--help') {
      console.log('Usage: npm run sync:local -- [--dry-run] [--only NAME] [--exclude NAME] [--replace-local NAME] [--skip-hermes]\nName options may repeat. Persist exclusions in <canonical-root>/.matt-sync-exclude, one name per line.\n--replace-local explicitly replaces differing local copies or reinstalls a locally removed skill, after backup.');
      return null;
    } else if (flags[args[i]]) {
      const names = flags[args[i]];
      const name = args[++i];
      if (!name || !validName(name)) throw new Error('expected a skill name after the option');
      names.add(name);
    } else throw new Error(`unknown option: ${args[i]}`);
  }
  return options;
}

function main() {
  const options = parseArgs();
  if (!options) return;
  const canonical = safeRoot(process.env.AGENTS_SKILLS_ROOT || join(homedir(), '.agents_skills'));
  const roots = [{ label: 'canonical', path: canonical }];
  // An isolated canonical root must never silently refresh the user's real Hermes installation.
  const hermesPath = process.env.HERMES_SKILLS_ROOT || (!process.env.AGENTS_SKILLS_ROOT && join(homedir(), '.hermes', 'skills'));
  if (!options.skipHermes && hermesPath && (process.env.HERMES_SKILLS_ROOT || existsSync(hermesPath))) {
    const hermes = safeRoot(hermesPath);
    if (inside(canonical, hermes) || inside(hermes, canonical)) throw new Error('canonical and Hermes roots must be separate');
    roots.push({ label: 'hermes', path: hermes });
  }
  const exclusions = join(canonical, excludeName);
  if (stat(exclusions)) {
    if (!lstatSync(exclusions).isFile()) throw new Error(`not a regular exclusion file: ${exclusions}`);
    for (const line of readFileSync(exclusions, 'utf8').split(/\r?\n/)) {
      const name = line.split('#')[0].trim();
      if (!name) continue;
      if (!validName(name)) throw new Error(`invalid excluded skill: ${name}`);
      options.excluded.add(name);
    }
  }
  const sources = new Map();
  for (const bucket of ['engineering', 'productivity']) {
    const dir = join(repo, 'skills', bucket);
    for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const path = join(dir, entry.name);
      if (!existsSync(join(path, 'SKILL.md'))) continue;
      if (!validName(entry.name) || sources.has(entry.name)) throw new Error(`invalid or duplicate skill name: ${entry.name}`);
      sources.set(entry.name, path);
    }
  }
  for (const name of [...options.only, ...options.replace]) {
    if (!sources.has(name)) throw new Error(`unknown promoted skill: ${name}`);
    if (options.replace.has(name) && (options.excluded.has(name) || (options.only.size && !options.only.has(name)))) {
      throw new Error(`replacement is not selected: ${name}`);
    }
  }
  for (const root of roots) {
    root.state = readState(root.path);
    root.stateBefore = stat(join(root.path, stateName)) ? readFileSync(join(root.path, stateName), 'utf8') : null;
  }
  const plan = [];
  for (const [name, source] of sources) {
    if (options.only.size && !options.only.has(name)) continue;
    if (options.excluded.has(name)) { console.log(`excluded ${name}`); continue; }
    const desired = snapshot(source);
    const installed = snapshot(join(canonical, name));
    if (!installed && roots[0].state.skills[name] && !options.replace.has(name)) {
      console.log(`locally-removed ${name}; retained as absent (use --replace-local ${name} to reinstall)`);
      continue;
    }
    for (const root of roots) {
      const target = join(root.path, name);
      const before = root.label === 'canonical' ? installed : snapshot(target);
      const baseline = root.state.skills[name];
      let action = !before ? (baseline ? 'locally-removed' : 'add')
        : before.hash === desired.hash ? 'unchanged'
          : before.hash === baseline ? 'update' : 'conflict';
      if (options.replace.has(name) && ['conflict', 'locally-removed'].includes(action)) action = 'replace';
      const item = { root, name, source, target, before, desired, action };
      plan.push(item);
      console.log(`${root.label} ${action} ${name}`);
      if (options.dryRun && !['unchanged', 'locally-removed'].includes(action)) {
        const previous = before?.entries || {};
        for (const file of [...new Set([...Object.keys(previous), ...Object.keys(desired.entries)])].sort()) {
          if (previous[file] === desired.entries[file]) continue;
          console.log(`  ${!(file in previous) ? '+' : !(file in desired.entries) ? '-' : '~'} ${file || '.'}`);
        }
      }
    }
  }
  if (plan.some((item) => item.action === 'conflict')) {
    throw new Error('local differences found; no files changed. Reconcile them with the source, exclude the skill, or explicitly use --replace-local NAME.');
  }
  if (options.dryRun) return;

  const locks = [];
  const stages = [];
  try {
    for (const root of roots) {
      mkdirSync(root.path, { recursive: true });
      const lock = join(root.path, '.matt-sync-lock');
      mkdirSync(lock); // Another sync must finish before this one proceeds.
      locks.push(lock);
      const stateNow = stat(join(root.path, stateName)) ? readFileSync(join(root.path, stateName), 'utf8') : null;
      if (stateNow !== root.stateBefore) throw new Error(`sync state changed; rerun for ${root.path}`);
    }
    // Preflight every destination before making any skill change.
    for (const item of plan) {
      if (snapshot(item.target)?.hash !== item.before?.hash || snapshot(item.source)?.hash !== item.desired.hash) {
        throw new Error(`files changed during preflight: ${item.name}; rerun the sync`);
      }
    }
    for (const item of plan) {
      if (item.action === 'locally-removed') continue;
      const { root, name, target, desired } = item;
      if (item.action !== 'unchanged') {
        root.backup ||= mkdtempSync(join(root.path, '.bak-matt-sync-'));
        const stage = mkdtempSync(join(root.path, '.matt-sync-stage-'));
        stages.push(stage);
        const staged = join(stage, name);
        cpSync(item.source, staged, { recursive: true, preserveTimestamps: true });
        if (snapshot(staged).hash !== desired.hash) throw new Error(`staged copy differs: ${name}`);
        if (snapshot(target)?.hash !== item.before?.hash) throw new Error(`destination changed: ${target}`);
        const backup = join(root.backup, name);
        if (item.before) renameSync(target, backup);
        try { renameSync(staged, target); } catch (error) {
          if (item.before) renameSync(backup, target);
          throw error;
        }
      }
      root.state.skills[name] = desired.hash;
    }
    for (const root of roots) {
      const stage = mkdtempSync(join(root.path, '.matt-sync-stage-'));
      stages.push(stage);
      const stateFile = join(stage, stateName);
      writeFileSync(stateFile, `${JSON.stringify(root.state, null, 2)}\n`);
      renameSync(stateFile, join(root.path, stateName));
      if (root.backup) console.log(`${root.label} backup: ${root.backup}`);
    }
  } finally {
    for (const path of [...stages, ...locks]) rmSync(path, { recursive: true, force: true });
  }
  console.log('selected skills verified; exclusions and unrelated skills preserved');
}

try { main(); } catch (error) {
  console.error(`error: ${error.message}`);
  process.exitCode = 1;
}
