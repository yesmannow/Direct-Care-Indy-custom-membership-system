import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-slate-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold text-blue-900">Direct Care Indy</h1>
            <p className="text-xl text-slate-600">
              Direct Primary Care Membership Platform
            </p>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Transparent, affordable healthcare with age-based pricing and wholesale medication costs.
              Experience the 90/10 model - covering 90% of your healthcare needs.
            </p>
          </div>

          {/* Portal Links */}
          <div className="grid gap-6 md:grid-cols-2">
            <Link href="/portal">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-blue-200 bg-gradient-to-br from-blue-50 to-white h-full">
                <CardHeader>
                  <CardTitle className="text-2xl text-blue-900">Member Portal</CardTitle>
                  <CardDescription className="text-base">
                    View your membership status, pricing, and covered services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-600 font-medium">Access Member Dashboard →</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-slate-200 bg-gradient-to-br from-slate-50 to-white h-full">
                <CardHeader>
                  <CardTitle className="text-2xl text-slate-900">Provider Dashboard</CardTitle>
                  <CardDescription className="text-base">
                    Manage member directory, medications, and lab pricing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 font-medium">Access Admin Dashboard →</p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Features */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Age-Based Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Fair, transparent pricing based on age tiers: $30-$109/month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Household Cap</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Families never pay more than $250/month, regardless of size
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Wholesale Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Generic medications and labs at true wholesale cost - no markups
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tech Stack Info */}
          <Card className="border-slate-200 bg-slate-50">
            <CardHeader>
              <CardTitle>Technical Stack</CardTitle>
              <CardDescription>
                Built with modern, edge-optimized technologies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {['Next.js 15', 'Cloudflare Pages', 'Tailwind CSS', 'Shadcn/UI', 'Drizzle ORM', 'Cloudflare D1', 'TypeScript'].map(tech => (
                  <span key={tech} className="px-3 py-1 bg-white rounded-full text-sm border">
                    {tech}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

