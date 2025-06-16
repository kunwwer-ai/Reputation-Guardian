
"use client";

import type { LegalCase, Profile, Mention } from "@/types";
import { LegalCaseCard } from "@/components/legal-case-card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

// Mock Data Updated for Kunwer Sachdev
const MOCK_PROFILE: Profile = {
  id: "profile1",
  full_name: "Kunwer Sachdev", 
  entity_type: "person",    
  reputation_score: 82,
  threat_level: "ORANGE", 
  verified: true,
  last_updated: new Date(),
};

const initialMockLegalCases: LegalCase[] = [
  {
    id: "lc1",
    profileId: "profile1",
    case_id: "KS-IP-2023-007", 
    court: "Tech Patent Tribunal",
    case_status: "Potential",
    risk_color: "🟠", 
    filing_date: new Date("2023-11-05"),
    summary: "Potential intellectual property dispute regarding a new energy storage patent. Preliminary discussions underway.",
    documents: [{ name: "Patent Application Preview.pdf", url: "#doc1" }, { name: "Initial Correspondence.pdf", url: "#doc2" }],
    removal_status: "Not Applicable",
    last_action_date: new Date("2024-02-15"),
  },
  {
    id: "lc2",
    profileId: "profile1",
    case_id: "DMCA-KS2024-002", 
    court: "DMCA Takedown Request",
    case_status: "Settled", 
    risk_color: "🟢",
    filing_date: new Date("2024-01-20"),
    summary: "DMCA takedown notice sent for unauthorized use of Kunwer Sachdev's interview footage on a third-party video platform.",
    removal_status: "Successful",
    last_action_date: new Date("2024-02-05"),
    associated_mention_id: "mention_video_infringement", 
  },
];

const MOCK_MENTIONS: Mention[] = [ 
   {
    id: "mention_video_infringement",
    profileId: "profile1",
    source_type: "other", 
    platform: "VideoShare Platform",
    url: "https://videoshare.example/kunwer-sachdev-unauthorized-clip", 
    title: "Unauthorized Clip of Kunwer Sachdev Interview",
    content_excerpt: "This video channel posted a 10-minute segment from Kunwer Sachdev's recent keynote without any permission or credit...",
    timestamp: new Date(Date.now() - 86400000 * 20), 
  },
];

export function LegalCasesTab() {
  const [legalCases, setLegalCases] = useState<LegalCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLegalCases(initialMockLegalCases);
      setIsLoading(false);
    }, 1200); 
    return () => clearTimeout(timer);
  }, []);


  const handleUpdateCase = (updatedCase: LegalCase) => {
    setLegalCases(prevCases => 
      prevCases.map(c => c.id === updatedCase.id ? updatedCase : c)
    );
  };

  const handleAddLegalCase = () => {
    console.log("Add new legal case clicked");
  };

  if (isLoading) {
     return (
      <div className="space-y-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="w-full shadow-lg">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-1/2 animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-1/3 mt-1 animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded w-full animate-pulse mb-2"></div>
              <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <div className="h-8 bg-muted rounded w-32 animate-pulse"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold font-headline tracking-tight">Legal Cases</h2>
        <Button onClick={handleAddLegalCase} aria-label="Add new legal case">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Legal Case
        </Button>
      </div>
      
      {legalCases.length === 0 && !isLoading ? (
        <p>No legal cases found for this profile.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {legalCases.map(lc => {
            const linkedMention = MOCK_MENTIONS.find(m => m.id === lc.associated_mention_id);
            return (
              <LegalCaseCard 
                key={lc.id} 
                legalCase={lc} 
                profile={MOCK_PROFILE} 
                linkedMention={linkedMention}
                onUpdateCase={handleUpdateCase} 
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
