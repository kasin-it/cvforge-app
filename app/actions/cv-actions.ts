"use server";

import { z } from "zod";
import {
  cvSchema,
  jobPostingSchema,
  type EnrichedCV,
  type JobPosting,
} from "@/schema";
import {
  JobPostingAnalyzerService,
  CvOptimizerService,
  CVRendererService,
  GapAnalysisService,
} from "@/services";

// ============================================
// Action State Types
// ============================================

export type ActionState<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// ============================================
// Input Validation Schemas
// ============================================

const analyzeJobUrlSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});

const analyzeJobTextSchema = z.object({
  text: z.string().min(50, "Job description must be at least 50 characters"),
});

const optimizeCvUnifiedSchema = z.object({
  cv: cvSchema,
  job: jobPostingSchema,
  context: z.string().optional(),
});

const renderCvSchema = z.object({
  cv: cvSchema,
  template: z.enum(["modern", "minimal"]).default("modern"),
  format: z.enum(["pdf", "html"]).default("pdf"),
});

// ============================================
// Server Actions
// ============================================

export async function analyzeJobFromUrl(
  _prevState: ActionState<JobPosting>,
  formData: FormData
): Promise<ActionState<JobPosting>> {
  try {
    const rawData = {
      url: formData.get("url"),
    };
    const apiKey = formData.get("apiKey") as string | null;

    const validated = analyzeJobUrlSchema.safeParse(rawData);

    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || "Invalid input",
      };
    }

    const analyzer = new JobPostingAnalyzerService({ verbose: true, apiKey: apiKey || undefined });
    const jobPosting = await analyzer.analyzeFromUrl(validated.data.url);

    return {
      success: true,
      data: jobPosting,
    };
  } catch (error) {
    console.error("Job analysis error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to analyze job posting",
    };
  }
}

export async function analyzeJobFromText(
  _prevState: ActionState<JobPosting>,
  formData: FormData
): Promise<ActionState<JobPosting>> {
  try {
    const rawData = {
      text: formData.get("text"),
    };
    const apiKey = formData.get("apiKey") as string | null;

    const validated = analyzeJobTextSchema.safeParse(rawData);

    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || "Invalid input",
      };
    }

    const analyzer = new JobPostingAnalyzerService({ verbose: true, apiKey: apiKey || undefined });
    const jobPosting = await analyzer.analyzeFromText(validated.data.text);

    return {
      success: true,
      data: jobPosting,
    };
  } catch (error) {
    console.error("Job analysis error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to analyze job posting",
    };
  }
}

/**
 * Unified CV optimization that runs gap analysis internally and uses
 * structured gaps to fully optimize the CV.
 */
export async function optimizeCVUnified(
  _prevState: ActionState<EnrichedCV>,
  formData: FormData
): Promise<ActionState<EnrichedCV>> {
  try {
    const rawData = {
      cv: JSON.parse(formData.get("cv") as string),
      job: JSON.parse(formData.get("job") as string),
      context: formData.get("context") ?? undefined,
    };
    const apiKey = formData.get("apiKey") as string | null;

    const validated = optimizeCvUnifiedSchema.safeParse(rawData);

    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || "Invalid input",
      };
    }

    // Step 1: Run gap analysis internally
    const gapAnalyzer = new GapAnalysisService({ verbose: true, apiKey: apiKey || undefined });
    const gapResult = await gapAnalyzer.analyze(validated.data.cv, validated.data.job);

    // Step 2: Get actionable gaps (critical + recommended)
    const structuredGaps = gapAnalyzer.getActionableGaps(gapResult);

    // Step 3: Run full optimization with structured gaps
    const optimizer = new CvOptimizerService();
    const enrichedCV = await optimizer.enrich(validated.data.cv, validated.data.job, {
      context: validated.data.context,
      structuredGaps: structuredGaps,
      apiKey: apiKey || undefined,
    });

    return {
      success: true,
      data: enrichedCV,
    };
  } catch (error) {
    console.error("CV optimization error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to optimize CV",
    };
  }
}

export async function renderCV(formData: FormData): Promise<{
  success: boolean;
  data?: { blob: string; filename: string; contentType: string };
  error?: string;
}> {
  try {
    const rawData = {
      cv: JSON.parse(formData.get("cv") as string),
      template: formData.get("template") as "modern" | "minimal",
      format: formData.get("format") as "pdf" | "html",
    };

    const validated = renderCvSchema.safeParse(rawData);

    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || "Invalid input",
      };
    }

    const renderer = new CVRendererService();
    const { cv, template, format } = validated.data;

    if (format === "html") {
      const html = await renderer.renderHTML(cv, template);
      return {
        success: true,
        data: {
          blob: Buffer.from(html).toString("base64"),
          filename: "cv.html",
          contentType: "text/html",
        },
      };
    }

    // PDF format
    const pdf = await renderer.renderPDF(cv, { template });
    await renderer.close();

    return {
      success: true,
      data: {
        blob: pdf.toString("base64"),
        filename: "cv.pdf",
        contentType: "application/pdf",
      },
    };
  } catch (error) {
    console.error("CV render error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to render CV",
    };
  }
}


// ============================================
// Preview HTML Generation
// ============================================

const previewHtmlSchema = z.object({
  cv: cvSchema,
  template: z.enum(["modern", "minimal"]).default("modern"),
});

export async function generatePreviewHTML(formData: FormData): Promise<{
  success: boolean;
  data?: string;
  error?: string;
}> {
  try {
    const rawData = {
      cv: JSON.parse(formData.get("cv") as string),
      template: formData.get("template") as "modern" | "minimal",
    };

    const validated = previewHtmlSchema.safeParse(rawData);

    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || "Invalid input",
      };
    }

    const renderer = new CVRendererService();
    const html = await renderer.renderHTML(validated.data.cv, validated.data.template);

    return {
      success: true,
      data: html,
    };
  } catch (error) {
    console.error("Preview HTML error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate preview",
    };
  }
}
