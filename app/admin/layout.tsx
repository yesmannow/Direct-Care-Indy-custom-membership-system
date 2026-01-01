import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Direct Care Indy</h1>
              <p className="text-sm text-slate-600">Provider Dashboard</p>
            </div>
            <nav className="flex gap-6">
              <a href="/admin" className="text-sm font-medium text-slate-900 hover:text-slate-600">
                Member Directory
              </a>
              <a href="/admin/medications" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Medications
              </a>
              <a href="/admin/labs" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Lab Directory
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
