# Quickstart: AI Diary Generator

**Feature**: AI Diary Generator  
**Branch**: `001-ai-diary-generator`  
**Date**: 2026-04-07

## Overview

This guide walks you through setting up and running the AI Diary Generator feature locally.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Aliyun DashScope API key (for Qwen model access)

## Setup

### 1. Environment Configuration

Create a `.env.local` file in the project root:

```bash
# Aliyun DashScope API Key
DASHSCOPE_API_KEY=sk-your-api-key-here
```

**Getting an API Key**:
1. Visit [Aliyun DashScope Console](https://dashscope.console.aliyun.com/)
2. Create or use existing API key
3. Copy the key and paste into `.env.local`

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

**Key Dependencies**:
- `next@16.2.2` - Framework
- `react@19.2.4` - UI library
- `tailwindcss@4` - Styling
- `shadcn/ui` - Component library
- `openai@latest` - LLM SDK
- `react-markdown` - Markdown rendering

### 3. Install shadcn/ui Components

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add card
npx shadcn-ui@latest add alert
```

## Running Locally

### Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
app/
├── api/
│   └── generate-diary/
│       └── route.ts              # POST endpoint
├── components/
│   ├── DiaryForm.tsx             # Input form
│   ├── DiaryDisplay.tsx          # Content display
│   ├── LoadingState.tsx          # Loading indicator
│   └── ErrorMessage.tsx          # Error display
├── lib/
│   ├── llm/
│   │   ├── client.ts             # OpenAI client setup
│   │   └── diaryPrompt.ts        # Prompt engineering
│   └── types/
│       └── diary.ts              # TypeScript types
├── page.tsx                      # Homepage
└── layout.tsx                    # Root layout

__tests__/
├── api/
│   └── generate-diary.test.ts
├── components/
│   ├── DiaryForm.test.tsx
│   └── DiaryDisplay.test.tsx
└── integration/
    └── diary-flow.test.ts
```

## Testing

### Run Unit Tests

```bash
npm run test
# or
yarn test
```

### Run E2E Tests

```bash
npm run test:e2e
# or
yarn test:e2e
```

### Manual Testing

1. Open `http://localhost:3000`
2. Enter a keyword (e.g., "清明节")
3. Click "生成日记" (Generate Diary)
4. Wait for response (5-30 seconds)
5. View generated diary in Markdown format

**Test Cases**:
- ✅ Valid keyword → generates diary
- ✅ Valid description (500 chars) → generates diary
- ✅ Empty input → shows error
- ✅ Input > 500 chars → shows error
- ✅ Loading state displays during generation
- ✅ Error message displays on failure
- ✅ Works on mobile and desktop

## API Testing

### Using curl

```bash
# Generate diary for keyword
curl -X POST http://localhost:3000/api/generate-diary \
  -H "Content-Type: application/json" \
  -d '{"input": "清明节"}'

# Test empty input (should fail)
curl -X POST http://localhost:3000/api/generate-diary \
  -H "Content-Type: application/json" \
  -d '{"input": ""}'

# Test long input (should fail)
curl -X POST http://localhost:3000/api/generate-diary \
  -H "Content-Type: application/json" \
  -d '{"input": "'"$(printf 'a%.0s' {1..501})"'"}'
```

### Using Postman

1. Create new POST request to `http://localhost:3000/api/generate-diary`
2. Set header: `Content-Type: application/json`
3. Set body (raw JSON):
   ```json
   {"input": "清明节"}
   ```
4. Send and view response

## Troubleshooting

### "API key not found" Error

**Problem**: `DASHSCOPE_API_KEY` environment variable not set

**Solution**:
1. Check `.env.local` exists in project root
2. Verify API key is correct
3. Restart dev server after updating `.env.local`

### "Connection timeout" Error

**Problem**: LLM request takes >30 seconds

**Solution**:
1. Check internet connection
2. Verify API key is valid
3. Try again (may be temporary service issue)
4. Check Aliyun DashScope status page

### "Empty response" Error

**Problem**: LLM returned empty or invalid content

**Solution**:
1. Try different keyword/description
2. Check if input is too vague
3. Verify API key has sufficient quota

### Markdown Not Rendering

**Problem**: Generated content shows raw Markdown

**Solution**:
1. Verify `react-markdown` is installed
2. Check `DiaryDisplay.tsx` component is used
3. Restart dev server

## Development Workflow

### Adding New Features

1. Create feature branch: `git checkout -b feature/your-feature`
2. Implement changes following constitution guidelines
3. Write tests (test-first approach)
4. Run tests: `npm run test`
5. Commit: `git commit -m "feat: description"`

### Code Quality

```bash
# Run linting
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

### Deployment

```bash
# Build for production
npm run build

# Test production build locally
npm start

# Deploy to Vercel (recommended)
vercel deploy
```

## Next Steps

- Implement `/speckit.tasks` to generate implementation tasks
- Start development following task list
- Run tests continuously during development
- Deploy to staging for user testing
- Gather feedback and iterate

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [OpenAI SDK](https://github.com/openai/node-sdk)
- [Aliyun DashScope](https://dashscope.aliyun.com/)
- [React Markdown](https://github.com/remarkjs/react-markdown)

## Support

For issues or questions:
1. Check this quickstart guide
2. Review API contract in `contracts/generate-diary.md`
3. Check data model in `data-model.md`
4. Review research notes in `research.md`
