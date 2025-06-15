
export interface Profile {
  id: string;
  full_name: string;
  entity_type: 'person' | 'company';
  reputation_score: number;
  threat_level: 'RED' | 'YELLOW' | 'GREEN';
  verified: boolean;
  last_updated: Date;
}

export interface Mention {
  id: string;
  profileId: string;
  source_type: 'search_engine' | 'social' | 'news' | 'legal' | 'other';
  platform: string; // e.g. Google, Twitter, YouTube
  url: string;
  title: string;
  content_excerpt: string;
  sentiment?: 'positive' | 'negative' | 'neutral'; // Optional initially
  risk_color?: '🔴' | '🟡' | '🟢'; // Optional initially
  timestamp: Date;
  gpt_analysis?: string; // Optional initially
  archived_evidence?: {
    screenshot_url?: string;
    wayback_link?: string;
    notes?: string;
  };
}

export interface LegalCase {
  id: string;
  profileId: string;
  case_id: string;
  court: string;
  case_status: 'Active' | 'Settled' | 'Potential' | 'Dismissed' | 'Appealed';
  risk_color?: '🔴' | '🟡' | '🟢';
  filing_date: Date;
  summary: string;
  documents?: Array<{ name: string; url: string }>; // list of doc URLs or encrypted paths
  auto_generated_letters?: Record<string, { letter_type: 'DMCA' | 'GDPR' | 'Other', content: string, generated_at: Date }>;
  removal_status?: 'Pending' | 'Successful' | 'Failed' | 'Not Applicable';
  last_action_date?: Date;
  associated_mention_id?: string; // Link to a specific mention if applicable
}

export interface EncyclopediaEntry {
  id: string;
  profileId: string;
  section_title: string;
  content_markdown: string;
  source_verified: boolean;
  disputed_flag: boolean;
  source_links?: Array<{ title: string; url: string }>;
}

// For GenAI interactions
export interface RiskAnalysisResult {
  riskLevel: 'RED' | 'YELLOW' | 'GREEN';
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
  newsTitle: string;
  newsExcerpt: string;
  contentType: "Summary" | "Tweet" | "LinkedIn Post" | "Key Takeaways" | "Press Release Snippet";
}

export interface GenerateDerivedContentResult {
  generatedText: string;
}
