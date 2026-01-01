import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function PricingCards() {
  const tiers = [
    {
      ageRange: '19-44',
      price: 69,
      description: 'Young adults and working professionals',
    },
    {
      ageRange: '45-64',
      price: 89,
      description: 'Mid-career and pre-retirement',
    },
    {
      ageRange: '65+',
      price: 109,
      description: 'Seniors and retirees',
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-4 text-[#2C3E50]">
        Simple, Transparent Pricing
      </h2>
      <p className="text-center mb-8 text-lg text-gray-600">
        Age-based monthly rates with a household cap of $250/month
      </p>
      <div className="grid md:grid-cols-3 gap-6">
        {tiers.map((tier) => (
          <Card
            key={tier.ageRange}
            className="border-2 border-[#2C3E50] hover:shadow-lg transition-shadow"
          >
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-[#2C3E50]">
                Ages {tier.ageRange}
              </CardTitle>
              <CardDescription className="text-base">
                {tier.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div>
                <span className="text-4xl font-bold text-[#2C3E50]">
                  ${tier.price}
                </span>
                <span className="text-gray-600">/month</span>
              </div>
              <Button
                className="w-full bg-[#8A9A8A] hover:bg-[#7A8A7A] text-white"
              >
                Get Started
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Card className="inline-block border-2 border-[#8A9A8A] bg-[#F0F0F0]">
          <CardContent className="p-6">
            <p className="text-lg font-semibold text-[#2C3E50]">
              🏠 Household Cap: Never pay more than <span className="text-[#8A9A8A]">$250/month</span> regardless of family size
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

