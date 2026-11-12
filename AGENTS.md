# AGENTS.md — Cardiff Taxis Ltd

This folder is the single source of truth for the Cardiff Taxis Ltd engagement.
You may be any AI tool (Claude Code, Codex, OpenCode, Kilo Code, Cursor, WorkBuddy, …).
A different tool may have worked here before you. You cannot see that conversation.
**Everything you need is on disk. Read it before you act.**

---

## Read in this order, every session

1. **`STATE.md`** — where this engagement is right now: phase, done, next, decisions, blockers.
2. **The last two entries of `STATE.md`'s session log** — what the previous tool actually did and why it stopped.
3. **`metadata.json`** — the only on-disk statement of what the business does.
4. **`README.md`** — note it is currently AI Studio boilerplate, not an engagement brief. Treat its absence of information as a gap to fill, not as a signal that nothing was done.

Then state back, in five lines or fewer, what you understand the position to be. If you had to
guess at anything, say so before you start work.

---

## Standing rules

- **Route, don't improvise.** If no procedure covers the task, say so — that is a finding, not a licence to invent one.
- **Never invent a client fact.** No credential, price, review, certification or performance claim that is not already published by the client or confirmed in writing.
- **Cite sources, or say you could not verify.** An unsourced external claim is a draft, not a fact.
- **Stop and ask before any spend or any publish.** No paid API call, no ad spend, no sending anything to the client or the public without the operator's approval. Silence is refusal.
- **Leave artifacts on disk, at the path the SOP names.** A deliverable that exists only in your chat response does not exist.
- **Write the session entry before you stop** — including when you have run out of budget mid-task.

---

## Project rules that override generic defaults

- **Service-area business.** Cardiff, Bristol and London airport transfers; private hire across Cardiff. Do not build location pages for towns outside the real operating area.
- **One Google Business Profile per business.** Do not create a second profile to cover a second city — extend the service area instead.
- **Cardiff is the primary geography.** Bristol and London appear as transfer destinations, not as separate markets.

---

## Where to log, before you stop

Append one entry to the session log in `STATE.md`, then update the state block above it.
Name your tool and your role — "Claude Code, SEO lead" tells the next tool whether a review
has happened or whether it is looking at unreviewed work.

Write the **next action** precisely enough that a tool with zero context can begin it:
the procedure, the input, and the artifact expected.

---

## Do not

- Do not create a second copy of this file under another name. If a tool looks for `CLAUDE.md`, symlink it: `ln -s AGENTS.md CLAUDE.md`.
- Do not overwrite a dated audit folder. New runs get a new dated folder.
- Do not put raw client data anywhere it is not gitignored.
- Do not treat `README.md` as the entry point — it is written for a human. `STATE.md` is the live state.

---

*Full engagement procedure: `system/sops/hand-off-between-tools.md` in this vault.*
