
"use client";

import type { EncyclopediaEntry } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ShieldCheck, AlertTriangle, Edit3, Link as LinkIcon, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface EncyclopediaCardProps {
  entry: EncyclopediaEntry;
  onUpdateEntry: (updatedEntry: EncyclopediaEntry) => void;
}

export function EncyclopediaCard({ entry, onUpdateEntry }: EncyclopediaCardProps) {
  const [currentEntry, setCurrentEntry] = useState(entry);
  const { toast } = useToast();

  const handleVerificationToggle = (verified: boolean) => {
    const updatedEntry = { ...currentEntry, source_verified: verified };
    setCurrentEntry(updatedEntry);
    onUpdateEntry(updatedEntry); // Propagate change upwards
    toast({ title: `Source ${verified ? 'Verified' : 'Unverified'}`, description: `Section "${entry.section_title}" has been updated.` });
  };

  const handleDisputeToggle = (disputed: boolean) => {
    const updatedEntry = { ...currentEntry, disputed_flag: disputed };
    setCurrentEntry(updatedEntry);
    onUpdateEntry(updatedEntry);
    toast({ title: `Content ${disputed ? 'Disputed' : 'Undisputed'}`, description: `Section "${entry.section_title}" has been updated.` });
  };

  // In a real app, content_markdown would be rendered to HTML
  // For simplicity, we'll display it as is or in a pre tag.

  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-headline">{entry.section_title}</CardTitle>
          <div className="flex items-center gap-2">
            {currentEntry.source_verified && <Badge variant="default"><ShieldCheck className="mr-1 h-4 w-4" />Verified</Badge>}
            {currentEntry.disputed_flag && <Badge variant="destructive"><AlertTriangle className="mr-1 h-4 w-4" />Disputed</Badge>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="prose prose-sm max-w-none dark:prose-invert bg-muted/30 p-3 rounded-md border">
          {/* Basic markdown rendering - replace with a proper renderer in a real app */}
          <pre className="whitespace-pre-wrap text-sm">{entry.content_markdown}</pre>
        </div>
        {entry.source_links && entry.source_links.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-1 flex items-center gap-1"><LinkIcon className="h-4 w-4" />Source Links:</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              {entry.source_links.map((link, index) => (
                <li key={index}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                    {link.title || new URL(link.url).hostname} <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex items-center space-x-2">
          <Switch
            id={`verified-${entry.id}`}
            checked={currentEntry.source_verified}
            onCheckedChange={handleVerificationToggle}
            aria-label="Toggle source verification"
          />
          <Label htmlFor={`verified-${entry.id}`} className="text-sm">Source Verified</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id={`disputed-${entry.id}`}
            checked={currentEntry.disputed_flag}
            onCheckedChange={handleDisputeToggle}
            aria-label="Toggle dispute flag"
          />
          <Label htmlFor={`disputed-${entry.id}`} className="text-sm">Disputed Flag</Label>
        </div>
        <Button variant="outline" size="sm" disabled>
          <Edit3 className="mr-2 h-4 w-4" /> Edit Section
        </Button>
      </CardFooter>
    </Card>
  );
}
