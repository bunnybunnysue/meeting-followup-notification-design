# Handoff: Meeting Follow-up Notifications

## Overview
Notification design for **meeting follow-ups in My Notes**. A meeting produces follow-up items — *extracted tasks* (pulled from what was said), *inferred tasks* (implied by the discussion), and *suggested workflows*. Because generating a result costs compute, generation is **manual at launch**: notifications tell the user what is waiting, nudge them if they never start, and — once something is generated — deliver the artifact itself (message, email, doc) so it can be opened, copied, or sent from the notification.

The package covers five surfaces:
1. **ZoomMate task emails** — New / Not-started reminder / Action required / Completed (5 variants, plus a multi-artifact variant) / Failed
2. **Workflow task emails** — Action required / Completed / Failed
3. **Client notification settings** — My Notes > Settings > Notifications
4. **Admin (Web Portal) settings** — Account Settings > My Notes > Notification, plus the ownership rationale
5. **HITL mapping** — reference only, not a deliverable screen: how any ZoomMate human-in-the-loop status degrades into surface #1's "Action required" email. See section 9.

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes that show intended look, copy, and behavior. They are **not production code to copy**. The task is to **recreate these designs in the target codebase's existing environment** (React, Vue, native, or the real email-template pipeline) using its established components and patterns. If no environment exists yet, pick the most appropriate framework and implement there.

Note especially: the email variants are rendered here as *web* cards for review. Real delivery is HTML email — expect to re-express the layouts with table-safe/email-safe markup, inline styles, and raster or hosted icons rather than CSS masks.

## Fidelity
**High fidelity.** Final colors, typography, spacing, copy, and states. All color values come from the Zoom Prism Design System 2.5 token package (`tokens.css`, included). Recreate pixel-for-pixel using the codebase's Prism components where they exist; use the token names, not the resolved hex values, wherever the target has the tokens available.

---

## Screens / Views

Shell (prototype chrome only — **not part of the deliverable**): 236px left nav listing the four tabs, content area on `--background-bg-darker-neutral`, content column `max-width:720px` (settings tabs 680px / 760px), `padding:36px 32px 96px`, `gap:24px` between email cards.

### Common email card anatomy
- Card: `background:var(--background-bg-default)`, `border-radius:16px`, `box-shadow:var(--drop-shadow-sm)`, `overflow:hidden`, `flex-shrink:0`.
- Mail header strip: `padding:12px 24px`, bottom hairline `1px solid var(--border-subtle-neutral)`; left `Zoom <notifications@zoom.us>` and right timestamp, both 12px `--text-neutral`.
- Body: `padding:24px`, `display:flex; flex-direction:column; gap:16px`.
- Subject line: 17px/22px, weight 600, `--text-stronger-neutral`, followed inline by a status pill.
- Status pill: 11px/500, `padding:3px 9px`, `border-radius:999px`.
  | Status | Background | Text |
  |---|---|---|
  | New | `--fill-subtler-informative` | `--text-informative` |
  | Reminder | `--fill-subtler-complementary` | `--text-complementary` |
  | Action required | `--fill-subtler-warning` | `--text-warning` |
  | Completed | `--fill-subtler-success` | `--text-success` |
  | Failed | `--fill-subtler-error` | `--text-error` |
- Meeting meta line: 13px/18px `--text-neutral`, `margin-top:-8px` (tightens to the subject). Format: `Product Roadmap Sync · Jul 28, 2026 · Hosted by Sarah Chen`.
- Body paragraph: 14px/21px `--text-strong-neutral`.
- Footer buttons: primary `height:36px; padding:0 18px; border-radius:12px; background:var(--fill-global-primary); color:#fff; 14px/500`; secondary same metrics with `background:var(--background-bg-default)` + `1px solid var(--border-subtle-neutral)` and `--text-stronger-neutral`.

