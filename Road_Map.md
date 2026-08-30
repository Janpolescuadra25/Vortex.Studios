# VORTEX STUDIOS — BUILD ROADMAP

Living document. Tracks the build of the Vortex Studios platform — web
presence, supporting services and the owner dashboard. Statuses reflect
HYDRA-verified repository state, never intentions. Updated as phases
complete; completed phases are compressed or removed when they no longer
aid tracking.

**Current position:** Phase 4A completed · Phase 4B next — Phases 5–8 not started

## Ground rules
1. Repository root is this folder. Reference material (Docs\Vortex_reference)
   stays outside the repo — local-only, never committed.
2. Reference wins for visuals, layout and motion. The canonical brand brief
   wins for factual content (product data, statuses, counts).
3. No secrets in git, ever — and none in prompts. Credentials travel
   JP → .env → server only. Owner password stored as a bcrypt hash.
4. Every implemented section ships a section README, marked DONE only
   after HYDRA-verified audit.
5. Roles: CYPRA plans · HYDRA verifies · MANTRA executes. No crossings.
6. Identity copy stays category-agnostic and count-agnostic. Categories
   and counts appear only where they are the actual content.
7. The Owner Dashboard is owner-facing tooling; brand voice rules govern
   its public-facing output, not its chrome.

---

## Completed Foundations (compressed record)
- Workspace & reference verification: stack identified (Next.js 16 ·
  React 19 · TypeScript · Tailwind v4 · shadcn/ui · Prisma); three
  views confirmed; content matched canonical brief. History: commit
  4136936.
- Root documentation: .gitignore, README.md, Road_Map.md created and
  HYDRA-verified; Frontend/ and Backend/ established with .gitkeep
  files. History: commit 4136936.
- Tooling & git bootstrap: bun 1.4.0; repo-local git identity; first
  push landed after remote verification gate (commits 4136936–28f5edd).

## Phase 2 — Frontend Establishment — ✅ COMPLETED
Objective: the reference UI ported into Frontend/, visually
unmodified; public site only.
Completion record: HYDRA-verified complete — reference UI ported
with the exclusion list enforced (no .env, prisma/, db/, reference
metadata); 818 dependencies installed via bun; three URL entry
points (/, /the-hub, /whats-new) verified serving with zero
database dependencies; Frontend/README.md documents structure,
decisions and run instructions.

## Phase 2.1 — Shell unification — ✅ COMPLETED
Objective: one shared SPA shell behind the three route entry points.
Completion record: HYDRA-verified complete — duplicated shells
extracted into src/components/vortex/vortex-app-shell.tsx
(initialView prop); three thin route pages; routes re-verified;
commit a9772d6 pushed; working tree clean.

## Phase 3 — Backend Foundation — ✅ COMPLETED
Objective: API service powering The Hub, What's New, Stats AND the site
configuration that the Owner Dashboard will later manage.
Implementation: Node.js HTTP API in Backend/ (framework finalized in
Phase 3 planning) + Prisma ORM. Data models: products (name, lane, status,
date, description); changelog entries (type: launch / update /
announcement / milestone; date; body); site_config (JSON document per
landing section — content overrides, section visibility, appearance
settings); owner_account (email, password_hash ONLY — no plaintext,
ever); media (metadata; binary lives in object storage, decision pending:
recommended Vercel Blob). Database: local PostgreSQL development /
Neon production — same schema, env-switched. Public endpoints (minimum):
GET /health · GET /api/products (status/lane filters) · GET /api/changelog
· GET /api/stats · GET /api/site-config (public view; falls back to
built-in defaults when unconfigured). Seed script loads the canonical
lineup and changelog from the brief timeline. CORS restricted to known
frontend origins. .env.example documents every key name (values set by
JP only). Dependencies: Phase 1B; local PostgreSQL service status
confirmed by audit; Neon account.
Completion criteria: endpoints return valid canonical data against the
local database; empty site_config falls back to defaults; migrations
reproducible from scratch; HYDRA-verified; Backend/README.md created,
marked DONE after verification.
Completion record (3A): HYDRA-verified complete — Prisma schema
migrated; canonical self-healing seed v2 converged (9 products, 5
changelog entries; 9 non-canonical rows purged); Backend/README.md
created; committed and pushed. 3B (API endpoints) pending.
Completion record (3B-1): HYDRA-verified complete — Express server
live on port 4000; /health + /api/products with status/lane filters;
six-case matrix passing; commit 1421235.
Completion record (3B-2): HYDRA-verified complete — /api/changelog
(+type filter), /api/stats, /api/site-config with defaults fallback,
CORS restricted to configured origin; twelve-case matrix passing;
Phase 3 fully delivered.

