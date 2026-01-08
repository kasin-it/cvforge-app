import { generateText, Output } from "ai";
import {
  gapAnalysisResultSchema,
  type CV,
  type JobPosting,
  type GapAnalysisResult,
  type GapSuggestion,
  type GapPriority,
  type GapLocation,
} from "../schema";
import {
  buildGapAnalysisPrompt,
  filterCVForGapAnalysis,
} from "./gap-analysis-prompts";
import { createOpenAIClient, DEFAULT_MODEL } from "../lib/openai";

export interface GapAnalysisConfig {
  verbose?: boolean;
  apiKey?: string;
}

export class GapAnalysisService {
  private readonly verbose: boolean;
  private readonly apiKey?: string;

  constructor(config: GapAnalysisConfig = {}) {
    this.verbose = config.verbose ?? false;
    this.apiKey = config.apiKey;
  }

  /**
   * Perform structured gap analysis between CV and job posting.
   * Returns actionable suggestions with priority, location, and concrete instructions.
   */
  async analyze(cv: CV, job: JobPosting): Promise<GapAnalysisResult> {
    const filteredCV = filterCVForGapAnalysis(cv);

    const prompt = buildGapAnalysisPrompt(filteredCV, job);

    const openai = createOpenAIClient(this.apiKey);

    const { output } = await generateText({
      model: openai(DEFAULT_MODEL),
      output: Output.object({ schema: gapAnalysisResultSchema }),
      prompt,
    });

    console.log("Gap analysis output:", JSON.stringify(output, null, 2));

    return output;
  }

  /**
   * Filter suggestions by priority level(s).
   */
  filterByPriority(
    result: GapAnalysisResult,
    priorities: GapPriority[]
  ): GapSuggestion[] {
    return result.suggestions.filter((s) => priorities.includes(s.priority));
  }

  /**
   * Get only critical and recommended gaps (exclude nice-to-have).
   */
  getActionableGaps(result: GapAnalysisResult): GapSuggestion[] {
    return this.filterByPriority(result, ["critical", "recommended"]);
  }

  /**
   * Group suggestions by their target location in the CV.
   */
  groupByLocation(
    suggestions: GapSuggestion[]
  ): Record<GapLocation, GapSuggestion[]> {
    const grouped: Record<GapLocation, GapSuggestion[]> = {
      skills: [],
      summary: [],
      experience: [],
      projects: [],
    };

    for (const suggestion of suggestions) {
      for (const location of suggestion.locations) {
        grouped[location].push(suggestion);
      }
    }

    return grouped;
  }

  /**
   * Get terminology gaps only (where CV uses different term than job posting).
   */
  getTerminologyGaps(result: GapAnalysisResult): GapSuggestion[] {
    return result.suggestions.filter((s) => s.type === "terminology");
  }

  /**
   * Get missing gaps only (skills not present in CV at all).
   */
  getMissingGaps(result: GapAnalysisResult): GapSuggestion[] {
    return result.suggestions.filter((s) => s.type === "missing");
  }
}
