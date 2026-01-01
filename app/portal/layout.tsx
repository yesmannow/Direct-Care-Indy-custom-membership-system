import { ReactNode } from 'react';

export default function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-blue-900">Direct Care Indy</h1>
              <p className="text-sm text-blue-600">Member Portal</p>
            </div>
            <nav className="flex gap-6">
              <a href="/portal" className="text-sm font-medium text-blue-900 hover:text-blue-600">
                My Membership
              </a>
              <a href="/portal/services" className="text-sm font-medium text-blue-600 hover:text-blue-900">
                Services
              </a>
              <a href="/portal/pricing" className="text-sm font-medium text-blue-600 hover:text-blue-900">
                Price Lists
              </a>
            </nav>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
