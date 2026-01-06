import { generateText, Output } from "ai";
import { jobPostingSchema, type JobPosting } from "../schema";
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

  async analyzeFromUrl(
    url: string
  ): Promise<JobPosting & { sourceUrl: string }> {
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
      output: Output.object({ schema: jobPostingSchema }),
      prompt: `
Extract comprehensive structured data from this job posting.

CRITICAL: Extract EVERY technology, tool, framework, and skill mentioned.
For keywords array, include ALL terms that would help pass ATS screening.
Be exhaustive with techStack - include versions, frameworks, libraries, tools.

Job Posting:
${content}
      `.trim(),
    });

    this.log(`Extracted: ${output.title} @ ${output.company}`);
    return output;
  }

  private log(message: string): void {
    if (this.verbose) {
      console.log(`[JobAnalyzer] ${message}`);
    }
  }
}

