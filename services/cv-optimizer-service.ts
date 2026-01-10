import { generateText, Output } from "ai";
import {
  enrichedCvSchema,
  type CV,
  type JobPosting,
  type EnrichedCV,
} from "../schema";
import { buildOptimizationPrompt } from "./cv-optimizer-service-prompts";
import { createOpenAIClient, DEFAULT_MODEL } from "../lib/openai";

export interface OptimizeOptions {
  /** Additional context from the user (unlisted skills, achievements, preferences) */
  context?: string;
  /** Custom OpenAI API key */
  apiKey?: string;
}

export class CvOptimizerService {
  /**
   * Optimize CV to match job posting requirements.
   */
  async optimize(
    cv: CV,
    job: JobPosting,
    options: OptimizeOptions = {}
  ): Promise<EnrichedCV> {
    const prompt = buildOptimizationPrompt(cv, job, options.context);

    const openai = createOpenAIClient(options.apiKey);

    const { output } = await generateText({
      model: openai(DEFAULT_MODEL),
      prompt,
      output: Output.object({ schema: enrichedCvSchema }),
    });

    return output;
  }
}
