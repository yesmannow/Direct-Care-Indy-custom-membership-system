# Direct Care Indy - DPC Membership Platform

A modern Direct Primary Care (DPC) membership platform built with Next.js 15, Cloudflare Pages, and Drizzle ORM.

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
- **Runtime**: Cloudflare Pages (Edge Runtime)
- **Database**: Cloudflare D1 (SQLite) with Drizzle ORM
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/UI
- **Language**: TypeScript
- **Validation**: Zod + Drizzle Zod

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

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

3. Generate and seed the database
```bash
npm run db:push
npm run db:seed
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

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

## 💾 Local SQLite vs Production D1

This application uses different databases depending on the environment:

### Local Development (SQLite)
- **Database**: SQLite via `better-sqlite3`
- **Location**: `./local.db` (created automatically)
- **When**: `NODE_ENV=development` (default for `npm run dev`)
- **Setup**: No configuration needed - database is created on first use

### Production (Cloudflare D1)
- **Database**: Cloudflare D1 (SQLite-compatible)
- **Binding**: `globalThis.DB` (automatically provided by Cloudflare Pages)
- **When**: `NODE_ENV=production` (Cloudflare Pages sets this automatically)
- **Setup**: Requires D1 database binding in `wrangler.toml` and Cloudflare Pages settings

### How It Works
The `getDb()` function in `db/index.ts` automatically detects the environment:
1. **Production**: Uses D1 via `globalThis.DB` binding
2. **Development**: Uses SQLite via `better-sqlite3` (only loaded in dev mode)

**Important**: `better-sqlite3` is never bundled in production builds thanks to:
- `serverExternalPackages: ["better-sqlite3"]` in `next.config.ts`
- Dynamic `require()` only in development mode

### Local SQLite (Windows) Troubleshooting

If you encounter `"Native module not found: better-sqlite3"` or similar errors on Windows:

#### 1. **Check Node.js Version**
```bash
node -v
```
Ensure you're running Node.js `>=20.19.0` (as specified in `package.json` engines). If not, update Node.js:
- Use `nvm` (Node Version Manager) or download from [nodejs.org](https://nodejs.org/)

#### 2. **Install Dependencies Correctly**
**Never use `npm install --omit=dev`** for local development. Always run:
```bash
npm install
```
This ensures `better-sqlite3` (in `optionalDependencies`) is installed.

#### 3. **Rebuild Native Module**
If the native module fails to load, rebuild it:
```bash
npm run rebuild:sqlite
```
This recompiles `better-sqlite3` for your current Node.js version and platform.

#### 4. **Visual Studio Build Tools (if compilation fails)**
If `npm run rebuild:sqlite` fails with MSVC/compilation errors, install:
- **Visual Studio Build Tools** with the **C++ workload**
- Or install **Visual Studio Community** with C++ development tools
- Download from: [Visual Studio Downloads](https://visualstudio.microsoft.com/downloads/)

#### 5. **Workspace Root Warning**
If Next.js warns about inferring workspace root from a parent directory (e.g., `C:\Users\hoosi\package-lock.json`):
- **Fix**: Delete any stray `package-lock.json` files outside the project directory
- The project's `next.config.ts` now explicitly sets `outputFileTracingRoot` to prevent this
- Ensure only one `package-lock.json` exists (in the project root)

#### 6. **Verify Installation**
Test that `better-sqlite3` works:
```bash
node -e "require('better-sqlite3'); console.log('better-sqlite3 OK')"
```
If this fails, follow steps 2-4 above.

#### Common Error Messages and Fixes

| Error | Fix |
|-------|-----|
| `Cannot find module 'better-sqlite3'` | Run `npm install` (without `--omit=dev`) |
| `Native module not found` | Run `npm run rebuild:sqlite` |
| `MSVC` or compilation errors | Install Visual Studio Build Tools (C++ workload) |
| `Node version mismatch` | Update Node.js to `>=20.19.0` |
| Workspace root inferred incorrectly | Delete stray `package-lock.json` outside project |

## 🚢 Deployment

### Cloudflare Pages

1. **Install Wrangler CLI** (if not already installed)
```bash
npm install -g wrangler
```

2. **Create D1 database**
```bash
wrangler d1 create direct-care-indy-db
```

3. **Update `wrangler.toml`** with your database ID
   - The `database_id` should match your D1 database
   - The `binding` must be `DB` (matches `globalThis.DB`)

4. **Apply database schema to D1**
```bash
# Option 1: Use your SQL schema file
wrangler d1 execute prod-d1-directcare --file=./d1-schema.sql

# Option 2: Use Drizzle migrations (if you have them)
npm run db:generate
wrangler d1 execute prod-d1-directcare --file=./drizzle/<latest-migration>.sql
```

5. **Configure Cloudflare Pages Build Settings**
   - **Build command**: `npm run build:cf` (NOT `npm run build`)
   - **Build output directory**: `/.open-next/.output`
   - **Node version**: `20.19.0` (set via `NODE_VERSION` environment variable)
   - **Runtime compatibility flags**: Add `nodejs_compat` in Pages Settings → Runtime

6. **Deploy**
   - Push to your connected Git repository, or
   - Deploy manually: `wrangler pages deploy .open-next/.output`

## 📋 Available Scripts

- `npm run dev` - Start development server (uses SQLite)
- `npm run build` - Build Next.js app (used internally by OpenNext)
- `npm run build:cf` - Build for Cloudflare Pages (use this for deployment)
- `npm run preview` - Build and preview Cloudflare build locally
- `npm run start` - Start production server (not used with Cloudflare Pages)
- `npm run lint` - Run ESLint
- `npm run db:push` - Push schema to local SQLite database
- `npm run db:seed` - Seed local database with sample data
- `npm run db:studio` - Open Drizzle Studio (local SQLite only)

## 🧪 Verifying Database Connectivity

To verify database connectivity, you can:

1. **Local Development**: Visit any page that uses the database (e.g., `/admin/dashboard` or `/portal/dashboard`)
2. **Production**: Check that pages load correctly after deployment

The database connection is automatically handled:
- **Local**: Uses SQLite (`./local.db`) when `NODE_ENV=development`
- **Production**: Uses Cloudflare D1 via `globalThis.DB` binding

## 🔐 Security Notes

- No payment integration included (by design)
- Local SQLite database for development
- Cloudflare D1 for production
- Environment variables for sensitive data

## 🗺️ Technical Roadmap

### Phase 1: Database Alignment ✅
- Age-tier and household-cap logic in SQLite schema
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
