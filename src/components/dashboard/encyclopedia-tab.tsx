
"use client";

import type { EncyclopediaEntry, EncyclopediaSourceLink } from "@/types";
import { EncyclopediaCard } from "@/components/encyclopedia-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Link as LinkIcon, ExternalLink, Search as SearchIcon } from "lucide-react"; 
import { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"; 
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area"; 
import { useEncyclopediaContext } from "@/contexts/encyclopedia-context";
// initialMockEncyclopediaEntries and LOCAL_STORAGE_KEY_ENCYCLOPEDIA are now managed in DashboardPage and a separate data file

interface EncyclopediaTabProps {
  entries: EncyclopediaEntry[];
  setEntries: React.Dispatch<React.SetStateAction<EncyclopediaEntry[]>>;
  // isLoading prop might be useful if DashboardPage handles global loading state
}

export function EncyclopediaTab({ entries: propEntries, setEntries: propSetEntries }: EncyclopediaTabProps) {
  // Use the context for updates, but props for initial render if dashboard is master
  const { 
    entries: contextEntries, 
    setEntries: contextSetEntries,
    addEncyclopediaEntry: contextAddEntry,
    updateEncyclopediaEntry: contextUpdateEntry
  } = useEncyclopediaContext();

  // Decide which entries to use: props if available, otherwise context. This handles initial load from DashboardPage.
  const entries = propEntries.length > 0 ? propEntries : contextEntries;
  const setEntries = propSetEntries || contextSetEntries;


  const [allUniqueLinks, setAllUniqueLinks] = useState<{ title: string; url: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true); // Local loading for initial UI elements if needed

  useEffect(() => {
    // Data loading from localStorage is now handled in DashboardPage.
    // This effect now primarily recalculates unique links when entries change.
    if (entries.length > 0) {
      const collectedLinks: { title: string; url: string }[] = [];
      entries.forEach(entry => {
        if (entry.source_links) {
          entry.source_links.forEach(link => collectedLinks.push({ title: link.title, url: link.url }));
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
    setIsLoading(false); // Set local loading to false once entries are processed
  }, [entries]);


  const handleUpdateEntry = (updatedEntry: EncyclopediaEntry) => {
    // Use the context's update function which updates DashboardPage's state
    contextUpdateEntry(updatedEntry);
  };

  const handleAddEntry = () => {
    const newEntry: EncyclopediaEntry = {
      id: `enc-${Date.now()}`, 
      profileId: "profile1",
      section_title: "New Category (e.g., Social Media)",
      content_markdown: "Enter a description for this new category of links.",
      source_verified: false,
      disputed_flag: false,
      source_links: [],
    };
    contextAddEntry(newEntry); // Use context's add function
    toast({ title: "New Collection Added", description: "A new link collection has been created." });
  };

  const filteredEntries = useMemo(() => {
    if (!searchQuery) {
      return entries;
    }
    return entries.filter(entry =>
      entry.section_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content_markdown.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entry.source_links && entry.source_links.some(link => link.title.toLowerCase().includes(searchQuery.toLowerCase()) || link.url.toLowerCase().includes(searchQuery.toLowerCase())))
    );
  }, [entries, searchQuery]);
  
  // Skeleton logic might need adjustment if global loading state is preferred from DashboardPage
  if (isLoading && entries.length === 0) { // Show skeleton only if truly no data yet
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
            <CardHeader><div className="h-6 bg-muted rounded w-2/3 animate-pulse"></div></CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded w-full animate-pulse mb-2"></div>
              <div className="h-4 bg-muted rounded w-full animate-pulse mb-2"></div>
              <div className="h-4 bg-muted rounded w-4/5 animate-pulse"></div>
            </CardContent>
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
            This section aggregates all unique URLs from your link collections below. Duplicates are automatically removed.
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
            <p className="text-muted-foreground">No unique source links found. Add links to the collections below.</p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center pt-4">
        <h2 className="text-2xl font-semibold font-headline tracking-tight">Link Collections</h2>
        <Button onClick={handleAddEntry} aria-label="Add new link collection">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Collection
        </Button>
      </div>

      <div className="relative mb-4">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search link collections (titles, descriptions, or link content)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 shadow-sm"
        />
      </div>
      
      {filteredEntries.length === 0 ? (
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
