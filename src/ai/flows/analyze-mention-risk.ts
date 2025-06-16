'use server';

/**
 * @fileOverview AI flow for analyzing the risk level of an online mention.
 *
 * - analyzeMentionRisk - Function to analyze the risk level of a mention.
 * - AnalyzeMentionRiskInput - Input type for the analyzeMentionRisk function.
 * - AnalyzeMentionRiskOutput - Output type for the analyzeMentionRisk function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeMentionRiskInputSchema = z.object({
  title: z.string().describe('Title of the online mention.'),
  contentExcerpt: z.string().describe('Excerpt from the online mention.'),
  sourceType: z.string().describe('Type of source (e.g., search engine, social media, news).'),
  platform: z.string().describe('Specific platform where the mention appeared (e.g., Google, Twitter).'),
});
export type AnalyzeMentionRiskInput = z.infer<typeof AnalyzeMentionRiskInputSchema>;

const AnalyzeMentionRiskOutputSchema = z.object({
  riskLevel: z
    .string()
    .describe(
      'The risk level of the mention (RED, ORANGE, or GREEN), representing high, medium, and low risk, respectively.' // Updated YELLOW to ORANGE
    ),
  sentiment: z.string().describe('The sentiment of the mention (positive, negative, or neutral).'),
  analysis: z.string().describe('A detailed analysis of the mention and the reasoning behind the risk level.'),
});
export type AnalyzeMentionRiskOutput = z.infer<typeof AnalyzeMentionRiskOutputSchema>;

export async function analyzeMentionRisk(input: AnalyzeMentionRiskInput): Promise<AnalyzeMentionRiskOutput> {
  return analyzeMentionRiskFlow(input);
}

const analyzeMentionRiskPrompt = ai.definePrompt({
  name: 'analyzeMentionRiskPrompt',
  input: {schema: AnalyzeMentionRiskInputSchema},
  output: {schema: AnalyzeMentionRiskOutputSchema},
  prompt: `You are an AI expert in online reputation management. Analyze the risk level of the following online mention and determine its sentiment.

Title: {{title}}
Content Excerpt: {{contentExcerpt}}
Source Type: {{sourceType}}
Platform: {{platform}}

Provide a riskLevel (RED, ORANGE, or GREEN) and a sentiment (positive, negative, or neutral). Also, provide a detailed analysis of the mention and the reasoning behind the risk level.
RED signifies high risk, immediate attention needed.
ORANGE signifies medium risk, potential concern.
GREEN signifies low risk, minor or no concern.

Ensure that the response is returned in JSON format.
`, // Updated YELLOW to ORANGE in prompt
});

const analyzeMentionRiskFlow = ai.defineFlow(
  {
    name: 'analyzeMentionRiskFlow',
    inputSchema: AnalyzeMentionRiskInputSchema,
    outputSchema: AnalyzeMentionRiskOutputSchema,
  },
  async input => {
    const {output} = await analyzeMentionRiskPrompt(input);
    return output!;
  }
);
