# Research & Decisions

**Feature**: PTT Post Proofreading and Translation
**Date**: 2025-11-15

This document outlines the technical decisions made to resolve ambiguities before the design phase.

---

### Decision 1: Web Scraping Stack

- **Decision**: Use `axios` for fetching the PTT page HTML and `cheerio` for server-side parsing in the Node.js backend.
- **Rationale**: This combination is a standard, lightweight, and highly effective method for scraping static web content. It avoids the significant overhead of a full headless browser like Puppeteer, which is unnecessary as PTT pages are rendered server-side. `cheerio` provides a familiar jQuery-like API for traversing the DOM, making it easy to extract the post content.
- **Alternatives Considered**:
  - **Puppeteer/Playwright**: Rejected as overkill. These tools are designed for interacting with dynamic, JavaScript-heavy sites and would introduce unnecessary complexity and performance overhead.
  - **Regex on raw HTML**: Rejected as it is extremely brittle and would break with the slightest change in PTT's HTML structure.

---

### Decision 2: Translation and Proofreading Engine

- **Decision**: Utilize a single, powerful, multi-turn generative AI model, such as Google's Gemini, via its API.
- **Rationale**: The feature requires not just translation but also nuanced analysis of tone, style, and formality. A sophisticated generative model can handle both tasks within a single API call by providing a carefully engineered prompt. This prompt will instruct the model to first translate the text to formal Taiwan Mandarin and then to identify and list any informalities, slang, or grammatical issues, comparing the translation back to the original. This approach simplifies the architecture, reduces latency, and lowers costs compared to chaining multiple specialized APIs.
- **Alternatives Considered**:
  - **Separate APIs**: Using a dedicated Translation API (e.g., Google Translate API) and a separate Grammar/Style API. This was rejected due to the increased architectural complexity, the potential for conflicting results between the two services, and the difficulty of finding a dedicated API that can reliably identify PTT-specific slang.

---

### Decision 3: Frontend Design for Side-by-Side View

- **Decision**: Implement a responsive three-panel layout in React using standard CSS (Flexbox or Grid).
- **Rationale**:
  1.  **Panel 1 (Original Text)**: Displays the scraped PTT post content.
  2.  **Panel 2 (Translated Text)**: Displays the formal translation.
  3.  **Panel 3 (Annotations)**: Displays a list of proofreading comments.
  
  Component state in React will manage the list of annotations and the currently selected one. When a user clicks an annotation in Panel 3, the application will update its state, triggering a re-render that applies a dynamic CSS class to highlight the corresponding text snippets in Panels 1 and 2. This provides a clear, interactive, and intuitive user experience.
- **Alternatives Considered**:
  - **Inline Comments**: Placing comments directly within the translated text. Rejected because it could clutter the view and make the final translation difficult to read.
  - **Tooltips on Hover**: Showing annotations in tooltips when hovering over highlighted text. This is a good supplementary feature but is less effective for displaying potentially long explanations. A dedicated panel is superior for the primary display of annotations.
