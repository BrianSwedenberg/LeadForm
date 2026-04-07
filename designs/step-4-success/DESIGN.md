# Design System Strategy: Willow Water Solutions

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Purest Essential."** 

In an industry often cluttered with blue gradients and literal water splashes, we are pivoting toward a high-end editorial aesthetic. This system treats water filtration not as a utility, but as a premium wellness ritual. By stripping away color, we lean into a sophisticated grayscale palette that emphasizes clarity, transparency, and architectural precision.

The layout challenges the traditional "wizard" interface by using intentional asymmetry and tonal depth. We move away from the "flat app" look and toward a layered, tactile experience that feels like flipping through a luxury lifestyle journal.

---

## 2. Colors: The Grayscale Spectrum
This system utilizes a monochromatic palette to convey authority and purity.

### The "No-Line" Rule
To maintain a high-end feel, **1px solid borders are strictly prohibited for sectioning.** Structural boundaries must be defined through background color shifts. For example, a card using `surface-container-lowest` should sit on a `surface-container-low` background. This creates a soft, modern distinction that feels integrated rather than boxed-in.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of fine paper. 
- **Base Layer:** `surface` (#f9f9f9)
- **Secondary Sectioning:** `surface-container-low` (#f3f3f3)
- **Interactive Elements:** `surface-container-highest` (#e2e2e2)
- **Elevated Cards:** `surface-container-lowest` (#ffffff)

### The "Glass & Gradient" Rule
To prevent the grayscale from feeling "stale," use Glassmorphism for floating navigation or modal overlays. Utilize a `surface` color at 70% opacity with a `backdrop-filter: blur(12px)`. For the primary CTA, use a subtle radial gradient transitioning from `primary` (#000000) to `primary_container` (#3b3b3b) to provide a "metallic" sheen and visual soul.

---

## 3. Typography: Editorial Authority
We pair the geometric precision of **Manrope** with the high-readability of **Inter** to create a balanced, modern hierarchy.

- **Display (Manrope):** Large, bold, and authoritative. Use `display-lg` (3.5rem) for high-impact hero statements.
- **Headlines (Manrope):** Use `headline-md` (1.75rem) for question-based headers. The tighter tracking conveys a premium, curated feel.
- **Body (Inter):** All functional text uses Inter. `body-lg` (1rem) provides ample breathing room for long-form legal disclaimers or descriptions.
- **Labels (Inter):** Small caps or high-contrast weight for `label-md` (0.75rem) ensures that even the smallest utility text feels intentionally designed.

---

## 4. Elevation & Depth: Tonal Layering
Depth in this system is a result of light and shadow, not lines.

- **The Layering Principle:** Place a white (`surface-container-lowest`) multi-choice card on a light grey (`surface-container-low`) background. This creates a natural lift without the "heaviness" of a dark border.
- **Ambient Shadows:** For floating elements like the "Next" button or sticky headers, use extra-diffused shadows. 
    - *Spec:* `0px 12px 32px rgba(26, 28, 28, 0.06)`. 
    - The shadow color is a low-opacity version of `on-surface` to mimic natural daylight.
- **The "Ghost Border" Fallback:** If accessibility requires a stroke (e.g., in high-contrast mode), use `outline-variant` (#c6c6c6) at 20% opacity. 100% opaque borders are forbidden.

---

## 5. Components

### Large Multi-Choice Cards
Moving beyond the simple grid, these cards feature 3D-styled grayscale icons.
- **Container:** `surface-container-lowest` (#ffffff) with `xl` (0.75rem) rounded corners.
- **State:** On selection, transition the background to `primary` (#000000) and the icon/text to `on_primary` (#e2e2e2).
- **Spacing:** Use `spacing-4` (1.4rem) padding to ensure the icon has room to breathe.

### Input Fields
- **Background:** `surface-container-low` (#f3f3f3).
- **Border:** None. Use a bottom-only "Ghost Border" of 2px `outline-variant` that scales to `primary` on focus.
- **Typography:** Placeholder text should use `body-lg` in `on_surface_variant` (#474747).

### Progress Bars (The "Step" Indicator)
- **Unfilled Track:** `secondary_container` (#d5d4d4).
- **Filled Progress:** `primary` (#000000).
- **Layout:** Use the `spacing-1` gap between segments to create a fractured, modern timeline rather than a single continuous bar.

### Buttons
- **Primary:** Background `primary` (#000000), text `on_primary_container` (#ffffff). Apply `full` (9999px) roundedness for a pill shape that contrasts against the architectural cards.
- **Secondary:** Background `transparent`, "Ghost Border" at 10% opacity, text `primary`.

---

## 6. Do's and Don'ts

### Do
- **Do** use `spacing-12` (4rem) or higher for vertical section gaps to embrace whitespace.
- **Do** use `surface_dim` (#dadada) for disabled states to keep the palette cohesive.
- **Do** align icons and text asymmetrically when appropriate to create a "custom-built" feel.

### Don'ts
- **Don't** use pure `#000000` for body text; use `on_surface` (#1a1c1c) to reduce eye strain.
- **Don't** use standard Material dividers. If you must separate content, use a `surface-container-high` (#e8e8e8) full-width block or increased vertical white space.
- **Don't** use drop shadows on cards that are already resting on a contrasting surface tier. Let the color shift do the work.