# Handoff — Meeting Follow-up Notifications

> Written because the previous session's context window filled up. Read this first in the new window — it should give you everything needed to keep going without re-reading the whole thread.

## Where things live

**⚠️ Only one copy matters.**

| Copy | Path | Status |
|---|---|---|
| **Live / working copy** | `/Users/SueWang/Writing_Task/interactive_summary/design_handoff_followup_notifications/` | ✅ Use this one. It's a git repo pushed to GitHub. |
| Original snapshot | `/Users/SueWang/Desktop/design_handoff_followup_notifications/` | ⚠️ Stale — frozen at the very first version. Reference only. |

In a new Claude Code window, open the project at:
```
/Users/SueWang/Writing_Task/interactive_summary
```

## ⚠️ Uncommitted changes right now

As of this handoff, `Meeting Follow-up Notifications.dc.html` has uncommitted edits and `HITL-Mapping-Handoff.md` is a new untracked file. Run `git status` first thing — if the user wants this session's work saved to GitHub, `git add`, `git commit`, `git push` from inside the working-copy folder (Pages rebuilds automatically in under a minute). Don't commit without asking first.

## Live links

- **Prototype (GitHub Pages):** `https://bunnybunnysue.github.io/meeting-followup-notification-design/Meeting%20Follow-up%20Notifications.dc.html`
- **GitHub repo:** `https://github.com/bunnybunnysue/meeting-followup-notification-design` (public, `bunnybunnysue` account, `gh` CLI already authenticated)

## ⚠️ Viewing the prototype locally — don't just open the file

Opening the `.dc.html` file directly (`file://` URL) in the in-app Browser pane renders a **broken static snapshot** — template placeholders like `{{ item.label }}` show up literally and a modal is stuck open, because the external `support.js` script fails to load in that mode. **Fix:** serve it over a local HTTP server instead. A `.claude/launch.json` config named `meeting-followup-notifications` already exists at the project root (`/Users/SueWang/Writing_Task/interactive_summary/.claude/launch.json`) — use `preview_start` with `{name: "meeting-followup-notifications"}`, then navigate to `http://localhost:4323/Meeting%20Follow-up%20Notifications.dc.html`. Browser tab caching is aggressive — append a changing query string (`?v=2`, `?v=3`...) after every edit or open a fresh tab, or you'll review stale content.

## What's in this folder

| File | What it is |
|---|---|
| `Meeting Follow-up Notifications.dc.html` | The interactive prototype. Self-contained except for `tokens.css`, `support.js`, `icons/`. |
| `README.md` | Full visual/UI spec — tokens, spacing, component anatomy, per-screen breakdown. **⚠️ Stale** — written before this session's changes (see below). Worth a pass to resync if you want docs and prototype to match. |
| `PRD-Notification-Framework.md` | Product-level framework doc. Also **stale** relative to this session's settings redesign. |
| `HITL-Mapping-Handoff.md` | **New this session.** Standalone engineering doc extracted from README §9 — the HITL → "Action required" mapping rules and all 13 worked examples, meant to be forwarded to engineering directly. |
| `Meeting-Followup-Notification-Framework.pptx`, `build_deck.js` | Slide-deck version of the PRD and its generator script. Unchanged this session. |
| `icons/`, `tokens.css`, `support.js` | Assets the prototype loads. Don't port `support.js` to production. |

## Prototype structure — now 7 tabs

1. **ZoomMate emails** — New / Reminder / Action required / Completed (multiple variants) / Failed
2. **Workflow emails** — Completed / Failed only, no Action required (Workflow sends its own)
3. **Zoom Chat** — bot identity is **"Meeting Follow-Up"**, not ZoomMate (fixed this session — see below). Same cases as email, chat-native interactions (Copy, Open chat, inline pick, inline form)
4. **Client settings** — My Notes → Settings → Notifications (restructured this session — see below)
5. **Admin settings** — Web Portal → Account Settings (lock logic rebuilt this session — see below)
6. **HITL mapping** — reference-only tab, 13 worked examples by `part_id`
7. **Mobile fallback** — **new this session.** The wall screen shown when a mobile follow-up link hits the unsupported My Notes tab

## Key decisions/changes made THIS session (long one — read carefully before re-litigating)

