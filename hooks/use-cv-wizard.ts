"use client";

import { useState, useCallback, useTransition } from "react";
import type { JobPosting, EnrichedCV, CV } from "@/schema";
import type { CVFormValues } from "@/lib/form-schemas";
import type { OptimizationMode, TemplateType, ExportFormat, WizardStep } from "@/lib/types";
import {
  analyzeJobFromUrl,
  analyzeJobFromText,
  optimizeCV,
  renderCV,
} from "@/app/actions/cv-actions";
import { stripFormIds, addFormIds } from "@/lib/form-helpers";

export type WizardState = {
  currentStep: WizardStep;
  cvFormData: CVFormValues | null;
  jobUrl: string;
  jobText: string;
  jobPosting: JobPosting | null;
  isAnalyzing: boolean;
  mode: OptimizationMode;
  context: string;
  template: TemplateType;
  enrichedCV: EnrichedCV | null;
  isOptimizing: boolean;
  format: ExportFormat;
  error: string | null;
};

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function createEmptyCVFormData(): CVFormValues {
  return {
    name: "",
    title: "",
    contact: {
      email: "",
      phone: null,
      location: "",
      linkedin: null,
      github: null,
      website: null,
    },
    summary: "",
    experience: [],
    skills: [],
    education: [],
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
  mode: "enhance",
  context: "",
  template: "modern",
  enrichedCV: null,
  isOptimizing: false,
  format: "pdf",
  error: null,
};

export function useCVWizard() {
  const [state, setState] = useState<WizardState>(initialState);

  // Navigation
  const goToStep = useCallback((step: WizardStep) => {
    setState((prev) => ({ ...prev, currentStep: step, error: null }));
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, 4) as WizardStep,
      error: null,
    }));
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1) as WizardStep,
      error: null,
    }));
  }, []);

  // CV Form Data
  const setCVFormData = useCallback((data: CVFormValues) => {
    setState((prev) => ({ ...prev, cvFormData: data }));
  }, []);

  // Job Posting Input
  const setJobUrl = useCallback((url: string) => {
    setState((prev) => ({ ...prev, jobUrl: url, error: null }));
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
  }, []);

  // Optimization Settings
  const setMode = useCallback((mode: OptimizationMode) => {
    setState((prev) => ({ ...prev, mode }));
  }, []);

  const setContext = useCallback((context: string) => {
    setState((prev) => ({ ...prev, context }));
  }, []);

  const setTemplate = useCallback((template: TemplateType) => {
    setState((prev) => ({ ...prev, template }));
  }, []);

  // Optimize CV
  const optimizeCVAction = useCallback(async () => {
    console.log("[OptimizeCV] Starting optimization...", {
      hasCVFormData: !!state.cvFormData,
      hasJobPosting: !!state.jobPosting,
      mode: state.mode,
    });

    if (!state.cvFormData || !state.jobPosting) {
      console.log("[OptimizeCV] Missing data:", {
        cvFormData: state.cvFormData,
        jobPosting: state.jobPosting,
      });
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
      formData.set("mode", state.mode);
      if (state.context) {
        formData.set("context", state.context);
      }

      console.log("[OptimizeCV] Calling server action...");
      const result = await optimizeCV({ success: false }, formData);
      console.log("[OptimizeCV] Server action result:", result);

      if (result.success && result.data) {
        setState((prev) => ({
          ...prev,
          enrichedCV: result.data!,
          isOptimizing: false,
          currentStep: 4,
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
      console.error("[OptimizeCV] Error:", error);
      setState((prev) => ({
        ...prev,
        isOptimizing: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      }));
    }
  }, [state.cvFormData, state.jobPosting, state.mode, state.context]);

  // Export
  const setFormat = useCallback((format: ExportFormat) => {
    setState((prev) => ({ ...prev, format }));
  }, []);

  // Download CV
  const downloadCV = useCallback(async () => {
    if (!state.enrichedCV) return;

    try {
      const formData = new FormData();
      // Strip meta for export
      const { _meta, ...cvWithoutMeta } = state.enrichedCV;
      formData.set("cv", JSON.stringify(cvWithoutMeta));
      formData.set("template", state.template);
      formData.set("format", state.format);

      const result = await renderCV(formData);

      if (result.success && result.data) {
        // Create blob from base64
        const byteCharacters = atob(result.data.blob);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: result.data.contentType });

        // Download
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = result.data.filename;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        setState((prev) => ({
          ...prev,
          error: result.error || "Failed to download CV",
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
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

  const importCVFromJSON = useCallback((jsonString: string): boolean => {
    try {
      const cv = JSON.parse(jsonString) as CV;
      const formData = addFormIds(cv);
      setState((prev) => ({ ...prev, cvFormData: formData }));
      return true;
    } catch {
      return false;
    }
  }, []);

  // Reset
  const reset = useCallback(() => {
    setState(initialState);
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
    setMode,
    setContext,
    setTemplate,
    optimizeCV: optimizeCVAction,
    setFormat,
    downloadCV,
    exportCVToJSON,
    importCVFromJSON,
    reset,
    generateId,
  };
}

export type CVWizardReturn = ReturnType<typeof useCVWizard>;

// Re-export types for convenience
export type { OptimizationMode, TemplateType, ExportFormat, WizardStep };
