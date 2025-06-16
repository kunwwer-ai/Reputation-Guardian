
"use client";

import type { Mention, RiskAnalysisResult, ContentSummaryResult, EncyclopediaSourceLink } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, Info, MessageSquare, BarChartBig, Sparkles, Loader2, ExternalLink, Archive } from "lucide-react";
import { useState, useTransition, useEffect } from "react"; // Added useEffect here
import { analyzeMentionRiskAction, summarizeExcerptAction } from "@/app/actions/mention-actions";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MentionCardProps {
  mention: Mention; // This now includes originalEntryId and originalLinkId
  onUpdateMention: (updatedMention: Mention) => void;
}

export function MentionCard({ mention: initialMention, onUpdateMention }: MentionCardProps) {
  const [mention, setMention] = useState(initialMention); // Local state for immediate UI updates
  const [isAnalyzing, startAnalyzing] = useTransition();
  const [isSummarizing, startSummarizing] = useTransition();
  const { toast } = useToast();

  const [showFullExcerpt, setShowFullExcerpt] = useState(false);
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);
  
  // Evidence state now directly uses mention.archived_evidence
  const [evidenceNotes, setEvidenceNotes] = useState(mention.archived_evidence?.notes || "");
  const [evidenceScreenshotUrl, setEvidenceScreenshotUrl] = useState(mention.archived_evidence?.screenshot_url || "");
  const [evidenceWaybackLink, setEvidenceWaybackLink] = useState(mention.archived_evidence?.wayback_link || "");


  // Update local state if initialMention prop changes (e.g., from parent re-render)
  useEffect(() => {
    setMention(initialMention);
    setEvidenceNotes(initialMention.archived_evidence?.notes || "");
    setEvidenceScreenshotUrl(initialMention.archived_evidence?.screenshot_url || "");
    setEvidenceWaybackLink(initialMention.archived_evidence?.wayback_link || "");
  }, [initialMention]);

  const handleAnalyzeRisk = async () => {
    startAnalyzing(async () => {
      try {
        const result: RiskAnalysisResult = await analyzeMentionRiskAction({
          title: mention.title,
          contentExcerpt: mention.content_excerpt,
          sourceType: mention.source_type,
          platform: mention.platform,
        });
        
        let riskColor: Mention['risk_color'] = '🟡';
        if (result.riskLevel === 'RED') riskColor = '🔴';
        else if (result.riskLevel === 'GREEN') riskColor = '🟢';

        const updatedMentionData: Partial<Mention> = {
          risk_color: riskColor,
          sentiment: result.sentiment as Mention['sentiment'],
          gpt_analysis: result.analysis,
        };
        
        const updatedFullMention = { ...mention, ...updatedMentionData };
        setMention(updatedFullMention); // Update local state immediately
        onUpdateMention(updatedFullMention); // Propagate to parent (and then context)

        toast({
          title: "Analysis Complete",
          description: `Risk level: ${result.riskLevel}, Sentiment: ${result.sentiment}`,
        });
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: error.message || "Could not analyze risk.",
        });
      }
    });
  };

  const handleSummarizeExcerpt = async () => {
    startSummarizing(async () => {
      try {
        const result: ContentSummaryResult = await summarizeExcerptAction({
          contentExcerpt: mention.content_excerpt,
        });
        
        const updatedMentionData: Partial<Mention> = {
            content_excerpt: result.summary,
        };
        const updatedFullMention = { ...mention, ...updatedMentionData };
        setMention(updatedFullMention); // Update local state immediately
        onUpdateMention(updatedFullMention); // Propagate to parent

        toast({
          title: "Summarization Complete",
          description: "Content excerpt has been summarized.",
        });
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Summarization Failed",
          description: error.message || "Could not summarize excerpt.",
        });
      }
    });
  };

  const getSentimentBadgeVariant = (sentiment?: 'positive' | 'negative' | 'neutral') => {
    switch (sentiment) {
      case 'positive': return 'default'; 
      case 'negative': return 'destructive';
      case 'neutral': return 'secondary';
      default: return 'outline';
    }
  };

  const getRiskIcon = (riskColor?: '🔴' | '🟡' | '🟢') => {
    switch (riskColor) {
      case '🔴': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case '🟡': return <Info className="h-5 w-5 text-yellow-500" />;
      case '🟢': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default: return <MessageSquare className="h-5 w-5 text-gray-400" />;
    }
  };

  const truncateText = (text: string, maxLength: number, isExpanded: boolean) => {
    if (isExpanded || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const handleSaveEvidence = () => {
    const updatedEvidence = {
        notes: evidenceNotes,
        screenshot_url: evidenceScreenshotUrl,
        wayback_link: evidenceWaybackLink,
    };
    const updatedFullMention = { ...mention, archived_evidence: updatedEvidence };
    setMention(updatedFullMention); // Update local state
    onUpdateMention(updatedFullMention); // Propagate to parent
    toast({ title: "Evidence Saved", description: "Archived evidence has been updated." });
  };


  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-headline">{mention.title}</CardTitle>
            <CardDescription className="text-sm">
              <a href={mention.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                {mention.platform} <ExternalLink className="h-3 w-3" />
              </a> - {new Date(mention.timestamp).toLocaleDateString()} ({mention.source_type})
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {mention.risk_color && getRiskIcon(mention.risk_color)}
            {mention.sentiment && (
              <Badge variant={getSentimentBadgeVariant(mention.sentiment)} className="capitalize">{mention.sentiment}</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 flex-grow">
        <div>
          <p className="text-sm text-foreground leading-relaxed">
            {truncateText(mention.content_excerpt, 200, showFullExcerpt)}
          </p>
          {mention.content_excerpt.length > 200 && (
            <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => setShowFullExcerpt(!showFullExcerpt)}>
              {showFullExcerpt ? "Show Less" : "Show More"}
            </Button>
          )}
        </div>
        
        {mention.gpt_analysis && (
          <div className="p-3 bg-secondary/50 rounded-md border border-secondary">
            <h4 className="font-semibold text-sm mb-1">AI Analysis:</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {truncateText(mention.gpt_analysis, 150, showFullAnalysis)}
            </p>
            {mention.gpt_analysis.length > 150 && (
               <Button variant="link" size="sm" className="p-0 h-auto text-xs" onClick={() => setShowFullAnalysis(!showFullAnalysis)}>
                {showFullAnalysis ? "Show Less" : "Show More"}
              </Button>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 justify-between items-center pt-4">
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={handleAnalyzeRisk} disabled={isAnalyzing}>
            {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BarChartBig className="mr-2 h-4 w-4" />}
            Analyze Risk
          </Button>
          <Button variant="outline" size="sm" onClick={handleSummarizeExcerpt} disabled={isSummarizing}>
            {isSummarizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Summarize
          </Button>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Archive className="mr-2 h-4 w-4" /> Archive Evidence
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Archive Evidence for: {mention.title}</DialogTitle>
              <DialogDescription>Store URLs for screenshots, Wayback Machine links, and other notes.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-1">
                <Label htmlFor="screenshot_url">Screenshot URL</Label>
                <Input id="screenshot_url" value={evidenceScreenshotUrl} onChange={(e) => setEvidenceScreenshotUrl(e.target.value)} placeholder="https://example.com/image.png" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="wayback_link">Wayback Machine Link</Label>
                <Input id="wayback_link" value={evidenceWaybackLink} onChange={(e) => setEvidenceWaybackLink(e.target.value)} placeholder="https://web.archive.org/..." />
              </div>
              <div className="space-y-1">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" value={evidenceNotes} onChange={(e) => setEvidenceNotes(e.target.value)} placeholder="Additional notes about this evidence..." />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
                <Button type="button" onClick={() => {
                    handleSaveEvidence();
                    // Attempt to close dialog. A more robust way might involve controlling open state via prop.
                    const closeButton = (document.querySelector('[role="dialog"]') as HTMLElement)?.querySelector('button[aria-label="Close"], button:not([type="submit"])');
                    if (closeButton instanceof HTMLElement) closeButton.click();
                }}>Save Evidence</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}

