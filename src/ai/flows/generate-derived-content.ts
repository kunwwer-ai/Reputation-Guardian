
'use server';
/**
 * @fileOverview AI flow for generating derived content from news items.
 *
 * - generateDerivedContent - Function to generate content based on news details and content type.
 * - GenerateDerivedContentInput - Input type for the flow.
 * - GenerateDerivedContentOutput - Output type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { GenerateDerivedContentInput as ApiInputType } from '@/types';

// Define Zod schema based on the TypeScript interface
const GenerateDerivedContentInputSchema = z.object({
  newsTitle: z.string().describe('The title of the news item.'),
  newsExcerpt: z.string().describe('The excerpt or summary of the news item.'),
  contentType: z.enum(["Summary", "Tweet", "LinkedIn Post", "Key Takeaways", "Press Release Snippet"])
    .describe('The type of content to generate (e.g., "Summary", "Tweet").'),
});
export type GenerateDerivedContentInput = z.infer<typeof GenerateDerivedContentInputSchema>;


const GenerateDerivedContentOutputSchema = z.object({
  generatedText: z.string().describe('The AI-generated content.'),
});
export type GenerateDerivedContentOutput = z.infer<typeof GenerateDerivedContentOutputSchema>;


export async function generateDerivedContent(input: GenerateDerivedContentInput): Promise<GenerateDerivedContentOutput> {
  return generateDerivedContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDerivedContentPrompt',
  input: {schema: GenerateDerivedContentInputSchema},
  output: {schema: GenerateDerivedContentOutputSchema},
  prompt: `You are an expert content creator and public relations specialist.
Your task is to generate a "{{contentType}}" based on the following news item.

News Item Title: {{{newsTitle}}}
News Item Excerpt: {{{newsExcerpt}}}

Follow these specific instructions based on the contentType:
- If "{{contentType}}" is "Summary": Provide a concise, neutral summary of the news item in 2-3 sentences.
- If "{{contentType}}" is "Tweet": Draft a tweet (max 280 characters). Include 1-2 relevant hashtags. Make it engaging.
- If "{{contentType}}" is "LinkedIn Post": Draft a professional LinkedIn post. It can be a bit longer than a tweet. Focus on insights or discussion points. Include relevant hashtags.
- If "{{contentType}}" is "Key Takeaways": List 3-4 bullet points highlighting the key information or implications of the news.
- If "{{contentType}}" is "Press Release Snippet": Write a short paragraph (2-4 sentences) that could be used in a press release related to this news. Maintain a formal and objective tone.

Ensure your output is ONLY the generated content itself, without any preamble or extra formatting unless specified by the content type (e.g., bullet points for Key Takeaways).
`,
});

const generateDerivedContentFlow = ai.defineFlow(
  {
    name: 'generateDerivedContentFlow',
    inputSchema: GenerateDerivedContentInputSchema,
    outputSchema: GenerateDerivedContentOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
