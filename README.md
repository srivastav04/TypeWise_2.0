# TypeWise (v2)

TypeWise v2 is a modern, production-ready typing practice web application.  
This version reimplements the original TypeWise using a modern TypeScript-first stack and adds configurable timed modes, improved analytics, and user search.

## Highlights
- Timed practice: preset and custom timers (train for speed or accuracy).
- Accuracy-first mode (no timer) & hybrid scoring (time + accuracy).
- Stats page with historical session metrics and visual summaries.
- Search users to discover other learners and compare stats.
- Modern stack: Next.js (frontend), NestJS (backend), Prisma + PostgreSQL/MongoDB (DB), TypeScript, and Shadcn UI primitives.

---

## Tech stack
**Frontend**
- Next.js (App Router)
- TypeScript
- shadcn/ui (UI primitives)
- Tailwind CSS
- React Query / fetch for API calls
- Framer Motion (optional micro-interactions)

**Backend**
- NestJS (TypeScript)
- Prisma (ORM) — works with PostgreSQL or MySQL
- JWT/Clerk (auth) - optional, easily pluggable
- Docker (optional) for local services

---

## Features
- Preset timers (e.g., 15s, 30s, 60s) and custom timer input.
- New attribute Accuracy.
- Hybrid scoring mode combining WPM and accuracy.
- Stats page: session history, accuracy trends, and best scores.
- Search users with basic endpoint for discoverability.
- Minimal admin endpoints to view/remove stats (extendable).

---

## Repo layout (recommended)
