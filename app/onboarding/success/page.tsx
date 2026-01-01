import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function OnboardingSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-slate-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="space-y-8">
          {/* Success Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 p-4">
                <svg className="h-16 w-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900">
              Welcome to the Family! 🎉
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Your enrollment is complete. You're now a member of Direct Care Indy.
            </p>
            {searchParams.session_id && (
              <Badge variant="outline" className="text-sm">
                Session ID: {searchParams.session_id.substring(0, 20)}...
              </Badge>
            )}
          </div>

          {/* Welcome Video Placeholder */}
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
            <CardHeader>
              <div className="flex items-center gap-3">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <CardTitle className="text-2xl text-blue-900">Welcome Orientation Video</CardTitle>
              </div>
              <CardDescription>
                Watch this short video to learn about your new membership benefits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-slate-200 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300">
                <div className="text-center space-y-2">
                  <svg className="h-12 w-12 text-slate-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p className="text-slate-500 font-medium">Welcome Video Placeholder</p>
                  <p className="text-sm text-slate-400">
                    Your orientation video will be available here soon
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What Happens Next Checklist */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">What Happens Next</CardTitle>
              <CardDescription>
                Here's your checklist to get started with Direct Care Indy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <svg className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-900">1. Account Activation</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Your membership account is being activated. You'll receive a confirmation email within 24 hours.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <svg className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="font-semibold">2. Schedule Your Welcome Visit</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Book your first appointment to meet your provider and review your health history.
                      You can schedule through the member portal or by calling us directly.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <svg className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="font-semibold">3. Set Up Secure Communication</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Access your member portal to set up secure, HIPAA-compliant messaging with your provider.
                      No more waiting on hold - get answers when you need them.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <svg className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8h10M3 6l9 4.5L21 6M3 18h18v-6l-9 4.5L3 12v6z" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="font-semibold">4. Check Your Email</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      You'll receive a welcome orientation message within 24 hours with important information
                      about your membership, including how to access your portal and schedule appointments.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-blue-900">Access Member Portal</CardTitle>
                <CardDescription>
                  View your membership details and manage your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <a
                  href="/portal"
                  className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-2"
                >
                  Go to Portal →
                </a>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-blue-900">View Pricing</CardTitle>
                <CardDescription>
                  See our transparent medication and lab pricing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <a
                  href="/portal/pricing"
                  className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-2"
                >
                  Browse Pricing →
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

