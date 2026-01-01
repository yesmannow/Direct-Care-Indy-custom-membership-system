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

## 🚢 Deployment

### Cloudflare Pages

1. Install Wrangler CLI
```bash
npm install -g wrangler
```

2. Create D1 database
```bash
wrangler d1 create direct-care-indy-db
```

3. Update `wrangler.toml` with your database ID

4. Deploy to Cloudflare Pages
```bash
npm run build
wrangler pages deploy
```

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Drizzle Studio

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
