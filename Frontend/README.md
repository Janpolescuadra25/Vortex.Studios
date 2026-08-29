# VORTEX FRONTEND

The vortex.studio experience — Landing · The Hub · What's New.

## Stack
Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui.

## Run
- bun install
- bunx next dev -p 3000   (the package.json dev script pipes through
  `tee`, unavailable on Windows — invoke directly)
- All three views render with zero database and zero .env — UI content
  is fully static via src/lib/vortex-data.ts.

## Structure
- src/app/ — routes: / · /the-hub · /whats-new (+ placeholder api/route)
- src/components/vortex/ — the 11 custom Vortex components
- src/components/ui/ — shadcn/ui primitives
- src/lib/vortex-data.ts — single data source for all UI content

## Decisions (Phase 2)
- prisma/ NOT ported: schema (sqlite) is superseded by the Phase 3
  Backend (Prisma + PostgreSQL). The db:* scripts remain in
  package.json (byte-exact copy) but are inert here.
- worklog.md, Caddyfile, reference .gitignore not ported (reference
  metadata / environment-specific). Root repo .gitignore covers us.
- api/route.ts placeholder retained as-is pending Phase 3/6.
- bun.lock committed for reproducible installs.

## Phase 2.1 — Shell unification
The three URL entry points (/, /the-hub, /whats-new) share ONE shell
component: src/components/vortex/vortex-app-shell.tsx (client-side
view switching, cinematic transitions, initialView prop). In-app
navigation switches views client-side; the URL reflects the entry
point. This replaces the Phase 2 wrapper duplication.

## Status
✅ DONE — Phase 2/2.1 verified by HYDRA.
