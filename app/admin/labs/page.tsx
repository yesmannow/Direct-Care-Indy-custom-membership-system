import { getDb } from '@/db';
import { inventory } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCentsAsCurrency } from '@/lib/currency';

type Lab = typeof inventory.$inferSelect;

async function getLabs() {
  const db = await getDb();
  return await db.select().from(inventory).where(eq(inventory.category, 'lab'));
}

export default async function LabsPage() {
  const allLabs = await getLabs();

  const totalValue = allLabs.reduce((sum: number, lab: typeof inventory.$inferSelect) => sum + lab.wholesalePrice, 0);
  const avgPrice = allLabs.length > 0 ? totalValue / allLabs.length : 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Wholesale Lab Directory</h2>
        <p className="text-muted-foreground">
          Cash-priced lab tests available to members at wholesale rates
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lab Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allLabs.length}</div>
            <p className="text-xs text-muted-foreground">Available tests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lowest Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCentsAsCurrency(Math.min(...allLabs.map((l: typeof inventory.$inferSelect) => l.wholesalePrice)))}
            </div>
            <p className="text-xs text-muted-foreground">Most affordable test</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCentsAsCurrency(Math.round(avgPrice))}</div>
            <p className="text-xs text-muted-foreground">Per lab test</p>
          </CardContent>
        </Card>
      </div>

      {/* Labs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Laboratory Tests</CardTitle>
          <CardDescription>
            Complete list of cash-priced lab tests at wholesale pricing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lab Test Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Cash Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allLabs.map((lab: Lab) => (
                <TableRow key={lab.id}>
                  <TableCell className="font-medium">{lab.name}</TableCell>
                  <TableCell className="text-muted-foreground">{lab.description || '—'}</TableCell>
                  <TableCell className="font-semibold">{formatCentsAsCurrency(lab.wholesalePrice)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
