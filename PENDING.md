# CPC Platform - Pending / Blocked Items

Last updated: 2026-06-28

---

## ✅ DONE - Credentials & Config Already Set

| Item | Status |
|---|---|
| Firebase project `connected-psychiatric-care` | ✅ Created & configured |
| Firebase web app config (API key, sender ID, app ID, measurement ID, VAPID) | ✅ Updated in all env files |
| Firebase Android google-services (dev + prod) | ✅ Correct CPC package names |
| Firebase iOS GoogleService-Info (dev + prod) | ✅ Correct CPC bundle IDs |
| Firebase Admin service account JSON | ✅ Base64 encoded into server/.env and server/.env.prod |
| Google OAuth client ID + secret | ✅ Set in server/.env and server/.env.prod |
| Google Web Client ID (mobile) | ✅ Updated to match GOOGLE_CLIENT_ID |
| PostgreSQL / Neon DB (DB_URI + DB_MIGRATE_URI) | ✅ Live Neon database |
| JWT secrets (ACCESS + REFRESH) | ✅ Generated, set |
| Auth token expiry (OTP/ACCESS/REFRESH) | ✅ Set |
| Admin bootstrap (local dev) | ✅ `admin@connectedpsychiatriccare.com` / `Admin&10` |
| Apple Sign In (mobile - `com.zhxlabs.ConnectedPsychiatricCare`) | ✅ Implemented; server `APPLE_BUNDLE_ID` set |
| Stripe (dev/test keys) | ✅ Test keys set in server/.env for local dev |
| PayPal (dev/sandbox keys) | ✅ Sandbox keys set in server/.env for local dev |
| IPStack API key (dev) | ✅ Set in server/.env for local dev |
| Cloudinary (dev account) | ✅ Dev Cloudinary URL set in server/.env |
| SMTP (local dev via zhxlabs.com) | ✅ Set in server/.env for local dev |
| RSG/ABA branding - all source files | ✅ Fully removed across web/dashboard/mobile/server/packages |
| Old RSG Android keystore | ✅ Deleted (`@zhx-labs__ready-set-go-aba.jks`) |
| Mobile sign-in status bar | ✅ Fixed - light icons over dark hero image |
| "Behavior Program" user-facing labels in dashboard | ✅ Renamed to "Care Program" |
| `AbaCredentialEnum` / `AbaSpecialtyEnum` enum names | ✅ Renamed to `ClinicalCredentialEnum` / `ClinicalSpecialtyEnum` across contracts + all apps |
| Server TypeScript (`pnpm --filter server check-types`) | ✅ Passes clean |

---

## ✅ DONE - Code Features Complete

| Feature | Status |
|---|---|
| Public web (home, about, services, doctors, resources, contact, refer, careers, insurance, FAQ) | ✅ |
| Patient web portal (dashboard, appointments, messages, notifications, profile, orders, payments) | ✅ |
| Patient web clinical (treatment plans, session notes, progress reports, caregiver views) | ✅ |
| Patient caregiver system (invite, accept, revoke, dependent creation) | ✅ |
| Dashboard - admin, doctor, staff portals | ✅ |
| Clinical modules (treatment plans, session notes, data points, authorizations, progress reports, caseloads, caregivers) | ✅ |
| Psychiatric modules - backend (teacher-token, clinical-forms, patient onboarding endpoints) | ✅ |
| Psychiatric modules - dashboard (intake forms, screening results, teacher assessments pages) | ✅ |
| E-commerce (products, categories, orders, cart, checkout) | ✅ |
| Payments (Stripe web + mobile PaymentSheet, PayPal web + mobile, manual) | ✅ |
| Multi-channel notifications (in-app, push FCM, email, SMS/WhatsApp) | ✅ |
| Multi-factor auth (email/SMS/WhatsApp/AuthApp OTP) | ✅ |
| Google OAuth (web + mobile) | ✅ |
| Apple Sign In (mobile iOS) | ✅ |
| Staff permission system (per-module grants, ModulePermissionGuard) | ✅ |
| Audit logging (user delete, permission changes, payment/order changes) | ✅ |
| Campaign management | ✅ |
| Media library (web + dashboard + mobile) | ✅ |
| Progress Reports / PDF generation | ✅ |
| Mobile - patient portal (all major flows) | ✅ |
| Mobile - internal role dashboards (admin/doctor/staff Phase 1 + Phase 2) | ✅ |
| GitHub Actions auto-deploy workflow (VPS) | ✅ |

---

## ✅ CODE WORK COMPLETE (Our Side)

All three originally listed code items were verified as already complete:

1. **Patient Screening Results** - `/patient/care/assessments` already shows PHQ-9, GAD-7, ASRS, Vanderbilt results with color-coded severity badges. Linked from patient sidebar as "Assessments & Forms".

2. **Patient Onboarding Wizard** - Full multi-step wizard at `/patient/complete-profile` with all 6 step components (`StepPersonalInfo`, `StepInsurance`, `StepMedicalHistory`, `StepIntakeForm`, `StepScreening`, `StepConsent`). Backend fully wired.

3. **Teacher Vanderbilt Public Form** - Complete at `/teacher-assessment/[token]` with all 27 items in 3 sections, valid/expired/already-submitted states, Next.js API proxy routes.

