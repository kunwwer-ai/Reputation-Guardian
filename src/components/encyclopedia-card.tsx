
"use client";

import type { EncyclopediaEntry } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { ShieldCheck, AlertTriangle, Edit3, Link as LinkIcon, ExternalLink, PlusCircle } from "lucide-react";
import { useState, useEffect } from "react"; // Added useEffect
import { useToast } from "@/hooks/use-toast";

interface EncyclopediaCardProps {
  entry: EncyclopediaEntry;
  onUpdateEntry: (updatedEntry: EncyclopediaEntry) => void;
}

export function EncyclopediaCard({ entry, onUpdateEntry }: EncyclopediaCardProps) {
  const [currentEntry, setCurrentEntry] = useState(entry);
  const { toast } = useToast();

  const [isAddLinkDialogOpen, setIsAddLinkDialogOpen] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");

  const [isEditSectionDialogOpen, setIsEditSectionDialogOpen] = useState(false);
  const [editableTitle, setEditableTitle] = useState(entry.section_title);
  const [editableContent, setEditableContent] = useState(entry.content_markdown);


  const handleVerificationToggle = (verified: boolean) => {
    const updatedEntry = { ...currentEntry, source_verified: verified };
    setCurrentEntry(updatedEntry);
    onUpdateEntry(updatedEntry);
    toast({ title: `Source ${verified ? 'Verified' : 'Unverified'}`, description: `Section "${entry.section_title}" has been updated.` });
  };

  const handleDisputeToggle = (disputed: boolean) => {
    const updatedEntry = { ...currentEntry, disputed_flag: disputed };
    setCurrentEntry(updatedEntry);
    onUpdateEntry(updatedEntry);
    toast({ title: `Content ${disputed ? 'Disputed' : 'Undisputed'}`, description: `Section "${entry.section_title}" has been updated.` });
  };

  const handleAddLink = () => {
    if (!newLinkTitle.trim() || !newLinkUrl.trim()) {
      toast({ variant: "destructive", title: "Error", description: "Link title and URL cannot be empty." });
      return;
    }
    try {
      // Basic URL validation
      new URL(newLinkUrl);
    } catch (_) {
      toast({ variant: "destructive", title: "Error", description: "Invalid URL format." });
      return;
    }

    const newLink = { title: newLinkTitle, url: newLinkUrl };
    const updatedLinks = [...(currentEntry.source_links || []), newLink];
    const updatedEntry = { ...currentEntry, source_links: updatedLinks };
    
    setCurrentEntry(updatedEntry);
    onUpdateEntry(updatedEntry);
    
    toast({ title: "Link Added", description: `"${newLinkTitle}" has been added to section "${currentEntry.section_title}".`});
    setNewLinkTitle("");
    setNewLinkUrl("");
    setIsAddLinkDialogOpen(false);
  };
  
  const handleSaveSectionEdit = () => {
    if (!editableTitle.trim()) {
      toast({ variant: "destructive", title: "Error", description: "Section title cannot be empty." });
      return;
    }
    const updatedEntry = { 
      ...currentEntry, 
      section_title: editableTitle,
      content_markdown: editableContent
    };
    setCurrentEntry(updatedEntry);
    onUpdateEntry(updatedEntry);
    toast({ title: "Section Updated", description: `"${editableTitle}" has been saved.`});
    setIsEditSectionDialogOpen(false);
  };

  useEffect(() => {
    setCurrentEntry(entry);
    setEditableTitle(entry.section_title);
    setEditableContent(entry.content_markdown);
  }, [entry]);


  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-headline">{currentEntry.section_title}</CardTitle>
          <div className="flex items-center gap-2">
            {currentEntry.source_verified && <Badge variant="default"><ShieldCheck className="mr-1 h-4 w-4" />Verified</Badge>}
            {currentEntry.disputed_flag && <Badge variant="destructive"><AlertTriangle className="mr-1 h-4 w-4" />Disputed</Badge>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 flex-grow">
        <div className="prose prose-sm max-w-none dark:prose-invert bg-muted/30 p-3 rounded-md border">
          <pre className="whitespace-pre-wrap text-sm font-mono bg-transparent border-0 p-0">{currentEntry.content_markdown}</pre>
        </div>
        {currentEntry.source_links && currentEntry.source_links.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-1 flex items-center gap-1"><LinkIcon className="h-4 w-4" />Source Links:</h4>
            <ul className="list-disc list-inside text-sm space-y-1 max-h-32 overflow-y-auto">
              {currentEntry.source_links.map((link, index) => (
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
      <CardFooter className="flex flex-wrap gap-2 justify-between items-center pt-4">
        <div className="flex items-center space-x-2">
          <Switch
            id={`verified-${currentEntry.id}`}
            checked={currentEntry.source_verified}
            onCheckedChange={handleVerificationToggle}
            aria-label="Toggle source verification"
          />
          <Label htmlFor={`verified-${currentEntry.id}`} className="text-sm">Source Verified</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id={`disputed-${currentEntry.id}`}
            checked={currentEntry.disputed_flag}
            onCheckedChange={handleDisputeToggle}
            aria-label="Toggle dispute flag"
          />
          <Label htmlFor={`disputed-${currentEntry.id}`} className="text-sm">Disputed Flag</Label>
        </div>

        {currentEntry.id === "enc3" && (
          <Dialog open={isAddLinkDialogOpen} onOpenChange={setIsAddLinkDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Link
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Source Link</DialogTitle>
                <DialogDescription>
                  Enter the title and URL for the "Online Search Presence" section.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-1">
                  <Label htmlFor="link-title">Link Title</Label>
                  <Input id="link-title" value={newLinkTitle} onChange={(e) => setNewLinkTitle(e.target.value)} placeholder="e.g., Google Search Result for..." />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="link-url">Link URL</Label>
                  <Input id="link-url" value={newLinkUrl} onChange={(e) => setNewLinkUrl(e.target.value)} placeholder="https://www.example.com/search-result" />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline" onClick={() => { setNewLinkTitle(""); setNewLinkUrl("");}}>Cancel</Button></DialogClose>
                <Button onClick={handleAddLink}>Save Link</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        <Dialog open={isEditSectionDialogOpen} onOpenChange={setIsEditSectionDialogOpen}>
            <DialogTrigger asChild>
                 <Button variant="outline" size="sm">
                    <Edit3 className="mr-2 h-4 w-4" /> Edit Section
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Section: {currentEntry.section_title}</DialogTitle>
                    <DialogDescription>Modify the title and content of this encyclopedia section.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto p-1">
                    <div className="space-y-1">
                        <Label htmlFor={`edit-title-${currentEntry.id}`}>Section Title</Label>
                        <Input 
                            id={`edit-title-${currentEntry.id}`} 
                            value={editableTitle} 
                            onChange={(e) => setEditableTitle(e.target.value)} 
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor={`edit-content-${currentEntry.id}`}>Content (Markdown)</Label>
                        <Textarea 
                            id={`edit-content-${currentEntry.id}`} 
                            value={editableContent} 
                            onChange={(e) => setEditableContent(e.target.value)} 
                            rows={10}
                            className="font-mono"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={handleSaveSectionEdit}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
