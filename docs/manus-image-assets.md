# Image Assets Needed — CPC Web Redesign

Two sources: images we already have from the Manus prototype (`D:\cpc-manus\client\public\assets`)
that we can reuse directly, and new images to generate (with Manus, or any image generator) using
the prompts below so everything looks like one consistent photo shoot.

Images matter more than almost anything else here — a psychiatric telehealth site lives or dies on
whether the photography feels calm, real, and human rather than stock-photo cold. Prioritize the
**P0** list below before anything else; P1/P2 are what take the site from good to excellent.

## Base style prompt (prepend to every new-image prompt below)

> Warm, editorial healthcare photography for a calm telehealth psychiatry practice. Natural window
> light, soft shadows, muted earthy palette (ivory, warm beige, sage green, walnut wood tones) with
> occasional deep forest-green accents. Real-feeling, diverse people in candid, unposed moments —
> never stiff or overly polished corporate stock photography. Shallow depth of field, shot like a
> 50mm portrait lens. No visible logos, brand names, text, or watermarks anywhere in frame. No white
> coats, no stethoscopes, no clinical/hospital settings — everything happens in warm home or
> home-office environments. High resolution, photographic (not illustrated or 3D-rendered).

## Already available — reuse directly from Manus

These live at `D:\cpc-manus\client\public\assets\` and can be copied straight into
`apps/web/public/images/`.

| File | Shows | Reuse for |
|---|---|---|
| `cpc-hero-telehealth.jpg` | Woman at a home desk, warm light, on a laptop video call with her provider | Homepage hero (primary) |
| `cpc-family-telehealth.jpg` | Mother and teen daughter together on a laptop video visit, living room | About page hero, Child & Adolescent Psychiatry service page, Insurance page hero, Resources hero |
| `cpc-about-founder.jpg` | Woman, curly hair, seated portrait in a warm book-lined room | Founder/mission section (placeholder only — swap for a real owner photo once available), or one Doctors-grid provider card |
| `cpc-provider-card.jpg` | Man, seated portrait, plant + soft window light | One Doctors-grid provider card / doctor detail page |
| `cpc-brand-mark.png` | Generic AI-generated green/blue swirl logo | **Do not use** — we keep our own logo (`apps/web/public/images/logo.png`) and favicon set |

That's 4 usable photos out of the box. Not enough for ~10 providers, 9+ service pages, and a
resources library on its own, but a strong starting point and proof of the style to match.

## New images needed

### P0 — must have before launch

**1. Provider headshots (6–8 more, to reach 8–10 total with the 2 Manus photos above)**
Mix genders, ages (30s–60s), and ethnicities to reflect a real diverse clinical team. Half seated
3/4 portraits (like the 2 Manus ones), half simple headshots against a soft home-office
background.

> [base style prompt] + "Professional portrait of a [age]-year-old [gender] [ethnicity if
> specified] psychiatric nurse practitioner / psychiatrist, warm genuine smile, seated in a cozy
> home office with a bookshelf and a small plant softly out of focus in the background, natural
> window light from one side, wearing simple modern casual-professional clothing (no white coat)."

Generate one per real provider once you know how many doctors will actually be listed (AGENTS.md
currently references roughly 10 licensed providers).

**2. Owner/founder photo**
This should be a **real photo of the actual practice owner**, not AI-generated, once available
(this is already a tracked pending item — `apps/web/public/images/cpc-provider-owner.jpg` is
referenced everywhere but doesn't exist yet). Use `cpc-about-founder.jpg` from Manus as a
placeholder only until the real photo arrives.

**3. Homepage/section variety photos (4–5 images)**
So the site doesn't visibly reuse the same 2–3 photos on every single page.

- Adult man alone, seated at home, mid video-call, thoughtful/attentive expression — for Anxiety
  Treatment / Depression Treatment service pages.
  > [base style prompt] + "A man in his late 30s sitting at a small home desk during a video call
  > on a laptop, one hand resting near his chin, calm attentive expression, warm afternoon light,
  > cozy living space with a plant and a mug nearby."
- Older adult (55–65) on a video visit — broadens the age representation beyond young/middle-aged
  adults, useful for Medication Management / Bipolar Care pages.
  > [base style prompt] + "A person in their late 50s or early 60s sitting comfortably at a kitchen
  > table, engaged in a video call on a tablet or laptop, relaxed posture, soft morning light,
  > reading glasses pushed up on their head."
- Child (around 8–11) with a parent nearby during a video visit — for the Child & Adolescent
  Psychiatry / ADHD Treatment pages (the Manus family photo skews toward a teen; this fills the
  younger end).
  > [base style prompt] + "A child around 9 years old sitting at a home table for a video call on a
  > laptop, a parent seated just behind and slightly out of focus with a supportive hand on the
  > child's shoulder, warm and unhurried mood, home living room setting."
- "Care wherever life happens" lifestyle shot — someone on a video visit from an unexpected but
  still private, comfortable spot (a porch, a parked car, a quiet corner of a workplace) to
  reinforce the telehealth-flexibility message used in hero copy.
  > [base style prompt] + "A young professional sitting on a porch or in a parked car with a phone
  > propped up for a video call, headphones in, relaxed and private moment, natural outdoor light,
  > no visible screen content."

**4. Open Graph / social share image (1200×630px)**
Branded card used for link previews when the site is shared on social/Slack/iMessage. Should be a
composite: our real logo + a calm photo background + a short tagline, not a pure AI photo prompt —
this one is closer to a design task than an image-generation prompt, best done in Figma/Canva or
by compositing one of the photos above with the real logo and site name.

### P1 — strongly recommended, noticeably improves the site

**5. Resource/article cover images (6, one per article)**
Small editorial-style images, not literal illustrations of the topic — more mood/context than
diagram.

- "What to expect at your first psychiatry appointment" → someone reviewing a printed intake form
  at a kitchen table with a laptop open nearby.
- "How ADHD can show up in adults" → a cluttered-but-cozy home desk with sticky notes, an open
  planner, morning coffee — organized chaos, not clinical.
- "Why medication follow-ups matter" → a small weekly pill organizer next to a glass of water on a
  sunlit windowsill, no branding visible on packaging.
- "Supporting a teen who is living with anxiety" → a parent and teenager sitting together on a
  couch, not looking at each other, comfortable silence, warm light.
- "The connection between sleep and mental health" → a softly lit bedside table, warm lamp, book,
  glasses, night-time calm.
- "When might it be time to seek psychiatric support?" → a single person looking out a window with
  a cup of tea, reflective but not sad, morning light.

Each: `[base style prompt] + [scene above]`.

**6. Careers / team-culture photo**
For the Careers page hero — should feel different from patient-facing photos (more "remote
clinician workspace" than "patient at home").

> [base style prompt] + "A clinician working from a calm home office setup with a laptop, notebook,
> and headset, mid-morning light, plants and books in the background, focused but relaxed — conveys
> a sustainable remote clinical work culture rather than a hospital break room."

**7. Referral / provider-to-provider trust photo**
For the "Refer a Patient" page hero, aimed at other clinicians/schools rather than patients.

> [base style prompt] + "Over-the-shoulder or three-quarter shot of a healthcare professional at a
> desk reviewing notes before a video call, professional but warm, indicating care coordination
> and handoff rather than treatment itself."

### P2 — nice to have

**8. Shop product photography (4 images)**
Flat-lay or simple product shots, soft sage/cream backgrounds, no text/logos on packaging (we'll
add real product names/branding in code, not baked into the photo).

- Evening Reflection Journal — soft-cover journal, pen, on a warm wood surface.
- Calm Routine Kit — a small curated flat-lay of analog wind-down objects (candle, notebook, tea).
- Warm Light for Sleep — a low-glare bedside lamp glowing warmly in a dim room.
- Care Conversation Cards — a small stack of blank cards fanned out on a table.

> [base style prompt] + "Simple product photography of [item], centered, soft sage-green or cream
> background, gentle natural light, minimal styling, no visible text or logos on the product."

**9. Distinct hero photo per remaining page** (Services index, Doctors index, FAQ, Contact) if you
want every page to feel fully unique instead of reusing the 4 core photos. Not required — Manus
itself reuses only 4 photos across ~10 pages and still reads as cohesive — but worth doing if you
have the generation budget.

## What does NOT need a new image

- **Logo / favicon** — already exists (`apps/web/public/images/logo.png`,
  `apps/web/public/images/favicon_io/*`). No action.
- **Insurance payer logos** — already solved in code: `InsurerCard` fetches each payer's real logo
  live via Google's favicon service based on domain, with a colored initials fallback if it 404s.
  No static logo images to generate.
- **Testimonial avatars** — Manus deliberately shows patient testimonials with initials only (no
  photo) for privacy; keep that pattern, no images needed.
- **Icons** — all iconography is `lucide-react`, no image assets involved.

## Suggested delivery format

Drop generated files into a flat folder (e.g. `provider-1.jpg`, `provider-2.jpg`,
`resource-adhd-adults.jpg`, `product-journal.jpg`, etc.) with filenames that match their purpose —
makes it fast for me to wire them into the right components once you hand them over. JPEG for
photos, PNG only if something needs transparency.
