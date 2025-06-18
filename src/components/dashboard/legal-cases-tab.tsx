
"use client";

import type { LegalCase, EncyclopediaSourceLink, EncyclopediaEntry } from "@/types";
import { LegalCaseCard } from "@/components/legal-case-card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { useEncyclopediaContext } from "@/contexts/encyclopedia-context";
import { useToast } from "@/hooks/use-toast";

const LEGAL_ENCYCLOPEDIA_SECTION_ID = "enc-legal-public";

// Helper function to transform EncyclopediaSourceLink to LegalCase
function transformSourceLinkToLegalCase(
  sourceLink: EncyclopediaSourceLink,
  entry: EncyclopediaEntry
): LegalCase {
  let caseId = sourceLink.legal_case_id_override || `case-${sourceLink.id}`;
  if (!sourceLink.legal_case_id_override && sourceLink.title.toLowerCase().startsWith("case id:")) {
    caseId = sourceLink.title.split(":")[1]?.trim().split(" ")[0] || caseId;
  } else if (!sourceLink.legal_case_id_override) {
    caseId = sourceLink.title.substring(0, 30).replace(/\s/g, '_') || caseId;
  }

  const filingDate = sourceLink.legal_filing_date 
    ? new Date(sourceLink.legal_filing_date) 
    : sourceLink.timestamp 
    ? new Date(sourceLink.timestamp) 
    : new Date();

  const lastAction = sourceLink.legal_last_action_date
    ? new Date(sourceLink.legal_last_action_date)
    : filingDate;

  return {
    id: sourceLink.id, // Use source link's ID as the LegalCase's primary ID
    profileId: entry.profileId,
    case_id: caseId,
    court: sourceLink.legal_court_name || sourceLink.platform || "N/A",
    case_status: sourceLink.legal_case_status || "Potential",
    risk_color: sourceLink.risk_color,
    filing_date: filingDate,
    summary: sourceLink.excerpt || "No summary available.",
    documents: sourceLink.legal_documents || (sourceLink.url ? [{ name: sourceLink.title, url: sourceLink.url }] : []),
    auto_generated_letters: sourceLink.legal_auto_generated_letters || {},
    removal_status: sourceLink.legal_removal_status || "Not Applicable",
    last_action_date: lastAction,
    associated_mention_id: sourceLink.legal_associated_mention_id,
    originalEntryId: entry.id,
    originalLinkId: sourceLink.id,
  };
}


export function LegalCasesTab() {
  const { entries, updateLinkInSection } = useEncyclopediaContext();
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [profileName, setProfileName] = useState("Kunwer Sachdev"); // Default, will be updated

  useEffect(() => {
    const storedFullName = localStorage.getItem("settings_fullName");
    if (storedFullName) setProfileName(storedFullName);
  }, []);


  const legalCases = useMemo(() => {
    const legalSection = entries.find(entry => entry.id === LEGAL_ENCYCLOPEDIA_SECTION_ID);
    if (legalSection && legalSection.source_links) {
      return legalSection.source_links.map(link =>
        transformSourceLinkToLegalCase(link, legalSection)
      ).sort((a,b) => new Date(b.filing_date).getTime() - new Date(a.filing_date).getTime());
    }
    return [];
  }, [entries]);

  useEffect(() => {
    if (entries) {
      setIsLoading(false);
    }
  }, [entries]);

  const handleUpdateCase = (updatedCase: LegalCase) => {
    // Transform LegalCase back to EncyclopediaSourceLink partial update
    const sourceLinkUpdate: Partial<EncyclopediaSourceLink> = {
      title: updatedCase.case_id === `case-${updatedCase.id}` || updatedCase.case_id === updatedCase.title.substring(0,30).replace(/\s/g, '_') ? updatedCase.court + " - " + updatedCase.summary.substring(0,20) : updatedCase.case_id + " - " + updatedCase.court, // A sensible default title update
      excerpt: updatedCase.summary,
      platform: updatedCase.court !== "N/A" ? updatedCase.court : undefined,
      risk_color: updatedCase.risk_color,
      legal_case_status: updatedCase.case_status,
      legal_court_name: updatedCase.court !== "N/A" ? updatedCase.court : undefined,
      legal_case_id_override: updatedCase.case_id,
      legal_filing_date: updatedCase.filing_date,
      legal_documents: updatedCase.documents,
      legal_auto_generated_letters: updatedCase.auto_generated_letters,
      legal_removal_status: updatedCase.removal_status,
      legal_last_action_date: updatedCase.last_action_date,
      legal_associated_mention_id: updatedCase.associated_mention_id,
    };

    updateLinkInSection(updatedCase.originalEntryId, updatedCase.originalLinkId, sourceLinkUpdate);
    toast({ title: "Legal Case Updated", description: `Case ${updatedCase.case_id} has been updated in the encyclopedia.` });
  };

  const handleAddLegalCase = () => {
    alert("To add a new legal case, please go to the Encyclopedia tab, find the 'Public Legal Mentions & Filings' collection, and add a new link with relevant details.");
    // Ideally, this could navigate the user or open a specific dialog for the legal section.
    console.log("Add new legal case clicked - user should be directed to add to Encyclopedia's legal section");
  };

  if (isLoading) {
     return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
            <div className="h-10 bg-muted rounded w-36 animate-pulse"></div>
        </div>
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
      
      {legalCases.length === 0 ? (
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <p className="text-muted-foreground">No legal cases found. Add links to the "Public Legal Mentions & Filings" collection in the Encyclopedia tab.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {legalCases.map(lc => (
            <LegalCaseCard 
              key={lc.id} 
              legalCase={lc} 
              profileFullName={profileName} // Pass the dynamic profile name
              onUpdateCase={handleUpdateCase} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
