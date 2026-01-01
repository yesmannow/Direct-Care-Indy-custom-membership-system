'use server';

export const runtime = 'edge';

import { db } from '@/db';
import { members, households } from '@/db/schema';
import { calculateMonthlyRate } from '@/lib/pricing';
import type { EnrollmentFormData } from '@/lib/validations/enrollment';
import type { Member } from '@/db/schema';

export interface EnrollmentResult {
  success: boolean;
  householdId?: number;
  memberIds?: number[];
  monthlyRate?: number;
  error?: string;
}

export async function createEnrollment(data: EnrollmentFormData): Promise<EnrollmentResult> {
  try {
    // Calculate monthly rate
    const primaryDob = new Date(data.dateOfBirth);
    const familyMembers: Member[] = data.familyMembers.map((fm, index) => ({
      id: index + 1, // Temporary ID for calculation
      firstName: fm.firstName,
      lastName: fm.lastName,
      email: `${fm.firstName.toLowerCase()}.${fm.lastName.toLowerCase()}@temp.com`, // Temporary email
      dateOfBirth: fm.dateOfBirth,
      householdId: null,
      status: 'pending_payment' as const,
    }));

    const monthlyRate = calculateMonthlyRate(primaryDob, familyMembers);

    // Create household if household name is provided or if there are family members
    let householdId: number | null = null;
    if (data.householdName || data.familyMembers.length > 0) {
      const householdName = data.householdName || `${data.firstName} ${data.lastName} Family`;
      const result = await db
        .insert(households)
        .values({
          name: householdName,
          createdAt: new Date(),
        })
        .returning();

      // Handle both single result and array result
      const household = Array.isArray(result) ? result[0] : result;
      householdId = household?.id || null;
    }

    // Create primary member
    const primaryResult = await db
      .insert(members)
      .values({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        dateOfBirth: data.dateOfBirth,
        householdId,
        status: 'pending_payment',
      })
      .returning();

    const primaryMember = Array.isArray(primaryResult) ? primaryResult[0] : primaryResult;
    if (!primaryMember || !primaryMember.id) {
      throw new Error('Failed to create primary member');
    }

    // Create family members
    const memberIds = [primaryMember.id];
    if (data.familyMembers.length > 0) {
      const familyResult = await db
        .insert(members)
        .values(
          data.familyMembers.map((fm) => ({
            firstName: fm.firstName,
            lastName: fm.lastName,
            email: `${fm.firstName.toLowerCase()}.${fm.lastName.toLowerCase()}.${Date.now()}@temp.com`, // Unique temp email
            dateOfBirth: fm.dateOfBirth,
            householdId,
            status: 'pending_payment' as const,
          }))
        )
        .returning();

      const insertedMembers = Array.isArray(familyResult) ? familyResult : [familyResult];
      memberIds.push(...insertedMembers.map((m) => m.id).filter((id): id is number => id !== undefined));
    }

    return {
      success: true,
      householdId: householdId || undefined,
      memberIds,
      monthlyRate,
    };
  } catch (error) {
    console.error('Enrollment creation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create enrollment',
    };
  }
}

