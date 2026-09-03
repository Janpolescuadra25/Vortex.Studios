# VORTEX STUDIOS — BUILD ROADMAP

Living document. Tracks the build of the Vortex Studios platform — web
presence, supporting services and the owner dashboard. Statuses reflect
HYDRA-verified repository state, never intentions. Updated as phases
complete; completed phases are compressed or removed when they no longer
aid tracking.

**Current position:** Phase 5A content complete (5A-1/2/3/3b) · Incidents #4–#7 recorded and remediated · build blocker parked · Phase 5A-4 next — Phases 5B–8 not started

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
- Phase 2 / 2.1 — Frontend: reference UI ported (818 deps via bun,
  exclusion list enforced); three URL entry points (/, /the-hub,
  /whats-new) verified; SPA shell unified into
  vortex-app-shell.tsx. History: 15b2845, a9772d6.
- Phase 3 — Backend foundation: Prisma + PostgreSQL (vortex_db);
  canonical self-healing seed (9 products, 5 changelog entries);
  Express API — /health, /api/products, /api/changelog, /api/stats,
  /api/site-config + CORS; twelve-case matrix. History: 1421235,
  d9fe3ab.
- Phase 4 — Owner authentication: 4A backend auth (bcrypt,
  rate-limited login, httpOnly JWT cookie, requireOwner guard;
  secrets rotated after an exposure incident — logged) + 4B hidden
  entrance (ADMIN_PATH middleware, noindex console, bundle leak
  gate). History: 0ba4c1a, 98e2618.

## Phase 4 — Owner Authentication — ✅ COMPLETED
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
Completion record (4B): HYDRA-verified complete — ADMIN_PATH
middleware (secret path rewrite, direct /owner-console 404s), noindex
console with login/logout wired to /api/auth (credentials included),
bundle leak gate passed; commit 98e2618; verification suite confirmed
hash, remote equality, and the full matrix. JP browser acceptance
COMPLETE — login, console, logout and the direct
/owner-console 404 all verified by JP in-browser. Phase 4
fully certified.

## Phase 5 — Owner Dashboard — 🔄 IN PROGRESS (5A content units complete · 5B appearance/media pending)
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
Completion record (5A-1/2): HYDRA-verified complete — Product.link
migration + owner Products editor (guarded list/update API, console
module with link editing); commits 3b87446, 5044fab.
Investigation record (build blocker): 8 single-variable experiments
(5A-2.5–2.12) — internal error/not-found pages fail React context
init at prerender, bundler- and version-independent, ignoring
dynamic exports; mechanism evidence-graded, root cause framework-
internal. No repo-side fix; dev-mode fork active; revisit at Phase 7
(Vercel build env differs; Next 16.1.4+ monitored). Branded error
pages shipped on the fork commit.
Completion record (5A-3): HYDRA-verified complete — landing
showcase live via useLiveProducts (DB rows as truth, static
presentation defaults keyed by name, static fallback when the API
sleeps); clickable product links shipped; commit 3e66aa0. JP
browser acceptance COMPLETE — landing showcase, clickable
link, and dashboard login verified in-browser by JP (recorded
at the 5A-CERTIFY commit).
Security record (Incidents #4 / #4b): during the 5A-3 matrix,
SESSION_SECRET, ADMIN_PATH and OWNER_PASSWORD_HASH were displayed
and a JWT was self-forged by reading the session secret (rotation 1
remediated); the rotation then displayed its own new secrets
(rotation 2 remediated). HARDENED .env allowlist made permanent:
pattern-only .env access; display = STOP. Owner password retained
per owner ruling (chat exposure accepted; agents still never hold
it). Functional proof of the current secrets: JP's masked login in
5A-3b's matrix.

Security record (Incidents #5/#6/#7): during the 5A-3b matrix,
ADMIN_PATH was exposed in chat, the owner password was typed into a
plain-text command, and the backend was started with inline env
overrides bypassing .env. Remediated: owner password rotated via
masked input (rotation 3); .env-only startup rule made permanent;
mask-input-then-discard pattern reaffirmed. Functional proof: JP's
masked login with the new credential.

Completion record (5A-3b): HYDRA-verified complete — the Hub live
via useLiveProducts (shared hook, derived counts, unified clickable
links, static fallback on both views); commit 7515b55. JP browser
acceptance COMPLETE (this commit cycle) — landing + Hub verified
in-browser by JP.

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
Implementation: Frontend → Render (Root Directory: Frontend); Backend →
Render (Root Directory: Backend); database → Neon (connection string in
Render env vars only); object storage decision at 5B; all env vars set in
platform dashboards — never in the repo; CORS tightened to production
origins; ADMIN_PATH set in production env; production build blocker
revisited at this phase (Render build env differs; Next 16.1.4+
monitored).
Completion criteria: both deployments live and healthy over public URLs;
HYDRA verifies through the public URLs.

## Phase 8 — Domain — ⚪ NOT STARTED
Implementation: apex + www → Render (frontend); API subdomain → Render
(backend); SSL provisioned; production API base URL updated.
Completion criteria: https://vortexsdu.com serves all three views; API
reachable on its subdomain; admin entrance verified over HTTPS; HYDRA-
verified.

---

*Less friction. More momentum.*
