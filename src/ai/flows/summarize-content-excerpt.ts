// Summarizes content excerpts from mentions using AI.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeContentExcerptInputSchema = z.object({
  contentExcerpt: z
    .string()
    .describe('The content excerpt to summarize.'),
});

export type SummarizeContentExcerptInput =
  z.infer<typeof SummarizeContentExcerptInputSchema>;

const SummarizeContentExcerptOutputSchema = z.object({
  summary: z.string().describe('The summarized content excerpt.'),
});

export type SummarizeContentExcerptOutput =
  z.infer<typeof SummarizeContentExcerptOutputSchema>;

export async function summarizeContentExcerpt(
  input: SummarizeContentExcerptInput
): Promise<SummarizeContentExcerptOutput> {
  return summarizeContentExcerptFlow(input);
}

const summarizeContentExcerptPrompt = ai.definePrompt({
  name: 'summarizeContentExcerptPrompt',
  input: {schema: SummarizeContentExcerptInputSchema},
  output: {schema: SummarizeContentExcerptOutputSchema},
  prompt: `Summarize the following content excerpt:\n\n{{{contentExcerpt}}}`,
});

const summarizeContentExcerptFlow = ai.defineFlow(
  {
    name: 'summarizeContentExcerptFlow',
    inputSchema: SummarizeContentExcerptInputSchema,
    outputSchema: SummarizeContentExcerptOutputSchema,
  },
  async input => {
    const {output} = await summarizeContentExcerptPrompt(input);
    return output!;
  }
);
