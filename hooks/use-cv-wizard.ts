"use client";

import { useState, useCallback, useEffect } from "react";
import { cvSchema, type JobPosting, type EnrichedCV } from "@/schema";
import type { CVFormValues } from "@/lib/form-schemas";
import type { TemplateType, ExportFormat, WizardStep } from "@/lib/types";
import { useApiKey } from "@/contexts/api-key-context";
import {
  analyzeJobFromUrl,
  analyzeJobFromText,
  optimizeCVUnified,
} from "@/app/actions/cv-actions";
import { stripFormIds, addFormIds, generateId } from "@/lib/form-helpers";
import { downloadHTML, downloadPDF } from "@/lib/cv-renderer-client";

const STORAGE_KEY = "cvforge_cv_data";

export type WizardState = {
  currentStep: WizardStep;
  cvFormData: CVFormValues | null;
  jobUrl: string;
  jobText: string;
  jobPosting: JobPosting | null;
  isAnalyzing: boolean;
  context: string;
  template: TemplateType;
  enrichedCV: EnrichedCV | null;
  isOptimizing: boolean;
  isDownloading: boolean;
  format: ExportFormat;
  error: string | null;
};

function createEmptyCVFormData(): CVFormValues {
  return {
    name: "",
    title: "",
    contact: {
      email: "",
      phone: null,
      location: null,
      linkedin: null,
      github: null,
      website: null,
    },
    summary: "",
    experience: [],
    skills: [],
    education: null,
    projects: null,
    blogPosts: null,
    languages: null,
    certifications: null,
  };
}

const initialState: WizardState = {
  currentStep: 1,
  cvFormData: createEmptyCVFormData(),
  jobUrl: "",
  jobText: "",
  jobPosting: null,
  isAnalyzing: false,
  // Optimization
  context: "",
  template: "modern",
  enrichedCV: null,
  isOptimizing: false,
  isDownloading: false,
  format: "pdf",
  error: null,
};

function loadFromLocalStorage(): CVFormValues | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const validated = cvSchema.safeParse(parsed);
      if (validated.success) {
        return addFormIds(validated.data);
      }
    }
  } catch {
    // Invalid data, ignore
  }
  return null;
}

function saveToLocalStorage(data: CVFormValues) {
  if (typeof window === "undefined") return;
  try {
    const cv = stripFormIds(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cv));
  } catch {
    // Storage full or unavailable, ignore
  }
}

function clearLocalStorage() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore errors
  }
}

