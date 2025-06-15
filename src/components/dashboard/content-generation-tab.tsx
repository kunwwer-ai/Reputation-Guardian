
"use client";

import type { Mention, GenerateDerivedContentResult, GenerateDerivedContentInput } from "@/types";
import { initialMockMentions } from "./mentions-tab"; // Re-use mock data
import { useState, useEffect, useTransition } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { generateDerivedContentAction } from "@/app/actions/content-actions";
import { Loader2, Sparkles } from "lucide-react";

const contentTypes: GenerateDerivedContentInput['contentType'][] = [
  "Summary",
  "Tweet",
  "LinkedIn Post",
  "Key Takeaways",
  "Press Release Snippet",
];

export function ContentGenerationTab() {
  const [newsItems, setNewsItems] = useState<Mention[]>([]);
  const [selectedNewsId, setSelectedNewsId] = useState<string | undefined>(undefined);
  const [selectedContentType, setSelectedContentType] = useState<GenerateDerivedContentInput['contentType'] | undefined>(contentTypes[0]);
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [isGenerating, startGenerating] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    const filteredNews = initialMockMentions.filter(
      (mention) => mention.source_type === "news"
    );
    setNewsItems(filteredNews);
    if (filteredNews.length > 0) {
      setSelectedNewsId(filteredNews[0].id);
    }
  }, []);

  const handleGenerateContent = async () => {
    if (!selectedNewsId || !selectedContentType) {
      toast({ variant: "destructive", title: "Error", description: "Please select a news item and a content type." });
      return;
    }

    const selectedNewsItem = newsItems.find(item => item.id === selectedNewsId);
    if (!selectedNewsItem) {
      toast({ variant: "destructive", title: "Error", description: "Selected news item not found." });
      return;
    }

    setGeneratedContent(""); // Clear previous content
    startGenerating(async () => {
      try {
        const result: GenerateDerivedContentResult = await generateDerivedContentAction({
          newsTitle: selectedNewsItem.title,
          newsExcerpt: selectedNewsItem.content_excerpt,
          contentType: selectedContentType,
        });
        setGeneratedContent(result.generatedText);
        toast({ title: "Content Generated", description: `${selectedContentType} has been successfully generated.` });
      } catch (error: any) {
        toast({ variant: "destructive", title: "Generation Failed", description: error.message || "Could not generate content." });
      }
    });
  };

  const selectedNewsDetails = newsItems.find(item => item.id === selectedNewsId);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold font-headline tracking-tight">Content Generation</h2>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Select News Item & Content Type</CardTitle>
          <CardDescription>Choose a news item and the type of content you want to generate based on it.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="news-item-select">News Item</Label>
              <Select value={selectedNewsId} onValueChange={setSelectedNewsId}>
                <SelectTrigger id="news-item-select" className="w-full">
                  <SelectValue placeholder="Select a news item..." />
                </SelectTrigger>
                <SelectContent>
                  {newsItems.map(item => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.title} ({item.platform})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="content-type-select">Content Type</Label>
              <Select value={selectedContentType} onValueChange={(value) => setSelectedContentType(value as GenerateDerivedContentInput['contentType'])}>
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
                {selectedNewsDetails.content_excerpt}
              </CardDescription>
            </Card>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerateContent} disabled={isGenerating || !selectedNewsId || !selectedContentType}>
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
