// Re-export schema types
export type {
  Contact,
  Experience,
  Education,
  Project,
  BlogPost,
  CV,
  JobPosting,
  EnrichmentMeta,
  EnrichedCV,
  RenderOptions,
} from "@/schema";

// Import for internal use
import type {
  CV as SchemaCV,
  Experience as SchemaExperience,
  Education as SchemaEducation,
  Project as SchemaProject,
  BlogPost as SchemaBlogPost,
} from "@/schema";

// UI-specific types with IDs for form management
export type ExperienceWithId = SchemaExperience & { id: string };
export type EducationWithId = SchemaEducation & { id: string };
export type ProjectWithId = SchemaProject & { id: string };
export type BlogPostWithId = SchemaBlogPost & { id: string };

// CV type for form state (with IDs)
export type CVFormData = Omit<SchemaCV, "experience" | "education" | "projects" | "blogPosts"> & {
  experience: ExperienceWithId[];
  education: EducationWithId[] | null;
  projects: ProjectWithId[] | null;
  blogPosts: BlogPostWithId[] | null;
};

// Optimization Types
export type OptimizationMode = "rephrase" | "enhance" | "tailor";

export type TemplateType = "modern" | "minimal";

export type ExportFormat = "pdf" | "html";

export type OptimizationSettings = {
  mode: OptimizationMode;
  context: string;
  template: TemplateType;
};

// Wizard State (5 steps: CV Input, Job Posting, Gap Analysis, Optimization, Preview)
export type WizardStep = 1 | 2 | 3 | 4 | 5;

export type JobInputMethod = "url" | "text" | null;

export type WizardState = {
  currentStep: WizardStep;
  cv: CVFormData | null;
  jobUrl: string;
  jobText: string;
  jobPosting: import("@/schema").JobPosting | null;
  isAnalyzing: boolean;
  mode: OptimizationMode;
  context: string;
  template: TemplateType;
  enrichedCV: import("@/schema").EnrichedCV | null;
  isOptimizing: boolean;
  format: ExportFormat;
  error: string | null;
};

// Helper to create empty CV form data
export function createEmptyCVFormData(): CVFormData {
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

// Helper to generate unique IDs
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Convert form data to schema CV (strip IDs)
export function formDataToCV(formData: CVFormData): SchemaCV {
  return {
    ...formData,
    experience: formData.experience.map(({ id, ...exp }) => exp),
    education: formData.education?.map(({ id, ...edu }) => edu) ?? null,
    projects: formData.projects?.map(({ id, ...proj }) => proj) ?? null,
    blogPosts: formData.blogPosts?.map(({ id, ...post }) => post) ?? null,
  };
}

// Convert schema CV to form data (add IDs)
export function cvToFormData(cv: SchemaCV): CVFormData {
  return {
    ...cv,
    experience: cv.experience.map((exp) => ({ ...exp, id: generateId() })),
    education: cv.education?.map((edu) => ({ ...edu, id: generateId() })) ?? null,
    projects: cv.projects?.map((proj) => ({ ...proj, id: generateId() })) ?? null,
    blogPosts: cv.blogPosts?.map((post) => ({ ...post, id: generateId() })) ?? null,
  };
}