### 1. New — "4 follow-ups waiting for you"
Purpose: tell the user what a meeting produced. **Only items that have not been generated yet appear.** No in-progress rows, no results, no View result.

Subject: `Product Roadmap Sync: 4 follow-ups waiting for you` + New pill.
Body: "Nothing has been generated yet. Open the list and pick the ones you want ZoomMate to write."

Item rows (`gap:10px` column). Each row: `border:1px solid var(--border-subtle-neutral)`, `border-radius:14px`, `padding:14px 16px`, column `gap:12px`.
- Header line: `display:flex; align-items:center; gap:12px` — 36px circular icon chip (`border-radius:999px`, tinted background, 17–18px glyph) · title 15px/20px weight 500 `--text-stronger-neutral` with type label beneath at 13px/18px `--text-neutral` · right-aligned pill action button (`height:34px; padding:0 14px; border-radius:999px; 13px/500`, 14px leading icon).
- Detail: ZoomMate items show a **prompt box** — caption "Prompt to be sent" (12px `--text-neutral`), then a `border-radius:12px` bordered box: prompt text `padding:12px 14px`, 13px/19px `--text-strong-neutral`; footer row `padding:10px 14px` with a top hairline, right-aligned "Customize prompt" link (13px/500 `--text-primary`, 13px Edit icon). Workflow items show a one-line description instead, 13px/19px `--text-strong-neutral`.

The four items:
| Icon chip | Title | Type label | Action |
|---|---|---|---|
| `--fill-subtler-primary` + Tasks (`--icon-primary`) | Confirm the pricing update owner with Sarah Chen | Extracted task | Generate (SmartSummary icon) |
| `--fill-subtler-supplementary1` + Chat (`--icon-supplementary1`) | Send the client a thank-you message with next steps | Inferred task | Generate |
| `--fill-subtle-neutral` + GoogleDocs (color glyph) | Meeting Summary to Google Docs | Suggested workflow | Run (PlayFill icon) |
| `--fill-subtle-neutral` + GoogleDrive | Save meeting notes to a shared Drive folder | Suggested workflow | Run |

A 13px `--text-neutral` divider label "Suggested workflows" separates the two groups (`margin:6px 0 0 2px`).
Footer: **Open follow-ups** (primary) · **Generate all** (secondary).

### 2. Not-started reminder
Purpose: nudge a user who never generated anything. Subject: `4 follow-ups from Product Roadmap Sync are still waiting` + Reminder pill. Body: "You haven't generated anything from this meeting yet. Generating is manual for now, so these stay untouched until you start them. Pick one, or generate all four at once."

Compact list — one row per item, `padding:12px 0`, top hairline on each row, `gap:12px`: 36px icon chip · title 14px/19px weight 500 + type label 12px/17px `--text-neutral` · **Generate** pill button.
Footer: **Generate all** (primary) · **Open follow-ups** (secondary).

**Reminder schedule** (documented in the prototype as a white spec card; implement as the actual send rules):
| Step | Rule |
|---|---|
| First email | ~10 min after the follow-up list is ready (the "waiting for you" email) |
| Reminder | 3 hours after the meeting ends, if nothing generated and the list still unopened |
| Last reminder | 9:00 AM next working day, user's time zone. Nothing after that |
| Never sent when | the user opened the list, generated or dismissed anything, the meeting produced no follow-ups, or a reminder for that meeting already went out |
| Batching | back-to-back meetings are combined into the single 9:00 AM reminder, grouped by meeting |

### 3. Action required
Subject: `Confirm action items with Sarah Chen` + Action required pill. Body: "ZoomMate needs two answers before it can confirm the action items. Here's what it will ask:"

