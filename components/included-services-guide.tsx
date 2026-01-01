import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import type { Service } from '@/db/schema';

interface IncludedServicesGuideProps {
  services: Service[];
}

export function IncludedServicesGuide({ services }: IncludedServicesGuideProps) {
  // Common included services if database is empty
  const defaultServices = [
    { name: 'Sick Visits', description: 'Acute care for illness and injury' },
    { name: 'Laceration Repair', description: 'Stitches and wound care' },
    { name: 'Cryotherapy', description: 'Wart and skin lesion removal' },
    { name: 'Chronic Care Management', description: 'Diabetes, hypertension, and other chronic conditions' },
    { name: 'Preventive Care', description: 'Annual physicals and wellness visits' },
    { name: 'Minor Procedures', description: 'In-office procedures and treatments' },
    { name: 'Unlimited Office Visits', description: 'No visit limits or copays' },
    { name: 'Direct Provider Access', description: 'Text, call, or email your doctor directly' },
  ];

  const displayServices = services.length > 0
    ? services
    : defaultServices.map((s, i) => ({ id: i, name: s.name, description: s.description, category: 'included' as const }));

  return (
    <Card className="border-2 border-[#8A9A8A] bg-white">
      <CardHeader className="bg-[#8A9A8A] text-white">
        <CardTitle className="text-2xl text-white">
          Included Services Guide
        </CardTitle>
        <CardDescription className="text-white/90">
          100% Covered - No copays, no deductibles, no surprises
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-800">
            <strong>Your membership covers 90% of your healthcare needs.</strong> These services are
            included at no additional cost - reinforcing the value of your Direct Care Indy membership.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {displayServices.map((service) => (
            <div
              key={service.id}
              className="flex items-start gap-3 p-4 rounded-lg border border-green-200 bg-green-50/50 hover:bg-green-50 transition-colors"
            >
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-[#2C3E50] mb-1">{service.name}</h3>
                {service.description && (
                  <p className="text-sm text-gray-600">{service.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-[#F0F0F0] rounded-lg border border-[#2C3E50]">
          <p className="text-sm text-[#2C3E50]">
            <strong>Remember:</strong> For the remaining 10% (major surgery, ER visits, specialist referrals),
            you'll use your health insurance or catastrophic plan. We help coordinate this care to ensure
            you get the best outcomes.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

