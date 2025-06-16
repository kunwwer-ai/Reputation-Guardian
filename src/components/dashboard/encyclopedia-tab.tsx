
"use client";

import type { EncyclopediaEntry } from "@/types";
import { EncyclopediaCard } from "@/components/encyclopedia-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Link as LinkIcon, ExternalLink, Search as SearchIcon } from "lucide-react"; 
import { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card"; 
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area"; 

const LOCAL_STORAGE_KEY = "encyclopediaEntries_v6"; // Updated Key for restructuring

// Updated Mock Encyclopedia Entries - Focused on Search Link Collection
const initialMockEncyclopediaEntries: EncyclopediaEntry[] = [
  {
    id: "web-search-monitoring",
    profileId: "profile1",
    section_title: "Web Search Monitoring - Kunwer Sachdev & Variations",
    content_markdown: "This section is for collecting links from various search engines (Google, Bing, DuckDuckGo, etc.) for 'Kunwer Sachdev' and its common variations (e.g., Kunwar Sachdeva, Kuwer Sachdeva, Kumar Sachdeva). Use 'Add Link' to manually add URLs found.",
    source_verified: false,
    disputed_flag: false,
    source_links: [ 
      { title: "Google Search: Kunwer Sachdev", url: "https://www.google.com/search?q=Kunwer+Sachdev" },
      { title: "Bing Search: Kunwar Sachdeva", url: "https://www.bing.com/search?q=Kunwar+Sachdeva" },
      { title: "DuckDuckGo Search: Kuwer Sachdeva", url: "https://duckduckgo.com/?q=Kuwer+Sachdeva" },
      { title: "Example Blog Post about Kumar Sachdeva", url: "https://exampleblog.com/kumar-sachdeva-insights" },
    ],
  },
  {
    id: "google-deep-dive",
    profileId: "profile1",
    section_title: "Google Search Deep Dive - 'Kunwer Sachdev'",
    content_markdown: "Dedicated collection of Google Search results specifically for the primary name 'Kunwer Sachdev'. Add more findings using the 'Add Link' button below. These links also contribute to the consolidated list at the top.",
    source_verified: false,
    disputed_flag: false,
    source_links: [ 
      { title: "Google Search: Kunwer Sachdev", url: "https://www.google.com/search?q=Kunwer+Sachdev" },
      { title: "Google Search Result: Forbes Profile - Kunwer Sachdev", url: "https://www.forbes.com/profile/kunwer-sachdev-example" },
      { title: "Google Search Result: TechCrunch Interview - Kunwer Sachdev", url: "https://techcrunch.com/2023/01/15/kunwer-sachdev-interview-example" },
      { title: "Google Search Result: Wired - Kunwer Sachdev's Innovations", url: "https://www.wired.com/story/kunwer-sachdev-innovations-example" },
      { title: "Google Search Result: Economic Times - The Su-Kam Story", url: "https://economictimes.indiatimes.com/kunwer-sachdev-sukam-story-example" },
      { title: "Google Search Result: YourStory - Kunwer Sachdev on Entrepreneurship", url: "https://yourstory.com/2022/11/kunwer-sachdev-entrepreneurship-tips-example" },
      { title: "Google Search Result: Business Standard - Visionary Leader", url: "https://www.business-standard.com/article/companies/kunwer-sachdev-visionary-leader-example-12345.html" },
      { title: "Google Search Result: IEEE Spectrum - Inverter Technology", url: "https://spectrum.ieee.org/kunwer-sachdev-inverter-technology-example" },
      { title: "Google Search Result: The Better India - Philanthropic Work", url: "https://www.thebetterindia.com/kunwer-sachdev-philanthropy-example/" },
      { title: "Google Search Result: Goodreads - 'The Inverter Man' Book Review", url: "https://www.goodreads.com/book/show/12345678-the-inverter-man-kunwer-sachdev-example" },
      { title: "Google Search Result: YouTube Channel - Kunwer Sachdev Example", url: "https://www.youtube.com/channel/UCexampleKunwerSachdev" },
      { title: "Google Search Result: Wikipedia (Draft) - Kunwer Sachdev", url: "https://en.wikipedia.org/wiki/Draft:Kunwer_Sachdev_Example" },
      { title: "Google Patents: Patent by Kunwer Sachdev", url: "https://patents.google.com/patent/US1234567B2/en?assignee=Kunwer+Sachdev&oq=Kunwer+Sachdev" },
      { title: "Google Scholar: Impact of Su-Kam Study Example", url: "https://scholar.google.com/scholar?q=impact+of+su-kam+kunwer+sachdev" },
      { title: "Google Search Result: LinkedIn Profile - Kunwer Sachdev", url: "https://www.linkedin.com/in/kunwersachdevexample/" },
      { title: "Google Images: Kunwer Sachdev Photos", url: "https://www.google.com/search?q=Kunwer+Sachdev&tbm=isch" },
      { title: "Google Books: 'Entrepreneurship Journey' by Kunwer Sachdev", url: "https://books.google.com/books?id=exampleBookId&q=Kunwer+Sachdev" },
      { title: "Google Shopping: Products by Kunwer Sachdev's Company (Example)", url: "https://www.google.com/search?q=Su-Kam+inverters&tbm=shop" },
      { title: "Google Maps: Su-Kam Power Systems HQ (Example)", url: "https://www.google.com/maps/search/Su-Kam+Power+Systems+Headquarters" }
    ],
  }
];

export function EncyclopediaTab() {
  const [entries, setEntries] = useState<EncyclopediaEntry[]>([]);
  const [allUniqueLinks, setAllUniqueLinks] = useState<{ title: string; url: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
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
      id: `enc${Date.now()}`, 
      profileId: "profile1",
      section_title: "New Search Collection (e.g., Bing)",
      content_markdown: "Enter a description or use this section to collect links from a specific source (e.g., Bing search results for 'Kunwer Sachdev').",
      source_verified: false,
      disputed_flag: false,
      source_links: [],
    };
    const newEntries = [...entries, newEntry];
    setEntries(newEntries);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newEntries));
    toast({ title: "New Collection Added", description: "A new link collection section has been created." });
  };

  const filteredEntries = useMemo(() => {
    if (!searchQuery) {
      return entries;
    }
    return entries.filter(entry =>
      entry.section_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content_markdown.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [entries, searchQuery]);

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
        <div className="relative mb-4">
          <div className="h-10 bg-muted rounded w-full animate-pulse"></div>
        </div>
        {[...Array(2)].map((_, i) => ( 
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
          <CardTitle className="text-xl font-headline">Consolidated Unique Source Links</CardTitle>
          <CardDescription>
            This section aggregates all unique URLs from your link collections below (e.g., Google Search, Web Monitoring, etc.). Duplicates are automatically removed.
          </CardDescription>
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
            <p className="text-muted-foreground">No unique source links found across all collections.</p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center pt-4">
        <h2 className="text-2xl font-semibold font-headline tracking-tight">Link Collections</h2>
        <Button onClick={handleAddEntry} aria-label="Add new link collection">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Collection (e.g., for Bing)
        </Button>
      </div>

      <div className="relative mb-4">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search link collections..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 shadow-sm"
        />
      </div>
      
      {filteredEntries.length === 0 && !isLoading ? (
         <Card className="shadow-lg">
          <CardContent className="pt-6">
            {searchQuery ? (
                <p>No link collections match your search for "{searchQuery}".</p>
            ) : (
                <p>No link collections have been created yet. Click "Add Collection" to get started.</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {filteredEntries.map(entry => (
            <EncyclopediaCard key={entry.id} entry={entry} onUpdateEntry={handleUpdateEntry} />
          ))}
        </div>
      )}
    </div>
  );
}
    

    