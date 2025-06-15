
"use server";

import { generateDMCALetter as generateDMCALetterFlow, GenerateDMCALetterInput } from "@/ai/flows/generate-dmca-letter";
import type { DMCALetterResult } from "@/types";

export async function generateDMCALetterAction(
  input: GenerateDMCALetterInput
): Promise<DMCALetterResult> {
  try {
    const result = await generateDMCALetterFlow(input);
    return result;
  } catch (error) {
    console.error("Error generating DMCA letter:", error);
    throw new Error("Failed to generate DMCA letter. Please try again.");
  }
}
