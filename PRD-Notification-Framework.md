# PRD：Meeting Follow-up 通知框架

> 本文档是**框架性 PRD**，定义两类邮件的职责边界、推送机制、页面结构和设置项。视觉细节以 `Meeting Follow-up Notifications.dc.html` 为准；设计师可基于本框架对 prototype 做二次修改。

## 1. 背景

一场会议结束后，ZoomMate 会产出 follow-up items（extracted task / inferred task / suggested workflow）。因为生成结果消耗算力，**生成动作在本期是手动的**：通知负责三件事——告诉用户有什么在等他、他一直没开始时提醒他、生成完之后把产物直接送到他面前。

---

## 2. 两类邮件与责任边界（核心）

这是本期最重要的一个决定：**我们不做深耦合，只做浅耦合**。

| | ZoomMate task emails | Workflow task emails |
|---|---|---|
| 覆盖状态 | New · Not-started reminder · Action required · Completed · Failed | 仅 **New/suggested**（作为 ZoomMate New 邮件里的一个 item 类型出现） |
| 谁来发 | **我们** | New/suggested 部分由**我们**发；一旦某个 workflow 进入 review / completed / failed，由 **Workflow 自己发**，不经过我们 |
| 谁定样式 | 我们 | 我们定义"参考样式"（shell、卡片规范），Workflow 按同一套视觉语言自行实现，不要求逐字节复用我们的组件 |
| 为什么这样切 | — | 二者触发源不同：我们是"会后 N 分钟没读"这种**时间触发**；Workflow 内部状态变化是**事件触发**。硬要在我们的时间触发里等它的事件状态，会导致过时/冲突。解耦后各自对自己的实时性负责 |

**落地含义**：
- Workflow 如果以后想要为自己的 review/completed/failed 状态发通知，那是他们自己的产品决策和实现，我们不阻塞、也不需要在本系统里预留"发送 Workflow 完成通知"的开关。
- 我们的 "Workflow task emails" 这个 tab（prototype 里）只是给 Workflow 团队看的**样式参考**，不是我们要发的邮件清单。

---

## 3. 推送机制（Send Trigger Rules）

### 3.1 统一规则：生成完成 → 当下检查是否已读 → 未读才发
不用固定等待时长（例如原来讨论过的"等 10 分钟"）。只要有新内容产出（无论是会后自动产出的 follow-up 列表，还是用户手动点击 Generate 后的结果），**在产出的那一刻**立刻检查用户是否正在看它：
- 用户已经切走 / 没在界面上 → **立即发**，不等。
- 用户就停留在界面上、正在看 → 不发，因为他已经看到了。

好处：同一套逻辑覆盖"会后自动产出"和"用户手动触发"两种场景，不需要为每种场景单独定义等待时长。

### 3.2 各状态的触发规则

| 状态 | 触发条件 | 发送对象范围 |
|---|---|---|
| **New** | 会后 follow-up 列表就绪的那一刻，用户不在界面上看 | 只包含**尚未触发生成**的任务和 workflow。不展示 in-progress、不展示已完成结果——这个邮件的目的是让用户点开始，不是汇报状态 |
| **Not-started reminder** | 会议结束后 3 小时，用户仍未生成任何一项 且 未打开过列表 | 同上，只列未触发项。到 9:00 AM（用户时区）为最后一次提醒，此后不再发；背靠背会议合并成一封 |
| **Action required** | 某任务需要用户回答问题才能继续，问题就绪即发（不做"已读判断"的延迟，直接发） | 单个任务 |
| **Completed** | 单个任务/workflow 产出结果的那一刻，用户不在界面上看 | 单个任务，一个任务一封（不聚合多个任务的完成通知） |
| **Failed** | 出错的那一刻发 | 单个任务 |

### 3.3 待确认（Open）
- ZoomMate 是否能把 error 状态实时读给我们，用于触发 Failed —— 需要工程确认。
- Workflow 目前**没有**为 completed/failed 发送通知；这不是我们要补的缺口，按第 2 节的解耦原则，等 Workflow 自己决定要不要发。

---

## 4. 页面结构 / Tab Mapping

Prototype 左侧导航共 5 个 tab，职责如下：

| Tab | 内容 | 是否为交付物 |
|---|---|---|
| ZoomMate task emails | 5 种状态邮件（New / Reminder / Action required / Completed / Failed） | ✅ 交付物 |
| Workflow task emails | Workflow 状态邮件的样式参考（见第 2 节） | 仅供参考，非我们发送的邮件 |
| Client settings | My Notes › Settings › Notifications，用户自己的开关 | ✅ 交付物 |
| Admin settings | Web Portal › Account Settings › My Notes › Notification，账号级开关 | ✅ 交付物 |
| HITL mapping | ZoomMate human-in-the-loop 各种 JSON 状态 → Action required 邮件的映射参考 | 仅供工程实现参考，非独立页面 |

---

## 5. ZoomMate task emails 状态详情

### 5.1 New — "N follow-ups waiting for you"
只列未触发项（任务 + workflow），无分组标签（不区分 extracted/inferred/suggested，用户不需要感知这个区别）。Footer：**Open follow-ups**。

### 5.2 Not-started reminder
同上内容，姿态更像提醒。Footer：**Get my follow-ups**（一键全部生成）+ **Open follow-ups**。

