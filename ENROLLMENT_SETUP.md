# Multi-Step Enrollment System

## Overview

The enrollment system provides a secure, multi-step onboarding flow that handles patient registration and prepares for Stripe billing integration.

## Features

### 1. Multi-Step Form (`app/(auth)/join/page.tsx`)
- **Step 1: Patient Profile** - Collects name, email, and date of birth
- **Step 2: Household Setup** - Allows users to add family members (minimum age 13)
- **Step 3: Verification** - Displays calculated monthly rate and reviews all information

### 2. Form Validation (`lib/validations/enrollment.ts`)
- Uses Zod schemas for type-safe validation
- Minimum age requirement: 13 years old for DPC membership
- Email validation
- Required field validation

### 3. Database Integration (`app/actions/enrollment.ts`)
- Creates household record (if family members are added)
- Creates member records with `pending_payment` status
- Uses Drizzle ORM for database operations
- Supports both local SQLite (development) and Cloudflare D1 (production)

### 4. Stripe Integration (`app/actions/stripe.ts`)
- Creates Stripe Checkout Session for recurring subscription
- Handles monthly subscription setup
- Includes metadata for member IDs and household ID

## Environment Variables

Add these to your `.env.local` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# For production on Cloudflare Pages
# Set these in Cloudflare Pages dashboard
```

## Database Setup

### Local Development
The system uses `better-sqlite3` for local development. The database file (`local.db`) will be created automatically.

### Production (Cloudflare D1)
1. Create a D1 database:
   ```bash
   wrangler d1 create direct-care-indy-db
   ```

2. Update `wrangler.toml` with your database ID

3. The database connection automatically detects Cloudflare D1 environment

## Usage

1. Navigate to `/join` to access the enrollment form
2. Complete Step 1: Enter patient profile information
3. Complete Step 2: Optionally add family members
4. Complete Step 3: Review and verify information
5. Submit to create enrollment and redirect to Stripe checkout

## Status Flow

- `pending_payment` - Initial status when enrollment is created
- `active` - Status after successful payment (handled by Stripe webhook)
- `inactive` - Status for cancelled memberships

## Next Steps

1. Set up Stripe webhook to handle payment success and update member status
2. Add email notifications for enrollment confirmation
3. Add admin dashboard to view pending enrollments
4. Add ability to edit enrollments before payment

