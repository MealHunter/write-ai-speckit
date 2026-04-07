# Implementation Plan: AI Diary Generator

**Branch**: `001-ai-diary-generator` | **Date**: 2026-04-07 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-ai-diary-generator/spec.md`

## Summary

Build a web application that accepts user input (keywords or descriptions) and generates diary-style content using LLM (Qwen via OpenAI SDK). Frontend uses Next.js with Tailwind CSS and shadcn/ui components. Generated content is rendered as Markdown. No persistence layer in MVP.

## Technical Context

**Language/Version**: TypeScript 5+, Node.js 18+, React 19+  
**Backend**: Next.js 16+ with App Router, API Routes  
**Frontend**: React 19+, Tailwind CSS 4+, shadcn/ui  
**LLM Integration**: OpenAI SDK (compatible mode) with Qwen model via Aliyun DashScope  
**Storage**: N/A (no persistence in MVP)  
**Testing**: Jest/Vitest (unit), Playwright (E2E)  
**Target Platform**: Web (browser + Node.js server)
**Project Type**: Full-stack web application  
**Performance Goals**: API response <30s (LLM latency), page load <3s, 95% success rate  
**Constraints**: Single-user, no auth, no data persistence  
**Scale/Scope**: Single feature (diary generation), MVP scope

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Principles Applied**:
- ✅ **I. Code Quality First**: TypeScript strict mode, ESLint enforced
- ✅ **II. Test-First Development**: Unit tests for API routes and components, integration tests for diary generation flow
- ✅ **III. UX Consistency**: shadcn/ui components + Tailwind CSS for consistent design
- ✅ **VI. Backend API Standards**: Diary generation via Next.js API Route (`/api/generate-diary`)
- ✅ **VII. Frontend Component Architecture**: React components in `app/components/` using shadcn/ui

**No violations identified. Proceed to Phase 0.**

## Project Structure

### Documentation (this feature)

```text
specs/001-ai-diary-generator/
├── plan.md              # This file
├── research.md          # Phase 0: LLM prompt engineering, OpenAI SDK patterns
├── data-model.md        # Phase 1: Data structures and types
├── quickstart.md        # Phase 1: Setup and running instructions
├── contracts/           # Phase 1: API contract for /api/generate-diary
└── checklists/
    └── requirements.md  # Quality checklist
```

### Source Code (repository root)

```text
app/
├── api/
│   └── generate-diary/
│       └── route.ts          # POST endpoint for diary generation
├── components/
│   ├── DiaryForm.tsx         # Input form (shadcn/ui)
│   ├── DiaryDisplay.tsx      # Markdown content display
│   ├── LoadingState.tsx      # Loading indicator
│   └── ErrorMessage.tsx      # Error display
├── lib/
│   ├── llm/
│   │   └── diaryPrompt.ts    # LLM prompt engineering
│   └── types/
│       └── diary.ts          # TypeScript types
├── page.tsx                  # Homepage
└── layout.tsx                # Root layout

__tests__/
├── api/
│   └── generate-diary.test.ts
├── components/
│   ├── DiaryForm.test.tsx
│   └── DiaryDisplay.test.tsx
└── integration/
    └── diary-flow.test.ts
```

**Structure Decision**: Single Next.js project with App Router. API route handles LLM calls, frontend components use shadcn/ui for UI. No separate backend/frontend split needed for MVP.

