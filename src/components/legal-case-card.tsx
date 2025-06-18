
"use client";

import type { LegalCase, DMCALetterResult } from "@/types"; // Removed Profile, Mention
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, FileText, Mail, Loader2, ExternalLink, Archive } from "lucide-react";
import { useState, useTransition, useEffect } from "react";
import { generateDMCALetterAction } from "@/app/actions/legal-actions";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LegalCaseCardProps {
  legalCase: LegalCase;
  profileFullName: string; // Accept full name directly
  onUpdateCase: (updatedCase: LegalCase) => void;
}

export function LegalCaseCard({ legalCase, profileFullName, onUpdateCase }: LegalCaseCardProps) {
  const [isGenerating, startGenerating] = useTransition();
  const { toast } = useToast();
  
  // Initialize dmcaFormData with potentially undefined linkedMention info
  const [dmcaFormData, setDmcaFormData] = useState({
    mentionTitle: "", // Will be populated if a linked mention is found/passed
    mentionUrl: "",   // Will be populated if a linked mention is found/passed
    originalWorkDescription: "",
    fullName: profileFullName, // Use passed prop
    address: "123 Main St, Anytown, USA", 
    email: "contact@" + profileFullName.toLowerCase().replace(/\s+/g, '') + ".com",
    phoneNumber: "555-123-4567",
  });

  // Effect to update DMCA form data if legalCase or profileFullName changes (e.g. initial load)
  useEffect(() => {
    setDmcaFormData(prev => ({
      ...prev,
      fullName: profileFullName,
      email: "contact@" + profileFullName.toLowerCase().replace(/\s+/g, '') + ".com",
      // If associated_mention_id exists and we could fetch mention details, update here.
      // For now, we assume mentionTitle and mentionUrl would be part of legalCase.summary or a document.
      // If not, users will need to fill them.
      // We can prefill from legalCase.summary if it looks like a title or URL, but that's heuristic.
      mentionTitle: legalCase.summary.substring(0,50), // Simple prefill attempt
      mentionUrl: legalCase.documents && legalCase.documents.length > 0 ? legalCase.documents[0].url : "" // Use first doc URL if available
    }));
  }, [legalCase, profileFullName]);


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
        onUpdateCase(updatedCase); // This will propagate to legal-cases-tab and then to encyclopedia context

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
      case 'Potential': return 'default'; 
      case 'Settled': return 'default'; 
      case 'Dismissed': return 'secondary';
      default: return 'outline';
    }
  };
  
  const getRiskIcon = (riskColor?: '🔴' | '🟠' | '🟢') => {
    switch (riskColor) {
      case '🔴': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case '🟠': return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case '🟢': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default: return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
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
      <CardContent className="space-y-3 flex-grow">
        <p className="text-sm text-foreground leading-relaxed">{legalCase.summary}</p>
        {legalCase.documents && legalCase.documents.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-1">Documents:</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              {legalCase.documents.map((doc, index) => (
                <li key={doc.url + index}> {/* Add index for more unique key if names/URLs repeat */}
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                    {doc.name} <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {legalCase.auto_generated_letters && Object.keys(legalCase.auto_generated_letters).length > 0 && (
           <div className="mt-3 pt-3 border-t">
             <h4 className="font-semibold text-sm mb-1">Generated Letters:</h4>
             <ul className="list-disc list-inside text-sm space-y-1">
               {Object.entries(legalCase.auto_generated_letters).map(([key, letter]) => (
                 <li key={key} className="text-muted-foreground">
                   {letter.letter_type} ({new Date(letter.generated_at).toLocaleDateString()})
                   <Dialog>
                     <DialogTrigger asChild><Button variant="link" size="sm" className="p-1 h-auto text-xs ml-1">View</Button></DialogTrigger>
                     <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{letter.letter_type} Letter - {new Date(letter.generated_at).toLocaleDateString()}</DialogTitle>
                           <DialogDescription>Generated for case: {legalCase.case_id}</DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="h-[60vh] border rounded-md p-2 bg-muted/50">
                            <pre className="text-xs whitespace-pre-wrap font-mono">{letter.content}</pre>
                        </ScrollArea>
                        <DialogFooter>
                            <DialogClose asChild><Button variant="outline">Close</Button></DialogClose>
                        </DialogFooter>
                     </DialogContent>
                   </Dialog>
                 </li>
               ))}
             </ul>
           </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 justify-between items-center pt-4">
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
                Fill in the details to generate a DMCA letter for this case. Some fields are pre-filled.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] p-1">
              <div className="grid gap-4 py-4 pr-2">
                <div className="space-y-1">
                  <Label htmlFor={`dmca-mentionTitle-${legalCase.id}`}>Infringing Content Title</Label>
                  <Input id={`dmca-mentionTitle-${legalCase.id}`} value={dmcaFormData.mentionTitle} onChange={(e) => setDmcaFormData({...dmcaFormData, mentionTitle: e.target.value})} placeholder="e.g., Unauthorized copy of my photo"/>
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`dmca-mentionUrl-${legalCase.id}`}>Infringing Content URL *</Label>
                  <Input id={`dmca-mentionUrl-${legalCase.id}`} value={dmcaFormData.mentionUrl} onChange={(e) => setDmcaFormData({...dmcaFormData, mentionUrl: e.target.value})} placeholder="https://example.com/infringing-page" required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`dmca-originalWorkDescription-${legalCase.id}`}>Original Work Description *</Label>
                  <Textarea id={`dmca-originalWorkDescription-${legalCase.id}`} value={dmcaFormData.originalWorkDescription} onChange={(e) => setDmcaFormData({...dmcaFormData, originalWorkDescription: e.target.value})} placeholder="Detailed description of your original copyrighted work..." required rows={3}/>
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`dmca-fullName-${legalCase.id}`}>Copyright Holder Name</Label>
                  <Input id={`dmca-fullName-${legalCase.id}`} value={dmcaFormData.fullName} onChange={(e) => setDmcaFormData({...dmcaFormData, fullName: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`dmca-address-${legalCase.id}`}>Address</Label>
                  <Input id={`dmca-address-${legalCase.id}`} value={dmcaFormData.address} onChange={(e) => setDmcaFormData({...dmcaFormData, address: e.target.value})} />
                </div>
                 <div className="space-y-1">
                  <Label htmlFor={`dmca-email-${legalCase.id}`}>Email</Label>
                  <Input id={`dmca-email-${legalCase.id}`} type="email" value={dmcaFormData.email} onChange={(e) => setDmcaFormData({...dmcaFormData, email: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`dmca-phoneNumber-${legalCase.id}`}>Phone Number</Label>
                  <Input id={`dmca-phoneNumber-${legalCase.id}`} value={dmcaFormData.phoneNumber} onChange={(e) => setDmcaFormData({...dmcaFormData, phoneNumber: e.target.value})} />
                </div>
              </div>
            </ScrollArea>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
              <Button onClick={handleGenerateDMCA} disabled={isGenerating}>
                {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Letter
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button variant="outline" size="sm" disabled> {/* Archive evidence is future work */}
          <Archive className="mr-2 h-4 w-4" /> Archive Evidence
        </Button>
      </CardFooter>
    </Card>
  );
}
