# Google Play App Access

Use this for **App access** when Google Play asks for restricted-login instructions.

## Selection

Choose:

```text
All or some functionality in my app is restricted
```

## Instruction

Instruction name:

```text
Patient portal reviewer access
```

Username, email address, or phone number:

```text
google-reviewer@connectedpsychiatriccare.com
```

Password:

```text
CPCReviewAccess2026!
```

Any other information required for access:

```text
This app includes patient portal functionality that requires login. Open the app, tap Sign In, and use the reviewer account above. The account is active, verified, and has profile setup completed. Review patient dashboard, appointments, messages, notifications, orders, payments, media, and profile sections. No paid purchase, OTP, membership, location access, QR code, or biometric login is required for review.
```

For the Android performance and compatibility testing credentials option, it is safe to allow Android to use the same credentials.

## Seeding

Run this against production when the reviewer account needs to be created or reset:

```bash
pnpm --filter @workspace/db prisma:seed:google-reviewer
```

## Data Safety

For the account-deletion URL, use:

```text
https://connectedpsychiatriccare.com/account-deletion
```

For the optional "some or all data deleted without deleting the account" question, choose "Yes" if the clinic will handle privacy/data-deletion requests by email for specific records. Otherwise, choose "No" and rely on full account deletion.

## Screenshot Demo Account

Use this account only for Play Store screenshots and internal visual QA:

```text
Email: demo@connectedpsychiatriccare.com
Password: CPCDemo2026!
```

Seed or reset the account with:

```bash
pnpm --filter @workspace/db prisma:seed:play-screenshots
```

This seed creates fake patient profile, media/document, appointment, message, notification, order, product, and payment data. Do not use real patient data in store screenshots.
