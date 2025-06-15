
"use client";

import type { Mention } from "@/types";
import { MentionCard } from "@/components/mention-card";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { initialMockMentions } from "./mentions-tab"; // Re-use mock data

export function NewsFeedTab() {
  const [newsItems, setNewsItems] = useState<Mention[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching and filtering data
    const timer = setTimeout(() => {
      const filteredNews = initialMockMentions.filter(
        (mention) => mention.source_type === "news"
      );
      setNewsItems(filteredNews);
      setIsLoading(false);
    }, 800); // Slightly different delay for visual distinction if needed
    return () => clearTimeout(timer);
  }, []);

  const handleUpdateNewsItem = (updatedItem: Mention) => {
    setNewsItems(prevItems => 
      prevItems.map(item => item.id === updatedItem.id ? updatedItem : item)
    );
    // In a real app, you might also update the master list of mentions
    // if this action should reflect elsewhere.
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(2)].map((_, i) => ( // Show 2 skeletons for news
          <Card key={i} className="w-full shadow-lg">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-1/2 mt-1 animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded w-full animate-pulse mb-2"></div>
              <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <div className="h-8 bg-muted rounded w-24 animate-pulse"></div>
              <div className="h-8 bg-muted rounded w-24 animate-pulse"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold font-headline tracking-tight">News Feed</h2>
        {/* Add filtering or sorting options here in the future if needed */}
      </div>
      
      {newsItems.length === 0 && !isLoading ? (
        <p>No news items found for this profile.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {/* Display news items, possibly with a slightly different card or layout if needed */}
          {/* For now, reusing MentionCard */}
          {newsItems.map(newsItem => (
            <MentionCard key={newsItem.id} mention={newsItem} onUpdateMention={handleUpdateNewsItem} />
          ))}
        </div>
      )}
    </div>
  );
}
