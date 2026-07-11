# Agent Skills Lifecycle

一套面向 AI coding agent 的工程技能包：把「模糊想法」推进到「可验证交付」。

核心来自 [mattpocock/skills](https://github.com/mattpocock/skills) v1.1，并补上本地扩展 **`to-goal`**（依赖 `goal-crafter`），把 ticket 编译成可粘贴的执行目标。

## 主流程

```text
想法
  │
  ├─ 普通规模 ──► /grill-me（或 /grill-with-docs）
  │                    │
  │                    ▼
  │               /to-spec ──► /to-tickets ──► /to-goal ──► 新会话 /implement
  │                                                              │
  │                                                              ▼
  │                                                         /code-review
  │
  └─ 超大/看不清路线 ──► /wayfinder ──►（路线清晰后）汇入 /to-spec 或直接 /implement
```

支撑技能：`/research`、`/prototype`、`/tdd`、`/handoff`、`/triage`。

### 一步步怎么用

1. **仓库初始化（每个项目一次）**  
   跑 `/setup-matt-pocock-skills`：配置 issue tracker、triage 标签、domain docs 布局。

2. **把想法烤清楚**  
   `/grill-me`：对计划/设计做高压访谈。  
   `/grill-with-docs`：访谈时同时沉淀文档。  
   事实能查代码就查；决策必须问人。

3. **写成 spec**  
   `/to-spec`：把当前对话综合成 spec（以前叫 PRD），发布到 tracker，标成 agent-ready。

4. **拆成 ticket**  
   `/to-tickets`：按 tracer-bullet 竖切，每个 ticket 声明阻塞关系。  
   本地 tracker 写成有序 `tickets.md`；GitHub 等可变成原生 blocking links。

5. **编译成执行 goal（本仓库扩展）**  
   `/to-goal`：只读取证，输出一份可粘贴的 verifiable goal（当前状态、完成标准、约束）。  
   默认一次只处理一个 frontier ticket；`--all` 仅在明确要求跨 ticket 时使用。

6. **新会话实现**  
   清上下文后 `/implement`，尽量走 `/tdd`，结束前 `/code-review`，再提交。

7. **超大任务走 wayfinder**  
   一次会话装不下、路线还在雾里时用 `/wayfinder`：在 tracker 上画调查地图，逐个做决策（不是交付物），雾散后再进主流程。

## 技能一览

### 主链路

| Skill | 作用 |
|-------|------|
| `setup-matt-pocock-skills` | 为仓库配置 tracker / triage / domain docs |
| `ask-matt` | 入口路由：按场景指向正确技能 |
| `grill-me` | 启动高压访谈 |
| `grilling` | 访谈引擎本身 |
| `grill-with-docs` | 访谈 + 文档沉淀 |
| `wayfinder` | 超大任务的共享决策地图 |
| `to-spec` | 对话 → spec |
| `to-tickets` | spec/计划 → 带阻塞边的 tickets |
| `to-goal` | ticket/frontier → 可验证执行 goal |
| `goal-crafter` | goal 格式与完成标准规则（`to-goal` 依赖） |
| `implement` | 按 spec/ticket 实现 |
| `code-review` | Standards + Spec 双轴评审 |
| `tdd` | 测试驱动实现 |
| `research` | 高可信源调研 |
| `prototype` | 一次性原型验证逻辑或 UI |
| `handoff` | 会话交接，避免重复已有产物 |
| `triage` | 外来 issue 状态机分流 |

### 工程辅助

| Skill | 作用 |
|-------|------|
| `codebase-design` | 代码结构设计讨论 |
| `diagnosing-bugs` | 系统化排错 |
| `domain-modeling` | 领域建模与 CONTEXT/ADR |
| `improve-codebase-architecture` | 架构改进分析 |
| `resolving-merge-conflicts` | 合并冲突处理 |

## 安装

复制到你的 agent skills 目录，或用 skills CLI（若已配置）：

```bash
npx skills@latest add tt-a1i/agent-skills-lifecycle
```

本仓库技能位于 `skills/`。若你使用统一目录（如 `~/.agents_skills/`），可直接把需要的子目录拷过去。

首次在目标仓库使用工程技能前，请运行：

```text
/setup-matt-pocock-skills
```

## 来源与许可

- Matt 原版技能：© [Matt Pocock](https://github.com/mattpocock/skills)，MIT
- 本仓库扩展：`to-goal`、`goal-crafter`
- 整体以 MIT 许可发布；使用 Matt 技能时请保留其版权与许可声明

## 版本说明

对齐 mattpocock/skills **v1.1** 主流程命名：

- `to-prd` → `to-spec`
- `to-issues` → `to-tickets`
- 新增 `wayfinder`
- 本仓库在 `to-tickets` 与 `implement` 之间插入 `to-goal`
