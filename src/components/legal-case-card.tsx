
"use client";

import type { LegalCase, Profile, Mention, DMCALetterResult } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, Info, FileText, Mail, Loader2, ExternalLink, Archive } from "lucide-react";
import { useState, useTransition } from "react";
import { generateDMCALetterAction } from "@/app/actions/legal-actions";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface LegalCaseCardProps {
  legalCase: LegalCase;
  profile: Profile; // Needed for DMCA letter
  linkedMention?: Mention; // Optional, if case is linked to a specific mention
  onUpdateCase: (updatedCase: LegalCase) => void;
}

export function LegalCaseCard({ legalCase, profile, linkedMention, onUpdateCase }: LegalCaseCardProps) {
  const [isGenerating, startGenerating] = useTransition();
  const { toast } = useToast();
  const [dmcaFormData, setDmcaFormData] = useState({
    mentionTitle: linkedMention?.title || "",
    mentionUrl: linkedMention?.url || "",
    originalWorkDescription: "",
    fullName: profile.full_name,
    address: "123 Main St, Anytown, USA", // Placeholder, fetch from profile if available
    email: "contact@" + profile.full_name.toLowerCase().replace(/\s+/g, '') + ".com", // Placeholder
    phoneNumber: "555-123-4567", // Placeholder
  });

  const handleGenerateDMCA = () => {
    startGenerating(async () => {
      if (!dmcaFormData.mentionUrl || !dmcaFormData.originalWorkDescription) {
        toast({ variant: "destructive", title: "Missing Information", description: "Please provide Infringing URL and Original Work Description."});
        return;
      }
      try {
        const result: DMCALetterResult = await generateDMCALetterAction({
          ...dmcaFormData,
        });
        
        const updatedCase: LegalCase = {
          ...legalCase,
          auto_generated_letters: {
            ...(legalCase.auto_generated_letters || {}),
            [`dmca_${Date.now()}`]: {
              letter_type: 'DMCA',
              content: result.dmcaLetter,
              generated_at: new Date(),
            },
          },
        };
        onUpdateCase(updatedCase);

        toast({
          title: "DMCA Letter Generated",
          description: "The DMCA takedown notice has been drafted.",
        });
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "DMCA Generation Failed",
          description: error.message || "Could not generate DMCA letter.",
        });
      }
    });
  };

  const getStatusBadgeVariant = (status: LegalCase['case_status']) => {
    switch (status) {
      case 'Active': return 'destructive';
      case 'Potential': return 'default'; // blue
      case 'Settled': return 'default'; // green - but primary is blue, let's use that
      case 'Dismissed': return 'secondary';
      default: return 'outline';
    }
  };
  
  const getRiskIcon = (riskColor?: '🔴' | '🟡' | '🟢') => {
    switch (riskColor) {
      case '🔴': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case '🟡': return <Info className="h-5 w-5 text-yellow-500" />;
      case '🟢': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default: return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-headline">Case ID: {legalCase.case_id}</CardTitle>
            <CardDescription className="text-sm">
              {legalCase.court} - Filed: {new Date(legalCase.filing_date).toLocaleDateString()}
            </CardDescription>
          </div>
           <div className="flex items-center gap-2">
            {getRiskIcon(legalCase.risk_color)}
            <Badge variant={getStatusBadgeVariant(legalCase.case_status)}>{legalCase.case_status}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-foreground leading-relaxed">{legalCase.summary}</p>
        {legalCase.documents && legalCase.documents.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-1">Documents:</h4>
            <ul className="list-disc list-inside text-sm">
              {legalCase.documents.map(doc => (
                <li key={doc.url}>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                    {doc.name} <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {legalCase.auto_generated_letters && Object.keys(legalCase.auto_generated_letters).length > 0 && (
           <div className="mt-2">
             <h4 className="font-semibold text-sm mb-1">Generated Letters:</h4>
             <ul className="list-disc list-inside text-sm">
               {Object.entries(legalCase.auto_generated_letters).map(([key, letter]) => (
                 <li key={key} className="text-muted-foreground">
                   {letter.letter_type} generated on {new Date(letter.generated_at).toLocaleDateString()}
                   <Dialog>
                     <DialogTrigger asChild><Button variant="link" size="sm" className="p-1 h-auto text-xs">View</Button></DialogTrigger>
                     <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{letter.letter_type} Letter</DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="h-[60vh]"><pre className="text-xs whitespace-pre-wrap p-2 border rounded bg-muted">{letter.content}</pre></ScrollArea>
                     </DialogContent>
                   </Dialog>
                 </li>
               ))}
             </ul>
           </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 justify-between">
         <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Mail className="mr-2 h-4 w-4" /> Generate DMCA Letter
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Generate DMCA Takedown Notice</DialogTitle>
              <DialogDescription>
                Fill in the details to generate a DMCA letter for this case. Some fields are pre-filled from the profile and linked mention (if any).
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto p-1">
              <div className="space-y-1">
                <Label htmlFor="dmca-mentionTitle">Infringing Content Title</Label>
                <Input id="dmca-mentionTitle" value={dmcaFormData.mentionTitle} onChange={(e) => setDmcaFormData({...dmcaFormData, mentionTitle: e.target.value})} placeholder="e.g., Unauthorized copy of my photo"/>
              </div>
              <div className="space-y-1">
                <Label htmlFor="dmca-mentionUrl">Infringing Content URL *</Label>
                <Input id="dmca-mentionUrl" value={dmcaFormData.mentionUrl} onChange={(e) => setDmcaFormData({...dmcaFormData, mentionUrl: e.target.value})} placeholder="https://example.com/infringing-page" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="dmca-originalWorkDescription">Original Work Description *</Label>
                <Textarea id="dmca-originalWorkDescription" value={dmcaFormData.originalWorkDescription} onChange={(e) => setDmcaFormData({...dmcaFormData, originalWorkDescription: e.target.value})} placeholder="Detailed description of your original copyrighted work..." required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="dmca-fullName">Copyright Holder Name</Label>
                <Input id="dmca-fullName" value={dmcaFormData.fullName} onChange={(e) => setDmcaFormData({...dmcaFormData, fullName: e.target.value})} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="dmca-address">Address</Label>
                <Input id="dmca-address" value={dmcaFormData.address} onChange={(e) => setDmcaFormData({...dmcaFormData, address: e.target.value})} />
              </div>
               <div className="space-y-1">
                <Label htmlFor="dmca-email">Email</Label>
                <Input id="dmca-email" type="email" value={dmcaFormData.email} onChange={(e) => setDmcaFormData({...dmcaFormData, email: e.target.value})} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="dmca-phoneNumber">Phone Number</Label>
                <Input id="dmca-phoneNumber" value={dmcaFormData.phoneNumber} onChange={(e) => setDmcaFormData({...dmcaFormData, phoneNumber: e.target.value})} />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
              <Button onClick={handleGenerateDMCA} disabled={isGenerating}>
                {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Letter
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button variant="outline" size="sm" disabled>
          <Archive className="mr-2 h-4 w-4" /> Archive Evidence
        </Button>
      </CardFooter>
    </Card>
  );
}

// ScrollArea component used above
import { ScrollArea } from "@/components/ui/scroll-area";
