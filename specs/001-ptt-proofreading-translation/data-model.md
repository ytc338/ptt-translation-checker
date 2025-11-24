# Data Model

**Feature**: PTT Post Proofreading and Translation
**Date**: 2025-11-15

This document defines the key data entities for the feature, based on the `spec.md` and `plan.md`.

---

### 1. Post

Represents the original content scraped from the PTT URL provided by the user.

- **Fields**:
  - `originalContent: string` - The raw text content of the PTT post.
  - `sourceUrl: string` - The URL from which the content was scraped.
- **Validation**:
  - `sourceUrl` must be a valid PTT URL format.
  - `originalContent` should not be empty after scraping.

---

### 2. AnalysisResult

Represents the full analysis returned by the backend, including the original content, the translation, and all annotations.

- **Fields**:
  - `originalContent: string` - A copy of the original post content.
  - `translatedContent: string` - The translated and proofread version of the content.
  - `annotations: Annotation[]` - An array of annotation objects.
- **Relationships**:
  - Contains an array of `Annotation` entities.

---

### 3. Annotation

Represents a single piece of feedback on the translation, highlighting a specific issue.

- **Fields**:
  - `originalSnippet: string` - The specific snippet of text from the original post that corresponds to the issue.
  - `translatedSnippet: string` - The specific snippet from the translated text where the issue was found.
  - `issueType: string` - The category of the issue. (e.g., "Slang", "Grammar", "Informal", "Awkward Phrasing").
  - `explanation: string` - A detailed description of why the snippet was flagged.
  - `suggestion: string` (optional) - A suggested alternative phrasing.
- **Validation**:
  - `issueType` should be one of the predefined categories.
  - `explanation` must not be empty.
