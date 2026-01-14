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

// Max payload sizes (in bytes)
const MAX_CV_SIZE = 50 * 1024; // 50KB
const MAX_JOB_TEXT_SIZE = 100 * 1024; // 100KB
const MAX_URL_SIZE = 2048; // 2KB

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
});

export async function analyzeJobFromUrl(
  _prevState: ActionState<JobPosting>,
  formData: FormData
): Promise<ActionState<JobPosting>> {
  const totalStart = performance.now();

  try {
    console.log("[Job Analysis URL] Starting...");

    const url = formData.get("url");
    if (typeof url === "string" && url.length > MAX_URL_SIZE) {
      return { success: false, error: "URL too long" };
    }

    const rawData = { url };
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

    const text = formData.get("text");
    if (typeof text === "string" && text.length > MAX_JOB_TEXT_SIZE) {
      return { success: false, error: "Job description too long (max 100KB)" };
    }

    const rawData = { text };
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

    if (cvString.length > MAX_CV_SIZE) {
      return { success: false, error: "CV data too large (max 50KB)" };
    }

    if (jobString.length > MAX_JOB_TEXT_SIZE) {
      return { success: false, error: "Job data too large (max 100KB)" };
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
  const cvString = formData.get("cv");
  const template = formData.get("template");

  if (typeof cvString !== "string") {
    return { success: false, error: "Missing CV data" };
  }

  if (cvString.length > MAX_CV_SIZE) {
    return { success: false, error: "CV data too large (max 50KB)" };
  }

  let rawData;
  try {
    rawData = {
      cv: JSON.parse(cvString),
      template,
    };
  } catch {
    return { success: false, error: "Invalid CV data format" };
  }

  const validated = renderCvSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0]?.message || "Invalid input",
    };
  }

  const renderer = new CVRendererService();
  try {
    const { cv, template: validatedTemplate } = validated.data;
    const pdf = await renderer.renderPDF(cv, { template: validatedTemplate });

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
  } finally {
    await renderer.close();
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

    if (cvString.length > MAX_CV_SIZE) {
      return { success: false, error: "CV data too large (max 50KB)" };
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
