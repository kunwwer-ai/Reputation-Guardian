
"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEncyclopediaContext } from "@/contexts/encyclopedia-context";
import type { EncyclopediaSourceLink } from "@/types";
import { ImageIcon, ImageOff } from "lucide-react"; 

interface ImageItem {
  id: string;
  src: string;
  alt: string;
  originalUrl: string;
  dataAiHint?: string;
}

const getKeywordsForHint = (title: string): string => {
  if (!title) return "photo";
  const words = title.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
  const commonWords = new Set(["a", "an", "the", "is", "of", "in", "on", "at", "for", "with", "photo", "image", "picture", "gallery"]);
  const significantWords = words.filter(word => word.length > 2 && !commonWords.has(word));
  
  if (significantWords.length >= 2) {
    return `${significantWords[0]} ${significantWords[1]}`;
  } else if (significantWords.length === 1) {
    return significantWords[0];
  } else if (words.length > 0) { 
    return words.slice(0, 2).join(" ");
  }
  return "photo"; 
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
            let hint: string | undefined = undefined;
            if (link.url.includes("placehold.co")) {
              hint = getKeywordsForHint(link.title || link.excerpt || "placeholder image");
            }
            collectedImages.push({
              id: link.id,
              src: link.url,
              alt: link.title || `Image from ${link.platform || 'source'}`,
              originalUrl: link.url,
              dataAiHint: hint,
            });
          }
        });
      }
    });
    // Sort by title for consistent order
    return collectedImages.sort((a,b) => a.alt.localeCompare(b.alt));
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
              {[...Array(10)].map((_, i) => ( // Show more skeleton loaders
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
            Images sourced from direct links in your Encyclopedia entries. Click an image to view the original.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {imageItems.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {imageItems.map(item => (
                <Link key={item.id} href={item.originalUrl} target="_blank" rel="noopener noreferrer" className="block group">
                  <Card className="overflow-hidden shadow hover:shadow-xl transition-all duration-300 ease-in-out h-full flex flex-col bg-card hover:border-primary">
                    <div className="aspect-square relative w-full overflow-hidden rounded-t-lg">
                      <Image 
                        src={item.src} 
                        alt={item.alt} 
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        data-ai-hint={item.dataAiHint}
                        unoptimized={item.src.startsWith('http://') || item.src.startsWith('https://') && !item.src.includes('placehold.co')} // Avoid optimizing if not from placehold.co or known domain
                        onError={(e) => {
                            console.warn(`Error loading image: ${item.src}`);
                            const target = e.target as HTMLImageElement;
                            target.srcset = 'https://placehold.co/300x300/F0F4F7/7689A6?text=Error'; // Fallback to a placeholder
                            target.src = 'https://placehold.co/300x300/F0F4F7/7689A6?text=Error';
                        }}
                      />
                    </div>
                    <div className="p-3 border-t bg-background/50">
                        <p className="text-xs font-medium text-foreground truncate group-hover:text-primary" title={item.alt}>{item.alt}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-muted/50 rounded-lg bg-muted/20 p-6">
              <ImageOff className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-center text-muted-foreground">No direct image links found in your Encyclopedia.</p>
              <p className="text-sm text-center text-muted-foreground mt-1">Add links ending with image extensions (e.g., .jpg, .png) to any Encyclopedia collection to see them here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
