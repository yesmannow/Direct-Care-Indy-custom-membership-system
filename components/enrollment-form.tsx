'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  enrollmentSchema,
  patientProfileSchema,
  householdSetupSchema,
  type EnrollmentFormData,
  type FamilyMemberFormData
} from '@/lib/validations/enrollment';
import { calculateMonthlyRate } from '@/lib/pricing';
import { formatCurrency } from '@/lib/pricing';
import { createEnrollment } from '@/app/actions/enrollment';
import type { Member } from '@/db/schema';

type FormStep = 1 | 2 | 3;

export function EnrollmentForm() {
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm<EnrollmentFormData>({
    resolver: zodResolver(enrollmentSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      dateOfBirth: '',
      householdName: '',
      familyMembers: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'familyMembers',
  });

  const watchedValues = watch();
  const primaryDob = watchedValues.dateOfBirth ? new Date(watchedValues.dateOfBirth) : null;
  const familyMembers: Member[] = watchedValues.familyMembers.map((fm, index) => ({
    id: index + 1,
    firstName: fm.firstName,
    lastName: fm.lastName,
    email: `${fm.firstName}@temp.com`,
    dateOfBirth: fm.dateOfBirth,
    householdId: null,
    status: 'pending_payment' as const,
  }));

  const monthlyRate = primaryDob
    ? calculateMonthlyRate(primaryDob, familyMembers)
    : 0;

  const addFamilyMember = () => {
    append({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
    });
  };

  const removeFamilyMember = (index: number) => {
    remove(index);
  };

  const nextStep = async () => {
    if (currentStep === 1) {
      // Validate step 1 fields
      const isValidStep1 = await trigger(['firstName', 'lastName', 'email', 'dateOfBirth']);
      if (isValidStep1) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      // Step 2 validation is optional (family members), so we can proceed
      setCurrentStep(3);
    } else if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as FormStep);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as FormStep);
    }
  };

  const onSubmit = async (data: EnrollmentFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Create enrollment in database
      const enrollmentResult = await createEnrollment(data);

      if (!enrollmentResult.success) {
        throw new Error(enrollmentResult.error || 'Failed to create enrollment');
      }

      // Handle redirect based on payment mode
      if (enrollmentResult.paymentMode === 'demo' && enrollmentResult.redirectUrl) {
        // Demo mode: redirect to success page
        window.location.href = enrollmentResult.redirectUrl;
      } else if (enrollmentResult.paymentMode === 'stripe') {
        // Stripe mode: create checkout session
        const { createCheckoutSession } = await import('@/app/actions/stripe');
        const checkoutResult = await createCheckoutSession(
          enrollmentResult.monthlyRate || monthlyRate,
          enrollmentResult.memberIds || [],
          enrollmentResult.householdId
        );

        if (!checkoutResult.success || !checkoutResult.url) {
          throw new Error(checkoutResult.error || 'Failed to create checkout session');
        }

        // Redirect to Stripe checkout
        window.location.href = checkoutResult.url;
      } else {
        // Fallback: redirect to success page
        window.location.href = '/onboarding/success';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="border-2 border-[#2C3E50]">
        <CardHeader>
          <CardTitle className="text-3xl text-[#2C3E50]">
            Join Direct Care Indy
          </CardTitle>
          <CardDescription className="text-lg">
            Step {currentStep} of 3
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      currentStep >= step
                        ? 'bg-[#8A9A8A] text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        currentStep > step ? 'bg-[#8A9A8A]' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Patient Profile</span>
              <span>Household Setup</span>
              <span>Verification</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Patient Profile */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-[#2C3E50] mb-4">
                  Patient Profile
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#2C3E50]">
                      First Name *
                    </label>
                    <Input
                      {...register('firstName')}
                      placeholder="John"
                      className={errors.firstName ? 'border-red-500' : ''}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#2C3E50]">
                      Last Name *
                    </label>
                    <Input
                      {...register('lastName')}
                      placeholder="Doe"
                      className={errors.lastName ? 'border-red-500' : ''}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#2C3E50]">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    {...register('email')}
                    placeholder="john.doe@example.com"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#2C3E50]">
                    Date of Birth *
                  </label>
                  <Input
                    type="date"
                    {...register('dateOfBirth')}
                    className={errors.dateOfBirth ? 'border-red-500' : ''}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.dateOfBirth.message}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 mt-1">
                    Must be at least 13 years old to enroll
                  </p>
                </div>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!isValid || !watchedValues.firstName || !watchedValues.lastName || !watchedValues.email || !watchedValues.dateOfBirth}
                    className="bg-[#8A9A8A] hover:bg-[#7A8A7A] text-white"
                  >
                    Next: Household Setup
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Household Setup */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-[#2C3E50] mb-4">
                  Household Setup
                </h2>
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#2C3E50]">
                    Household Name (Optional)
                  </label>
                  <Input
                    {...register('householdName')}
                    placeholder="The Smith Family"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Leave blank to use your name
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-[#2C3E50]">
                      Family Members (Optional)
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addFamilyMember}
                      className="text-sm"
                    >
                      + Add Member
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Add family members who are at least 13 years old. Each member will be included in your household membership.
                  </p>
                  {fields.length === 0 && (
                    <p className="text-sm text-gray-500 italic mb-4">
                      No family members added yet. You can add them later if needed.
                    </p>
                  )}
                  {fields.map((field, index) => (
                    <Card key={field.id} className="mb-4 border border-gray-300">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="font-semibold text-[#2C3E50]">
                            Family Member {index + 1}
                          </h3>
                          {fields.length > 0 && (
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => removeFamilyMember(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium mb-2 text-[#2C3E50]">
                              First Name *
                            </label>
                            <Input
                              {...register(`familyMembers.${index}.firstName`)}
                              placeholder="Jane"
                              className={errors.familyMembers?.[index]?.firstName ? 'border-red-500' : ''}
                            />
                            {errors.familyMembers?.[index]?.firstName && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.familyMembers[index]?.firstName?.message}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2 text-[#2C3E50]">
                              Last Name *
                            </label>
                            <Input
                              {...register(`familyMembers.${index}.lastName`)}
                              placeholder="Doe"
                              className={errors.familyMembers?.[index]?.lastName ? 'border-red-500' : ''}
                            />
                            {errors.familyMembers?.[index]?.lastName && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.familyMembers[index]?.lastName?.message}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-2 text-[#2C3E50]">
                            Date of Birth *
                          </label>
                          <Input
                            type="date"
                            {...register(`familyMembers.${index}.dateOfBirth`)}
                            className={errors.familyMembers?.[index]?.dateOfBirth ? 'border-red-500' : ''}
                          />
                          {errors.familyMembers?.[index]?.dateOfBirth && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.familyMembers[index]?.dateOfBirth?.message}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-[#8A9A8A] hover:bg-[#7A8A7A] text-white"
                  >
                    Next: Verification
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Verification */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-[#2C3E50] mb-4">
                  Review & Verification
                </h2>
                <Card className="bg-[#F0F0F0] border-2 border-[#2C3E50]">
                  <CardHeader>
                    <CardTitle className="text-xl text-[#2C3E50]">
                      Primary Member
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p><strong>Name:</strong> {watchedValues.firstName} {watchedValues.lastName}</p>
                    <p><strong>Email:</strong> {watchedValues.email}</p>
                    <p><strong>Date of Birth:</strong> {watchedValues.dateOfBirth}</p>
                  </CardContent>
                </Card>

                {watchedValues.familyMembers.length > 0 && (
                  <Card className="bg-[#F0F0F0] border-2 border-[#2C3E50]">
                    <CardHeader>
                      <CardTitle className="text-xl text-[#2C3E50]">
                        Family Members ({watchedValues.familyMembers.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {watchedValues.familyMembers.map((member, index) => (
                          <li key={index} className="border-b border-gray-300 pb-2">
                            <strong>{member.firstName} {member.lastName}</strong>
                            <span className="text-gray-600 ml-2">DOB: {member.dateOfBirth}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                <Card className="bg-[#8A9A8A] text-white border-2 border-[#8A9A8A]">
                  <CardHeader>
                    <CardTitle className="text-2xl text-white">
                      Monthly Membership Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <p className="text-5xl font-bold mb-2">
                        {formatCurrency(monthlyRate)}
                      </p>
                      <p className="text-lg">per month</p>
                      {monthlyRate >= 250 && (
                        <p className="text-sm mt-2 text-white/90">
                          Household cap applied - you're saving money!
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
                    {error}
                  </div>
                )}

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={isSubmitting}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#8A9A8A] hover:bg-[#7A8A7A] text-white"
                  >
                    {isSubmitting ? 'Processing...' : 'Complete Enrollment'}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

