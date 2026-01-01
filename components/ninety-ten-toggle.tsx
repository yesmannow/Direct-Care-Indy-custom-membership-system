'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function NinetyTenToggle() {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-[#2C3E50]">
        The 90/10 Healthcare Model
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        {/* Included 90% */}
        <Card className="border-2 border-[#8A9A8A] bg-white">
          <CardHeader className="bg-[#8A9A8A] text-white">
            <CardTitle className="text-2xl">Included 90%</CardTitle>
            <CardDescription className="text-white/90">
              Covered by Direct Care Indy Membership
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="space-y-3 text-[#2C3E50]">
              <li className="flex items-start">
                <span className="text-[#8A9A8A] mr-2">✓</span>
                <span>Sick visits & acute care</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#8A9A8A] mr-2">✓</span>
                <span>Minor procedures & treatments</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#8A9A8A] mr-2">✓</span>
                <span>Chronic disease management</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#8A9A8A] mr-2">✓</span>
                <span>Preventive care & wellness visits</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#8A9A8A] mr-2">✓</span>
                <span>Wholesale medication pricing</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#8A9A8A] mr-2">✓</span>
                <span>Lab work at cost</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#8A9A8A] mr-2">✓</span>
                <span>Unlimited office visits</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#8A9A8A] mr-2">✓</span>
                <span>Direct provider access</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Insurance 10% */}
        <Card className="border-2 border-[#2C3E50] bg-white">
          <CardHeader className="bg-[#2C3E50] text-white">
            <CardTitle className="text-2xl">Insurance 10%</CardTitle>
            <CardDescription className="text-white/90">
              Covered by Catastrophic Plan
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="space-y-3 text-[#2C3E50]">
              <li className="flex items-start">
                <span className="text-[#2C3E50] mr-2">✓</span>
                <span>Major surgery & hospitalization</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#2C3E50] mr-2">✓</span>
                <span>Emergency room visits</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#2C3E50] mr-2">✓</span>
                <span>Specialist referrals (when needed)</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#2C3E50] mr-2">✓</span>
                <span>Advanced imaging (MRI, CT scans)</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#2C3E50] mr-2">✓</span>
                <span>Cancer treatment</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#2C3E50] mr-2">✓</span>
                <span>Trauma care</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#2C3E50] mr-2">✓</span>
                <span>High-cost specialty procedures</span>
              </li>
            </ul>
            <div className="mt-4 p-4 bg-[#F0F0F0] rounded border border-[#2C3E50]">
              <p className="text-sm text-[#2C3E50]">
                <strong>Note:</strong> A low-cost catastrophic plan ($200-400/month) covers these rare but expensive events, providing comprehensive protection while keeping your monthly costs low.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

