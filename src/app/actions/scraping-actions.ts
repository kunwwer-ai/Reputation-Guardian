"use server";

import { scrapeAndAnalyzeWebsite as scrapeAndAnalyzeWebsiteFlow } from "@/ai/flows/scrape-website-flow";
import type { ScrapeWebsiteOutput } from "@/ai/flows/scrape-website-flow";

export async function scrapeUrlAction(params: { url: string; cssSelector?: string }): Promise<ScrapeWebsiteOutput> {
  const { url, cssSelector } = params;

  try {
    // Using a direct fetch with a realistic User-Agent.
    // For production-grade scraping that needs to handle blocks, proxies, or JavaScript rendering,
    // this is where you would integrate a service like BrightData, ScraperAPI, etc.
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
    }

    const htmlContent = await response.text();

    // Pass the raw HTML and optional selector to our AI flow for analysis.
    const result = await scrapeAndAnalyzeWebsiteFlow({ htmlContent, cssSelector });
    return result;

  } catch (error: any) {
    console.error("Error scraping URL:", error);
    // Provide a more user-friendly error message
    if (error.message.includes('fetch') || error.name === 'TypeError' || error.message.includes('Invalid URL')) {
      throw new Error("Could not retrieve content from the URL. Please check if the URL is correct and accessible.");
    }
    throw new Error("Failed to scrape and analyze the URL. Please try again.");
  }
}
