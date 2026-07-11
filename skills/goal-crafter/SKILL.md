---
name: goal-crafter
description: >
  Craft verifiable, tight goal prompts for AI coding agents (Claude Code /goal, Codex Automations, Pi).
  Use when the user says "给我一个 goal 提示词", "帮我写个 goal", "设置一个自动化任务",
  "我想让 agent 自动做 X", or asks to turn a task into a self-running loop.
  Ensures every goal has a checkable completion criterion so the agent knows when it's done.
---

# Goal Crafter

Turn a vague task into a **verifiable goal** that an AI agent can run unattended.

**Leading principle**: A goal without a checkable completion criterion is just a wish. The agent must be able to answer "Am I done?" without asking a human.

## Process

### Phase 1 — Clarify the task

Ask the user, **one question at a time**:

1. **What exactly should the agent do?**  
   Get the task in one sentence. If it's vague ("优化代码", "改进 UI"), push for specifics.

2. **Where does it run?**  
   Which project / repo / workspace? Is there a specific branch or file area?

3. **What does DONE look like?**  
   This is the most important question. Push for **observable, machine-checkable** conditions:
   
   | ❌ Vague (bad) | ✅ Verifiable (good) |
   |---|---|
   | "代码质量提高" | "`tsc --noEmit` 0 errors + `eslint` 0 warnings" |
   | "UI 更好看" | "页面在 375px / 768px / 1440px 三个断点下视觉一致，无溢出" |
   | "修复所有 bug" | "`npm test` 全部通过，且 `git diff` 只包含修复相关改动" |
   | "写好文档" | "README.md 包含安装/使用/API 三个章节，每个章节有代码示例" |
   | "性能优化" | "Lighthouse Performance 分数 ≥ 90，LCP < 2.5s" |

4. **Any constraints?**  
   Don't touch certain files? Must use specific tools? Budget limit? Time limit?

5. **What agent / harness?**  
   Claude Code (`/goal`), Codex (Automations), Pi, or generic?

**Phase 1 complete when** you have answers to all 5 questions. If the user can't answer #3, help them brainstorm verifiable conditions — this is the most common failure point.

### Phase 2 — Draft the goal

Write the goal in the target agent's format. Follow these rules:

**For Claude Code `/goal`**:
```
Goal: [one-line task description]

Completion criteria:
- [ ] [checkable condition 1]
- [ ] [checkable condition 2]
- [ ] [checkable condition 3]

Constraints:
- [file/area restrictions]
- [tool/approach restrictions]
- [budget/time limits]

Context:
- [key files to read first]
- [relevant docs/specs]
- [related issues/PRs]
```

**For Codex Automations**:
```
Task: [one-line description]
Frequency: [once / on push / on schedule]
Verification: [checkable condition]
Workspace: [project path]
```

**For Pi / generic**:
```
任务：[一句话]
完成标准：
- [ ] [可验证条件 1]
- [ ] [可验证条件 2]
限制：[约束条件]
```

### Phase 3 — Verify the goal

Before presenting the final goal, **self-check**:

- [ ] Can an agent read the completion criteria and unambiguously decide "done" vs "not done"?
- [ ] Is every criterion **observable** without human judgment? (No "looks good", "feels right")
- [ ] Are the constraints specific enough to prevent scope creep?
- [ ] Is the context sufficient for the agent to start working without asking "where" or "how"?

If any check fails, go back to Phase 1 and ask the user to clarify that specific point.

### Phase 4 — Deliver

Present the final goal. End with:

> "把这个 goal 粘贴到 [agent 名称] 里，它就会自己跑到完成。如果中途卡住，告诉我哪条完成标准没达到，我帮你调。"

---

## Examples

### Example 1: Code review automation

**User**: "帮我写个 goal，自动审查 PR"

**Clarified**:
- Task: 审查当前分支相对于 main 的所有改动
- Where: hive-private 仓库
- Done: 输出一份审查报告，列出所有 P0/P1 问题，每个问题标注文件和行号
- Constraints: 只读，不改文件
- Agent: Claude Code

**Output**:
```
Goal: 审查当前分支相对于 origin/main 的 diff

Completion criteria:
- [ ] 已读取完整的 git diff
- [ ] 已检查安全漏洞（SQL 注入、XSS、密钥泄露）
- [ ] 已检查逻辑错误（空指针、竞态条件、边界条件）
- [ ] 已检查代码规范（命名、结构、重复代码）
- [ ] 输出审查报告，每个问题标注：严重度 + 文件:行号 + 问题描述 + 修复建议

Constraints:
- 只读，不修改任何文件
- 只关注当前分支的改动，不审查已有代码

Context:
- 项目背景：Hive 是本地多 Agent 协作 runtime
- 设计 spec：docs/superpowers/spec.md
```

### Example 2: UI redesign

**User**: "帮我写个 goal，重做这个页面"

**Clarified**:
- Task: 用 shadcn 组件库重做 OpsView 页面
- Done: 页面在 3 个断点下视觉一致，所有交互有 hover/focus/active 状态，通过 tsc 类型检查
- Constraints: 不改变现有 API 接口，使用项目已有的 Tailwind 配置
- Agent: Claude Code

**Output**:
```
Goal: 用 shadcn/ui 组件库重做 OpsView 页面

Completion criteria:
- [ ] 所有组件替换为 shadcn/ui 等价组件
- [ ] 页面在 375px / 768px / 1440px 断点下无溢出、无错位
- [ ] 所有可交互元素有 hover、focus、active 状态
- [ ] `tsc --noEmit` 0 errors
- [ ] 页面加载后无 console error

Constraints:
- 不修改 apps/web/src/api-client/ 下的任何文件
- 使用项目已有的 Tailwind 主题配置
- 不引入新的 npm 依赖（shadcn 除外）

Context:
- 当前页面：apps/web/src/views/OpsView.tsx
- UI 组件：apps/web/src/components/ui/index.tsx
- 样式：apps/web/src/styles.css
```

---

## Special Rules

- **Never skip Phase 1 question #3.** If the user can't define "done", the goal will fail. Help them brainstorm.
- **One verifiable condition per checkbox.** Don't combine multiple conditions into one line.
- **Constraints are your friend.** They prevent the agent from "optimizing" unrelated files or introducing breaking changes.
- **If the task is too large for one goal**, suggest breaking it into 2-3 smaller goals with clear handoffs.
- **For research/analysis goals** (no code changes), the completion criterion is "output a report with specific sections".