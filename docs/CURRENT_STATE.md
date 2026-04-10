# CURRENT_STATE.md

> Single source of truth for the current state of the application.
> Reflects confirmed, working state only. Edit in place — do not append history.

---

## Phase

**Phase 3 — Complete**
Attribution fields (full_domain, lead_submission_page, root_domain) added to Leads_Metadata, migration applied, and verified via test submission in Supabase.

---

## Deployment

| Target | Status |
|--------|--------|
| Vercel (prod) | Live — auto-deploys from `main` |
| Local dev | `npm run dev` |
| Embed build | `npm run build:embed` → `dist/embed/lead-form.js` |

---

## Supabase

**Project:** WaterCRM
**Ref:** `kesxpzvfnqdbrfxxlxua`
**Region:** West US (Oregon)

### Tables

#### `Leads`
| Column | Type | Notes |
|--------|------|-------|
| LeadID | INTEGER (identity PK) | |
| first_name | TEXT | |
| last_name | TEXT | |
| zip_code | TEXT | |
| phone | TEXT | Stored as text — preserves leading zeros |
| email | TEXT | |
| address1 | TEXT | Collected by form; unused today |
| address2 | TEXT | Collected by form; unused today |
| city | TEXT | Collected by form; unused today |
| state | TEXT | Collected by form; unused today |
| zip | TEXT | Collected by form; unused today |
| submitted_at | TIMESTAMPTZ | ISO 8601, set at submission time |

#### `Leads_Metadata`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | gen_random_uuid() |
| LeadID | INTEGER (FK → Leads.LeadID) | |
| utm_source | TEXT | |
| utm_medium | TEXT | |
| utm_campaign | TEXT | |
| utm_term | TEXT | |
| utm_content | TEXT | |
| lead_form_survey_answers | JSONB | own_rent, water_source, taste_odor, timeline, financing |
| referrer | TEXT | document.referrer at mount time |
| full_domain | TEXT | window.location.href at submission time (e.g. https://www.example.com/heloc) |
| lead_submission_page | TEXT | window.location.pathname at submission time (e.g. /heloc) |
| root_domain | TEXT | window.location.hostname at submission time (e.g. example.com) |

### RLS

Both tables have RLS enabled. Policy on both: `"Allow anonymous inserts"` — anon role can INSERT, all other operations denied.

### Function

`submit_lead()` — SECURITY DEFINER, runs as postgres owner.
Inserts into `Leads` then `Leads_Metadata` atomically. Returns void.
`GRANT EXECUTE ... TO anon` — callable by the anonymous Supabase key.

**Parameters:** `p_first_name`, `p_last_name`, `p_zip_code`, `p_phone`, `p_email`, `p_submitted_at`, `p_utm_source`, `p_utm_medium`, `p_utm_campaign`, `p_referrer`, `p_survey_answers` (JSONB), `p_full_domain`, `p_lead_submission_page`, `p_root_domain`

### Migrations applied (all 4)

| File | Description |
|------|-------------|
| `20260408000000_initial_schema.sql` | Creates Leads + Leads_Metadata with RLS |
| `20260408000001_add_submitted_at_and_referrer.sql` | Adds submitted_at to Leads, referrer to Leads_Metadata |
| `20260408000002_fix_rls_anon_insert_leads.sql` | Re-establishes RLS policies idempotently |
| `20260408000003_submit_lead_fn.sql` | Creates submit_lead() SECURITY DEFINER function |
| `20260409000000_add_page_attribution_fields.sql` | Adds full_domain, lead_submission_page, root_domain to Leads_Metadata; updates submit_lead() signature |

---

## Submission Flow

`Form → submitLead(payload)` in `src/lib/submitLead.ts`
→ `supabase.rpc('submit_lead', { ...args })` via lazy-initialized client in `src/lib/supabase.ts`

`submitLead.ts` is the only file that may reference the backend.

---

## Environment Variables

| Variable | Used in |
|----------|---------|
| VITE_SUPABASE_URL | src/lib/supabase.ts |
| VITE_SUPABASE_ANON_KEY | src/lib/supabase.ts |

---

## Frontend

**Stack:** React 18 + Vite + TypeScript + Tailwind v4 + Framer Motion + Zustand + React Hook Form + Zod

**Steps:**
1. `Step01.tsx` — Zip code, home ownership, water source, taste/odor
2. `Step02.tsx` — First name, last name, email
3. `Step03.tsx` — Phone, timeline, financing interest
4. `Step04.tsx` — Success confirmation (no inputs)

**Key files:**
- `src/types/LeadPayload.ts` — TypeScript interface for the submission payload
- `src/store/formStore.ts` — Zustand store (form state + step navigation)
- `src/lib/validation.ts` — Zod schemas
- `src/App.tsx` — Root; AnimatePresence step transitions

---

## Known Limitations

- `database.types.ts` does not enumerate RPCs — `supabase.rpc` is cast to `any` in `submitLead.ts`
- address1, address2, city, state, zip columns exist in schema but are not collected by the current form
