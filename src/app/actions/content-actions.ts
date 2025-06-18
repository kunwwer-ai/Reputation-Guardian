
"use server";

import { generateDerivedContent as generateDerivedContentFlow, GenerateDerivedContentInput } from "@/ai/flows/generate-derived-content";
import type { GenerateDerivedContentResult } from "@/types";

export async function generateDerivedContentAction(
  input: GenerateDerivedContentInput
): Promise<GenerateDerivedContentResult> {
  try {
    const result = await generateDerivedContentFlow(input);
    return result;
  } catch (error) {
    console.error("Error generating derived content:", error);
    throw new Error("Failed to generate content. Please try again.");
  }
}

