import { z } from 'zod';

// Step 1: Patient Profile
export const patientProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email address'),
  dateOfBirth: z.string().refine(
    (date) => {
      const dob = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate()) ? age - 1 : age;
      return actualAge >= 13; // Minimum age for DPC membership
    },
    { message: 'Must be at least 13 years old to enroll' }
  ),
});

// Step 2: Family Member
export const familyMemberSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  dateOfBirth: z.string().refine(
    (date) => {
      const dob = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate()) ? age - 1 : age;
      return actualAge >= 13; // Minimum age for DPC membership
    },
    { message: 'Family members must be at least 13 years old' }
  ),
});

// Step 2: Household Setup
export const householdSetupSchema = z.object({
  householdName: z.string().min(1, 'Household name is required').max(100).optional(),
  familyMembers: z.array(familyMemberSchema).default([]),
});

// Complete Enrollment Form
export const enrollmentSchema = z.object({
  // Step 1
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email address'),
  dateOfBirth: z.string(),
  // Step 2
  householdName: z.string().max(100).optional(),
  familyMembers: z.array(familyMemberSchema).default([]),
});

export type PatientProfileFormData = z.infer<typeof patientProfileSchema>;
export type FamilyMemberFormData = z.infer<typeof familyMemberSchema>;
export type HouseholdSetupFormData = z.infer<typeof householdSetupSchema>;
export type EnrollmentFormData = z.infer<typeof enrollmentSchema>;

