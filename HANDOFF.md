# Handoff — Meeting Follow-up Notifications

> Written because the previous session's context window filled up. Read this first in the new window — it should give you everything needed to keep going without re-reading the whole thread.

## Where things live

**⚠️ Important: there are two copies on disk. Only one of them is current.**

| Copy | Path | Status |
|---|---|---|
| **Live / working copy** | `/Users/SueWang/Writing_Task/interactive_summary/design_handoff_followup_notifications/` | ✅ Use this one. All edits this session happened here. It's also a git repo pushed to GitHub. |
| Original snapshot | `/Users/SueWang/Desktop/design_handoff_followup_notifications/` | ⚠️ Stale — frozen at the very first version, before any of this session's changes. Only useful as a "what we started from" reference. |

**Folder name to search for on Desktop / Spotlight: `design_handoff_followup_notifications`** — but note it'll find the stale one; the real one is under `Writing_Task/interactive_summary/`, not Desktop.

In a new Claude Code window, open the project at:
```
/Users/SueWang/Writing_Task/interactive_summary
```

## Live links

- **Prototype (GitHub Pages, public link — anyone with the URL can open it):**
  `https://bunnybunnysue.github.io/meeting-followup-notification-design/Meeting%20Follow-up%20Notifications.dc.html`
- **GitHub repo:** `https://github.com/bunnybunnysue/meeting-followup-notification-design` (public, under the `bunnybunnysue` account, `gh` CLI already authenticated on this machine)
- To redeploy after future edits: `git add`, `git commit`, `git push` from inside the working-copy folder — Pages rebuilds automatically in under a minute.

## What's in this folder

| File | What it is |
|---|---|
| `Meeting Follow-up Notifications.dc.html` | The interactive prototype. Open directly in a browser (double-click, or via this app's preview pane). Self-contained except for `tokens.css`, `support.js`, `icons/`. |
| `README.md` | Full visual/UI spec — tokens, spacing, component anatomy, per-screen breakdown. The engineering handoff doc. |
| `PRD-Notification-Framework.md` | Product-level framework doc — email send mechanism, ownership boundaries between us and the Workflow team, Client/Admin settings spec, open design questions for the designer. |
| `Meeting-Followup-Notification-Framework.pptx` | Slide-deck version of the PRD, for presenting. |
| `build_deck.js` | The pptxgenjs script that generated the .pptx above. Not runnable as-is — needs `npm install pptxgenjs react-icons react react-dom sharp` first (was deliberately removed after use to keep the folder light; reinstall if you need to regenerate the deck). |
| `icons/`, `tokens.css`, `support.js` | Assets the prototype loads. Don't port `support.js` to production — it's prototype-only interactivity. |

## Prototype structure — 6 tabs

1. **ZoomMate emails** — the 5 email states (New, Not-started reminder, Action required, Completed ×5 variants incl. a multi-artifact case, Failed)
2. **Workflow emails** — Completed / Failed only. **No Action required here** — Workflow sends its own review-needed notifications, by design (see PRD §2, the "loose coupling" decision)
3. **Zoom Chat** — the ZoomMate bot in Zoom Team Chat, same cases as the email tab but chat-native (Copy and jump-to-chat buttons actually work here, unlike static email). Built first because Team Chat already ships some of this; Slack and MS Teams tabs are the planned next step, not yet built
4. **Client settings** — My Notes › Settings › Notifications
5. **Admin settings** — Web Portal › Account Settings
6. **HITL mapping** — reference-only tab: how any ZoomMate human-in-the-loop JSON shape maps into the "Action required" email, with a rule (title/subtitle/table-count/file-name only, never render raw fields) and 13 worked examples tagged by `part_id`

## Key decisions made this session (so you don't re-litigate them)

- **No Copy button in email** — static HTML email has no clipboard API. Copy *is* back in the Zoom Chat tab, because bot buttons have real server callbacks.
- **Task card titles never get swapped for the artifact's name** — the Completed card's task row always shows the original task title; the artifact (message/doc/sheet/etc.) is a separate block below.
- **Multiple artifacts from one task** stack as separate labeled rows inside one "Output from this task" block (plain white background, icon + name + chevron, no redundant "Open X" text since the chevron already implies it) — this was the last visual fix, based on a reference image the user provided.
- **Multiple recipients** always split into N separate cards/messages — never one card with two message blocks, never a group chat.
- **Action required (ZoomMate)** — plain text only, no fake interactive form preview (forms can't submit in email or reliably across chat bot platforms).
- **Send timing** — no fixed wait (e.g. old "10 minutes"). Rule is: the moment content is ready, check if the user is looking at it *right now*; send only if not. Separate from the 3-hour/9am reminder schedule for users who never generated anything.
- **Workflow ownership boundary** — we own the "New/suggested" surfacing only. Once a workflow enters review/completed/error, Workflow's own team sends that notification, not us.
- Two design questions were flagged as **open for the designer to explore** (not yet resolved): the "encouraging/ad-like" visual for the not-started reminder, and (partially resolved this session) how task cards and artifacts should visually combine.

## Open items / not yet done

- [ ] Slack and MS Teams tabs (structure is scoped in `PRD-Notification-Framework.md` and in the Zoom Chat tab's closing note, not yet built visually)
- [ ] `README.md` and `PRD-Notification-Framework.md` were last updated *before* the Zoom Chat tab and the "Output from this task" redesign — worth a pass to fold those in if you want the docs fully in sync with the prototype
- [ ] Engineering open questions tracked in `PRD-Notification-Framework.md` §9 (ZoomMate error-state visibility, Action-required form-preview usability test, Workflow's own notification timeline)
- [ ] The two designer-facing open design questions in `PRD-Notification-Framework.md` §8

## How to resume

1. Open a new window/session at `/Users/SueWang/Writing_Task/interactive_summary` (the parent project folder — not Desktop).
2. This file (`HANDOFF.md`) plus `README.md` and `PRD-Notification-Framework.md` should be enough context to keep working without replaying the whole prior conversation.
3. If you just want to *look* at the current state, the GitHub Pages link above is the fastest way — no local setup needed.
