<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Project: connected-psychiatric-care

**connected-psychiatric-care** is a production healthcare management platform built for **Connected Psychiatric Care** - a California psychiatric clinic (client: **Robert**). It handles appointment scheduling, e-commerce (products/orders), psychiatric clinical workflows (PHQ-9, GAD-7, ASRS, Vanderbilt parent/teacher assessments, adult/adolescent psychiatric intake forms), multi-channel notifications, payment processing (Stripe/PayPal), chat/messaging, campaign management, and business/branch configuration.

> **Rebranding note:** This project was forked from `D:/ready-set-go-aba` (an ABA therapy platform). The full codebase has been rebranded to Connected Psychiatric Care. All ABA/RSG/BCBA references in source files have been removed. Do **not** re-introduce ABA terminology. Psychiatric care domain replaces ABA entirely.

## Client Context

- **Client:** Robert - owner of Connected Psychiatric Care, California
- **Practice type:** Psychiatric clinic (adult + adolescent psychiatric care, medication management, mental health assessments)
- **Jurisdiction:** California - Medi-Cal, CA insurance payers, timezone `America/Los_Angeles`
- **Domain:** `connectedpsychiatriccare.com`
- **Legal name:** Connected Psychiatric Care Professional Nursing Corporation
- **Confirmed scope:** Full psychiatric clinical platform - appointments, e-commerce, staff management, psychiatric clinical workflows, patient onboarding with multi-step screenings, teacher-sent Vanderbilt assessments, patient mobile app, and mobile access for admin/doctor/staff.
- **Delivery order:** Web platform first (complete) -> Patient mobile app second (complete for major patient flows) -> Role-aware mobile internal dashboard next.

## Roles & Apps

Current app roles: `admin`, `staff`, `doctor`, `patient`.

Client role/permission request to plan before the next major app build:

- The client described wanting a "superadmin" who controls everything, plus admins/managers/supervisors, staff, doctors, and patients.
- Current recommended direction: **do not immediately add many new hard-coded roles**. Keep the core role model conservative and add a permission/capability layer for internal users.
- Treat the practice owner/main account as the effective superadmin by permissions. This may be represented as `admin` with an owner/superadmin flag or permission set, rather than a new role enum, unless implementation review proves a distinct enum is cleaner.
- Additional admins/managers/supervisors should usually be `staff` or `admin` users with configurable titles and permissions, not new roles for every job title.
- Doctors should have a fixed clinical-provider baseline and should only access their assigned/related patients, appointments, messages, clinical records, and relevant care data unless explicitly granted more.
- Staff should have configurable permissions per user/profile for operational modules like patients, appointments, orders, products, clinical records, media, payments, messages, and settings.
- Patients remain a separate low-privilege role with patient/caregiver portal access only.

Permission model target:

- Add internal permission groups or per-user capability grants before exposing the full dashboard in mobile.
- Permissions should control both API access and navigation/action visibility.
- The owner/superadmin must be able to create, update, deactivate/delete, and permission admins/staff/doctors.
- Lower admins/managers may be allowed broad operations but should not automatically be able to remove the owner/superadmin or grant themselves owner-level access.
- Avoid relying only on frontend hidden links. Backend guards/services must enforce permissions in addition to role checks.
- Keep an audit trail for sensitive actions such as user deletion/deactivation, permission changes, payment/order changes, and clinical-record changes.

### Web Apps (Current Phase)

- `apps/web` - Public-facing marketing site + patient portal.
  - Public pages: home, about, services, doctors, shop, resources, contact (no auth required)
  - Patient portal (`/patient/*`): appointments, profile, orders, notifications, messages - `patient` role only
  - Patients can **browse and purchase** products from the shop. They cannot manage products or orders.
- `apps/dashboard` - Internal portal for `admin`, `doctor`, and `staff` roles. All three share one Next.js app, separated by route groups:
  - `/(root)/admin` - admin-only pages
  - `/(root)/doctor` - doctor-only pages
  - `/(root)/staff` - staff-only pages
  - `/(root)` (shared) - pages accessible to all internal roles (account, notifications, messages)
  - All three internal roles (admin, doctor, staff) can manage products, inventory, and orders.

### Mobile App (Next Phase: Role-Aware App)

- `apps/mobile` - Single Expo React Native app for **all roles**, with role-based route groups and mobile-optimized screens.
  - Shared on iOS (App Store) and Android (Play Store)
  - Patients keep the existing patient portal experience.
  - Admin, doctor, and staff must be able to sign in from the same mobile app and access mobile dashboard workflows.
  - The full `apps/dashboard` web app remains the desktop reference/source of truth for internal workflows, but the client has now requested phone-first access because not every staff member reliably has a laptop/PC.
  - Do **not** create a second mobile app unless the client explicitly requests separate branding, app-store listings, or release cycles. Extend `apps/mobile` with role-aware navigation instead.

Role isolation is enforced server-side via `ClientService.assertRoleAccess` (tied to request origin), and the `@Roles()` decorator on individual endpoints.

## Tech Stack

| Layer             | Technology                                           |
| ----------------- | ---------------------------------------------------- |
| Monorepo          | Turborepo 2.9.1, pnpm 10                             |
| Server            | NestJS 11, Node 24                                   |
| Database          | PostgreSQL + Prisma 7.6                              |
| ORM IDs           | ULID (not UUID)                                      |
| Frontend (Web)    | Next.js 16, React 19                                 |
| Frontend (Mobile) | Expo (React Native) mobile app                       |
| Auth              | JWT (jose), argon2, httpOnly cookies, sessions in DB |
| MFA               | Email / SMS / WhatsApp / AuthApp OTP                 |
| OAuth             | Google (Passport)                                    |
| Media             | Cloudinary                                           |
| Payments          | Stripe, PayPal, manual                               |
| SMS/WhatsApp      | Twilio                                               |
| Push              | Firebase FCM + Expo                                  |
| Email             | SMTP (Nodemailer) + React Email templates            |
| Cache             | Redis (Keyv)                                         |
| Cron              | @nestjs/schedule                                     |
| Geolocation       | IPStack API                                          |
| Validation        | Zod (server + contracts)                             |

## Current Delivery Status

Use this section as the current project-status source of truth. `README.md` should stay focused on setup/orientation, while delivery status, backlog, and handoff notes belong here.

### AGENTS.md Maintenance Rule

- `AGENTS.md` is the working source of truth for current status, follow-ups, and handoff notes.
- Whenever a meaningful item from this file is completed, materially changed, or intentionally deferred, update `AGENTS.md` in the same task before considering the work fully done.
- When a fix is shipped, move it from an active/follow-up section into the completed or post-demo fixes section with a short plain-language note.
- When a new bug, regression, or launch blocker is discovered, add it here before or alongside the fix so the project history stays accurate.

### Web / Dashboard Current State

- Public web app is substantially ahead of the mobile app.
- Dashboard is the most up-to-date internal product surface.
- Mobile patient app has now caught up on the major patient-facing clinical and public-demo flows.
- New client request as of June 7, 2026: admin, doctor, and staff should also be able to log in from the mobile app and do the dashboard work they need from a smartphone. Treat this as the next major mobile phase.
- Shared appointment conversation UI now lives in `packages/ui` and is used by both dashboard and patient web appointment detail flows.
- Internal dashboard now shares `/messages`, `/patients`, and `/appointments` under `apps/dashboard/src/app/(root)` for admin/doctor/staff where the flow is the same; once a route is shared, remove the old role-prefixed duplicate pages and update navigation to the shared path.
- The deeper dashboard patient-detail subtree is now also shared under `apps/dashboard/src/app/(root)/patients/[id]/*` for internal roles, including authorizations, caregivers, session-note detail/data-points, treatment-plan detail, and program progress. Staff should use the same shared patient-detail routes when the flow matches doctor/admin.

### Confirmed Implemented

- Public site: home, about, services, doctors, resources, contact, refer, careers, insurance, privacy, terms, cookies
- Public dynamic content:
  - homepage stats via API
  - testimonials via API with admin management
  - careers/job listings via API with admin management
- Patient web portal: dashboard, appointments, messages, notifications, profile, orders, payments
- Patient web portal clinical area:
  - own treatment plans
  - own session notes
  - linked caregiver patient treatment plans
  - linked caregiver patient session notes
- Dashboard patient clinical navigation:
  - persistent patient detail layout
  - patient clinical tabs
  - shared implementations across some duplicated role routes
- Legacy clinical module scaffold (forked from ABA platform - repurposed for psychiatric workflows):
  - Treatment Plans
  - Behavior Programs (can be repurposed for psychiatric care programs)
  - Session Notes / Progress Notes
  - Data Points
  - Staff Caseload
  - Insurance Authorizations
  - Caregiver Access
  - Goal Tracking / Mastery progress page
  - Progress Reports / PDF generation
- **NEW - Psychiatric clinical modules (built June 2026):**
  - Teacher-sent Vanderbilt assessments (`teacher-token` NestJS module) - token-based public link, no auth required for teacher
  - Clinical forms list/detail API (`clinical-forms` NestJS module) - role-scoped: admin sees all, doctor sees own patients, staff sees assigned patients
  - Patient onboarding endpoints (`GET/POST /patients/me/onboarding`) - multi-step wizard with PHQ-9, GAD-7, ASRS, psychiatric intake forms
  - Dashboard admin clinical pages: intake forms viewer, screening results with severity badges, teacher assessments list
  - SDK extensions: `listClinicalForms`, `getClinicalForm`
  - Dashboard hooks: `useClinicalForms`, `useClinicalForm`, `useTeacherAssessments`
- Chat typing indicator exists in web/dashboard flows
- Notification `actionUrl` deep links are wired in multiple server flows and rendered in notification UI
- Scheduled jobs exist for reminders, no-show marking, low-stock alerts, purge
- Stripe and manual payment flows exist; PayPal UI support is listed in the final Remaining Production Work section
- Stock decrement on order/checkout exists

### Post-Demo Fixes Already Completed

Track notable fixes completed after the client review/demo build was first shared, so the final handoff can clearly show what improved during review.

