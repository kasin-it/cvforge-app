import { omit } from "remeda";
import type { CV } from "@/schema";
import type { CVFormValues } from "@/lib/form-schemas";

export function generateId(): string {
  return crypto.randomUUID();
}

export function stripFormIds(formData: CVFormValues): CV {
  return {
    ...formData,
    experience: formData.experience.map((exp) => omit(exp, ["id"])),
    education: formData.education?.map((edu) => omit(edu, ["id"])) ?? null,
    projects: formData.projects?.map((proj) => omit(proj, ["id"])) ?? null,
    blogPosts: formData.blogPosts?.map((post) => omit(post, ["id"])) ?? null,
  };
}

export function addFormIds(cv: CV): CVFormValues {
  return {
    ...cv,
    experience: cv.experience.map((exp) => ({ ...exp, id: generateId() })),
    education:
      cv.education?.map((edu) => ({ ...edu, id: generateId() })) ?? null,
    projects:
      cv.projects?.map((proj) => ({ ...proj, id: generateId() })) ?? null,
    blogPosts:
      cv.blogPosts?.map((post) => ({ ...post, id: generateId() })) ?? null,
  };
}
