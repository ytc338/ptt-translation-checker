export interface Annotation {
  originalSnippet: string;
  translatedSnippet: string;
  issueType: string; // e.g., "Slang", "Grammar", "Informal", "Awkward Phrasing"
  explanation: string;
  suggestion?: string; // Optional
}

export interface AnalysisResult {
  originalContent: string;
  translatedContent: string;
  opTranslation?: string; // The OP's original translation extracted from the post
  annotations: Annotation[];
}

export interface Post {
  originalContent: string;
  sourceUrl: string;
}
