// This file contains shared type definitions, duplicated from the backend
// to avoid problematic cross-project imports in a simple monorepo.

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
  articleTitle?: string;
  articleId?: string;
  annotations: Annotation[];
}
