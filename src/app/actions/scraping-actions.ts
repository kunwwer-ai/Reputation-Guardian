"use server";

import { scrapeAndAnalyzeWebsite as scrapeAndAnalyzeWebsiteFlow } from "@/ai/flows/scrape-website-flow";
import type { ScrapeWebsiteOutput } from "@/ai/flows/scrape-website-flow";

export async function scrapeUrlAction(params: { url: string; cssSelector?: string }): Promise<ScrapeWebsiteOutput> {
  const { url, cssSelector } = params;
  const apiKey = process.env.SCRAPING_API_KEY;
  const apiEndpoint = process.env.SCRAPING_API_ENDPOINT;

  let htmlContent = "";

  try {
    // If API Key and Endpoint are configured, use the third-party scraping service
    if (apiKey && apiKey !== "YOUR_API_KEY_HERE" && apiEndpoint) {
      const scraperApiUrl = apiEndpoint
        .replace("{API_KEY}", apiKey)
        .replace("{URL}", encodeURIComponent(url));
      
      const response = await fetch(scraperApiUrl);

      if (!response.ok) {
        throw new Error(`Scraping API failed: ${response.status} ${response.statusText}`);
      }
      htmlContent = await response.text();

    } else {
      // Fallback to a direct fetch if no API key is configured
      console.log("No scraping API key configured, falling back to direct fetch.");
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      if (!response.ok) {
        throw new Error(`Direct fetch failed: ${response.status} ${response.statusText}`);
      }
      htmlContent = await response.text();
    }

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
