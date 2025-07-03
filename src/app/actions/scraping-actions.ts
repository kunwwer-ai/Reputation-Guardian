"use server";

import { scrapeAndAnalyzeWebsite as scrapeAndAnalyzeWebsiteFlow } from "@/ai/flows/scrape-website-flow";
import type { ScrapeWebsiteOutput } from "@/ai/flows/scrape-website-flow";

export async function scrapeUrlAction(params: { url: string; cssSelector?: string }): Promise<ScrapeWebsiteOutput> {
  const { url, cssSelector } = params;
  const apiKey = process.env.SCRAPING_API_KEY;

  if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
    throw new Error("Scraping API key is not configured. Please add it to your .env file.");
  }

  try {
    // Construct the URL for the external scraping service
    const scraperApiUrl = `http://api.scraperapi.com?api_key=${apiKey}&url=${encodeURIComponent(url)}`;
    
    const response = await fetch(scraperApiUrl);

    if (!response.ok) {
      throw new Error(`Scraping API failed: ${response.status} ${response.statusText}`);
    }

    const htmlContent = await response.text();

    // Pass the raw HTML and optional selector to our AI flow for analysis.
    const result = await scrapeAndAnalyzeWebsiteFlow({ htmlContent, cssSelector });
    return result;

  } catch (error: any) {
    console.error("Error scraping URL:", error);
    // Provide a more user-friendly error message
    if (error.message.includes('fetch') || error.name === 'TypeError' || error.message.includes('Invalid URL')) {
      throw new Error("Could not retrieve content from the URL. Please check if the URL is correct and accessible via the scraping service.");
    }
     if (error.message.includes('Scraping API key')) {
        throw error;
    }
    throw new Error("Failed to scrape and analyze the URL. Please try again.");
  }
}
