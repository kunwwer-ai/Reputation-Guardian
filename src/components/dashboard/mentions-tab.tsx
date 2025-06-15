
"use client";

import type { Mention, Profile } from "@/types";
import { MentionCard } from "@/components/mention-card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"; // Added for skeleton

// Mock Data Updated for Kunwer Sachdev
const MOCK_PROFILE: Profile = {
  id: "profile1",
  full_name: "Kunwer Sachdev", // Updated
  entity_type: "person",    // Updated
  reputation_score: 82,
  threat_level: "GREEN",
  verified: true,
  last_updated: new Date(),
};

const initialMockMentions: Mention[] = [
  {
    id: "mention1",
    profileId: "profile1",
    source_type: "news",
    platform: "Business Today",
    url: "https://businesstoday.example/kunwer-sachdev-interview",
    title: "Kunwer Sachdev on Future of Energy Solutions",
    content_excerpt: "In a recent interview, Kunwer Sachdev discussed the evolving landscape of energy solutions and his vision for sustainable power. He highlighted innovation as a key driver for the industry's growth. #KunwerSachdev #Energy",
    timestamp: new Date(Date.now() - 86400000 * 3), // 3 days ago
  },
  {
    id: "mention2",
    profileId: "profile1",
    source_type: "social",
    platform: "LinkedIn",
    url: "https://linkedin.example/post/kunwer-sachdev-award",
    title: "Discussion on Kunwer Sachdev's Recent Award",
    content_excerpt: "Great to see Kunwer Sachdev recognized for his contributions to entrepreneurship. His journey is an inspiration to many young innovators in the field. Many are congratulating him on this achievement.",
    timestamp: new Date(Date.now() - 86400000 * 7), // 7 days ago
  },
  {
    id: "mention3",
    profileId: "profile1",
    source_type: "search_engine",
    platform: "Google Search Result (Blog)",
    url: "https://techforum.example/kunwer-sachdev-innovations",
    title: "Exploring Kunwer Sachdev's Impact on Tech",
    content_excerpt: "This article delves into the technological advancements pioneered by Kunwer Sachdev. While mostly positive, some commentators discuss the challenges of scaling such innovations rapidly.",
    timestamp: new Date(Date.now() - 86400000 * 12), // 12 days ago
  },
];


export function MentionsTab() {
  const [mentions, setMentions] = useState<Mention[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    const timer = setTimeout(() => {
      setMentions(initialMockMentions);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleUpdateMention = (updatedMention: Mention) => {
    setMentions(prevMentions => 
      prevMentions.map(m => m.id === updatedMention.id ? updatedMention : m)
    );
  };

  const handleAddMention = () => {
    console.log("Add new mention clicked");
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
      
      {mentions.length === 0 && !isLoading ? (
        <p>No mentions found for this profile.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {mentions.map(mention => (
            <MentionCard key={mention.id} mention={mention} onUpdateMention={handleUpdateMention} />
          ))}
        </div>
      )}
    </div>
  );
}

