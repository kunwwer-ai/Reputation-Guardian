
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
import { PhotoGalleryTab } from "@/components/dashboard/photo-gallery-tab"; // Updated import
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { EncyclopediaEntry, EncyclopediaSourceLink } from "@/types";
import { EncyclopediaContext } from "@/contexts/encyclopedia-context";
import { initialMockEncyclopediaEntries, LOCAL_STORAGE_KEY_ENCYCLOPEDIA } from "@/components/dashboard/encyclopedia-tab-data";


function RiskAssessmentToolPlaceholder() {
  return <div className="p-4 border rounded-lg bg-card shadow"><h3 className="text-xl font-semibold">Risk Assessment Tool</h3><p className="text-muted-foreground">AI-powered scanning tool to analyze online mentions and legal cases, and assess their risk level. (Coming Soon)</p></div>;
}

const validTabs = ["overview", "mentions", "legal-cases", "encyclopedia", "news-feed", "analytics", "content-generation", "risk-assessment", "photo-gallery", "settings"]; // Updated "photos" to "photo-gallery"

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [encyclopediaEntries, setEncyclopediaEntries] = useState<EncyclopediaEntry[]>([]);
  const [isEncyclopediaLoading, setIsEncyclopediaLoading] = useState(true);

  useEffect(() => {
    const storedEntries = localStorage.getItem(LOCAL_STORAGE_KEY_ENCYCLOPEDIA);
    if (storedEntries) {
      try {
        const parsedEntries = JSON.parse(storedEntries);
        // Ensure timestamps are Date objects
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


  useEffect(() => {
    const syncTabWithHash = () => {
      const currentUrlHash = window.location.hash.substring(1);
      if (currentUrlHash && validTabs.includes(currentUrlHash)) {
        if (activeTab !== currentUrlHash) {
          setActiveTab(currentUrlHash);
        }
      } else {
        if (activeTab !== "overview" && window.location.pathname === '/dashboard') {
          setActiveTab("overview");
          router.replace('/dashboard#overview', { scroll: false });
        }
      }
    };
    syncTabWithHash(); 
    window.addEventListener('hashchange', syncTabWithHash, false);
    return () => {
      window.removeEventListener('hashchange', syncTabWithHash, false);
    };
  }, [router, activeTab]);

  const handleTabChange = (value: string) => {
     if (activeTab !== value) { 
      setActiveTab(value); 
      router.push(`/dashboard#${value}`, { scroll: false }); 
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
              source_links: (entry.source_links || []).map(link =>
                link.id === linkId ? { ...link, ...updatedLinkData } : link
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
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 xl:grid-cols-10 gap-1 mb-6 shadow-sm sticky top-0 bg-background/90 backdrop-blur-sm z-10 p-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="mentions">Mentions</TabsTrigger>
            <TabsTrigger value="legal-cases">Legal Cases</TabsTrigger>
            <TabsTrigger value="encyclopedia">Encyclopedia</TabsTrigger>
            <TabsTrigger value="news-feed">News Feed</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="content-generation">Content Generation</TabsTrigger>
            <TabsTrigger value="risk-assessment">Risk Assessment</TabsTrigger>
            <TabsTrigger value="photo-gallery">Photo Gallery</TabsTrigger> {/* Updated Trigger */}
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <div className="flex-grow overflow-y-auto pb-10">
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
            <TabsContent value="photo-gallery" className="mt-0"> {/* Updated Content */}
              {!isEncyclopediaLoading && <PhotoGalleryTab />}
            </TabsContent>
            <TabsContent value="settings" className="mt-0">
              <SettingsTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </EncyclopediaContext.Provider>
  );
}
