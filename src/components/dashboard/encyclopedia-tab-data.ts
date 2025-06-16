
import type { EncyclopediaEntry } from "@/types";

export const LOCAL_STORAGE_KEY_ENCYCLOPEDIA = "encyclopediaEntries_v9_social";

// Updated Mock Encyclopedia Entries - Category-based structure
export const initialMockEncyclopediaEntries: EncyclopediaEntry[] = [
  {
    id: "enc-all-search", 
    profileId: "profile1",
    section_title: "General Web Search - Kunwer Sachdev & Variations",
    content_markdown: "Collect links from various search engines (Google, Bing, DuckDuckGo, etc.) for 'Kunwer Sachdev' and its common spelling variations like 'Kunwar Sachdeva', 'Kuwer Sachdeva', 'Kumar Sachdeva'. This section is for a broad overview of search presence before categorizing.",
    source_verified: false,
    disputed_flag: false,
    source_links: [
      { id: "link-gs-1", title: "Example: Google Result - Kunwer Sachdev", url: "https://google.com/search?q=Kunwer+Sachdev+example+result+1", excerpt: "An example search result from Google for Kunwer Sachdev.", timestamp: new Date(Date.now() - 86400000 * 5) },
      { id: "link-bs-1", title: "Example: Bing Result - Kunwar Sachdeva", url: "https://bing.com/search?q=Kunwar+Sachdeva+example+result+2", excerpt: "An example search result from Bing for Kunwar Sachdeva.", timestamp: new Date(Date.now() - 86400000 * 6) },
    ],
  },
  {
    id: "enc-news",
    profileId: "profile1",
    section_title: "News Articles - Kunwer Sachdev",
    content_markdown: "Collection of news articles featuring Kunwer Sachdev, his work, or related topics. Add links from various news sources found via search engines or direct discovery.",
    source_verified: false,
    disputed_flag: false,
    source_links: [ 
      { 
        id: "link-news-1", 
        title: "Forbes on Kunwer Sachdev: Innovation in Energy", 
        url: "https://www.forbes.com/example-kunwer-sachdev-news",
        excerpt: "Forbes highlights Kunwer Sachdev's contributions to the energy sector and his innovative approach to sustainable solutions.",
        timestamp: new Date(Date.now() - 86400000 * 3),
        platform: "Forbes"
      },
      { 
        id: "link-news-2", 
        title: "Business Today: Sachdev's Vision for Future Tech", 
        url: "https://www.businesstoday.example/sachdev-future-tech",
        excerpt: "Kunwer Sachdev discusses the future of technology and its impact on various industries in an exclusive interview with Business Today.",
        timestamp: new Date(Date.now() - 86400000 * 10),
        platform: "Business Today"
      },
    ],
  },
  {
    id: "enc-blogs",
    profileId: "profile1",
    section_title: "Blog Posts & Opinion Pieces - Kunwer Sachdev",
    content_markdown: "Links to blog posts, articles, and opinion pieces discussing Kunwer Sachdev. Note the source and any potential bias.",
    source_verified: false,
    disputed_flag: false,
    source_links: [
      { id: "link-blog-1", title: "Tech Blogger on Su-Kam Legacy", url: "https://techblog.example/su-kam-kunwer-sachdev", excerpt: "A detailed analysis of Su-Kam's legacy under Kunwer Sachdev's leadership, by a prominent tech blogger.", timestamp: new Date(Date.now() - 86400000 * 15), platform: "TechBlog Example" }
    ],
  },
  {
    id: "enc-youtube",
    profileId: "profile1",
    section_title: "YouTube Content - Kunwer Sachdev",
    content_markdown: "Videos featuring interviews, talks, documentaries, or discussions related to Kunwer Sachdev. Add YouTube links here.",
    source_verified: false,
    disputed_flag: false,
    source_links: [
      { id: "link-yt-1", title: "Interview with Kunwer Sachdev on Innovation", url: "https://youtube.com/example/ks-interview", excerpt: "A 30-minute interview covering Kunwer Sachdev's journey and thoughts on innovation.", timestamp: new Date(Date.now() - 86400000 * 20), platform: "YouTube ExampleChannel" }
    ],
  },
  {
    id: "enc-podcasts",
    profileId: "profile1",
    section_title: "Podcast Appearances & Mentions - Kunwer Sachdev",
    content_markdown: "Collect links to podcast episodes where Kunwer Sachdev is a guest or is significantly discussed.",
    source_verified: false,
    disputed_flag: false,
    source_links: [],
  },
  {
    id: "enc-facebook",
    profileId: "profile1",
    section_title: "Facebook Mentions - Kunwer Sachdev",
    content_markdown: "Collect links to Facebook posts, pages, or groups discussing Kunwer Sachdev.",
    source_verified: false,
    disputed_flag: false,
    source_links: [],
  },
  {
    id: "enc-twitter-x",
    profileId: "profile1",
    section_title: "Twitter (X) Mentions - Kunwer Sachdev",
    content_markdown: "Collect links to tweets, profiles, or threads related to Kunwer Sachdev on Twitter (X).",
    source_verified: false,
    disputed_flag: false,
    source_links: [],
  },
  {
    id: "enc-linkedin",
    profileId: "profile1",
    section_title: "LinkedIn Mentions - Kunwer Sachdev",
    content_markdown: "Collect links to LinkedIn posts, articles, or profiles relevant to Kunwer Sachdev.",
    source_verified: false,
    disputed_flag: false,
    source_links: [],
  },
  {
    id: "enc-instagram",
    profileId: "profile1",
    section_title: "Instagram Mentions - Kunwer Sachdev",
    content_markdown: "Collect links to Instagram posts, reels, or profiles featuring Kunwer Sachdev.",
    source_verified: false,
    disputed_flag: false,
    source_links: [],
  },
  {
    id: "enc-other-social",
    profileId: "profile1",
    section_title: "Other Social Media Platforms - Kunwer Sachdev",
    content_markdown: "Collect links from other social media platforms (e.g., Reddit, Quora, TikTok) that mention Kunwer Sachdev.",
    source_verified: false,
    disputed_flag: false,
    source_links: [],
  },
  {
    id: "enc-stories-features",
    profileId: "profile1",
    section_title: "Stories & In-depth Features - Kunwer Sachdev",
    content_markdown: "Links to long-form stories, biographical features, or detailed case studies involving Kunwer Sachdev.",
    source_verified: false,
    disputed_flag: false,
    source_links: [],
  },
  {
    id: "enc-books",
    profileId: "profile1",
    section_title: "Books & Publications - Kunwer Sachdev",
    content_markdown: "References to books authored by, about, or significantly featuring Kunwer Sachdev.",
    source_verified: false,
    disputed_flag: false,
    source_links: [],
  },
  {
    id: "enc-patents",
    profileId: "profile1",
    section_title: "Patents & Intellectual Property - Kunwer Sachdev",
    content_markdown: "Links to patent filings, discussions about intellectual property, or related technological innovations by Kunwer Sachdev.",
    source_verified: false,
    disputed_flag: false,
    source_links: [],
  },
  {
    id: "enc-legal-public",
    profileId: "profile1",
    section_title: "Public Legal Mentions & Filings - Kunwer Sachdev",
    content_markdown: "Collection of publicly accessible legal documents, case mentions, or official filings related to Kunwer Sachdev (distinct from the 'Legal Cases' tab which is for active case management).",
    source_verified: false,
    disputed_flag: false,
    source_links: [],
  }
];
