import { db } from '@/db';
import { members, households } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { calculateMemberMonthlyPrice, calculateHouseholdTotal, calculateAge, getTierName, calculateHouseholdSavings } from '@/lib/dues';
import { formatCurrency } from '@/lib/currency';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// For demo purposes, we'll show the first member's portal
// In production, this would be based on authentication
async function getCurrentMember() {
  const allMembers = await db.select().from(members).all();
  return allMembers[0]; // Demo: showing first member
}

async function getHouseholdMembers(householdId: number | null) {
  if (!householdId) return [];
  return await db.select().from(members).where(eq(members.householdId, householdId)).all();
}

async function getHousehold(householdId: number | null) {
  if (!householdId) return null;
  return await db.select().from(households).where(eq(households.id, householdId)).get();
}

export default async function PortalPage() {
  const currentMember = await getCurrentMember();
  const household = await getHousehold(currentMember.householdId);
  const householdMembers = await getHouseholdMembers(currentMember.householdId);
  
  const dob = new Date(currentMember.dateOfBirth);
  const age = calculateAge(dob);
  const tier = getTierName(age);
  const monthlyRate = calculateMemberMonthlyPrice(dob);
  const householdTotal = calculateHouseholdTotal(householdMembers);
  const savings = calculateHouseholdSavings(householdMembers);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-blue-900">
          Welcome, {currentMember.firstName}!
        </h2>
        <p className="text-muted-foreground">
          Your Direct Primary Care membership dashboard
        </p>
      </div>

      {/* Membership Status Card */}
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-blue-900">Membership Status</CardTitle>
              <CardDescription>Your current tier and monthly cost</CardDescription>
            </div>
            <Badge variant="success" className="text-lg px-4 py-2">
              {currentMember.status === 'active' ? 'Active' : currentMember.status === 'pending' ? 'Pending' : 'Inactive'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Your Age Tier</p>
              <p className="text-3xl font-bold text-blue-900">{tier}</p>
              <p className="text-sm text-muted-foreground mt-1">Age {age}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Your Monthly Rate</p>
              <p className="text-3xl font-bold text-blue-900">{formatCurrency(monthlyRate)}</p>
              <p className="text-sm text-muted-foreground mt-1">Based on age tier</p>
            </div>
          </div>

          {household && householdMembers.length > 1 && (
            <div className="pt-4 border-t border-blue-200">
              <p className="text-sm font-medium text-muted-foreground mb-2">Household: {household.name}</p>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Total Members</p>
                  <p className="text-2xl font-bold text-blue-900">{householdMembers.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Household Monthly Total</p>
                  <p className="text-2xl font-bold text-blue-900">{formatCurrency(householdTotal)}</p>
                  {savings > 0 && (
                    <Badge variant="success" className="mt-1">
                      Saving {formatCurrency(savings)} with household cap!
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tier Breakdown Info */}
      <Card>
        <CardHeader>
          <CardTitle>Understanding Your Pricing Tier</CardTitle>
          <CardDescription>Transparent age-based pricing for Direct Primary Care</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50">
              <div>
                <p className="font-medium">Child (0-18)</p>
                <p className="text-sm text-muted-foreground">Ages 0 to 18 years</p>
              </div>
              <p className="text-lg font-bold">{formatCurrency(30)}/mo</p>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50">
              <div>
                <p className="font-medium">Young Adult (19-44)</p>
                <p className="text-sm text-muted-foreground">Ages 19 to 44 years</p>
              </div>
              <p className="text-lg font-bold">{formatCurrency(69)}/mo</p>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50">
              <div>
                <p className="font-medium">Adult (45-64)</p>
                <p className="text-sm text-muted-foreground">Ages 45 to 64 years</p>
              </div>
              <p className="text-lg font-bold">{formatCurrency(89)}/mo</p>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50">
              <div>
                <p className="font-medium">Senior (65+)</p>
                <p className="text-sm text-muted-foreground">Ages 65 and above</p>
              </div>
              <p className="text-lg font-bold">{formatCurrency(109)}/mo</p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="font-medium text-blue-900">Household Cap Benefit</p>
            <p className="text-sm text-blue-700 mt-1">
              Families never pay more than {formatCurrency(250)}/month total, regardless of household size!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-blue-900">View Price Lists</CardTitle>
            <CardDescription>
              See wholesale medication and lab pricing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a href="/portal/pricing" className="text-blue-600 hover:text-blue-800 font-medium">
              Browse Pricing →
            </a>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-blue-900">Covered Services</CardTitle>
            <CardDescription>
              Learn what's included vs. what requires insurance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a href="/portal/services" className="text-blue-600 hover:text-blue-800 font-medium">
              View Services →
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
