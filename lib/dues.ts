import { Member } from '@/db/schema';

/**
 * Pike Medical "90/10" Strategic Module
 * 
 * This utility implements the Direct Primary Care (DPC) pricing model where
 * 90% of healthcare needs are covered by the membership, with only 10% requiring
 * traditional insurance (surgeries, ER visits, hospitalizations).
 */

/**
 * Calculate a member's monthly membership price based on Pike Medical's age-based tiers.
 * 
 * Pike Medical "90/10" Strategic Module - Age-Based Pricing Tiers:
 * - Child (0-18): $30/month
 * - Young Adult (19-44): $69/month  
 * - Adult (45-64): $89/month
 * - Senior (65+): $109/month
 * 
 * @param dateOfBirth - The member's date of birth
 * @returns Monthly membership price in dollars
 */
export function calculateMemberMonthlyPrice(dateOfBirth: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();
  
  // Adjust age if birthday hasn't occurred this year yet
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--;
  }
  
  // Pike Medical "90/10" Strategic Module - Tier Assignment
  if (age <= 18) {
    return 30; // Child tier
  } else if (age <= 44) {
    return 69; // Young Adult tier
  } else if (age <= 64) {
    return 89; // Adult tier
  } else {
    return 109; // Senior tier (65+)
  }
}

/**
 * Calculate the total monthly dues for a household with Pike Medical's family cap.
 * 
 * Pike Medical "90/10" Strategic Module - Household Cap:
 * Families never pay more than $250/month regardless of household size.
 * This makes DPC accessible for larger families.
 * 
 * @param members - Array of household members with dateOfBirth
 * @returns Total monthly dues for the household (capped at $250)
 */
export function calculateHouseholdTotal(members: Member[]): number {
  if (members.length === 0) return 0;
  
  // Sum individual member prices
  const totalBeforeCap = members.reduce((sum, member) => {
    const dob = new Date(member.dateOfBirth);
    const individualPrice = calculateMemberMonthlyPrice(dob);
    return sum + individualPrice;
  }, 0);
  
  // Pike Medical "90/10" Strategic Module - Apply $250 family cap
  return Math.min(totalBeforeCap, 250);
}

/**
 * Helper function to convert date string to Date object
 * Handles ISO date strings from the database
 */
export function parseDateOfBirth(dateString: string): Date {
  return new Date(dateString);
}

/**
 * Calculate age from date of birth
 * Useful for displaying member information
 */
export function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Get tier name for display purposes
 */
export function getTierName(age: number): string {
  if (age <= 18) return 'Child';
  if (age <= 44) return 'Young Adult';
  if (age <= 64) return 'Adult';
  return 'Senior';
}

/**
 * Calculate savings from household cap
 */
export function calculateHouseholdSavings(members: Member[]): number {
  if (members.length === 0) return 0;
  
  const totalBeforeCap = members.reduce((sum, member) => {
    const dob = new Date(member.dateOfBirth);
    const individualPrice = calculateMemberMonthlyPrice(dob);
    return sum + individualPrice;
  }, 0);
  
  const actualTotal = calculateHouseholdTotal(members);
  return Math.max(0, totalBeforeCap - actualTotal);
}
