┌─────────────────────────────────────────────────────────────────────────────────┐
  │                           STEP 1: CV INPUT                                      │
  ├─────────────────────────────────────────────────────────────────────────────────┤
  │                                                                                 │
  │  User Actions:                                                                  │
  │  ┌──────────────────┐     OR     ┌──────────────────┐                          │
  │  │  Fill CV Form    │            │  Import JSON     │                          │
  │  └────────┬─────────┘            └────────┬─────────┘                          │
  │           │                               │                                     │
  │           └───────────────┬───────────────┘                                     │
  │                           ▼                                                     │
  │  Technical Flow:                                                                │
  │  ┌─────────────────────────────────────────────────────────────────┐           │
  │  │ 1. React Hook Form validates against cvFormSchema (Zod)         │           │
  │  │ 2. Form data includes *WithId types for React keys              │           │
  │  │ 3. Auto-saves to localStorage ("cvforge_cv_data")               │           │
  │  │ 4. On submit: stripFormIds() removes IDs → clean CV object      │           │
  │  └─────────────────────────────────────────────────────────────────┘           │
  │                                                                                 │
  │  CV Object Structure:                                                           │
  │  { name, title, contact, summary, experience[], skills[],                       │
  │    education[]?, projects[]?, blogPosts[]?, languages[]?, certifications[]? }  │
  │                                                                                 │
  └─────────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
  ┌─────────────────────────────────────────────────────────────────────────────────┐
  │                        STEP 2: JOB POSTING ANALYSIS                             │
  ├─────────────────────────────────────────────────────────────────────────────────┤
  │                                                                                 │
  │  User Actions:                                                                  │
  │  ┌──────────────────┐     OR     ┌──────────────────┐                          │
  │  │  Enter Job URL   │            │  Paste Job Text  │                          │
  │  └────────┬─────────┘            └────────┬─────────┘                          │
  │           │                               │                                     │
  │           ▼                               │                                     │
  │  ┌────────────────────────────┐           │                                     │
  │  │ JobPostingRetrieverService │           │                                     │
  │  │ ─────────────────────────  │           │                                     │
  │  │ 1. Check cache (1hr TTL)   │           │                                     │
  │  │ 2. If miss → Jina Reader   │           │                                     │
  │  │    API fetches as markdown │           │                                     │
  │  │ 3. Store in cache          │           │                                     │
  │  └────────────┬───────────────┘           │                                     │
  │               │                           │                                     │
  │               └───────────────┬───────────┘                                     │
  │                               ▼                                                 │
  │  ┌─────────────────────────────────────────────────────────────────┐           │
  │  │ JobPostingAnalyzerService                                        │           │
  │  │ ─────────────────────────                                        │           │
  │  │ 1. Send content to OpenAI via Vercel AI SDK                      │           │
  │  │ 2. AI extracts structured data:                                  │           │
  │  │    - title: Clean job role name                                  │           │
  │  │    - tags[]: Atomic ATS keywords (1-3 words)                     │           │
  │  │    - skills[]: Contextual requirements as sentences              │           │
  │  │ 3. Validate against jobPostingExtractSchema                      │           │
  │  └─────────────────────────────────────────────────────────────────┘           │
  │                                                                                 │
  │  Output: JobPosting { title, tags[], skills[], sourceUrl? }                     │
  │                                                                                 │
  └─────────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
  ┌─────────────────────────────────────────────────────────────────────────────────┐
  │                         STEP 3: CV OPTIMIZATION                                 │
  ├─────────────────────────────────────────────────────────────────────────────────┤
  │                                                                                 │
  │  Input: CV + JobPosting → optimizeCVUnified() server action                     │
  │                                                                                 │
  │  ┌─────────────────────────────────────────────────────────────────┐           │
  │  │ Phase A: Gap Analysis (GapAnalysisService)                       │           │
  │  │ ─────────────────────────────────────────                        │           │
  │  │ 1. Filter CV (keep: title, summary, experience, skills, projects)│           │
  │  │ 2. AI analyzes gaps via Chain-of-Thought reasoning               │           │
  │  │ 3. Categorizes each gap:                                         │           │
  │  │    ┌──────────────────────────────────────────────────────────┐ │           │
  │  │    │ type: "missing" | "terminology"                          │ │           │
  │  │    │ category: technical-skill | soft-skill | methodology...  │ │           │
  │  │    │ priority: critical | recommended | nice-to-have          │ │           │
  │  │    │ locations: where to add (skills, summary, experience...) │ │           │
  │  │    │ suggestion: actionable instruction                       │ │           │
  │  │    └──────────────────────────────────────────────────────────┘ │           │
  │  │ 4. Returns: { suggestions[], matchedKeywords[] }                 │           │
  │  └────────────────────────────────┬────────────────────────────────┘           │
  │                                   ▼                                             │
  │  ┌─────────────────────────────────────────────────────────────────┐           │
  │  │ Filter: getActionableGaps()                                      │           │
  │  │ → Only critical + recommended gaps passed forward                │           │
  │  └────────────────────────────────┬────────────────────────────────┘           │
  │                                   ▼                                             │
  │  ┌─────────────────────────────────────────────────────────────────┐           │
  │  │ Phase B: CV Enrichment (CvOptimizerService)                      │           │
  │  │ ───────────────────────────────────────────                      │           │
  │  │ AI rewrites entire CV with:                                      │           │
  │  │                                                                  │           │
  │  │ • Summary: Repositioned for target role                          │           │
  │  │ • Experience: COMPLETE REWRITE                                   │           │
  │  │   - Reframe through target job's tech stack                      │           │
  │  │   - Highlight TRANSFERABLE skills (not just keywords)            │           │
  │  │   - Format: What + How + Impact/Result                           │           │
  │  │   - Include metrics, team size, scope                            │           │
  │  │ • Skills: Lead with job's requirements + add gaps                │           │
  │  │ • Use exact terminology from job posting                         │           │
  │  │                                                                  │           │
  │  │ Quality Rules:                                                   │           │
  │  │ - 2-3 sentences per bullet (mini-story)                          │           │
  │  │ - No buzzwords, no keyword stuffing                              │           │
  │  │ - Natural, human-like writing                                    │           │
  │  └─────────────────────────────────────────────────────────────────┘           │
  │                                                                                 │
  │  Output: EnrichedCV { ...optimizedFields, _meta: { optimizationApplied } }      │
  │                                                                                 │
  └─────────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
  ┌─────────────────────────────────────────────────────────────────────────────────┐
  │                        STEP 4: PREVIEW & EXPORT                                 │
  ├─────────────────────────────────────────────────────────────────────────────────┤
  │                                                                                 │
  │  Preview Mode:                                                                  │
  │  ┌─────────────────────────────────────────────────────────────────┐           │
  │  │ 1. Select template: Modern | Minimal                             │           │
  │  │ 2. Template function renders EnrichedCV → HTML                   │           │
  │  │ 3. Display in preview container                                  │           │
  │  │ 4. Optional: Edit optimized CV directly                          │           │
  │  └─────────────────────────────────────────────────────────────────┘           │
  │                                                                                 │
  │  Export Flow:                                                                   │
  │  ┌─────────────────────────────────────────────────────────────────┐           │
  │  │ User selects: Format (PDF | HTML) + Template                     │           │
  │  └────────────────────────────┬────────────────────────────────────┘           │
  │                               ▼                                                 │
  │  ┌─────────────────────────────────────────────────────────────────┐           │
  │  │ CVRendererService                                                │           │
  │  │ ─────────────────                                                │           │
  │  │ HTML Export:                                                     │           │
  │  │   template(cv) → HTML string → base64 encode                     │           │
  │  │                                                                  │           │
  │  │ PDF Export:                                                      │           │
  │  │   template(cv) → HTML string → Puppeteer → page.pdf() → Buffer   │           │
  │  └────────────────────────────┬────────────────────────────────────┘           │
  │                               ▼                                                 │
  │  ┌─────────────────────────────────────────────────────────────────┐           │
  │  │ Download:                                                        │           │
  │  │ 1. Decode base64 blob                                            │           │
  │  │ 2. Create Blob with MIME type                                    │           │
  │  │ 3. URL.createObjectURL() → trigger download                      │           │
  │  │ 4. Cleanup URL                                                   │           │
  │  └─────────────────────────────────────────────────────────────────┘           │
  │                                                                                 │
  └─────────────────────────────────────────────────────────────────────────────────┘

  Key Services & Files

  | Service                    | File                                      | Purpose                                  |
  |----------------------------|-------------------------------------------|------------------------------------------|
  | JobPostingRetrieverService | services/job-posting-retriever-service.ts | Fetches job pages via Jina API + caching |
  | JobPostingAnalyzerService  | services/job-posting-analyzer-service.ts  | AI extracts structured job data          |
  | GapAnalysisService         | services/gap-analysis-service.ts          | Detects skill gaps between CV & job      |
  | CvOptimizerService         | services/cv-optimizer-service.ts          | AI rewrites CV with gap guidance         |
  | CVRendererService          | services/cv-renderer-service.ts           | Generates PDF/HTML output                |
  | Server Actions             | app/actions/cv-actions.ts                 | All server-side entry points             |
  | Wizard Hook                | hooks/use-cv-wizard.ts                    | Central state management                 |

  Data Flow Summary

  CV Form → stripFormIds() → CV Object
                                ↓
  Job URL → Jina API → JobPostingAnalyzer → JobPosting { title, tags, skills }
                                                  ↓
                          ┌───────────────────────┴───────────────────────┐
                          ▼                                               ▼
                 GapAnalysisService                              Matched Keywords
                 (detects gaps)
                          ↓
              Actionable Gaps (critical + recommended)
                          ↓
                 CvOptimizerService
                 (rewrites CV with gaps)
                          ↓
                     EnrichedCV
                          ↓
              CVRendererService → PDF/HTML Download