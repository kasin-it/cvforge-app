import { z } from "zod";

// Optional URL that must start with http:// or https:// if provided
const optionalUrl = z
  .string()
  .nullable()
  .refine(
    (val) => !val || val.startsWith("http://") || val.startsWith("https://"),
    { message: "URL must start with http:// or https://" }
  );

// Contact form schema
export const contactFormSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  phone: z.string().nullable(),
  location: z.string().nullable(),
  linkedin: optionalUrl,
  github: optionalUrl,
  website: optionalUrl,
});

// Experience form schema (with ID for form management)
export const experienceFormSchema = z.object({
  id: z.string(),
  role: z.string().min(1, "Role is required"),
  company: z.string().min(1, "Company is required"),
  period: z.string().min(1, "Period is required"),
  bullets: z.array(z.string()),
});

// Education form schema (with ID for form management)
export const educationFormSchema = z.object({
  id: z.string(),
  degree: z.string().min(1, "Degree is required"),
  school: z.string().min(1, "School is required"),
  year: z.string().min(1, "Year is required"),
});

// Project form schema (with ID for form management)
export const projectFormSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Description is required"),
  url: optionalUrl,
  technologies: z.array(z.string()),
});

// Blog post form schema (with ID for form management)
export const blogPostFormSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  url: optionalUrl,
});

// Full CV form schema
export const cvFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  contact: contactFormSchema,
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  experience: z.array(experienceFormSchema),
  skills: z.array(z.string()),
  education: z.array(educationFormSchema).nullable(),
  projects: z.array(projectFormSchema).nullable(),
  blogPosts: z.array(blogPostFormSchema).nullable(),
  languages: z.array(z.string()).nullable(),
  certifications: z.array(z.string()).nullable(),
});

// Job URL form schema
export const jobUrlFormSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});

// Job text form schema
export const jobTextFormSchema = z.object({
  text: z.string().min(50, "Job description must be at least 50 characters"),
});

// Optimization settings form schema
export const optimizationFormSchema = z.object({
  context: z.string().optional(),
  template: z.enum(["modern", "minimal"]),
});

// Type exports
export type CVFormValues = z.infer<typeof cvFormSchema>;
export type ContactFormValues = z.infer<typeof contactFormSchema>;
export type ExperienceFormValues = z.infer<typeof experienceFormSchema>;
export type EducationFormValues = z.infer<typeof educationFormSchema>;
export type ProjectFormValues = z.infer<typeof projectFormSchema>;
export type BlogPostFormValues = z.infer<typeof blogPostFormSchema>;
export type JobUrlFormValues = z.infer<typeof jobUrlFormSchema>;
export type JobTextFormValues = z.infer<typeof jobTextFormSchema>;
export type OptimizationFormValues = z.infer<typeof optimizationFormSchema>;
