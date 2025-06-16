
"use client"; // Required for Tabs and client-side interactions

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from "@/components/dashboard/overview-tab";
import { MentionsTab } from "@/components/dashboard/mentions-tab";
import { LegalCasesTab } from "@/components/dashboard/legal-cases-tab";
import { EncyclopediaTab } from "@/components/dashboard/encyclopedia-tab";
import { NewsFeedTab } from "@/components/dashboard/news-feed-tab";
import { ContentGenerationTab } from "@/components/dashboard/content-generation-tab";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 

// Placeholder for RiskAssessmentTool
function RiskAssessmentToolPlaceholder() {
  return <div className="p-4 border rounded-lg bg-card shadow"><h3 className="text-xl font-semibold">Risk Assessment Tool</h3><p className="text-muted-foreground">AI-powered scanning tool to analyze online mentions and legal cases, and assess their risk level. (Coming Soon)</p></div>;
}

const validTabs = ["overview", "mentions", "legal-cases", "encyclopedia", "news-feed", "risk-assessment", "content-generation"];

export default function DashboardPage() {
  const router = useRouter();
  // Initialize activeTab to a default. Server and initial client render will use this.
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // This function syncs the active tab state with the current URL hash.
    // It runs only on the client, after initial hydration.
    const syncTabWithHash = () => {
      const currentHash = window.location.hash.substring(1);
      if (currentHash && validTabs.includes(currentHash)) {
        if (activeTab !== currentHash) { // Only update if state is different
          setActiveTab(currentHash);
        }
      } else {
        // If hash is empty, invalid, or doesn't match a tab, default to "overview"
        if (activeTab !== "overview") { // Only update if state is different
            setActiveTab("overview");
        }
        // Optionally, normalize URL if on /dashboard and hash is not #overview or empty
        // This helps keep the URL clean if an invalid hash was manually entered.
        if (window.location.pathname === '/dashboard' && currentHash !== 'overview' && currentHash !== '') {
           router.replace('/dashboard#overview', { scroll: false });
        }
      }
    };

    syncTabWithHash(); // Sync on initial client mount

    window.addEventListener('hashchange', syncTabWithHash, false);
    return () => {
      window.removeEventListener('hashchange', syncTabWithHash, false);
    };
  }, [router, activeTab]); // Rerun if router changes or activeTab is changed by handleTabChange

  const handleTabChange = (value: string) => {
    // This is called when a user clicks on a TabsTrigger component
    setActiveTab(value); // Update state first
    router.push(`/dashboard#${value}`, { scroll: false }); // Update URL, hashchange listener in useEffect will also fire
  };
  
  return (
    <div className="flex flex-col h-full">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full flex-grow flex flex-col">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-7 gap-1 mb-6 shadow-sm sticky top-0 bg-background/90 backdrop-blur-sm z-10">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="mentions">Mentions</TabsTrigger>
          <TabsTrigger value="legal-cases">Legal Cases</TabsTrigger>
          <TabsTrigger value="encyclopedia">Encyclopedia</TabsTrigger>
          <TabsTrigger value="news-feed">News Feed</TabsTrigger>
          <TabsTrigger value="risk-assessment">Risk Assessment</TabsTrigger>
          <TabsTrigger value="content-generation">Content Generation</TabsTrigger>
        </TabsList>
        
        <div className="flex-grow overflow-y-auto pb-10">
          <TabsContent value="overview" className="mt-0">
            <OverviewTab />
          </TabsContent>
          <TabsContent value="mentions" className="mt-0">
            <MentionsTab />
          </TabsContent>
          <TabsContent value="legal-cases" className="mt-0">
            <LegalCasesTab />
          </TabsContent>
          <TabsContent value="encyclopedia" className="mt-0">
            <EncyclopediaTab />
          </TabsContent>
          <TabsContent value="news-feed" className="mt-0">
            <NewsFeedTab />
          </TabsContent>
          <TabsContent value="risk-assessment" className="mt-0">
            <RiskAssessmentToolPlaceholder />
          </TabsContent>
          <TabsContent value="content-generation" className="mt-0">
            <ContentGenerationTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
