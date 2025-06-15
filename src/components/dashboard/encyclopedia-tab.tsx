
"use client";

import type { EncyclopediaEntry } from "@/types";
import { EncyclopediaCard } from "@/components/encyclopedia-card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

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
    source_links: [{ title: "Award News Archive", url: "https://awards.example/ks-archive" }, { title: "Innovation Review Forum", url: "https://forum.example/ks-innovations" }],
  },
  {
    id: "enc3",
    profileId: "profile1",
    section_title: "Online Search Presence (Examples)",
    content_markdown: "This section provides example search result links from various search engines for Kunwer Sachdev. In a full implementation, these could be dynamically fetched or curated.\n\nNote: These are illustrative examples.",
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    const timer = setTimeout(() => {
      setEntries(initialMockEncyclopediaEntries);
      setIsLoading(false);
    }, 1400); 
    return () => clearTimeout(timer);
  }, []);


  const handleUpdateEntry = (updatedEntry: EncyclopediaEntry) => {
    setEntries(prevEntries => 
      prevEntries.map(e => e.id === updatedEntry.id ? updatedEntry : e)
    );
  };

  const handleAddEntry = () => {
    console.log("Add new encyclopedia entry clicked");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => ( // Adjusted for 3 entries
          <Card key={i} className="w-full shadow-lg">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-2/3 animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded w-full animate-pulse mb-2"></div>
              <div className="h-4 bg-muted rounded w-full animate-pulse mb-2"></div>
              <div className="h-4 bg-muted rounded w-4/5 animate-pulse"></div>
            </CardContent>
            <CardFooter className="flex gap-4">
              <div className="h-8 bg-muted rounded w-28 animate-pulse"></div>
              <div className="h-8 bg-muted rounded w-28 animate-pulse"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold font-headline tracking-tight">Encyclopedia Sections</h2>
        <Button onClick={handleAddEntry} aria-label="Add new encyclopedia section">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Section
        </Button>
      </div>
      
      {entries.length === 0 && !isLoading ? (
        <p>No encyclopedia entries found for this profile.</p>
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

