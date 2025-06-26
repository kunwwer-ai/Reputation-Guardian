
"use client";

import type { EncyclopediaEntry, EncyclopediaSourceLink } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShieldCheck, AlertTriangle, Edit3, Link as LinkIcon, ExternalLink, PlusCircle, Wand2, Loader2 } from "lucide-react";
import { useState, useEffect, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { useEncyclopediaContext } from "@/contexts/encyclopedia-context";
import { scrapeUrlAction } from "@/app/actions/scraping-actions";

interface EncyclopediaCardProps {
  entry: EncyclopediaEntry;
  onUpdateEntry: (updatedEntry: EncyclopediaEntry) => void; // This will call contextUpdateEntry
}

export function EncyclopediaCard({ entry, onUpdateEntry }: EncyclopediaCardProps) {
  const { addLinkToEntry } = useEncyclopediaContext(); // Use context for adding links
  const [currentEntry, setCurrentEntry] = useState(entry);
  const { toast } = useToast();

  const [isAddLinkDialogOpen, setIsAddLinkDialogOpen] = useState(false);
  const [newLink, setNewLink] = useState<Partial<EncyclopediaSourceLink>>({ title: "", url: "", excerpt: "", platform: "" });

  const [isEditSectionDialogOpen, setIsEditSectionDialogOpen] = useState(false);
  const [editableTitle, setEditableTitle] = useState(entry.section_title);
  const [editableContent, setEditableContent] = useState(entry.content_markdown);

  const [isScraping, startScraping] = useTransition();


  const handleVerificationToggle = (verified: boolean) => {
    const updatedEntry = { ...currentEntry, source_verified: verified };
    setCurrentEntry(updatedEntry);
    onUpdateEntry(updatedEntry); // Propagates to context via DashboardPage
    toast({ title: `Source ${verified ? 'Verified' : 'Unverified'}`, description: `Section "${entry.section_title}" has been updated.` });
  };

  const handleDisputeToggle = (disputed: boolean) => {
    const updatedEntry = { ...currentEntry, disputed_flag: disputed };
    setCurrentEntry(updatedEntry);
    onUpdateEntry(updatedEntry);
    toast({ title: `Content ${disputed ? 'Disputed' : 'Undisputed'}`, description: `Section "${entry.section_title}" has been updated.` });
  };
  
  const handleScrapeUrl = () => {
    if (!newLink.url?.trim()) {
      toast({ variant: "destructive", title: "Error", description: "Please enter a URL to scrape." });
      return;
    }
    try {
      new URL(newLink.url);
    } catch (_) {
      toast({ variant: "destructive", title: "Error", description: "Invalid URL format." });
      return;
    }

    startScraping(async () => {
      try {
        const result = await scrapeUrlAction(newLink.url!);
        setNewLink(prev => ({
          ...prev,
          title: result.title,
          excerpt: result.summary,
          platform: result.platform
        }));
        toast({ title: "Content Scraped", description: "The title, excerpt, and platform have been filled in." });
      } catch (error: any) {
        toast({ variant: "destructive", title: "Scraping Failed", description: error.message || "An unknown error occurred." });
      }
    });
  };

  const handleAddNewLink = () => {
    if (!newLink.title?.trim() || !newLink.url?.trim()) {
      toast({ variant: "destructive", title: "Error", description: "Link title and URL cannot be empty." });
      return;
    }
    try {
      new URL(newLink.url);
    } catch (_) {
      toast({ variant: "destructive", title: "Error", description: "Invalid URL format." });
      return;
    }

    const completeNewLink: EncyclopediaSourceLink = {
      id: `link-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, // More robust unique ID
      title: newLink.title,
      url: newLink.url,
      excerpt: newLink.excerpt || "",
      platform: newLink.platform || "",
      timestamp: new Date(),
    };
    
    addLinkToEntry(currentEntry.id, completeNewLink); // Use context function
    
    toast({ title: "Link Added", description: `"${completeNewLink.title}" has been added to section "${currentEntry.section_title}".`});
    setNewLink({ title: "", url: "", excerpt: "", platform: "" }); // Reset form
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
    // No need to setCurrentEntry if onUpdateEntry directly updates the source via context
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
            <h4 className="font-semibold text-sm mb-1 flex items-center gap-1"><LinkIcon className="h-4 w-4" />Source Links ({currentEntry.source_links.length}):</h4>
            <ScrollArea className="h-32 border rounded-md p-2">
              <ul className="space-y-1">
                {currentEntry.source_links.map((link) => (
                  <li key={link.id} className="text-sm p-1 hover:bg-muted/50 rounded">
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1 group w-full">
                      <span className="font-medium truncate group-hover:whitespace-normal" title={link.title}>{link.title}</span>
                      <ExternalLink className="h-3 w-3 ml-auto flex-shrink-0" />
                    </a>
                    {link.excerpt && <p className="text-xs text-muted-foreground mt-0.5 truncate group-hover:whitespace-normal" title={link.excerpt}>{link.excerpt}</p>}
                    {link.platform && <p className="text-xs text-muted-foreground">Platform: {link.platform}</p>}
                  </li>
                ))}
              </ul>
            </ScrollArea>
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
          <Label htmlFor={`verified-${currentEntry.id}`} className="text-sm">Section Verified</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id={`disputed-${currentEntry.id}`}
            checked={currentEntry.disputed_flag}
            onCheckedChange={handleDisputeToggle}
            aria-label="Toggle dispute flag"
          />
          <Label htmlFor={`disputed-${currentEntry.id}`} className="text-sm">Section Disputed</Label>
        </div>

        <Dialog open={isAddLinkDialogOpen} onOpenChange={setIsAddLinkDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Link
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Link to "{currentEntry.section_title}"</DialogTitle>
              <DialogDescription>
                Enter a URL and choose a scraping option, or fill in the details manually.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] p-1">
              <div className="grid gap-4 py-4 pr-4">
                <div className="space-y-1">
                  <Label htmlFor={`link-url-${currentEntry.id}`}>Link URL *</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id={`link-url-${currentEntry.id}`}
                      value={newLink.url} 
                      onChange={(e) => setNewLink({ ...newLink, url: e.target.value })} 
                      placeholder="https://www.example.com/some-article" 
                      className="flex-grow"
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          disabled={isScraping || !newLink.url}
                          aria-label="Choose a scraping method"
                          title="Choose a scraping method"
                        >
                          {isScraping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Scraping Options</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleScrapeUrl}>
                          Analyze with AI (Default)
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled>
                          Scrape from Social Media API (Coming Soon)
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled>
                          Scrape from News API (Coming Soon)
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`link-title-${currentEntry.id}`}>Link Title *</Label>
                  <Input id={`link-title-${currentEntry.id}`} value={newLink.title} onChange={(e) => setNewLink({...newLink, title: e.target.value})} placeholder="e.g., Google Search Result for..." />
                </div>
                 <div className="space-y-1">
                  <Label htmlFor={`link-excerpt-${currentEntry.id}`}>Excerpt / Description</Label>
                  <Textarea id={`link-excerpt-${currentEntry.id}`} value={newLink.excerpt} onChange={(e) => setNewLink({...newLink, excerpt: e.target.value})} placeholder="Short summary or key text from the link..." rows={3} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`link-platform-${currentEntry.id}`}>Platform</Label>
                  <Input id={`link-platform-${currentEntry.id}`} value={newLink.platform} onChange={(e) => setNewLink({...newLink, platform: e.target.value})} placeholder="e.g., Forbes, YouTube Channel Name" />
                </div>
              </div>
            </ScrollArea>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline" onClick={() => { setNewLink({ title: "", url: "", excerpt: "", platform: "" });}}>Cancel</Button></DialogClose>
              <Button onClick={handleAddNewLink} disabled={isScraping}>Save Link</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
                        <Label htmlFor={`edit-content-${currentEntry.id}`}>Content (Markdown Description)</Label>
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

    