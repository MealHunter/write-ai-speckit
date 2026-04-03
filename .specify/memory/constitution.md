<!-- Sync Impact Report
Version: 1.1.0 (MINOR bump - tech stack principles added)
Status: Updated with Next.js + Tailwind + shadcn/ui stack requirements
Principles Modified: 
  - I. Code Quality First → refined for Next.js/React patterns
  - III. User Experience Consistency → updated for Tailwind + shadcn/ui component library
Principles Added: 
  - VI. Backend API Standards (Next.js API Routes)
  - VII. Frontend Component Architecture (Tailwind + shadcn/ui)
Sections Added: Technology Stack Requirements
Templates Updated: ✅ All dependent templates reviewed and aligned
  - tasks-template.md: Path conventions updated for Next.js (app/, api/, components/)
  - spec-template.md: No changes needed (tech-agnostic)
  - plan-template.md: Technical context updated for Next.js stack
-->

# Write-AI Constitution

## Core Principles

### I. Code Quality First
Every line of code must be maintainable, readable, and defensible. Code quality is not negotiable—it directly impacts system reliability, team velocity, and long-term sustainability.

- All code must follow established linting and formatting standards (enforced via pre-commit hooks)
- Complex logic requires inline comments explaining the "why," not the "what"
- Cyclomatic complexity must remain below 10 per function; refactor if exceeded
- No dead code, unused imports, or commented-out logic in committed code
- Code reviews must verify quality standards before merge; quality issues block approval

### II. Test-First Development (NON-NEGOTIABLE)
Testing is not an afterthought—it is the specification. Tests drive design and validate behavior before implementation.

- Red-Green-Refactor cycle strictly enforced: write failing tests first, implement to pass, then refactor
- Minimum 80% code coverage required for all new features; coverage regressions block merge
- Unit tests must be fast (<100ms per test); slow tests indicate design issues
- Integration tests required for: new API contracts, contract changes, inter-service communication, shared schemas
- Test names must clearly describe behavior: `test_should_return_error_when_input_is_null` not `test_input`

### III. User Experience Consistency
Every user-facing feature must deliver a predictable, coherent experience. Consistency builds trust and reduces cognitive load.

- All UI components must use shadcn/ui library; custom components only when shadcn lacks required functionality
- Styling must use Tailwind CSS utility classes; no inline styles or CSS modules except for dynamic values
- Error messages must be actionable: explain what went wrong and how to fix it
- Response formats (JSON, text, tables) must be consistent across all endpoints
- Accessibility requirements (WCAG 2.1 AA minimum) must be met for all user-facing features
- User-facing changes require design review before implementation; breaking changes require migration guidance

### IV. Performance Requirements
Performance is a feature. Slow systems frustrate users and waste resources.

- API response times must be <200ms for 95th percentile; <500ms for 99th percentile
- Database queries must complete in <100ms; queries exceeding this require indexing review
- Memory usage must not exceed baseline by >10% per feature addition
- All new features must include performance benchmarks; regressions trigger investigation
- Caching strategy must be documented for any operation exceeding 50ms

### V. Observability & Debuggability
Systems must be transparent. Logs, metrics, and traces must enable rapid diagnosis of issues.

- Structured logging required: all logs must include context (request ID, user ID, operation)
- Error logs must include stack traces and relevant state; debug logs must be concise
- All external API calls must be instrumented with timing and error tracking
- Metrics must track: request volume, latency (p50/p95/p99), error rates, resource usage
- Production incidents must be traceable to root cause within 15 minutes via logs/metrics

### VI. Backend API Standards
All backend functionality must be exposed through Next.js API Routes. This ensures consistent, maintainable server-side code.

- All backend endpoints must be implemented in `app/api/` directory using Next.js App Router conventions
- Each endpoint must have clear request/response contracts documented in JSDoc comments
- API responses must follow consistent JSON structure: `{ success: boolean, data?: T, error?: string }`
- All API routes must validate input and return appropriate HTTP status codes (200, 400, 401, 404, 500)
- Database operations must be isolated in service layer; API routes must not contain business logic
- Authentication/authorization must be enforced at API route level; no unauthenticated endpoints without explicit justification

### VII. Frontend Component Architecture
All frontend components must use Tailwind CSS and shadcn/ui for consistency and maintainability.

