# Zip Filter — Bundle Approach (`feature/zip-filter-bundle`)

## How it works

The allowed zip code list is compiled directly into the JavaScript bundle as a `Set<string>`. When the user clicks Next on Step 1, `react-hook-form` runs the Zod schema synchronously. The `zip_code` field has a `.refine()` that calls `validateZip()`, which does a `Set.has()` lookup. If the zip is not in the Set, Zod returns an error and the form blocks progression — no network request, no loading state.

## File map

| File | Role |
|------|------|
| `src/data/allowedZips.ts` | Source of truth — the `ALLOWED_ZIPS` Set |
| `src/utils/validateZip.ts` | `validateZip(zip): boolean` — trims and checks against the Set |
| `src/lib/validation.ts` | Zod `step1Schema` — `.refine(validateZip, "...")` on the `zip_code` field |

## How to update the zip list

1. Open `src/data/allowedZips.ts`
2. Add or remove zip code strings from the `ALLOWED_ZIPS` Set
3. Commit and redeploy — the new list takes effect on the next deployment

```ts
// src/data/allowedZips.ts
export const ALLOWED_ZIPS = new Set<string>([
  '10001',
  '10002',
  // add new zips here
])
```

## Tradeoffs

**Pros**
- Instant, synchronous validation — zero latency, no spinner
- No backend dependency at validation time
- Simple to reason about and test

**Cons**
- Requires a code change + redeploy to update the zip list — not editable by non-engineers
- The full zip list is visible in the compiled bundle (not a security concern for a service-area check, but worth noting)
- Does not scale well to thousands of zips (Set lookup stays O(1), but bundle size grows linearly)

## Error message

A zip not in the list displays inline beneath the zip field:

> Sorry, we don't yet have service in this area, please try back on a future date.
