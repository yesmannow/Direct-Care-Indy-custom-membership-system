import { getDb } from '@/db';
import { inventory } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCentsAsCurrency, centsToDollars } from '@/lib/currency';

async function getMedications() {
  const db = await getDb();
  return await db.select().from(inventory).where(eq(inventory.category, 'medication')).all();
}

async function getLabs() {
  const db = await getDb();
  return await db.select().from(inventory).where(eq(inventory.category, 'lab')).all();
}

export default async function PricingPage() {
  const allMedications = await getMedications();
  const allLabs = await getLabs();

  const avgMedPrice = allMedications.length > 0
    ? centsToDollars(allMedications.reduce((sum, m) => sum + m.wholesalePrice, 0) / allMedications.length)
    : 0;
  const avgLabPrice = allLabs.length > 0
    ? centsToDollars(allLabs.reduce((sum, l) => sum + l.wholesalePrice, 0) / allLabs.length)
    : 0;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-blue-900">Wholesale Price Lists</h2>
        <p className="text-muted-foreground">
          Transparent pricing for medications and lab tests - see exactly what you pay
        </p>
      </div>

      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-900">Amazon-Style Healthcare Pricing</CardTitle>
          <CardDescription className="text-base">
            No hidden fees, no surprise bills - just honest wholesale pricing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-white rounded-lg border">
              <p className="text-3xl font-bold text-blue-900">${avgMedPrice.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground mt-1">Average medication cost</p>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <p className="text-3xl font-bold text-blue-900">${avgLabPrice.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground mt-1">Average lab test</p>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <p className="text-3xl font-bold text-blue-900">0%</p>
              <p className="text-sm text-muted-foreground mt-1">Markup on wholesale prices</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-blue-900">Generic Medications</CardTitle>
              <CardDescription>
                Top 50 generic medications available at wholesale prices
              </CardDescription>
            </div>
            <Badge variant="success">{allMedications.filter(m => m.stockLevel > 0).length} Available</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medication Name</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Wholesale Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allMedications
                .filter(med => med.stockLevel > 0)
                .map((medication) => (
                  <TableRow key={medication.id}>
                    <TableCell className="font-medium">{medication.name}</TableCell>
                    <TableCell>{medication.dosage || '—'}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {medication.description || '—'}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-blue-900">
                      {formatCentsAsCurrency(medication.wholesalePrice)}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-blue-900">Laboratory Tests</CardTitle>
              <CardDescription>
                Cash-priced lab tests - no insurance billing hassle
              </CardDescription>
            </div>
            <Badge variant="success">{allLabs.length} Tests</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Cash Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allLabs.map((lab) => (
                <TableRow key={lab.id}>
                  <TableCell className="font-medium">{lab.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {lab.description || '—'}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-blue-900">
                    {formatCentsAsCurrency(lab.wholesalePrice)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-900">💰 Real Savings Example</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-green-800">
            A Lipid Panel (cholesterol test) typically costs $100-$200 with insurance co-pays and deductibles.
            At Direct Care Indy, you pay just <strong>{formatCentsAsCurrency(500)}</strong> - our actual wholesale cost.
            That's the power of transparent healthcare pricing.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
