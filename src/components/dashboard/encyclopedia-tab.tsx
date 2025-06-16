
"use client";

import type { EncyclopediaEntry } from "@/types";
import { EncyclopediaCard } from "@/components/encyclopedia-card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Link as LinkIcon, ExternalLink } from "lucide-react"; // Added LinkIcon, ExternalLink
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card"; // Added CardDescription
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area"; // Added ScrollArea

const LOCAL_STORAGE_KEY = "encyclopediaEntries";

// Updated Mock Encyclopedia Entries for Kunwer Sachdev (person)
const initialMockEncyclopediaEntries: EncyclopediaEntry[] = [
  {
    id: "enc1",
    profileId: "profile1",
    section_title: "Biography Overview",
    content_markdown: "Kunwer Sachdev is known for his entrepreneurial ventures in the energy sector.\n\nKey Highlights:\n- Founded Su-Kam Power Systems\n- Contributions to inverter technology in India\n- Speaker on innovation and entrepreneurship",
    source_verified: true,
    disputed_flag: false,
    source_links: [{ title: "Kunwer Sachdev - Official Google Search", url: "https://g.co/kgs/PJj2Uru" }],
  },
  {
    id: "enc2",
    profileId: "profile1",
    section_title: "Major Achievements & Recognitions",
    content_markdown: "Throughout his career, Kunwer Sachdev has received several accolades for his work.\n\n- Ernst & Young Entrepreneur of the Year (Manufacturing) \n- India Today's 'Icons of Tomorrow'\n\nSome public discussions have questioned the early-stage market impact of certain innovations, though largely reviews are positive.",
    source_verified: true,
    disputed_flag: false,
    source_links: [
      { title: "Award News Archive", url: "https://awards.example/ks-archive" }, 
      { title: "Innovation Review Forum", url: "https://forum.example/ks-innovations" },
      { title: "Kunwer Sachdev - Official Google Search", url: "https://g.co/kgs/PJj2Uru" } // Example of a repeated link
    ],
  },
  {
    id: "enc3",
    profileId: "profile1",
    section_title: "Online Search Presence (Examples)",
    content_markdown: "This section is for collecting example search result links for 'Kunwer Sachdev' and its variations (e.g., Kunwar Sachdeva, Kuwer Sachdeva) from various search engines like Google, Bing, etc. In a live system, these might be automatically discovered. Use the 'Add Link' button on this card to manually add more relevant search result URLs you find. All unique links from this and other sections are aggregated in the 'All Unique Source Links' card above.",
    source_verified: false,
    disputed_flag: false,
    source_links: [
      { title: "Kunwer Sachdev - Google Search", url: "https://www.google.com/search?q=Kunwer+Sachdev" },
      { title: "Kunwer Sachdev - Bing Search", url: "https://www.bing.com/search?q=Kunwer+Sachdev" },
      { title: "Kunwer Sachdev - DuckDuckGo Search", url: "https://duckduckgo.com/?q=Kunwer+Sachdev" },
      { title: "Kunwer Sachdev - Brave Search", url: "https://search.brave.com/search?q=Kunwer+Sachdev" },
      { title: "Kunwer Sachdev - Yahoo Search", url: "https://search.yahoo.com/search?p=Kunwer+Sachdev" },
      { title: "Kunwer Sachdev - Startpage Search", url: "https://www.startpage.com/sp/search?query=Kunwer+Sachdev" },
      { title: "Kunwer Sachdev - Yandex Search", url: "https://yandex.com/search/?text=Kunwer+Sachdev" },
      { title: "Kunwer Sachdev - Baidu Search", url: "https://www.baidu.com/s?wd=Kunwer+Sachdev" },
      { title: "Kunwer Sachdev - Ecosia Search", url: "https://www.ecosia.org/search?q=Kunwer+Sachdev" },
      { title: "Kunwer Sachdev - Qwant Search", url: "https://www.qwant.com/?q=Kunwer+Sachdev" },
      { title: "Kunwer Sachdev - You.com Search", url: "https://you.com/search?q=Kunwer+Sachdev" },
    ],
  }
];