- Production env/domain variables updated from old `CareSync` naming to the new branded project/domain values
- Dashboard production login issue fixed after env/domain cleanup
- Web public header now has a proper mobile menu
- Monorepo `pnpm check-types` issues resolved across web/dashboard/shared forms
- Web patient treatment-plan detail now reads behavior-program progress from the correct progress endpoint
- Dashboard TanStack Form typings refreshed to work with the current form package version
- Mobile runtime `clientUrl` is now configured dynamically instead of depending only on env values
- Mobile appointment messaging is now restricted to active appointments (`booked` / `confirmed`) instead of allowing sends after completion or no-show
- Dashboard appointment conversation composer now disables sending and shows a status notice when messaging is unavailable
- Patient web appointment conversation now uses the same shared thread and status-gating behavior as dashboard
- Shared appointment conversation UI has been extracted into `packages/ui` to reduce duplicate web/dashboard chat logic
- Mobile treatment-plan detail cards now wrap program badges more cleanly to avoid overflow in smaller layouts
- Mobile account preferences now keep the push-notification toggle in sync with the stored user value
- Mobile push-notification setup errors now surface clearer device / permission / Android Firebase guidance
- Mobile Google sign-in now surfaces a clearer Android OAuth credential mismatch message
- Mobile Android package identifiers and Firebase `google-services` wiring are now variant-aware for development / preview / production builds
- Mobile media upload now preserves multipart uploads in the shared SDK client so React Native image picks reach `POST /media` with the expected file payload
- Mobile checkout now routes to the canonical `/checkout/success` screen after order placement instead of falling through to an unmatched route
- Mobile patient portal now has a dedicated media library screen with upload queue, metadata editing, library browsing, and sidebar navigation instead of only a minimal picker sheet
- Mobile media library tabs now render their upload/library content correctly in the native modal and patient route after the media workspace rollout
- Mobile media field now opens the shared media library flow like web, and the mobile media screen now uses the app’s standard select/card primitives with a web-like upload structure
- Mobile filter bar now supports web-style search/search-by/sort controls, and the patient media library uses it with ascending/descending sort icons
- Mobile now has a reusable popover UI primitive, and the filter bar search-by control uses it instead of a select sheet to better match the web interaction
- Mobile media upload tab no longer emits the React Native raw-text warning when the queue is empty, and shared button rendering now ignores whitespace-only text nodes
- Mobile media uploads no longer force a manual multipart header in the SDK create-media call, which fixes the Expo/React Native network-error upload failure before the request reached Nest
- Mobile media upload/library placeholders and queue presentation now more closely match the web media surface, and the web upload queue now shows image previews instead of only a generic upload icon
- Web patient portal now includes a `/patient/media` entry so patient-facing media management is available outside the internal dashboard
- `packages/contracts` response model typings are now normalized to the shared `Sanitize<Model> & { relation?: RelationResponse }` pattern instead of ad-hoc field-by-field response interfaces
- Contracts response typing now follows the existing project rule more strictly: no `| null` in response types, and nested base user payloads use `BaseUserResponse`
- Contact Messages sidebar badge bug fixed: `AppSidebar` badge injection now excludes `/admin/leads/messages` so only appointment-chat nav items receive the unread count
- `CaregiverAccessForm` rewritten from raw `useState` to TanStack Form + `ComboboxField`, matching the project form standard
- Staff caseload assignment updated to bulk multi-patient: contracts `StaffAssignmentType` now uses `patientIds: string[]`, server iterates and upserts one row per ID, dashboard assign form uses multi-select `ComboboxField`
- Caregiver access updated to bulk multi-caregiver: contracts `caregiverAccessSchema` now uses `caregiverIds: string[]`, server iterates and upserts one row per ID (skips already-active, self-access, or not-found), form uses multi-select `ComboboxField`; Caregivers added to ABA Clinical → Clinical Records sidebar group; global `/admin/clinical/caregivers/new` page created with optional patient picker
- ABA global clinical list "Add New" is now wired: treatment-plan, session-note, and insurance-authorization forms accept optional `patientId` and show a patient picker when absent; `StaffCaseloadAssignForm` extracted as shared component with optional `staffId` and staff picker; global `/new` pages created at `/admin/clinical/treatment-plans/new`, `/admin/clinical/session-notes/new`, `/admin/clinical/authorizations/new`, `/admin/clinical/staff-caseloads/new`; all forms derive `listPath` from `usePathname()` instead of hardcoded role prefixes
- Dashboard appointment message list/thread pages are now deduplicated into shared `/messages` routes; internal sidebar and dashboard links point to the shared path, while appointment back-links still use the signed-in user's role
- Dashboard patient list/detail/session-note/treatment-plan shared routes now live under `app/(root)/patients`, and the doctor/staff shared appointment pages now live under `app/(root)/appointments`; role-prefixed duplicate route files for those shared flows were removed
- Dashboard `PageIntro` imports are now standardized on `@workspace/ui/shared/PageIntro` across shared route pages and form screens, replacing lingering app-local imports that were causing dashboard type/build errors
- Dashboard hook cleanup now standardizes more internal CRUD-style files on `createCrudHooks` where the core flow is list/get/create, while preserving custom action hooks like appointment status changes, campaign send/status actions, and order shipment/status updates as separate mutations
- Public marketing/contact content is now centralized in `packages/shared/src/constants/public-site.ts`, and web/mobile public pages now use the live client email, phone numbers, address, social links, and expanded about/services/resources/referral copy adapted from the old site
- Additional public page copy/constants are now centralized in `packages/shared`, and web/mobile About, Services, Resources, Contact, Refer, Doctors, and Insurance routes now read the same shared labels, helper text, and empty/success states instead of drifting through app-local hardcoded strings
- Public web navigation now uses grouped About/Services menus in the shared header, the About page now includes expanded business + owner content adapted from the old client site, Contact now includes an embedded location map, and a dedicated public `/faq` page is available for navigation/footer links
- Self-service account deletion is now available from shared web account settings and the mobile patient account screen; the server now soft-deletes the signed-in user, revokes active sessions, and clears client auth state on delete
- Privacy, terms, and cookie pages for web + mobile are now rewritten around the actual Connected Psychiatric Care platform flows and centralized in `packages/shared` so public legal copy stays aligned across apps
- Web sitemap/robots/domain references now use `https://connectedpsychiatriccare.com` - updated during CPC rebranding (June 2026)
- Shared public services content now merges the old-site clinical/service offerings with the newer project-specific delivery modes; homepage services sections on web + mobile default to six cards, while the dedicated services pages render the full shared list
- Shared public services now also support explicit `isFeatured` curation for the web mega-menu and homepage-preview behavior; limited service sections show a “See All Services” CTA when more shared services exist than the current preview limit
- Shared About content has been tightened again using the older client-site wording as reference: the hero title is shorter, Daniella Koroma’s owner bio is stronger and more specific, and the weaker “Our Commitment To Clinical Excellence” section was removed from the web About page
- Web About page icon rendering now comes directly from shared icon keys in `packages/shared` instead of index-based local icon arrays, and the “What Families Can Expect” steps now carry structured shared titles/descriptions/icons for cleaner reuse
- Mobile public About page now mirrors the richer shared About content more closely by adding the mission/vision cards, business story, referral partners, care-process steps, and Daniella Koroma owner/expertise section instead of stopping at only mission/values/team
- Mobile public home hero/testimonials/team/steps/CTA shell copy is now pulled from shared constants instead of app-local strings, so homepage marketing content stays aligned with web and the shared content source of truth
- Mobile doctors list/detail fallback copy, labels, “what to expect” bullets, and services-preview defaults now read from shared constants too, reducing the remaining public-content drift between mobile and web
- Mobile public services page now also reads its page eyebrow/action labels, shared-steps section heading/description, and CTA eyebrow from shared constants instead of route-local strings
- Web and dashboard push-notification setup is now cleaned up around a shared `packages/ui` Firebase helper: browser token registration/removal is centralized, the account toggle uses the shared flow, foreground messages refresh notification data, and both web apps now use aligned FCM service-worker behavior for background notifications/deep links
- Shared web push notifications are now working well in `apps/web` and `apps/dashboard`; mobile push-notification setup and suppression behavior are also resolved.
- Server Firebase Admin initialization now supports VPS deployments through `FIREBASE_SERVICE_ACCOUNT_BASE64`, raw JSON, or a mounted credential file path, while keeping Application Default Credentials as the Cloud Run/local fallback.
- Server CORS origin matching now normalizes trailing slashes so a production env typo like `https://www.readysetandgoabatherapy.com/` does not block patient-portal preflight requests.
- Session display/device tracking now accepts explicit mobile device headers from the Expo app and uses clearer web/mobile fallbacks so account security no longer shows blank device labels for mobile sessions.
- Account session icons now distinguish mobile app, dashboard, and web patient-portal sessions instead of showing the desktop monitor icon for every active session.
- Account security session lists now return active sessions only, so recently logged-out/revoked rows no longer remain mixed into the “Active Sessions” card after a logout and new sign-in.
- IPStack session geolocation now calls the standard lookup response instead of the plan-restricted filtered-fields endpoint and reads `time_zone.id`, fixing production sessions that were falling back to “Unknown location.”
- Production provider seed now creates default weekday appointment availability for providers that have no schedule yet, and the patient web booking form now queries a single selected day and shows a clear no-slots notice instead of only disabling the time-slot field.
- VPS deploy release cleanup now preserves the just-deployed release and removes older releases by modified time instead of lexicographic SHA order, preventing `current` from pointing at a pruned release.
- Shared protected-route auth handling for dashboard routes and web `/patient/*` routes now refreshes first and redirects to sign-in instead of leaving users stuck on the loading shell when session recovery fails; mobile protected patient routes now show a retry state when the server cannot be reached.
- Shared web/dashboard auth recovery now also treats throttled refresh failures (`POST /auth/refresh` -> `429`) as terminal for the current protected-page session and redirects to sign-in instead of leaving the loading shell hanging; mobile invalid-refresh-token handling is also terminal and clears local session state.
- Token/session handling is now stricter on web/dashboard auth flows: refresh-token hash mismatches revoke the session in all environments, and sign-in will reuse one clearly matching active browser session fingerprint when the incoming `deviceId` is missing instead of always creating a brand-new active session
- Session records now carry `clientApp`, and browser auth cookies are namespaced per app (`web_*` / `dashboard_*`) with legacy-cookie fallback during rollout so web and dashboard sessions no longer overwrite each other on the shared API host
- Dashboard DatePickerField now always uses `captionLayout="dropdown"` with `fromYear`/`toYear` props for year/month navigation; DOB fields set `fromYear=1920`, `toYear=currentYear`, `maxDate=today` so future dates are blocked
- MediaField refactored to detect single vs multiple mode from `Array.isArray(field.value)` with a `max` prop (default 1); multiple mode shows a grid of image cards with hover Replace/Remove icon buttons and a dashed Add card capped at `max`; ProductForm now passes `max={6}` and `defaultMedia={data?.images}`
- ComboboxField now supports `excludeIds` prop that merges into query args (server-side) and also filters client-side as a double guard; `baseQuerySchema` and all backends that need it accept `excludeIds`; StaffCaseloadAssignForm excludes already-assigned patients
- CUUserForm role SelectField is disabled on update (client); admin.service `updateUser` strips `role` from the payload (server) - role changes after creation are blocked on both ends
- Doctor/Staff/Patient profile `create` services now catch Prisma P2002 and throw `ConflictException` with a clear "already has a profile" message instead of leaking raw Prisma errors
- StaffForm userId ComboboxField is now disabled on update (was missing; DoctorForm and PatientForm already had it)
- Patient/Doctor/StaffForm pass `hasNoProfile: true` to the user combobox on create so the dropdown only shows users not yet linked to a profile of that role; admin `findAllUsers` supports the new `hasNoProfile` filter via `patientProfile/doctorProfile/staffProfile: { is: null }`
- Dashboard `AppointmentForm` time input upgraded from raw `type="time"` inputs to a slots-based flow: `useDoctorSlots` hook added to `apps/dashboard/src/hooks/availability.ts`; form now shows a date picker then a `SelectField` of available time slots (matching the web patient booking form); `scheduledEndAt` is auto-filled from the selected slot; doctor combobox is locked when in doctor workspace
- `createPaymentIntentSchema` `appointmentId` is now required (`idSchema`) instead of optional - schema-level validation now matches the service-level guard that already threw if missing; appointment-linked manual payments are the only use case for `POST /payments`
- Sign-in "new sign-in detected" in-app notification no longer fires as a real-time SSE event to the current session; the `notification.service.ts` SSE emit is skipped for `signIn` purpose so the record is stored in history but the user who just logged in won't see an immediate popup from their own sign-in
- Auth OTP flows are now aligned to the expanded `OtpPurpose` enum: backend/request-validation logic supports `changePassword`, `setIdentifier`, `changeIdentifier`, `enableMfa`, `changeMfa`, and `disableMfa` distinctly; identifier-add vs identifier-change now diverge correctly, and email template action typing/copy now matches the new set/change wording instead of the old `update*` assumptions
- Shared web/dashboard `AuthForm`, account-security flows, verify route handling, and the matching mobile auth/account verification screens are now aligned to the expanded OTP purposes too, so frontend request/verify/update calls use `changePassword`, `setIdentifier`/`changeIdentifier`, and `enableMfa`/`changeMfa` correctly instead of the old client-only `update*` purpose assumptions
- Mobile auth refresh no longer hammers `POST /auth/refresh` when no usable stored refresh token exists; the SDK now treats the missing mobile refresh token as terminal locally, clears session state, and avoids retrying after an auth-expired event.
- Mobile `PhoneField` no longer imports the full country/phone parsing stack at module load, fixing the Expo runtime `prototype` crash; it now uses the project-standard United States phone input behavior.
- Staff assignment access is now consistently based on the assigned staff user's `User.id` while admin staff routes may still pass a staff profile ID; staff caseload assignment/list pages, patient access, and shared appointment routes now resolve staff-owned data correctly.
- Shared appointment conversations now invalidate the active thread when a `conversation-updated` event arrives, so patient appointment detail threads pick up dashboard-sent messages without a hard refresh.
- Campaign detail actions now only expose valid admin transitions (`draft -> scheduled`, `scheduled -> draft`), and the server rejects dashboard attempts to manually set operational-only statuses like `failed`.
- Admin self-service account deletion is now hidden in shared account settings and blocked server-side so the super-admin account cannot be deleted from `/account`.
- Admin Careers job creation now invalidates the job-listing query after create, and the job location field uses a branch combobox so admins choose an actual business location.
- Behavior Program overlay forms now pass `entityName="Behavior Program"` so the form header no longer renders `Add New undefined`.
- ABA progress demo seed data now creates per-trial data points for skill-acquisition programs instead of identical one-point response patterns, so program progress charts vary by program/session.
- Dashboard/web/mobile combobox option keys now use searchable display text while keeping `value` as the exact backend ID/value, improving search without changing submitted payloads.
- Production contact/domain constants were refreshed to `readysetandgoaba@gmail.com` and `readysetandgoabatherapy.com`; `seed.prod.ts` no longer carries the unused cover asset stub or fake `PENDING-*` provider license placeholders.
- Doctor profile schema cleanup: `licenseNumber` is now optional and doctor verification fields/status were removed from `DoctorProfile` because admins create doctor profiles directly.
- Matching Prisma migration for the doctor profile schema cleanup has been generated/applied by the project owner; remaining doctor-verification references were removed from contracts/server/dashboard/web/mobile SDK flows, and availability is now the booking/display control.
- SMS/WhatsApp notification delivery now fails clearly with a "not configured yet" service error when Twilio credentials or sender numbers are missing instead of failing opaquely.
- Mobile protected patient routes now show a service-unavailable retry state when the API cannot be reached instead of redirecting to sign-in; terminal invalid mobile refresh-token handling continues to clear local session state.
- Appointment chat notification fan-out is settled for launch: patient messages notify the appointment doctor and assigned internal user, while internal replies notify the patient; admins can view conversations but do not receive every thread notification unless they are the assigned participant.
- Appointment chat notification deep links for internal users now point to the shared dashboard `/messages/[appointmentId]` route instead of stale role-prefixed message routes.
- Mobile `PhoneField` now displays the United States flag in the selector instead of the raw `US` country-code text.
- Hostinger VPS API deployment is live at `https://api.readysetandgoabatherapy.com`: Ubuntu updates applied, Docker/Nginx/Certbot installed, API container deployed with restart policy, Prisma production migrations/seed run, HTTPS certificate issued, and Hostinger DNS `api` A record pointed to the VPS.
- Obsolete Google Cloud Build config was removed now that the server deploy target is the Hostinger VPS.
- GitHub Actions server auto-deploy workflow has been added for pushes to `main`; it deploys to the Hostinger VPS through the non-root `deploy` user, keeps production env values on the VPS under `/opt/connected-psychiatric-care/shared/server.env.prod`, builds the Docker image, runs Prisma deploy, restarts the API container, updates `/opt/connected-psychiatric-care/current` to the release, and smoke-tests the HTTPS endpoint. The workflow requires repo Actions secrets: `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, and optionally `VPS_DEPLOY_PATH`.
- VPS deploy operational note: `/opt/connected-psychiatric-care/shared/server.env.prod` must stay owned by `deploy:deploy` with `600` permissions because GitHub Actions connects as `deploy` and copies that file into each release. If root manually edits/uploads the env, run `chown deploy:deploy /opt/connected-psychiatric-care/shared/server.env.prod && chmod 600 /opt/connected-psychiatric-care/shared/server.env.prod` afterward. The release cleanup must preserve the just-deployed release and prune by modified time; do not sort release directories by SHA text.
- Manual VPS deploy fallback: package the current commit, upload it to `/tmp`, then run the same release steps as `.github/workflows/deploy-server.yml` as the `deploy` user: extract into `/opt/connected-psychiatric-care/releases/$SHA`, copy shared env to `server/.env.prod`, copy `deploy/docker-compose.server.yml` to `docker-compose.yml`, run `docker compose -p connected-psychiatric-care build server`, `docker compose -p connected-psychiatric-care run --rm server pnpm --filter @workspace/db prisma:deploy`, `docker compose -p connected-psychiatric-care up -d server`, update `/opt/connected-psychiatric-care/current`, then smoke-test `https://api.readysetandgoabatherapy.com/`.
- Mobile signup now signs the newly verified patient in before routing to `/patient/complete-profile`, and the mobile complete-profile account step now pre-fills name/email/phone from the signed-in user like web.
- Shared name validation now accepts one-character trimmed names/initials, so users can enter names like `M Zeeshan` across signup/profile/admin forms.
- Google Play reviewer account seed added (later replaced - see demo accounts entry below); Play Console app-access copy lives in `apps/mobile/PLAY_STORE_REVIEW.md`.
- Public web account-deletion instructions are available at `/account-deletion` for Google Play Data safety account deletion requirements; the page explains in-app deletion steps, support-email fallback, deleted/deactivated data, and retained healthcare/business records.
- Demo accounts consolidated: old `seed.google-reviewer.ts` and `seed.play-screenshots.ts` removed; replaced with `packages/db/prisma/seed.demo.ts` (`pnpm --filter @workspace/db prisma:seed:demo`) creating 4 `isDemo: true` accounts - `demo-patient`, `demo-doctor`, `demo-staff`, `demo-admin` at `connectedpsychiatriccare.com`, all with password `CpcDemo2026!`; `isDemo: false` filter added to all admin/patient/doctor/staff list queries so demo accounts are invisible to all dashboard users; `seed.cleanup.ts` removes stale prod demo users before re-seeding.
- Main development/demo seed at `packages/db/prisma/seed.ts` was refreshed for client walkthroughs: first demo patients now use named ABA child/caregiver personas, patient profiles include realistic clinical/intake details and private documents, appointment timelines/messages/notifications now line up with the website -> patient portal -> admin/provider -> mobile demo script, and stale doctor-verification seed fields were removed to match the current Prisma schema.
- Staff permission system implemented: `PermissionModule` enum and `StaffPermission` table added to Prisma schema (migration applied), full `staff-permission` contracts module and SDK helpers added, server `StaffPermissionModule` with `PUT/GET /staff-permissions/:staffId` (admin-only) wired into `app.module.ts`, staff profile responses now always include the `permissions` module list, and the admin staff detail page now shows a `StaffPermissionsForm` checklist so admins can grant/revoke individual dashboard modules per staff member.
- Mobile role-based route groups added: `apps/mobile/app/admin/`, `doctor/`, `staff/` route directories created with `_layout.tsx` auth+role guards (using shared `useInternalAuth` hook), drawer navigation with role sidebars (`AdminSidebar`, `DoctorSidebar`, `StaffSidebar`), and placeholder dashboard index screens for each role; root `_layout.tsx` registers all three new Stack.Screen entries; post-login routing in `auth/[type]/index.tsx` now uses `getRoleDashboardHref` to redirect admin/doctor/staff to their own dashboards instead of `/`; MFA verification path also routes by role using stored `pendingRole` state; wrong-role guard in each layout redirects to the correct dashboard for the authenticated role. `pnpm --filter mobile check-types` passes clean.
- Mobile internal Phase 1 dashboard complete: dashboard index screens for admin/doctor/staff now show live data from `useAdminDashboard`/`useDoctorDashboard`/`useStaffDashboard` (stat tiles, upcoming appointments, recent patients/caseload quick links); shared `components/internal/` layer built with `InternalAppointmentsList`, `InternalAppointmentDetail` (embedded chat + status transitions), `InternalPatientsList`, `InternalPatientDetail`, `InternalConversationsList`, `InternalNotifications`, `InternalAccount`, `InternalOrdersList`, `InternalOrderDetail`, `InternalProductsList`, `InternalPaymentsList`, `InternalStaffList`, `InternalStaffDetail`; all route wrapper files created for admin (appointments, patients, messages, notifications, orders, products, payments, staff, account), doctor (appointments, patients, messages, notifications, account), and staff (appointments, patients, messages, notifications, account); new `useProducts`, `useProduct`, `useInternalStaff`, `useInternalStaffMember` hooks added to `use-healthcare.ts`. `pnpm --filter mobile check-types` passes clean.
- Server-side module permission enforcement complete: `ModulePermissionGuard` registered as third `APP_GUARD` (after ThrottlerGuard → AuthGuard), `@RequiresModule()` decorator applied to all relevant controllers - patients, appointments, orders, products, clinical (treatment-plans, behavior-programs, session-notes, data-points, insurance-authorizations, staff-assignments, caregiver-access), media, payments, messages (chat), settings (business), and campaigns. Admin passes through unconditionally; doctor/patient fall through to service-level access control; staff are checked against `StaffPermission` table rows. `@Public()` methods are always exempt. `pnpm --filter server check-types` passes clean.
- Mobile runtime icon/adaptive icon/favicon/splash assets were refreshed from the final Connected Psychiatric Care asset pack; Play Console-only generated `store-assets` files were removed from the app tree now that store uploads are handled separately.
- Mobile runtime icon/adaptive foreground/monochrome/favicon assets were refreshed again from the transparent-background app icon source (`icon-transparentbg.png`) so the next native build carries the corrected launcher icon.
- Mobile Android app is live in Google Play production as of May 15, 2026; App Store release is waiting on Apple Developer account approval/activation before iOS submission can be completed.
- Web checkout keeps the original single "Continue to Payment" flow and relies on Stripe Express Checkout to surface PayPal at the top of the payment step when PayPal is available for the Stripe payment intent.
- Web checkout now also shows a direct PayPal button at the top of the payment step, independent of Stripe Express Checkout availability; Stripe's inline Payment Element keeps automatic non-redirect payment methods available, and returning from the payment step reuses the already-created order instead of trying to submit an emptied cart again.
- Web checkout PayPal startup now uses the standard API response shape for the order-specific PayPal session endpoint, and the order summary shows the created order's actual shipping cost (`Free` when zero) on the payment step instead of leaving "Calculated next" visible.
- Public About and Doctors surfaces now use Daniella Koroma's real owner photo from `apps/web/public/images/daniella-koroma-owner.jpeg`; providers without uploaded avatars render a polished "profile photo coming soon" placeholder instead of a bare initials block.
- Shared web `PhoneField` is now aligned with mobile for launch: United States is fixed as the only selectable country, the field shows the US flag with `+1`, formats US numbers, and still submits E.164 values.
- PayPal production webhook handling is now implemented at `POST /payments/webhooks/paypal` with PayPal signature verification through `PAYPAL_WEBHOOK_ID`, and handles order-approved/capture-completed/capture-denied/capture-refunded events idempotently against existing payment records.
- Public web SEO has been refreshed for launch: site metadata now targets `Ready Set And Go ABA` while retaining `Connected Psychiatric Care` as an alternate search phrase, public pages have route-level titles/descriptions/canonicals/Open Graph/Twitter metadata, organization/service/FAQ structured data is emitted, private/auth/cart/checkout routes are noindexed, and sitemap/robots now exclude non-public routes.
- Mobile checkout now supports online payment options: card payments use Stripe React Native PaymentSheet from server-created PaymentIntents, PayPal opens the server-created PayPal approval URL through an auth browser session and captures after approval, and manual confirmation remains as a fallback.
- Mobile Expo startup now passes an options object to the Stripe React Native config plugin, fixing the `merchantIdentifier` undefined crash during `expo start -c`.
- Web and mobile app headers now let the logo shrink within the remaining header space so cart/sign-in/account actions do not overflow on narrower or font-scaled devices, while the shared logo remains capped at its intended small/large widths in roomy footer/sidebar placements.
- Public web homepage now previews more of the full site content: about/owner story, insurance guidance, referrals, patient portal, shop, careers, resources, and FAQ links are surfaced through compact reusable cards instead of leaving those routes hidden behind navigation only.
- Public web homepage services and getting-started sections were visually refreshed: service cards now have clearer hierarchy/direct section links, and the three-step flow uses a more polished split process layout instead of repeated basic cards.
- Mobile public homepage now mirrors the expanded web homepage structure with About/owner preview, support hub, refreshed service cards, improved getting-started flow, and resources/FAQ previews using native mobile section components.
- Web and mobile About owner copy now reflects the client-provided Daniella Koroma bio, including her Behavioral Health experience, degree background in Occupational Science in Health Information Technology, Social Work, Billing and Coding, and expanded service mission; mobile About also uses the real owner photo.
- Mobile startup now keeps the branded custom splash overlay mounted while the app providers/navigation render behind it, then removes the overlay only after the root layout is ready and the minimum splash duration has elapsed, avoiding the blank-color gap before the homepage appears.
- Public web phone typography is now closer to the native mobile app: shared section headings, CTA headings, home stats, hero weight, and About page major headings use the smaller mobile-app scale on phones while keeping tablet/desktop sizing.
- Public web mobile typography/color parity was tightened further against the native mobile app: hero and public page header text use foreground coloring on phones, intro paragraph sizing follows the app's `text-base leading-7` pattern, step/team card text was aligned, and local About/Contact/Refer/Insurance headings now follow the mobile section scale.
- Public web and patient web base typography classes were aligned to the native mobile app patterns: shared web globals now include `font-body-medium` / `font-body-semibold`, headings default to `font-primary text-foreground`, public/patient route titles now use mobile-style `font-primary text-*` bases, and the incorrect phone-only hero/header color condition was removed so color stays explicit while only responsive size changes happen at `sm:` and above.

