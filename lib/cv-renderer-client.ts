import type { CV } from "@/schema";
import { renderCV, generatePreviewHTML } from "@/app/actions/cv-actions";

export type TemplateName = "modern" | "minimal";

export async function renderPDF(
  cv: CV,
  template: TemplateName = "modern"
): Promise<Blob> {
  const formData = new FormData();
  formData.set("cv", JSON.stringify(cv));
  formData.set("template", template);

  const result = await renderCV(formData);

  if (!result.success || !result.data) {
    throw new Error(result.error || "Failed to render PDF");
  }

  // Convert base64 back to blob
  const binaryString = atob(result.data.blob);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Blob([bytes], { type: result.data.contentType });
}

export async function renderHTML(
  cv: CV,
  template: TemplateName = "modern"
): Promise<string> {
  const formData = new FormData();
  formData.set("cv", JSON.stringify(cv));
  formData.set("template", template);

  const result = await generatePreviewHTML(formData);

  if (!result.success || !result.data) {
    throw new Error(result.error || "Failed to render HTML");
  }

  return result.data;
}

export async function downloadHTML(
  cv: CV,
  template: TemplateName = "modern"
): Promise<void> {
  const html = await renderHTML(cv, template);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "cv.html";
  link.click();
  URL.revokeObjectURL(url);
}

export async function downloadPDF(
  cv: CV,
  template: TemplateName = "modern"
): Promise<void> {
  const pdf = await renderPDF(cv, template);
  const url = URL.createObjectURL(pdf);
  const link = document.createElement("a");
  link.href = url;
  link.download = "cv.pdf";
  link.click();
  URL.revokeObjectURL(url);
}
