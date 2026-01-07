import { generateText, Output } from "ai";
import { jobPostingExtractSchema, type JobPosting } from "../schema";
import { JobPostingRetrieverService } from "./job-posting-retriever-service";
import { openai, DEFAULT_MODEL } from "../lib/openai";

export interface JobAnalyzerConfig {
  verbose?: boolean;
}

export class JobPostingAnalyzerService {
  private readonly retriever: JobPostingRetrieverService;
  private readonly verbose: boolean;

  constructor(config: JobAnalyzerConfig = {}) {
    this.retriever = new JobPostingRetrieverService();
    this.verbose = config.verbose ?? false;
  }

  async analyzeFromUrl(url: string): Promise<JobPosting> {
    this.log(`Fetching: ${url}`);
    const retrieved = await this.retriever.retrieve(url);
    this.log(`Retrieved ${retrieved.content.length} chars`);

    const posting = await this.extractStructuredData(retrieved.content);

    return { ...posting, sourceUrl: url };
  }

  async analyzeFromText(content: string): Promise<JobPosting> {
    this.log(`Analyzing ${content.length} chars`);
    return this.extractStructuredData(content);
  }

  private async extractStructuredData(content: string): Promise<JobPosting> {
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

**3. skills** (Contextual Requirements)
*   Extract the specific requirements and responsibilities as full, coherent sentences.
*   **Critical:** You MUST preserve "years of experience", "proficiency levels", and "optional vs. required" context.
*   **Examples:**
    *   *Good:* "5+ years of commercial experience with Python and Django."
    *   *Bad:* "Python" (This belongs in tags).

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

  private log(message: string): void {
    if (this.verbose) {
      console.log(`[JobAnalyzer] ${message}`);
    }
  }
}