Additionally completed this session:
- `AbaCredentialEnum` / `AbaSpecialtyEnum` renamed to `ClinicalCredentialEnum` / `ClinicalSpecialtyEnum` - last ABA-named identifiers in the codebase. Contracts rebuilt and server check-types passes clean.

---

## 🟡 OPTIONAL / NICE-TO-HAVE (Our Side - Not Launch Blockers)

| # | Feature | Notes |
|---|---|---|
| 4 | Provider briefing sidebar in appointment detail | Doctor sees patient PHQ-9/GAD-7/ASRS scores when opening an appointment |
| 5 | Mobile onboarding wizard | Mirror web onboarding flow in `apps/mobile` patient group |
| 6 | Mobile screening history screen | Patient sees own screening results in mobile app |
| 7 | Teacher token email - React Email template | Currently plain HTML string in `teacher-token.service.ts`; could use shared template system |

---

## 🔴 PENDING - Need from Robert (Monday Meeting)

### Robert must provide for production launch:

| # | What | Where it goes | Notes |
|---|---|---|---|
| 1 | **Cloudinary URL** for CPC account | `server/.env.prod`: `CLOUDINARY_URL=cloudinary://KEY:SECRET@CLOUD_NAME` | Create at cloudinary.com on Robert's email; free plan works |
| 2 | **SMTP email credentials** | `server/.env.prod`: `SMTP_USER` + `SMTP_PASS` | Hostinger email - e.g. `noreply@connectedpsychiatriccare.com` |
| 3 | **Admin bootstrap credentials** | `server/.env.prod`: `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Robert's real clinic admin login; used once to seed the first admin account |
| 4 | **VPS / Hostinger server** | GitHub Secrets: `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY` | Robert purchases VPS; Zeeshan sets up `deploy` user and SSH key |
| 5 | **Stripe live keys** | `server/.env.prod`: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` | Robert's CPC Stripe account live keys |
| 6 | **PayPal live credentials** | `server/.env.prod`: `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_WEBHOOK_ID` | Robert's CPC PayPal developer app live credentials |
| 7 | **Twilio credentials** | `server/.env.prod`: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`, `TWILIO_WHATSAPP_NUMBER` | Optional at launch if SMS/WhatsApp not immediately needed |
| 8 | **IPStack API key** (production) | `server/.env.prod`: `IP_STACK_API_KEY` | ipstack.com - free plan; session geolocation only |
| 9 | **Apple Developer account** | `apps/mobile/eas.json`: `appleId`, `ascAppId`, `appleTeamId` | Required for iOS TestFlight and App Store submission |
| 10 | **Google Play account** | Play Console + EAS | Required for Android production release |
| 11 | **Apple Sign In web** (optional) | `server/.env.prod`: `APPLE_WEB_CLIENT_ID`, `APPLE_TEAM_ID`, `APPLE_KEY_ID`, `APPLE_PRIVATE_KEY_BASE64` | Only needed if web browser should also support Sign in with Apple |
| 12 | **Clinic/owner photo** | `apps/web/public/images/cpc-provider-owner.jpg` | Optional - About/Doctors pages show a placeholder without it |
| 13 | **Social media links** | `packages/db/prisma/seed.ts` business section | Instagram, Twitter/X, LinkedIn, TikTok URLs |

---

## 🟡 Firebase - No Action Needed

The `connected-psychiatric-care` Firebase project is already registered with all apps:
- Web: `1:594057508865:web:3c8518580b039958dfe800`
- Android prod: `com.zhxlabs.ConnectedPsychiatricCare`
- Android dev: `com.zhxlabs.ConnectedPsychiatricCare.dev`
- iOS prod/dev: same bundle IDs

Firebase Admin service account: `apps/connected-psychiatric-care-firebase-adminsdk-fbsvc-e16591c7af.json`
(already base64-encoded into `server/.env` and `server/.env.prod`)

---

## 📱 Mobile Build Notes

- **Android**: EAS builds with `google-services.dev.json` + `google-services.prod.json`; no preview variant
- **iOS**: Needs Robert's Apple Developer account before TestFlight/App Store
- **EAS credentials** (`apps/mobile/eas.json`): `appleId`, `ascAppId`, `appleTeamId` still `REPLACE_WITH_*`
- **Google Play**: Robert needs Play Console account; EAS handles signing

---

## 🌐 Production Deployment Checklist

When VPS and credentials are ready:

1. Fill `server/.env.prod` with Robert's Cloudinary, SMTP, Stripe, PayPal, Admin credentials
2. Buy VPS → set up `deploy` user with SSH key → add GitHub Actions secrets (`VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`)
3. Point DNS: `api.connectedpsychiatriccare.com` → VPS IP
4. `git push main` → GitHub Actions auto-deploys API
5. Deploy `apps/web` and `apps/dashboard` to Vercel (or same VPS with Nginx)
6. Point DNS: `connectedpsychiatriccare.com` → web, `dashboard.connectedpsychiatriccare.com` → dashboard
7. Run `pnpm --filter @workspace/db prisma:seed:prod` on VPS (first time only)
8. Optionally run `pnpm --filter @workspace/db prisma:seed:demo` for demo accounts
9. Smoke test all flows: sign-up, booking, checkout, admin dashboard, mobile app
