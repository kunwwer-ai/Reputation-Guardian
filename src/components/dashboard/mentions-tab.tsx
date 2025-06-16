
"use client";

import type { Mention, EncyclopediaSourceLink, EncyclopediaEntry } from "@/types";
import { MentionCard } from "@/components/mention-card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { useEncyclopediaContext } from "@/contexts/encyclopedia-context";

// Helper function to transform EncyclopediaSourceLink to Mention (can be shared or defined locally)
function transformSourceLinkToMention(
  sourceLink: EncyclopediaSourceLink,
  entry: EncyclopediaEntry // Pass the whole entry to infer source_type if needed
): Mention {
  let sourceType: Mention['source_type'] = 'other'; // Default
  const sectionTitleLower = entry.section_title.toLowerCase();

  if (sourceLink.source_type_override) {
    sourceType = sourceLink.source_type_override;
  } else if (sectionTitleLower.includes("news")) {
    sourceType = 'news';
  } else if (sectionTitleLower.includes("blog") || sectionTitleLower.includes("opinion")) {
    sourceType = 'social'; 
  } else if (sectionTitleLower.includes("youtube") || sectionTitleLower.includes("podcast")) {
    sourceType = 'social';
  } else if (sectionTitleLower.includes("search")) {
    sourceType = 'search_engine';
  } else if (sectionTitleLower.includes("legal")) {
    sourceType = 'legal';
  }

  return {
    id: sourceLink.id,
    profileId: entry.profileId, 
    source_type: sourceType,
    platform: sourceLink.platform || entry.section_title, // Specific platform or general section title
    url: sourceLink.url,
    title: sourceLink.title,
    content_excerpt: sourceLink.excerpt || "No excerpt available.",
    sentiment: sourceLink.sentiment,
    risk_color: sourceLink.risk_color,
    timestamp: sourceLink.timestamp ? new Date(sourceLink.timestamp) : new Date(), // Ensure Date object
    gpt_analysis: sourceLink.gpt_analysis,
    archived_evidence: sourceLink.archived_evidence,
    originalEntryId: entry.id,
    originalLinkId: sourceLink.id,
  };
}

// Define which encyclopedia sections contribute to the general "Mentions" tab
const MENTION_SOURCE_SECTION_IDS = [
  "enc-all-search", // General Web Search
  "enc-news",         // News Articles
  "enc-blogs",        // Blog Posts & Opinion Pieces
  "enc-youtube",      // YouTube Content
  "enc-podcasts",     // Podcast Appearances & Mentions
  "enc-stories-features" // Stories & In-depth Features
];

export function MentionsTab() {
  const { entries, updateLinkInSection } = useEncyclopediaContext();
  const [isLoading, setIsLoading] = useState(true);

  const mentions = useMemo(() => {
    const allMentions: Mention[] = [];
    entries.forEach(entry => {
      if (MENTION_SOURCE_SECTION_IDS.includes(entry.id) && entry.source_links) {
        entry.source_links.forEach(link => {
          allMentions.push(transformSourceLinkToMention(link, entry));
        });
      }
    });
    // Sort by timestamp, newest first
    return allMentions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [entries]);

  useEffect(() => {
    if (entries) {
      setIsLoading(false);
    }
  }, [entries]);

  const handleUpdateMention = (updatedMention: Mention) => {
    if (updatedMention.originalEntryId && updatedMention.originalLinkId) {
      const { originalEntryId, originalLinkId, profileId, source_type, ...linkDataToUpdate } = updatedMention;
      
      // Construct the update object for EncyclopediaSourceLink
      // Ensure we only pass fields that exist on EncyclopediaSourceLink
      const sourceLinkUpdate: Partial<EncyclopediaSourceLink> = {
        title: linkDataToUpdate.title,
        url: linkDataToUpdate.url,
        excerpt: linkDataToUpdate.content_excerpt,
        timestamp: linkDataToUpdate.timestamp,
        platform: linkDataToUpdate.platform, // This might need careful handling
        sentiment: linkDataToUpdate.sentiment,
        risk_color: linkDataToUpdate.risk_color,
        gpt_analysis: linkDataToUpdate.gpt_analysis,
        archived_evidence: linkDataToUpdate.archived_evidence,
      };
      updateLinkInSection(originalEntryId, originalLinkId, sourceLinkUpdate);
    }
  };

  const handleAddMention = () => {
    // This would ideally navigate the user to the Encyclopedia tab or open a dialog
    // to add a link to an appropriate Encyclopedia section.
    // For now, it's a placeholder.
    alert("To add a new mention, please go to the Encyclopedia tab and add a link to the relevant collection.");
    console.log("Add new mention clicked - user should be directed to add to Encyclopedia");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
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
        <h2 className="text-2xl font-semibold font-headline tracking-tight">Online Mentions</h2>
        <Button onClick={handleAddMention} aria-label="Add new mention">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Mention
        </Button>
      </div>
      
      {mentions.length === 0 ? (
        <p>No mentions found. Add links to relevant collections in the Encyclopedia tab (e.g., News, Blogs, Web Search).</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {mentions.map(mention => (
            <MentionCard key={`${mention.originalEntryId}-${mention.id}`} mention={mention} onUpdateMention={handleUpdateMention} />
          ))}
        </div>
      )}
    </div>
  );
}
