# **Project Spec — \[Water Lead Form\]**

**For Claude Code**: Read this entire file before writing any code. When instructions here conflict with assumptions, always defer to this spec. Ask for clarification before proceeding if any required section is marked `TODO`.

---

## **1\. Project Overview**

**What this is:** This is a multi-step lead form, designed to be embedded on marketing sites and landing pages to collect customer information and submit the leads to a backend.

**Who it's for:** Lead form will be embedded on a marketing site for home water filtration installation company.  End users will be potential customers looking to learn more information about home water treatment solutions

**Definition of done:** A fully operational lead form, deployed on vercel, that can be visited via browser, operates per the spec, and submits leads successfully to the API.

---

## **2\. Tech Stack**

Do not deviate from this stack without explicit instruction.

| Layer | Technology |
| ----- | ----- |
| Framework | React (Vite) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Form state | React Hook Form \+ Zod |
| Global state | Zustand |
| Animation | Framer Motion |
| Backend (Phase 1\) | n8n webhook (no credentials required) |
| Backend (Phase 2\) | Supabase (JS client) |
| Hosting (dev) | Vercel |
| Embed target | Webflow (custom code block) |

**Build modes:**

* `npm run dev` — local development SPA  
* `npm run build:vercel` — SPA output for Vercel testing  
* `npm run build:embed` — single bundled JS file for Webflow embed

**Bundle constraint:** Final embed bundle must be under 80KB gzipped.

---

## **3\. Repository Structure**

/  
├── src/  
│   ├── components/  
│   │   ├── steps/          \# One file per form step  
│   │   └── ui/             \# Shared UI primitives (Button, ProgressBar, etc.)  
│   ├── store/              \# Zustand store(s)  
│   ├── lib/  
│   │   ├── submitLead.ts   \# Submission abstraction — swap internals per phase  
│   │   ├── supabase.ts     \# Phase 2 only — lazy-initialized Supabase client  
│   │   └── validation.ts   \# Zod schemas  
│   ├── types/              \# Shared TypeScript types  
│   └── App.tsx  
├── designs/  
│   ├── step-01-\[zip\]/     \# Stitch export per step (screen.png, code.html, DESIGN.md)  
│   └── step-02-\[contact\]/  
│   └── step-03-\[submit\]/  
│   └── step-04-\[success\]/  
├── supabase/  
│   └── migrations/         \# SQL migration files  
├── SPEC.md                 \# This file  
└── vite.config.ts

---

## **4\. Step Definitions**

Define each step fully. Copy this block once per step.

### **Step 1 — \[Intro \+ Zip Entry\]**

**Question text:** Zip Code

	**Required?:** Yes

**Input type:** Text

**Validation:**

* Valid US zip code (5 digit number)  
  **Field name (for submission payload):** `zip_code`

**Question text:** Home Status

	**Required?:** No

**Input type:** Fixed Text

**Options (if applicable):**

* “Own”  
* “Rent”  
* NULL  
  **Field name (for submission payload):** `own_rent`  
  **Include in MetaData Blob:** `Yes`

**Question text:** Water Source

	**Required?:** No

**Input type:** Fixed Text

**Options (if applicable):**

* “Well Water”  
* “City Water”  
* NULL  
  **Field name (for submission payload):** `water_source`  
  **Include in MetaData Blob:** `Yes`

**Question text:** Does your water have a strong taste or odor?

	**Required?:** No

**Input type:** Fixed Text

**Options (if applicable):**

* “Yes”  
* “No”  
* NULL  
  **Field name (for submission payload):** `taste_odor`  
  **Include in MetaData Blob:** `Yes`

### **Step 2 — \[Customer Info\]**

**Question text:** First Name

	**Required?:** Yes

**Input type:** Text

**Validation:**

* No special characters  
  **Field name (for submission payload):** `first_name`

**Question text:** Last Name

	**Required?:** Yes

**Input type:** Text

**Field name (for submission payload):** `last_name`

**Question text:** Email Address

	**Required?:** Yes

**Input type:** Text

**Validation:**

* Valid email address (contains “@” and ends with a valid top-level domain)  
  **Field name (for submission payload):** `email`

### **Step 3 — \[Phone \+ Timeline\]**

**Question text:** Mobile Phone

	**Required?:** Yes

**Input type:** Text

**Validation:**

* Valid 10 digit phone number  
  **Field name (for submission payload):** `phone`

**Question text:** Start Timeline

	**Required?:** No

**Input type:** Fixed Text

**Options (if applicable):**

* “Immediately”  
* “1-2 Weeks”  
* “Flexible”  
  **Field name (for submission payload):** `timeline`  
  **Include in MetaData Blob:** `Yes`

**Question text:** Interested in Financing?

	**Required?:** No

**Input type:** Boolean

**Options (if applicable):**

* “True”  
* “False”  
* “Null”  
  **Field name (for submission payload):** `financing`  
  **Include in MetaData Blob:** `Yes`

### **Step 4 — \[Success Confirmation\]**

     No questions in this step \- this is purely text \- see design files   
---

## **5\. Data & Submission**

