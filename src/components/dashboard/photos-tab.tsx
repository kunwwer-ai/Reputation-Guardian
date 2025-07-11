
"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEncyclopediaContext } from "@/contexts/encyclopedia-context";
import type { EncyclopediaSourceLink } from "@/types";
import { ImageIcon, ImageOff } from "lucide-react"; // Added ImageOff

interface ImageItem {
  id: string;
  src: string;
  alt: string;
  originalUrl: string;
  dataAiHint?: string;
}

// Helper to extract 1-2 keywords from a title for data-ai-hint
const getKeywordsForHint = (title: string): string => {
  if (!title) return "photo";
  const words = title.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
  // Prioritize meaningful words, avoid generic terms if possible (simple filter)
  const commonWords = new Set(["a", "an", "the", "is", "of", "in", "on", "at", "for", "with", "photo", "image", "picture"]);
  const significantWords = words.filter(word => word.length > 2 && !commonWords.has(word));
  
  if (significantWords.length >= 2) {
    return `${significantWords[0]} ${significantWords[1]}`;
  } else if (significantWords.length === 1) {
    return significantWords[0];
  } else if (words.length > 0) { // Fallback to any first 1-2 words if no significant ones
    return words.slice(0, 2).join(" ");
  }
  return "photo"; // Default hint
};


export function PhotoGalleryTab() {
  const { entries } = useEncyclopediaContext();
  const [isLoading, setIsLoading] = useState(true);

  const imageItems = useMemo((): ImageItem[] => {
    if (!entries) return [];
    const collectedImages: ImageItem[] = [];
    const imageExtensions = /\.(jpeg|jpg|gif|png|webp)$/i;

    entries.forEach(entry => {
      if (entry.source_links) {
        entry.source_links.forEach(link => {
          if (link.url && imageExtensions.test(link.url)) {
            let hint = "photo";
            if (link.url.includes("placehold.co")) {
              hint = getKeywordsForHint(link.title || link.excerpt || "placeholder");
            }
            collectedImages.push({
              id: link.id,
              src: link.url,
              alt: link.title || `Image from ${link.platform || 'source'}`,
              originalUrl: link.url,
              dataAiHint: link.url.includes("placehold.co") ? hint : undefined,
            });
          }
        });
      }
    });
    return collectedImages;
  }, [entries]);

  useEffect(() => {
    if (entries) {
      setIsLoading(false);
    }
  }, [entries]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold font-headline tracking-tight flex items-center">
          <ImageIcon className="mr-2 h-6 w-6 text-primary" /> Photo Gallery
        </h2>
        <Card className="shadow-lg">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-1/3 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-1/2 mt-1 animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="aspect-square bg-muted rounded-lg shadow animate-pulse"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold font-headline tracking-tight flex items-center">
        <ImageIcon className="mr-2 h-6 w-6 text-primary" /> Photo Gallery
      </h2>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Image Collection</CardTitle>
          <CardDescription>
            Images sourced from direct links in your Encyclopedia entries. Click an image to view original.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {imageItems.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {imageItems.map(item => (
                <Link key={item.id} href={item.originalUrl} target="_blank" rel="noopener noreferrer" className="block group">
                  <Card className="overflow-hidden shadow hover:shadow-md transition-shadow h-full flex flex-col">
                    <div className="aspect-square relative w-full">
                      <Image 
                        src={item.src} 
                        alt={item.alt} 
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        data-ai-hint={item.dataAiHint}
                        onError={(e) => {
                            // Optional: handle image loading errors, e.g., replace with a placeholder
                            console.warn(`Error loading image: ${item.src}`);
                            // e.currentTarget.src = 'https://placehold.co/300x300.png?text=Error'; 
                        }}
                      />
                    </div>
                    <CardContent className="p-2 flex-grow">
                        <p className="text-xs text-muted-foreground truncate" title={item.alt}>{item.alt}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-muted-foreground/50 rounded-lg">
              <ImageOff className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No direct image links found in your Encyclopedia.</p>
              <p className="text-sm text-muted-foreground">Add links ending with .jpg, .png, etc., to see them here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
