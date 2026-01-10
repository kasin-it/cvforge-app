"use server";

import { z } from "zod";
import {
  cvSchema,
  jobPostingSchema,
  type EnrichedCV,
  type JobPosting,
} from "@/schema";
import { JobPostingAnalyzerService } from "@/services/job-posting-analyzer-service";
import { CvOptimizerService } from "@/services/cv-optimizer-service";
import { CVRendererService } from "@/services/cv-renderer-service";

export type ActionState<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

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

export async function analyzeJobFromUrl(
  _prevState: ActionState<JobPosting>,
  formData: FormData
): Promise<ActionState<JobPosting>> {
  const totalStart = performance.now();

  try {
    console.log("[Job Analysis URL] Starting...");

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

    const analyzeStart = performance.now();
    const analyzer = new JobPostingAnalyzerService({ apiKey: apiKey || undefined });
    const jobPosting = await analyzer.analyzeFromUrl(validated.data.url);

    console.log(`[Job Analysis URL] Analysis completed: ${((performance.now() - analyzeStart) / 1000).toFixed(2)}s`);
    console.log(`[Job Analysis URL] Total time: ${((performance.now() - totalStart) / 1000).toFixed(2)}s`);

    return {
      success: true,
      data: jobPosting,
    };
  } catch (error) {
    console.error("Job analysis error:", error);
    console.log(`[Job Analysis URL] Failed after: ${((performance.now() - totalStart) / 1000).toFixed(2)}s`);
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
  const totalStart = performance.now();

  try {
    console.log("[Job Analysis Text] Starting...");

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

    const analyzeStart = performance.now();
    const analyzer = new JobPostingAnalyzerService({ apiKey: apiKey || undefined });
    const jobPosting = await analyzer.analyzeFromText(validated.data.text);

    console.log(`[Job Analysis Text] Analysis completed: ${((performance.now() - analyzeStart) / 1000).toFixed(2)}s`);
    console.log(`[Job Analysis Text] Total time: ${((performance.now() - totalStart) / 1000).toFixed(2)}s`);

    return {
      success: true,
      data: jobPosting,
    };
  } catch (error) {
    console.error("Job analysis error:", error);
    console.log(`[Job Analysis Text] Failed after: ${((performance.now() - totalStart) / 1000).toFixed(2)}s`);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to analyze job posting",
    };
  }
}

/**
 * CV optimization - rewrites CV to match job requirements.
 */
export async function optimizeCVUnified(
  _prevState: ActionState<EnrichedCV>,
  formData: FormData
): Promise<ActionState<EnrichedCV>> {
  try {
    const cvString = formData.get("cv");
    const jobString = formData.get("job");

    if (typeof cvString !== "string" || typeof jobString !== "string") {
      return { success: false, error: "Missing required data" };
    }

    const rawData = {
      cv: JSON.parse(cvString),
      job: JSON.parse(jobString),
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

    const optimizer = new CvOptimizerService();
    const enrichedCV = await optimizer.optimize(validated.data.cv, validated.data.job, {
      context: validated.data.context,
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
    const cvString = formData.get("cv");
    const template = formData.get("template");
    const format = formData.get("format");

    if (typeof cvString !== "string") {
      return { success: false, error: "Missing CV data" };
    }

    const rawData = {
      cv: JSON.parse(cvString),
      template,
      format,
    };

    const validated = renderCvSchema.safeParse(rawData);

    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || "Invalid input",
      };
    }

    const renderer = new CVRendererService();
    const { cv, template: validatedTemplate, format: validatedFormat } = validated.data;

    if (validatedFormat === "html") {
      const html = await renderer.renderHTML(cv, validatedTemplate);
      await renderer.close();
      return {
        success: true,
        data: {
          blob: Buffer.from(html).toString("base64"),
          filename: "cv.html",
          contentType: "text/html",
        },
      };
    }

    const pdf = await renderer.renderPDF(cv, { template: validatedTemplate });
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
    const cvString = formData.get("cv");

    if (typeof cvString !== "string") {
      return { success: false, error: "Missing CV data" };
    }

    const rawData = {
      cv: JSON.parse(cvString),
      template: formData.get("template"),
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
