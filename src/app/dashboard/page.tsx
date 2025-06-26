
"use client"; 

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from "@/components/dashboard/overview-tab";
import { MentionsTab } from "@/components/dashboard/mentions-tab";
import { LegalCasesTab } from "@/components/dashboard/legal-cases-tab";
import { EncyclopediaTab } from "@/components/dashboard/encyclopedia-tab";
import { NewsFeedTab } from "@/components/dashboard/news-feed-tab";
import { AnalyticsTab } from "@/components/dashboard/analytics-tab";
import { ContentGenerationTab } from "@/components/dashboard/content-generation-tab";
import { SettingsTab } from "@/components/dashboard/settings-tab";
import { PhotoGalleryTab } from "@/components/dashboard/photo-gallery-tab";
import { ScrapingTab } from "@/components/dashboard/scraping-tab";
import { useState, useEffect, useRef } from "react"; // Added useRef
import { useRouter } from "next/navigation";
import type { EncyclopediaEntry, EncyclopediaSourceLink } from "@/types";
import { EncyclopediaContext } from "@/contexts/encyclopedia-context";
import { initialMockEncyclopediaEntries, LOCAL_STORAGE_KEY_ENCYCLOPEDIA } from "@/components/dashboard/encyclopedia-tab-data";


function RiskAssessmentToolPlaceholder() {
  return <div className="p-4 border rounded-lg bg-card shadow"><h3 className="text-xl font-semibold">Risk Assessment Tool</h3><p className="text-muted-foreground">AI-powered scanning tool to analyze online mentions and legal cases, and assesses their risk level. (Coming Soon)</p></div>;
}

