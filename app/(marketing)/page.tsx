import { SavingsCalculator } from '@/components/savings-calculator';
import { NinetyTenToggle } from '@/components/ninety-ten-toggle';
import { PricingCards } from '@/components/pricing-cards';
import { Button } from '@/components/ui/button';
import { ScrollButton } from '@/components/scroll-button';
import type { Metadata } from 'next';

// SEO Metadata for Marketing Landing Page
// Targeting "Missing Middle" personas: self-employed, small business owners, gig workers
export const metadata: Metadata = {
  title: "Direct Care Indy - Affordable Healthcare for the Missing Middle | DPC Membership",
  description: "Direct Primary Care membership for self-employed professionals, small business owners, and gig workers. Transparent pricing ($30-$109/month), no insurance hassles, wholesale medication costs. Save an average of $3,732 per year with our 90/10 care model.",
  keywords: [
    "direct primary care",
    "DPC membership",
    "affordable healthcare",
    "self-employed health insurance",
    "small business healthcare",
    "gig worker health insurance",
    "missing middle healthcare",
    "transparent healthcare pricing",
    "wholesale medication pricing",
    "Indiana direct care",
  ],
  openGraph: {
    title: "Direct Care Indy - Affordable Healthcare for the Missing Middle",
    description: "Direct Primary Care membership designed for self-employed professionals, small business owners, and gig workers. Transparent pricing, no insurance hassles, wholesale medication costs. Save $3,732/year on average.",
    type: "website",
    siteName: "Direct Care Indy",
    images: [
      {
        url: "/og-image.jpg", // Add your OpenGraph image
        width: 1200,
        height: 630,
        alt: "Direct Care Indy - Direct Primary Care Membership",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Direct Care Indy - Affordable Healthcare for the Missing Middle",
    description: "DPC membership for self-employed professionals. Transparent pricing, no insurance hassles. Save $3,732/year on average.",
  },
  alternates: {
    canonical: "https://directcareindy.com",
  },
};

export const runtime = 'edge';

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-[#F0F0F0]">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-[#2C3E50] leading-tight">
            Direct Care Indy
          </h1>
          <p className="text-2xl md:text-3xl text-gray-700 font-light">
            Nature Distilled Healthcare
          </p>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Experience the 90/10 model—covering 90% of your healthcare needs through direct primary care,
            with catastrophic insurance handling the remaining 10%. Save an average of $3,732 per year.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <ScrollButton
              targetId="calculator"
              size="lg"
              className="bg-[#8A9A8A] hover:bg-[#7A8A7A] text-white text-lg px-8 py-6"
            >
              Calculate Your Savings
            </ScrollButton>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-[#2C3E50] text-[#2C3E50] hover:bg-[#2C3E50] hover:text-white text-lg px-8 py-6"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Savings Calculator Section */}
      <section id="calculator" className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <SavingsCalculator />
        </div>
      </section>

      {/* 90/10 Toggle Section */}
      <section className="container mx-auto px-4 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <NinetyTenToggle />
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <PricingCards />
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="container mx-auto px-4 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#2C3E50]">
            Why Direct Care Indy?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-semibold text-[#2C3E50]">Transparent Pricing</h3>
              <p className="text-gray-600">
                No hidden fees, no surprise bills. Know exactly what you'll pay each month.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="text-5xl mb-4">⏱️</div>
              <h3 className="text-xl font-semibold text-[#2C3E50]">Same-Day Appointments</h3>
              <p className="text-gray-600">
                Get the care you need when you need it, without waiting weeks for an appointment.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="text-5xl mb-4">💊</div>
              <h3 className="text-xl font-semibold text-[#2C3E50]">Wholesale Medications</h3>
              <p className="text-gray-600">
                Generic medications at true wholesale cost—no insurance markups, no pharmacy fees.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="text-5xl mb-4">🔬</div>
              <h3 className="text-xl font-semibold text-[#2C3E50]">Lab Work at Cost</h3>
              <p className="text-gray-600">
                Blood work, imaging, and tests priced at wholesale rates, not inflated insurance prices.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="text-5xl mb-4">📞</div>
              <h3 className="text-xl font-semibold text-[#2C3E50]">Direct Provider Access</h3>
              <p className="text-gray-600">
                Text, call, or email your doctor directly. No gatekeepers, no bureaucracy.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="text-5xl mb-4">🏥</div>
              <h3 className="text-xl font-semibold text-[#2C3E50]">Comprehensive Care</h3>
              <p className="text-gray-600">
                90% of your healthcare needs covered—from sick visits to chronic disease management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 bg-[#2C3E50]">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold text-white">
            Ready to Transform Your Healthcare?
          </h2>
          <p className="text-xl text-white/90">
            Join hundreds of families who have already saved thousands with Direct Care Indy.
          </p>
          <div className="pt-4">
            <Button
              size="lg"
              className="bg-[#8A9A8A] hover:bg-[#7A8A7A] text-white text-lg px-12 py-6"
            >
              Get Started Today
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-gray-300">
        <div className="max-w-6xl mx-auto text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Direct Care Indy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