## Mobile Catch-Up Checklist

`apps/mobile` is no longer broadly behind `apps/web` on the major patient-facing features. Use this section to track the remaining parity and polish items only.

### Web-First Fix Parity Queue

These fixes were shipped on web/dashboard and reviewed for mobile applicability:

- **DatePickerField year/month nav** - completed; mobile uses equivalent native year navigation
- **MediaField multiple support** - not applicable to mobile; mobile does not use multi-image flows
- **ComboboxField excludeIds** - not applicable to mobile; `StaffCaseloadAssignForm` is dashboard-only

### Remaining Mobile Follow-Up

- No broad **patient-mobile** catch-up item remains.
- New broad mobile work is internal-role support: `apps/mobile` must become role-aware for `admin`, `doctor`, and `staff` while preserving the existing patient portal.

### Mobile Internal Dashboard Expansion

Client request: the owner/admin, doctors, and staff should be able to log in from the mobile app and do dashboard work from a smartphone. The project direction is **one mobile app, role-based routes**, not a separate second internal mobile app.

Important prerequisite: resolve internal permissions before or alongside the first internal mobile screens. The current broad role behavior is not enough for the client's updated ask. Mobile must not simply expose all dashboard actions to every doctor/staff user.

Planned route shape:

```txt
apps/mobile/app/
  (auth)/
  (patient)/
  (doctor)/
  (staff)/
  (admin)/
```

Post-login routing must use the authenticated user role:

- `patient` -> existing patient mobile portal
- `doctor` -> doctor mobile dashboard
- `staff` -> staff mobile dashboard
- `admin` -> admin mobile dashboard

Implementation rules:

- Reuse existing server endpoints, `packages/sdk`, `packages/contracts`, and shared constants wherever possible.
- Do not copy Next.js `apps/dashboard` UI directly into Expo; build native mobile screens that map to the same workflows.
- Keep server-side role enforcement as the real security boundary: `ClientService.assertRoleAccess` and endpoint `@Roles()` decorators must continue to protect every internal flow.
- Add/consume a permission layer for internal actions so owner/admin can decide what each admin/staff/doctor can create, read, update, delete, or manage.
- Doctor mobile routes should default to provider-scoped data only: assigned/own patients, appointments, messages, clinical records, and provider-related notifications.
- Staff mobile routes should default to assigned-patient/caseload data and only expand through explicit permissions.
- Prefer shared mobile primitives/components for tables-as-lists, filters, action sheets, forms, status badges, and empty/error states before building one-off screens.
- Preserve the existing patient mobile app behavior while adding internal route groups.

Internal mobile phase 1 should cover the workflows the client is most likely to need on a phone:

- Login/session/account/security for all roles
- Role dashboards for admin, doctor, and staff
- Appointments list/detail/status updates
- Appointment messages/chat and notifications
- Patients list/detail
- Clinical summaries, treatment plans, session notes, behavior programs, data points/progress
- Doctor/staff caseload views and assigned-patient workflows
- Basic orders/products/payments management needed for day-to-day operations

Internal mobile phase 2 can add heavier admin/desktop-style workflows:

- Campaign management
- Careers/testimonials/content management
- Branch/business configuration
- Advanced product inventory screens
- Reports/exports/PDF-heavy workflows
- Deep settings and low-frequency administrative tools

Decision note: if the client insists that every single dashboard feature must be available from a phone, still build it inside `apps/mobile` behind role route groups and phase it by operational priority. A second mobile app is only justified for separate branding, separate app-store distribution, or separate release cadence.

### Mobile Native / Credentials / Media

- Android Google sign-in `google-services.json` credentials are now aligned for dev/preview/production package IDs - resolved.
- Mobile push notifications are resolved; toggle, permissions, token registration, and FCM credentials are in place.
- Mobile auth/session behavior now handles server-unavailable protected patient routes with a retry screen; invalid mobile refresh tokens are treated as terminal and clear local session state.
- Mobile media upload now works through the SDK fetch-based upload path.
- Shared `useTheme` now waits for client mount and uses the resolved theme so theme-dependent UI like the shared logo rerenders correctly when the theme becomes available; syncing `"system"` also now preserves the actual saved preference instead of converting it to light/dark
- Production database bootstrap seed added at `packages/db/prisma/seed.prod.ts`; it is idempotent, does not clear transactional data, seeds real business/branch/provider records without fake license numbers, and leaves patients, appointments, clinical records, orders, payments, notifications, testimonials, and messages to live workflows instead of fake demo rows.

### Forms / Shared Inputs / UX Polish

- Mobile status bar color fix is done - `<StatusBar style="light" />` override added at `apps/mobile/app/auth/[type]/index.tsx:280` so sign-in screen icons are white over the dark hero image.
- Public mobile navigation polish in `apps/web` is completed.
- Stripe checkout appearance on `apps/web` now passes light/dark appearance options into Stripe Elements.
- Mobile `PhoneField` uses the United States phone flow for launch and displays the US flag instead of a raw country-code label.

### Public Web / Mobile Content

- Web and mobile public contact/insurance/hero/footer identity now use the shared public business-profile resolver and live business-profile API data where operational values are needed (phone, email, address, socials). Static `publicPractice` usage remains intentionally for long-form legal/default copy in `packages/shared`.
- Provider team data was corrected per client feedback: Katie Gareri, Yudislaine Pier, and Kassidy Valentin were replaced with Unisa Turay, Emmanuel Abimbola, and Daniella Turay in local and production data; production/development seed provider records were updated so future seeding keeps the corrected names and emails.
- Mobile homepage provider/team cards now mirror the public web homepage treatment more closely, including tall photo cards, Daniella Koroma owner-photo fallback, polished profile-photo placeholders, and overlaid provider summary panels.
- Insurance content decision is complete for launch: keep it static/shared unless the client later asks for admin-managed insurance content.

### Session / Auth UX / Resilience

- Server downtime and DB-reset invalid-session UX is resolved for the current production pass: web/dashboard redirect cleanly after failed refresh, and mobile protected patient routes show a retry state when the server cannot be reached.
- Same-device session dedupe is resolved for the supported browser/mobile flows; stable `deviceId` handling and `clientApp` cookie/session separation are in place.
- `PublicHeader` account dropdown and refresh-token failure / `429` throttle / invalidated session handling are resolved.

### Patient / Caregiver Account Model Follow-Up

Current caregiver access is mostly admin-driven. Before expanding patient/caregiver mobile workflows further, define and implement a stronger self-service model.

Recommended business logic:

- Support a primary caregiver/guardian account that can create or invite a child/dependent patient profile when clinically appropriate.
- Support caregiver invitations for family/guardians who should see or help manage the child's care.
- Access should require acceptance/verification by the invited caregiver unless an authorized admin creates it directly.
- Use relationship labels such as parent, guardian, spouse, family member, or authorized caregiver instead of assuming every linked person is the patient.
- Primary caregiver should be able to request/link access for a dependent, but sensitive access should remain reviewable/revocable by admin.
- Adult patients should be able to invite or revoke caregiver access for their own account when policy allows.
- Admin must be able to manage caregiver links, revoke access, and see audit/history.
- Do not allow arbitrary users to attach themselves to a patient without invitation, verification, or admin approval.

Implementation shape:

- Add caregiver invitation/request states such as pending, accepted, rejected, revoked, and expired if they do not already exist.
- Add patient/dependent creation flow for caregiver signup if the client confirms families should self-create child accounts.
- Keep clinical privacy strict: APIs must scope patient/caregiver access server-side and never rely only on mobile/web route hiding.
- Reflect the same caregiver/dependent model in `apps/web` patient portal and `apps/mobile`; admin dashboard remains the source for override/review tools.

### Mobile Audit Rule

Whenever implementing mobile work, compare against:

- `apps/web/src/app/patient/*`
- `apps/web/src/hooks/*`
- `packages/ui/src/lib/constants.ts`
- any newer server/sdk endpoints already used by web

Default assumption: if a patient-facing capability exists on web and fits the confirmed patient-mobile scope, mobile should eventually mirror it unless explicitly deferred.

## Feature Scope

### Confirmed Product Scope

- Full web platform first:
  - `apps/web` public marketing site
  - `apps/web` patient portal
  - `apps/dashboard` admin/doctor/staff dashboard
- Mobile app:
  - `apps/mobile` existing patient portal is complete for the major patient flows
  - next phase expands the same app into a role-aware mobile portal for `admin`, `doctor`, and `staff`
- Psychiatric clinical workflows are in scope alongside appointments, commerce, messaging, notifications, and operations

### Completed

- Public website pages and content framework (rebranded for CPC)
- Internal dashboard for admin, doctor, and staff
- Patient web portal core flows
- E-commerce and checkout
- Stripe and manual payments
- Multi-channel notifications
- Scheduled jobs
- Clinical workflow modules (originally ABA scaffold, now repurposed for CPC):
  - Treatment Plans
  - Behavior Programs (can be renamed to Care Programs for psychiatric context)
  - Session Notes / Progress Notes
  - Data Points
  - Staff Caseload Management
  - Insurance Authorization Tracking
  - Caregiver Access
  - Goal Tracking & Mastery
  - Progress Reports / PDF generation
- NEW - Psychiatric clinical modules (June 2026):
  - Teacher Vanderbilt Assessment (tokenized, no auth)
  - Clinical form response list/detail API (role-scoped)
  - Patient onboarding with multi-step screenings
  - Dashboard admin clinical pages (intake forms, screening results, teacher assessments)
- Patient clinical navigation in dashboard
- Patient web portal clinical read-only views
- Caregiver-linked patient web clinical views

## Client Reference

