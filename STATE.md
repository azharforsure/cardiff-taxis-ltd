# STATE.md — Cardiff Taxis Ltd

The live state of this engagement. Any tool reads this first and updates it before stopping.
`README.md` is for humans; **this file is for whoever opens the folder next.**

---

## State block

| Field | Value |
|---|---|
| Business | `freelance` |
| Client | Cardiff Taxis Ltd |
| Domain / id | `cardiff-taxis-ltd` |
| Shape | Local services — private hire and airport transfers. A **service-area business**, not a shopfront. |
| Platform | Not recorded on disk. `metadata.json` describes the business; the folder contains a Next.js/Vite app (`next.config.mjs`, `app/`, `src/`). **Confirm the live platform before quoting any technical work.** |
| Order | **Not recorded on disk.** No order, price or delivery date appears in `client.md`, `metadata.json` or `README.md`. Record it here before the next session. |
| Current phase | **Not recorded.** Establish it from the folder contents and the live site. |
| Blocked on | **Unknown — and this is the first thing to fix.** A folder with no recorded scope or price cannot be handed off reliably. |

### Done

- Client record present — `client.md`
- A working application folder is present (`app/`, `src/`, `dist/`, `server.js`)
- **Nothing else is documented.** No audit, no findings, no order record, no deliverables index.

### Open / not started

| Item | Status | Note |
|---|---|---|
| Engagement record | **Missing** | No order, price, scope or delivery date is recorded anywhere in this folder. |
| Audit and findings | **Not started** | No audit artifact exists on disk. |
| Checklist run | **Created, not walked** | `checklist-local-services.md` exists at 0/24. |

### Decisions on record (do not relitigate)

_None recorded yet._

---

## Session log

Append-only. Newest last. One entry per tool session.

### 2026-10-14 · WorkBuddy · Operator

Installed the cross-tool handoff contract: created `AGENTS.md` (entry contract) and `STATE.md`
(this file). Pre-filled the state block from the folder's own contents.
**The state block is not verified against the artifacts** — it records what is on disk, and where
nothing was recorded, it says so rather than guessing.

- **Changed on disk:** added `AGENTS.md`, added `STATE.md`. Nothing else touched.
- **Could not finish:** see the next action below.
- **Next action:** Establish and record the engagement basics in this file: what was ordered, at what price, by when, and what the current phase is. There is no audit artifact on disk, so the first substantive task is a baseline local audit — but confirm the scope before doing work that may not have been paid for.

### 2026-10-23 · OpenCode (GLM) · Operator's agent — folder migration

Folder migrated wholesale from `clients/cardiff-taxis` as part of the freelance workspace's formal
clients/projects split (`docs/operations/engagement-lifecycle.md` v1.1.0): `clients/<client>/` now holds
the client card, `projects/<client>-<slug>/` holds one engagement. **Contents untouched; no engagement
work done.** `project.md` registered at the root with the scope recorded from `STATE.md`/`client.md`.
Next action: unchanged — read before acting.
