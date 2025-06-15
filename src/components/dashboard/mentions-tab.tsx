
"use client";

import type { Mention, Profile } from "@/types";
import { MentionCard } from "@/components/mention-card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState, useEffect } from "react";

// Mock Data - in a real app, this would come from a backend/API
const MOCK_PROFILE: Profile = {
  id: "profile1",
  full_name: "John Doe Inc.",
  entity_type: "company",
  reputation_score: 75,
  threat_level: "YELLOW",
  verified: true,
  last_updated: new Date(),
};

const initialMockMentions: Mention[] = [
  {
    id: "mention1",
    profileId: "profile1",
    source_type: "social",
    platform: "Twitter",
    url: "https://twitter.com/example/status/123",
    title: "Negative Feedback on Twitter",
    content_excerpt: "Just had a terrible experience with John Doe Inc. Their customer service is awful and the product broke after one day. Would not recommend to anyone. #JohnDoeInc #BadService",
    timestamp: new Date(Date.now() - 86400000 * 2), // 2 days ago
  },
  {
    id: "mention2",
    profileId: "profile1",
    source_type: "news",
    platform: "Tech News Daily",
    url: "https://technewsdaily.com/article/john-doe-inc-new-product",
    title: "John Doe Inc. Launches Innovative New Product",
    content_excerpt: "John Doe Inc. today announced the launch of their new flagship product, which promises to revolutionize the industry. Early reviews are positive, citing its ease of use and powerful features. This could be a game changer for the company.",
    timestamp: new Date(Date.now() - 86400000 * 5), // 5 days ago
  },
  {
    id: "mention3",
    profileId: "profile1",
    source_type: "search_engine",
    platform: "Google Search Result (Blog)",
    url: "https://randomblog.com/john-doe-inc-review",
    title: "Honest Review of John Doe Inc. Services",
    content_excerpt: "I've been using John Doe Inc.'s services for the past six months. While there are some good aspects, there are also areas for improvement. The pricing is fair, but I've encountered a few bugs. Overall, a mixed experience.",
    timestamp: new Date(Date.now() - 86400000 * 10), // 10 days ago
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

  // TODO: Implement Add Mention functionality
  const handleAddMention = () => {
    console.log("Add new mention clicked");
    // This would typically open a dialog or navigate to a form
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
