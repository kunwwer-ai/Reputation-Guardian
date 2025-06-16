
import type { ReactNode } from 'react';
import Link from 'next/link';
import { AppLogo } from '@/components/icons';
import { UserNav } from '@/components/user-nav';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b bg-background/95 px-4 shadow-sm backdrop-blur sm:px-6">
        <div className="flex items-center gap-3">
          <AppLogo className="w-7 h-7 text-primary" />
          <div className="flex flex-col">
            <Link href="/dashboard" className="flex items-center" aria-label="Reputation Guardian Home">
              <span className="font-semibold text-xl text-foreground tracking-tight">Reputation Guardian</span>
            </Link>
            <a 
              href="https://kunwwer.ai/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
            >
              Made by Kunwwer.ai
            </a>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search className="h-5 w-5" />
          </Button>
          <UserNav />
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