- **New client domain:** `https://connectedpsychiatriccare.com` (Robert's CPC clinic - not yet live; domain configured in all sitemap/robots/seed files)
- **Old RSG site (reference only):** `https://readysetandgoabatherapy.com/` - the previous client's ABA practice site; used only as a content/structure reference during fork

## Mobile Parity Rule

When planning patient-mobile work, treat `apps/web` patient functionality as the reference unless explicitly deferred. When planning internal-role mobile work, treat `apps/dashboard` as the workflow reference, but translate it into mobile-native screens instead of copying desktop UI patterns.

### Mobile Must Catch Up To Web On

- any new patient-facing clinical feature added to web after this point
- any future public-content/API parity changes added to web after this point
- high-priority admin/doctor/staff dashboard workflows requested for smartphone use

## Clinical Module Patterns & Conventions (established - follow these)

### Contracts pattern for clinical modules

All clinical/server modules follow this file structure:

```
packages/contracts/src/{module}/
  schema.ts      -- Zod schemas; use z.enum($Enums.SomeEnum) directly (no cast needed)
  types.d.ts     -- TypeScript interfaces; import z types from schema
  dto.ts         -- createZodDto() wrappers for NestJS
  index.ts       -- re-exports schema + types
packages/contracts/src/{module}.ts  -- entry file: export * from "./{module}/schema"; export type * from "./{module}/types"
```

Always update `packages/contracts/package.json` exports AND `tsdown.config.ts` entries, then run `pnpm --filter @workspace/contracts build`.

### Contracts response typing pattern

- Before adding or editing any contract type, inspect an existing neighboring module and follow the same structure and naming style instead of inventing a new shape.
- Model-backed `*Response` types should use `Sanitize<Model>` as the base.
- When a response includes relations, extend it with `& { relation?: RelationResponse }`.
- If the related payload is a slim select rather than the full shared response, create a small helper response alias in the same `types.d.ts` file and compose it there.
- Do not hand-write full field-by-field response interfaces when the shape comes from an existing Prisma model.
- Do not use `| null` in contract response types; use optional properties (`?:`) to match the sanitized backend response shape.
- When the nested user payload is the standard minimal user shape, use `BaseUserResponse` from `user/types.d.ts` instead of repeating `Pick<UserResponse, ...>`.
- For contract package subpath exports, follow the folder pattern only: `src/{feature}/index.ts` for frontend/shared imports and `src/{feature}/dto.ts` for backend imports. Do not keep extra root `src/{feature}.ts` wrapper files.
- If a feature enum is shared, define the Zod enum in `src/lib/enums.ts` and the inferred enum type in `src/lib/types.d.ts` instead of re-defining/exporting enum types inside the feature `types.d.ts`.

### SDK pattern

```
packages/sdk/src/{module}/index.ts  -- executeApi() wrappers; import types from @workspace/contracts/{module}
```

Add `"./module-name": "./src/module-name/index.ts"` to `packages/sdk/package.json` exports. No build step needed for SDK.

### Server module pattern

```
server/src/modules/{module}/
  {module}.service.ts     -- business logic; access control in service, not controller
  {module}.controller.ts  -- thin; @Roles() at class level for default, method-level to override
  {module}.module.ts      -- imports PrismaModule; wires controller + provider
```

Register in `server/src/app.module.ts`.

### Access control hierarchy (all clinical modules)

- `admin` - full access (all patients, all records)
- `doctor` - own patients only (via `appointments.some({ doctorId })`)
- `staff` - assigned patients only (via `staffAssignments.some({ staffId, isActive: true })`)
- `patient` - own records only (via `userId` on `PatientProfile`)

### Dashboard page pattern (clinical pages)

- List page - breadcrumb + `PageIntro` + action button + cards with `SectionCard`
- Form (create/edit) - shared `{Feature}Form` component in `apps/dashboard/src/components/forms/`; role-aware `rolePrefix` from `useRolePrefix()` hook
- New page - thin wrapper: `<FeatureForm patientId={id} formType="add" />`
- Edit page - thin wrapper: `<FeatureForm patientId={id} featureId={featureId} formType="update" />`
- Doctor patient detail (`/doctor/patients/[id]/page.tsx`) re-exports admin version - `rolePrefix` computed dynamically from pathname so it automatically routes to the right portal

### Form pattern - MUST follow this, no exceptions

All create/edit forms in `apps/dashboard/src/components/forms/` MUST use **`GenericForm`** from `@workspace/ui/shared/GenericForm` for any form that has standard add/edit/save/cancel/reset behavior. Never recreate the submit shell, loading guard, cancel button, or `useEffect` reset manually.

**GenericForm is the default.** Use raw `useForm` only when the form has fundamentally non-standard behavior that GenericForm cannot support.

```tsx
import { GenericForm } from "@workspace/ui/shared/GenericForm";
import { FormSection } from "@workspace/ui/components/form";
import { InputField } from "@workspace/ui/components/input-field";
import { SelectField } from "@workspace/ui/components/select-field";

const MyForm = ({ entityId, formType }: BaseCUFormProps) => (
  <GenericForm
    entityId={entityId}
    formType={formType}
    entityName="Record"
    description="Short description shown below the title."
    schema={mySchema}
    useQuery={useMyRecord}
    defaultValues={{ field1: "", status: "active" }}
    // Optional: custom success redirect or callback
    onSuccess={() => router.push("/my-list")}
  >
    {(form, data) => (
      <>
        <FormSection title="Details" description="...">
          <InputField form={form} name="field1" label="Label" />
          <SelectField
            form={form}
            name="status"
            label="Status"
            options={STATUS_OPTIONS}
          />
        </FormSection>
      </>
    )}
  </GenericForm>
);
```

**GenericForm handles automatically:**

- Loading skeleton while fetching edit data (`isLoading`)
- `form.reset()` with fetched data on edit
- `toast.success` / `toast.error` on submit
- Cancel button navigating back via `getBackPath(pathname, ...)`
- Submit button with `isPending` / `canSubmit` state
- `PageIntro` header from `title` / `description` / `entityName` props

**`useQuery` hook shape required by GenericForm:**
The hook passed to `useQuery` must return `{ data, isLoading, mutateAsync, isPending, mutateError, fetchError }`. All standard dashboard hooks follow this shape.

**When NOT to use GenericForm (use raw `useForm` instead):**

- Form has no standard add/edit split (e.g. single-page settings, status-only update)
- Submit redirects to a dynamically computed route that depends on the mutation result and role (e.g. post-create redirect to a newly created record's detail page)
- Form needs `arrayFields` (GenericForm supports these via the `arrayFields` prop)

**`PageIntro` import - always use the shared component:**

```ts
import PageIntro from "@workspace/ui/shared/PageIntro";
```

Never import from `@/components/dashboard/PageIntro` - that local file no longer exists.

**Field components to use (from `@workspace/ui/components/`):**

- Text/textarea/number/email → `InputField` (prop `type="textarea"` for multiline)
- Date picker → `DatePickerField`
- Select dropdown → `SelectField` or `FormField` with `<Select>` for custom options
- Combobox/search → `ComboboxField`
- Checkbox → `CheckboxField`

**Never do:**

- `useState` + `set()` pattern for form fields
- `useEffect` to load data into `useState` form state
- Local wrapper hooks in form files just to rename `mutateAsync` / `isPending` / `mutateError` when the shared hook can return them directly
- In `form.reset(...)`, do not manually remap server fields one by one when the response already matches the form shape.
- Do not add `field: data.field ?? undefined`, enum `as SomeType["field"]`, or `new Date(data.field)` inside `form.reset(...)` unless the form shape truly differs from the response shape.
- Only map inside `form.reset(...)` when the form value is genuinely different from the API payload, such as converting related object arrays into `id[]` fields.
- Do not add extra `useUser().isLoading` guards in dashboard forms just to confirm a signed-in user exists; the root dashboard layout already handles authenticated access.
- In `ComboboxField` `getOption`, always use the single exact ID the backend DTO expects. Never use fallback mixed IDs like `user.id ?? profile.id`. If the endpoint expects a user ID, send `user.id`; if it expects a profile/model ID, send that model ID.
- In `apps/*`, when a payload includes `user.displayName`, use it directly. Do not add fallback labels like `"Patient"` or `record.id` for `user.displayName`.
- Inline `RequiredLabel` component - use `required` prop on field components
- Inline `toDateInputValue()` / `toDateInput()` - use `isoToDateInput()` from `@workspace/shared/utils`
- Inline `rolePrefix` `useMemo` - use `useRolePrefix()` from `@/hooks/use-role-prefix`
- Inline dialog forms in page components - extract to `{Feature}FormDialog` in `components/forms/`

### Hook pattern - MUST follow this, no exceptions

All TanStack Query hooks in `apps/dashboard/src/hooks/` MUST follow the `appointment.ts` pattern exactly:

```ts
import { parseDuration } from "@workspace/shared/utils";

const STALE_TIME = parseDuration("10m");
const queryDefaults = {
  staleTime: STALE_TIME,
  gcTime: STALE_TIME,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  retry: false,
};

// List query
export function useMyRecords(params?: MyQueryType) {
  const query = useQuery({
    queryKey: ["my-records", params],
    queryFn: () => mySdk.listMyRecords(params),
    select: (res) => res.data, // NO "as Type" - SDK return type is inferred
    placeholderData: (prev) => prev,
    ...queryDefaults,
  });
  return {
    data: query.data, // NO ?? fallback object - handle undefined at usage site
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchError: query.error as ApiException | null,
  };
}

// Single query
export function useMyRecord(id?: string) {
  const query = useQuery({
    queryKey: ["my-record", id],
    queryFn: () => mySdk.getMyRecord(id!),
    select: (res) => res.data, // NO "as Type"
    enabled: Boolean(id),
    ...queryDefaults,
  });
  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchError: query.error as ApiException | null,
  };
}

// Mutation
export function useCreateMyRecord() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: CreateMyRecordType) => mySdk.createMyRecord(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-records"] });
    },
  });
  return {
    createAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}
```

**Never do:**

- `select: (res) => res.data as SomeType` - drop the `as` cast; SDK types it automatically
- `data: q.data ?? { items: [], total: 0, ... }` - never add fallback objects; return `q.data` directly
- `staleTime: 0` - use `STALE_TIME` (10m) unless the data has a business reason to always be fresh (e.g. SSE-driven notifications)
- Omit `placeholderData: (prev) => prev` on list queries - this prevents flash of empty state on param change
- Omit `isFetching` from return - callers need it to show loading indicators without hiding existing data

### Shared utilities - use always, never inline

**`@workspace/shared/utils`** - always import, never inline:

- Dates: `formatDate`, `parseDate`, `isoToDateInput` (converts ISO string → `YYYY-MM-DD` for date inputs)
- Numbers: `formatNumber`, `formatPrice`, `formatPricePrecise`
- Strings: `getInitials`, `slugify`

**`apps/dashboard/src/hooks/use-role-prefix.ts`** - `useRolePrefix()` hook:

- Returns `"/admin"`, `"/doctor"`, or `"/staff"` based on current pathname
- Use in every form and page that builds role-relative links
- NEVER inline this `useMemo` in component files

### Decimal fields

Hours and money use `Decimal` from `@workspace/db/client/runtime/library`. Always `new Decimal(value)` when writing; `.toString()` when serializing to JSON response.

### Enum usage in Zod

```ts
import * as $Enums from "@workspace/db/enums";
const MyEnum = z.enum($Enums.SomePrismaEnum); // works directly - no cast needed
```

### Always use shared schema utils - never inline primitive validators

`packages/contracts/src/lib/schema.ts` exports reusable primitives. **Always import and use these instead of writing inline Zod validators.** If a pattern is not yet in `lib/schema`, add it there first, then use it everywhere.

| Pattern to avoid                                  | Use instead            |
| ------------------------------------------------- | ---------------------- |
| `z.boolean()`                                     | `booleanSchema`        |
| `z.url()`                                         | `urlSchema`            |
| `z.string().trim().min(1)`                        | `requiredStringSchema` |
| `z.string().trim().min(1).max(4000)`              | `messageSchema`        |
| `z.coerce.number().min(0).max(100)`               | `percentSchema`        |
| `z.string().trim().min(2)` or `z.string().min(2)` | `nameSchema`           |
| `z.string().trim().optional()`                    | `optionalStringSchema` |
| `z.coerce.number().min(0)`                        | `numberSchema`         |
| `z.coerce.number().min(1)`                        | `positiveNumberSchema` |
| `intNumberSchema.min(1)`                          | `positiveIntSchema`    |
| `z.iso.datetime(...)`                             | `isoDateSchema`        |
| `z.ulid()`                                        | `idSchema`             |
| `numberSchema.min(0)` (double-min)                | just `numberSchema`    |
| `optionalStringSchema` for FK references          | `idSchema.optional()`  |

When a FK/relation field (like `treatmentPlanId`, `doctorId`, `patientId`) is optional in a schema body or a query filter, always use `idSchema.optional()` - not `optionalStringSchema`, which skips ULID validation.

### Boolean fields in contracts - always use `booleanSchema`

Never use bare `z.boolean()` for fields in contract schemas. Always import and use `booleanSchema` from `../lib/schema`:

```ts
import { booleanSchema } from "../lib/schema";

// correct
isActive: booleanSchema.default(true),
hasNoProfile: booleanSchema.optional(),

// wrong - breaks when value arrives as query-param string "true"/"false"
isActive: z.boolean().default(true),
```

`booleanSchema` wraps `z.preprocess` to coerce the strings `"true"` and `"false"` (common in HTTP query params) to actual booleans before Zod validates them. The only exception is `z.boolean()` inside a `z.preprocess(...)` call - those are definition sites, not usage sites.

## Monorepo Architecture Rules

### Package Boundaries

- `apps/web` and `apps/dashboard` should stay thin. They compose packages and feature pages.
- `packages/contracts` is the single source of truth for shared enums, DTOs, validation schemas, request/response types.
- `packages/sdk` is the client-side API boundary. Add SDK helpers here instead of calling fetch/axios directly from app code.
- `packages/ui` is for reusable UI primitives, shared providers, reusable hooks, generic CRUD building blocks. Web only.
- `packages/shared` is for framework-agnostic constants and utilities.
- `packages/db` owns Prisma and database-facing shared code. All models use ULID primary keys.
- `server` owns business logic, data access orchestration, auth rules, side effects, and module wiring.

### Preferred Feature Flow

1. Update `packages/contracts` first (Zod schemas, DTOs, types).
2. Add or update the matching `packages/sdk` functions.
3. Implement or extend the `server` module/controller/service.
4. Extract reusable UI/hooks/providers into `packages/ui` when they are generic.
5. Keep app pages focused on composition and route-specific behavior.

### Reuse Before Duplicating

- If logic or UI is useful across multiple dashboard screens, move it into `packages/ui`.
- If a type is shared between server and frontend, it belongs in `packages/contracts`.
- If a utility does not depend on React, Next.js, or NestJS, prefer `packages/shared`.
- For any new work in `packages/contracts`, `packages/sdk`, `server`, or `apps/*`, first inspect an existing matching feature and follow that same structure, naming, and logic pattern unless there is a clear reason to refactor the shared convention.

## Dashboard and Web Conventions

- Prefer shared building blocks: provider wrappers, shared hooks, generic tables, generic forms, generic detail pages, search toolbars, media helpers, skeletons.
- Route files should primarily assemble data hooks, shared UI, and route-specific config.
- Dashboard role route groups `(root)/admin`, `(root)/doctor`, `(root)/staff` must each enforce the correct role. Never mix role-specific logic across groups.
- In web apps, prefer `packages/ui` components before adding app-local duplicates.
- In mobile, prefer existing shared mobile UI/components before creating another one-off version of the same pattern.

## Server Conventions

- Follow the Nest module pattern: `module`, `controller`, `service`.
- Keep validation and shared API shapes aligned with `packages/contracts`.
- Do not put direct database logic in controllers.
- All routes are protected by the global `AuthGuard` by default. Use `@Public()` only for truly unauthenticated endpoints.
- Use `@Roles()` decorator to restrict endpoints beyond the global auth check.
- Soft-delete models use `deletedAt DateTime?`. Always filter `deletedAt: null` in queries on soft-deletable models (User, Media, Branch, ContactMessage, NewsletterSubscriber).
- IDs are ULIDs. Never assume UUID format.
- All money/hours fields use `Decimal @db.Decimal`. Never use `Float` for currency or clinical hours.

## Auth & Security Rules

- Passwords hashed with argon2. Never store plain text.
- Refresh tokens stored as argon2 hashes in the `Session` table (not the raw token).
- JWT cookies: `httpOnly`, `secure` (prod), `sameSite: strict`.
- JWT payload includes: `sub` (userId), `sid` (sessionId), `rol` (role), `sts` (status), `aud` (client app).
- OTP: 6-digit numeric (`crypto.randomInt`) or 64-char hex (`crypto.randomBytes(32)`). Never use `Math.random()`.
- Never expose passwords in response objects.
- Rate limiting (`@nestjs/throttler`) and `helmet` headers are wired.

## Production Checklist (Server)

All core production items are complete:

- ✅ `@nestjs/throttler` - rate limiting wired in `app.module.ts`
- ✅ `helmet` - HTTP security headers in `main.ts`
- ✅ `trust proxy` - set in `main.ts`
- ✅ `DashboardModule` - wired in `app.module.ts`
- ✅ `DashboardService` - all four overviews implemented (admin, doctor, staff, patient)
- ✅ `staff` role - `ClientService.assertRoleAccess` correctly allows staff on dashboard
- ✅ Staff portal - full route group `/(root)/staff` with appointments, patients, messages, profile, dashboard
- ✅ All ABA server modules registered in `app.module.ts`: TreatmentPlanModule, BehaviorProgramModule, SessionNoteModule, DataPointModule, StaffAssignmentModule, InsuranceAuthorizationModule

## CPC Rebranding - Completed (June 2026)

The entire codebase was rebranded from Ready Set And Go ABA (Maryland ABA practice) to Connected Psychiatric Care (California psychiatric clinic). Zero ABA/RSG/BCBA source references remain in the codebase after this pass.

### Brand Cleanup - All Files Updated

| Area | Files Updated |
|------|---------------|
| Dashboard | PatientDetailLayoutShell, StaffForm credentials/specialties, progress report placeholder text, testimonials placeholder |
| Contracts/Enums | `AbaCredentialEnum` → psychiatric credentials (PMHNP-BC, APRN, LCSW, LPC, etc.), `AbaSpecialtyEnum` → psychiatric specialties, `InsurancePayerEnum` → CA payers (Medi-Cal, Blue Shield CA, Health Net, Covered California, Anthem) |
| Server email | caregiver-access service footer → `connectedpsychiatriccare.com` |
| Mobile | Android strings.xml, settings.gradle, app.config.ts, about/account/contact/shop/careers/progress-reports/auth pages, team-section/home-about-preview components, PLAY_STORE_REVIEW.md, generate-icons.html, eas.json |
| Web public | robots.txt, sitemap.xml, sitemap-0.xml, sitemap.config.cjs - all URLs → connectedpsychiatriccare.com |
| Database seeds | seed.demo.ts (emails, credentials, specialties, address → LA CA), seed.prod.ts (all REPLACE_WITH_* placeholders, legalName, timezone, CA branch), seed.cleanup.ts (email domains), seed.ts (full batch replace of all ABA refs) |
| Email templates | layout.tsx tagline, signUp.tsx bullets |
| Prisma schema | schema.prisma comment "BCBA or doctor" → "clinician or doctor" |

### New Psychiatric Clinical Backend Modules

**`server/src/modules/teacher-token/`** - Teacher Vanderbilt Assessment (tokenized, no auth)
- `sendToken` - creates `TeacherAssessmentToken` (32-byte hex, 14-day expiry), emails teacher
- `validateToken` - `@Public()` GET, returns token + patient info for teacher form prefill
- `submitForm` - `@Public()` POST, validates 27 Vanderbilt items (9+9+9), creates `ClinicalFormResponse` of type `vanderbiltTeacher`, marks token `completed`
- Controller: `POST /teacher-tokens`, `GET /teacher-tokens`, `GET /teacher-tokens/:token/validate`, `POST /teacher-tokens/:token/submit`

**`server/src/modules/clinical-forms/`** - Clinical Form Response List/Detail
- `list(query, currentUser)` - role-scoped: admin sees all, doctor sees own patients, staff sees assigned
- `findOne(id, currentUser)` - role-scoped single form response
- Controller: `GET /clinical-forms`, `GET /clinical-forms/:id`
- Query params: `patientId`, `formType`, `isOnboarding`, `page`, `limit`, `sortOrder`

**Patient module - Onboarding endpoints** (added to `patient.controller.ts` / `patient.service.ts`)
- `GET /patients/me/onboarding` - returns current onboarding status from `PatientOnboarding`
- `POST /patients/me/onboarding` - accepts multi-step wizard submission (forms array + completedSteps), calls `clinicalFormResponse.createMany`, `patientOnboarding.upsert`, `user.update({ onboardingCompletedAt })`
- DTO: `SubmitOnboardingDto` with `forms[]` (formType, responses, totalScore, interpretation) + `completedSteps` object

Both new NestJS modules registered in `server/src/app.module.ts`.

### New SDK Extensions

`packages/sdk/src/onboarding/index.ts`:
- `ClinicalFormResponseItem` type
- `ClinicalFormsQuery` type  
- `listClinicalForms(query)` → `GET /clinical-forms`
- `getClinicalForm(id)` → `GET /clinical-forms/:id`

### New Dashboard Hooks

`apps/dashboard/src/hooks/clinical-forms.ts`:
- `useClinicalForms(query)` - paginated clinical form responses
- `useClinicalForm(id)` - single form response detail
- `useTeacherAssessments(patientId?)` - shortcut for vanderbiltTeacher formType

### New Dashboard Admin Clinical Pages

| Page | Path | Description |
|------|------|-------------|
| Intake Forms | `/(root)/admin/clinical/intake-forms/` | Lists adult + adolescent psychiatric intake submissions; shows patient name + raw JSON |
| Screening Results | `/(root)/admin/clinical/screening-results/` | PHQ-9, GAD-7, ASRS, Vanderbilt Parent with color-coded severity badges (none/mild/moderate/severe) |
| Teacher Assessments | `/(root)/admin/clinical/teacher-assessments/` | Vanderbilt Teacher submissions, positive/negative screen badge, teacher name and school |

### Clinical Form Types (enum `ClinicalFormType`)

- `phq9` - PHQ-9 depression screening
- `gad7` - GAD-7 anxiety screening
- `asrsAdult` - ASRS-v1.1 ADHD screening (adult)
- `vanderbiltParent` - Vanderbilt Parent Assessment
- `vanderbiltTeacher` - Vanderbilt Teacher Assessment (tokenized public link)
- `adultPsychiatricIntake` - Adult psychiatric intake form
- `adolescentPsychiatricIntake` - Adolescent psychiatric intake form

### Key Prisma Models (psychiatric clinical)

- `PatientOnboarding` - tracks onboarding steps (`personalInfo`, `insurance`, `intake`, `screenings`, `consent`)
- `ClinicalFormResponse` - stores all form submissions (linked to `PatientProfile`, has `formType`, `responses JSON`, `totalScore`, `interpretation`)
- `FormAssignment` - assigns clinical forms to patients
- `TeacherAssessmentToken` - 14-day expiry token for teacher Vanderbilt submissions (statuses: `pending`, `completed`, `expired`)

### Known Pending Items After Rebranding

- [ ] **Robert's owner photo** - `apps/web/public/images/cpc-provider-owner.jpg` does not exist. All public pages reference this path. Robert must provide a photo.
- [ ] **Hero image** - `apps/web/public/images/hero-image.png` may still have ABA imagery. Needs replacement with psychiatric care photo.
- ✅ **`BehaviorProgramModule` UI labels** - "Behavior programs" section title renamed to "Care Programs" in mobile `treatment-plan-detail-screen.tsx`; dashboard form and treatment plan page already used "Care Program" / "Care Programs". Code identifiers (`useBehaviorProgram`, `BehaviorProgramForm`) are internal and do not surface to users.
- ✅ **Teacher token email template** - Converted from `buildTeacherEmailHtml` plain HTML string to a proper React Email template (`TeacherAssessment`) in `packages/templates/src/email/teacherAssessment.tsx`. `renderTeacherAssessmentEmail()` exported from `@workspace/templates` and used in `teacher-token.service.ts`.

---

## Remaining Production Work

All planned code work is complete. The items below are operational tasks or explicitly deferred features.

### Internal Permissions / Superadmin Model

- **Substantially complete - server enforcement, dashboard UI, and audit logging done**
  - ✅ `StaffPermission` table added (`@@unique([staffId, module])`) with `PermissionModule` enum
  - ✅ `staff-permission` contracts module, SDK helpers, and `StaffPermissionModule` (server) added; `PUT/GET /staff-permissions/:staffId` admin-only endpoints wired
  - ✅ Staff profile responses now always include `permissions` module list
  - ✅ `ModulePermissionGuard` registered as global APP_GUARD (3rd in chain after ThrottlerGuard → AuthGuard); admin always passes, staff must have the module in their `StaffPermission` rows; `@RequiresModule()` decorator applied to 13 controllers
  - ✅ Admin staff detail page shows `StaffPermissionsForm` checklist for granting/revoking modules per staff member
  - ✅ Audit logging wired: `AuditModule` imported into `AdminModule`, `StaffPermissionModule`, `PaymentModule`, `OrderModule`; `AuditService.log()` called on user update/delete/restore, staff permission sync, payment status change, and order status change
  - ✅ Owner/superadmin guard complete: `AdminService.deleteUser` blocks self-deletion and deletion of any admin-role user; `AdminService.updateUser` blocks modifying another admin's account; `assertNotAdmin` helper enforces both; server `check-types` clean

### Mobile Internal Dashboard

- **Phase 1 complete - role-aware routing and core screens shipped**
  - ✅ `apps/mobile` converted to role-based route groups: `(admin)/`, `(doctor)/`, `(staff)/` alongside existing `(patient)/`
  - ✅ Post-login routing uses `getRoleDashboardHref(role)` to send admin/doctor/staff to their own group
  - ✅ `useInternalAuth(expectedRole)` shared hook guards each role layout with loading/offline/unauthorized/wrong-role states
  - ✅ Per-role Drawer sidebars (admin/doctor/staff) with role-appropriate navigation groups
  - ✅ Dashboard index screens (admin/doctor/staff) show live data from `useAdminDashboard`, `useDoctorDashboard`, `useStaffDashboard` - upcoming appointments, stat tiles, recent patients/caseload
  - ✅ Shared `components/internal/` layer: `InternalAppointmentsList`, `InternalAppointmentDetail` (with embedded chat + status transitions), `InternalPatientsList`, `InternalPatientDetail`, `InternalConversationsList`, `InternalNotifications`, `InternalAccount`, `InternalOrdersList`, `InternalOrderDetail`, `InternalProductsList`, `InternalPaymentsList`, `InternalStaffList`, `InternalStaffDetail`
  - ✅ All route files created for admin (appointments, patients, messages, notifications, orders, products, payments, staff, account), doctor (appointments, patients, messages, notifications, account), staff (appointments, patients, messages, notifications, account)

- **Phase 2a - Small/Medium gaps (dashboard → mobile parity, complete)**

  Goal: every daily-use `apps/dashboard` workflow accessible from `apps/mobile`. `apps/web` patient portal is already mirrored in mobile patient group. Focus is `apps/dashboard` internal screens only.

  | # | Feature | Roles | Status |
  |---|---------|-------|--------|
  | 1 | Patient detail clinical sub-tabs (Treatment Plans, Session Notes, Authorizations, Caregivers lists) | admin/doctor/staff | ✅ |
  | 2 | Treatment plan detail + behavior programs + mastery progress | admin/doctor/staff | ✅ |
  | 3 | Session note detail | admin/doctor/staff | ✅ |
  | 4 | Doctor profile page (`doctor/profile/`) | doctor | ✅ |
  | 5 | Staff profile page (`staff/profile/`) | staff | ✅ |
  | 6 | Doctor availability page (`doctor/availability/`) | doctor | ✅ |
  | 7 | Product detail + create/edit/delete (admin full CRUD) | admin | ✅ |
  | 8 | Order status update from mobile | admin | ✅ |
  | 9 | Categories CRUD (admin) | admin | ✅ |
  | 10 | Doctors management - list/detail/edit (admin) | admin | ✅ |
  | 11 | Staff detail/edit + patient caseload (admin) | admin | ✅ |
  | 12 | Users management - list/detail (admin) | admin | ✅ |
  | 13 | Contact messages / leads (admin) | admin | ✅ |
  | 14 | Newsletter subscribers (admin) | admin | ✅ |
  | 15 | Payment detail screen (admin) | admin | ✅ |

- **Phase 2b - Lighter items complete; heavy items deferred**
  - ✅ Branches CRUD - list, detail, inline edit (name/email/phone/isActive), delete; registered in admin drawer + sidebar
  - ✅ Business Profile settings - view/edit (email, phone, website); `settings/index` screen with inline edit form
  - ✅ Campaigns management - list, create (title/message/audience/channel), send-now, draft↔scheduled toggle; `campaigns/index` screen
  - ✅ Testimonials management - list (pending/published), publish/unpublish, delete; `testimonials/index` screen
  - ✅ Careers / Job listings management - list, inline create (title/location/description), delete; `careers/index` screen
  - ✅ Audit Logs viewer - read-only paginated log with action-type color badges; `audit-logs/index` screen
  - ✅ Traffic Sources analytics - summary stats + per-source cards (views/contacts/consults/subs); `traffic/index` screen
  - ✅ Media library (internal roles) - `apps/mobile/app/admin/media/index.tsx` renders the shared `MediaLibraryWorkspace` component (same upload/browse/delete UI as patient media); registered in admin drawer and sidebar under Administration
  - ✅ Progress Reports / PDF generation (Feature 9) - complete: contracts, SDK, server module, dashboard list/detail/generate pages, web patient portal, mobile patient + admin screens

### Patient / Caregiver Self-Service

- **Caregiver invitation / account linking - partially complete**
  - ✅ `CaregiverInvitation` table with `CaregiverInvitationStatus` + `CaregiverRelationship` enums and migration applied
  - ✅ `CaregiverAccess` updated with `relationship` field and `invitation` relation
  - ✅ Full contracts/SDK/server implementation: `POST /caregiver-access/invitations`, `GET /caregiver-access/my-profile`, `GET /caregiver-access/my-invitations`, public token lookup, patient accept/reject, admin/patient revoke
  - ✅ Email invitation sent on `sendInvitation` with accept link pointing to `/patient/caregivers/accept?token=`
  - ✅ Web patient portal: `/patient/caregivers` page - invite form, active caregivers list with revoke, pending/past invitations; `/patient/caregivers/accept` page - token-based accept/reject flow
  - ✅ "FAMILY ACCESS" → Caregivers nav entry added to patient sidebar (web + mobile auto-derives from shared `patientSidebarMenu`)
  - ✅ Mobile patient portal: `apps/mobile/app/patient/caregivers/index.tsx` - mirrors web with invite form, active caregivers, pending/past invitations; registered in patient layout
  - ✅ Admin dashboard: `/clinical/caregivers/invitations` list page with status/email/patient columns and status filter; "Caregiver Invitations" entry added to admin sidebar under Clinical Records
  - ✅ Caregiver self-create dependent profile: `POST /patients/dependent` (patient role, no admin approval); `createDependentSchema` + `CreateDependentDto` added to contracts, SDK `createDependent` function added, server `PatientService.createDependent` creates User + PatientProfile + CaregiverAccess in one transaction; web patient caregivers page and mobile caregivers screen both show an "Add Child / Dependent" form with first/last name, DOB, and relationship picker

### Payments

- PayPal support for `apps/dashboard` is intentionally deferred - client confirmed this is out of scope for launch.
- ✅ Stripe payments live on web, mobile (PaymentSheet), and server (webhooks)
- ✅ PayPal payments live on web and mobile (auth browser + capture)
- ✅ Manual payment flow available as fallback

### Mobile Release Operations

Robert needs his own Apple Developer account and Google Play Console account before publishing the CPC app. This project has never been published to any app store.

- `apps/mobile/eas.json` - Apple credentials are `REPLACE_WITH_*` placeholders: `appleId`, `ascAppId`, `appleTeamId`. Robert must fill these before running an iOS build.
- Android dev-client test command: `eas build -p android --profile development` (use globally installed EAS CLI, not `npx eas-cli@latest`).
- Firebase iOS plist must be saved to `apps/mobile/GoogleService-Info.prod.plist` before an iOS production build.
- Sign in with Apple is implemented (required alongside Google OAuth for App Store approval): `expo-apple-authentication`, `POST /oauth/apple/mobile`, `AppleAuthenticationButton` in `social-auth-field.tsx`.

---

## Quality Bar

- Favor extraction, naming clarity, and strong boundaries over quick inline code.
- Prefer professional, reusable solutions over one-off route hacks.
- When unsure where code belongs, choose the most reusable package that matches its responsibility.

## Package Build Rule

- When adding a new module or feature under any `packages/*` package that uses `tsdown`, always update that package's `package.json` exports and `tsdown.config.ts` entries in the same change.
- When changing code in any `packages/*` package that uses `tsdown`, rebuild that package before considering the task done: `pnpm --filter @workspace/contracts build`.
- If package import errors remain after updating exports/entries and rebuilding, stop and report - do not try workaround hacks.

---

### CPC Client Details (Connected Psychiatric Care - Robert)

All production business details for Robert's clinic are stored as `REPLACE_WITH_*` placeholders in:

- `packages/db/prisma/seed.prod.ts` - Robert must fill: business info, provider names/emails/NPI, branch address, social links
- `apps/mobile/eas.json` - Robert must fill: Apple Developer credentials (appleId, ascAppId, appleTeamId)
- `packages/db/prisma/seed.ts` - business section social links are `REPLACE_WITH_*`

**Do NOT hardcode Robert's personal details in source.** All PII and clinic-specific data belongs in the seed files behind `REPLACE_WITH_*` or in Robert's environment variables.

**What Robert needs to fill before production launch:**

1. `seed.prod.ts` - legalName, address, phone, email, website, providers (name, email, NPI, license), social media links, branch info
2. `seed.ts` business section - instagram, twitter, linkedin, tiktok URLs
3. `eas.json` - appleId, ascAppId, appleTeamId (Apple Developer account)
4. `apps/web/public/images/cpc-provider-owner.jpg` - Robert's actual provider photo (all public pages reference this path)
5. `apps/web/public/images/hero-image.png` - Replace with psychiatric care hero imagery (currently may still have ABA imagery)

**Demo accounts** (created by `pnpm --filter @workspace/db prisma:seed:demo`):
- `demo-patient@connectedpsychiatriccare.com` / `CpcDemo2026!`  (PMHNP-BC slug: `demo-provider-pmhnp`)
- `demo-doctor@connectedpsychiatriccare.com` / `CpcDemo2026!`
- `demo-staff@connectedpsychiatriccare.com` / `CpcDemo2026!`
- `demo-admin@connectedpsychiatriccare.com` / `CpcDemo2026!`

// ============================================================

# ⚠️ DOCTOR PROFILE DATA (IMPORTANT SEEDING)

// ============================================================
//
// The following rules MUST be followed when generating doctor data:
//
// 1. specialties (String[])
// - This is the ONLY source of truth for specialties
// - Always provide multiple values when possible
// - DO NOT duplicate into a single "specialty" field
//
// 2. title (String)
// - Human-readable display title (UI/marketing)
// - Can include role + certification (e.g. "PMHNP-BC, Clinical Director")
// - DO NOT try to normalize or split this
//
// 3. credentials (String[])
// - Certifications ONLY (e.g. "PMHNP-BC", "APRN", "LCSW", "LPC")
// - DO NOT include degrees here
//
// 4. education (String)
// - Degree / academic background ONLY
// - Example: "M.S.N. Psychiatric-Mental Health Nurse Practitioner"
// - Should NOT be repeated inside credentials
//
// 5. ❌ DO NOT USE: // i already removed from schema.prisma
// - specialty (single string) → use specialties[]
// - qualifications → redundant with credentials
//
// 6. Avoid duplication across fields:
// - education should NOT appear in credentials
// - credentials should NOT be repeated in title unless needed for display
//
// This structure is optimized for:
// - filtering (specialties)
// - UI display (title)
// - clean domain modeling (no duplication)
// ============================================================

## Next Steps for CPC Platform (Priority Order)

Use this as the starting point for the next chat session. Tell the assistant: **"Continue the CPC platform - use AGENTS.md for context. Start with the next unfinished item below."**

### Completed (formerly Priority 1-3, 5-6)

These items were listed as unbuilt but are now confirmed done:

- **Backend compilation** - `pnpm --filter server check-types` and `pnpm --filter web check-types` both pass clean. `teacher-token` and `clinical-forms` NestJS modules compile without errors.
- **Patient onboarding web flow** - As of August 22, 2026 the wizard lives at `apps/web/src/app/(root)/complete-profile/page.tsx` (moved out of the `/patient/*` route group - see the dated entry below), with step components at `apps/web/src/components/onboarding/steps/`. The `/patient/onboarding` route (web) is still a read-only status view (not a wizard) showing completed steps with links to assessments and treatment plans. Do NOT add another wizard at `/patient/onboarding` - it already exists at `/complete-profile`. (`apps/mobile`'s own `/patient/complete-profile` screen is unaffected - it is a separate Expo route, not a link to the web URL.)
- **Teacher Vanderbilt public form** - Fully built at `apps/web/src/app/teacher-assessment/[token]/page-client.tsx`. All 27 items (9+9+9), 4 steps, handles expired/submitted/not-found states.
- **Patient portal screening results** - Exists at `apps/web/src/app/patient/care/assessments/page.tsx` (NOT `/patient/screenings/`). Shows PHQ-9/GAD-7/ASRS/intake history with severity badges. Linked in sidebar as "Assessments & Forms". 403 bug fixed: `clinical-forms` controller now allows `patient` role; service scopes to the patient's own records (`patientProfile.userId === currentUser.id`).
- **Teacher assessment dashboard integration** - Fully built at `apps/dashboard/src/app/(root)/patients/[id]/teacher-assessments/page.tsx`. Send dialog, token list with Submitted/Expired/Pending badges, dates.

### Completed (June 30, 2026)

- **AGENTS.md cleaned** - Removed RSG iOS/Play submission history, stale rebranding checklist items, and the RSG reference-site link. Only CPC-relevant context remains.
- **Provider Dashboard Briefing Sidebar** - `PatientBriefingPanel` built at `apps/dashboard/src/components/dashboard/patients/PatientBriefingPanel.tsx`. Shows onboarding status, most recent PHQ-9/GAD-7/ASRS scores with severity badges, and active treatment plan name. Rendered at the top of `PatientOverviewContent` (the `/patients/[id]` overview tab).
- **Mobile auth form 2-step signup** - `apps/mobile/app/auth/[type]/index.tsx` updated: Step 1 = firstName/lastName/email + Continue (enabled only when step-1 fields are valid); Step 2 = phone/password + Create Account + Back button. Social auth shown on step 1 only. `signupStep` resets to 1 on `formType` change.
- **Mobile doctor cards navigate** - Each card in `apps/mobile/components/section/team-section.tsx` wrapped in a `Pressable` that routes to `/doctors/[slug]` when the doctor has a slug.
- **Mobile patient sidebar** - Removed duplicate Profile link from `patientSidebarFooterItems` in `apps/mobile/lib/navigation.ts`; only "Account & Settings" remains (Profile is already accessible via the Account tab).
- **Account dropdown** - `patientDropdownMenu` reorganized into 3 groups: (1) Appointments / Messages / Notifications, (2) Treatment Plans / Assessments / Payments, (3) Profile / Account & Settings. `AccountDropdown.tsx` fixed: removed `w-(--radix-dropdown-menu-trigger-width)` constraint that made the dropdown too narrow; internal users (admin/doctor/staff) now see "Go to Dashboard" instead of patient links.
- **Navigation audit** - All public pages confirmed reachable:
  - `/careers` added to `footerMenu` "About Us" group + web header "About" mega-menu + mobile account welcome quick links
  - `/contact` added to `footerMenu` "About Us" group
  - `/shop` added to `footerMenu` "resources" group
  - `/account-deletion` added to `footerMeta.legal` bottom row
  - Mobile account page (`account-page-content.tsx`) now has Privacy / Terms / Cookie Settings links at the bottom

### Completed (July 21, 2026) - Client-requested brand/content changes (Robert, via billing team)

- **Brand colors changed to blue + dark green** - Client asked to try dark-green-primary/blue-accent first (option A), with blue-primary/dark-green-accent (option B) as a possible follow-up swap if Robert prefers it. Implemented option A: `--primary` (and `--ring`, `--chart-1`, all `--sidebar-*` tokens) changed from teal (`#00C9A7`, oklch hue 174) to dark green (`#1B5E20`, oklch hue 150–152) in `packages/ui/src/styles/globals.css` and `apps/mobile/app/global.css` (light + dark mode variants), plus RN-safe hex mirror in `apps/mobile/lib/theme.ts`. `--accent` (blue `#2563EB`/`#3B82F6`) is unchanged. Hardcoded teal hex in `app.config.ts`, `Logo.tsx` (web + mobile), `_layout.tsx` (Android notification color), and `apps/web/src/app/manifest.ts` (PWA theme color) also updated to `#1B5E20`. If Robert wants option B (blue primary), swap which token family gets the light/bright treatment vs. the dark one.
- **Telehealth-only - in-person visits removed** - Per client: "no in person visits." Content-only + functional booking change:
  - Marketing copy across `packages/shared/src/constants/app.ts`, `apps/web/src/lib/seo.tsx`, `ServicesSection.tsx`, `ConditionsTreated.tsx` (web + mobile), `services/page.tsx` no longer references in-person visits/care; now says "entirely via secure telehealth."
  - Onboarding `StepConsent.tsx`: Telehealth Consent is no longer marked "(optional)" and is now part of `allRequired` - since telehealth is the only way to receive care, consenting to it is mandatory to complete onboarding. Consent copy no longer offers "request in-person visits if available."
  - Booking forms no longer offer an in-person channel option: `apps/web/src/components/shared/AppointmentForm.tsx` and `apps/mobile/components/shared/book-appointment-form.tsx` (patient self-booking) default `channel` to `"virtual"` with no channel picker shown; `apps/dashboard/src/components/forms/AppointmentForm.tsx` (staff/admin booking on behalf of a patient) had its `CHANNEL_OPTIONS`/channel `SelectField` removed entirely and defaults to `"virtual"`.
  - Prisma `AppointmentChannel` enum (`inPerson` | `virtual`) was **not** touched - no migration - since historical appointments still carry `inPerson` and the dashboard appointments list filter (`(root)/appointments/page.tsx`) and `PatientBriefingPanel` display label still need it for old records. Only new-booking UI was changed.
  - `apps/mobile/app/(tabs)/checkout` "Pay in person when you collect your order" was deliberately left alone - that's product/order pickup, unrelated to clinical visit type.
- **Insurance payer list replaced** - Client (Robert, via Anna/billing team) sent the exact 10 payers now accepted: Aetna, Cigna, UHC/Optum, Anthem BCBS, Carelon, Saga, Tricare, Sutter Health, Blue Shield of California, MultiPlan. Replaced the old CA-payer list everywhere it's surfaced:
  - `packages/shared/src/constants/app.ts`: `publicInsurers` (homepage/mobile insurance trust-bar cards, with name/note/domain/abbr/color per payer) and `publicInsuranceContent.acceptedInsurers` (the `/insurance` page list) both replaced with the 10 payers. The resources-article prose paragraph and the refer-page/resources-page short blurbs were updated to match.
  - `packages/contracts/src/lib/enums.ts` `InsurancePayerEnum` updated to the same 10 + kept `"Private Pay"` as an 11th value for self-pay patients (client's list was insurance carriers only; self-pay wasn't mentioned as removed, so it was kept to avoid breaking the uninsured/self-pay path). This enum isn't currently wired into any live dropdown (patient `insuranceProvider` is free-text) - updated for consistency/future use.
  - Domain/abbr/color values for the 3 new-to-the-list payers (Carelon, Saga, Sutter Health, MultiPlan, UHC/Optum, Anthem BCBS) are best-effort guesses for the logo-favicon lookup and fallback badge color - worth a quick visual check on `/insurance` once deployed, especially **Saga** (domain guessed as `sagabh.com`; the company/product name was ambiguous from the client's message and should be confirmed with Robert).
  - `packages/db/prisma/seed.ts` demo/dev per-patient `insuranceProvider` sample strings (e.g. "Aetna Better Health", "Highmark Blue Cross Blue Shield") were **not** touched - that's fictional demo-patient data, not the practice's accepted-insurer list.
- Verified `pnpm --filter @workspace/contracts build` and `check-types` clean on `web`, `dashboard`, `mobile`, and `server` after all of the above.

### Completed (August 2026) - Manus redesign, shop removal, long-form content

**Shop feature fully removed.** Prisma models (`Product`, `ProductCategory`, `CartItem`, `Order`, `OrderItem`, `Shipment`) and their enums are gone from `schema.prisma`, along with `PermissionModule.orders`/`products`, `NotificationPurpose.orderStatus`, and `MediaType.product`. Server, contracts, SDK, dashboard, web, and mobile references removed. `orderStatus` email template deleted from `packages/templates`. Migration is generated at `packages/db/prisma/migrations/20260818120000_remove_shop_feature/` but **not applied** - the project owner runs `pnpm --filter @workspace/db prisma:deploy`. It drops the six shop tables, five shop enums, and `Payment.orderId`, and rewrites the `MediaType`, `NotificationPurpose`, and `PermissionModule` enums. The dev database still holds shop rows, so the drop is destructive by design.

**apps/web redesigned against the Manus reference** (`D:/cpc-manus`), keeping our logo, favicon, data/SDK/auth wiring, and TanStack Form stack:
- `packages/ui/src/styles/globals.css` uses the Manus palette wholesale (forest primary, blue accent, ivory canvas). Added `--brand-ink` for brand text/icons that must flip to blue on dark, and `--brand-surface` / `--brand-surface-foreground` for always-deep panels (`--primary` inverts to light green in dark mode, which was making pale-blue labels vanish on `bg-primary` cards).
- `section` now matches Manus's `.container` exactly: the cap sits on the padded box (`lg:max-w-7xl` + `px-4 sm:px-6 lg:px-8`), so content measures 76rem either way. `section-container` stays at 76rem for the split usage where padding is on a parent.
- Header: nav is centred via `lg:grid-cols-[1fr_auto_1fr]`; theme switch uses the new `variant="minimal"` on the shared `theme-toggle` (round lucide Sun/Moon, Manus treatment); "Book an Appointment" and "Patient Portal" actions; no cart.
- Booking is a standalone `/booking#book` page with a Manus 3-step flow and no sign-in gate (guest booking via `POST /appointments/guest`; `createAsGuest` rejects existing accounts with a "please sign in" conflict). Step changes scroll back to the top of the step.
- `PhoneField` is US-only with no flag/`+1` box. `IdentifierField` auto-detects: a leading digit with 3+ digits formats as US phone and stores E.164, anything with a letter or `@` stays an email. No mode-toggle buttons.
- Every required field across apps/web carries `required`, rendered as a blue `*` by `FormField`.
- `/refer` folded into the contact form's subject dropdown; `/faq` folded into `/resources`.

**Long-form content system** (modelled on `D:/ctc-platform`, which is the reference for this pattern):
- `packages/shared/src/constants/content-blocks.ts` defines a block union (`prose`, `grid`, `process`, `timeline`, `checklist`, `comparison`, `age-bands`, `triage`, `callout`, `faq`) plus `blockFaqs()` for FAQPage structured data. Every page composes its **own** block sequence, so no two pages share a layout.
- `apps/web/src/components/shared/ContentBlocks.tsx` renders them in our design system, alternating `plain`/`tint` backgrounds. FAQs use native `<details>` so answers are always in the server-rendered HTML for crawlers.
- `packages/shared/src/constants/services/*` - all 9 services now have full clinical bodies (~5 to 7 blocks each) instead of one shared template.
- `packages/shared/src/constants/articles/*` - the care library was rewritten from 4-paragraph stubs to 8 long-form articles with `lead`, `reviewed`, and blocks. Each is angled to avoid duplicating a service page: where a subject has a service page, the article takes the reader's angle (recognising it, deciding what to do) and the service page carries the clinical detail. `how-telehealth-psychiatry-works` was dropped because `/services/telehealth-psychiatry` covers it fully; `is-my-treatment-working`, `sleep-and-mental-health`, and `supporting-someone-in-treatment` were added.
- Service and article detail pages emit canonical URLs, Open Graph, and FAQPage JSON-LD. All 17 detail pages are prerendered and in the sitemap.

**Page titles**: the root layout already applies `template: "%s | ${brandName}"`, but most pages were also appending the brand themselves, so every title printed it twice ("ADHD Treatment | Connected Psychiatric Care | Connected Psychiatric Care"). Page titles are now the page name only. `createMetadata` gained an `absoluteTitle` flag for pages that lead with the brand themselves (currently just the homepage, which uses `title: { absolute }` to bypass the template). Social cards have no title template, so `openGraph.title` and `twitter.title` are built from a `socialTitle` that spells the brand out once. Rule for new pages: never put the brand in `title`.

**Legal pages**: the global `main > section { py-16 }` base rule was giving every legal section 64px of inherited top and bottom padding. Legal sections now carry `py-0` and the page stack is `space-y-7`. Legal copy no longer describes the removed shop (e-commerce tools, orders, fulfilment, shipping).

Known follow-up: `packages/shared/src/constants/app.ts` `publicServices` entries still lack per-service hero photos for `bipolar-disorder-treatment` and `trauma-ptsd-treatment`, which fall back to the default telehealth image in `SERVICE_PHOTOS`.


### Completed (August 19, 2026) - Theme revert propagation, page titles, server/client page split

**Theme reverted to blue-primary / green-accent.** The owner rewrote both `packages/ui/src/styles/globals.css` and `apps/mobile/app/global.css` to the real brand theme: blue is the dominant `--primary`, green is the `--accent` and focus `--ring`, on a warm ivory canvas in light and deep night blue in dark. Every other place that stored colour was then re-derived from those tokens rather than hand-picked:

- `apps/mobile/lib/theme.ts` is the React Native hex mirror of `global.css`. Both palettes were regenerated by parsing the stylesheet's oklch tokens and converting to sRGB, so the two can no longer drift. Key values: light `primary #1659DB`, `accent #154D00`, `background #FDFAF4`; dark `primary #59A0F9`, `accent #96C979`, `background #02060F`.
- `apps/mobile/app.config.ts` splash + adaptive-icon background was `#F1F8F6` (mint, left from the forest theme) and dark splash `#102034`; now `#FDFAF4` / `#02060F` from `--background`.
- Notification accent (`app.config.ts`, `app/_layout.tsx`), both `Logo.tsx` files, and `apps/web/src/app/manifest.ts` `theme_color` moved from `#2563EB` to `#1659DB`, the exact `--primary`.
- `apps/web/src/app/layout.tsx` `themeColor` was `#F7F2FB`, a pale purple from an older palette. It is now a light/dark pair matching `--background`.
- Two hardcoded `placeholderTextColor="#9ca3af"` inputs in mobile now read `useAppThemeColors().muted.foreground`. Note `useTheme()` from `@/hooks/use-theme` exposes only navigation colours; the full palette comes from `useAppThemeColors()` in `@/lib/theme`.
- `--brand-ink` (highlighted words, eyebrows, inline icons) was blue in light and flipped to **green** in dark, which is why hero highlight words changed hue with the theme. It is now blue in both modes: `oklch(0.42 0.17 262)` light, `oklch(0.78 0.13 255)` dark.

**Page headings now highlight like the hero.** `PageHeader` gained an optional `titleAccent` that renders in `text-brand-ink`, mirroring the homepage hero's `title` + `titleAccent` split. Every public page passes a hand-chosen split (for example "Transparent about coverage." + "Focused on your care."); service detail pages highlight the final word of the service name. Data-driven headings carry `pageTitleAccent` / `titleAccent` alongside their title in `packages/shared/src/constants/app.ts`.

**Duplicated brand in page titles fixed.** The root layout already applies `template: "%s | ${brandName}"`, but most pages also appended the brand themselves, so every title printed it twice ("ADHD Treatment | Connected Psychiatric Care | Connected Psychiatric Care"). Page titles are now the page name only. `createMetadata` gained an `absoluteTitle` flag for pages that lead with the brand themselves (currently just the homepage, which uses `title: { absolute }` to bypass the template). Social cards have no title template, so `openGraph.title` and `twitter.title` are built from a `socialTitle` that spells the brand out once. **Rule for new pages: never put the brand in `title`.**

**Patient portal split into server + client pages.** All 21 `apps/web/src/app/patient/*` routes were `"use client"` at the page level, so none could export `metadata` and every tab read "Connected Psychiatric Care" in the browser. Each is now a server `page.tsx` exporting `noIndexMetadata(...)` and rendering a `page-client.tsx`, matching the existing `(root)` convention. Dynamic routes await `params` in the server page and pass the plain string down, so the client components no longer call `React.use(params)`. Auth routes (`/auth/[type]`, `/auth/verify`) and the three already-server patient pages gained metadata too.


### Completed (August 19, 2026, later) - Messages fix, portal restyle, semantic colour migration

**Messages rows that would not open.** `MessagesWorkspace` keyed selection on `conv.appointment?.id`, so clicking a conversation whose appointment relation was absent called `setSelectedId(null)` and the row silently did nothing, while rows that did carry an appointment worked. That is the "first row never opens, second row does" symptom. Selection is now keyed on the conversation's own `id`, matching the Owits inbox (`apps/dashboard/(console)/inbox/page.tsx`), which uses `onClick={() => setSelectedId(conv.id)}` throughout.

`ConversationThread` gained an optional `conversation` prop so a caller that already holds the conversation can open it directly, instead of the thread only ever resolving one from an appointment id. Callers passing `appointmentId` are unchanged. Also brought over from the Owits inbox: `?id=` deep linking so notification action URLs open the right thread, a conversation count in the list header, last-message timestamps on rows, and an open/closed status control for internal users (`canChangeStatus`).

Note for future work: Owits' `ChatWidget.tsx` is a floating support-chat popover for the public site with topic suggestions and a bot. It is a different surface from the inbox and should not be confused with it.

**Semantic colour tokens everywhere.** apps/web, apps/dashboard, and packages/ui held 138 hardcoded Tailwind palette classes. Combinations like `border-amber-200 bg-amber-50 text-amber-800` pick a fixed light-mode colour, so they were unreadable on the dark canvas, and the scattered `dark:` overrides only patched individual cases. All of them now map to semantic tokens (`destructive` / `success` / `warning` / `info`, and `muted-foreground` / `foreground` / `border` / `muted` for neutrals), and the redundant `dark:` overrides were removed with them. **No palette classes remain** outside the explanatory comment in `globals.css`.

Four new utilities back the common case: `panel-info`, `panel-success`, `panel-warning`, `panel-destructive` give a tinted background and hairline from the semantic token while leaving body text on `--foreground`, so the panel reads in both themes. Use the semantic colour itself only for icons and emphasis inside the panel.

**Patient portal on the new design.** `Card` and `PageIntro` in packages/ui picked up the public treatment (softer radius, brand-tinted shadow, extrabold tight-tracked display headings, optional eyebrow). Restyling the two shared primitives propagates the look across all 21 portal pages and the dashboard, rather than editing each page.

**Theme toggle simplified.** `packages/ui/src/components/theme-toggle.tsx` is now the Owits button: a single shadow/contrast glyph that rotates 180 degrees on toggle while the colours swap underneath, so it flips without swapping icons. The `variant` prop is gone. `apps/mobile/components/ui/theme-switch.tsx` was replaced by `theme-toggle.tsx`, a React Native twin using `react-native-svg` plus a reanimated rotation.


### Completed (August 19, 2026, later) - Provider role model, blog CMS, seed cleanup

**Roles are now `admin | staff | author | patient`.** The `doctor` role is gone. A clinician is a staff user who also owns a `ProviderProfile`, so the bookable-provider record survives while the role disappears. Reference for the role split: `D:/ctc-platform` (`src/lib/server/admin-guard.ts`), which uses admin/staff/author with a `requireStaff()` guard that keeps authors away from PII.

- `DoctorProfile` -> `ProviderProfile`, `DoctorAvailability` -> `ProviderAvailability`, `DoctorBlockedTime` -> `ProviderBlockedTime`, and `doctorId` -> `providerId` on `Appointment` and `TreatmentPlan`.
- `ProviderProfile.isPubliclyListed` controls which providers appear on the public site and in booking. **It defaults to false**, so anything creating a provider must set it explicitly or the provider is invisible.
- Public `/doctors` moved to `/providers`, which is also the accurate word for a nurse-practitioner-led practice, with permanent redirects in `apps/web/next.config.mjs`.
- The `doctor` route groups in `apps/dashboard` and `apps/mobile` folded into `staff`; availability moved across since staff lacked it.

**Access control had to be merged by hand, not renamed.** Twenty-seven sites had a provider branch followed by a staff branch; collapsing the role made the second unreachable, which `tsc` caught as TS2367. Each is now a union: **a staff user reaches a patient as the provider on their appointments or through an active caseload assignment**, and the provider arm is skipped for staff with no provider profile (reception, billing). Appointment status changes remain provider-only. `ProviderService.findProfileForUser` returns null rather than throwing, which is what makes that branch expressible.

**`ModulePermissionGuard` had a hole.** It passed any non-staff role through to service-level checks. `author` has none, so it would have reached patients, clinical records, and payments. Authors are now restricted to the `content` module.

**Migrations are hand-written and verified.** `prisma migrate diff` reads the doctor-to-provider change as a drop-and-create, which would destroy every provider along with their availability, appointments, and treatment plans. `20260819120000_provider_role_model_and_cms` uses Postgres `RENAME` instead. Two gaps were found by replaying every migration into a scratch database and diffing against `schema.prisma` until the diff came back empty:

- `RENAME TABLE` carries constraints and indexes but keeps their old names, so each needs an explicit `RENAME CONSTRAINT` / `ALTER INDEX`.
- The migration was restoring a `User.role` default the schema does not declare.

That shadow-replay check is worth repeating for any future hand-written migration: create a scratch database, `prisma migrate diff --from-migrations ... --to-schema ...` with `shadowDatabaseUrl` set in a temporary config, and confirm the output is empty.

**Blog CMS**, ported from `D:/mi-medcare` and reshaped to this project's conventions rather than copied. `Post`, `PostView`, `Category`, `PageView`, `PostStatus`, plus a `content` `PermissionModule`. `TrafficSource` already existed and gained the `postViews` relation.

- Posts are draft-first, so nearly every field is optional. Completeness is enforced only at publish time (category, title, slug, excerpt, body), and `content` is HTML so tags are stripped before judging emptiness.
- Authors are scoped to their own posts. Only admin can hard-delete. Categories refuse a hard delete while posts reference them, since the FK is `Restrict` and would otherwise fail with an opaque database error.
- Post views are one per visitor per post per day, enforced by the unique index.
- Dashboard pages at `(root)/content/posts` and `(root)/content/categories`; nav appears for admin, for staff with the `content` permission, and as the whole author sidebar.

**Seeds are now type-checked.** `packages/db/tsconfig.json` excluded `prisma/*.ts`, so the seeds had never been checked and had silently rotted, carrying 74 errors including the shop feature removed weeks earlier. Three problems surfaced only by running them:

- Seeded providers did not set `isPubliclyListed`, so the public site and booking would be empty after seeding.
- `seed.prod.ts` has never been runnable: `REPLACE_WITH_ADMIN_PHONE` is 24 characters against `User.phone VarChar(20)`. It now fails fast listing every placeholder still to fill.
- Two notifications deep-linked to `/patient/orders`, a removed route.

Verified by applying both migrations to a scratch database and running all four seeds: 1 admin, 13 staff, 14 patients, no doctor role, 9 providers all publicly listed, 24 appointments on `providerId`, 45 availability rules.

**Known follow-up:** `apps/web` still renders the care library from static TS in `packages/shared/src/constants/articles`. The CMS is in place but the public blog is not wired to it, and the 8 existing articles have not been migrated into `Post` rows.


### Completed (August 19, 2026, later still) - Portal fixes and PDF repair

**Progress report PDFs were broken everywhere**, in both apps, with `Cannot read properties of undefined (reading 'map')`. `seed.ts` wrote its own ad-hoc content shape (`programs` where `generatePdf` reads `behaviorPrograms`, `patient.displayName` where it reads `patient.name`, `sessionSummary` where it reads `sessionStats`), so every seeded report crashed the PDF route. Two fixes, because either alone leaves a hole:

- The seed now writes the same `ProgressReportContent` the service writes.
- `generatePdf` normalises the snapshot first. A report's content is JSON captured at generation time, so an older row can always predate a shape change; it now degrades rather than 500ing. Verified against the old shape, the current shape, empty content, and null.

**`SectionCard` actions rendered below the title instead of beside it.** `CardAction` positions itself at `col-start-2`, but `CardHeader` had been changed from a grid to `flex flex-col`, so that placement silently did nothing. Restoring the grid (`has-data-[slot=card-action]:grid-cols-[1fr_auto]`) fixed the appointments "View all", the notifications button, and the appointments page "Book Appointment" in one change, along with every other `SectionCard` carrying an action. **If an action ever drifts below a card title again, check `CardHeader` is still a grid.**

**Chat panels no longer collapse.** `ConversationThread` carried a fixed `max-h-105 min-h-40` on its message list, so a short conversation shrank to 160px while the conversation list beside it stayed full height. The thread now fills whatever height its parent gives it, with messages scrolling inside.

**Push notifications had their own bug**: the toggle lived in the profile form, so flipping it marked the profile dirty and "Save Changes" re-submitted it. It now has its own `pushForm` and commits only after the subscription succeeds, matching `D:/owits-agency` `packages/ui/src/shared/UserProfileSection.tsx`. Shared by web and dashboard, so both are fixed.

Smaller items: a fourth patient overview stat card (completed visits); "Open notifications" renamed to "View all"; the single-item FAMILY ACCESS and BILLING nav groups folded into the unlabelled account group alongside Profile; treatment plan rows now show the supervising provider (already fetched, never rendered) and a program count from a `_count`.

**Still pending:** wiring the public blog to the CMS. `apps/web` renders the care library from static TS in `packages/shared/src/constants/articles`, and the 8 articles have not been migrated into `Post` rows.


### Completed (August 19, 2026, dashboard pass) - clinical forms, query defaults, error surfacing

**Three separate bugs shared one root cause: a failed request rendering as an empty state.** The caregivers tab on a patient showed "No caregiver access granted" while the patient portal showed an active caregiver for the same person. The endpoint was answering `400 Invalid field: createdAt`, and the page turned that into its empty state.

`baseQuerySchema` defaulted `sortBy` to `"createdAt"`, but `CaregiverAccess`, `DataPoint`, and `StaffAssignment` have no such column, so any unsorted request reached Prisma with a column the table does not have. `baseQuerySchema` now takes an optional third argument naming the model's own default sort column, which also drops `"createdAt"` from the accepted values for that model. Those three schemas pass `grantedAt`, `recordedAt`, and `assignedAt`. Only caregiver-access actually forwarded `sortBy` to Prisma; the other two hard-code `orderBy` and were latent.

**A route was completely unreachable.** `GET /caregiver-access/invitations` was declared after `@Get(":id")`, so Nest matched it as an id and the admin Caregiver Invitations page got `404 Caregiver access record not found` on every load. The invitation routes now sit above the `:id` block. A sweep of every controller found no other shadowed literal route; if you add one, put it before the wildcard the way `notification.controller.ts` already documents.

**Errors are now visible rather than silently empty.** `ListPage` ignored `fetchError` entirely, so every table in the dashboard had this failure mode. It now renders the error instead of an empty table. The same treatment was applied to `TreatmentPlansList`, `MessagesWorkspace`, `PatientDetailLayoutShell`, and the fifteen bespoke pages that destructured only `{ data, isLoading }`. New shared component: `packages/ui/src/shared/QueryState.tsx`, which keeps loading, error, and empty apart for query-backed views.

**Progress report detail crashed on every seeded report** with `Cannot read properties of undefined (reading 'total')`. Same cause as the earlier PDF bug: `content` is a JSON snapshot taken at generation time, and older rows carry an earlier shape (`programs`, `sessionSummary`, `patient.displayName`). The normaliser that was private to `ProgressReportService` now lives in `packages/contracts/src/progress-report/normalize.ts` as `normalizeProgressReportContent`, and both the PDF route and the dashboard page use it. Verified against a real seeded row (old shape) and against null, `{}`, a string, and a number. **Any new reader of a report's `content` must normalise first.**

**Clinical forms were the weakest slice in the codebase and were rebuilt to convention.** Intake Forms, Screening Results, and Teacher Assessments rendered `JSON.stringify(form.responses)` in card lists. They are now `ListPage` tables with search, sort, filters, and drill-down, and they moved from `(root)/admin/clinical/*` to the shared `(root)/clinical/*` - the staff sidebar was already linking staff users to those admin-only paths.

- New `packages/contracts/src/clinical-form/` module (schema, dto, types) replacing hand-rolled types in the SDK, with `ClinicalFormTypeEnum` added to `lib/enums.ts`. Query supports `search`, `searchBy`, `sortBy`, and a `formTypes` array so a surface can scope itself to screenings or intakes in one request.
- New `packages/sdk/src/clinical-form/`; the clinical-form readers were removed from `@workspace/sdk/onboarding`, which now only submits onboarding and handles teacher tokens.
- `apps/dashboard/src/hooks/clinical-forms.ts` rewritten to the standard hook shape (`parseDuration`, `queryDefaults`, `placeholderData`, `fetchError`).
- `packages/shared/src/constants/clinical-forms.ts` is the new single source for form labels, question banks, answer scales, severity bands, and `describeClinicalForm()`, which turns a stored payload into labelled question/answer sections. Both `PatientBriefingPanel` copies and the web patient assessments page now read from it instead of keeping their own bands.
- New per-patient `(root)/patients/[id]/assessments` tab and a shared detail page at `(root)/clinical/forms/[formId]`.

**Two real access-control bugs in `clinical-forms.service.ts`,** both artifacts of the doctor-to-staff collapse that the earlier 27-site sweep missed. `findOne` required a staff user to be *both* the appointment provider *and* hold a caseload assignment, when the rule everywhere else is either. It also called `findUniqueOrThrow` for the provider profile, so staff without one (reception, billing) threw instead of falling through to their caseload. Also note the list `where` now combines the access clause and the search clause with `AND`: both key on `patient`, so spreading them would silently drop the access restriction.

**ASRS was being scored wrongly.** The stored `totalScore` is the raw sum over six items (0-24), but ASRS-v1.1 screens on how many items clear their own threshold, with four of six positive being a positive screen. `clinicalFormSeverity` now takes the responses for that instrument rather than banding the total, and callers pass them.

Verified live against the running API: every dashboard list endpoint returns 200, `/caregiver-access?patientId=...` returns the caregiver the portal shows, and `/caregiver-access/invitations` returns 200 instead of 404.

**Still pending:** the blog CMS public wiring above.


### Completed (August 22, 2026) - Onboarding wizard redesign, messages page fixes, consent persistence

**Patient onboarding moved out of the patient portal and redesigned to match the booking flow.** The wizard now lives at `apps/web/src/app/(root)/complete-profile/` (was `apps/web/src/app/patient/complete-profile/`) - same `(root)` Header+Footer shell as `/booking`, no sidebar. A new `useProtectedSession` hook (`packages/ui/src/hooks/use-protected-session.ts`) was extracted from `DashboardLayout`'s inline auth-guard logic so the new page gets the same sign-in-redirect/loading behavior without pulling in the sidebar chrome; `DashboardLayout` now calls the same hook. The old route was deleted outright (not redirect-stubbed) since it was only ever reached via `router.replace()`, never linked externally; the three internal referrers (`patient/layout-client.tsx`, `patient/appointments/page-client.tsx`, `patient/onboarding/page-client.tsx`) were updated to the new path. `apps/mobile`'s own `/patient/complete-profile` screen is untouched - separate Expo route, not a link to the web URL.

The step engine copies `AppointmentForm.tsx`'s pattern exactly: a `topRef` + `requestAnimationFrame` + `scrollIntoView({behavior:"smooth"})` on every step change (previously there was no scroll-to-top at all, so a long step like the intake form left the reader stranded mid-page after clicking Continue), plus the same bespoke numbered-circle `Stepper` and `eyebrow`-led `StepIntro` visual pattern, and the `rounded-4xl` card shell.

**The invisible screening sub-step machine is gone.** `StepScreening.tsx` (which hid PHQ-9→GAD-7→ASRS or PHQ-9→Vanderbilt behind one frozen step in the old progress bar) was deleted. Each questionnaire is now its own top-level step, and a new `StepScreeningIntro.tsx` lets the patient choose "Start screenings" or "I'll complete this before my first visit" - the step list itself (`buildSteps()` in `page-client.tsx`) is computed from age group + that choice, so the rail visibly collapses from ~9 steps to ~6 when screenings are skipped. PHQ-9/GAD-7/ASRS/Vanderbilt now import their question banks and answer scales from `packages/shared/src/constants/clinical-forms.ts` (which had to have those consts changed from module-private to `export`ed - they were previously hand-duplicated verbatim in each form component, a drift risk) instead of keeping a second copy; ASRS scoring now reuses the shared `asrsPositiveItems()`/`ASRS_THRESHOLDS` instead of a local reducer. Per-question answer buttons now get an inline destructive-tinted highlight when unanswered (via a new shared `ScreeningQuestion` component in `apps/web/src/components/onboarding/shared.tsx`), replacing the old single generic "answer all N questions" banner as the only feedback.

**Required-field policy tightened to match what's actually needed before a first visit**, not everything the old form gated on: legal name/DOB/gender/phone/emergency contact/chief-complaint/consent stay required; address, occupation, all insurance fields, allergies, medications, family/past history, and the rest of the intake narrative became optional/skippable. `StepConsent.tsx` was rebuilt on TanStack Form + a real Zod schema (`CheckboxField` for the three consent checkboxes, `InputField` for the signature) instead of raw `useState` + a hand-rolled `CheckItem`; per the project owner's explicit call, the three consent checkboxes default to **checked** (opt-out, not opt-in) - `z.literal(true)` is the field type these bind to, so `false` is not structurally assignable at the default-values cast site (verified via a real `tsc` error, not assumed), and pre-checked was the intended behavior anyway, not a bug being worked around.

**Three real correctness bugs fixed, not just redesigned around:**
1. `insuranceRelationship` sent `"Self"`/`"Spouse"`/etc from the UI while the server enum was lowercase (`"self"`/`"spouse"`/...) - every submission that set this field silently failed profile validation. Fixed in `StepInsurance.tsx`.
2. `PatientService.updateMyProfile` used to flip `User.onboardingCompletedAt` on *any* profile save where it was previously null - meaning the very first `PUT /patients/me` during onboarding (step one) already marked the account "onboarded," before consent or screenings were ever reached. If a patient closed the browser mid-wizard, `layout-client.tsx`'s redirect guard would no longer catch them. Removed that side effect entirely; only `submitOnboarding` (the true final step) sets it now. Verified live: a bare `PUT /patients/me` no longer touches `onboardingCompletedAt`.
3. **Consent/signature data was being collected in the UI, gated as required to advance, and then silently discarded.** `SubmitOnboardingDto` was a hand-written `interface` with zero runtime validation (no Zod, no `class-validator`), had no `consentData` field at all, and `PatientService.submitOnboarding` never read the client's `consentData` payload. Fixed with a new `packages/contracts/src/onboarding/` module (`schema.ts`/`dto.ts`/`types.d.ts`/`index.ts`, wired into `package.json` exports + `tsdown.config.ts`, following the `clinical-form` module as the template) exporting a real `submitOnboardingSchema` (`SubmitOnboardingDto extends createZodDto(...)`), and five new nullable columns on `PatientOnboarding` (`hipaaAcknowledged`, `consentToTreat`, `telehealthConsent`, `signatureName`, `signedAt`) via migration `20260822071716_patient_onboarding_consent` (pure additive `ALTER TABLE ... ADD COLUMN`, generated with `prisma migrate dev` against the local dev DB and reviewed - no renames/drops, low risk). Verified live: submitted consent data round-trips into the DB exactly as sent, and submitting `hipaaAcknowledged: false` now correctly gets rejected with `400` at the DTO layer instead of being silently dropped.

**Messages page:** the sidebar's status/type filter was a single six-way toggle (`all/unread/open/closed/appointment/support`) sharing one state, so selecting "Appt" silently cleared "Open" even though status and conversation-type are unrelated Prisma fields. `MessagesWorkspace.tsx` now has two independent filters - status stays as the pill row (`all/unread/open/closed`), type moved to a small `Select` (`all/appointment/support`) placed to the right of the "Messages (N)" heading - and they combine with `&&`. Composer autofocus was simply never built: `Textarea`/`Input` in `packages/ui/src/components/` were plain function components (not `React.forwardRef`), so a `ref` would have silently no-op'd even if one existed. Both are now `forwardRef`; `ConversationThread.tsx` focuses the textarea on conversation switch, gated on `canSendMessages` so it doesn't try to focus a disabled field while the appointment/conversation query is still loading. Shared by `apps/web` and `apps/dashboard` since both consume the same `packages/ui` components.

**Verification:** `pnpm --filter @workspace/sdk check-types`, `server check-types`, `@workspace/ui check-types`, `web check-types`, and `dashboard check-types` all pass clean. Live-tested against the running dev API (not just typechecked): sign-in, `PUT /patients/me` with the fixed casing, `POST /patients/me/onboarding` with a full payload (verified the five consent columns landed in Postgres exactly as sent), and a deliberately-invalid consent payload (`hipaaAcknowledged: false`) correctly rejected with `400`. `/complete-profile` returns `200`; the old `/patient/complete-profile` correctly returns `404`. No headless-browser tooling was available in this environment (no `chromium-cli`, no Playwright installed) - the actual click-through (scroll-to-top behavior, stepper visuals, checkbox pre-check rendering, composer autofocus) has not been visually confirmed and should be spot-checked in a real browser before considering this fully done.

**Note for next session:** `patient2@connectedpsychiatriccare.demo` and `patient3@connectedpsychiatriccare.demo` (dev DB only) were used for the live API verification above and are no longer in their original clean seeded state (patient2 is now fully onboarded with a demo consent record; patient3 has a phone/insuranceRelationship set from a profile-save test). Harmless dev-only side effect, but re-seed (`pnpm --filter @workspace/db prisma:seed`) if a clean unonboarded patient is needed again.


### Ready-to-paste prompt for next chat:

```
I'm working on the CPC (Connected Psychiatric Care) platform at /home/zhx-labs/projects/cpc-platform (WSL/Linux - moved off the old D: Windows path).
This is a full healthcare monorepo (Next.js web + dashboard, Expo mobile, NestJS server, Prisma/PostgreSQL).
Read AGENTS.md for full context - it has everything.

We're now in the final push toward prod. Plan is: finish apps/web polish first, then move to apps/dashboard.

Last session completed (August 22, 2026):
1. Patient onboarding wizard fully redesigned - moved to /complete-profile (out of the patient
   sidebar group, matches the /booking page's shell/visual style), flattened the hidden
   screening sub-steps into visible steps, added scroll-to-top on step change, loosened
   required fields to only what's needed before a first visit, and made screenings skippable.
2. Fixed three real bugs found along the way: insuranceRelationship casing mismatch, a
   premature onboardingCompletedAt flip, and consent/signature data that was collected in the
   UI but silently never persisted (now has real columns + Zod validation, verified live
   against the dev DB).
3. Messages page: split the combined status/type filter into two independent controls (was
   silently mutually exclusive), and fixed the message composer to autofocus on conversation
   open (Textarea/Input needed forwardRef, which they didn't have).
4. NOT yet visually verified in a real browser (no headless-browser tooling was available in
   that session's container) - spot-check the onboarding flow and messages page in a browser
   before treating this as fully done, and re-seed the dev DB if patient2/patient3 need to be
   clean/unonboarded again.

Next task: [as directed - likely apps/dashboard next per the client's original request]
```

---

# Deep Linking (Universal Links & App Links)

### Overview

The platform supports both **web and mobile (Expo)** clients.
All external entry points (emails, notifications, etc.) must use **HTTPS URLs**, not custom schemes or Expo dev URLs.

Deep linking is handled using:

- **iOS Universal Links**
- **Android App Links**

These allow a single HTTPS URL to:

- Open the mobile app directly if installed
- Fall back to the web app if not installed

---

### ❌ Do NOT use

- `exp://...` → Expo dev only (never use outside development)
- `ConnectedPsychiatricCare://...` → scheme-based links (fallback only, not for email)
- Any IP-based or local URLs

---

### ✅ Always use (for emails, notifications, etc.)

```txt
https://yourdomain.com/{route}?params
```

Examples:

```txt
https://yourdomain.com/verify?token=123
https://yourdomain.com/reset-password?token=abc
https://yourdomain.com/deeplink?screen=verify&token=123
```

---

## 🧠 Architecture Rule

| Layer                 | Responsibility                         |
| --------------------- | -------------------------------------- |
| Backend (NestJS)      | Generates HTTPS links only             |
| Email / Notifications | Sends HTTPS links                      |
| Web App               | Handles fallback rendering             |
| Mobile App            | Handles deep links                     |
| OS (iOS/Android)      | Decides whether to open app or browser |

---

## ⚙️ Expo Configuration

Deep linking is based on **scheme + domain association**.

From `apps/mobile`:

```ts
scheme: "ConnectedPsychiatricCare";
```

This enables fallback links like:

```txt
ConnectedPsychiatricCare://verify?token=123
```

⚠️ This is NOT used in emails - only internally or as fallback.

---

## 🍎 iOS - Universal Links

### Expo config

```ts
ios: {
  bundleIdentifier: "com.zhxlabs.ConnectedPsychiatricCare",
  associatedDomains: ["applinks:yourdomain.com"],
}
```

---

### Required server file

```txt
https://yourdomain.com/.well-known/apple-app-site-association
```

```json
{
  "applinks": {
    "details": [
      {
        "appID": "TEAM_ID.com.zhxlabs.ConnectedPsychiatricCare",
        "paths": ["/verify", "/reset-password", "/deeplink", "*"]
      }
    ]
  }
}
```

- `TEAM_ID` = Apple Developer Team ID
- File must be served **without `.json` extension**
- Content-Type: `application/json`

---

## 🤖 Android - App Links

### Expo config

```ts
android: {
  package: "com.zhxlabs.ConnectedPsychiatricCare",
  intentFilters: [
    {
      action: "VIEW",
      autoVerify: true,
      data: [
        {
          scheme: "https",
          host: "yourdomain.com",
          pathPrefix: "/",
        },
      ],
      category: ["BROWSABLE", "DEFAULT"],
    },
  ],
}
```

---

### Required server file

```txt
https://yourdomain.com/.well-known/assetlinks.json
```

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.zhxlabs.ConnectedPsychiatricCare",
      "sha256_cert_fingerprints": ["YOUR_SHA256"]
    }
  }
]
```

- SHA256 comes from EAS build signing key

---

## 📱 Mobile App Handling (Expo)

Handle incoming links:

```ts
import * as Linking from "expo-linking";

useEffect(() => {
  const sub = Linking.addEventListener("url", ({ url }) => {
    // parse URL and navigate
  });

  return () => sub.remove();
}, []);
```

---

## 🌐 Web Fallback Behavior

If app is not installed:

- URL opens in browser
- Web route handles the request normally

Example:

```txt
https://yourdomain.com/verify?token=123
```

- Mobile with app → opens app مباشرة
- Mobile without app → shows web page
- Desktop → always web

---

## 🔁 Optional Fallback (Pre-Universal Links)

Before Universal Links are fully configured, a temporary fallback page can be used:

```txt
/deeplink?screen=verify&token=123
```

This page:

1. Attempts `ConnectedPsychiatricCare://...`
2. Falls back to web after timeout

⚠️ This is a temporary workaround and should be removed once Universal Links are fully working.

---

## 🚨 Common Mistakes

- Using `exp://` in production flows
- Sending scheme URLs (`ConnectedPsychiatricCare://`) in emails
- Missing `.well-known` files on server
- Incorrect bundle ID / package name mismatch
- Not using HTTPS
- Forgetting to rebuild mobile app after config changes

---

## ✅ Final Rule

> All external links must be HTTPS.
> The OS decides whether to open the app or the web.

---

## 🚀 Recommendation

- Start with `/deeplink` fallback if needed
- Move to full Universal Links / App Links before production launch
- Test flows from:
  - Gmail app
  - Safari / Chrome
  - WhatsApp
  - iOS + Android devices
