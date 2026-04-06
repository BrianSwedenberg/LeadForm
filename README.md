# Water Lead Form

A multi-step lead capture form built in React, designed to be embedded on a Webflow marketing site for a home water filtration company. Collects contact info and qualifying survey answers, then submits leads to a configurable backend endpoint.

---

## Project Status

**Phase 1 — Active**
Submitting leads to an n8n webhook for validation. Supabase integration is planned for Phase 2.

---

## Quick Start

**Prerequisites:** Node.js 18+

```bash
# Clone the repo
git clone https://github.com/[your-username]/[repo-name].git
cd [repo-name]

# Install dependencies
npm install

# Add environment variables (see Environment Variables section below)
cp .env.example .env.local

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Environment Variables

Create a `.env.local` file in the repo root with the following:

**Phase 1 (current):**
```
VITE_N8N_WEBHOOK_URL=https://bswedenberg.app.n8n.cloud/webhook/2642a804-07a4-444c-a449-7ac9287b5f8f
```

**Phase 2 (not yet active — add when Supabase is connected):**
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

> Never commit `.env.local` to the repo. It is already in `.gitignore`.

---

## Form Flow

The form collects lead information across three steps before submitting:

| Step | Description |
|---|---|
| Step 1 | Zip code + qualifying questions (home status, water source, taste/odor) |
| Step 2 | Contact info (first name, last name, email) |
| Step 3 | Phone number + timeline + financing interest |
| Step 4 | Success confirmation screen |

Full step-by-step field definitions, validation rules, and payload shape are documented in `SPEC.md`.

---

## Project Structure

```
src/
├── components/
│   ├── steps/        # One component per form step
│   └── ui/           # Shared primitives (Button, Input, ProgressBar, etc.)
├── hooks/            # Custom React hooks
├── store/            # Zustand global state
├── lib/
│   ├── submitLead.ts # All backend calls go through here — swap Phase 1 → 2 here
│   └── validation.ts # Zod schemas
└── types/            # Shared TypeScript types
```

Design exports (Stitch) live in `/designs/`, one folder per step.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local development server |
| `npm run build:vercel` | Build SPA for Vercel deployment |
| `npm run build:embed` | Build single JS bundle for Webflow embed |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript compiler check |

---

## Deployment

The app auto-deploys to Vercel on every push to `main`.

To trigger a manual deploy:
```bash
git push origin main
```

The Vercel project dashboard is at: `TODO — add Vercel project URL`

The live Vercel test URL is: `TODO — add deployed URL`

---

## Switching to Phase 2 (Supabase)

When ready to connect Supabase:

1. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to Vercel environment variables
2. Update `src/lib/submitLead.ts` to use the Supabase JS client instead of the n8n webhook
3. Run the migration in `supabase/migrations/` against your Supabase project
4. Update the Phase note in `CLAUDE.md` Section 2

No form components need to change.

---

## Key Documentation

| File | Purpose |
|---|---|
| `SPEC.md` | Full product spec — steps, fields, payload, schema |
| `CLAUDE.md` | Instructions for Claude Code — coding standards, phase, workflow |
| `/designs/` | Stitch design exports — one folder per step |