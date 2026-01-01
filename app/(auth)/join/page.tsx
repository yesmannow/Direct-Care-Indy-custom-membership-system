import { EnrollmentForm } from '@/components/enrollment-form';

export default function JoinPage() {
  return (
    <div className="min-h-screen bg-[#F0F0F0] py-12 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#2C3E50] mb-4">
            Join Direct Care Indy
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Complete your enrollment in just 3 simple steps. Get started with transparent,
            affordable healthcare today.
          </p>
        </div>
        <EnrollmentForm />
      </div>
    </div>
  );
}

