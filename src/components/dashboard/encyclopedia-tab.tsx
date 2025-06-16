
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

const LOCAL_STORAGE_KEY = "encyclopediaEntries_v8"; // Updated Key for new structure

// Updated Mock Encyclopedia Entries - Category-based structure
const initialMockEncyclopediaEntries: EncyclopediaEntry[] = [
  {
    id: "enc-all-search", // New ID for the general search section
    profileId: "profile1",
    section_title: "General Web Search - Kunwer Sachdev & Variations",
    content_markdown: "Collect links from various search engines (Google, Bing, DuckDuckGo, etc.) for 'Kunwer Sachdev' and its common spelling variations like 'Kunwar Sachdeva', 'Kuwer Sachdeva', 'Kumar Sachdeva'. This section is for a broad overview of search presence before categorizing.",
    source_verified: false,
    disputed_flag: false,
    source_links: [
      { title: "Example: Google Result - Kunwer Sachdev", url: "https://google.com/search?q=Kunwer+Sachdev+example+result+1" },
      { title: "Example: Bing Result - Kunwar Sachdeva", url: "https://bing.com/search?q=Kunwar+Sachdeva+example+result+2" },
    ],
  },
  {
    id: "enc-news",
    profileId: "profile1",
    section_title: "News Articles - Kunwer Sachdev",
    content_markdown: "Collection of news articles featuring Kunwer Sachdev, his work, or related topics. Add links from various news sources found via search engines or direct discovery.",
    source_verified: false,
    disputed_flag: false,
    source_links: [ 
      { title: "Example News: Forbes on Kunwer Sachdev", url: "https://www.forbes.com/example-kunwer-sachdev-news" },
    ],
  },
  {
    id: "enc-blogs",
    profileId: "profile1",
    section_title: "Blog Posts & Opinion Pieces - Kunwer Sachdev",
    content_markdown: "Links to blog posts, articles, and opinion pieces discussing Kunwer Sachdev. Note the source and any potential bias.",
    source_verified: false,
    disputed_flag: false,
    source_links: [
      { title: "Example Blog: Tech Blogger on Su-Kam", url: "https://techblog.example/su-kam-kunwer-sachdev" }
    ],
  },
  {
    id: "enc-youtube",
    profileId: "profile1",
    section_title: "YouTube Content - Kunwer Sachdev",
    content_markdown: "Videos featuring interviews, talks, documentaries, or discussions related to Kunwer Sachdev. Add YouTube links here.",
    source_verified: false,
    disputed_flag: false,
    source_links: [],
  },
  {
    id: "enc-podcasts",
    profileId: "profile1",
    section_title: "Podcast Appearances & Mentions - Kunwer Sachdev",
    content_markdown: "Collect links to podcast episodes where Kunwer Sachdev is a guest or is significantly discussed.",
    source_verified: false,
    disputed_flag: false,
    source_links: [],
  },
  {
    id: "enc-stories-features",
    profileId: "profile1",
    section_title: "Stories & In-depth Features - Kunwer Sachdev",
    content_markdown: "Links to long-form stories, biographical features, or detailed case studies involving Kunwer Sachdev.",
    source_verified: false,
    disputed_flag: false,
    source_links: [],
  },
  {
    id: "enc-books",
    profileId: "profile1",
    section_title: "Books & Publications - Kunwer Sachdev",
    content_markdown: "References to books authored by, about, or significantly featuring Kunwer Sachdev.",
    source_verified: false,
    disputed_flag: false,
    source_links: [],
  },
  {
    id: "enc-patents",
    profileId: "profile1",
    section_title: "Patents & Intellectual Property - Kunwer Sachdev",
    content_markdown: "Links to patent filings, discussions about intellectual property, or related technological innovations by Kunwer Sachdev.",
    source_verified: false,
    disputed_flag: false,
    source_links: [],
  },
  {
    id: "enc-legal-public",
    profileId: "profile1",
    section_title: "Public Legal Mentions & Filings - Kunwer Sachdev",
    content_markdown: "Collection of publicly accessible legal documents, case mentions, or official filings related to Kunwer Sachdev (distinct from the 'Legal Cases' tab which is for active case management).",
    source_verified: false,
    disputed_flag: false,
    source_links: [],
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
      section_title: "New Category (e.g., Social Media)",
      content_markdown: "Enter a description for this new category of links.",
      source_verified: false,
      disputed_flag: false,
      source_links: [],
    };
    const newEntries = [...entries, newEntry];
    setEntries(newEntries);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newEntries));
    toast({ title: "New Category Added", description: "A new link collection category has been created." });
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
            This section aggregates all unique URLs from your link collections below (e.g., News, Blogs, YouTube, etc.). Duplicates are automatically removed.
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
            <p className="text-muted-foreground">No unique source links found across all collections. Add links to the categories below to populate this list.</p>
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
      
      {filteredEntries.length === 0 && !isLoading ? (
         <Card className="shadow-lg">
          <CardContent className="pt-6">
            {searchQuery ? (
                <p>No link collections match your search for "{searchQuery}".</p>
            ) : (
                <p>No link collections have been created yet. Click "Add Collection" to get started, or populate the default collections.</p>
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
    

    

    

    