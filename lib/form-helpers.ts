import type { CV } from "@/schema";
import type { CVFormValues } from "@/lib/form-schemas";

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Strip IDs from form data before sending to server
export function stripFormIds(formData: CVFormValues): CV {
  return {
    ...formData,
    experience: formData.experience.map(({ id, ...exp }) => exp),
    education: formData.education?.map(({ id, ...edu }) => edu) ?? null,
    projects: formData.projects?.map(({ id, ...proj }) => proj) ?? null,
    blogPosts: formData.blogPosts?.map(({ id, ...post }) => post) ?? null,
  };
}

// Add IDs to CV data for form management
export function addFormIds(cv: CV): CVFormValues {
  return {
    ...cv,
    experience: cv.experience.map((exp) => ({ ...exp, id: generateId() })),
    education: cv.education?.map((edu) => ({ ...edu, id: generateId() })) ?? null,
    projects: cv.projects?.map((proj) => ({ ...proj, id: generateId() })) ?? null,
    blogPosts: cv.blogPosts?.map((post) => ({ ...post, id: generateId() })) ?? null,
  };
}
