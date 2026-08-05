# 🎯 Goal Crafter

<p align="center">
  <b>把模糊任务变成 Agent 能自己跑到完成的、可验证的 Goal</b>
</p>

---

## 一句话

> "帮我写个 goal" → 5 个问题澄清 → 输出一个带**可验证完成条件**的 goal 提示词

---

## 为什么需要

你给 Agent 说"优化代码"、"改进 UI"、"修复 bug"——Agent 不知道什么时候算做完。

Goal Crafter 强制你在 goal 里写清楚**机器可检查的完成标准**：

| ❌ 模糊 | ✅ 可验证 |
|---------|----------|
| "代码质量提高" | "`tsc --noEmit` 0 errors + `eslint` 0 warnings" |
| "UI 更好看" | "页面在 375/768/1440px 断点下视觉一致" |
| "修复所有 bug" | "`npm test` 全部通过" |
| "优化性能" | "Lighthouse ≥ 90，LCP < 2.5s" |

---

## 支持的 Agent

- Claude Code `/goal`
- Codex Automations
- Pi / 通用

---

## 安装

```
帮我安装 goal-crafter skill
```

或手动：

```bash
git clone git@github.com:awesome-skills/goal-crafter.git ~/.agents_skills/goal-crafter
bash ~/.agents_skills/agent-skills-manager/scripts/sync-hermes.sh
```

---

## 使用

```
帮我写个 goal：自动审查当前分支的 PR
```

Agent 会走 4 个 Phase：

1. **澄清** — 5 个问题，逐个问清楚
2. **起草** — 按目标 Agent 格式输出
3. **自检** — 确认每个条件都可验证
4. **交付** — 粘贴即用

---

<p align="center">
  <sub>Inspired by Loop Engineering — the goal drives the loop</sub>
</p>