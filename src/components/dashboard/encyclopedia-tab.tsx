
"use client";

import type { EncyclopediaEntry } from "@/types";
import { EncyclopediaCard } from "@/components/encyclopedia-card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";


const initialMockEncyclopediaEntries: EncyclopediaEntry[] = [
  {
    id: "enc1",
    profileId: "profile1",
    section_title: "Company History",
    content_markdown: "John Doe Inc. was founded in 2010 by John Doe with the mission to...\n\nKey Milestones:\n- 2012: Launched first product\n- 2015: Secured Series A funding\n- 2020: Expanded to international markets",
    source_verified: true,
    disputed_flag: false,
    source_links: [{ title: "Official About Us Page", url: "https://example.com/about" }],
  },
  {
    id: "enc2",
    profileId: "profile1",
    section_title: "Controversies and Criticisms",
    content_markdown: "In 2018, John Doe Inc. faced criticism regarding data privacy concerns. An article published by TechTimes highlighted potential issues...\n\nResponse from company: John Doe Inc. released a statement addressing the concerns and outlining steps taken to improve data security.",
    source_verified: false,
    disputed_flag: true,
    source_links: [{ title: "TechTimes Article", url: "https://techtimes.example/article-xyz" }, { title: "Company Statement", url: "https://example.com/press-release-privacy" }],
  },
];

export function EncyclopediaTab() {
  const [entries, setEntries] = useState<EncyclopediaEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    const timer = setTimeout(() => {
      setEntries(initialMockEncyclopediaEntries);
      setIsLoading(false);
    }, 1400); // Slightly different delay
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
