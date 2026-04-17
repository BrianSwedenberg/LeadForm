# WEBFLOW_EMBED.md

## Goal
Bundle the lead form as a self-contained JavaScript widget that can be embedded in any webpage — specifically a Webflow marketing site — via a single `<script>` tag and a target `<div>`.

## Background
The current Vite build outputs a multi-chunk app designed to run as a standalone site. For embedding, we need a single IIFE bundle that includes all dependencies (React, styles, etc.) and mounts itself into a target div on the host page.

## Constraints
- Must not interfere with Webflow's existing styles or JavaScript
- Must work as a single `.js` file — no separate CSS file, no multiple chunks
- Must read env vars at build time (existing `VITE_` prefix pattern)
- Must not redirect on success — success state must be in-place
- Bundle size target: under 80KB gzipped (existing project target)
- Must not break the existing app build (`npm run dev`, `npm run build` unchanged)

## New Files Required

### `vite.widget.config.ts`
A separate Vite config file for the widget build. Key settings:
- `build.lib.formats: ['iife']` — single self-executing bundle
- `build.lib.entry: 'src/widget-entry.tsx'`
- `build.lib.fileName: () => 'lead-form-widget'`
- `build.outDir: 'dist-widget'`
- `build.cssCodeSplit: false` — inline all CSS into the JS bundle
- Do NOT externalize React or any dependencies — everything must be bundled

### `src/widget-entry.tsx`
New entry point specifically for the widget build. Responsibilities:
- Find `document.getElementById('lead-form-root')`
- Mount the React app into that element using `createRoot`
- Handle the case where the target div is not found gracefully (log a warning, don't throw)

## Changes to Existing Files

### `package.json`
Add a new script:
```json
"build:widget": "vite build --config vite.widget.config.ts"
```

### Success State
Audit and confirm that form submission does not trigger any redirect (`window.location.href`, `navigate()`, or similar). If a redirect exists, replace it with an in-place success screen. This must be resolved before the widget build is tested.

## Output
Running `npm run build:widget` should produce:
```
dist-widget/
  lead-form-widget.iife.js
```

## Hosting
The `dist-widget/` output will be served via Vercel. Confirm the bundle is publicly accessible at a stable URL after deploy. The URL should not contain hashed filenames.

## Embed Code
Once hosted, the Webflow integration requires two things:

**In the Webflow Designer** — a Div Block with ID `lead-form-root` placed where the form should appear.

**In Page Settings → Custom Code → Before `</body>`:**
```html
<div id="lead-form-root"></div>
<script src="https://your-vercel-url.vercel.app/lead-form-widget.iife.js"></script>
```

## Testing Before Webflow
Before touching Webflow, validate the widget using `test-embed.html` at the project root:
```html
<!DOCTYPE html>
<html>
<body style="background: gray; padding: 40px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; padding: 20px;">
    <h2>Test Embed Page</h2>
    <p>Content above the form</p>
    <div id="lead-form-root"></div>
    <p>Content below the form</p>
  </div>
  <script src="./dist-widget/lead-form-widget.iife.js"></script>
</body>
</html>
```

Confirm the following before proceeding to Webflow:
- [ ] Form mounts and renders correctly inside a constrained div
- [ ] All six steps navigate correctly
- [ ] No layout overflow or viewport-filling behavior
- [ ] Successful submission shows in-place success state, no redirect
- [ ] Lead appears in Supabase after test submission
- [ ] No console errors

## Out of Scope
- Shadow DOM style isolation (can be added later if style conflicts arise in Webflow)
- Webflow CMS integration
- Any changes to the existing app build or dev server