- Components must be located in `app/components/` or feature-specific subdirectories
- All components must be functional React components with TypeScript types
- Component props must be fully typed; no `any` types without explicit justification
- Styling must use Tailwind CSS classes; dynamic styles use `clsx` or `cn` utility
- shadcn/ui components must be used for all standard UI patterns (buttons, forms, dialogs, etc.)
- Custom components must be documented with usage examples; complex components require Storybook entries
- No inline styles, CSS modules, or CSS-in-JS libraries; Tailwind is the single source of truth for styling

## Technology Stack Requirements

**Backend**: Next.js 16+ with App Router, TypeScript, API Routes  
**Frontend**: React 19+, TypeScript, Tailwind CSS 4+, shadcn/ui  
**Styling**: Tailwind CSS utility-first approach; no CSS modules or inline styles  
**Component Library**: shadcn/ui for all standard UI components  
**Testing**: Jest/Vitest for unit tests, Playwright for E2E tests  
**Linting**: ESLint with Next.js config, Prettier for formatting  
**Database**: [To be specified per feature]  
**Deployment**: Vercel (recommended) or self-hosted Node.js environment

## Quality Gates

All code must pass these gates before merge:

1. **Linting & Formatting**: Zero violations; automated via pre-commit hooks
2. **Type Safety**: No `any` types without explicit justification; TypeScript strict mode enforced
3. **Test Coverage**: Minimum 80% coverage; coverage reports required in PR
4. **Performance**: No regressions in benchmarks; new features include baseline metrics
5. **Security**: No hardcoded secrets, SQL injection vectors, or XSS vulnerabilities; automated scanning required
6. **Documentation**: Public APIs must have JSDoc/docstrings; complex logic requires inline comments
7. **Component Compliance**: All UI components use shadcn/ui or Tailwind; no custom styling without justification

## Performance Standards

- **API Latency**: p95 <200ms, p99 <500ms (measured end-to-end)
- **Database**: Query execution <100ms; N+1 queries prohibited
- **Memory**: No memory leaks; baseline + 10% tolerance per feature
- **Build Time**: Full build <5 minutes; incremental <30 seconds
- **Test Suite**: Full run <10 minutes; unit tests <5 minutes
- **Startup Time**: Application ready to serve requests <5 seconds

Performance regressions >5% trigger automatic investigation and rollback consideration.

## Development Workflow

1. **Feature Planning**: Requirements → Design Review → Spec → Implementation Plan
2. **Implementation**: Tests written first → Code implementation → Code review → Merge
3. **Code Review**: Verify quality gates, test coverage, performance impact, documentation
4. **Testing**: Unit tests (fast), integration tests (contract validation), manual testing (UX)
5. **Deployment**: Staging validation → Production canary (10%) → Full rollout
6. **Monitoring**: Metrics tracked for 24 hours post-deploy; rollback if anomalies detected

All PRs must include:
- Clear description of changes and rationale
- Test coverage report
- Performance impact analysis (if applicable)
- Migration guide (if breaking changes)

## Governance

**Constitution Authority**: This constitution supersedes all other practices and guidelines. When conflicts arise, constitution principles take precedence.

**Amendment Process**:
1. Proposed amendment must include rationale and impact analysis
2. Team review and discussion (minimum 48 hours)
3. Consensus required for approval; documented in commit message
4. Version bumped according to semantic versioning rules
5. All dependent templates and guidance updated within 1 week

**Versioning Policy**:
- MAJOR: Backward-incompatible principle removals or redefinitions
- MINOR: New principles added or materially expanded guidance
- PATCH: Clarifications, wording, typo fixes, non-semantic refinements

**Compliance Review**:
- All PRs must verify compliance with applicable principles
- Complexity or deviation must be explicitly justified in PR description
- Quality gate violations require exception approval (documented in PR)
- Monthly review of metrics against performance standards; trends trigger investigation

**Runtime Guidance**: Development team refers to `.claude/commands/` for agent-specific implementation guidance and `.specify/templates/` for artifact templates. These are derived from this constitution and must remain aligned.

---

**Version**: 1.1.0 | **Ratified**: 2026-04-03 | **Last Amended**: 2026-04-03
