
"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wand2, PlusCircle } from "lucide-react";
import { scrapeUrlAction } from "@/app/actions/scraping-actions";
import type { ScrapeWebsiteOutput } from "@/ai/flows/scrape-website-flow";
import { useEncyclopediaContext } from "@/contexts/encyclopedia-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { EncyclopediaSourceLink } from "@/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function ScrapingTab() {
  const [urlToScrape, setUrlToScrape] = useState("");
  const [cssSelector, setCssSelector] = useState("");
  const [scrapedData, setScrapedData] = useState<ScrapeWebsiteOutput | null>(null);
  const [isScraping, startScraping] = useTransition();
  const { toast } = useToast();
  const { entries, addLinkToEntry } = useEncyclopediaContext();
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | undefined>();

  const handleScrape = () => {
    if (!urlToScrape.trim()) {
      toast({ variant: "destructive", title: "Error", description: "Please enter a URL to scrape." });
      return;
    }
    try {
      new URL(urlToScrape);
    } catch (_) {
      toast({ variant: "destructive", title: "Error", description: "Invalid URL format." });
      return;
    }

    setScrapedData(null); // Clear previous results
    startScraping(async () => {
      try {
        const result = await scrapeUrlAction({ url: urlToScrape, cssSelector: cssSelector.trim() || undefined });
        setScrapedData(result);
        toast({ title: "Scraping Complete", description: "Web content has been analyzed." });
      } catch (error: any) {
        toast({ variant: "destructive", title: "Scraping Failed", description: error.message || "An unknown error occurred." });
      }
    });
  };

  const handleAddToEncyclopedia = () => {
    if (!scrapedData || !selectedCollectionId) {
      toast({ variant: "destructive", title: "Error", description: "No scraped data or collection selected." });
      return;
    }
    
    const newLink: EncyclopediaSourceLink = {
      id: `link-${Date.now()}`,
      title: scrapedData.title,
      url: urlToScrape,
      excerpt: scrapedData.summary,
      platform: scrapedData.platform,
      timestamp: new Date(),
    };

    addLinkToEntry(selectedCollectionId, newLink);

    toast({ title: "Link Added", description: `"${newLink.title}" has been added to the selected collection.` });

    // Clear fields after adding
    setScrapedData(null);
    setUrlToScrape("");
    setCssSelector("");
    setSelectedCollectionId(undefined);
  };


  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold font-headline tracking-tight">Web Scraping Tool</h2>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Scrape a URL</CardTitle>
          <CardDescription>Enter a URL to fetch and analyze its content using AI. Optionally, provide a CSS selector to target a specific part of the page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url-input">Website URL</Label>
            <Input
              id="url-input"
              value={urlToScrape}
              onChange={(e) => setUrlToScrape(e.target.value)}
              placeholder="https://www.example.com/article"
            />
          </div>
           <div className="space-y-2">
            <Label htmlFor="selector-input">CSS Selector (Optional)</Label>
            <Input
              id="selector-input"
              value={cssSelector}
              onChange={(e) => setCssSelector(e.target.value)}
              placeholder="e.g., #content, .article-body"
            />
             <p className="text-xs text-muted-foreground">Provide a selector to focus the analysis on a specific part of the page.</p>
          </div>
        </CardContent>
        <CardFooter>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button disabled={isScraping || !urlToScrape.trim()}>
                      {isScraping ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                      <span>Scrape & Analyze...</span>
                  </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={handleScrape}>
                      Analyze with AI (Default)
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                      Use Social Media API (Coming Soon)
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                      Use News API (Coming Soon)
                  </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </CardFooter>
      </Card>

      {isScraping && (
         <Card className="shadow-lg animate-pulse">
            <CardHeader>
                <div className="h-6 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-1/4 mt-2"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
            </CardContent>
        </Card>
      )}

      {scrapedData && !isScraping && (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Scraped Content</CardTitle>
                <CardDescription>Review the analyzed content below and add it to an Encyclopedia collection.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label className="text-sm font-semibold">Title</Label>
                    <p className="text-md text-foreground">{scrapedData.title}</p>
                </div>
                 <div>
                    <Label className="text-sm font-semibold">Platform</Label>
                    <p className="text-md text-foreground">{scrapedData.platform}</p>
                </div>
                <div>
                    <Label className="text-sm font-semibold">AI Summary</Label>
                    <p className="text-md text-muted-foreground">{scrapedData.summary}</p>
                </div>
            </CardContent>
            <CardFooter className="flex-col sm:flex-row gap-4 items-start sm:items-center">
               <div className="flex-grow w-full sm:w-auto space-y-1">
                 <Label htmlFor="collection-select">Add to Collection</Label>
                 <Select value={selectedCollectionId} onValueChange={setSelectedCollectionId}>
                    <SelectTrigger id="collection-select" className="w-full sm:w-[300px]">
                      <SelectValue placeholder="Select a collection..." />
                    </SelectTrigger>
                    <SelectContent>
                      {entries.map(entry => (
                        <SelectItem key={entry.id} value={entry.id}>
                          {entry.section_title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
               </div>
                <Button onClick={handleAddToEncyclopedia} disabled={!selectedCollectionId} className="mt-2 sm:mt-auto">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add to Encyclopedia
                </Button>
            </CardFooter>
        </Card>
      )}
    </div>
  );
}
