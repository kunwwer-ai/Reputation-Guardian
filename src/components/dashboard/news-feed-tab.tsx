
"use client";

import type { Mention, EncyclopediaSourceLink } from "@/types";
import { MentionCard } from "@/components/mention-card";
import { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { useEncyclopediaContext } from "@/contexts/encyclopedia-context";

// Helper function to transform EncyclopediaSourceLink to Mention
function transformSourceLinkToMention(
  sourceLink: EncyclopediaSourceLink,
  entryId: string,
  sectionTitle: string
): Mention {
  let sourceType: Mention['source_type'] = 'other';
  if (sectionTitle.toLowerCase().includes("news")) {
    sourceType = 'news';
  } else if (sectionTitle.toLowerCase().includes("blog") || sectionTitle.toLowerCase().includes("opinion")) {
    sourceType = 'social'; // Or 'other', depending on preference
  } else if (sectionTitle.toLowerCase().includes("youtube") || sectionTitle.toLowerCase().includes("podcast")) {
    sourceType = 'social'; // Or 'other'
  } else if (sectionTitle.toLowerCase().includes("search")) {
    sourceType = 'search_engine';
  }

  return {
    id: sourceLink.id, // Use source link's ID
    profileId: "profile1", // Default or from context if available
    source_type: sourceLink.source_type_override || sourceType,
    platform: sourceLink.platform || sectionTitle, // Use specific platform if available, else section title
    url: sourceLink.url,
    title: sourceLink.title,
    content_excerpt: sourceLink.excerpt || "No excerpt available.",
    sentiment: sourceLink.sentiment,
    risk_color: sourceLink.risk_color,
    timestamp: sourceLink.timestamp ? new Date(sourceLink.timestamp) : new Date(),
    gpt_analysis: sourceLink.gpt_analysis,
    archived_evidence: sourceLink.archived_evidence,
    originalEntryId: entryId,
    originalLinkId: sourceLink.id,
  };
}


export function NewsFeedTab() {
  const { entries, updateLinkInSection } = useEncyclopediaContext();
  const [isLoading, setIsLoading] = useState(true); // Keep local loading for initial render consistency

  const newsItems = useMemo(() => {
    const newsSection = entries.find(entry => entry.id === "enc-news"); // Assuming "enc-news" is the ID for "News Articles"
    if (newsSection && newsSection.source_links) {
      return newsSection.source_links.map(link => 
        transformSourceLinkToMention(link, newsSection.id, newsSection.section_title)
      ).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); // Sort newest first
    }
    return [];
  }, [entries]);

  useEffect(() => {
    // If entries are loaded (even if empty), loading is done for this tab's perspective
    if (entries) {
      setIsLoading(false);
    }
  }, [entries]);


  const handleUpdateNewsItem = (updatedMention: Mention) => {
    if (updatedMention.originalEntryId && updatedMention.originalLinkId) {
      const { originalEntryId, originalLinkId, profileId, source_type, ...linkDataToUpdate } = updatedMention;
      
      // Construct the update object for EncyclopediaSourceLink
      const sourceLinkUpdate: Partial<EncyclopediaSourceLink> = {
        title: linkDataToUpdate.title,
        url: linkDataToUpdate.url,
        excerpt: linkDataToUpdate.content_excerpt,
        timestamp: linkDataToUpdate.timestamp,
        platform: linkDataToUpdate.platform, // This might need careful handling if platform was derived
        sentiment: linkDataToUpdate.sentiment,
        risk_color: linkDataToUpdate.risk_color,
        gpt_analysis: linkDataToUpdate.gpt_analysis,
        archived_evidence: linkDataToUpdate.archived_evidence,
      };
      updateLinkInSection(originalEntryId, originalLinkId, sourceLinkUpdate);
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
           <div className="h-8 bg-muted rounded w-40 animate-pulse"></div>
        </div>
        {[...Array(2)].map((_, i) => (
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
      </div>
      
      {newsItems.length === 0 ? (
         <Card className="shadow-lg">
          <CardContent className="pt-6">
            <p className="text-muted-foreground">No news items found. Add links to the "News Articles" collection in the Encyclopedia tab.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {newsItems.map(newsItem => (
            <MentionCard key={`${newsItem.originalEntryId}-${newsItem.id}`} mention={newsItem} onUpdateMention={handleUpdateNewsItem} />
          ))}
        </div>
      )}
    </div>
  );
}

