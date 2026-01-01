# Direct Care Indy - DPC Membership Platform

A modern Direct Primary Care (DPC) membership platform built with Next.js 15, Vercel, and Drizzle ORM.

## 🏥 Features

### Core Business Logic
- **Age-Based Pricing Tiers**: Automatic calculation based on member age
  - Child (0-18): $30/month
  - Young Adult (19-44): $69/month
  - Adult (45-64): $89/month
  - Senior (65+): $109/month
- **Household Cap**: Families never pay more than $250/month
- **90/10 Care Model**: 90% of healthcare needs covered by DPC membership

### Provider Dashboard (Admin)
- Member Success Dashboard with household billing
- Patient Directory with searchable/filterable table
- Wholesale Dispensary Management for Top 50 Generic Medications
- Lab Directory with cash-priced tests

### Member Portal
- Membership Status Card showing tier and monthly cost
- Wholesale Price Lists for medications and labs
- Care Navigation showing included vs. insurance-only services
- Household billing with savings calculation

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Runtime**: Vercel (Node.js Runtime)
- **Database**: Vercel Postgres with Drizzle ORM
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/UI
- **Language**: TypeScript
- **Validation**: Zod + Drizzle Zod

## 📦 Getting Started

### Prerequisites
- **Node.js**: >=20.18.0 (see `.nvmrc` or `package.json` engines)
- npm or yarn
- **Vercel Account**: For production deployment (free tier available)
- **Vercel Postgres Database**: Create one in your Vercel dashboard

### Installation

1. Clone the repository
```bash
git clone https://github.com/yesmannow/Direct-Care-Indy-custom-membership-system.git
cd Direct-Care-Indy-custom-membership-system
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env.local` file in the root directory:
```bash
POSTGRES_URL="your-vercel-postgres-connection-string"
```

For local development, you can use a local Postgres database or connect to your Vercel Postgres database.

4. Generate and push the database schema
```bash
npm run db:push
npm run db:seed
```

5. Run the development server
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🗂️ Project Structure

```
├── app/
│   ├── (admin)/           # Provider dashboard routes
│   │   ├── layout.tsx     # Admin layout
│   │   ├── page.tsx       # Member directory
│   │   ├── medications/   # Medication inventory
│   │   └── labs/          # Lab directory
│   ├── (portal)/          # Member portal routes
│   │   ├── layout.tsx     # Portal layout
│   │   ├── page.tsx       # Membership status
│   │   ├── services/      # 90/10 care navigation
│   │   └── pricing/       # Price lists
│   └── page.tsx           # Home page
├── components/ui/         # Shadcn UI components
├── db/
│   ├── schema.ts          # Drizzle ORM schema
│   ├── index.ts           # Database client
│   └── seed.ts            # Seed data
├── lib/
│   ├── pricing.ts         # Pricing logic & calculations
│   └── utils.ts           # Utility functions
└── drizzle.config.ts      # Drizzle configuration
```

## 💾 Database Schema

### Tables
- **households**: Family groups with household cap logic
- **members**: Individual patients with age-based tiers
- **medications**: Top 50 generic meds with wholesale pricing
- **labs**: Cash-priced lab tests
- **services**: Included (90%) vs insurance-only (10%) services

## 🧮 Pricing Logic

The `calculateMonthlyDues()` function in `lib/pricing.ts` implements:
1. Age calculation from date of birth
2. Tier assignment based on age ranges
3. Individual monthly rate calculation
4. Household cap application ($250 max)

## 🎨 UI Components

Using Shadcn/UI components:
- Card, CardHeader, CardContent
- Table with sortable columns
- Badge for status indicators
- Input for search functionality

## 💾 Database Setup

This application uses **Vercel Postgres** for both development and production.

### Environment Variables

You need to set the following environment variable:

- `POSTGRES_URL`: Connection string for your Vercel Postgres database

### Local Development

For local development, you have two options:

1. **Use Vercel Postgres directly** (recommended):
   - Get your connection string from the Vercel dashboard
   - Add it to `.env.local` as `POSTGRES_URL`

2. **Use a local Postgres database**:
   - Install PostgreSQL locally
   - Create a database
   - Set `POSTGRES_URL` to your local connection string (e.g., `postgresql://user:password@localhost:5432/dbname`)

### Production (Vercel)

Vercel automatically provides the `POSTGRES_URL` environment variable when you:
1. Create a Postgres database in your Vercel project
2. Link it to your Next.js application

The database connection is handled automatically by `@vercel/postgres` in production.

### How It Works

The `db` instance in `db/index.ts` uses `@vercel/postgres` to connect:
- **Development**: Uses `POSTGRES_URL` from `.env.local`
- **Production**: Uses `POSTGRES_URL` automatically provided by Vercel

## 🚢 Deployment

### Deploy to Vercel

1. **Install Vercel CLI** (optional, for local deployment)
```bash
npm install -g vercel
```

2. **Create Vercel Postgres Database**
   - Go to your Vercel dashboard
   - Navigate to your project → Storage → Create Database
   - Select "Postgres" and create a new database
   - Note the connection string (automatically added as `POSTGRES_URL`)

3. **Apply Database Schema**
   ```bash
   # Generate migrations
   npm run db:generate

   # Push schema to database (or use migrations)
   npm run db:push

   # Seed the database (optional)
   npm run db:seed
   ```

4. **Deploy to Vercel**
   - **Option 1: Via Git** (recommended)
     - Connect your Git repository to Vercel
     - Vercel will automatically detect Next.js and deploy
     - Environment variables (including `POSTGRES_URL`) are automatically set

   - **Option 2: Via CLI**
     ```bash
     vercel
     ```
     Follow the prompts to deploy your project.

5. **Verify Deployment**
   - Check that your application is running
   - Verify database connectivity by visiting pages that use the database
   - Check Vercel logs for any errors

### Environment Variables in Vercel

Vercel automatically provides these environment variables when you create a Postgres database:
- `POSTGRES_URL`: Main connection string
- `POSTGRES_PRISMA_URL`: Prisma-compatible connection string (if needed)
- `POSTGRES_URL_NON_POOLING`: Direct connection string (for migrations)

You don't need to manually set these - they're automatically configured.

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build Next.js app for production
- `npm run start` - Start production server (for local testing)
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema to database (development)
- `npm run db:studio` - Open Drizzle Studio (database GUI)
- `npm run db:seed` - Seed database with sample data

## 🧪 Verifying Database Connectivity

To verify database connectivity, you can:

1. **Local Development**: Visit any page that uses the database (e.g., `/admin/dashboard` or `/portal/dashboard`)
2. **Production**: Check that pages load correctly after deployment

The database connection is automatically handled:
- **Local**: Uses `POSTGRES_URL` from `.env.local`
- **Production**: Uses `POSTGRES_URL` automatically provided by Vercel

## 🔐 Security Notes

- No payment integration included (by design)
- Vercel Postgres for both development and production
- Environment variables for sensitive data (connection strings)
- All database connections use SSL/TLS encryption

## 🗺️ Technical Roadmap

### Phase 1: Database Alignment ✅
- Age-tier and household-cap logic in Postgres schema
- Pricing calculation utilities

### Phase 2: Dashboard ("The Mechanic") ✅
- Internal view for wholesale dispensary and labs
- Member directory with household grouping

### Phase 3: Persona Views ✅
- Member portal with pricing transparency
- Service navigation (90/10 model)

### Phase 4: iSalus Sync (Future)
- API bridge to existing EMR
- Real-time data synchronization

## 📝 License

Private repository - All rights reserved

## 👥 Author

Direct Care Indy Team
