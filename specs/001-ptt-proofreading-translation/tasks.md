# Tasks: PTT Post Proofreading and Translation

**Input**: Design documents from `/specs/001-ptt-proofreading-translation/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tasks for testing are included as specified in the design documents to ensure quality and testability.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure.

- [x] T001 Create monorepo directory structure: `backend/`, `frontend/`
- [x] T002 [P] Initialize backend Node.js project: `backend/package.json`, `backend/tsconfig.json`
- [x] T003 [P] Initialize frontend React project with Vite: `frontend/package.json`, `frontend/tsconfig.json`
- [x] T004 [P] Configure backend linting and formatting tools (ESLint, Prettier) in `backend/`
- [x] T005 [P] Configure frontend linting and formatting tools (ESLint, Prettier) in `frontend/`
- [x] T006 [P] Create `docker-compose.yaml` for multi-container setup.
- [x] T007 [P] Create `backend/Dockerfile` for the backend service.
- [x] T008 [P] Create `frontend/Dockerfile` for the frontend service.
- [x] T009 [P] Create initial `.env` file in `backend/` with `GEMINI_API_KEY` placeholder.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T010 Setup backend Express server entry point in `backend/src/index.ts`
- [x] T011 Setup API routing and middleware structure in `backend/src/api/`
- [x] T012 Configure backend error handling and logging middleware.
- [x] T013 Setup frontend folder structure: `frontend/src/components`, `frontend/src/pages`, `frontend/src/services`
- [x] T014 Implement frontend API client service to communicate with the backend in `frontend/src/services/api.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Translate and Proofread a PTT Post (Priority: P1) 🎯 MVP

**Goal**: A user can input a PTT post URL, see the original text, a formal translation, and a list of annotations identifying slang, errors, and informal language.

**Independent Test**: Can be verified by launching the application, submitting a valid PTT post URL, and confirming that the original content, translated content, and a list of annotations are displayed correctly in a three-panel view.

### Backend Tasks for User Story 1

#### Tests (Backend)
- [x] T015 [P] [US1] Write unit tests for the PTT scraping service in `backend/tests/unit/scrapingService.test.ts`
- [x] T016 [P] [US1] Write unit tests for the AI service in `backend/tests/unit/aiService.test.ts`
- [x] T017 [US1] Write integration test for the `/api/proofread` endpoint in `backend/tests/integration/proofread.test.ts`

#### Implementation (Backend)
- [x] T018 [P] [US1] Define data models (`AnalysisResult`, `Annotation`) in `backend/src/models/` based on `data-model.md`.
- [x] T019 [US1] Implement PTT scraping service using Axios and Cheerio in `backend/src/services/scrapingService.ts`
- [x] T020 [US1] Implement AI service to interact with Gemini API for translation and proofreading in `backend/src/services/aiService.ts`
- [x] T021 [US1] Implement the main analysis service to orchestrate scraping and AI calls in `backend/src/services/analysisService.ts`
- [x] T022 [US1] Create the `/api/proofread` endpoint and controller based on `openapi.yaml` in `backend/src/api/controllers/proofreadController.ts` and `backend/src/api/routes/proofreadRoutes.ts`

### Frontend Tasks for User Story 1

#### Tests (Frontend)
- [x] T023 [P] [US1] Write component tests for the `TextView` component in `frontend/tests/components/TextView.test.tsx`
- [x] T024 [P] [US1] Write component tests for the `AnnotationList` component in `frontend/tests/components/AnnotationList.test.tsx`
- [x] T025 [P] [US1] Write component test for the main analysis page in `frontend/tests/pages/AnalysisPage.test.tsx`

#### Implementation (Frontend)
- [x] T026 [P] [US1] Create `TextView` component for displaying original/translated text in `frontend/src/components/TextView.tsx`
- [x] T027 [P] [US1] Create `AnnotationList` component to display proofreading annotations in `frontend/src/components/AnnotationList.tsx`
- [x] T028 [US1] Build the main `AnalysisPage` in `frontend/src/pages/AnalysisPage.tsx`, composing the input field, text views, and annotation list.
- [x] T029 [US1] Implement state management for the URL input, loading status, and `AnalysisResult`.
- [x] T030 [US1] Connect the frontend to the backend by calling the `/api/proofread` endpoint from `AnalysisPage`.
- [x] T031 [US1] Implement UI logic to highlight relevant text when an annotation is selected.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories.

- [x] T032 [P] Review and add comments to complex code sections in `backend/` and `frontend/`.
- [x] T033 Refine UI/UX based on initial feedback, focusing on responsiveness and clarity.
- [x] T034 [P] Enhance end-to-end logging for monitoring and debugging.
- [x] T035 Optimize performance of the analysis pipeline, targeting < 30s for a 10k character post.
- [x] T036 Perform final validation by following all steps in `quickstart.md`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately. All tasks are parallelizable.
- **Foundational (Phase 2)**: Depends on Setup completion. BLOCKS all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion.
- **Polish (Phase 4)**: Depends on User Story 1 completion.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2). It is the only user story.

### Within Each User Story

- **TDD Approach**: Tests MUST be written first and should fail before the implementation is complete.
- **Backend**: Models (T018) should be defined before services. Services (T019, T020, T021) should be implemented before the controller (T022).
- **Frontend**: Components (T026, T027) should be built before being assembled in the main page (T028). State management and API integration (T029, T030) follow.

### Parallel Opportunities

- Many setup tasks (T002-T009) can be run in parallel.
- Within US1, backend and frontend development can occur in parallel after the API contract (`openapi.yaml`) is stable.
- Within each team (backend/frontend), test creation can often run in parallel with initial component/service scaffolding. For example, T015, T016, T017 can be worked on in parallel. Similarly, T023, T024, T025 can be done in parallel.

---

## Parallel Example: User Story 1

```bash
# Backend team can parallelize test and model creation:
Task: "[US1] Write unit tests for the PTT scraping service..." (T015)
Task: "[US1] Write unit tests for the AI service..." (T016)
Task: "[US1] Define data models..." (T018)

# Frontend team can parallelize component creation and testing:
Task: "[US1] Write component tests for the TextView component..." (T023)
Task: "[US1] Create TextView component..." (T026)
Task: "[US1] Create AnnotationList component..." (T027)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently using the criteria in the `spec.md`.
5. Deploy/demo the fully functional MVP.

This project consists of a single core user story, so the implementation strategy is focused on delivering this MVP.