A **read-only preview** of the form the user will complete in Zoom — pure presentation, nothing interactive in the email.
- Wrapper `border:1px solid var(--border-subtle-neutral); border-radius:14px`. Header strip `padding:12px 16px` + bottom hairline: 13px LockLocked icon (`--icon-neutral`) + "Preview of what ZoomMate will ask you — answer it in Zoom" (12px `--text-neutral`).
- Content `padding:16px`, column `gap:18px`.
- Radio question "Who owns the pricing update?" (14px/19px weight 500): selected option `border:1px solid var(--border-primary)`, `background:var(--fill-subtler-primary)`, `border-radius:10px`, `padding:9px 12px`, 15px dot with `4.5px solid var(--fill-primary)` ring; unselected uses `--border-subtle-neutral` + white and a `1.5px solid var(--border-neutral)` ring.
- Date field "Due date": 38px row, 10px radius, Calendar icon, value `Aug 8, 2026`, trailing "suggested" (12px `--text-neutral`).
- Optional textarea "Anything to add before it sends?" with "Optional" right-aligned; `min-height:64px`, placeholder "Add context for Sarah…" in `--text-neutral`.
Footer: **Review and continue** (primary).

### 4. Completed — five variants
Every completed email pairs **the task card** (so the user can jump back to the conversation) with **the artifact itself** (so it can be opened, edited, copied, or sent).

