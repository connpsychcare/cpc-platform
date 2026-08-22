# Homepage Fix Plan

All content shared between web and mobile MUST come from `packages/shared/src/constants/app.ts`.
Never hardcode marketing text, lists, or data inside app code.

---

## Ground Rules

- Source of truth for copy/data: `packages/shared/src/constants/`
- Web icon rendering: `appIconMap` from `@workspace/ui/lib/icons`
- Mobile icon rendering: `AppIcon` component with `AppIconName`
- When a section exists on both web and mobile, the layouts adapt but the DATA is identical
- Section order on both platforms must match

---

## Section-by-Section Issues (Homepage)

### 1. Insurance Section (`InsuranceTrustBar`)
**Problem:**
- Logo image container is `rounded-xl` - user wants `rounded-full`
- Mobile shows logos in a single-column stacked list - web shows 2-col grid
- Both apps hardcode the `INSURERS` array locally

**Fix:**
- Add `publicInsurers` to `packages/shared/src/constants/app.ts`
- Mobile: use `publicInsurers`, change logo to `rounded-full`, change layout to 2-column grid
- Web: use `publicInsurers`, change logo to `rounded-full`

---

### 2. Services Section ("Psychiatric Services for Every Stage of Life")
**Problem:**
- Mobile cards are left-aligned list-style (icon left + service ID badge top-right)
- Web cards are centered (icon top-center, title center, first card = primary bg, hover lift)
- Mobile completely ignores the `isActive` / first-card-primary pattern

**Fix (mobile only):**
- Rewrite `ServicesSection` mobile cards to match web:
  - `items-center text-center` layout
  - Icon size-18 rounded-3xl, centered above title
  - Title + subtitle text center
  - "Learn more →" CTA at bottom, hidden until press/active
  - First card gets primary bg (`isActive = index === 0`)

---

### 3. Steps Section ("How We Get You Started")
**Problem:**
- Web `StepsSection` hardcodes step content locally - mobile uses `publicHomeSteps` from shared
- Mobile first step has no visual distinction - web first step has primary bg (`isActive`)

**Fix:**
- Web: replace hardcoded `steps` array with `publicHomeSteps` from shared constants
- Mobile: add `isActive = index === 0` check, render first step with primary bg like web

---

### 4. Our Mission (`HomeAboutPreview`)
**Problem:**
- Both apps hardcode `STATS = [{ value, label }, ...]` locally
- Mobile says "ok", but web might differ slightly visually

**Fix:**
- Add `publicHomeAboutStats` to shared constants (3 stats: Patients Served, Years in Practice, Satisfaction)
- Both apps import from shared instead of hardcoding

---

### 5. Mental Health Conditions (`ConditionsTreated`)
**Problem:**
- Both apps hardcode `CONDITIONS` array locally
- Web layout is a 2-column sticky split (heading left, grid right) - mobile is stacked (heading → grid → callout → CTAs)
- Web uses lucide icons directly; mobile uses `AppIconName`/`AppIcon`
- User says mobile is OK, web needs to match mobile

**Fix:**
- Add `publicConditions` to shared constants (label + icon as AppIconName + href)
- Mobile: use `publicConditions` from shared (drop local array)
- Web: use `publicConditions` + `appIconMap`; restructure layout to match mobile:
  - Heading full-width on top
  - Conditions grid below (2-col sm, 3-col lg)
  - Evidence callout card below grid
  - CTAs in a flex-row at bottom

---

### 6. Our Team (`TeamSection` / `DoctorsSection`)
**Problem:**
- Web: compact 2–3 column grid, `h-56` photo, name+role below card (no overlay) - looks great
- Mobile: tall single-column cards `h-[320px]` with floating white overlay at bottom - user says "too lol"

**Fix (mobile only):**
- Change to 2-column grid (`flex-row flex-wrap`)
- Reduce photo height to `h-52`
- Move name+role below the image (no floating overlay)
- "View Profile" button below name/role in card content
- Match web's placeholder initials style
- Web: update hardcoded heading/description to use `publicHomeTeamContent` from shared

---

### 7. CTA Section (last section)
**Problem:**
- Mobile renders buttons stacked in a column (`gap-3`)
- Web renders buttons in a flex-row `flex flex-wrap gap-4`

**Fix (mobile only):**
- Change button container to `flex-row flex-wrap gap-3` so buttons sit side-by-side

---

## Shared Constants to Add

In `packages/shared/src/constants/app.ts`:

```ts
// Insurance providers (for InsuranceTrustBar)
export type PublicInsurer = { name: string; note: string; domain: string; abbr: string; color: string; };
export const publicInsurers: PublicInsurer[] = [ /* 8 CA insurers */ ];

// Mental health conditions (for ConditionsTreated)
export type PublicCondition = { label: string; icon: AppIconName; href: string; };
export const publicConditions: PublicCondition[] = [ /* 12 conditions */ ];

// About section stats (for HomeAboutPreview dark card)
export const publicHomeAboutStats = [
  { value: "500+", label: "Patients Served" },
  { value: "10+", label: "Years in Practice" },
  { value: "95%", label: "Patient Satisfaction" },
] as const;
```

---

## Files to Change

| File | Change |
|------|--------|
| `packages/shared/src/constants/app.ts` | Add publicInsurers, publicConditions, publicHomeAboutStats |
| `apps/mobile/components/section/insurance-trust-bar.tsx` | 2-col grid, rounded-full logos, shared constants |
| `apps/web/src/components/shared/InsurerLogo.tsx` | rounded-full logos, shared constants |
| `apps/web/src/components/sections/InsuranceTrustBar.tsx` | use publicInsurers |
| `apps/mobile/components/section/services-section.tsx` | centered cards, isActive first card |
| `apps/web/src/components/sections/StepsSection.tsx` | use publicHomeSteps from shared |
| `apps/mobile/components/section/steps-section.tsx` | isActive first step |
| `apps/mobile/components/section/home-about-preview.tsx` | use publicHomeAboutStats |
| `apps/web/src/components/sections/HomeAboutPreview.tsx` | use publicHomeAboutStats |
| `apps/mobile/components/section/conditions-treated.tsx` | use publicConditions |
| `apps/web/src/components/sections/ConditionsTreated.tsx` | use publicConditions, stacked layout |
| `apps/mobile/components/section/team-section.tsx` | 2-col grid, compact photos, no overlay |
| `apps/web/src/components/sections/DoctorsSection.tsx` | use publicHomeTeamContent |
| `apps/mobile/components/section/cta-section.tsx` | buttons flex-row flex-wrap |
