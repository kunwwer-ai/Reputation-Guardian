
"use client"; // Required for Tabs and client-side interactions

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from "@/components/dashboard/overview-tab";
import { MentionsTab } from "@/components/dashboard/mentions-tab";
import { LegalCasesTab } from "@/components/dashboard/legal-cases-tab";
import { EncyclopediaTab } from "@/components/dashboard/encyclopedia-tab";
import { NewsFeedTab } from "@/components/dashboard/news-feed-tab"; // Import new tab
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// Placeholder for RiskAssessmentTool and ContentGenerationTool components
function RiskAssessmentToolPlaceholder() {
  return <div className="p-4 border rounded-lg bg-card shadow"><h3 className="text-xl font-semibold">Risk Assessment Tool</h3><p className="text-muted-foreground">AI-powered scanning tool to analyze online mentions and legal cases, and assess their risk level. (Coming Soon)</p></div>;
}

function ContentGenerationToolPlaceholder() {
  return <div className="p-4 border rounded-lg bg-card shadow"><h3 className="text-xl font-semibold">Content Generation Tool</h3><p className="text-muted-foreground">Tool that summarizes content excerpts from mentions, and generate initial drafts of letters (DMCA, GDPR, etc.). (Coming Soon)</p></div>;
}

const validTabs = ["overview", "mentions", "legal-cases", "encyclopedia", "news-feed", "risk-assessment", "content-generation"];

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Sync tab state with URL hash
    const hash = window.location.hash.substring(1);
    if (hash && validTabs.includes(hash)) {
      setActiveTab(hash);
    }
    
    // Listen to hash changes
    const handleHashChange = () => {
      const newHash = window.location.hash.substring(1);
      if (newHash && validTabs.includes(newHash)) {
        setActiveTab(newHash);
      } else if (!newHash) {
        setActiveTab("overview"); // Default to overview if hash is removed
      }
    };
    window.addEventListener('hashchange', handleHashChange, false);
    return () => {
      window.removeEventListener('hashchange', handleHashChange, false);
    };

  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`/dashboard#${value}`, { scroll: false });
  };
  
  return (
    <div className="flex flex-col h-full">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full flex-grow flex flex-col">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-7 mb-4 shadow-sm sticky top-0 bg-background/90 backdrop-blur-sm z-10">
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
            <ContentGenerationToolPlaceholder />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