### Completed-card architecture (ZoomMate emails tab)
- Merged the separate "task box" + "output box" into **one bordered container** per card (task row on top, divider-free, output/message/email content below) — no more double borders, no redundant "meeting name" subtitle under the task title (redundant with the card's own meta line).
- Single-artifact and multi-artifact "Completed" cards now share the same structure: task row (icon + title + **View result**) → output shown as small bordered pill chips with **real file-type icons in their actual colors** (blue ZoomDocs, green sheet) — tried fully gray/de-emphasized first per an internal design brief, user rejected it as "too plain-text," settled on colored icons in a compact pill.
- Message/email "Completed" cards: simplified header labels ("Message · to Sarah Chen" → **"Message"**, "Email · draft, not sent" → **"Email"** — redundant with the button text below), removed internal divider lines between sections (rely on spacing only), kept the To/Cc/Subject-vs-body divider inside the email box since that one is functionally meaningful.
- "2 messages"/"2 files" cards: each item gets its own nested bordered frame within the outer card, no numbered labels ("Message 1 of 2" → **"Message 1"**, or further simplified — check current file).

### Reminder / "not-started" email — full redesign
- Old design: single-meeting reminder with **fake specific task previews** ("Confirm the pricing update owner...") and a "Generate" button per fake task. Rejected: at reminder time nothing has been generated yet, showing fake task titles misleads users.
- New design: **aggregated daily digest** listing every meeting from that day with an un-triggered transcript (real data we have), each meeting shown as its own bordered cell (icon + name + time/host + **"Get my follow-ups"** button) — not a divided list.
- Copy evolved through many rounds — current settled copy: title **"See if your 3 meetings from today have follow-ups"**-style framing wasn't fully locked in; last confirmed body line: *"ZoomMate hasn't looked at these yet."* (trimmed, no "pick a meeting..." tail). **Double-check the exact current title text in the file — this went through ~8 iterations and you should verify against the live file, not this summary.**
- The "When the reminder fires" explainer card was rewritten: single **"Daily reminder"** tier (not per-meeting 3-hour + 9am two-tier), "Never sent when" now gates on transcript existence (not on follow-up outcome, which we can't know in advance), added a "Why one per day" row.

### Email chrome demo (first "New" card only)
- Added the real production email shell — Zoom blue banner → **"My Notes · Meeting follow-ups"** header with a **BETA** pill → existing card content → footer (social links, address, Unsubscribe) — demonstrated on the first "4 follow-ups are ready from Product Roadmap Sync" card only, per explicit instruction to leave every other card as bare content (no shell) so the content stays the focus.
- Removed the internal "Zoom <notifications@zoom.us> / timestamp" mini-header from inside that one shelled card (redundant with the new branded header).

### Copy iterations worth knowing about (don't re-litigate from scratch)
- "Ready" is a loaded word throughout this whole review — several rounds concluded that "ready" implies content already exists, which is false before a user triggers generation. Prefer "is coming to mobile," "shows up," "is suggested" style verbs over "becomes new" or generic "ready" claims when nothing has been generated yet.
- Avoid em dashes in shipped copy — flagged explicitly as reading "very AI." Use "unless," "if," or split into two clauses instead.
- Client settings Email toggle description went through several rounds to correctly state BOTH the trigger (status changes: shows up / needs action / completes / fails) AND the gate (only if not already seen) — current text should read something like *"Get an email when a follow-up shows up, needs action, completes, or fails, unless you've already seen it."* Verify current exact wording in file.

### Mobile fallback tab (new, 7th nav item)
- Added `isMobileWall` state branch + nav entry. Shows a phone-frame mockup (390px, status bar, back-chevron nav bar) with: icon, **"Follow-ups is coming to mobile"** heading, body pointing to My Notes for notes/transcript (not a dead-end "Got it" — gives a real next action), button **"Open My Notes"** (`openNotes` handler, defined near other `openXxx` handlers).
- Rationale for routing to My Notes (not a "copy link, go to desktop" flow): guarantees the user gets *some* value immediately (notes/transcript are the source material follow-ups are generated from) rather than depending on a device switch that may never happen.

### Client + Admin settings — restructured per a real meeting transcript (Sue Wang / Xun Xiao, Aug 14)
Decisions from that meeting, all implemented:
1. **Notification moved off the main My Notes settings list into its own second-level page.** The parent list (Auto generate summary / Jump to My Notes when note is done / Auto create tag) now has a 4th row, **"Manage notifications"** — verb-first to match the others, a pure nav row (chevron, no toggle) that opens the "Notifications" detail page below it. Demonstrated with both levels stacked in the Client settings tab.
2. **Removed the four per-status checkboxes entirely** (New/Action required/Completed/Failed) from both Email and Chat. Meeting rationale: anyone who wants notifications at all will check all four anyway; splitting them out just adds controls without adding real choice. Now: Email is one toggle, Chat is one toggle.
3. **Admin "off" and admin "locked" are now genuinely different states** (previously conflated):
   - Admin toggle OFF (not locked) = sets the **default** for new users; they can still flip it themselves in Client settings.
   - Admin toggle + **lock** (new, functional — click the padlock icon next to the admin toggle) = **forces** that value (on or off) and disables the client control, with a hover tooltip explaining why.
   - New state: `adminEmailLocked`, `adminImLocked` (booleans). Derived `emailLocked`, `emailValue`, `chatLocked`, `chatValue` in `renderVals()` — read that function before touching the lock logic again, it's not just `!adminEmail` anymore.
4. Client settings Email description copy was rewritten to state the trigger + "unless already seen" gate (see copy section above) instead of the old, simply-wrong "sent about 10 minutes after a task appears" line (that timing only ever applied to the New-task email, not Completed/Failed/Action-required).

### Zoom Chat tab — bot identity + parity with the real Aug email ship design
- **Bot identity fixed**: was incorrectly showing "ZoomMate" as the sender name/avatar label throughout the tab; real product sends as **"Meeting Follow-Up"**. Renamed all ~17 occurrences *within the Zoom Chat tab only* (email tab and HITL tab still say ZoomMate — that's a different, not-yet-resolved question, see Open items).
- User shared the actual Aug-ship Figma email designs mid-session and asked for chat to mirror the logic. Result:
  - Each task in the "New Task Detected" chat card now has its own **"Prompt to be sent" box + "Customize prompt" link** (previously chat only showed bare task rows — this was a real gap vs. email, now fixed).
  - Each task also got its own **execute button** — **"Draft"** for message-type tasks, **"Run workflow"** for Workflow-type tasks — plus the card's bottom collapsed from two buttons (Get Started / Run All) down to one: **"View all your follow-ups"** (also applied to the email tab's equivalent button, was "Open follow-ups").
  - Renamed **"Generate" → "Draft"** everywhere (email + chat) to match the real ship design's button label.
  - Action Required titles reformatted to the real design's template: **"Action needed: [Task name]"** (was free-text like "Confirm action items with Sarah Chen").
  - Added a **new example card** demonstrating inline form-filling in chat — "Action needed: Confirm the pricing update owner with Sarah Chen" with an Owner dropdown-style field and a Due-date field, Confirm button, Open in Follow-ups fallback link. This is chat-only — **email can't do this** (static email folds all form-like HITL fields into one "Review and continue" button per the HITL mapping rule; chat is interactive so it can actually render fillable fields). **The exact field types/content here are a guess — flagged for the user to confirm against real HITL form schemas, not yet confirmed as of this handoff.**
  - Added an explicit **action-items list** to the Workflow "Update Salesforce opportunity needs your review" card (Stage/Amount/Close Date bullet list) — previously it was just an abstract description sentence with no concrete content.

### HITL-Mapping-Handoff.md (new file)
Standalone doc pulled from README §9 for handing to engineering directly, without the rest of the README's unrelated sections. Contains the 4-source mapping rule, what never renders, the batch_id collapsing rule, and all 13 worked examples with their `part_id`.

## Open items / not yet done

- [ ] **README.md and PRD-Notification-Framework.md are now meaningfully out of sync** with the prototype (settings redesign, Reminder redesign, Zoom Chat parity work, bot rename all postdate the last README pass). Worth a real resync pass, not just a quick patch.
- [ ] Reminder email's exact current title copy — went through many rounds this session, verify the live file rather than trusting any single summary of "the current version."
- [ ] The new chat inline-form card's field types (Owner dropdown, Due date field) are a placeholder guess — confirm against real HITL form schemas before treating this as final.
- [ ] "ZoomMate" branding still appears in the ZoomMate-emails tab and HITL-mapping tab — only the Zoom Chat tab was corrected to "Meeting Follow-Up" this session. Unclear if email should also rename, or if "ZoomMate" is the correct identity for email specifically (ask the user — this came up almost at the very end of the session and wasn't resolved for email).
- [ ] Slack and MS Teams tabs still not built (unchanged from before this session).
- [ ] Two designer-facing open questions from the original PRD (§8) likely still open — not revisited this session.

## How to resume

1. Open a new window/session at `/Users/SueWang/Writing_Task/interactive_summary` (not Desktop).
2. Read this file, then skim the live `.dc.html` directly for exact current copy — this session did a *lot* of copy iteration and this doc summarizes decisions/rationale, not verbatim final text.
3. Check `git status` — there are uncommitted changes as of this handoff (see warning above). Ask before committing.
4. To view the prototype, use the local HTTP server method above — do not just open the file, it renders broken.
