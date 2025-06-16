
'use client';

import type { ReactNode } from 'react';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppLogo } from '@/components/icons';
import { UserNav } from '@/components/user-nav';
import Link from 'next/link';
import { Home, FileText, Briefcase, BookOpen, Settings, BotMessageSquare, PencilRuler, Newspaper } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname(); // Gets the current path, e.g., /dashboard or /dashboard/settings
  const [currentHash, setCurrentHash] = useState<string>('');

  useEffect(() => {
    // Function to get and set the current hash
    const updateHashState = () => {
      setCurrentHash(window.location.hash.substring(1));
    };

    updateHashState(); // Set the initial hash state

    // Listen for hash changes
    window.addEventListener('hashchange', updateHashState, false);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('hashchange', updateHashState, false);
    };
  }, [pathname]); // Re-run effect if pathname changes (e.g., navigating between /dashboard and /dashboard/settings)

  const isSettingsPage = pathname === '/dashboard/settings';
  const isDashboardPage = pathname === '/dashboard';

  // Determine active state for the main "Dashboard" link (overview tab)
  const dashboardOverviewActive = isDashboardPage && (currentHash === '' || currentHash === 'overview');

  return (
    <SidebarProvider defaultOpen>
      <Sidebar variant="sidebar" collapsible="icon" className="border-r">
        <SidebarHeader className="p-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2" aria-label="Reputation Guardian Home">
            <AppLogo className="w-8 h-8 text-primary" />
            <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden">Reputation Guardian</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={dashboardOverviewActive} tooltip="Dashboard">
                <Link href="/dashboard">
                  <Home />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isDashboardPage && currentHash === 'mentions'} tooltip="Mentions">
                <Link href="/dashboard#mentions">
                  <FileText />
                  <span>Mentions</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isDashboardPage && currentHash === 'news-feed'} tooltip="News Feed">
                <Link href="/dashboard#news-feed">
                  <Newspaper />
                  <span>News Feed</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isDashboardPage && currentHash === 'legal-cases'} tooltip="Legal Cases">
                <Link href="/dashboard#legal-cases">
                  <Briefcase />
                  <span>Legal Cases</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isDashboardPage && currentHash === 'encyclopedia'} tooltip="Encyclopedia">
                <Link href="/dashboard#encyclopedia">
                  <BookOpen />
                  <span>Encyclopedia</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isDashboardPage && currentHash === 'risk-assessment'} tooltip="Risk Assessment Tool">
                <Link href="/dashboard#risk-assessment">
                  <BotMessageSquare />
                  <span>Risk Assessment</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isDashboardPage && currentHash === 'content-generation'} tooltip="Content Generation">
                <Link href="/dashboard#content-generation">
                  <PencilRuler />
                  <span>Content Generation</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isSettingsPage} tooltip="Settings">
                <Link href="/dashboard/settings">
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <div className="md:hidden">
            <SidebarTrigger />
          </div>
          <div className="flex-1">
            {/* Breadcrumbs or search can go here */}
          </div>
          <UserNav />
        </header>
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
