# Implementation Plan: PTT Post Proofreading and Translation

**Branch**: `001-ptt-proofreading-translation` | **Date**: 2025-11-15 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This plan outlines the technical implementation for a web application that accepts a PTT post URL, scrapes the content, and uses a generative AI model to translate it into formal Taiwan Mandarin while identifying and annotating informal language, slang, and grammatical errors. The result is presented to the user in an interactive side-by-side view.

## Technical Context

**Language/Version**: TypeScript (v5+), Node.js (v20+)
**Primary Dependencies**:
  - **Backend**: Express.js, Axios, Cheerio, Google Gemini API Client
  - **Frontend**: React (v18+), TypeScript
  - **Containerization**: Docker, Docker Compose
**Storage**: N/A (stateless)
**Testing**:
  - **Backend**: Vitest for unit and integration tests.
  - **Frontend**: React Testing Library and Vitest.
**Target Platform**: Docker Containers
**Project Type**: Web Application (Backend API + Frontend SPA)
**Performance Goals**: End-to-end analysis in < 30 seconds. API response (p95) in < 5 seconds, excluding external AI service latency.
**Constraints**: The service is dependent on the PTT website's HTML structure and the availability/performance of the external Gemini API.
**Scale/Scope**: A single-page application designed for a single, focused user flow.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Simplicity**: The proposed technology stack (React, Node.js, Express) is a standard and well-understood choice for web applications, avoiding unnecessary complexity.
- **Testability**: The chosen frameworks (Vitest, React Testing Library) provide a robust foundation for implementing a test-first approach.
- **Clarity**: The plan generates clear, distinct design artifacts, including a data model and an API contract, ensuring the design is well-documented and understood.

**Result**: All principles are met. No violations.

## Project Structure

### Documentation (this feature)

```text
specs/001-ptt-proofreading-translation/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── openapi.yaml
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
```text
docker-compose.yaml

backend/
├── Dockerfile
├── src/
│   ├── models/          # Data structures for Post, Annotation
│   ├── services/        # Business logic (scraping, AI interaction)
│   └── api/             # Express routes and controllers
└── tests/
    ├── integration/
    └── unit/

frontend/
├── Dockerfile
├── src/
│   ├── components/      # React components (e.g., TextView, AnnotationList)
│   ├── pages/           # Main application page
│   └── services/        # API client for communicating with the backend
└── tests/
```

**Structure Decision**: A standard monorepo structure with separate `frontend` and `backend` directories is chosen. This provides a clear separation of concerns, simplifies dependency management for each part of the application, and aligns with the "Web Application" project type.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A       | -          | -                                   |
