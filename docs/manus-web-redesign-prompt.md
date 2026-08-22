# Manus Prompt — Connected Psychiatric Care Public Website Redesign

Paste everything in the section below into Manus. It is written as a single self-contained brief.
After Manus generates the design/code, download it and tell me the folder path — I will port the
components/pages into `apps/web` (Next.js 16 + React 19 + Tailwind, using our existing `packages/ui`
component primitives), wiring it to our real data instead of rebuilding the app from scratch.

---

## PROMPT START (copy from here down)

### 1. What this is

Design and build a modern, professional, trustworthy marketing website for a real psychiatric
telehealth clinic called **Connected Psychiatric Care**. This is a healthcare business, not a tech
startup — the design needs to feel calm, credible, and human, while still looking current and
polished (think a well-funded modern healthcare brand, not a sterile hospital site and not a
consumer wellness app).

Output should be a full multi-page website (not just a landing page), built with **React + Next.js
+ Tailwind CSS**, componentized, responsive, and accessible (WCAG AA). Use realistic placeholder
content where I haven't given you exact copy — but keep the structure, section order, and intent
exactly as specified below, since this maps to real pages I already have.

### 2. The business

- **Name:** Connected Psychiatric Care (legal name: Connected Psychiatric Care, Professional
  Nursing Corporation)
- **What it does:** Outpatient psychiatric care for adults, adolescents, and children — psychiatric
  evaluation, medication management, and ongoing treatment for depression, anxiety, ADHD, and
  related conditions.
- **Delivery model:** 100% telehealth (secure video visits). There are **no in-person visits** —
  this must read clearly across the site, not be hidden in fine print. Frame it as a strength
  ("care from wherever you are," "no waiting rooms," "licensed California providers on video")
  rather than a limitation.
- **Where:** Licensed to serve patients across California.
- **Who it treats:** Adults and adolescents/children (with parent/guardian involvement for minors).
- **Tone:** Warm, competent, reassuring, plain-spoken. No stigmatizing language. No clinical-cold
  hospital tone, no overly casual "wellness app" tone. Think: a psychiatrist who is both an expert
  and genuinely kind.
- **Proof points to feature:** 1,000+ patients served, 10+ licensed providers, 5+ years of care,
  95% patient satisfaction, a 3-step "how it works" process (Request an appointment → Complete
  your assessment → Begin ongoing care).
- **Insurance accepted (show as a trust bar/logos section):** Aetna, Cigna, UHC/Optum, Anthem BCBS,
  Carelon, Saga, Tricare, Sutter Health, Blue Shield of California, MultiPlan, plus self-pay
  ("Private Pay"). A couple of payers are "coming soon" (Medi-Cal, Health Net, Covered California) —
  show those with a subtle "pending/coming soon" state, not full color.
- **Services to feature (use as the core service list, each needs an icon + short description):**
  1. Psychiatric Evaluation
  2. Medication Management
  3. Telehealth Psychiatry
  4. Depression Treatment
  5. Anxiety Treatment
  6. ADHD Treatment
  7. Child & Adolescent Psychiatry
  8. (a couple more secondary services can be invented in the same style, e.g. OCD/PTSD treatment,
     bipolar disorder management, medication second opinions)

### 3. Brand system (use this, don't invent a new palette)

- **Primary color:** dark green — `#1B5E20` (calm, clinical-credible, not corporate-cold)
- **Accent color:** blue — `#2563EB` (light mode) / `#3B82F6` (dark mode) — used for links, secondary
  CTAs, and highlight accents against the green
- **Neutrals:** clean off-white background, near-black text, soft gray borders/cards — standard
  modern SaaS-healthcare neutral scale
- Must support **light and dark mode**, both accessible (AA contrast minimum, this is healthcare)
- **Typography:** one confident, modern, highly-legible sans-serif for headings (slightly warmer
  than a pure geometric grotesk — something like Inter, Geist, Plus Jakarta Sans, or similar) and a
  clean readable sans for body text. Avoid anything playful/rounded-childish or anything that reads
  as generic corporate Helvetica.