const validTabs = ["overview", "mentions", "legal-cases", "encyclopedia", "news-feed", "analytics", "content-generation", "risk-assessment", "photo-gallery", "settings", "scraping"];

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview"); 
  const [encyclopediaEntries, setEncyclopediaEntries] = useState<EncyclopediaEntry[]>([]);
  const [isEncyclopediaLoading, setIsEncyclopediaLoading] = useState(true);

  // Ref to hold the current activeTab value for use in useEffect without causing re-runs
  const activeTabRef = useRef(activeTab);
  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  useEffect(() => {
    const storedEntries = localStorage.getItem(LOCAL_STORAGE_KEY_ENCYCLOPEDIA);
    if (storedEntries) {
      try {
        const parsedEntries = JSON.parse(storedEntries);
        const entriesWithDates = parsedEntries.map((entry: EncyclopediaEntry) => ({
          ...entry,
          source_links: entry.source_links?.map(link => ({
            ...link,
            timestamp: link.timestamp ? new Date(link.timestamp) : undefined,
          })) || [],
        }));
        setEncyclopediaEntries(entriesWithDates);
      } catch (error) {
        console.error("Error parsing encyclopedia entries from localStorage:", error);
        setEncyclopediaEntries(initialMockEncyclopediaEntries.map(entry => ({
          ...entry,
          source_links: entry.source_links?.map(link => ({
            ...link,
            timestamp: link.timestamp ? new Date(link.timestamp) : undefined,
          })) || [],
        })));
      }
    } else {
       setEncyclopediaEntries(initialMockEncyclopediaEntries.map(entry => ({
          ...entry,
          source_links: entry.source_links?.map(link => ({
            ...link,
            timestamp: link.timestamp ? new Date(link.timestamp) : undefined,
          })) || [],
        })));
    }
    setIsEncyclopediaLoading(false);
  }, []);

  useEffect(() => {
    if (!isEncyclopediaLoading) {
      localStorage.setItem(LOCAL_STORAGE_KEY_ENCYCLOPEDIA, JSON.stringify(encyclopediaEntries));
    }
  }, [encyclopediaEntries, isEncyclopediaLoading]);


  // Effect for initializing tab from URL and handling external hash changes
  useEffect(() => {
    const handleHash = () => {
      const currentUrlHash = window.location.hash.substring(1);
      if (currentUrlHash && validTabs.includes(currentUrlHash)) {
        // If hash is valid and different from current activeTab (via ref), update activeTab
        if (activeTabRef.current !== currentUrlHash) {
          setActiveTab(currentUrlHash);
        }
      } else if (window.location.pathname === '/dashboard') {
        // If hash is invalid or missing on dashboard, default to overview
        if (activeTabRef.current !== "overview") {
          setActiveTab("overview");
        }
        // Ensure URL hash reflects "overview" if it's not already correct
        if (window.location.hash !== "#overview") {
          router.replace('/dashboard#overview', { scroll: false });
        }
      }
    };

    handleHash(); // Sync on initial mount

    window.addEventListener('hashchange', handleHash);
    return () => {
      window.removeEventListener('hashchange', handleHash);
    };
  }, [router]); // Only depends on router (for .replace) and validTabs (which is stable outside)


  const handleTabChange = (newTabValue: string) => {
    if (validTabs.includes(newTabValue) && activeTab !== newTabValue) {
      setActiveTab(newTabValue); // Update internal React state
      router.push(`/dashboard#${newTabValue}`, { scroll: false }); // Update URL hash
    }
  };

  const addLinkToEntry = (entryId: string, link: EncyclopediaSourceLink) => {
    setEncyclopediaEntries(prevEntries =>
      prevEntries.map(entry =>
        entry.id === entryId
          ? { ...entry, source_links: [...(entry.source_links || []), link] }
          : entry
      )
    );
  };

  const updateLinkInSection = (entryId: string, linkId: string, updatedLinkData: Partial<EncyclopediaSourceLink>) => {
    setEncyclopediaEntries(prevEntries =>
      prevEntries.map(entry =>
        entry.id === entryId
          ? {
              ...entry,
              source_links: (entry.source_links || []).map(l =>
                l.id === linkId ? { ...l, ...updatedLinkData } : l
              ),
            }
          : entry
      )
    );
  };
  
  const addEncyclopediaEntry = (newEntry: EncyclopediaEntry) => {
    setEncyclopediaEntries(prevEntries => [...prevEntries, newEntry]);
  };

  const updateEncyclopediaEntry = (updatedEntry: EncyclopediaEntry) => {
    setEncyclopediaEntries(prevEntries =>
      prevEntries.map(e => (e.id === updatedEntry.id ? updatedEntry : e))
    );
  };


  return (
    <EncyclopediaContext.Provider value={{ 
        entries: encyclopediaEntries, 
        setEntries: setEncyclopediaEntries, 
        addLinkToEntry, 
        updateLinkInSection,
        addEncyclopediaEntry,
        updateEncyclopediaEntry
      }}>
      <div className="flex flex-col h-full">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full flex-grow flex flex-col">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 xl:grid-cols-11 gap-1 shadow-sm bg-background/90 p-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="mentions">Mentions</TabsTrigger>
            <TabsTrigger value="legal-cases">Legal Cases</TabsTrigger>
            <TabsTrigger value="encyclopedia">Encyclopedia</TabsTrigger>
            <TabsTrigger value="news-feed">News Feed</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="content-generation">Content Generation</TabsTrigger>
            <TabsTrigger value="risk-assessment">Risk Assessment</TabsTrigger>
            <TabsTrigger value="photo-gallery">Photo Gallery</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="scraping">Scraping</TabsTrigger>
          </TabsList>

          <div className="flex-grow overflow-y-auto pb-10 mt-6">
            <TabsContent value="overview" className="mt-0">
              <OverviewTab />
            </TabsContent>
            <TabsContent value="mentions" className="mt-0">
              {!isEncyclopediaLoading && <MentionsTab />}
            </TabsContent>
            <TabsContent value="legal-cases" className="mt-0">
              <LegalCasesTab />
            </TabsContent>
            <TabsContent value="encyclopedia" className="mt-0">
             {!isEncyclopediaLoading && <EncyclopediaTab entries={encyclopediaEntries} setEntries={setEncyclopediaEntries} />}
            </TabsContent>
            <TabsContent value="news-feed" className="mt-0">
              {!isEncyclopediaLoading && <NewsFeedTab />}
            </TabsContent>
            <TabsContent value="analytics" className="mt-0">
              {!isEncyclopediaLoading && <AnalyticsTab />}
            </TabsContent>
            <TabsContent value="content-generation" className="mt-0">
              {!isEncyclopediaLoading && <ContentGenerationTab />}
            </TabsContent>
            <TabsContent value="risk-assessment" className="mt-0">
              <RiskAssessmentToolPlaceholder />
            </TabsContent>
            <TabsContent value="photo-gallery" className="mt-0">
              {!isEncyclopediaLoading && <PhotoGalleryTab />}
            </TabsContent>
            <TabsContent value="settings" className="mt-0">
              <SettingsTab />
            </TabsContent>
            <TabsContent value="scraping" className="mt-0">
              {!isEncyclopediaLoading && <ScrapingTab />}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </EncyclopediaContext.Provider>
  );
}
