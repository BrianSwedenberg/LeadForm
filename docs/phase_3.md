## Phase 3 — Attribution Fields

### Goal
Add three auto-populated attribution fields to the leads table and submission model.

### Fields to add
- `full_domain` — full URL of submission page (e.g. https://www.example.com/heloc)
- `lead_submission_page` — pathname only (e.g. /heloc)
- `root_domain` — root domain only (e.g. example.com)

### Rules
- All three populated from window.location at submission time
- No UI changes
- Nullable text columns in Supabase

### Tasks
1. Write and apply a Supabase migration
2. Update TypeScript types
3. Update submission handler
4. Verify in Supabase after a test submission
5. Update CURRENT_STATE.md