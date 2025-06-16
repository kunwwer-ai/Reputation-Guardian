
import type { ReactNode } from 'react';
import Link from 'next/link';
import { AppLogo } from '@/components/icons';
import { UserNav } from '@/components/user-nav';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b bg-background/95 px-4 shadow-sm backdrop-blur sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-3" aria-label="Reputation Guardian Home">
          <AppLogo className="w-7 h-7 text-primary" />
          <span className="font-semibold text-xl text-foreground tracking-tight">Reputation Guardian</span>
        </Link>
        <UserNav />
      </header>
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
