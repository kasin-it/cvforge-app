import { generateText, Output } from "ai";
import {
  enrichedCvSchema,
  type CV,
  type JobPosting,
  type EnrichedCV,
  type GapSuggestion,
} from "../schema";
import { buildEnrichmentPrompt } from "./cv-optimizer-service-prompts";
import { createOpenAIClient, DEFAULT_MODEL } from "../lib/openai";

export interface EnrichOptions {
  /** Additional context from the user (unlisted skills, achievements, preferences) */
  context?: string;
  /** Structured gap suggestions with priority, location, and actionable instructions */
  structuredGaps?: GapSuggestion[];
  /** Custom OpenAI API key */
  apiKey?: string;
}

export class CvOptimizerService {
  async enrich(
    cv: CV,
    job: JobPosting,
    options: EnrichOptions = {}
  ): Promise<EnrichedCV> {
    const prompt = buildEnrichmentPrompt(
      cv,
      job,
      options.context,
      options.structuredGaps
    );

    const openai = createOpenAIClient(options.apiKey);

    const { output } = await generateText({
      model: openai(DEFAULT_MODEL),
      output: Output.object({ schema: enrichedCvSchema }),
      prompt,
    });

    return output;
  }

  async enrichClean(
    cv: CV,
    job: JobPosting,
    options: EnrichOptions = {}
  ): Promise<CV> {
    const enriched = await this.enrich(cv, job, options);
    return this.stripMeta(enriched);
  }

  stripMeta(enriched: EnrichedCV): CV {
    const { ...clean } = enriched;
    return clean;
  }
}
