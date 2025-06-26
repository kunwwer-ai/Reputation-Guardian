"use server";

import { scrapeAndAnalyzeWebsite as scrapeAndAnalyzeWebsiteFlow } from "@/ai/flows/scrape-website-flow";
import type { ScrapeWebsiteOutput } from "@/ai/flows/scrape-website-flow";

export async function scrapeUrlAction(url: string): Promise<ScrapeWebsiteOutput> {
  try {
    const response = await fetch(url, {
      headers: {
        // Some sites block requests without a user-agent, so we pretend to be a browser.
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
    }

    const htmlContent = await response.text();

    // Pass the raw HTML to our flow, which will handle cleaning it up.
    const result = await scrapeAndAnalyzeWebsiteFlow({ htmlContent });
    return result;

  } catch (error: any) {
    console.error("Error scraping URL:", error);
    // Provide a more user-friendly error message
    if (error.message.includes('fetch') || error.name === 'TypeError') {
      throw new Error("Could not retrieve content from the URL. It may be inaccessible or block automated requests.");
    }
    throw new Error("Failed to scrape and analyze the URL. Please try again.");
  }
}