- **Imagery style:** real-feeling photography of telehealth video calls, calm home/therapy-adjacent
  settings, diverse patients (adults, teens, parents with kids) on video calls with providers. Avoid
  cliché stock-photo tropes (handshakes, stethoscopes, people in white coats posed stiffly). Warm
  natural light, not sterile blue hospital lighting.
- **Iconography:** simple outline/line icons (Lucide-style), consistent stroke width, used for
  services, steps, and stats.
- **Shape language:** soft rounded corners on cards (not full pill-everything), generous whitespace,
  subtle shadows/elevation, no heavy borders.
- **Motion:** subtle only — fade/slide-in on scroll, gentle hover lift on cards/buttons. No gimmicks,
  no parallax overload. This is a healthcare site people visit while anxious; motion should feel calm.

### 4. Global structure (every page)

- **Header:** logo left, primary nav center/left, "Patient Portal Sign In" + a strong primary CTA
  button ("Book an Appointment" or "Get Started") on the right. Nav groups: About (with a dropdown:
  About Us, Our Doctors, Careers), Services (dropdown of services), Insurance, Resources, Contact.
  Must collapse into a clean mobile hamburger menu.
- **Footer:** logo + short tagline, contact info (phone, email, hours), quick links to every page
  listed below, social links (Facebook/Instagram/LinkedIn), insurance-accepted mini list, legal row
  (Privacy, Terms, Cookies, Account Deletion), copyright.
- **Sticky/persistent CTA presence:** a recurring "Book an Appointment" CTA band should appear near
  the bottom of most pages, not just the homepage.
- **Trust signals that should recur across pages:** insurance logos bar, stats strip, testimonials,
  licensed-provider badges.

### 5. Pages to design (in priority order)

For each page below, design the full page with real section-level content (not lorem ipsum) —
use the info from section 2/3 above to write it.

#### 5.1 Home
- Hero: strong headline + subhead about compassionate telehealth psychiatric care, primary CTA
  ("Book an Appointment") + secondary CTA ("See How It Works"), supporting hero image/illustration