**Task card** — `border:1px solid var(--border-subtle-neutral); border-radius:14px; padding:14px 16px; display:flex; align-items:center; gap:12px`: 36px icon chip · title 15px/20px weight 500 + sub 13px/18px `--text-neutral` (meeting name only — no "extracted/inferred" type label; users never see that distinction) · a single **View result** button (replaces the older separate "Open task" link + status pill combo, which duplicated the subject line's own status pill).

**Result panel** — `border:1px solid var(--border-subtle-neutral); border-radius:14px; overflow:hidden`:
- Header `padding:10px 14px` + bottom hairline: 14px type icon (`--icon-neutral`) + label 12px `--text-neutral`.
- Content `padding:14px`, column `gap:10px`; artifact text 14px/20px `--text-stronger-neutral` (this is the editable product, rendered from the markdown the task returns).
- Action bar `padding:10px 14px` + top hairline, `gap:8px`, wrapping: one primary pill (`height:34px; border-radius:999px; 13px/500`, 14px leading icon). **No Copy button** — plain HTML email has no JS/clipboard API, so Copy can't actually function once this is a real email; every panel has exactly one primary action that deep-links out.

| Variant | Task | Result panel label | Primary action |
|---|---|---|---|
| a. Message, recipient known | Confirm the pricing update owner with Sarah Chen | Message · to Sarah Chen | **Open chat with Sarah Chen** |
| b. Message, recipient unknown | Send the client a thank-you message with next steps | Message · recipient not identified | **Choose which chat to open** (Search icon, opens the existing contact picker with the message attached) |
| c. Two recipients | Confirm the launch dates with Sarah and Marcus | Two panels: "Message 1 of 2 · to Sarah Chen", "Message 2 of 2 · to Marcus Webb" | each: **Open chat with <name>** |
| d. Email draft | Send a recap email to the Design team | Email · draft, not sent | **Open in Mail** |
| e. Document | Generate summary with Short General Template | Product Roadmap Sync — summary (doc title, no separate "Document ·" header — avoids naming the same artifact twice) | **Open Docs** |

Variant d's panel starts with a field block (`gap:6px`, bottom hairline, `padding-bottom:10px`): label column `width:52px`, 12px `--text-neutral`; values 13px/18px `--text-stronger-neutral` (Subject in weight 500). To `design-team@acme.com`; Cc `sarah.chen@acme.com, marcus.webb@acme.com`; Subject "Roadmap sync recap — three Q3 bets and owners". Body follows as paragraphs with bolded owners.
Variant e's panel is just a 16px ZoomDocs glyph (`--icon-primary`) + doc title 14px weight 500 + the summary paragraph + the button — no header strip above it. The doc link/id must be returned by the generating service so the card can point straight at it.

**Rules behind the variants** (carry these into implementation):
- One artifact per card; two artifacts → two cards, never one card with two blocks (see 4b).
- Multiple recipients → split into N messages/cards, each with its own jump. No group creation, no de-duplication.
- Never auto-send and never guess a recipient. Unknown recipient falls back to the contact picker, not a guess.
- Channels, @-mentions, thread replies, new group chats: out of scope this round.
- No Copy button anywhere in these emails — see the action-bar note above.

### 4b. Completed — multiple artifact types from one task
When a task returns more than one kind of artifact (e.g. a doc and a spreadsheet), use **one task card** followed by **one result panel per artifact type**, stacked — never merge two artifacts into a single panel. Same shell as the five variants above; each panel keeps its own single-purpose button (`Open doc`, `Open sheet`) rather than a shared "Open" action.

### 5. Failed
Subject: `Send recap email couldn't finish` + Failed pill; body names the reason ("The recipient address for the Design team couldn't be resolved, so nothing was sent."); footer **View details** (primary) → full error + retry in the Follow-ups panel.

### 6. Workflow emails
Same shell and tokens, two states only — **Completed** (task card + result summary line at `padding-left:48px`, sourced from `payload.summary`), **Failed** (reason from `payload.errorReason`, footer View details). Attaching is a process state and sends nothing.

**No Action required state here.** When a workflow run needs review, that notification is sent by Workflow itself, not by this meeting-follow-up system — don't build it in this surface.

### 7. Client settings — My Notes > Settings > Notifications
Column `max-width:680px`, `gap:20px`. Breadcrumb 12px `--text-neutral`; H1 20px/26px weight 600; description 14px/20px `--text-neutral`: "Choose how you hear about follow-ups from your meetings — tasks pulled from what was said, tasks inferred from the discussion, and workflows suggested for the meeting. The list itself always stays in My Notes."

**Email card**
- Header row `padding:16px 20px`: "Email" (15px/500) + sub "Sent about 10 minutes after a task appears, if you haven't opened it." (13px/18px `--text-neutral`) + switch.
- Switch: `36×20`, `border-radius:999px`, on `--fill-global-primary` / off `#c9ced4`; 16px white knob, `left:2px → 18px`, `transition:left 140ms ease-out`.
- Status block (top hairline, `padding:14px 20px 18px`): caption "Email me about" (13px `--text-neutral`), then 4 checkbox rows, `gap:12px`. Checkbox 16px, `border-radius:4px`; checked `--fill-global-primary` + 11px white tick; unchecked white + `1.5px solid var(--border-neutral)`; disabled uses `#a9b2bb` / `#d5dade`. Label 14px/19px `--text-stronger-neutral`, hint 12px/17px `--text-neutral`.
  | Label | Hint |
  |---|---|
  | New follow-ups | Tasks pulled from what was said, tasks inferred from the discussion, and workflows suggested for the meeting |
  | Action required | A follow-up needs your input before it continues |
  | Completed | A follow-up finished and produced a result |
  | Failed | A follow-up stopped with an error |

  Note: the "Not-started reminder" email (screen 2) is **not** its own checkbox. It rides on the "New follow-ups" preference and the send-rule schedule in section 2 above — deliberately not exposed as a separate user-facing toggle.
- When the account has follow-up emails off: card at `opacity:0.6`, switch disabled (`cursor:not-allowed`), status rows at `opacity:0.5`, and hovering the header shows a dark tooltip (`background:var(--text-stronger-neutral)`, `#fff` 12px/16px, `padding:8px 10px`, `border-radius:8px`, `max-width:280px`, `--drop-shadow-md`): "Follow-up emails are turned off for your account. Ask your admin to enable them in My Notes notification settings."
- There is **no** "bundle per meeting" control.

**Chat apps card**
- Header: "Chat apps" + sub "Uses the same statuses you picked above. Slack and Teams are delivered by the Zoom bot, so they're switched on inside those apps." + parent switch (user intent).
- Three rows, hairline between: **Zoom Team Chat** — real switch (Zoom owns that bot). **Slack** and **Microsoft Teams** — no switch; a read-only state chip (Connected: `--fill-subtler-success`/`--text-success`; Not connected: `--fill-subtle-neutral`/`--text-neutral`; 12px/500, `padding:4px 10px`, pill) plus a link "Manage in <app> ↗" / "Set up in <app> ↗".
- Footnote 12px/18px `--text-neutral`: client switches express intent; the admin switch and the bot's install state express permission — both must be true.

### 8. Admin settings — Web Portal > Account Settings > My Notes > Notification
Column `max-width:760px`. Recommendation copy: reuse the existing **Notification** section; no new switch — follow-ups become a checkbox under the email switch already there, beside the summary email, inheriting the same lock affordance and account → group → user model.

Settings card (`overflow:hidden`, section header strip `background:var(--fill-subtle-neutral)`, `padding:10px 20px`, 13px/600 "Notification"):
1. **Enable desktop notifications for My Notes** — existing, `opacity:0.55`, right-side "unchanged".
2. **Enable email notifications for My Notes** — existing switch, extended. Sub: "Existing setting, extended. Comments, mentions, and permission requests are unchanged; the two checkboxes below decide which of the new My Notes emails this account allows." Right side: switch + 15px LockLocked glyph. Two child checkboxes (`gap:12px`, dim to `opacity:0.5` when the switch is off):
   - **Meeting summary in My Notes** — "The post-meeting summary email."
   - **Follow-ups in My Notes** — badge `NEW · P0` (10px/600 pill, `--fill-global-primary`, `#fff`) — "Emails about follow-up tasks and suggested workflows generated by ZoomMate and Workflow. Users choose which statuses they want in the client."
   There is **no** admin control over which statuses a user receives.
3. **Enable IM notifications for My Notes** — `P1` badge (neutral pill). Parent switch for all chat channels + three child checkboxes (Zoom Team Chat, Slack, Microsoft Teams) noting that Slack/Teams delivery is gated by the Zoom bot in Zoom Marketplace.

Rationale card ("Why here, and how it resolves") states the send condition: **admin checkbox for that kind is on AND the user's client switch is on AND (for chat apps) the bot is installed and authorized.** Admin off leaves client controls visible but grayed with a hover explanation. Slack/Teams: Zoom owns *intent* (whether follow-up cards go to chat, and which statuses); Ecosystem owns *permission and delivery* (Marketplace org enable, per-user authorization inside Slack/Teams, bot drops events from unauthorized users) — so My Notes must not show a Slack/Teams on/off switch.

### 9. HITL mapping — reference tab, not a deliverable screen
ZoomMate's human-in-the-loop tool can hand back many different `spec` shapes (plain confirm, form, table, auth prompt, batched permissions…). **Do not parse or re-render `spec.fields` / `spec.actions`** — that couples the email to a protocol we don't own, and the protocol is expected to keep changing. Every one of these renders through the *same* "Action required" email layout from section 3, populated from four stable sources only:

| Email piece | Source | Fallback if missing |
|---|---|---|
| Subject | `spec.title` (truncate ~70 chars) | — always present |
| Body copy | `spec.subtitle` (truncate ~140 chars) | first `display`-type field's `content`, markdown stripped; if neither exists, generic copy: "ZoomMate needs a quick decision before it continues." |
| Extra one-line hint (optional) | a `table` field → row count ("N action items ready for review"); a `file_to_confirm` field → the file's `fileName` | omitted entirely if no such field |
| Button(s) | always one **Review and continue** deep link | + a second real button only for an action with `type: "link"` (its own `label`/`href`) |

Every other `spec.fields` type (`single_select`, `number`, `multi_select`, `textarea`, `file_upload`) and every other `spec.actions` type (`send`, `submit`, `browser_take_over`, plus any `menuActionIds` sub-menu) is **not rendered** — no matter how the in-app control works, it folds into the one Review and continue button, because none of them can execute from a static email.

One more collapsing rule: multiple specs sharing one `spec.meta.batch_id` send as a **single** "N items need your review" email (bullet list of each spec's `title`), not N separate emails.

Full worked examples, one per JSON shape ZoomMate currently produces, live in the prototype's "HITL mapping" tab — each card is tagged with the `part_id` of the source example it covers:

| part_id | What makes it distinct |
|---|---|
| `demo-simple-confirm` | Baseline case — title + a `display` field, nothing else |
| `demo-quick-reply` | No `subtitle` and no `display` field → generic fallback copy |
| `demo-schedule-meeting` | `display` field contains markdown (bold) → stripped, not rendered |
| `demo-confirm-deletion` | `display` field contains a markdown list → summarized as prose, not rendered as a list; primary action is `variant: "danger"` but the pill stays the standard warning color |
| `demo-browser-take-over` | Has a `type: "browser_take_over"` action → folds into Review and continue like any `send`/`submit` |
| `demo-file-to-confirm` | Has a `file_to_confirm` field → mention the filename only; copy can be non-English (spec sent Chinese here) and we don't translate it |
| `demo-mixed-form` | Heaviest form (6 fields incl. select/number/multi_select/textarea/file_upload) → still just the intro `display` line |
| `demo-confirm-table-basic` + `demo-confirm-table-multi-source` | Same table-degrades-to-count treatment; one card covers both (3 rows vs. 4 rows, different `subtitle`) |
| `demo-long-text` | `title` and `subtitle` both exceed the length a subject/body line can hold → truncation rule applies |
| `demo-connector-write-auth` | 6 actions, one with a `menuActionIds` sub-menu of 3 more — all `send`, none `link`, so all fold into one button |
| `demo-batch-command` + `demo-batch-file-write` + `demo-batch-connector-write` | Share one `meta.batch_id` → sent as a single grouped email, not three |
| `demo-auth-link-timeout` | Only case with an action of `type: "link"` → that one action gets its own real button ("Authorize"); the other two (`deny`, `allow-session`) are `send` and fold in |

---

## Interactions & Behavior
- Nothing in an email executes inline. Every action deep-links into the Follow-ups panel, a chat, Mail, or a doc.
- Prototype buttons open an explanatory modal (`460px`, `border-radius:16px`, `--drop-shadow-lg`, scrim `rgba(0,0,0,0.42)`) describing the real target — replace each with real navigation:
  | Action | Real behavior |
  |---|---|
  | Generate / Run | Opens the task in Follow-ups and starts it |
  | Generate all / Run all | Starts every not-yet-started item for the meeting |
  | Open follow-ups | Opens the Follow-ups tab with the list in its current state |
  | Customize prompt / Open task | Deep-links to the row in Follow-ups |
  | Open chat with <name> | Opens the 1:1 chat with the message pre-filled; nothing sent until the user sends |
  | Choose which chat to open | Existing contact picker, message attached |
  | Open in Mail | Zoom Mail draft with recipients, subject, body pre-filled from the returned markdown |
  | Open Docs / Open sheet | Opens the generated doc or spreadsheet via the returned link/id |
  | Review and continue | Opens the item to confirm or edit before it continues |
  | Authorize (HITL, `type: "link"` actions only) | Real external URL — behaves identically whether clicked in email or in-app |
  | View details | Full error + retry |
- Motion: switch knob `left 140ms ease-out`; the in-progress spinner (Workflow surfaces) is an 11px ring, `2px` border, `--border-subtle-primary` with `--fill-primary` top, `animation:700ms linear infinite`. Nothing else animates.
- Locked (admin-off) rows: dim, disable, and explain on hover. Do not hide the control.

## State Management
Prototype state, one-to-one with the real settings model:
- `adminEmail: boolean` — account email switch
- `adminEmailKinds: { summary, followups }` — the two new checkboxes
- `adminIm: boolean`, `adminImChannels: { teamchat, slack, teams }`
- `clientEmail: boolean`
- `statuses: { new, action, completed, failed }` — user's own choice, never narrowed by the admin. The not-started reminder isn't its own key — it's gated by `new` plus the schedule rule in section 2.
- `chatIntent: boolean`, `chat: { teamchat: boolean, slack: 'on'|'off'|'connect', teams: … }` — `'connect'` = not authorized
Derived: `emailLocked = !(adminEmail && adminEmailKinds.followups)`; `emailLive = adminEmail && clientEmail`; a chat row is locked when `!adminIm || !adminImChannels[key] || !chatIntent`.
Data needed per notification: meeting name/date/host, item type (extracted | inferred | workflow), status, prompt text, and — for completed — the artifact payload (message body, resolved recipients, email fields as markdown, doc link/id, workflow `payload.summary` / `payload.errorReason`).

## Design Tokens
All from Zoom Prism Design System 2.5 (`tokens.css` in this bundle). Use token names, not hex.
- Surfaces: `--background-bg-default`, `--background-bg-darker-neutral`
- Fills: `--fill-global-primary`, `--fill-primary`, `--fill-subtle-neutral`, `--fill-subtler-primary`, `--fill-subtler-success`, `--fill-subtler-warning`, `--fill-subtler-error`, `--fill-subtler-informative`, `--fill-subtler-complementary`, `--fill-subtler-supplementary1`
- Text: `--text-stronger-neutral`, `--text-strong-neutral`, `--text-neutral`, `--text-primary`, `--text-success`, `--text-warning`, `--text-error`, `--text-informative`, `--text-complementary`
- Icons: `--icon-neutral`, `--icon-strong-neutral`, `--icon-primary`, `--icon-success`, `--icon-supplementary1`
- Borders: `--border-subtle-neutral` (default hairline), `--border-neutral` (input rest), `--border-primary` (focus/selected), `--border-subtle-primary`
- Shadows: `--drop-shadow-sm` (cards), `--drop-shadow-md` (tooltip), `--drop-shadow-lg` (modal)
- Two non-token grays remain for disabled controls: `#c9ced4` (switch off), `#a9b2bb` / `#d5dade` (disabled checkbox). Replace with the codebase's disabled tokens if it has them. White on colored fills is literal `#fff` (Prism has no text-inverse token).
- Type: SF Pro Text / `system-ui`. Scale used: 20/26 600 (page title) · 17/22 600 (subject) · 15/20 500 (row title) · 14/21 (body) · 14/19 500 (form label) · 13/19 (detail) · 13/18 (sub) · 12/17 (hint, meta) · 11 500 (pill) · 10 600 (badge)
- Radii: pill `999px` (buttons, chips, switches) · `16px` cards · `14px` inner rows/panels · `12px` prompt boxes and footer buttons · `10px` form fields · `4px` checkbox
- Spacing: 4pt grid — card body `24px`, settings rows `14–16px / 20px`, card gaps `24px`, row gaps `10–12px`, icon-to-text `12px`

## Assets
- `tokens.css` — the Prism 2.5 token package (generated CSS custom properties, light + dark).
- `icons/` — 37 SVGs from the Zoom Prism icon library (`@zoom/icons`). Monochrome ones are applied as CSS masks so they inherit `--icon-*`; brand glyphs (`GoogleDocs`, `GoogleDrive`, `GoogleGmail`) are full-color `<img>`. In the target codebase, use its own Prism icon component instead of these files.
- `support.js` — prototype runtime only. **Do not port.**
- No photography or illustration.

## Files
- `Meeting Follow-up Notifications.dc.html` — the complete prototype: all five tabs, every email variant, all settings states. Open it in a browser; the left nav switches tabs and the Admin tab's switches drive the Client tab's locked states. The fifth tab, "HITL mapping," is reference only — see section 9.
- `tokens.css`, `icons/`, `support.js` — supporting files it loads.
