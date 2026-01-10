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

import type {
  Experience as SchemaExperience,
  Education as SchemaEducation,
  Project as SchemaProject,
  BlogPost as SchemaBlogPost,
} from "@/schema";

export type ExperienceWithId = SchemaExperience & { id: string };
export type EducationWithId = SchemaEducation & { id: string };
export type ProjectWithId = SchemaProject & { id: string };
export type BlogPostWithId = SchemaBlogPost & { id: string };

export type TemplateType = "modern" | "minimal";

export type ExportFormat = "pdf" | "html";

export type WizardStep = 1 | 2 | 3;
