import { getDb } from '@/db';
import { members, households } from '@/db/schema';
import { calculateMemberMonthlyPrice, calculateHouseholdTotal, calculateAge, getTierName, calculateHouseholdSavings } from '@/lib/dues';
import { formatCurrency } from '@/lib/currency';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

type Member = typeof members.$inferSelect;
type Household = typeof households.$inferSelect;

async function getMembers() {
  const db = await getDb();
  return await db.select().from(members).all();
}

async function getHouseholds() {
  const db = await getDb();
  return await db.select().from(households).all();
}

export default async function AdminDashboard() {
  const allMembers = await getMembers();
  const allHouseholds = await getHouseholds();

  // Group members by household
  const householdGroups = allHouseholds.map((household: Household) => {
    const householdMembers = allMembers.filter((m: Member) => m.householdId === household.id);
    const totalDues = calculateHouseholdTotal(householdMembers);
    const savings = calculateHouseholdSavings(householdMembers);

    return {
      household,
      members: householdMembers,
      totalDues,
      savings,
    };
  });

  // Calculate total revenue
  const totalRevenue = householdGroups.reduce((sum: number, h: { totalDues: number }) => sum + h.totalDues, 0);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Member Success Dashboard</h2>
        <p className="text-muted-foreground">
          Manage your patient directory, view household billing, and track membership tiers
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allMembers.filter((m: Member) => m.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">Active memberships</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Households</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allHouseholds.length}</div>
            <p className="text-xs text-muted-foreground">Family groups</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">Monthly recurring</p>
          </CardContent>
        </Card>
      </div>

      {/* Household Directory */}
      <Card>
        <CardHeader>
          <CardTitle>Household Directory</CardTitle>
          <CardDescription>View families and their monthly billing with household cap applied</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Household Name</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Total Before Cap</TableHead>
                <TableHead>Monthly Dues</TableHead>
                <TableHead>Savings</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {householdGroups.map(({ household, members: householdMembers, totalDues, savings }: { household: Household; members: Member[]; totalDues: number; savings: number }) => {
                const totalBeforeCap = householdMembers.reduce((sum: number, m: Member) => {
                  const dob = new Date(m.dateOfBirth);
                  return sum + calculateMemberMonthlyPrice(dob);
                }, 0);

                return (
                  <TableRow key={household.id}>
                    <TableCell className="font-medium">{household.name}</TableCell>
                    <TableCell>{householdMembers.length}</TableCell>
                    <TableCell>{formatCurrency(totalBeforeCap)}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(totalDues)}</TableCell>
                    <TableCell>
                      {savings > 0 ? (
                        <Badge variant="success">{formatCurrency(savings)} saved</Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Patient Directory */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Directory</CardTitle>
          <CardDescription>Searchable list of all members with age tiers and household status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Monthly Rate</TableHead>
                <TableHead>Household</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allMembers.map((member: Member) => {
                const household = allHouseholds.find((h: Household) => h.id === member.householdId);
                const dob = new Date(member.dateOfBirth);
                const age = calculateAge(dob);
                const tier = getTierName(age);
                const monthlyRate = calculateMemberMonthlyPrice(dob);

                return (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">
                      {member.firstName} {member.lastName}
                    </TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{age}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{tier}</Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(monthlyRate)}</TableCell>
                    <TableCell>{household?.name || '—'}</TableCell>
                    <TableCell>
                      {member.status === 'active' ? (
                        <Badge variant="success">Active</Badge>
                      ) : member.status === 'pending' ? (
                        <Badge variant="secondary">Pending</Badge>
                      ) : (
                        <Badge variant="outline">Inactive</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