- Insurance trust bar (logos, scrolling or grid)
- Stats section (the 4 stats above)
- Services grid (6 featured services, icon + title + 1-line description, links to service detail)
- "How it works" 3-step section
- About preview (short owner/practice blurb + photo + "Learn more" link)
- "Conditions we treat" section (tags/pills: Depression, Anxiety, ADHD, OCD, PTSD, Bipolar, etc.)
- Meet the doctors preview (3-4 provider cards, photo/placeholder, name, title, specialties, "View
  all providers")
- Resources preview (2-3 article cards)
- Testimonials section (3 patient quotes, name + initials only for privacy, star rating)
- Final CTA band

#### 5.2 About
- Hero with mission statement
- Practice story / why it was founded
- Owner/founder bio section (photo, credentials, background, personal note — write this as a
  confident, specific bio, not generic filler)
- Mission & values (3-4 value cards: e.g. Accessible Care, Evidence-Based Treatment, Whole-Person
  Approach, Judgment-Free Support)
- "What families/patients can expect" step section
- CTA band

#### 5.3 Services (index)
- Hero
- Full grid of all services (icon, title, subtitle, short description, "Learn more" link)
- CTA band

#### 5.4 Service detail (template — one page, applies to every service via slug)
- Hero with service title + subtitle
- Full description
- "What's included" / highlights list (checkmarks)
- "Who this is for" section
- Related/other services
- CTA band ("Ready to get started?")

#### 5.5 Doctors (index)
- Hero
- Grid of provider cards: photo, name, credentials/title, specialties tags, "View profile"
- CTA band

#### 5.6 Doctor detail (template)
- Photo, name, title/credentials, specialties
- Bio, education, approach to care
- "Book with [Name]" CTA

#### 5.7 Insurance
- Hero explaining coverage philosophy (transparent, will verify benefits for you)
- Full accepted-insurance logo grid (with "coming soon" state for pending payers)
- Self-pay / private pay explanation
- FAQ mini-section about insurance (verifying benefits, copays, etc.)
- CTA band

#### 5.8 Resources (index) + article detail template
- Hero
- Filterable/categorized grid of articles (mental health education content — depression, anxiety,
  ADHD, parenting, medication FAQs, etc.)
- Article detail template: title, hero image, author/date, rich body content, related articles

#### 5.9 FAQ
- Grouped accordion sections (General, Appointments & Telehealth, Insurance & Billing, Medication,
  Privacy & Records)

#### 5.10 Contact
- Contact form (name, email, phone, message, subject dropdown)
- Contact info card (phone, email, hours)
- Embedded map/location visual (service area, not a physical address since telehealth-only)
- FAQ shortcut / "prefer to call" CTA

#### 5.11 Careers
- Hero ("Join our team")
- Why work here / culture blurb
- Open positions list (cards with title, type, location = Remote/California, "Apply" CTA)
- General inquiry CTA if no roles match

#### 5.12 Refer a Patient
- Hero for referring providers/professionals
- Simple referral form (patient info, referring provider info, reason for referral)
- What happens after a referral is submitted (short process steps)

#### 5.13 Shop (index) + product detail template
- Hero
- Product grid (wellness/self-care products relevant to a psychiatric practice — journals,
  light therapy lamps, sleep aids, self-care kits, books)
- Product detail template: images, price, description, add-to-cart, related products
- Cart & checkout pages should follow the same visual system (clean, minimal, trustworthy — this
  is where people enter payment info, so keep it simple and reduce visual noise)

#### 5.14 Patient Portal entry points (visual only)
- Sign in / Sign up screen design (not functional) — should feel like the secure gateway into the
  patient experience: email/phone + password, "Continue with Google", "Continue with Apple",
  forgot password link, clear signup CTA for new patients
- A simple "booking flow" visual (pick a service → pick a provider/time → confirm) — 3-screen flow,
  design only

#### 5.15 Legal / utility pages (lower design priority, but should match the system)
- Privacy Policy, Terms of Service, Cookie Policy, Account Deletion — simple, readable long-form
  content template (title, last-updated date, table of contents sidebar on desktop, body sections)

### 6. What "good" looks like here

- A visitor who is anxious about seeking psychiatric care for the first time should feel reassured,
  not overwhelmed, within 3 seconds of landing on the homepage.
- Every page should have one obvious next action (book an appointment, view a provider, read an
  article) — never a dead end.
- Mobile experience is not an afterthought — a large share of visitors will be on phones, often in
  a moment of stress. Design mobile-first, then scale up.
- Nothing should look like a generic SaaS template with a stethoscope icon slapped on. This should
  feel specifically built for a psychiatric care practice.

### 7. Technical deliverable requirements

- **Stack:** React + Next.js (App Router) + Tailwind CSS. Component-based (one component per
  section, reusable across pages where applicable — e.g. one `ServiceCard`, not copy-pasted markup).
- Use semantic HTML and accessible markup (proper heading hierarchy, alt text, focus states, form
  labels).
- Ship both light and dark mode using CSS variables/Tailwind theme tokens, not hardcoded hex values
  scattered through components.
- Keep components clean enough to lift into an existing design system — avoid inline styles, avoid
  one giant page file per route; break into `components/sections/*` per page.
- Responsive breakpoints: mobile (375px+), tablet (768px+), desktop (1280px+).
- All content on the site can be realistic placeholder copy/images — I will reconnect it to our
  real backend and real content afterward. Structure and design quality matter far more than the
  literal copy being 100% final.

## PROMPT END
