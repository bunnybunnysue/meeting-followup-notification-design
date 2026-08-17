# HITL → "Action required" Email Mapping

**Audience:** Engineering (implementation reference)
**Status:** Reference only — this is not a new screen to build. It documents how any JSON `spec` returned by ZoomMate's human-in-the-loop (HITL) tool should degrade into the single existing "Action required" email layout.
**Source of truth for the visual:** `Meeting Follow-up Notifications.dc.html` → **"HITL mapping"** tab (13 worked example cards, each tagged with a `part_id` — see table below). This doc is the text-only companion to that tab.

---

## 1. The core rule

ZoomMate's HITL tool can hand back many different `spec` shapes: plain confirm, form, table, auth prompt, batched permissions, and more.

**Do not parse or re-render `spec.fields` / `spec.actions` directly.** Doing so couples the email to a protocol we don't own, and that protocol is expected to keep changing.

Instead, every `spec` — regardless of shape — renders through the **same** "Action required" email layout, populated from exactly **four stable sources**:

| Email piece | Source | Fallback if missing |
|---|---|---|
| Subject | `spec.title` (truncate ~70 chars) | — always present, never falls back |
| Body copy | `spec.subtitle` (truncate ~140 chars) | First `display`-type field's `content`, with markdown stripped. If neither `subtitle` nor a `display` field exists, use generic copy: *"ZoomMate needs a quick decision before it continues."* |
| Extra one-line hint (optional) | A `table` field → row count, shown as "N action items ready for review". A `file_to_confirm` field → the file's `fileName`. | Omitted entirely if no such field exists |
| Button(s) | Always one **"Review and continue"** deep link | Plus a second, real button **only** for an action with `type: "link"` — rendered with its own `label` / `href` |

## 2. What never gets rendered

Every other field type and action type is intentionally **not** rendered in the email, no matter how it behaves in-app:

- Field types not rendered: `single_select`, `number`, `multi_select`, `textarea`, `file_upload`
- Action types not rendered: `send`, `submit`, `browser_take_over`, and any `menuActionIds` sub-menu

All of these fold into the single **"Review and continue"** button, because none of them can execute from a static email.

## 3. Batching rule

Multiple specs that share one `spec.meta.batch_id` send as a **single** email — "N items need your review" — with a bullet list of each spec's `title`. They do **not** send as N separate emails.

## 4. Worked examples (13 total)

Each row below corresponds one-to-one with a card in the prototype's "HITL mapping" tab, tagged by `part_id`.

| `part_id` | What makes it distinct |
|---|---|
| `demo-simple-confirm` | Baseline case — title + a `display` field, nothing else |
| `demo-quick-reply` | No `subtitle` and no `display` field → falls back to generic copy |
| `demo-schedule-meeting` | `display` field contains markdown (bold) → stripped, not rendered |
| `demo-confirm-deletion` | `display` field contains a markdown list → summarized as prose, not rendered as a list. Primary action is `variant: "danger"`, but the pill still uses the standard warning color |
| `demo-browser-take-over` | Has a `type: "browser_take_over"` action → folds into "Review and continue" like any `send`/`submit` |
| `demo-file-to-confirm` | Has a `file_to_confirm` field → mention the filename only. Copy can be non-English (this example's spec is in Chinese) — we do not translate it |
| `demo-mixed-form` | Heaviest form (6 fields, incl. select / number / multi_select / textarea / file_upload) → still shows only the intro `display` line |
| `demo-confirm-table-basic` + `demo-confirm-table-multi-source` | Same "table degrades to row count" treatment; one card covers both (3 rows vs. 4 rows, different `subtitle`) |
| `demo-long-text` | `title` and `subtitle` both exceed the length a subject/body line can hold → truncation rule applies |
| `demo-connector-write-auth` | 6 actions, one with a `menuActionIds` sub-menu of 3 more — all `send`, none `link`, so all fold into one button |
| `demo-batch-command` + `demo-batch-file-write` + `demo-batch-connector-write` | Share one `meta.batch_id` → sent as a single grouped email, not three |
| `demo-auth-link-timeout` | Only case with an action of `type: "link"` → that action gets its own real button ("Authorize"); the other two (`deny`, `allow-session`) are `send` and fold into "Review and continue" |

---

## Where to look for the visual

Open `Meeting Follow-up Notifications.dc.html` in a browser → left nav → **"HITL mapping"** tab. Each card in that tab is reference-only (not a screen to ship as-is) and shows exactly how one `part_id` example resolves under the rules above.

*Extracted from `README.md` §9 for standalone engineering handoff.*
