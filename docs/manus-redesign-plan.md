# CPC Web Redesign Plan — Manus UI/UX + Ours, Merged

Source of the new design: `D:\cpc-manus` (a Vite/React/wouter prototype called internally
"Quiet Clinical Garden" — ivory canvas, forest-green anchor, blue accent, DM Sans + Manrope
fonts). This is **not** a copy/paste job — it's a Vite SPA, our `apps/web` is Next.js 16 App
Router wired to real data/auth/booking/commerce. This doc is the section-by-section decision
record for what gets ported from Manus vs. kept from our current `apps/web`, so the actual
rewrite stays consistent. Confirm/correct this before I start building.

## Non-negotiables

- **Logo & favicon: ours.** `apps/web/public/images/logo.png` and `favicon_io/*` stay exactly
  as-is. Manus's generated brand mark (`cpc-brand-mark.png`, a green/blue swirl) is not used
  anywhere.
- **Stack stays ours.** Next.js 16 App Router, our routing, our SDK/hooks/auth/booking/cart —
  Manus's pages are static visual mockups (forms `preventDefault()` and toast a fake success).
  We take the layout, spacing, color system, and copy tone; we do not take Manus's fake
  data-fetching or routing.
- **Reusability/DRY:** every section gets built once as a component in `packages/ui` (or
  `apps/web/src/components/sections` if it's not shared with dashboard/mobile) and reused across
  pages — not copy-pasted per page the way Manus's JSX literally inlines full markup per route.
- **Em dashes:** Manus's copy uses em dashes throughout (e.g. "a conversation over time—not a
  one-time decision"). When the real rewrite lands, sweep all touched files and rewrite those to
  periods/commas/"and"/"but", per the standing no-em-dash rule.

## Design system (take from Manus, port into `packages/ui`)

- Color tokens: ivory background, mist/sage light greens, forest-green primary, blue accent,
  ink/night text — defined as CSS variables in `oklch()`, light + dark variants. This is close in
  spirit to our current dark-green/blue palette (`#1B5E20` / `#2563EB`) from the last brand pass —
  treat Manus's token set as the refined, fuller version of the same idea, not a departure from it.
- Typography: **DM Sans** (body) + **Manrope** (display/headings), both Google Fonts. Manrope
  headings use tight tracking (`tracking-[-0.045em]` to `-0.065em`) and `font-extrabold` — this is
  the single biggest reason Manus reads as more "designed" than our current site.
- Shape/elevation: large radii (`rounded-[1.5rem]`/`rounded-[2rem]`/`rounded-3xl`), two shadow
  levels (`shadow-soft`, `shadow-lift`), 8px-border "photo frame" treatment on hero images.
  Buttons: `btn-primary` (solid forest, pill), `btn-secondary` (outlined), `btn-light` (white, for
  use on dark CTA bands), `btn-quiet` (text link with arrow).
- These become Tailwind `@theme` tokens + a handful of `@layer components` utility classes in
  `packages/ui/src/styles/globals.css`, replacing/extending the current token set.

## Section-by-section source of truth

| Section | Source | Notes |
|---|---|---|
| Hero (home) | **Manus** layout + copy tone + `cpc-hero-telehealth.jpg` | Swap CTA hrefs to our real `/booking`(or equivalent)/services routes |
| Insurance trust bar (home) | **Both, as two variants** | Manus's quiet text-only strip (`TrustBar`) for the homepage placement near the hero; our existing logo-fetching `InsurerCard` grid (live favicon lookup, no static assets needed) available as the fuller variant — build both, decide placement together (quiet strip near hero, full logo grid lower on page or reserved for `/insurance`) |
| `/insurance` page | **Ours** (content/data/logic) with **Manus's page layout** (`PageHero` + section rhythm) | Keep our real live-fetched insurer logos; restyle the page shell to match Manus |
| Stats strip (1,000+ / 10+ / 5+ / 95%) | **Manus** component | Numbers already match ours exactly — just needs the new visual (bordered card, divided grid) |
| Services section (home + `/services`) | **Manus** layout (`ServiceCard`/`ServicesGrid`) + **our** service content | Our existing service descriptions (highlights, "who it's for") are more developed than Manus's one-liners — merge Manus's card visual with our fuller copy |
| "How it works" steps | **Manus** layout (`HowItWorks`, numbered cards) + **our** 3-step copy | Copy already nearly identical (Request → Assessment → Begin ongoing care) |
| Mission/founder preview ("A practice built for real life") | **Manus** layout (`FounderPreview` split card) | Use the real owner photo once available (per `AGENTS.md` pending item) instead of Manus's stock portrait; real bio copy, not Manus's fictional "Maya Patel" |
| Conditions section ("Care for the whole picture") | **Mixed** | Left column (eyebrow/heading/body copy) from Manus as-is; right column swaps Manus's plain pill-cloud for **our** richer condition/service tag cards — recommend 8–10 cards in a responsive grid, not a wrapped pill list |
| Team section ("Meet the care team") | **Manus** `ProviderCard`/grid layout | Real provider data + real or generated photos (see image asset list) instead of Manus's 4 fictional providers |
| Resources section ("From the care library" / closing "A steadier way forward") | **Manus** layout (`ResourceCard`/grid + the closing three-tile "Clear / Connected / Human" block) | Content: reuse Manus's 6 article topics as a starting editorial calendar (they're generic enough to be genuinely ours), or swap in real authored articles if/when available |
| Final CTA band | **Manus** `CtaBand` component | Dark forest card, decorative ring, wired to our real booking route |
| Footer | **Mixed** | Manus's 4-column dark layout/rhythm (brand+social / Explore / For patients / Talk with our team) — but add what Manus is missing: real lucide contact icons (phone/mail/clock/map-pin, not Manus's bare "f / ig / in" text-letter social icons), our real business hours/contact constants, and our fuller legal link row |
| Other inner pages (About, Service detail, Doctors, Doctor detail, Resources index/detail, FAQ, Contact, Careers, Refer, Shop/Product/Cart/Checkout, patient sign-in visuals, booking flow) | **Manus UI/UX patterns**, content rewritten/expanded by us | Manus's `PageHero`, section spacing, and card patterns are solid and worth adopting everywhere; but its per-page copy is intentionally generic filler (e.g. the exact same "what it can look like" paragraph shape reused for every service). Where we already have more specific real content (service highlights, insurance FAQ, legal pages), keep ours; where Manus's structure is genuinely better organized (e.g. doctor detail page, article page with sticky TOC, FAQ grouped accordions, referral 3-step explainer), adopt that structure and write fuller real copy into it |
| Booking flow / patient portal sign-in screens | **Manus visual style**, **our real logic** | Manus's booking is a 3-step visual mockup and portal sign-in is a fake form; we keep our actual working booking/auth flows and just restyle them to match |

## Open items to confirm before I start building

1. **Owner/provider photos** — do we have real photos for the doctors yet, or should I use the
   Manus/generated placeholders (see the separate image asset list) until real ones arrive?
2. **Insurance section placement** — quiet text strip near the hero + full logo grid further down
   the homepage, or only one of the two on the homepage (with the other reserved for `/insurance`)?
3. **Resources content** — reuse Manus's 6 generic article topics as real published articles, or
   do you have real article copy to provide?
4. Anything in the "Other inner pages" row you want prioritized first (e.g. ship home + services +
   doctors first, legal/shop pages later)?
