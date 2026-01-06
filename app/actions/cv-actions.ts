"use server";

import { z } from "zod";
import {
  cvSchema,
  jobPostingSchema,
  enrichedCvSchema,
  type CV,
  type JobPosting,
  type EnrichedCV,
} from "@/schema";
import {
  JobPostingAnalyzerService,
  CvOptimizerService,
  CVRendererService,
  type OptimizationMode,
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

const optimizeCvSchema = z.object({
  cv: cvSchema,
  job: jobPostingSchema,
  mode: z.enum(["rephrase", "enhance", "tailor"]).default("enhance"),
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

    const validated = analyzeJobUrlSchema.safeParse(rawData);

    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || "Invalid input",
      };
    }

    const analyzer = new JobPostingAnalyzerService({ verbose: true });
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

    const validated = analyzeJobTextSchema.safeParse(rawData);

    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || "Invalid input",
      };
    }

    const analyzer = new JobPostingAnalyzerService({ verbose: true });
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

export async function optimizeCV(
  _prevState: ActionState<EnrichedCV>,
  formData: FormData
): Promise<ActionState<EnrichedCV>> {
  try {
    const rawData = {
      cv: JSON.parse(formData.get("cv") as string),
      job: JSON.parse(formData.get("job") as string),
      mode: formData.get("mode") as OptimizationMode,
      context: formData.get("context") as string | undefined,
    };

    const validated = optimizeCvSchema.safeParse(rawData);

    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || "Invalid input",
      };
    }

    const optimizer = new CvOptimizerService();
    const enrichedCV = await optimizer.enrich(validated.data.cv, validated.data.job, {
      mode: validated.data.mode,
      context: validated.data.context,
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