## Phase 4 — Owner Authentication — 🔄 IN PROGRESS (4A backend auth complete · 4B hidden entrance next)
Objective: a hidden, authenticated entrance for the studio owner only.
Implementation: admin path segment sourced from env (ADMIN_PATH) — never
hardcoded, never linked from public pages, noindex, excluded from
sitemaps; login endpoint with rate limiting and timing-safe comparison
against the bcrypt hash; httpOnly session cookie (SameSite; expiry);
middleware guarding all admin routes and all write endpoints; logout.
Requirements: admin route names leak nothing in HTML/JS bundles; failed
logins rate-limited; session invalidation on logout.
Completion criteria: unauthenticated access to any admin route blocked;
valid login succeeds; rate limiting demonstrated; HYDRA-verified.
Completion record (4A): HYDRA-verified complete — hidden owner login
path with env-sourced ADMIN_PATH, bcrypt-backed credentials, rate-limited
failed login handling, httpOnly session cookie, owner auth guard, and
logout.

## Phase 5 — Owner Dashboard — ⚪ NOT STARTED (executed as 5A / 5B)
Objective: full owner control over the public site, without code or
redeploys.
Phase 5A — Content & What’s New: edit hero/tagline/section copy overrides;
show/hide toggles per landing section; CTA button management; full CRUD
for What’s New entries with type tags and publish state.
Phase 5B — Appearance & Media: accent theme selection (locked to brand
palette); animation toggles (hex field ignition, reticle rotation,
shockwave) and intensity; image uploads with sizing/position controls and
alt text (Vercel Blob or JP-approved alternative); preview before publish.
Expected output: dashboard changes visibly alter the public landing after
publish, no redeploy.
Requirements: server-side validation of every setting; unknown/invalid
config values fall back to safe defaults; every write endpoint behind
owner auth; audit trail of changes (who/when/what).
Completion criteria: each module demonstrated end to end (change →
publish → visible on public site); failure states safe; HYDRA-verified;
dashboard README created, marked DONE after verification.

## Phase 6 — Integration — ⚪ NOT STARTED
Objective: public site renders live from the Backend — data AND
configuration — UI craft untouched.
Implementation: frontend data layer fetches from the API (base URL via
env); landing renders per site_config with graceful built-in defaults;
What’s New, Hub and Stats from API; loading/error/empty states in brand
voice; hardcoded content remains only where it is identity copy.
Expected output: PostgreSQL + site_config are the single source of truth
for everything dynamic.
Dependencies: Phases 2, 3 (and 5 for config rendering).
Completion criteria: all dynamic views render API data locally; config
changes propagate without redeploy; no visual regressions; HYDRA-verified.

## Phase 7 — Deployment — ⚪ NOT STARTED
Implementation: Frontend → Vercel (Root Directory: Frontend); Backend →
Render (Root Directory: Backend); database → Neon; object storage live;
all env vars set in platform dashboards — never in the repo; CORS
tightened to production origins; ADMIN_PATH set in production env.
Completion criteria: both deployments live and healthy over public URLs;
HYDRA verifies through the public URLs.

## Phase 8 — Domain — ⚪ NOT STARTED
Implementation: apex + www → Vercel; API subdomain → Render; SSL
provisioned; production API base URL updated.
Completion criteria: https://vortexsdu.com serves all three views; API
reachable on its subdomain; admin entrance verified over HTTPS; HYDRA-
verified.

---

*Less friction. More momentum.*
