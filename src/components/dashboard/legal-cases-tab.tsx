
"use client";

import type { LegalCase, Profile, Mention } from "@/types";
import { LegalCaseCard } from "@/components/legal-case-card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

// Mock Data
const MOCK_PROFILE: Profile = {
  id: "profile1",
  full_name: "John Doe Inc.",
  entity_type: "company",
  reputation_score: 75,
  threat_level: "YELLOW",
  verified: true,
  last_updated: new Date(),
};

const initialMockLegalCases: LegalCase[] = [
  {
    id: "lc1",
    profileId: "profile1",
    case_id: "JD-C2023-001",
    court: "Northern District Court",
    case_status: "Active",
    risk_color: "🔴",
    filing_date: new Date("2023-05-15"),
    summary: "Lawsuit filed regarding patent infringement claims by Competitor X. Ongoing discovery phase.",
    documents: [{ name: "Initial Filing.pdf", url: "#doc1" }, { name: "Evidence Exhibit A.pdf", url: "#doc2" }],
    removal_status: "Not Applicable",
    last_action_date: new Date("2024-01-20"),
  },
  {
    id: "lc2",
    profileId: "profile1",
    case_id: "DMCA-T2024-045",
    court: "DMCA Takedown Request",
    case_status: "Settled", // Assuming this means content removed
    risk_color: "🟢",
    filing_date: new Date("2024-02-10"),
    summary: "DMCA takedown notice sent for unauthorized use of copyrighted marketing materials on a third-party blog.",
    removal_status: "Successful",
    last_action_date: new Date("2024-02-25"),
    associated_mention_id: "mention3", // Corresponds to a mock mention
  },
];

const MOCK_MENTIONS: Mention[] = [ // To link with legal cases
   {
    id: "mention3",
    profileId: "profile1",
    source_type: "search_engine",
    platform: "Google Search Result (Blog)",
    url: "https://randomblog.com/john-doe-inc-review", // This URL is infringing
    title: "Honest Review of John Doe Inc. Services (Unauthorized Content)",
    content_excerpt: "This blog post copied large sections of our official whitepaper without permission...",
    timestamp: new Date(Date.now() - 86400000 * 10),
  },
];

export function LegalCasesTab() {
  const [legalCases, setLegalCases] = useState<LegalCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    const timer = setTimeout(() => {
      setLegalCases(initialMockLegalCases);
      setIsLoading(false);
    }, 1200); // Slightly different delay
    return () => clearTimeout(timer);
  }, []);


  const handleUpdateCase = (updatedCase: LegalCase) => {
    setLegalCases(prevCases => 
      prevCases.map(c => c.id === updatedCase.id ? updatedCase : c)
    );
  };

  // TODO: Implement Add Legal Case functionality
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
