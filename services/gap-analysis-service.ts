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
import { openai, DEFAULT_MODEL } from "../lib/openai";

export interface GapAnalysisConfig {
  verbose?: boolean;
}

export class GapAnalysisService {
  private readonly verbose: boolean;

  constructor(config: GapAnalysisConfig = {}) {
    this.verbose = config.verbose ?? false;
  }

  /**
   * Perform structured gap analysis between CV and job posting.
   * Returns actionable suggestions with priority, location, and concrete instructions.
   */
  async analyze(cv: CV, job: JobPosting): Promise<GapAnalysisResult> {
    const filteredCV = filterCVForGapAnalysis(cv);

    this.log("Starting structured gap analysis");
    this.log(
      `CV: ${cv.experience.length} experiences, ${cv.skills.length} skills`
    );
    this.log(
      `Job: ${job.title}, ${job.tags.length} tags, ${job.skills.length} requirements`
    );

    const prompt = buildGapAnalysisPrompt(filteredCV, job);

    const { output } = await generateText({
      model: openai(DEFAULT_MODEL),
      output: Output.object({ schema: gapAnalysisResultSchema }),
      prompt,
    });

    this.log(`Analysis complete: ${output.suggestions.length} gaps identified`);
    this.log(`Matched keywords: ${output.matchedKeywords.length}`);

    if (this.verbose) {
      console.log("[GapAnalysis] === FULL OUTPUT ===");
      console.log(JSON.stringify(output, null, 2));
      console.log("[GapAnalysis] === END OUTPUT ===");
    }

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

  private log(message: string): void {
    if (this.verbose) {
      console.log(`[GapAnalysis] ${message}`);
    }
  }
}
