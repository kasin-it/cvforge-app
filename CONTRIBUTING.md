# Contributing to CVForge

Thank you for your interest in contributing to CVForge! This document provides guidelines for contributing to the project.

## Development Setup

1. Fork and clone the repository
2. Install dependencies with `bun install`
3. Copy `.env.example` to `.env` and add your OpenAI API key
4. Run `bun dev` to start the development server

## Code Style

- TypeScript strict mode is enabled
- ESLint is configured for code quality
- Run `bun run lint` before committing

## Project Architecture

### Key Concepts

- **Schema-first**: All data types are defined in `schema.ts` using Zod schemas
- **Form IDs**: Form data uses `*WithId` types for React keys, stripped before API calls via `stripFormIds()`
- **Server Actions**: All AI operations go through `app/actions/cv-actions.ts`

### Directory Structure

| Directory | Purpose |
|-----------|---------|
| `schema.ts` | Single source of truth for all data types |
| `services/` | Backend services (retrieval, analysis, optimization, rendering) |
| `components/steps/` | Wizard step components |
| `hooks/` | React hooks including wizard state management |
| `lib/` | Utilities, form schemas, and helpers |
| `templates/` | HTML templates for CV rendering |

### Data Flow

```
User Input → Form (with IDs) → stripFormIds() → Server Action → AI Service → Response
```

## Making Changes

### Before You Start

1. Check existing issues to avoid duplicate work
2. For significant changes, open an issue first to discuss the approach

### Development Workflow

1. Create a feature branch from `main`
2. Make your changes
3. Run linting: `bun run lint`
4. Test your changes locally
5. Commit with clear, descriptive messages

### Commit Messages

Use clear, descriptive commit messages:

```
feat: add support for LinkedIn job URLs
fix: resolve PDF export encoding issue
refactor: simplify job posting analyzer prompt
docs: update README with new features
```

## Pull Requests

1. Fill out the PR template
2. Reference any related issues
3. Ensure all checks pass
4. Request review from maintainers

## Areas for Contribution

- **CV Templates**: Add new HTML templates in `templates/`
- **Job Site Support**: Improve scraping for specific job boards
- **AI Prompts**: Enhance extraction and optimization prompts in `services/`
- **UI/UX**: Improve the wizard interface in `components/`
- **Documentation**: Improve README, add examples

## Questions?

Open an issue for any questions about contributing.