### 5.3 Action required
- Subject + 一句话说明需要几个回答。
- **不做可交互表单外观**（HTML 邮件没有 JS，表单填不了）。展示形式二选一：
  (a) 纯文本列出问题（安全，但不够精美）
  (b) 只读预览，视觉上像表单但禁用（更好看，但有误导用户"可以在这里填"的风险）
  当前 prototype 用的是 (b)，**需要和工程一起测试**用户是否会误以为可以直接填写；如果风险偏大，回退到 (a)。
- 唯一 CTA：**Review and continue**，跳转到 Zoom 内完成真正的填写。

### 5.4 Completed
- **卡片标题永远是任务本身的标题**（和 New 邮件里出现的标题一致），不要换成产物的名字——这是本期明确的一个易混淆点，已核实过。
- 产物展示在任务行下方，按产物类型分：message / email / doc / **纯文字回答（新类型）**。
  - 新类型说明：有些任务本身就是"回答一个问题"（例如"确认 workflow 是否改名"），agent 找到答案后不产出任何新文件，只是回话 + 可能附一个来源链接（原文，不是它生成的）。这种情况展示为一段纯文字 + 可选的"查看来源"链接，不套用 message/doc 卡片的按钮逻辑（没有 Open chat / Open doc，因为没有对话或文档要打开）。
  - 多产物（如同时产出 doc + sheet）→ 一个任务行 + 多个产物区块堆叠，不合并成一个区块。
  - 无 Copy 按钮（静态 HTML 邮件没有剪贴板能力）。

### 5.5 Failed
Subject 说明失败原因，Footer：**View details**。

---

## 6. Client Settings（My Notes › Settings › Notifications）

我们负责，覆盖 ZoomMate 和 Workflow 两类邮件的用户侧开关，但**用户不需要分别设置**——一套开关统一控制。

- 顶层 Email 总开关。
- "Email me about" 四个状态勾选：New follow-ups / Action required / Completed / Failed。**没有单独的 "Not-started reminder" 开关**——reminder 挂在 New follow-ups 这个偏好和第 3 节的发送规则上，不单独暴露。
- **没有 "bundle per meeting" 选项**——讨论后决定去掉，避免过度设计。
- Chat apps 区块：Zoom Team Chat 有真实开关；Slack / Microsoft Teams 只读状态 + 跳转到对应 app 内管理，不在此处提供开关（因为权限收敛在对应平台的 bot 授权里，这里给不了真实控制）。

---

## 7. Admin Settings（Web Portal › Account Settings › My Notes › Notification）

我们负责。复用现有 "Enable email notifications for My Notes" 大开关，在它下面新增两个子勾选（而不是新开一个独立开关区块）：

- **Meeting summary in My Notes**（已有功能）
- **Follow-ups in My Notes**（新增，`NEW · P0` 标记）

**不做**账号级别的"逐状态"控制（即不做"这个账号只能收 Completed，不能收 Action required"这种颗粒度）——讨论后认为会显著增加复杂度、且用户侧已经有状态勾选了，管理员只需要控制"允许/不允许 follow-up 邮件"这个大开关即可。

---

## 8. 待与设计师讨论的设计问题

这两点是产品逻辑已经明确、但**具体视觉呈现还没定**的地方，需要设计师在本框架基础上做探索，而不是直接照搬现有 prototype 的样子。

### 8.1 Not-started reminder 的"鼓励引导"设计
用户会后没有手动点 Generate Follow Ups 时，我们推一封提醒邮件，目的很单一：**鼓励他点击 "Get my follow-ups"**。

- 邮件里展示的任务列表内容，本质上是**示意性质的（假数据）**——因为用户还没生成任何东西，我们展示的是"这类会议通常会有的任务长什么样"，不是这场会议真实算出来的结果。可以类比成一个"广告页"式的呈现：目的是让用户觉得"点一下就能拿到这些"，而不是精确汇报当前状态。
- 需要设计师专门想一想这个"引导态"要怎么设计——文案、视觉、要不要弱化"这是任务列表"的既视感、强化"一键搞定"的诱惑力，都还没有定论。当前 prototype 里的样子（跟 New 邮件用同一套任务卡片）只是占位，不代表最终方向。

### 8.2 Completed 里"任务卡片"与"全部产物"的结合方式
产品逻辑已经明确：Completed 邮件既要有可点击查看详情的**任务卡片**（task card，点了跳转到任务详情/对话），也要把**这个任务产出的所有产物**都展示出来，用户可以直接点击跳转去看每个产物。

- 目前 prototype 的处理方式是"任务卡片在上、产物区块在下、依次堆叠"，但这只是一种可能的组合方式。
- 需要设计师探索：任务卡片和产物区块到底应该是什么关系——并列、主次、还是有别的组织方式？尤其是产物数量变多（比如同时有 doc + sheet + message）时，怎么让"这是同一个任务的产出"这件事不会散掉、同时又不会因为堆叠太多区块让邮件显得臃肿。

---

## 9. 开放问题 Checklist

- [ ] ZoomMate 能否实时暴露 error 状态给我们（决定 Failed 能否可靠触发）
- [ ] Action required 的只读表单预览 vs 纯文本列表，需要可用性测试后二选一
- [ ] Workflow 是否/何时会自建 completed·failed 通知——待他们自己的产品节奏，我们不阻塞
- [ ] "纯文字回答"类型的 Completed 卡片视觉细节，需要设计师基于本框架补充 prototype
- [ ] 见第 8 节：Not-started reminder 的鼓励引导设计、Completed 里任务卡片与产物的结合方式