export function useCVWizard() {
  const [state, setState] = useState<WizardState>(initialState);
  const [isHydrated, setIsHydrated] = useState(false);
  const { apiKey } = useApiKey();

  // Load saved CV data from localStorage on mount
  useEffect(() => {
    const savedData = loadFromLocalStorage();
    if (savedData) {
      setState((prev) => ({ ...prev, cvFormData: savedData }));
    }
    setIsHydrated(true);
  }, []);

  // Save CV data to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated && state.cvFormData) {
      saveToLocalStorage(state.cvFormData);
    }
  }, [state.cvFormData, isHydrated]);

  // Navigation
  const goToStep = useCallback((step: WizardStep) => {
    setState((prev) => {
      // Clear job posting data when navigating to step 1
      if (step === 1) {
        return {
          ...prev,
          currentStep: step,
          jobUrl: "",
          jobText: "",
          jobPosting: null,
          enrichedCV: null,
          error: null,
        };
      }
      return { ...prev, currentStep: step, error: null };
    });
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, 3) as WizardStep,
      error: null,
    }));
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => {
      const newStep = Math.max(prev.currentStep - 1, 1) as WizardStep;
      // Clear job posting data when going back to step 1
      if (newStep === 1) {
        return {
          ...prev,
          currentStep: newStep,
          jobUrl: "",
          jobText: "",
          jobPosting: null,
          enrichedCV: null,
          error: null,
        };
      }
      return {
        ...prev,
        currentStep: newStep,
        error: null,
      };
    });
  }, []);

  // CV Form Data
  const setCVFormData = useCallback((data: CVFormValues) => {
    setState((prev) => ({ ...prev, cvFormData: data }));
  }, []);

  // Job Posting Input
  const setJobUrl = useCallback((url: string) => {
    // Sanitize URL - strip invisible Unicode characters that can come from copy-paste
    const sanitizedUrl = url.replace(/[\u200B-\u200D\uFEFF\u00A0]/g, "").trim();
    setState((prev) => ({ ...prev, jobUrl: sanitizedUrl, error: null }));
  }, []);

  const setJobText = useCallback((text: string) => {
    setState((prev) => ({ ...prev, jobText: text, error: null }));
  }, []);

  // Job Posting
  const setJobPosting = useCallback((jobPosting: JobPosting | null) => {
    setState((prev) => ({ ...prev, jobPosting, error: null }));
  }, []);

  // Analyze job posting
  const analyzeJob = useCallback(async (input: { url?: string; text?: string }) => {
    setState((prev) => ({ ...prev, isAnalyzing: true, error: null }));

    try {
      const formData = new FormData();
      if (apiKey) {
        formData.set("apiKey", apiKey);
      }

      if (input.url) {
        formData.set("url", input.url);
        const result = await analyzeJobFromUrl({ success: false }, formData);

        if (result.success && result.data) {
          setState((prev) => ({
            ...prev,
            jobPosting: result.data!,
            isAnalyzing: false,
            error: null,
          }));
        } else {
          setState((prev) => ({
            ...prev,
            isAnalyzing: false,
            error: result.error || "Failed to analyze job posting",
          }));
        }
      } else if (input.text) {
        formData.set("text", input.text);
        const result = await analyzeJobFromText({ success: false }, formData);

        if (result.success && result.data) {
          setState((prev) => ({
            ...prev,
            jobPosting: result.data!,
            isAnalyzing: false,
            error: null,
          }));
        } else {
          setState((prev) => ({
            ...prev,
            isAnalyzing: false,
            error: result.error || "Failed to analyze job posting",
          }));
        }
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isAnalyzing: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      }));
    }
  }, [apiKey]);

  // Optimization Settings
  const setContext = useCallback((context: string) => {
    setState((prev) => ({ ...prev, context }));
  }, []);

  const setTemplate = useCallback((template: TemplateType) => {
    setState((prev) => ({ ...prev, template }));
  }, []);

  // Optimize CV (runs gap analysis internally and fully optimizes)
  const optimizeCVAction = useCallback(async () => {
    if (!state.cvFormData || !state.jobPosting) {
      setState((prev) => ({
        ...prev,
        error: "Missing CV data or job posting",
      }));
      return;
    }

    setState((prev) => ({ ...prev, isOptimizing: true, error: null }));

    try {
      const cv = stripFormIds(state.cvFormData);
      const formData = new FormData();
      formData.set("cv", JSON.stringify(cv));
      formData.set("job", JSON.stringify(state.jobPosting));
      if (state.context) {
        formData.set("context", state.context);
      }
      if (apiKey) {
        formData.set("apiKey", apiKey);
      }

      const result = await optimizeCVUnified({ success: false }, formData);

      if (result.success && result.data) {
        setState((prev) => ({
          ...prev,
          enrichedCV: result.data!,
          isOptimizing: false,
          currentStep: 3,
          error: null,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          isOptimizing: false,
          error: result.error || "Failed to optimize CV",
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isOptimizing: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      }));
    }
  }, [state.cvFormData, state.jobPosting, state.context, apiKey]);

  // Export
  const setFormat = useCallback((format: ExportFormat) => {
    setState((prev) => ({ ...prev, format }));
  }, []);

  // Download CV (client-side rendering)
  const downloadCV = useCallback(async () => {
    if (!state.enrichedCV) return;

    setState((prev) => ({ ...prev, isDownloading: true, error: null }));

    try {
      // Strip meta for export
      const { _meta, ...cvWithoutMeta } = state.enrichedCV;

      if (state.format === "html") {
        await downloadHTML(cvWithoutMeta, state.template);
      } else {
        await downloadPDF(cvWithoutMeta, state.template);
      }

      setState((prev) => ({ ...prev, isDownloading: false }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isDownloading: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      }));
    }
  }, [state.enrichedCV, state.template, state.format]);

  // JSON Import/Export for CV
  const exportCVToJSON = useCallback(() => {
    if (!state.cvFormData) return;
    const cv = stripFormIds(state.cvFormData);
    const dataStr = JSON.stringify(cv, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cv-data.json";
    link.click();
    URL.revokeObjectURL(url);
  }, [state.cvFormData]);

  const importCVFromJSON = useCallback(
    (jsonString: string): { success: true; data: CVFormValues } | { success: false; error: string } => {
      try {
        const parsed = JSON.parse(jsonString);
        const validated = cvSchema.safeParse(parsed);
        if (!validated.success) {
          return {
            success: false,
            error: validated.error.issues[0]?.message ?? "Invalid CV format",
          };
        }
        const formData = addFormIds(validated.data);
        setState((prev) => ({ ...prev, cvFormData: formData }));
        return { success: true, data: formData };
      } catch {
        return { success: false, error: "Invalid JSON format" };
      }
    },
    []
  );

  // Reset
  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  // Clear saved CV data from localStorage and reset form
  const clearSavedCV = useCallback(() => {
    clearLocalStorage();
    setState((prev) => ({ ...prev, cvFormData: createEmptyCVFormData() }));
  }, []);

  // Update enriched CV (for editing after optimization)
  const setEnrichedCV = useCallback((cv: EnrichedCV) => {
    setState((prev) => ({ ...prev, enrichedCV: cv }));
  }, []);

  return {
    ...state,
    goToStep,
    nextStep,
    prevStep,
    setCVFormData,
    setJobUrl,
    setJobText,
    setJobPosting,
    analyzeJob,
    // Optimization
    setContext,
    setTemplate,
    optimizeCV: optimizeCVAction,
    setFormat,
    downloadCV,
    exportCVToJSON,
    importCVFromJSON,
    reset,
    clearSavedCV,
    setEnrichedCV,
    generateId,
  };
}

export type CVWizardReturn = ReturnType<typeof useCVWizard>;

// Re-export types for convenience
export type { TemplateType, ExportFormat, WizardStep };
