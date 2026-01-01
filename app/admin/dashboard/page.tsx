import { getDb } from '@/db';
import { members, households, inventory } from '@/db/schema';
import { eq, like, or } from 'drizzle-orm';
import { calculateAge, getAgeTier, getMonthlyRate, formatCurrency, calculateMonthlyDues } from '@/lib/pricing';
import { formatCentsAsCurrency } from '@/lib/currency';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { PatientDirectory } from '@/components/patient-directory';
import { DispensaryManager } from '@/components/dispensary-manager';
import { FinancialHealth } from '@/components/financial-health';
import { TriageQueue } from '@/components/triage-queue';

async function getMembers() {
  const db = await getDb();
  return await db.select().from(members).all();
}

async function getHouseholds() {
  const db = await getDb();
  return await db.select().from(households).all();
}

async function getInventory() {
  const db = await getDb();
  return await db.select().from(inventory).all();
}

// Calculate MRR data for the last 12 months
function calculateMRRData(members: typeof members.$inferSelect[], households: typeof households.$inferSelect[]) {
  const months = [];
  const today = new Date();

  for (let i = 11; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    // For demo, we'll use current members but in production you'd track historical data
    const activeMembers = members.filter(m => m.status === 'active');
    const householdGroups = households.map(household => {
      const householdMembers = activeMembers.filter(m => m.householdId === household.id);
      return calculateMonthlyDues(householdMembers);
    });
    const singleMembers = activeMembers.filter(m => !m.householdId);
    const singleMemberRevenue = singleMembers.reduce((sum, m) => {
      const age = calculateAge(m.dateOfBirth);
      const tier = getAgeTier(age);
      return sum + getMonthlyRate(tier);
    }, 0);

    const totalMRR = householdGroups.reduce((sum, dues) => sum + dues, 0) + singleMemberRevenue;

    months.push({
      month: monthName,
      mrr: totalMRR,
    });
  }

  return months;
}

export default async function AdminDashboard() {
  const allMembers = await getMembers();
  const allHouseholds = await getHouseholds();
  const inventoryItems = await getInventory();

  const activeMembers = allMembers.filter(m => m.status === 'active');
  const mrrData = calculateMRRData(allMembers, allHouseholds);

  // Calculate current MRR
  const householdGroups = allHouseholds.map(household => {
    const householdMembers = activeMembers.filter(m => m.householdId === household.id);
    return calculateMonthlyDues(householdMembers);
  });
  const singleMembers = activeMembers.filter(m => !m.householdId);
  const singleMemberRevenue = singleMembers.reduce((sum, m) => {
    const age = calculateAge(m.dateOfBirth);
    const tier = getAgeTier(age);
    return sum + getMonthlyRate(tier);
  }, 0);
  const currentMRR = householdGroups.reduce((sum, dues) => sum + dues, 0) + singleMemberRevenue;

  return (
    <div className="min-h-screen bg-[#F0F0F0] py-8 px-4">
      <div className="container mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-[#2C3E50] mb-2">
            Member Success Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Manage your capped panel of 500 members per provider
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-2 border-[#2C3E50]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#2C3E50]">{activeMembers.length}</div>
              <p className="text-xs text-gray-500 mt-1">of 500 capacity</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-[#2C3E50]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Households</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#2C3E50]">{allHouseholds.length}</div>
              <p className="text-xs text-gray-500 mt-1">Family groups</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-[#8A9A8A]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Monthly Recurring Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#8A9A8A]">{formatCurrency(currentMRR)}</div>
              <p className="text-xs text-gray-500 mt-1">Current MRR</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-[#2C3E50]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Panel Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#2C3E50]">
                {Math.round((activeMembers.length / 500) * 100)}%
              </div>
              <p className="text-xs text-gray-500 mt-1">Capacity used</p>
            </CardContent>
          </Card>
        </div>

        {/* Patient Directory */}
        <PatientDirectory members={allMembers} households={allHouseholds} />

        {/* Financial Health */}
        <FinancialHealth mrrData={mrrData} currentMRR={currentMRR} />

        {/* In-House Dispensary Manager */}
        <DispensaryManager inventoryItems={inventoryItems} />

        {/* Triage Queue */}
        <TriageQueue />
      </div>
    </div>
  );
}

