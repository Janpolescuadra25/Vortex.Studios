# VORTEX STUDIOS

An independent digital product studio. Ready-made software — built to move.

> Less friction. More momentum.

## What this repository is

The source of truth for the Vortex Studios web presence and services:

- `Frontend/` — the vortex.studio experience (Landing · The Hub · What's New)
- `Backend/` — the API service powering The Hub, What's New, Stats and
  site configuration
- `Owner Dashboard` — a hidden, authenticated control surface for the
  studio owner: landing content, appearance, media and What's New management

Every product. Built by Vortex Studios. No exceptions.

## The lineup

Snapshot — canonical data lives in the platform's data layer.

| Product | Lane | Status |
|---|---|---|
| Haypbooks | Accounting | LIVE |
| Qyra | Automation | LIVE |
| Zypra | Automation | IN DEVELOPMENT |
| Cirqa | Social | PLANNED |
| Lumora | E-Commerce | PLANNED |
| Project: Arena | Games | CONCEPT |
| Project: Bastion | Games | CONCEPT |
| Project: Overdrive | Games | CONCEPT |
| Project: Emberfall | Games | CONCEPT |

New lanes. Same standard.

## Stack

- Frontend: Next.js · React · TypeScript · Tailwind CSS
- Backend: Node.js API · Prisma · PostgreSQL (local dev · Neon in production)
- Hosting: Vercel (Frontend) · Render (Backend) · Neon (Database)

## Working this repo

- `Road_Map.md` — phase tracking; the verified source of project position.
- Roles: CYPRA plans · HYDRA verifies · MANTRA executes. No crossings.
- Secrets never enter git or chat. Credentials live in `.env` (local) and
  platform env vars (production). `.env.example` documents key names only.
- Owner credentials are stored hashed. Never in code, never in prompts.

## Status

Phase 1 — bootstrap in progress. Implementation lands phase by phase
(see Road_Map.md).

---

spin up · ship · repeat
