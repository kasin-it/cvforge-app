import { z } from "zod";

// ============================================
// CV Schemas
// ============================================

export const contactSchema = z
  .object({
    email: z.string(),
    phone: z.string().nullable(),
    location: z.string().nullable(),
    linkedin: z.string().nullable(),
    github: z.string().nullable(),
    website: z.string().nullable(),
  })
  .strict();

export const experienceSchema = z
  .object({
    role: z.string(),
    company: z.string(),
    period: z.string(),
    bullets: z.array(z.string()),
  })
  .strict();

export const blogPostSchema = z
  .object({
    name: z.string(),
    description: z.string(),
    url: z.string(),
  })
  .strict();

export const educationSchema = z
  .object({
    degree: z.string(),
    school: z.string(),
    year: z.string(),
  })
  .strict();

export const projectSchema = z
  .object({
    name: z.string(),
    description: z.string(),
    url: z.string().nullable(),
    technologies: z.array(z.string()),
  })
  .strict();

export const cvSchema = z
  .object({
    name: z.string(),
    title: z.string(),
    contact: contactSchema,
    summary: z.string(),
    experience: z.array(experienceSchema),
    skills: z.array(z.string()),
    education: z.array(educationSchema).nullable(),
    projects: z.array(projectSchema).nullable(),
    blogPosts: z.array(blogPostSchema).nullable(),
    languages: z.array(z.string()).nullable(),
    certifications: z.array(z.string()).nullable(),
  })
  .strict();

// ============================================
// Job Posting Schema
// ============================================

export const salarySchema = z
  .object({
    range: z.string(),
    min: z.number().nullable(),
    max: z.number().nullable(),
    currency: z.string(),
    period: z.string(),
    contract: z.string(),
  })
  .strict()
  .nullable();

export const additionalInfoSchema = z
  .object({
    key: z.string(),
    value: z.string(),
  })
  .strict();

export const jobPostingSchema = z
  .object({
    title: z.string(),
    company: z.string(),
    seniority: z.string(),
    workModel: z.string(),
    locations: z.array(z.string()),
    salary: salarySchema,
    experienceYears: z.number(),
    mustHave: z.array(z.string()),
    niceToHave: z.array(z.string()),
    languages: z.array(z.string()),
    responsibilities: z.array(z.string()),
    techStack: z.array(z.string()),
    benefits: z.array(z.string()),
    keywords: z.array(z.string()),
    suggestedCvTitle: z.string(),
    standoutFactors: z.array(z.string()),
    additionalInfo: z.array(additionalInfoSchema),
    sourceUrl: z.string().nullable(),
  })
  .strict();

// ============================================
// Enriched CV Schema (after optimization)
// ============================================

export const enrichmentMetaSchema = z
  .object({
    matchedKeywords: z.array(z.string()),
    injectedKeywords: z.array(z.string()),
    gapAnalysis: z.array(z.string()),
    atsScore: z.number().min(0).max(100),
    fitSummary: z.string(),
  })
  .strict();

export const enrichedCvSchema = cvSchema
  .extend({
    _meta: enrichmentMetaSchema,
  })
  .strict();

// ============================================
// Render Options Schema
// ============================================

export const renderOptionsSchema = z
  .object({
    output: z.string().optional(),
    template: z.enum(["modern", "minimal"]).optional(),
    format: z.enum(["pdf", "html"]).optional(),
  })
  .strict();

// ============================================
// Type Exports
// ============================================

export type Contact = z.infer<typeof contactSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type BlogPost = z.infer<typeof blogPostSchema>;
export type Project = z.infer<typeof projectSchema>;
export type CV = z.infer<typeof cvSchema>;
export type JobPosting = z.infer<typeof jobPostingSchema>;
export type EnrichmentMeta = z.infer<typeof enrichmentMetaSchema>;
export type EnrichedCV = z.infer<typeof enrichedCvSchema>;
export type RenderOptions = z.infer<typeof renderOptionsSchema>;
