# connected-psychiatric-care

Production healthcare management platform for **Connected Psychiatric Care**, an ABA therapy practice. The monorepo includes:

- `apps/web` - public website + patient portal
- `apps/dashboard` - internal admin/doctor/staff dashboard
- `apps/mobile` - patient mobile app (Expo)
- `server` - NestJS API

## Stack

- Turborepo 2.9.1
- pnpm 10
- Next.js 16 / React 19
- Expo / React Native
- NestJS 11 / Node 24
- PostgreSQL + Prisma 7.6
- Redis
- Stripe / PayPal
- Twilio
- Firebase FCM / Expo push
- Cloudinary

## Apps

| App | Description |
|---|---|
| `apps/web` | Marketing site and patient-facing web portal |
| `apps/dashboard` | Role-based internal portal for `admin`, `doctor`, and `staff` |
| `apps/mobile` | Patient-only mobile experience |
| `server` | API, auth, business logic, notifications, jobs |

## Packages

| Package | Description |
|---|---|
| `packages/contracts` | Shared schemas, DTOs, and types |
| `packages/sdk` | API client helpers |
| `packages/ui` | Shared web UI system |
| `packages/templates` | Email and template components |
| `packages/shared` | Framework-agnostic utilities/constants |
| `packages/db` | Prisma schema, migrations, client |

## Roles

- `admin` - full internal access through `apps/dashboard`
- `doctor` - clinical/internal access through `apps/dashboard`
- `staff` - assigned-patient/internal access through `apps/dashboard`
- `patient` - portal access through `apps/web` and `apps/mobile`

Role isolation is enforced server-side via `ClientService.assertRoleAccess` and `@Roles()`.

## Prerequisites

- Node.js `24+`
- pnpm `10+`
- PostgreSQL
- Redis

## Local Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Server environment

Copy `server/.env.example` to `server/.env` and fill required values.

Important keys include:

```env
DATABASE_URL="postgresql://..."
REDIS_URL="redis://localhost:6379"
JWT_SECRET=""
JWT_REFRESH_SECRET=""

CLIENT_ENDPOINT="http://localhost:3000"
ADMIN_ENDPOINT="http://localhost:3001"

CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

SMTP_HOST=""
SMTP_PORT=587
SMTP_USER=""
SMTP_PASS=""
SMTP_FROM=""

TWILIO_ACCOUNT_SID=""
TWILIO_AUTH_TOKEN=""
TWILIO_PHONE_NUMBER=""
TWILIO_WHATSAPP_NUMBER=""

STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""

PAYPAL_CLIENT_ID=""
PAYPAL_CLIENT_SECRET=""
PAYPAL_MODE="sandbox"

GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GOOGLE_CALLBACK_URL="http://localhost:4000/oauth/google/callback"

IPSTACK_API_KEY=""
```

For Firebase server push in local development, set:

```env
GOOGLE_APPLICATION_CREDENTIALS="C:\\path\\to\\firebase-service-account.json"
```

### 3. Web and dashboard environment

Create:

- `apps/web/.env.local`
- `apps/dashboard/.env.local`

with:

```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

### 4. Mobile environment

Copy `apps/mobile/.env.example` to `apps/mobile/.env` and update values as needed.

For local mobile API access, use your machine/LAN-accessible API URL instead of `localhost` where required.

### 5. Database

```bash
pnpm --filter @workspace/db prisma:generate
pnpm --filter @workspace/db prisma:migrate
pnpm --filter @workspace/db prisma:seed
```

### 6. Run apps

```bash
pnpm --filter server dev
pnpm --filter web dev
pnpm --filter dashboard dev
pnpm --filter mobile start
```

Default local URLs:

- API: `http://localhost:4000`
- Web: `http://localhost:3000`
- Dashboard: `http://localhost:3001`

## Useful Commands

```bash
pnpm check-types
pnpm lint
pnpm build

pnpm build:server
pnpm build:web
pnpm build:dashboard

pnpm --filter mobile start
pnpm --filter mobile android
pnpm --filter mobile ios
```

## OAuth

- `GOOGLE_CALLBACK_URL` must match the Google Cloud Console redirect URI.
- Frontend starts OAuth via `GET /oauth/google?redirectUrl=<app-origin>`.
- The server uses `redirectUrl` to decide which client app is signing in.

## Push Notifications

Common local/dev requirements:

- `GOOGLE_APPLICATION_CREDENTIALS` must point to a valid Firebase service account JSON
- patient session must have a registered push token
- client Firebase config must match the server Firebase project
- web apps need `/firebase-messaging-sw.js` in `public/`

## Deployment Notes

- Root `Dockerfile` packages the NestJS server using `turbo prune`
- `apps/web` and `apps/dashboard` deploy as Next.js apps
- `apps/mobile` builds through Expo EAS
- Use `prisma migrate deploy` in production

## Repository Notes

- Detailed build status, delivery scope, outstanding work, and mobile parity checklist live in `AGENTS.md`
- If product status and setup docs ever disagree, treat `AGENTS.md` as the planning/handoff source and `README.md` as the setup/orientation source
