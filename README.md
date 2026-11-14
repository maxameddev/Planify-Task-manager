<<<<<<< HEAD
# Planify

Planify is a simple task planning app built with Next.js App Router and Tailwind CSS.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Checks

```bash
npm test
npx tsc --noEmit
npm run lint
npm run build
```

## Authentication setup

Copy `.env.example` to `.env`, then set the MongoDB Atlas URI, a unique Better Auth secret, and Google OAuth credentials. Generate a secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

For Google OAuth, add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI. The Better Auth MongoDB adapter creates its auth collections when first used; task collections and task models are separate project work.

## Pages

- `/` — Home
- `/login` — Sign in
- `/register` — Create an account
- `/dashboard` — Task dashboard

## Project layout

```text
app/                         App Router pages and API endpoints
features/auth/               Better Auth setup, forms, and verification
features/tasks/              Task model, API contract, ordering, and dashboard UI
components/                  Shared branding, theme, language, and UI primitives
lib/                         Shared database and localization infrastructure
tests/                       Unit tests for task and auth rules
```
=======
# Planify-Task-manager
Planify is simple web app that manager your daily task created for managers, students, Freelancer and multitasker.
>>>>>>> dffebfb04c4aa557e706f1a7495a8029f090d3fe
