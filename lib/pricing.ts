import { Member } from '@/db/schema';

export type AgeTier = 'child' | 'young_adult' | 'adult' | 'senior';

export interface MemberWithTier extends Member {
  age: number;
  tier: AgeTier;
  monthlyRate: number;
}

/**
 * Calculate age from date of birth
 */
export function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Determine pricing tier based on age
 * - Child (0-18): $30
 * - Young Adult (19-44): $69
 * - Adult (45-64): $89
 * - Senior (65+): $109
 */
export function getAgeTier(age: number): AgeTier {
  if (age <= 18) return 'child';
  if (age <= 44) return 'young_adult';
  if (age <= 64) return 'adult';
  return 'senior';
}

/**
 * Get monthly rate based on age tier
 */
export function getMonthlyRate(tier: AgeTier): number {
  const rates: Record<AgeTier, number> = {
    child: 30,
    young_adult: 69,
    adult: 89,
    senior: 109,
  };
  return rates[tier];
}

/**
 * Calculate monthly dues for a group of members with household cap
 * Household Cap: $250/month maximum regardless of number of members
 */
export function calculateMonthlyDues(members: Member[]): number {
  if (members.length === 0) return 0;

  // Calculate individual rates
  const totalBeforeCap = members.reduce((total, member) => {
    const age = calculateAge(member.dateOfBirth);
    const tier = getAgeTier(age);
    const rate = getMonthlyRate(tier);
    return total + rate;
  }, 0);

  // Apply household cap of $250
  return Math.min(totalBeforeCap, 250);
}

/**
 * Get member details with tier and pricing information
 */
export function getMemberWithTierInfo(member: Member): MemberWithTier {
  const age = calculateAge(member.dateOfBirth);
  const tier = getAgeTier(age);
  const monthlyRate = getMonthlyRate(tier);

  return {
    ...member,
    age,
    tier,
    monthlyRate,
  };
}

/**
 * Get all members in a household with their tier information
 */
export function getHouseholdMembersWithTiers(members: Member[]): {
  members: MemberWithTier[];
  totalDues: number;
  savingsFromCap: number;
} {
  const membersWithTiers = members.map(getMemberWithTierInfo);
  const totalBeforeCap = membersWithTiers.reduce((sum, m) => sum + m.monthlyRate, 0);
  const totalDues = calculateMonthlyDues(members);
  const savingsFromCap = Math.max(0, totalBeforeCap - totalDues);

  return {
    members: membersWithTiers,
    totalDues,
    savingsFromCap,
  };
}

/**
 * Format tier name for display
 */
export function formatTierName(tier: AgeTier): string {
  const names: Record<AgeTier, string> = {
    child: 'Child',
    young_adult: 'Young Adult',
    adult: 'Adult',
    senior: 'Senior',
  };
  return names[tier];
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
