import { db } from '@/db';
import { inventory } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCentsAsCurrency } from '@/lib/currency';

async function getMedications() {
  return await db.select().from(inventory).where(eq(inventory.category, 'medication')).all();
}

export default async function MedicationsPage() {
  const allMedications = await getMedications();

  const getStockBadge = (stockLevel: number) => {
    if (stockLevel === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (stockLevel < 50) {
      return <Badge variant="secondary">Low Stock ({stockLevel})</Badge>;
    } else {
      return <Badge variant="success">In Stock ({stockLevel})</Badge>;
    }
  };

  const totalInventoryValue = allMedications.reduce((sum, med) => sum + med.wholesalePrice, 0);
  const avgPrice = allMedications.length > 0 ? totalInventoryValue / allMedications.length : 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Wholesale Dispensary Management</h2>
        <p className="text-muted-foreground">
          Top 50 generic medications with wholesale pricing
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Medications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allMedications.length}</div>
            <p className="text-xs text-muted-foreground">Generic medications tracked</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allMedications.filter(m => m.stockLevel > 0).length}
            </div>
            <p className="text-xs text-muted-foreground">Available for dispensing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Wholesale Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCentsAsCurrency(Math.round(avgPrice))}
            </div>
            <p className="text-xs text-muted-foreground">Per medication</p>
          </CardContent>
        </Card>
      </div>

      {/* Medications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Medication Inventory</CardTitle>
          <CardDescription>
            Wholesale prices for generic medications available to members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medication Name</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Wholesale Price</TableHead>
                <TableHead>Stock Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allMedications.map((medication) => (
                <TableRow key={medication.id}>
                  <TableCell className="font-medium">{medication.name}</TableCell>
                  <TableCell>{medication.dosage || '—'}</TableCell>
                  <TableCell className="text-muted-foreground">{medication.description || '—'}</TableCell>
                  <TableCell className="font-semibold">{formatCentsAsCurrency(medication.wholesalePrice)}</TableCell>
                  <TableCell>{getStockBadge(medication.stockLevel)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
