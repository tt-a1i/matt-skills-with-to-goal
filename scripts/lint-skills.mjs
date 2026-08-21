#!/usr/bin/env node
// Machine-checks promoted-skill inventory, README links, docs pages,
// and invocation pairing. Changes nothing; exits 1 on drift.

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repo = join(dirname(fileURLToPath(import.meta.url)), "..");
const PROMOTED = ["engineering", "productivity"];
const NON_PROMOTED = ["misc", "in-progress", "deprecated"];
const ALL_BUCKETS = [...PROMOTED, ...NON_PROMOTED];

const errors = [];

function fail(message) {
  errors.push(message);
}

function read(relPath) {
  return readFileSync(join(repo, relPath), "utf8");
}

function listSkillDirs(bucket) {
  const bucketDir = join(repo, "skills", bucket);
  if (!existsSync(bucketDir)) return [];
  return readdirSync(bucketDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => existsSync(join(bucketDir, entry.name, "SKILL.md")))
    .map((entry) => entry.name)
    .sort();
}

function id(bucket, name) {
  return `${bucket}/${name}`;
}

function fmt(ids) {
  return [...ids].sort().join(", ");
}

function diff(actual, expected) {
  const missing = [...expected].filter((key) => !actual.has(key)).sort();
  const extra = [...actual].filter((key) => !expected.has(key)).sort();
  return { missing, extra };
}

function reportDiff(side, actual, expected) {
  const { missing, extra } = diff(actual, expected);
  if (missing.length) fail(`missing from ${side}: ${fmt(missing)}`);
  if (extra.length) fail(`extra in ${side}: ${fmt(extra)}`);
}

function frontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match ? match[1] : "";
}

function hasDisableModelInvocation(skillMd) {
  return /^disable-model-invocation:\s*"?true"?\s*$/m.test(
    frontmatter(skillMd),
  );
}

function hasDenyImplicitInvocation(openaiYaml) {
  return /^[ \t]*allow_implicit_invocation:\s*"?false"?\s*$/m.test(
    openaiYaml,
  );
}

function invocationOf(bucket, name) {
  const skillMd = read(join("skills", bucket, name, "SKILL.md"));
  const yamlPath = join("skills", bucket, name, "agents", "openai.yaml");
  const openaiYaml = existsSync(join(repo, yamlPath)) ? read(yamlPath) : "";
  return {
    disable: hasDisableModelInvocation(skillMd),
    denyImplicit: hasDenyImplicitInvocation(openaiYaml),
  };
}

function extractLinks(markdown, pattern) {
  const links = [];
  const re = new RegExp(pattern.source, pattern.flags);
  for (const match of markdown.matchAll(re)) {
    links.push({
      text: match[1],
      ...match.groups,
      raw: match[0],
    });
  }
  return links;
}

const TOP_SKILL_LINK =
  /\[`(?<text>[a-z0-9-]+)`\]\(\.\/skills\/(?<bucket>engineering|productivity|misc|in-progress|deprecated)\/(?<name>[a-z0-9-]+)\/SKILL\.md\)/g;
const BUCKET_SKILL_LINK =
  /\[`?(?<text>[a-z0-9-]+)`?\]\(\.\/(?<name>[a-z0-9-]+)\/SKILL\.md\)/g;

const promoted = new Map();
for (const bucket of PROMOTED) {
  for (const name of listSkillDirs(bucket)) {
    promoted.set(id(bucket, name), { bucket, name });
  }
}
const promotedIds = new Set(promoted.keys());

const nonPromoted = [];
for (const bucket of NON_PROMOTED) {
  for (const name of listSkillDirs(bucket)) {
    nonPromoted.push({ bucket, name, id: id(bucket, name) });
  }
}
const nonPromotedNames = new Set(nonPromoted.map((skill) => skill.name));

const plugin = JSON.parse(read(join(".claude-plugin", "plugin.json")));
const pluginIds = new Set();
const pluginPaths = Array.isArray(plugin.skills) ? plugin.skills : [];
for (const [index, raw] of pluginPaths.entries()) {
  const match =
    typeof raw === "string" &&
    raw.match(/^\.\/skills\/(engineering|productivity|misc|in-progress|deprecated)\/([a-z0-9-]+)$/);
  if (!match) {
    fail(`plugin.json skills[${index}] is not ./skills/<bucket>/<name>: ${raw}`);
    continue;
  }
  const key = id(match[1], match[2]);
  if (pluginIds.has(key)) fail(`plugin.json lists ${raw} more than once`);
  pluginIds.add(key);
  if (NON_PROMOTED.includes(match[1])) {
    fail(`non-promoted skill in plugin.json: ${raw}`);
  }
}

