<!-- Sync Impact Report
Version: 1.0.0 (initial)
Status: Created from template
Principles Added: 5 core principles (Code Quality, Testing Standards, UX Consistency, Performance, Observability)
Sections Added: Quality Gates, Performance Standards, Development Workflow
Templates Updated: ✅ All dependent templates reviewed and aligned
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
- Integration tests required for: new library contracts, contract changes, inter-service communication, shared schemas
- Test names must clearly describe behavior: `test_should_return_error_when_input_is_null` not `test_input`

### III. User Experience Consistency
Every user-facing feature must deliver a predictable, coherent experience. Consistency builds trust and reduces cognitive load.

- All UI/CLI outputs must follow established design patterns and terminology
- Error messages must be actionable: explain what went wrong and how to fix it
- Response formats (JSON, text, tables) must be consistent across all endpoints/commands
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

## Quality Gates

All code must pass these gates before merge:

1. **Linting & Formatting**: Zero violations; automated via pre-commit hooks
2. **Type Safety**: No `any` types without explicit justification; TypeScript strict mode enforced
3. **Test Coverage**: Minimum 80% coverage; coverage reports required in PR
4. **Performance**: No regressions in benchmarks; new features include baseline metrics
5. **Security**: No hardcoded secrets, SQL injection vectors, or XSS vulnerabilities; automated scanning required
6. **Documentation**: Public APIs must have JSDoc/docstrings; complex logic requires inline comments

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

**Version**: 1.0.0 | **Ratified**: 2026-04-03 | **Last Amended**: 2026-04-03
