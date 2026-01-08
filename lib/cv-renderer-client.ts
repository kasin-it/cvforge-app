import type { CV } from "@/schema";
import { modern } from "@/templates/modern";
import { minimal } from "@/templates/minimal";

const templates = {
  modern,
  minimal,
} as const;

export type TemplateName = keyof typeof templates;

export function renderHTML(cv: CV, template: TemplateName = "modern"): string {
  const templateFn = templates[template];
  if (!templateFn) {
    throw new Error(`Template "${template}" not found`);
  }
  return templateFn(cv);
}

export async function renderPDF(
  cv: CV,
  template: TemplateName = "modern"
): Promise<Blob> {
  const html = renderHTML(cv, template);

  // Dynamically import html2pdf.js (client-side only)
  const html2pdf = (await import("html2pdf.js")).default;

  // Create a temporary container for the HTML
  const container = document.createElement("div");
  container.innerHTML = html;
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "-9999px";
  document.body.appendChild(container);

  try {
    const pdf = await html2pdf()
      .set({
        margin: 0,
        filename: "cv.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      })
      .from(container)
      .outputPdf("blob");

    return pdf;
  } finally {
    document.body.removeChild(container);
  }
}

export function downloadHTML(cv: CV, template: TemplateName = "modern"): void {
  const html = renderHTML(cv, template);
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
