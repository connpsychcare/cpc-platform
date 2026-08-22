# Start here (read this first, before anything else)

This file exists because the user reinstalled Linux on this laptop on
2026-08-22 (a temp machine, borrowed for ~2 weeks while waiting on a
replacement). It's committed to the repo so it survives the reinstall and
is the first thing available the moment this repo is re-cloned - before
Claude's own `~/.claude` memory system may even be restored yet.

## 1. Restore secrets/memory/SSH first

Full repeatable procedure: `/mnt/d/Backup/README.md` (a separate Windows
drive, survives a Linux/WSL reinstall). It restores `.env` files, SSH keys,
Claude Code's own `~/.claude` settings and auto-memory, and Codex trust
entries. If the user says something like "go on, copy that project" after
a fresh clone, read that README - it has the mapping table and does not
need to be re-derived.

## 2. Then read AGENTS.md

`AGENTS.md` in this repo root is the actively-maintained source of truth
for project status, conventions, and history. It has a "Ready-to-paste
prompt for next chat" section near the end of the big status log with the
most recent session's summary and the suggested next task - read that
first for orientation, then skim backward through the dated "Completed"
sections as needed.

## 3. Where things stood as of 2026-08-22 (last session before reinstall)

Everything from that session is committed and pushed to `origin/main` at
commit `45ae956` ("Redesign patient onboarding wizard and fix messages
page filters") - confirmed via the user's own terminal (`git push`,
passphrase-protected SSH key, had to be run by the user directly since the
sandboxed tool session has no TTY to prompt for a passphrase - if a push
is ever needed again, ask the user to run it themselves rather than
fighting `ssh-askpass`).

What shipped: a full redesign of the patient onboarding wizard (moved from
`/patient/complete-profile` to `/complete-profile`, out of the patient
sidebar shell into the same shell as `/booking`), three real bugs fixed
along the way (consent data was silently never persisted, an
`insuranceRelationship` casing mismatch, a premature
`onboardingCompletedAt` flip), and a messages-page filter/autofocus fix.
Full detail is in `AGENTS.md`'s "Completed (August 22, 2026)" section.

**Not yet done:** actual browser click-through verification. That
session's container had no headless-browser tooling (no `chromium-cli`,
no Playwright) - only type-checking and live API/DB testing via `curl` +
`docker exec psql` were possible. If this fresh environment has browser
tooling available (or the user asks to verify visually), that's the
natural first thing to check before moving on to new work. The user's
original plan was: finish `apps/web` polish, then move to `apps/dashboard`.

## 4. Environment notes specific to this laptop

- WSL2 Ubuntu, project lives at `/home/zhx-labs/projects/cpc-platform`
  (inside the Linux filesystem - NOT on the Windows-backed `/mnt/d/` drive,
  so it does NOT survive a reinstall on its own; only `git push`ed commits
  do).
- Local dev Postgres runs via Docker (`dev-postgres` container,
  `postgres:18`, port 5432). Check `docker ps` and start it if needed
  before running the server.
- Server env var for the DB connection is `DB_URI` (in
  `packages/db/.env`, read via `prisma.config.ts` which also checks
  `DB_MIGRATE_URI` first) - not the more common `DATABASE_URL` name.
- Server dev port 4000, web dev port 3000 (`pnpm --filter server dev`,
  `pnpm --filter web dev`).
- Demo/seed patient accounts: `patientN@connectedpsychiatriccare.demo` /
  password `Test@123456` (see `packages/db/prisma/seed.ts`). `patient1`
  was already onboarded as of 2026-08-22; `patient2`/`patient3` were used
  for live API testing that session and are no longer clean/unonboarded -
  re-seed (`pnpm --filter @workspace/db prisma:seed`) if a fresh
  unonboarded patient is needed.
- `package.json` and `pnpm-workspace.yaml` had uncommitted local changes
  as of 2026-08-22 unrelated to any feature work - just pnpm version
  metadata that differs between machines (this laptop had pnpm 11.22.0
  vs. the repo's pinned 10.28.0). Left uncommitted deliberately; safe to
  ignore or let a fresh `pnpm install` regenerate them.
