# Tasks: AI News Rewrite Tool

**Input**: Design documents from `/specs/002-news-rewrite-tool/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - only included for critical paths. Focus on integration tests for API contracts and E2E tests for user workflows.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Next.js Web App**: `app/api/` (backend routes), `app/components/` (frontend), `app/` (pages)
- **Libraries**: `lib/parsers/`, `lib/llm/`, `lib/types.ts`, `lib/utils.ts`
- **Tests**: `tests/unit/`, `tests/integration/`, `tests/fixtures/`
- **Styling**: Tailwind CSS classes in components; no CSS modules or inline styles

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure per implementation plan (app/, app/api/, app/components/, lib/, tests/)
- [x] T002 Initialize Next.js 16+ project with TypeScript, Tailwind CSS 4+, shadcn/ui dependencies
- [x] T003 [P] Configure ESLint, Prettier, and pre-commit hooks for code quality
- [x] T004 [P] Setup environment configuration (.env.local template with DASHSCOPE_API_KEY)
- [x] T005 [P] Install core dependencies: cheerio, axios, openai, p-queue, react-markdown, uuid, clsx

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Create TypeScript types and interfaces in lib/types.ts (ParsedArticle, Image, RewriteArticle, GenerationAttempt, ParseRequest)
- [x] T007 [P] Setup Aliyun Dashscope LLM client in lib/llm/client.ts with OpenAI SDK configuration
- [x] T008 [P] Create LLM prompt templates in lib/llm/prompts.ts (system prompt for WeChat expert, user prompt template)
- [x] T009 Setup error handling and structured logging utilities in lib/utils.ts
- [x] T010 [P] Create parser factory and base parser interface in lib/parsers/index.ts
- [x] T011 [P] Setup request queuing and rate limiting middleware in lib/utils.ts (p-queue configuration)
- [x] T012 Create main page layout in app/page.tsx with state management for URL input → parsing → generation flow
- [x] T013 [P] Setup API route structure in app/api/ with request/response contracts from contracts/api.md
- [x] T014 Create health check endpoint in app/api/health/route.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Parse and Generate Articles Quickly (Priority: P1) 🎯 MVP

**Goal**: Content creators can input a trending news link, click "Parse and Generate", and the system automatically extracts content and generates a rewritten article (~1000 words) with 3 titles suitable for WeChat Official Account publication.

**Independent Test**: Input valid WeChat Official Account or Zhihu link → verify system parses content, extracts images, generates article → display three content areas (original, images, rewritten)

### Implementation for User Story 1

- [x] T015 [P] [US1] Implement WeChat Official Account parser in lib/parsers/wechat.ts (extract title, body, images from WeChat HTML)
- [x] T016 [P] [US1] Implement Zhihu answer parser in lib/parsers/zhihu.ts (extract answer content and images from Zhihu HTML)
- [x] T017 [P] [US1] Implement generic news website parser in lib/parsers/news.ts (fallback parser for common news sites)
- [x] T018 [US1] Implement article generation service in lib/llm/generator.ts (call Dashscope API with crafted prompt, parse response into RewriteArticle)
- [x] T019 [US1] Implement POST /api/parse endpoint in app/api/parse/route.ts (validate URL, detect platform, call appropriate parser, return ParsedArticle + Images)
- [x] T020 [US1] Implement POST /api/generate endpoint in app/api/generate/route.ts (receive articleId, call LLM generator, return RewriteArticle with 3 titles)
- [x] T021 [P] [US1] Create URLInput component in app/components/URLInput.tsx (input field with URL validation, shadcn/ui Input)
- [ ] T022 [P] [US1] Create ParseButton component in app/components/ParseButton.tsx (triggers parse API, shows loading state, handles errors)
- [x] T023 [P] [US1] Create LoadingState component in app/components/NewsLoadingState.tsx (skeleton loaders for content areas, progress indicator)
- [x] T024 [P] [US1] Create OriginalContent component in app/components/OriginalContent.tsx (collapsible card with article title and body, shadcn/ui Card)
- [x] T025 [P] [US1] Create ImageGallery component in app/components/ImageGallery.tsx (display parsed images with preview and download links)
- [x] T026 [P] [US1] Create RewriteArticle component in app/components/RewriteArticle.tsx (display generated article with 3 titles, render Markdown content using react-markdown)
- [x] T027 [US1] Integrate components in app/news-rewrite/page.tsx (wire up URL input → parse button → loading state → display results)
- [x] T028 [US1] Add error handling and user-friendly error messages in app/news-rewrite/page.tsx (invalid URL, parse failed, no content, etc.)
- [x] T029 [US1] Add structured logging for parsing and generation operations in lib/newsUtils.ts and API routes

**Checkpoint**: User Story 1 should be fully functional and independently testable. Test with real WeChat and Zhihu links.

---

## Phase 4: User Story 2 - Support Multiple Content Sources (Priority: P2)

**Goal**: System can identify and correctly parse article content from WeChat Official Accounts, Zhihu, and common news websites.

**Independent Test**: Input links from each platform (WeChat, Zhihu, news site) → verify system correctly identifies platform and parses content → generate articles for each

### Implementation for User Story 2

- [ ] T030 [US2] Enhance parser factory in lib/parsers/index.ts to auto-detect platform from URL domain
- [ ] T031 [P] [US2] Add platform detection tests in tests/unit/parsers.test.ts (verify correct parser selected for each platform)
- [ ] T032 [US2] Improve generic news parser in lib/parsers/news.ts with additional selectors for common news sites (CNN, BBC, Reuters, etc.)
- [ ] T033 [US2] Add fallback mechanism in lib/parsers/index.ts (if platform-specific parser fails, try generic parser)
- [ ] T034 [US2] Update POST /api/parse endpoint to return detected platform in response
- [ ] T035 [P] [US2] Create integration tests in tests/integration/api.test.ts (test parse endpoint with real URLs from each platform)
- [ ] T036 [US2] Add platform indicator in OriginalContent component (show which platform content came from)

**Checkpoint**: User Stories 1 AND 2 should both work independently. Test with links from different platforms.

---

## Phase 5: User Story 3 - Exception Handling and User Feedback (Priority: P2)

**Goal**: System provides clear error messages and offers fallback options when parsing fails or content is invalid.

**Independent Test**: Input invalid links, login-required pages, non-article pages → verify system provides appropriate error messages and fallback options

### Implementation for User Story 3

- [ ] T037 [P] [US3] Create ErrorMessage component in app/components/ErrorMessage.tsx (display error with actionable message, shadcn/ui Alert)
- [ ] T038 [US3] Implement error handling in POST /api/parse endpoint (catch network errors, parsing failures, return appropriate error messages)
- [ ] T039 [US3] Implement error handling in POST /api/generate endpoint (catch LLM failures, timeout, return appropriate error messages)
- [ ] T040 [US3] Add fallback option in app/page.tsx (when parsing fails, offer user option to generate article without original content)
- [ ] T041 [US3] Implement fallback generation in lib/llm/generator.ts (generate article from user-provided text if parsing failed)
- [ ] T042 [P] [US3] Create integration tests in tests/integration/error-handling.test.ts (test error scenarios: invalid URL, network error, no content, LLM timeout)
- [ ] T043 [US3] Add user-friendly error messages mapping in lib/utils.ts (map technical errors to user-facing messages)
- [ ] T044 [US3] Add retry logic in app/page.tsx (allow user to retry failed operations)

**Checkpoint**: All error scenarios should be handled gracefully with clear user feedback.

---

## Phase 6: User Story 4 - Content Operations and Regeneration (Priority: P3)

**Goal**: Users can copy generated article content and regenerate articles to get different versions.

**Independent Test**: After article generation, verify copy button works and regenerate button produces new content

### Implementation for User Story 4

- [ ] T045 [P] [US4] Create CopyButton component in app/components/CopyButton.tsx (copy article to clipboard, show success toast, shadcn/ui Button)
- [ ] T046 [P] [US4] Create RegenerateButton component in app/components/RegenerateButton.tsx (trigger new generation, show loading state)
- [ ] T047 [US4] Implement copy-to-clipboard functionality in lib/utils.ts (copy Markdown content to clipboard)
- [ ] T048 [US4] Add regenerate logic in app/page.tsx (call generate endpoint again with same articleId, update UI with new article)
- [ ] T049 [US4] Track generation attempts in lib/types.ts (GenerationAttempt entity for audit trail)
- [ ] T050 [US4] Add UI to display multiple title options in RewriteArticle component (allow user to select different title)
- [ ] T051 [P] [US4] Create E2E tests in tests/integration/e2e.test.ts (test complete workflow: parse → generate → copy → regenerate)

**Checkpoint**: All user stories should now be independently functional. Test complete workflows.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T052 [P] Add comprehensive unit tests in tests/unit/ (parser tests, LLM prompt tests, utility function tests)
- [ ] T053 [P] Add performance benchmarks in tests/integration/performance.test.ts (verify <5s parsing, <60s generation)
- [ ] T054 [P] Implement request timeout handling in lib/utils.ts (30s for parsing, 60s for generation)
- [ ] T055 [P] Add rate limiting enforcement in app/api/ routes (10 requests/second per IP)
- [ ] T056 Add comprehensive error logging in all API routes (structured logs with request ID, user action, error details)
- [ ] T057 [P] Optimize image loading in ImageGallery component (lazy loading, progressive display)
- [ ] T058 [P] Add accessibility improvements (ARIA labels, keyboard navigation, color contrast)
- [ ] T059 Add documentation in quickstart.md (verify all setup steps work, update with any changes)
- [ ] T060 [P] Code cleanup and refactoring (remove dead code, improve type safety, add JSDoc comments)
- [ ] T061 [P] Security hardening (validate all inputs, sanitize HTML, prevent XSS, check for hardcoded secrets)
- [ ] T062 Run full test suite and verify 80% code coverage
- [ ] T063 Validate all components use shadcn/ui and Tailwind CSS (no custom CSS or inline styles)
- [ ] T064 Performance optimization (optimize bundle size, lazy load components, cache parsed content)
- [ ] T065 Final integration test of complete workflow with real data

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P2 → P3)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories - **MVP**
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Enhances US1 but independently testable
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Improves US1 error handling but independently testable
- **User Story 4 (P3)**: Can start after Foundational (Phase 2) - Enhances US1 but independently testable

### Within Each User Story

- Parsers before API endpoints (T015-T017 before T019)
- LLM setup before generation service (T007-T008 before T018)
- Components before integration (T021-T026 before T027)
- Core implementation before error handling (T019-T020 before T028)

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T003, T004, T005)
- All Foundational tasks marked [P] can run in parallel (T007, T008, T010, T011, T013)
- Once Foundational phase completes, all user stories can start in parallel:
  - Developer A: User Story 1 (T015-T029)
  - Developer B: User Story 2 (T030-T036)
  - Developer C: User Story 3 (T037-T044)
  - Developer D: User Story 4 (T045-T051)
- All parsers marked [P] can run in parallel (T015, T016, T017)
- All components marked [P] can run in parallel (T021-T026)
- All Polish tasks marked [P] can run in parallel (T052, T053, T054, T055, T057, T058, T060, T061, T063, T064)

---

## Parallel Example: User Story 1

```bash
# Launch all parsers together:
Task T015: Implement WeChat parser
Task T016: Implement Zhihu parser
Task T017: Implement generic news parser

