# Homepathy

Homepathy is a clinic management SaaS for homeopathy practitioners, built on Laravel and Inertia/React. It lets practitioners and clinics manage patients and case records inside workspaces, invite team members, and subscribe to paid plans with bKash/Nagad payment support.

## Features

- **Workspaces** — practitioner or clinic workspaces with member invitations and role-based access (`app/Models/Workspace.php`, `app/Http/Controllers/ClinicInvitationController.php`, `app/Http/Controllers/WorkspaceMemberController.php`)
- **Patients & case records** — track patients and their case history per workspace (`app/Models/Patient.php`, `app/Models/CaseRecord.php`)
- **Subscriptions & billing** — trial periods, practitioner/clinic plans, extra clinic seats, and expiring-soon reminders (`app/Services/Subscription`, `app/Http/Controllers/SubscriptionController.php`)
- **Payments** — bKash and Nagad payment integration with payment history and admin review (`app/Services/Payment`, `app/Http/Controllers/Subscription/PaymentController.php`, `app/Http/Controllers/Admin/PaymentController.php`)
- **Authentication** — registration, login, password reset, email verification, and two-factor authentication via Laravel Fortify, plus passkey support
- **Account settings** — profile and security settings pages

## Tech stack

- **Backend**: Laravel 13 (PHP 8.3), Laravel Fortify, Inertia Laravel, Laravel Wayfinder
- **Frontend**: React 19, Inertia.js, TypeScript, Tailwind CSS 4, Radix UI, Vite
- **Testing**: Pest 4 (feature and unit tests)
- **Tooling**: Laravel Pint (formatting), Larastan/PHPStan (static analysis), ESLint + Prettier

## Requirements

- PHP 8.3+
- Composer
- Node.js and npm
- SQLite (default) or another database supported by Laravel

## Getting started

```bash
# Install PHP and JS dependencies
composer install
npm install

# Configure environment
cp .env.example .env
php artisan key:generate

# Create the SQLite database and run migrations
touch database/database.sqlite
php artisan migrate

# Build frontend assets
npm run build
```

Alternatively, run `composer run setup` to perform install, environment setup, migrations, and asset build in one step.

### Development server

```bash
composer run dev
```

This starts the Laravel server, queue listener, log viewer (Pail), and Vite dev server concurrently. Or run pieces individually:

```bash
php artisan serve
npm run dev
```

## Testing & code quality

```bash
# Run the test suite
php artisan test --compact

# Format PHP code
vendor/bin/pint --dirty --format agent

# Static analysis
composer run types:check

# Lint and format JS/TS
npm run lint
npm run format

# Full CI check (lint, format, types, tests)
composer run ci:check
```

## Configuration

Key environment variables beyond the standard Laravel setup:

| Variable | Description |
|---|---|
| `TRIAL_DAYS` | Length of the free trial period |
| `PRACTITIONER_PLAN_PRICE` | Price of the practitioner subscription plan |
| `CLINIC_PLAN_PRICE` | Price of the clinic subscription plan |
| `CLINIC_EXTRA_SEAT_PRICE` | Price per extra seat on a clinic plan |
| `SUBSCRIPTION_EXPIRING_SOON_DAYS` | Days before expiry to flag a subscription as expiring soon |
| `SUBSCRIPTION_PERIOD_DAYS` | Length of a subscription billing period |
| `BKASH_MERCHANT_NUMBER` | bKash merchant number for receiving payments |
| `NAGAD_MERCHANT_NUMBER` | Nagad merchant number for receiving payments |

## License

MIT
