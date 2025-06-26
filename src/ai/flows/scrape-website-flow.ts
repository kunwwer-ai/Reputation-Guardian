'use server';
/**
 * @fileOverview An AI flow for scraping and analyzing website content.
 *
 * - scrapeAndAnalyzeWebsite - A function that handles the website scraping and analysis process.
 * - ScrapeWebsiteInput - The input type for the scrapeAndAnalyzeWebsite function.
 * - ScrapeWebsiteOutput - The return type for the scrapeAndAnalyzeWebsite function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { JSDOM } from 'jsdom';

const ScrapeWebsiteInputSchema = z.object({
  htmlContent: z.string().describe('The full HTML content of a webpage.'),
  cssSelector: z.string().optional().describe('An optional CSS selector to target a specific part of the page for analysis.'),
});
export type ScrapeWebsiteInput = z.infer<typeof ScrapeWebsiteInputSchema>;

const ScrapeWebsiteOutputSchema = z.object({
  title: z.string().describe('The main title of the article or webpage.'),
  summary: z.string().describe('A concise summary of the main content, about 2-4 sentences long.'),
  platform: z.string().describe('The name of the website or platform (e.g., Forbes, TechCrunch, YouTube).'),
});
export type ScrapeWebsiteOutput = z.infer<typeof ScrapeWebsiteOutputSchema>;


const InternalFlowInputSchema = z.object({
  textContent: z.string().describe('The main text content of a webpage body.'),
});

// This is the main exported function that will be called by server actions.
// It preprocesses the HTML to extract clean text, making the AI's job easier and more efficient.
export async function scrapeAndAnalyzeWebsite(input: ScrapeWebsiteInput): Promise<ScrapeWebsiteOutput> {
  const dom = new JSDOM(input.htmlContent);
  const document = dom.window.document;
  
  let targetElement: HTMLElement | null = null;
  // If a CSS selector is provided, try to use it.
  if (input.cssSelector) {
    try {
      targetElement = document.querySelector(input.cssSelector);
      if (!targetElement) {
        console.warn(`CSS selector "${input.cssSelector}" not found on the page. Falling back to the full body content.`);
      }
    } catch (error) {
      console.error(`Invalid CSS selector provided: "${input.cssSelector}". Falling back to body.`, error);
    }
  }

  // Use the specific element's text if found, otherwise fall back to the whole body.
  const contentSource = targetElement || document.body;
  const bodyText = contentSource.textContent || '';
  
  // Limit the text content to avoid exceeding token limits for very large pages.
  // A reasonable limit to capture most articles without being excessive.
  const truncatedText = bodyText.substring(0, 25000); 

  // Call the internal flow with the cleaned and truncated text content.
  return scrapeAndAnalyzeWebsiteFlow({ textContent: truncatedText });
}


const prompt = ai.definePrompt({
  name: 'scrapeAndAnalyzeWebsitePrompt',
  input: {schema: InternalFlowInputSchema},
  output: {schema: ScrapeWebsiteOutputSchema},
  prompt: `You are an expert web content analysis engine. Your task is to extract structured information from the raw text content of a webpage.

Analyze the following text content and perform these actions:
1.  **Extract the Title**: Identify the most prominent and accurate title for the article or page.
2.  **Generate a Summary**: Create a concise, neutral summary of the main content. It should be approximately 2-4 sentences long.
3.  **Identify the Platform**: Determine the name of the website or publication this content is from (e.g., "Forbes", "Wikipedia", "The New York Times"). If it's a social media site, name the site (e.g., "YouTube", "LinkedIn").

Webpage Text Content:
{{{textContent}}}

Return ONLY the structured JSON output.`,
});

// This is the internal flow that works with the cleaned text.
const scrapeAndAnalyzeWebsiteFlow = ai.defineFlow(
  {
    name: 'scrapeAndAnalyzeWebsiteFlow',
    inputSchema: InternalFlowInputSchema,
    outputSchema: ScrapeWebsiteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
