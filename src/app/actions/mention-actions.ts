
"use server";

import { analyzeMentionRisk as analyzeMentionRiskFlow, AnalyzeMentionRiskInput } from "@/ai/flows/analyze-mention-risk";
import { summarizeContentExcerpt as summarizeContentExcerptFlow, SummarizeContentExcerptInput } from "@/ai/flows/summarize-content-excerpt";
import type { RiskAnalysisResult, ContentSummaryResult } from "@/types";

export async function analyzeMentionRiskAction(
  input: AnalyzeMentionRiskInput
): Promise<RiskAnalysisResult> {
  try {
    const result = await analyzeMentionRiskFlow(input);
    // The flow already returns riskLevel, sentiment, analysis.
    // We just need to ensure the types match.
    return result as RiskAnalysisResult;
  } catch (error) {
    console.error("Error analyzing mention risk:", error);
    throw new Error("Failed to analyze mention risk. Please try again.");
  }
}

export async function summarizeExcerptAction(
  input: SummarizeContentExcerptInput
): Promise<ContentSummaryResult> {
  try {
    const result = await summarizeContentExcerptFlow(input);
    return result;
  } catch (error) {
    console.error("Error summarizing excerpt:", error);
    throw new Error("Failed to summarize excerpt. Please try again.");
  }
}