const topReadme = read("README.md");
const topLinks = extractLinks(topReadme, TOP_SKILL_LINK);
const topIds = new Set();
for (const link of topLinks) {
  if (link.text !== link.name) {
    fail(
      `README.md link ${link.raw}: name and path differ (${link.text} vs ${link.bucket}/${link.name})`,
    );
  }
  if (NON_PROMOTED.includes(link.bucket) || nonPromotedNames.has(link.text)) {
    fail(
      `non-promoted skill in README.md: ${link.text} (skills/${link.bucket}/${link.name})`,
    );
    continue;
  }
  topIds.add(id(link.bucket, link.name));
}

reportDiff("plugin.json", pluginIds, promotedIds);
reportDiff("README.md", topIds, promotedIds);

for (const bucket of PROMOTED) {
  const readmePath = `skills/${bucket}/README.md`;
  const source = existsSync(join(repo, readmePath))
    ? read(readmePath)
    : (fail(`missing ${readmePath}`), "");
  const expected = new Set(
    [...promoted.values()]
      .filter((skill) => skill.bucket === bucket)
      .map((skill) => id(bucket, skill.name)),
  );

  const bucketLinks = extractLinks(source, BUCKET_SKILL_LINK);
  const bucketIds = new Set();
  for (const link of bucketLinks) {
    if (link.text !== link.name) {
      fail(
        `${readmePath} link ${link.raw}: name and path differ (${link.text} vs ${link.name})`,
      );
    }
    bucketIds.add(id(bucket, link.name));
  }
  reportDiff(readmePath, bucketIds, expected);

  const grouped = { user: new Set(), model: new Set() };
  let section = null;
  for (const line of source.split(/\r?\n/)) {
    if (/^##\s+User-invoked\s*$/.test(line)) {
      section = "user";
      continue;
    }
    if (/^##\s+Model-invoked\s*$/.test(line)) {
      section = "model";
      continue;
    }
    if (/^##\s+/.test(line)) {
      section = null;
      continue;
    }
    if (!section) continue;
    for (const link of extractLinks(line, BUCKET_SKILL_LINK)) {
      grouped[section].add(link.text);
    }
  }

  for (const name of grouped.user) {
    if (grouped.model.has(name)) {
      fail(
        `${readmePath}: ${name} listed under both ## User-invoked and ## Model-invoked`,
      );
    }
  }

  for (const skill of [...promoted.values()].filter((item) => item.bucket === bucket)) {
    const { disable, denyImplicit } = invocationOf(skill.bucket, skill.name);
    const userInvoked = disable && denyImplicit;
    const modelInvoked = !disable && !denyImplicit;
    if (!userInvoked && !modelInvoked) continue;
    const inUser = grouped.user.has(skill.name);
    const inModel = grouped.model.has(skill.name);
    if (userInvoked && !inUser) {
      fail(
        `${readmePath}: ${skill.name} is user-invoked but not listed under ## User-invoked`,
      );
    }
    if (modelInvoked && !inModel) {
      fail(
        `${readmePath}: ${skill.name} is model-invoked but not listed under ## Model-invoked`,
      );
    }
    if (inUser && !userInvoked) {
      fail(
        `${readmePath}: ${skill.name} listed under ## User-invoked but is model-invoked`,
      );
    }
    if (inModel && !modelInvoked) {
      fail(
        `${readmePath}: ${skill.name} listed under ## Model-invoked but is user-invoked`,
      );
    }
  }
}

const docsIds = new Set();
for (const bucket of PROMOTED) {
  const docsDir = join(repo, "docs", bucket);
  if (!existsSync(docsDir)) continue;
  for (const entry of readdirSync(docsDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    docsIds.add(id(bucket, entry.name.slice(0, -3)));
  }
}
reportDiff("docs/<bucket>/<name>.md", docsIds, promotedIds);

for (const { bucket, name } of [
  ...promoted.values(),
  ...nonPromoted,
]) {
  const { disable, denyImplicit } = invocationOf(bucket, name);
  const skill = `skills/${bucket}/${name}`;
  if (disable && !denyImplicit) {
    fail(
      `${skill}: disable-model-invocation: true without policy.allow_implicit_invocation: false in agents/openai.yaml`,
    );
  }
  if (!disable && denyImplicit) {
    fail(
      `${skill}: policy.allow_implicit_invocation: false without disable-model-invocation: true`,
    );
  }
}

if (errors.length) {
  console.error(`skills lint failed (${errors.length}):`);
  for (const message of errors) console.error(`  ${message}`);
  process.exit(1);
}

console.log(`skills lint OK (${promoted.size} promoted)`);