export function EncyclopediaTab() {
  const [entries, setEntries] = useState<EncyclopediaEntry[]>([]);
  const [allUniqueLinks, setAllUniqueLinks] = useState<{ title: string; url: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const storedEntries = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries));
    } else {
      setEntries(initialMockEncyclopediaEntries);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (entries.length > 0) {
      const collectedLinks: { title: string; url: string }[] = [];
      entries.forEach(entry => {
        if (entry.source_links) {
          collectedLinks.push(...entry.source_links);
        }
      });

      const uniqueLinksMap = new Map<string, { title: string; url: string }>();
      collectedLinks.forEach(link => {
        if (link.url && !uniqueLinksMap.has(link.url)) { 
          uniqueLinksMap.set(link.url, link);
        }
      });
      setAllUniqueLinks(Array.from(uniqueLinksMap.values()).sort((a, b) => (a.title || "").localeCompare(b.title || "")));
    } else {
      setAllUniqueLinks([]);
    }
  }, [entries]);


  const handleUpdateEntry = (updatedEntry: EncyclopediaEntry) => {
    const newEntries = entries.map(e => e.id === updatedEntry.id ? updatedEntry : e);
    setEntries(newEntries);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newEntries));
  };

  const handleAddEntry = () => {
    const newEntry: EncyclopediaEntry = {
      id: `enc${Date.now()}`, // Use timestamp for more unique ID
      profileId: "profile1",
      section_title: "New Custom Section",
      content_markdown: "Enter content here...",
      source_verified: false,
      disputed_flag: false,
      source_links: [],
    };
    const newEntries = [...entries, newEntry];
    setEntries(newEntries);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newEntries));
    toast({ title: "New Section Added", description: "A new encyclopedia section has been created." });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <div className="h-7 bg-muted rounded w-1/2 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-3/4 mt-1 animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="h-4 bg-muted rounded w-full animate-pulse mb-2"></div>
            <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
          </CardContent>
        </Card>
        {[...Array(2)].map((_, i) => ( // Keep some skeletons for sections
          <Card key={i} className="w-full shadow-lg">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-2/3 animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded w-full animate-pulse mb-2"></div>
              <div className="h-4 bg-muted rounded w-full animate-pulse mb-2"></div>
              <div className="h-4 bg-muted rounded w-4/5 animate-pulse"></div>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-4 justify-between">
              <div className="h-8 bg-muted rounded w-28 animate-pulse"></div>
              <div className="h-8 bg-muted rounded w-28 animate-pulse"></div>
              <div className="h-8 bg-muted rounded w-24 animate-pulse"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-headline">All Unique Source Links</CardTitle>
          <CardDescription>A collection of all unique links from your encyclopedia sections.</CardDescription>
        </CardHeader>
        <CardContent>
          {allUniqueLinks.length > 0 ? (
            <ScrollArea className="h-72 border rounded-md p-3">
              <ul className="space-y-2">
                {allUniqueLinks.map((link, index) => (
                  <li key={index} className="text-sm">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1.5 group"
                    >
                      <LinkIcon className="h-4 w-4 flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="truncate flex-grow" title={link.title || link.url}>
                        {link.title || new URL(link.url).hostname}
                      </span>
                      <ExternalLink className="h-3 w-3 flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          ) : (
            <p className="text-muted-foreground">No unique source links found across all sections.</p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center pt-4">
        <h2 className="text-2xl font-semibold font-headline tracking-tight">Encyclopedia Sections</h2>
        <Button onClick={handleAddEntry} aria-label="Add new encyclopedia section">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Section
        </Button>
      </div>
      
      {entries.length === 0 && !isLoading ? (
         <Card className="shadow-lg">
          <CardContent className="pt-6">
            <p>No encyclopedia entries have been created yet. Click "Add Section" to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {entries.map(entry => (
            <EncyclopediaCard key={entry.id} entry={entry} onUpdateEntry={handleUpdateEntry} />
          ))}
        </div>
      )}
    </div>
  );
}
    
