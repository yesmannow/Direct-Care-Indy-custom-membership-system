import { db } from '@/db';
import { members, households, inventory, services } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { calculateAge, getAgeTier, getMonthlyRate, formatCurrency } from '@/lib/pricing';
import { formatCentsAsCurrency } from '@/lib/currency';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { WholesalePriceDirectory } from '@/components/wholesale-price-directory';
import { IncludedServicesGuide } from '@/components/included-services-guide';
import { AccessCenter } from '@/components/access-center';

// For demo purposes, we'll show the first member's portal
// In production, this would be based on authentication
async function getCurrentMember() {
  const allMembers = await db.select().from(members).where(eq(members.status, 'active')).all();
  return allMembers[0] || null;
}

async function getHousehold(householdId: number | null) {
  if (!householdId) return null;
  return await db.select().from(households).where(eq(households.id, householdId)).get();
}

async function getInventory() {
  return await db.select().from(inventory).all();
}

async function getIncludedServices() {
  return await db.select().from(services).where(eq(services.category, 'included')).all();
}

export default async function PatientDashboard() {
  const currentMember = await getCurrentMember();

  if (!currentMember) {
    return (
      <div className="min-h-screen bg-[#F0F0F0] flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No Active Membership</CardTitle>
            <CardDescription>Please complete enrollment to access your dashboard.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const household = await getHousehold(currentMember.householdId);
  const inventoryItems = await getInventory();
  const includedServices = await getIncludedServices();

  const age = calculateAge(currentMember.dateOfBirth);
  const tier = getAgeTier(age);
  const monthlyRate = getMonthlyRate(tier);

  // Calculate member since date (using createdAt if available, otherwise use a default)
  const memberSince = currentMember.householdId
    ? household?.createdAt || new Date()
    : new Date();

  return (
    <div className="min-h-screen bg-[#F0F0F0] py-8 px-4">
      <div className="container mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-[#2C3E50] mb-2">
            Welcome, {currentMember.firstName}!
          </h1>
          <p className="text-lg text-gray-600">
            Your Direct Care Indy Membership Portal
          </p>
        </div>

        {/* Membership Card */}
        <Card className="border-2 border-[#2C3E50] bg-white">
          <CardHeader className="bg-gradient-to-r from-[#2C3E50] to-[#3A4A5C] text-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-white">Membership Card</CardTitle>
                <CardDescription className="text-white/90">
                  Direct Care Indy Member
                </CardDescription>
              </div>
              <Badge variant="success" className="text-lg px-4 py-2 bg-green-500">
                {currentMember.status === 'active' ? 'Active' : 'Pending'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Age Tier</p>
                <p className="text-2xl font-bold text-[#2C3E50] capitalize">{tier.replace('_', ' ')}</p>
                <p className="text-sm text-gray-500">Age {age}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Monthly Rate</p>
                <p className="text-2xl font-bold text-[#2C3E50]">{formatCurrency(monthlyRate)}</p>
                <p className="text-sm text-gray-500">per month</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Member Since</p>
                <p className="text-2xl font-bold text-[#2C3E50]">
                  {memberSince.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </p>
                <p className="text-sm text-gray-500">
                  {Math.floor((new Date().getTime() - new Date(memberSince).getTime()) / (1000 * 60 * 60 * 24 * 30))} months
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* The "Mechanic" Access Center */}
        <AccessCenter />

        {/* Wholesale Price Directory */}
        <WholesalePriceDirectory inventoryItems={inventoryItems} />

        {/* Included Services Guide */}
        <IncludedServicesGuide services={includedServices} />
      </div>
    </div>
  );
}

