import { generateText, Output } from "ai";
import {
  enrichedCvSchema,
  enrichmentMetaSchema,
  type CV,
  type JobPosting,
  type EnrichedCV,
  type EnrichmentMeta,
} from "../schema";
import {
  buildEnrichmentPrompt,
  buildAnalysisPrompt,
  type OptimizationMode,
} from "./cv-optimizer-service-prompts";
import { openai, DEFAULT_MODEL } from "../lib/openai";

export interface EnrichOptions {
  /**
   * Optimization mode:
   * - "rephrase": Minimal changes, just match terminology
   * - "enhance": Add inferred skills, strengthen bullets
   * - "tailor": Full optimization to match job posting
   */
  mode?: OptimizationMode;
  /** Additional context from the user (unlisted skills, achievements, preferences) */
  context?: string;
}

export interface CvOptimizerConfig {
  defaultMode?: OptimizationMode;
}

export class CvOptimizerService {
  private defaultMode: OptimizationMode;

  constructor(config: CvOptimizerConfig = {}) {
    this.defaultMode = config.defaultMode ?? "enhance";
  }

  async enrich(
    cv: CV,
    job: JobPosting,
    options: EnrichOptions = {}
  ): Promise<EnrichedCV> {
    const mode = options.mode ?? this.defaultMode;

    const { output } = await generateText({
      model: openai(DEFAULT_MODEL),
      output: Output.object({ schema: enrichedCvSchema }),
      prompt: buildEnrichmentPrompt(cv, job, mode, options.context),
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

  async analyze(cv: CV, job: JobPosting): Promise<EnrichmentMeta> {
    const { output } = await generateText({
      model: openai(DEFAULT_MODEL),
      output: Output.object({ schema: enrichmentMetaSchema }),
      prompt: buildAnalysisPrompt(cv, job),
    });

    return output;
  }

  stripMeta(enriched: EnrichedCV): CV {
    const { _meta, ...clean } = enriched;
    return clean;
  }
}

export type { OptimizationMode };
