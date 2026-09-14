# Goal design

### Phase 1 — Clarify the task

Run this phase only in standalone mode. In compiled-handoff mode, extract the five answers from the upstream evidence without asking questions.

Use the request, current conversation, and relevant workspace facts to fill these five fields. They are an information checklist, not five mandatory user questions. If a necessary decision remains missing, ask a concise question about that decision and give a recommendation when useful.

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

**Phase 1 complete when** the task, target, completion criteria, constraints, and harness are sufficiently defined to draft. Use a generic harness format when none is required; mark non-applicable fields rather than creating extra questions. If completion is unclear, propose observable criteria for the user's decision.

### Phase 2 — Draft the goal

Write the goal in the target agent's format. Follow these rules:

The three shapes below are the formats this skill deliberately maintains for the harnesses it is most often pointed at. They are a snapshot, not a standard: when the target harness documents a different shape, follow the harness and treat the block here as the fallback. Any harness not listed uses the generic block.

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
Objective: [requested autonomous work]
Completion and evidence: [observable result and how to verify it]
Scope and stopping conditions: [authorized bounds and genuine blockers]
Workspace: [known project context, if needed]
```

This is a task brief, not an automation API schema. When the user also requests scheduling, use the current native automation tool and its supported fields. Reuse the supplied timing and goal; ask only about unresolved choices needed to create the schedule. A written brief is not evidence that an automation exists.

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

Repair a weak criterion using the available task evidence first. In standalone mode, ask only when a necessary product or completion decision remains missing. In compiled-handoff mode, report the missing evidence to the source rather than reopening the planning interview.

### Phase 4 — Deliver

For a goal-only request, return the usable goal prompt. When scheduling was also requested, create or update it through the native tool and report the confirmed result. Do not imply that a draft prompt has already started execution.

In compiled-handoff mode, the upstream workflow owns the delivery wrapper; return the goal and evidence in its requested format.

---

## Examples

下面两个示例里的仓库名、目录结构和文件路径都是占位符，不代表任何真实项目的约定。真正产出的 goal 必须写目标仓库**当前**的真实路径，不要照抄这里的形状。

### Example 1: Code review automation

**User**: "帮我写个 goal，自动审查 PR"

**Clarified**:
- Task: 审查当前分支相对于 main 的所有改动
- Where: 当前工作仓库
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
- 项目背景：<一句话说明这个仓库是什么>
- 设计 spec：<仓库内的设计文档>
```

### Example 2: UI redesign

**User**: "帮我写个 goal，重做这个页面"

**Clarified**:
- Task: 用 shadcn 组件库重做目标页面
- Done: 页面在 3 个断点下视觉一致，所有交互有 hover/focus/active 状态，通过 tsc 类型检查
- Constraints: 不改变现有 API 接口，使用项目已有的 Tailwind 配置
- Agent: Claude Code

**Output**:
```
Goal: 用 shadcn/ui 组件库重做目标页面

Completion criteria:
- [ ] 所有组件替换为 shadcn/ui 等价组件
- [ ] 页面在 375px / 768px / 1440px 断点下无溢出、无错位
- [ ] 所有可交互元素有 hover、focus、active 状态
- [ ] `tsc --noEmit` 0 errors
- [ ] 页面加载后无 console error

Constraints:
- 不修改 API 客户端目录下的任何文件
- 使用项目已有的 Tailwind 主题配置
- 不引入新的 npm 依赖（shadcn 除外）

Context:
- 当前页面：<页面组件文件>
- UI 组件：<组件库入口文件>
- 样式：<全局样式入口>
```

---

## Special Rules

- **Always establish completion criteria.** Reuse criteria already supplied; ask only when a necessary completion decision is missing.
- **Never re-interview in compiled-handoff mode.** Approved evidence already owns clarification and product decisions; missing evidence means the source is not agent-ready.
- **One verifiable condition per checkbox.** Don't combine multiple conditions into one line.
- **Constraints are your friend.** They prevent the agent from "optimizing" unrelated files or introducing breaking changes.
- **If the task is too large for one goal**, suggest breaking it into 2-3 smaller goals with clear handoffs.
- **For research/analysis goals** (no code changes), the completion criterion is "output a report with specific sections".
