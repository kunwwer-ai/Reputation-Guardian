"use server";

import { scrapeAndAnalyzeWebsite as scrapeAndAnalyzeWebsiteFlow } from "@/ai/flows/scrape-website-flow";
import type { ScrapeWebsiteOutput } from "@/ai/flows/scrape-website-flow";

export async function scrapeUrlAction(params: { url: string; cssSelector?: string }): Promise<ScrapeWebsiteOutput> {
  const { url, cssSelector } = params;
  const apiKey = process.env.SCRAPING_API_KEY;

  if (!apiKey) {
    throw new Error("Scraping API key is not configured. Please set SCRAPING_API_KEY in your environment variables.");
  }

  // Using a third-party scraping service to avoid IP blocks and handle JavaScript rendering.
  // The service used here is a common example (ScraperAPI), but can be swapped with any other service.
  const scraperApiUrl = `http://api.scraperapi.com?api_key=${apiKey}&url=${encodeURIComponent(url)}`;

  try {
    const response = await fetch(scraperApiUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch URL via scraping service: ${response.status} ${response.statusText}`);
    }

    const htmlContent = await response.text();

    // Pass the raw HTML and optional selector to our AI flow for analysis.
    const result = await scrapeAndAnalyzeWebsiteFlow({ htmlContent, cssSelector });
    return result;

  } catch (error: any) {
    console.error("Error scraping URL:", error);
    // Provide a more user-friendly error message
    if (error.message.includes('fetch') || error.name === 'TypeError') {
      throw new Error("Could not retrieve content from the URL. The scraping service may be down or the target site is heavily protected.");
    }
    throw new Error("Failed to scrape and analyze the URL. Please try again.");
  }
}
