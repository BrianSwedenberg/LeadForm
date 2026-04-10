# Zip Filter Feature

- The lead form restricts progression past step 1 based on zip code entry
- Three implementations exist on separate branches:
  - `feature/zip-filter-bundle` — client-side Set
  - `feature/zip-filter-edge-fn` — Supabase Edge Function
  - `feature/zip-filter-prefetch` — Zustand prefetch cache
- The `allowed_zip_codes` table exists in Supabase with a single `varchar(10)` primary key column and anon read RLS policy
- Seed zip codes for testing: `10001`, `10002`, `10003`, `07030`, `07302`
- A zip NOT on the list should display: "Sorry, we don't yet have service in this area, please try back on a future date."
