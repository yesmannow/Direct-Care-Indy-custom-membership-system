import { db } from '@/db';
import { services } from '@/db/schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

async function getServices() {
  return await db.select().from(services).all();
}

export default async function ServicesPage() {
  const allServices = await getServices();
  const includedServices = allServices.filter(s => s.category === 'included');
  const insuranceOnlyServices = allServices.filter(s => s.category === 'insurance_only');

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-blue-900">Care Navigation</h2>
        <p className="text-muted-foreground">
          Understanding what's included in your membership vs. what requires insurance
        </p>
      </div>

      {/* 90/10 Explanation */}
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-900">The 90/10 Rule</CardTitle>
          <CardDescription className="text-base">
            Direct Primary Care covers 90% of your healthcare needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="success" className="text-base px-3 py-1">90% Covered</Badge>
              </div>
              <p className="text-sm text-green-900">
                Most of your healthcare happens in primary care - sick visits, chronic disease management, 
                preventive care, and basic procedures. These are all included in your membership.
              </p>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-base px-3 py-1 border-amber-400 text-amber-800">10% Insurance</Badge>
              </div>
              <p className="text-sm text-amber-900">
                For major events like hospitalizations, ER visits, and surgery, you'll use your health insurance or 
                a cost-sharing program. We help coordinate this care.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Included Services (90%) */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-blue-900">✓ Included Services (90%)</CardTitle>
              <CardDescription>
                These services are covered by your Direct Care Indy membership
              </CardDescription>
            </div>
            <Badge variant="success" className="text-lg px-4 py-2">Included</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {includedServices.map((service) => (
              <div key={service.id} className="p-4 rounded-lg border border-green-200 bg-green-50/50 hover:bg-green-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-blue-900">{service.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                  </div>
                  <Badge variant="success" className="ml-4">✓</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insurance-Only Services (10%) */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-blue-900">Insurance-Only Services (10%)</CardTitle>
              <CardDescription>
                These services require health insurance or cost-sharing - we help coordinate
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">Insurance Needed</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insuranceOnlyServices.map((service) => (
              <div key={service.id} className="p-4 rounded-lg border border-amber-200 bg-amber-50/50 hover:bg-amber-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-blue-900">{service.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                  </div>
                  <Badge variant="outline" className="ml-4 border-amber-400 text-amber-800">Insurance</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">Have Questions?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-800">
            Not sure if a service is covered? Contact our care team and we'll help navigate your healthcare needs 
            and determine the best approach - whether that's through your DPC membership or coordinating with insurance.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
