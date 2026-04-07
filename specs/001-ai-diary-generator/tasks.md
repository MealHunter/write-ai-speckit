# Tasks: AI Diary Generator

**Input**: Design documents from `/specs/001-ai-diary-generator/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - only include them if explicitly requested in the feature specification. This feature does NOT request tests, so test tasks are NOT included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- **Next.js Web App**: `app/api/` (backend routes), `app/components/` (frontend), `app/lib/` (utilities)
- **Tests**: `__tests__/` directory with matching structure
- **Styling**: Tailwind CSS classes in components; no CSS modules or inline styles
- Paths shown below assume Next.js structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per implementation plan (app/, app/api/, app/components/, app/lib/)
- [ ] T002 Initialize Next.js project with TypeScript, Tailwind CSS 4+, shadcn/ui dependencies
- [ ] T003 [P] Configure ESLint, Prettier, and pre-commit hooks
- [ ] T004 [P] Setup environment configuration (.env.local, .env.production)
- [ ] T005 Create TypeScript types in app/lib/types/diary.ts (DiaryRequest, DiaryContent, DiaryError, GenerateDiaryResponse)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Setup OpenAI SDK client in app/lib/llm/client.ts with Aliyun DashScope configuration
- [ ] T007 Create LLM prompt engineering module in app/lib/llm/diaryPrompt.ts with system prompt and user message templates
- [ ] T008 Implement API route POST /api/generate-diary/route.ts with input validation, LLM call, error handling
- [ ] T009 [P] Setup Markdown rendering library (react-markdown, remark-gfm) and configure Tailwind prose styling
- [ ] T010 [P] Create utility functions in app/lib/utils.ts (cn for className merging, error formatting)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Generate Diary Entry (Priority: P1) 🎯 MVP

**Goal**: Enable users to input keywords/descriptions and receive AI-generated diary content

**Independent Test**: User can input "清明节", submit, and receive diary content within 30 seconds

### Implementation for User Story 1

- [ ] T011 [P] [US1] Create DiaryForm component in app/components/DiaryForm.tsx (textarea input, submit button, input validation UI)
- [ ] T012 [P] [US1] Create LoadingState component in app/components/LoadingState.tsx (spinner, loading message)
- [ ] T013 [P] [US1] Create ErrorMessage component in app/components/ErrorMessage.tsx (error display with user-friendly messages)
- [ ] T014 [US1] Implement form submission logic in DiaryForm.tsx (call /api/generate-diary, handle response/error states)
- [ ] T015 [US1] Add input validation in DiaryForm.tsx (empty check, 500 character limit, show validation errors)
- [ ] T016 [US1] Implement loading state display during API call (show spinner, disable submit button)
- [ ] T017 [US1] Implement error handling and display (show ErrorMessage component with appropriate error message)

**Checkpoint**: User Story 1 complete - users can generate diary entries with loading and error states

---

## Phase 4: User Story 2 - Display Generated Content (Priority: P2)

**Goal**: Present AI-generated diary content in readable, formatted Markdown

**Independent Test**: Generated diary displays with proper formatting, readable on desktop and mobile

### Implementation for User Story 2

- [ ] T018 [P] [US2] Create DiaryDisplay component in app/components/DiaryDisplay.tsx (react-markdown with Tailwind prose styling)
- [ ] T019 [P] [US2] Create responsive layout component in app/components/DiaryContainer.tsx (centered, max-width, padding)
- [ ] T020 [US2] Integrate DiaryDisplay into homepage (show generated content after successful API call)
- [ ] T021 [US2] Implement responsive design for mobile (test on mobile viewport, adjust prose sizing)
- [ ] T022 [US2] Add "New Entry" button to clear content and reset form for next submission
- [ ] T023 [US2] Style diary display with Tailwind (heading sizes, paragraph spacing, emphasis styling)

**Checkpoint**: User Stories 1 AND 2 complete - full diary generation and display flow working

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T024 [P] Create homepage layout in app/page.tsx (header, form section, display section, footer)
- [ ] T025 [P] Create root layout in app/layout.tsx (metadata, global styles, dark mode support)
- [ ] T026 [P] Add Tailwind CSS configuration for prose styling and dark mode
- [ ] T027 [P] Setup environment variables documentation in .env.example
- [ ] T028 Add accessibility improvements (ARIA labels, keyboard navigation, color contrast)
- [ ] T029 Test cross-browser compatibility (Chrome, Safari, Firefox on desktop and mobile)
- [ ] T030 Performance optimization (lazy loading, code splitting, image optimization if needed)
- [ ] T031 Documentation updates in quickstart.md with actual implementation details
- [ ] T032 Run linting and type checking (npm run lint, npm run type-check)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-4)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Depends on US1 being complete (needs generated content to display)

### Within Each User Story

- Components before integration
- Validation before submission
- Error handling before success path
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, US1 and US2 can start in parallel (if team capacity allows)
- Within US1: DiaryForm, LoadingState, ErrorMessage components can be built in parallel
- Within US2: DiaryDisplay and DiaryContainer components can be built in parallel
- Polish tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all components for User Story 1 together:
Task: "Create DiaryForm component in app/components/DiaryForm.tsx"
Task: "Create LoadingState component in app/components/LoadingState.tsx"
Task: "Create ErrorMessage component in app/components/ErrorMessage.tsx"

# Then launch integration tasks sequentially:
Task: "Implement form submission logic in DiaryForm.tsx"
Task: "Add input validation in DiaryForm.tsx"
Task: "Implement loading state display during API call"
Task: "Implement error handling and display"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (DiaryForm, LoadingState, ErrorMessage, integration)
   - Developer B: User Story 2 (DiaryDisplay, DiaryContainer, integration)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