### **Submission abstraction**

The form always calls a single `submitLead(payload)` function. The implementation behind it changes per phase. Form components must never call a backend directly — always go through this function. This makes the Phase 1 → Phase 2 swap a one-file change.

// src/lib/submitLead.ts  
export async function submitLead(payload: LeadPayload): Promise\<void\> {  
  // Phase 1: POST to n8n webhook  
  // Phase 2: swap this for Supabase JS client insert  
}

### **Submission payload**

{  
  // Metadata  
  Metadata : {    
    own_rent: string,  
    water_source: string,          
    taste_odor: string,  
    timeline: string,  
    financing: string,          
  }

  // Contact info  
  zip_code: string,  
  first_name: string,  
  last_name: string,  
  email: string,  
  phone: string,       

  // Attribution (auto-captured, not shown to user)  
  utm_source: string | null,  
  utm_medium: string | null,  
  utm_campaign: string | null,  
  referrer: string | null,  
  submitted_at: string,       // ISO 8601 timestamp  
}

### **Phase 1 — n8n webhook (current)**

**Endpoint:** `https://bswedenberg.app.n8n.cloud/webhook/2642a804-07a4-444c-a449-7ac9287b5f8f`

**Method:** `POST`

**Auth:** None required

**Content-Type:** `application/json`

**Purpose:** Receives the payload and writes it to a Google Sheet for inspection. Used to validate the form is submitting correct data before the database is connected.

### **Phase 2 — Supabase (do not implement yet)**

The schema below is a placeholder and will be updated when we proceed to phase 2

\-- TODO: Replace with actual table name  
create table leads (  
  id uuid primary key default gen\_random\_uuid(),  
  \-- survey fields  
  field\_name\_1 text not null,  
  field\_name\_2 text not null,  
  \-- contact fields  
  first\_name text not null,  
  last\_name text not null,  
  email text not null,  
  phone text,  
  \-- attribution  
  utm\_source text,  
  utm\_medium text,  
  utm\_campaign text,  
  referrer text,  
  submitted\_at timestamptz default now()  
);

**RLS policy (Phase 2):**

alter table leads enable row level security;

create policy "Allow anonymous inserts"  
  on leads for insert  
  to anon  
  with check (true);

### **Success / error handling (both phases)**

**On success:** Show confirmation screen. Do not reset form state.

**On error:** Show inline error message. Allow user to retry. Do not clear form data.

---

## **6\. Design System**

Design source of truth is the Stitch export in `/designs/`. Refer to `code.html` for Tailwind classes and `DESIGN.md` for design rationale. Do not invent styles — derive all styling from the exports.

**If a design detail is ambiguous**, check `DESIGN.md` first, then `screen.png`. If still unclear, use best judgment and add a `// DESIGN QUESTION:` comment in the code for review.

**Animation principles:**

* Step transitions: slide \+ fade (Framer Motion `AnimatePresence`)  
* Button hover: subtle scale \+ color shift  
* No animation should exceed 300ms

All exports can be found in the corresponding directories outlined below

| Step | Designs Folder |

|---|---|

| Step 1 — Zip \+ Intro | /designs/step-01-zip/ |

| Step 2 — Customer Info | /designs/step-02-contact/ |

| Step 3 — Phone \+ Timeline | /designs/step-03-timeline/ |

| Step 4 — Success | /designs/step-04-success/ |

Before building any step component, read the corresponding folder. Check `code.html` for Tailwind classes, `screen.png` for visual reference, and `DESIGN.md` for rationale. Do not style anything from memory.

---

## **7\. Embedding Requirements**

This component will be dropped into a Webflow custom code block as a single `<script>` tag. It must be fully self-contained.

* **No global CSS leakage** — all styles must be scoped  
* **No dependency on Webflow's DOM** — mount to a dedicated `<div id="lead-form-root">`  
* **UTM params** — read from `window.location.search` at mount time  
* **Referrer** — read from `document.referrer` at mount time  
* **No cookies or localStorage required**  
* Must render correctly inside an iframe-like embed context

---

## **8\. Build & Deployment**

**Dev:**

npm run dev

**Deploy to Vercel (SPA test):**

npm run build:vercel  
\# push to main — Vercel auto-deploys

**Build embed bundle:**

npm run build:embed  
\# outputs: dist/embed/lead-form.js

**Vercel env vars required (Phase 1):**

VITE\_N8N\_WEBHOOK\_URL=https://bswedenberg.app.n8n.cloud/webhook/2642a804-07a4-444c-a449-7ac9287b5f8f

**Vercel env vars required (Phase 2, not yet):**

VITE\_SUPABASE\_URL=  
VITE\_SUPABASE\_ANON\_KEY=

---

## **9\. Out of Scope**

Do not build these unless explicitly told to.

* Admin dashboard or lead management UI  
* Email notifications or autoresponders  
* A/B testing logic  
* Multi-language / i18n support  
* Accessibility audit (handle basics only — labels, focus states)

---

## **10\. Open Questions**

Do not block on these — make a reasonable assumption, leave a `// ASSUMPTION:` comment, and move on.