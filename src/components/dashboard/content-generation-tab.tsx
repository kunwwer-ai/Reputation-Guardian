
"use client";

import type { GenerateDerivedContentResult, GenerateDerivedContentInput as TypesGenInput, EncyclopediaSourceLink } from "@/types";
import { useState, useEffect, useTransition, useMemo } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { generateDerivedContentAction } from "@/app/actions/content-actions";
import { Loader2, Sparkles, User } from "lucide-react";
import { useEncyclopediaContext } from "@/contexts/encyclopedia-context";
import type { GenerateDerivedContentInput as FlowGenInputType } from "@/ai/flows/generate-derived-content";


const contentTypes: TypesGenInput['contentType'][] = [
  "Summary",
  "Tweet",
  "LinkedIn Post",
  "Key Takeaways",
  "Press Release Snippet",
];

export function ContentGenerationTab() {
  const { entries } = useEncyclopediaContext();
  const [profileNameState, setProfileNameState] = useState("Kunwer Sachdev");
  const [selectedNewsLinkId, setSelectedNewsLinkId] = useState<string | undefined>(undefined);
  const [selectedContentType, setSelectedContentType] = useState<TypesGenInput['contentType'] | undefined>(contentTypes[0]);
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [isGenerating, startGenerating] = useTransition();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);


  const newsSourceLinks = useMemo(() => {
    const newsSection = entries.find(entry => entry.id === "enc-news"); // ID for "News Articles"
    return newsSection?.source_links || [];
  }, [entries]);

  useEffect(() => {
    const storedFullName = localStorage.getItem("settings_fullName");
    setProfileNameState(storedFullName || "Kunwer Sachdev");

    if (newsSourceLinks.length > 0 && !selectedNewsLinkId) {
      setSelectedNewsLinkId(newsSourceLinks[0].id);
    }
    if (entries) { 
        setIsLoading(false);
    }
  }, [newsSourceLinks, selectedNewsLinkId, entries]);

  const handleGenerateContent = async () => {
    if (!selectedNewsLinkId || !selectedContentType) {
      toast({ variant: "destructive", title: "Error", description: "Please select a news item and a content type." });
      return;
    }

    const selectedNewsItem = newsSourceLinks.find(item => item.id === selectedNewsLinkId);
    if (!selectedNewsItem) {
      toast({ variant: "destructive", title: "Error", description: "Selected news item not found." });
      return;
    }

    setGeneratedContent(""); 
    startGenerating(async () => {
      try {
        const inputForFlow: FlowGenInputType = {
          profileName: profileNameState,
          newsTitle: selectedNewsItem.title,
          newsExcerpt: selectedNewsItem.excerpt || "No excerpt provided.",
          contentType: selectedContentType,
        };
        const result: GenerateDerivedContentResult = await generateDerivedContentAction(inputForFlow);
        setGeneratedContent(result.generatedText);
        toast({ title: "Content Generated", description: `${selectedContentType} has been successfully generated.` });
      } catch (error: any) {
        toast({ variant: "destructive", title: "Generation Failed", description: error.message || "Could not generate content." });
      }
    });
  };

  const selectedNewsDetails = newsSourceLinks.find(item => item.id === selectedNewsLinkId);
  
  if (isLoading) {
     return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold font-headline tracking-tight">Content Generation</h2>
        <Card className="shadow-lg mb-6">
            <CardHeader>
                <div className="h-5 bg-muted rounded w-1/3 animate-pulse"></div>
            </CardHeader>
            <CardContent>
                <div className="h-7 bg-muted rounded w-1/2 animate-pulse"></div>
            </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-1/2 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-3/4 mt-1 animate-pulse"></div>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1"><div className="h-4 bg-muted rounded w-1/4 animate-pulse mb-1"></div><div className="h-10 bg-muted rounded w-full animate-pulse"></div></div>
                <div className="space-y-1"><div className="h-4 bg-muted rounded w-1/4 animate-pulse mb-1"></div><div className="h-10 bg-muted rounded w-full animate-pulse"></div></div>
             </div>
          </CardContent>
          <CardFooter><div className="h-10 bg-muted rounded w-36 animate-pulse"></div></CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold font-headline tracking-tight">Content Generation</h2>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary"/> Profile Context
          </CardTitle>
          <CardDescription>Content will be generated with the following profile in mind:</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold text-foreground">{profileNameState}</p>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Generate Derived Content from News</CardTitle>
          <CardDescription>Choose a news item from your encyclopedia and the type of content you want to generate.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="news-item-select">News Item (from Encyclopedia "News Articles")</Label>
              <Select value={selectedNewsLinkId} onValueChange={setSelectedNewsLinkId}>
                <SelectTrigger id="news-item-select" className="w-full">
                  <SelectValue placeholder="Select a news item..." />
                </SelectTrigger>
                <SelectContent>
                  {newsSourceLinks.length > 0 ? newsSourceLinks.map(item => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.title} {item.platform ? `(${item.platform})` : ''}
                    </SelectItem>
                  )) : <SelectItem value="no-news" disabled>No news articles in Encyclopedia</SelectItem>}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="content-type-select">Content Type</Label>
              <Select value={selectedContentType} onValueChange={(value) => setSelectedContentType(value as TypesGenInput['contentType'])}>
                <SelectTrigger id="content-type-select" className="w-full">
                  <SelectValue placeholder="Select content type..." />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {selectedNewsDetails && (
            <Card className="bg-muted/50 p-4">
              <CardTitle className="text-md mb-1">Selected News Excerpt:</CardTitle>
              <CardDescription className="text-sm max-h-20 overflow-y-auto">
                {selectedNewsDetails.excerpt || "No excerpt available for this item."}
              </CardDescription>
            </Card>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerateContent} disabled={isGenerating || !selectedNewsLinkId || !selectedContentType || newsSourceLinks.length === 0}>
            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Generate Content
          </Button>
        </CardFooter>
      </Card>

      {generatedContent && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Generated Content: {selectedContentType}</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea value={generatedContent} readOnly rows={10} className="font-mono text-sm" />
          </CardContent>
           <CardFooter>
            <Button variant="outline" onClick={() => navigator.clipboard.writeText(generatedContent).then(() => toast({title: "Copied to clipboard!"}))}>
              Copy Content
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
