import { generateText, Output } from "ai";
import { jobPostingExtractSchema, type JobPosting } from "../schema";
import { JobPostingRetrieverService } from "./job-posting-retriever-service";
import { createOpenAIClient, DEFAULT_MODEL } from "../lib/openai";

export interface JobAnalyzerConfig {
  verbose?: boolean;
  apiKey?: string;
}

export class JobPostingAnalyzerService {
  private readonly retriever: JobPostingRetrieverService;
  private readonly verbose: boolean;
  private readonly apiKey?: string;

  constructor(config: JobAnalyzerConfig = {}) {
    this.retriever = new JobPostingRetrieverService();
    this.verbose = config.verbose ?? false;
    this.apiKey = config.apiKey;
  }

  async analyzeFromUrl(url: string): Promise<JobPosting> {
    const retrieved = await this.retriever.retrieve(url);

    const posting = await this.extractStructuredData(retrieved.content);

    return { ...posting, sourceUrl: url };
  }

  async analyzeFromText(content: string): Promise<JobPosting> {
    return this.extractStructuredData(content);
  }

  private async extractStructuredData(content: string): Promise<JobPosting> {
    const openai = createOpenAIClient(this.apiKey);

    const { output } = await generateText({
      model: openai(DEFAULT_MODEL),
      output: Output.object({ schema: jobPostingExtractSchema }),
      prompt: `
      You are an expert ATS (Applicant Tracking System) parser. Your goal is to analyze the provided job posting and extract data to optimize a candidate's CV.

Analyze the text and output a JSON object.

### EXTRACTION RULES

**1. title**
*   Extract the specific job role.
*   **Clean:** Remove buzzwords, location, salary, or internal codes (e.g., convert "URGENT: Senior React Dev - Remote - $150k (J-202)" to "Senior React Developer").

**2. tags** (Atomic Keywords for Matching)
*   Extract a comprehensive list of atomic keywords (1-3 words max).
*   **Focus:** Technologies, Tools, Methodologies, Spoken Languages, and Hard Skills.
*   **Examples:** "TypeScript", "CI/CD", "Scrum", "B2B Sales", "Team Leadership", "English".
*   **Goal:** These tags will be used for keyword density matching. Be exhaustive.

**MUST extract separately (do not combine or skip):**
*   **Testing frameworks AND libraries individually:** Jest, React Testing Library (RTL), Cypress, Playwright, Mocha, Jasmine, Testing Library
*   **Build tools individually:** Webpack, Babel, Vite, esbuild, Rollup, Parcel, Turbopack
*   **Versioned technologies when specified:** HTML5, CSS3, ES6+, Python 3, Java 17, .NET 6, etc.
*   **Implicit web skills when mentioned:** "responsive design", "RWD", "cross-browser compatibility", "mobile-first", "accessibility", "a11y"
*   **Cloud platforms individually:** AWS, GCP, Azure, DigitalOcean (not just "cloud")
*   **Quality/practice keywords:** "performance optimization", "debugging", "code quality", "clean code", "maintainable code", "testable code"
*   **Domain context:** finance, fintech, banking, healthcare, e-commerce, SaaS, B2B, enterprise

**3. skills** (Key Requirements - CONCISE)
*   Extract core requirements as SHORT phrases (not full sentences).
*   Focus on: years of experience + technology/skill
*   Keep each skill to under 10 words when possible
*   **Examples:**
    *   *Good:* "5+ years Python/Django experience"
    *   *Good:* "Strong TypeScript and React skills"
    *   *Bad:* "We are looking for a candidate with at least 5 years of commercial experience working with Python and the Django framework in a professional environment."

### RESPONSE FORMAT

Output **only** a raw JSON object matching this structure exactly. Do not include markdown formatting (json) or introductory text.

{
  "title": "string",
  "tags": ["string", "string"],
  "skills": ["string", "string"]
}

### JOB POSTING CONTENT
${content}

      `.trim(),
    });

    return output;
  }
}
