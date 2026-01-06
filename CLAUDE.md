# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev          # Start development server on localhost:3000
bun run build    # Production build
bun run lint     # Run ESLint
```

## Architecture

CVForge is a Next.js 16 app that optimizes CVs/resumes for specific job postings using AI. It uses React 19, TypeScript, Tailwind CSS v4, and the Vercel AI SDK with OpenAI.

### Core Flow

The app is a 4-step wizard (`components/cv-wizard.tsx`) controlled by `hooks/use-cv-wizard.ts`:
1. **CV Input** - User enters CV data via form or JSON import
2. **Job Posting** - Analyze job from URL (via Puppeteer scraping) or pasted text
3. **Optimization** - Select mode (rephrase/enhance/tailor) and run AI optimization
4. **Preview** - View enriched CV with ATS score, download as PDF/HTML

### Key Directories

- `schema.ts` - Single source of truth for all data types (Zod schemas for CV, JobPosting, EnrichedCV)
- `services/` - Backend services:
  - `JobPostingRetrieverService` - Scrapes job pages with Puppeteer
  - `JobPostingAnalyzerService` - Extracts structured data via AI
  - `CvOptimizerService` - Enriches CV content to match job requirements
  - `CVRendererService` - Generates PDF/HTML using templates
- `templates/` - HTML template functions (modern, minimal) for CV rendering
- `app/actions/cv-actions.ts` - Server actions for all AI operations
- `lib/form-schemas.ts`, `lib/form-helpers.ts` - Form validation and ID management

### Data Flow

CV form data uses `*WithId` types (adding `id` fields for React keys). Before sending to server actions, IDs are stripped via `stripFormIds()`. After optimization, the result includes `_meta` with ATS analysis (matchedKeywords, atsScore, gapAnalysis).

### Environment

Requires `OPENAI_API_KEY` in `.env` for AI features.
