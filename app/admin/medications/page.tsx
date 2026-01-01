import { getDb } from '@/db';
import { inventory } from '@/db/schema';
import { eq, and, isNotNull } from 'drizzle-orm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCentsAsCurrency } from '@/lib/currency';

type Medication = typeof inventory.$inferSelect;

async function getMedications() {
  const db = await getDb();
  return await db.select().from(inventory).where(eq(inventory.category, 'medication')).all();
}

// Helper function to check if medication is expiring soon (within 30 days)
function isExpiringSoon(expirationDate: string | null): boolean {
  if (!expirationDate) return false;
  const expDate = new Date(expirationDate);
  const today = new Date();
  const daysUntilExp = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return daysUntilExp <= 30 && daysUntilExp >= 0;
}

// Helper function to check if stock is below PAR level
function isBelowParLevel(stockLevel: number, parLevel: number | null): boolean {
  if (parLevel === null) return false;
  return stockLevel < parLevel;
}

// Helper function to get the earliest expiration date for FIFO
function getEarliestExpiration(medications: Medication[]): string | null {
  const medicationsWithExp = medications.filter((m: Medication) => m.expirationDate);
  if (medicationsWithExp.length === 0) return null;

  const sorted = medicationsWithExp.sort((a, b) => {
    const dateA = new Date(a.expirationDate!).getTime();
    const dateB = new Date(b.expirationDate!).getTime();
    return dateA - dateB;
  });

  return sorted[0].expirationDate;
}

export default async function MedicationsPage() {
  const allMedications = await getMedications();

  const getStockBadge = (medication: Medication) => {
    const { stockLevel, parLevel, expirationDate } = medication;
    const isExpiring = isExpiringSoon(expirationDate);
    const isLowStock = isBelowParLevel(stockLevel, parLevel);

    if (stockLevel === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (isExpiring || isLowStock) {
      // High-priority alert badge for items below PAR or expiring soon
      return (
        <Badge variant="destructive" className="animate-pulse">
          ⚠️ Alert: {isExpiring && isLowStock ? 'Expiring & Low Stock' : isExpiring ? 'Expiring Soon' : 'Below PAR Level'} ({stockLevel})
        </Badge>
      );
    } else if (stockLevel < 50) {
      return <Badge variant="secondary">Low Stock ({stockLevel})</Badge>;
    } else {
      return <Badge variant="success">In Stock ({stockLevel})</Badge>;
    }
  };

  // Find the medication with the earliest expiration date (FIFO - First In, First Out)
  const earliestExpiration = getEarliestExpiration(allMedications);

  const totalInventoryValue = allMedications.reduce((sum: number, med: Medication) => sum + med.wholesalePrice, 0);
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
              {allMedications.filter((m: Medication) => m.stockLevel > 0).length}
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

      {/* FIFO Alert - Next to Use Indicator */}
      {earliestExpiration && (
        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
          <CardHeader>
            <CardTitle className="text-orange-900">🔄 FIFO Stock Rotation Alert</CardTitle>
            <CardDescription>
              Next batch to use based on earliest expiration date
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Next to Use</p>
                <p className="text-lg font-bold text-orange-900">
                  {allMedications.find((m: Medication) => m.expirationDate === earliestExpiration)?.name || 'N/A'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Expires: {new Date(earliestExpiration).toLocaleDateString()}
                </p>
              </div>
              <Badge variant="outline" className="text-orange-700 border-orange-300">
                Use First
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Medications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Medication Inventory</CardTitle>
          <CardDescription>
            Wholesale prices for generic medications available to members. Alerts shown for items below PAR level or expiring within 30 days.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medication Name</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Lot Number</TableHead>
                <TableHead>Expiration Date</TableHead>
                <TableHead>PAR Level</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Wholesale Price</TableHead>
                <TableHead>Stock Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allMedications.map((medication: Medication) => {
                const isExpiring = isExpiringSoon(medication.expirationDate);
                const isLowStock = isBelowParLevel(medication.stockLevel, medication.parLevel);
                const isNextToUse = medication.expirationDate === earliestExpiration;

                return (
                  <TableRow
                    key={medication.id}
                    className={isExpiring || isLowStock ? 'bg-red-50' : isNextToUse ? 'bg-orange-50' : ''}
                  >
                    <TableCell className="font-medium">
                      {medication.name}
                      {isNextToUse && (
                        <Badge variant="outline" className="ml-2 text-xs">Next to Use</Badge>
                      )}
                    </TableCell>
                    <TableCell>{medication.dosage || '—'}</TableCell>
                    <TableCell>{medication.lotNumber || '—'}</TableCell>
                    <TableCell>
                      {medication.expirationDate ? (
                        <span className={isExpiring ? 'font-semibold text-red-600' : ''}>
                          {new Date(medication.expirationDate).toLocaleDateString()}
                        </span>
                      ) : (
                        '—'
                      )}
                    </TableCell>
                    <TableCell>{medication.parLevel ?? '—'}</TableCell>
                    <TableCell className="text-muted-foreground">{medication.description || '—'}</TableCell>
                    <TableCell className="font-semibold">{formatCentsAsCurrency(medication.wholesalePrice)}</TableCell>
                    <TableCell>{getStockBadge(medication)}</TableCell>
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
