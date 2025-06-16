
"use client"; // Added "use client" directive

import type { ReactNode } from 'react';
import Link from 'next/link';
import { AppLogo } from '@/components/icons';
import { UserNav } from '@/components/user-nav';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");
  const router = useRouter();
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);

  const handleGlobalSearch = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (globalSearchTerm.trim()) {
      router.push(`/dashboard#encyclopedia?q=${encodeURIComponent(globalSearchTerm.trim())}`);
      setGlobalSearchTerm(""); // Clear input after search
      setIsSearchDialogOpen(false); // Close dialog
    }
  };

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
          <Dialog open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Search">
                <SearchIcon className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Global Search</DialogTitle>
                <DialogDescription>
                  Search within the Encyclopedia. Enter your keywords below.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleGlobalSearch}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="global-search-input" className="text-right sr-only">
                      Search
                    </Label>
                    <Input
                      id="global-search-input"
                      value={globalSearchTerm}
                      onChange={(e) => setGlobalSearchTerm(e.target.value)}
                      placeholder="Search Encyclopedia..."
                      className="col-span-4"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={!globalSearchTerm.trim()}>Search Encyclopedia</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <UserNav />
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
