
"use client";

import type { Mention, RiskAnalysisResult, ContentSummaryResult } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, Info, MessageSquare, BarChartBig, Sparkles, Loader2, ExternalLink, Archive } from "lucide-react";
import { useState, useTransition } from "react";
import { analyzeMentionRiskAction, summarizeExcerptAction } from "@/app/actions/mention-actions";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MentionCardProps {
  mention: Mention;
  onUpdateMention: (updatedMention: Mention) => void;
}

export function MentionCard({ mention, onUpdateMention }: MentionCardProps) {
  const [isAnalyzing, startAnalyzing] = useTransition();
  const [isSummarizing, startSummarizing] = useTransition();
  const { toast } = useToast();

  const [showFullExcerpt, setShowFullExcerpt] = useState(false);
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);

  const handleAnalyzeRisk = async () => {
    startAnalyzing(async () => {
      try {
        const result: RiskAnalysisResult = await analyzeMentionRiskAction({
          title: mention.title,
          contentExcerpt: mention.content_excerpt,
          sourceType: mention.source_type,
          platform: mention.platform,
        });
        
        let riskColor: '🔴' | '🟡' | '🟢' = '🟡';
        if (result.riskLevel === 'RED') riskColor = '🔴';
        else if (result.riskLevel === 'GREEN') riskColor = '🟢';

        onUpdateMention({
          ...mention,
          risk_color: riskColor,
          sentiment: result.sentiment,
          gpt_analysis: result.analysis,
        });

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
        onUpdateMention({ ...mention, content_excerpt: result.summary }); // Or store summary in a new field
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
      case 'positive': return 'default'; // Blueish (primary)
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


  const [evidence, setEvidence] = useState(mention.archived_evidence || {});

  const handleSaveEvidence = () => {
    onUpdateMention({ ...mention, archived_evidence: evidence });
    toast({ title: "Evidence Saved", description: "Archived evidence has been updated." });
  };


  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-headline">{mention.title}</CardTitle>
            <CardDescription className="text-sm">
              <a href={mention.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                {mention.platform} <ExternalLink className="h-3 w-3" />
              </a> - {new Date(mention.timestamp).toLocaleDateString()}
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
      <CardContent className="space-y-3">
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
      <CardFooter className="flex flex-wrap gap-2 justify-between">
        <div className="flex gap-2">
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
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="screenshot_url" className="text-right">Screenshot URL</Label>
                <Input id="screenshot_url" value={evidence.screenshot_url || ""} onChange={(e) => setEvidence({...evidence, screenshot_url: e.target.value})} className="col-span-3" placeholder="https://example.com/image.png" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="wayback_link" className="text-right">Wayback Link</Label>
                <Input id="wayback_link" value={evidence.wayback_link || ""} onChange={(e) => setEvidence({...evidence, wayback_link: e.target.value})} className="col-span-3" placeholder="https://web.archive.org/..." />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">Notes</Label>
                <Textarea id="notes" value={evidence.notes || ""} onChange={(e) => setEvidence({...evidence, notes: e.target.value})} className="col-span-3" placeholder="Additional notes..." />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button type="button" onClick={handleSaveEvidence}>Save Evidence</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
