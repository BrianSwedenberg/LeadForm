## Phase 3 — Attribution Fields — Complete

### Goal
Add three auto-populated attribution fields to the Leads_Metadata table and submission model.

### Fields added
- `full_domain` — full URL of submission page (e.g. https://www.example.com/heloc)
- `lead_submission_page` — pathname only (e.g. /heloc)
- `root_domain` — root domain only (e.g. example.com)

### Rules
- All three populated from window.location at submission time
- No UI changes
- Nullable text columns in Supabase

### Tasks
1. [x] Write and apply a Supabase migration
2. [x] Update TypeScript types
3. [x] Update submission handler
4. [x] Verify in Supabase after a test submission
5. [x] Update CURRENT_STATE.md