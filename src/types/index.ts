

export interface Profile {
  id: string;
  full_name: string;
  entity_type: 'person' | 'company';
  reputation_score: number;
  threat_level: 'RED' | 'ORANGE' | 'GREEN'; // Updated from YELLOW
  verified: boolean;
  last_updated: Date;
}

// This represents an individual link/item within an Encyclopedia section
export interface EncyclopediaSourceLink {
  id: string; // Unique ID for this link/item
  title: string;
  url: string;
  excerpt?: string; // Detailed description or summary of the link's content
  timestamp?: Date; // When the link was discovered or added
  platform?: string; // Specific platform (e.g., Forbes, TechCrunch Blog, YouTube Channel)
  
  // Fields to store results from MentionCard actions, making the encyclopedia the source of truth
  sentiment?: 'positive' | 'negative' | 'neutral';
  risk_color?: '🔴' | '🟠' | '🟢'; // Updated from 🟡
  gpt_analysis?: string;
  archived_evidence?: {
    screenshot_url?: string;
    wayback_link?: string;
    notes?: string;
  };
  // This helps determine how to treat this link if displayed as a "Mention"
  source_type_override?: Mention['source_type']; 

  // Optional fields to guide transformation into a LegalCase
  legal_case_status?: LegalCase['case_status'];
  legal_court_name?: string;
  legal_case_id_override?: string;
  legal_filing_date?: string | Date; // Can be a string for parsing or a Date object
  legal_documents?: Array<{ name: string; url: string }>; // For multiple documents related to one source link
  legal_removal_status?: LegalCase['removal_status'];
  legal_last_action_date?: string | Date;
  legal_associated_mention_id?: string;
  legal_auto_generated_letters?: LegalCase['auto_generated_letters']; // To store letters if generated
}

export interface EncyclopediaEntry {
  id: string;
  profileId: string;
  section_title: string; // e.g., "News Articles", "Blog Posts", "General Web Search"
  content_markdown: string; // General description of this encyclopedia section/category
  source_verified: boolean; // Is the information in this *section* generally verified?
  disputed_flag: boolean; // Is the information in this *section* generally disputed?
  source_links?: EncyclopediaSourceLink[]; // Array of detailed links/items
}

// The Mention type as used by MentionCard. Can be derived from an EncyclopediaSourceLink.
export interface Mention {
  id: string; // This will be the EncyclopediaSourceLink.id
  profileId: string; // Can be a default profile ID
  source_type: 'search_engine' | 'social' | 'news' | 'legal' | 'other';
  platform: string; // Can be EncyclopediaSourceLink.platform or derived from EncyclopediaEntry.section_title
  url: string;
  title: string;
  content_excerpt: string; // This will be EncyclopediaSourceLink.excerpt
  sentiment?: 'positive' | 'negative' | 'neutral';
  risk_color?: '🔴' | '🟠' | '🟢'; // Updated from 🟡
  timestamp: Date;
  gpt_analysis?: string;
  archived_evidence?: {
    screenshot_url?: string;
    wayback_link?: string;
    notes?: string;
  };
  // Crucial for linking back to the source data in Encyclopedia
  originalEntryId?: string; 
  originalLinkId?: string; 
}


export interface LegalCase {
  id: string; // Will be the EncyclopediaSourceLink.id
  profileId: string;
  case_id: string; // User-defined or derived case identifier
  court: string;
  case_status: 'Active' | 'Settled' | 'Potential' | 'Dismissed' | 'Appealed';
  risk_color?: '🔴' | '🟠' | '🟢'; 
  filing_date: Date;
  summary: string;
  documents?: Array<{ name: string; url: string }>; // Could be primary link or list
  auto_generated_letters?: Record<string, { letter_type: 'DMCA' | 'GDPR' | 'Other', content: string, generated_at: Date }>;
  removal_status?: 'Pending' | 'Successful' | 'Failed' | 'Not Applicable';
  last_action_date?: Date;
  associated_mention_id?: string; 
  originalEntryId: string; // Link back to the EncyclopediaEntry
  originalLinkId: string;  // Link back to the EncyclopediaSourceLink
}


// For GenAI interactions
export interface RiskAnalysisResult {
  riskLevel: 'RED' | 'ORANGE' | 'GREEN'; // Updated from YELLOW
  sentiment: 'positive' | 'negative' | 'neutral';
  analysis: string;
}

export interface ContentSummaryResult {
  summary: string;
}

export interface DMCALetterResult {
  dmcaLetter: string;
}

export interface GenerateDerivedContentInput {
  profileName: string;
  newsTitle: string;
  newsExcerpt: string;
  contentType: "Summary" | "Tweet" | "LinkedIn Post" | "Key Takeaways" | "Press Release Snippet";
}

export interface GenerateDerivedContentResult {
  generatedText: string;
}
