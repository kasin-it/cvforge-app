# CLAUDE.md

> Instructions for Claude Code (claude.ai/code) and AI assistants working with this codebase.

---

## Quick Reference

| Command | Description |
|---------|-------------|
| `bun dev` | Start development server on `localhost:3000` |
| `bun run build` | Create production build |
| `bun run lint` | Run ESLint |

---

## Architecture Overview

**CVForge** is a Next.js 16 application that uses AI to optimize CVs/resumes for specific job postings. It maximizes ATS (Applicant Tracking System) compatibility by matching content to job requirements.

### Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16 | Full-stack framework (App Router) |
| React | 19 | UI components |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 4 | Styling |
| Vercel AI SDK | Latest | OpenAI integration |
| Zod | Latest | Schema validation |

---

## Application Flow

The app is a **4-step wizard** controlled by a central hook:

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Step 1     │───▶│  Step 2     │───▶│  Step 3     │───▶│  Step 4     │
│  CV Input   │    │  Job Post   │    │  Optimize   │    │  Preview    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
      │                  │                  │                  │
      ▼                  ▼                  ▼                  ▼
 Form/JSON          URL/Text             AI runs           PDF/HTML
  import            analysis           tailoring          download
```

### Step Details

| Step | Component | Description |
|------|-----------|-------------|
| 1 | `steps/cv-input-step.tsx` | User enters CV via form or JSON import |
| 2 | `steps/job-posting-step.tsx` | Analyze job from URL (Jina.ai) or pasted text |
| 3 | `steps/optimization-step.tsx` | Select mode and run AI optimization |
| 4 | `steps/preview-step.tsx` | View enriched CV with ATS score, download PDF/HTML |

Wizard state is managed by: `hooks/use-cv-wizard.ts`

---

## Key Files & Directories

### Core Schema

**`schema.ts`** - Single source of truth for all data types:
- `CVSchema` / `CV` - Base CV structure
- `JobPostingSchema` / `JobPosting` - Parsed job data
- `EnrichedCVSchema` / `EnrichedCV` - Optimized CV with `_meta` analysis

### Services (`services/`)

| Service | File | Purpose |
|---------|------|---------|
| **JobPostingRetrieverService** | `job-posting-retriever-service.ts` | Scrapes job pages via Jina.ai Reader |
| **JobPostingAnalyzerService** | `job-posting-analyzer-service.ts` | Extracts structured data from job text using AI |
| **CvOptimizerService** | `cv-optimizer-service.ts` | Tailors CV content to match job requirements |
| **CVRendererService** | `cv-renderer-service.ts` | Generates PDF/HTML using templates |

### Other Important Locations

| Path | Purpose |
|------|---------|
| `app/actions/cv-actions.ts` | Server actions for all AI operations |
| `lib/form-schemas.ts` | Form validation schemas (with `*WithId` types) |
| `lib/form-helpers.ts` | ID management utilities (`stripFormIds()`) |
| `templates/` | HTML template functions (modern, minimal themes) |
| `components/cv-wizard.tsx` | Main wizard orchestrator component |
| `components/ui/` | Reusable UI primitives (shadcn/ui style) |

---

## Data Flow Patterns

### Form Data with IDs

The form uses `*WithId` types (adding `id` fields for React keys):

```typescript
// Form data has IDs for React list rendering
type ExperienceWithId = Experience & { id: string }

// Before server actions, strip IDs:
const cleanData = stripFormIds(formData)  // lib/form-helpers.ts
```

### Enriched CV Structure

After optimization, the result includes metadata:

```typescript
interface EnrichedCV extends CV {
  _meta: {
    matchedKeywords: string[]
    atsScore: number
    suggestions: string[]
  }
}
```

---

## Environment Setup

Required in `.env`:

```env
OPENAI_API_KEY=sk-...     # Required - AI features
JINA_AI_API_KEY=jina_...  # Optional - faster URL scraping
```

---

## Common Tasks

### Adding a New CV Section

1. Update `schema.ts` with new Zod schema
2. Add `*WithId` variant in `lib/form-schemas.ts`
3. Update form components in `steps/cv-input-step.tsx`
4. Update `stripFormIds()` in `lib/form-helpers.ts`
5. Update templates in `templates/`

### Modifying AI Behavior

- Job analysis prompts: `services/job-posting-analyzer-service.ts`
- CV optimization prompts: `services/cv-optimizer-service.ts`
- Server action wrappers: `app/actions/cv-actions.ts`

### Adding a New Template

1. Create template function in `templates/` following existing patterns
2. Register in `CVRendererService`
3. Add selection UI in preview step if needed

---

## Conventions

- **Schema first**: All data types derive from Zod schemas in `schema.ts`
- **Server actions**: AI operations go through `app/actions/cv-actions.ts`
- **Form IDs**: Use `WithId` types for forms, strip before server calls
- **Templates**: Pure functions returning HTML strings
