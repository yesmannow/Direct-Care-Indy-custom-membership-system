'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { calculateMonthlyRate } from '@/lib/pricing';
import type { Member } from '@/db/schema';

export function SavingsCalculator() {
  const [currentPremium, setCurrentPremium] = useState<string>('');
  const [currentDeductible, setCurrentDeductible] = useState<string>('');
  const [familyAges, setFamilyAges] = useState<string[]>(['']);
  const [showResults, setShowResults] = useState(false);

  const calculateSavings = () => {
    if (!currentPremium || !currentDeductible || familyAges.some(age => !age)) {
      return;
    }

    // Calculate DPC membership cost
    const today = new Date();
    const allAges = familyAges.filter(age => age);

    if (allAges.length === 0) return;

    // Use first age as primary member DOB
    const primaryAge = parseInt(allAges[0]);
    const primaryBirthYear = today.getFullYear() - primaryAge;
    const primaryDob = new Date(primaryBirthYear, 0, 1);

    // Remaining family members (excluding primary)
    const familyMembers: Member[] = allAges
      .slice(1)
      .map((age, index) => {
        const birthYear = today.getFullYear() - parseInt(age);
        const dob = new Date(birthYear, 0, 1);
        return {
          id: index + 2,
          firstName: `Member${index + 2}`,
          lastName: '',
          email: `member${index + 2}@example.com`,
          dateOfBirth: dob.toISOString().split('T')[0],
          householdId: null,
          status: 'active' as const,
        };
      });

    const monthlyDPC = calculateMonthlyRate(primaryDob, familyMembers);
    const yearlyDPC = monthlyDPC * 12;

    // Estimate catastrophic plan cost (typically $200-400/month for family)
    const monthlyCatastrophic = 300; // Average estimate
    const yearlyCatastrophic = monthlyCatastrophic * 12;

    // Current insurance costs
    const monthlyPremium = parseFloat(currentPremium);
    const yearlyPremium = monthlyPremium * 12;
    const deductible = parseFloat(currentDeductible);

    // Total current cost (premium + average deductible usage)
    const averageDeductibleUsage = deductible * 0.3; // Assume 30% of deductible is used annually
    const totalCurrentCost = yearlyPremium + averageDeductibleUsage;

    // DPC Stack cost
    const dpcStackCost = yearlyDPC + yearlyCatastrophic;

    // Savings
    const savings = totalCurrentCost - dpcStackCost;

    return {
      monthlyDPC,
      yearlyDPC,
      monthlyCatastrophic,
      yearlyCatastrophic,
      totalCurrentCost,
      dpcStackCost,
      savings,
      monthlyPremium,
      yearlyPremium,
      deductible,
    };
  };

  const results = showResults ? calculateSavings() : null;

  const addFamilyMember = () => {
    setFamilyAges([...familyAges, '']);
  };

  const removeFamilyMember = (index: number) => {
    setFamilyAges(familyAges.filter((_, i) => i !== index));
  };

  const updateFamilyAge = (index: number, value: string) => {
    const newAges = [...familyAges];
    newAges[index] = value;
    setFamilyAges(newAges);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto border-2 border-[#2C3E50]">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-[#2C3E50]">DPC Stack Savings Calculator</CardTitle>
        <CardDescription className="text-lg">
          Compare your current insurance costs with the Direct Care Indy + Catastrophic Plan combination
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2 text-[#2C3E50]">
              Current Monthly Premium ($)
            </label>
            <Input
              type="number"
              placeholder="e.g., 500"
              value={currentPremium}
              onChange={(e) => setCurrentPremium(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-[#2C3E50]">
              Annual Deductible ($)
            </label>
            <Input
              type="number"
              placeholder="e.g., 5000"
              value={currentDeductible}
              onChange={(e) => setCurrentDeductible(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-[#2C3E50]">
            Household Ages
          </label>
          <div className="space-y-2">
            {familyAges.map((age, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  type="number"
                  placeholder={`Age ${index + 1}`}
                  value={age}
                  onChange={(e) => updateFamilyAge(index, e.target.value)}
                  className="flex-1"
                />
                {familyAges.length > 1 && (
                  <Button
                    variant="outline"
                    onClick={() => removeFamilyMember(index)}
                    className="px-4"
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              onClick={addFamilyMember}
              className="w-full mt-2"
            >
              + Add Family Member
            </Button>
          </div>
        </div>

        <Button
          onClick={() => setShowResults(true)}
          className="w-full bg-[#8A9A8A] hover:bg-[#7A8A7A] text-white"
          disabled={!currentPremium || !currentDeductible || familyAges.some(age => !age)}
        >
          Calculate Savings
        </Button>

        {results && (
          <div className="mt-8 p-6 bg-[#F0F0F0] rounded-lg border-2 border-[#2C3E50]">
            <h3 className="text-2xl font-bold mb-4 text-[#2C3E50]">Your Savings Breakdown</h3>

            <div className="grid gap-4 md:grid-cols-2 mb-6">
              <div className="p-4 bg-white rounded border border-[#2C3E50]">
                <h4 className="font-semibold text-[#2C3E50] mb-2">Current Insurance</h4>
                <p className="text-sm text-gray-600">Monthly Premium: ${results.monthlyPremium.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Annual Premium: ${results.yearlyPremium.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Deductible: ${results.deductible.toFixed(2)}</p>
                <p className="text-lg font-bold text-[#2C3E50] mt-2">
                  Total Annual Cost: ${results.totalCurrentCost.toFixed(2)}
                </p>
              </div>

              <div className="p-4 bg-white rounded border border-[#8A9A8A]">
                <h4 className="font-semibold text-[#2C3E50] mb-2">DPC Stack</h4>
                <p className="text-sm text-gray-600">Direct Care Indy: ${results.monthlyDPC.toFixed(2)}/mo</p>
                <p className="text-sm text-gray-600">Annual DPC: ${results.yearlyDPC.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Catastrophic Plan: ${results.monthlyCatastrophic.toFixed(2)}/mo</p>
                <p className="text-sm text-gray-600">Annual Catastrophic: ${results.yearlyCatastrophic.toFixed(2)}</p>
                <p className="text-lg font-bold text-[#8A9A8A] mt-2">
                  Total Annual Cost: ${results.dpcStackCost.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="p-6 bg-[#8A9A8A] text-white rounded-lg text-center">
              <p className="text-sm mb-2">Average Annual Savings</p>
              <p className="text-4xl font-bold">
                ${results.savings > 0 ? results.savings.toFixed(2) : '0.00'}
              </p>
              {results.savings > 0 && (
                <p className="text-lg mt-2">
                  That's ${(results.savings / 12).toFixed(2)} per month!
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

