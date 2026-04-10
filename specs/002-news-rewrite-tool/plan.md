# Implementation Plan: AI News Rewrite Tool

**Branch**: `002-news-rewrite-tool` | **Date**: 2026-04-10 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-news-rewrite-tool/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build a web application that allows content creators to input trending news links (WeChat Official Accounts, Zhihu, news websites), automatically parse the content and images, and generate high-quality rewritten articles (~1000 words) suitable for WeChat Official Account publication using AI. The system uses Aliyun Dashscope API (Qwen model) for article generation with a carefully crafted prompt to ensure human-like, engaging content. Frontend built with Next.js, React, Tailwind CSS, and shadcn/ui components.

## Technical Context

**Language/Version**: TypeScript 5+, Node.js 18+, React 19+  
**Backend**: Next.js 16+ with App Router, API Routes  
**Frontend**: React 19+, Tailwind CSS 4+, shadcn/ui  
**LLM Integration**: Aliyun Dashscope API (Qwen Plus 2025-07-28 model) via OpenAI SDK  
**Web Scraping**: Cheerio or similar HTML parser for content extraction  
**Storage**: N/A for v1 (stateless, no persistence)  
**Testing**: Jest/Vitest (unit), Playwright (E2E)  
**Target Platform**: Web (browser + Node.js server)  
**Project Type**: Full-stack web application  
**Performance Goals**: 
- Link parsing: <5 seconds
- Article generation: <60 seconds total
- API response: <200ms p95 (excluding LLM generation time)
- Support 100 concurrent users
**Constraints**: 
- Aliyun API rate limits and quota
- Third-party website scraping restrictions
- LLM generation latency (inherent)
**Scale/Scope**: MVP for single-user web interface, no multi-user auth required for v1

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle Compliance

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Code Quality First | ✅ PASS | TypeScript strict mode, ESLint, Prettier enforced |
| II. Test-First Development | ✅ PASS | 80% coverage required; unit + integration tests planned |
| III. User Experience Consistency | ✅ PASS | shadcn/ui + Tailwind CSS for all UI components |
| IV. Performance Requirements | ✅ PASS | API <200ms p95, article generation <60s total |
| V. Observability & Debuggability | ✅ PASS | Structured logging for parsing and LLM calls |
| VI. Backend API Standards | ✅ PASS | Next.js API Routes in `app/api/` with clear contracts |
| VII. Frontend Component Architecture | ✅ PASS | React components in `app/components/` with Tailwind + shadcn/ui |

### Technology Stack Alignment

- ✅ Backend: Next.js 16+ with App Router
- ✅ Frontend: React 19+, TypeScript, Tailwind CSS 4+, shadcn/ui
- ✅ Testing: Jest/Vitest + Playwright
- ✅ Linting: ESLint + Prettier
- ✅ No custom CSS; Tailwind utility-first approach
- ✅ No inline styles or CSS modules

### Gate Result: ✅ PASS - Ready for Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/002-news-rewrite-tool/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Web Application Structure (Next.js 16+ with App Router)

app/
├── api/
│   ├── parse/
│   │   └── route.ts              # POST /api/parse - URL parsing endpoint
│   ├── generate/
│   │   └── route.ts              # POST /api/generate - Article generation endpoint
│   └── health/
│       └── route.ts              # GET /api/health - Health check
├── components/
│   ├── URLInput.tsx              # Input box component
│   ├── ParseButton.tsx           # Parse and Generate button
│   ├── LoadingState.tsx          # Loading indicator
│   ├── OriginalContent.tsx       # Original content display (collapsible)
│   ├── ImageGallery.tsx          # Image preview and download
│   ├── RewriteArticle.tsx        # Generated article display
│   ├── CopyButton.tsx            # Copy to clipboard
│   ├── RegenerateButton.tsx      # Regenerate article
│   └── ErrorMessage.tsx          # Error display
├── layout.tsx                    # Root layout
├── page.tsx                      # Main page
└── globals.css                   # Tailwind imports

lib/
├── parsers/
│   ├── wechat.ts                 # WeChat Official Account parser
│   ├── zhihu.ts                  # Zhihu parser
│   ├── news.ts                   # Generic news website parser
│   └── index.ts                  # Parser factory
├── llm/
│   ├── client.ts                 # Aliyun Dashscope client setup
│   ├── prompts.ts                # System and user prompts
│   └── generator.ts              # Article generation logic
├── types.ts                      # TypeScript interfaces
└── utils.ts                      # Helper functions

tests/
├── unit/
│   ├── parsers.test.ts           # Parser unit tests
│   ├── generator.test.ts         # LLM generation tests
│   └── utils.test.ts             # Utility function tests
├── integration/
│   ├── api.test.ts               # API endpoint tests
│   └── e2e.test.ts               # End-to-end workflow tests
└── fixtures/
    ├── sample-articles.ts        # Test data
    └── mock-responses.ts         # Mock LLM responses

public/
└── [static assets]

.env.local                        # Environment variables (DASHSCOPE_API_KEY)
package.json
tsconfig.json
next.config.js
tailwind.config.js
```

**Structure Decision**: Single Next.js application with App Router. Frontend and backend colocated in `app/` directory following Next.js 16+ conventions. Parsing logic in `lib/parsers/`, LLM integration in `lib/llm/`. Tests organized by type (unit, integration) with fixtures for test data.

## Complexity Tracking

> **No violations** - Design aligns with constitution principles and technology stack requirements.

All architectural decisions are justified by:
1. **Single Next.js application**: Simplest structure for MVP, no microservices overhead
2. **Stateless design**: No database required for v1, reduces complexity
3. **Platform-specific parsers**: Necessary for robust content extraction across different websites
4. **Streaming LLM responses**: Improves UX without adding significant complexity
5. **shadcn/ui + Tailwind**: Enforced by constitution (Principle VII), reduces custom CSS

No complexity exceptions needed.