# Launch all components together:
Task T021: Create URLInput component
Task T022: Create ParseButton component
Task T023: Create LoadingState component
Task T024: Create OriginalContent component
Task T025: Create ImageGallery component
Task T026: Create RewriteArticle component

# Then integrate:
Task T027: Wire up components in main page
Task T028: Add error handling
Task T029: Add logging
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T005)
2. Complete Phase 2: Foundational (T006-T014) - **CRITICAL**
3. Complete Phase 3: User Story 1 (T015-T029)
4. **STOP and VALIDATE**: Test User Story 1 independently with real WeChat/Zhihu links
5. Deploy/demo if ready

**Estimated time**: 2-3 weeks for experienced team

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Polish & optimize → Final release

**Each story adds value without breaking previous stories**

### Parallel Team Strategy (4 developers)

1. All developers complete Setup + Foundational together (1 week)
2. Once Foundational is done:
   - Developer A: User Story 1 (1.5 weeks)
   - Developer B: User Story 2 (1 week)
   - Developer C: User Story 3 (1 week)
   - Developer D: User Story 4 (1 week)
3. Stories complete and integrate independently
4. All developers: Polish & optimize (1 week)

**Total: ~3 weeks with parallel execution**

---

## Task Summary

| Phase | Count | Purpose |
|-------|-------|---------|
| Phase 1: Setup | 5 | Project initialization |
| Phase 2: Foundational | 9 | Core infrastructure (BLOCKING) |
| Phase 3: User Story 1 (P1) | 15 | MVP - Parse & Generate |
| Phase 4: User Story 2 (P2) | 7 | Multi-platform support |
| Phase 5: User Story 3 (P2) | 8 | Error handling |
| Phase 6: User Story 4 (P3) | 7 | Copy & Regenerate |
| Phase 7: Polish | 14 | Testing, optimization, hardening |
| **TOTAL** | **65** | **Complete feature** |

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Verify tests fail before implementing (TDD approach)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Constitution compliance: All components use shadcn/ui + Tailwind, no custom CSS, 80% test coverage required
