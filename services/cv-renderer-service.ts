import puppeteer, { type Browser } from "puppeteer";
import type { CV, RenderOptions } from "../schema";
import { modern } from "../templates/modern";
import { minimal } from "../templates/minimal";

const templates = {
  modern,
  minimal,
} as const;

type TemplateName = keyof typeof templates;

export class CVRendererService {
  private browser: Browser | null = null;

  async renderHTML(cv: CV, template: TemplateName = "modern"): Promise<string> {
    const templateFn = templates[template];
    if (!templateFn) {
      throw new Error(`Template "${template}" not found`);
    }
    return templateFn(cv);
  }

  async renderPDF(cv: CV, options: RenderOptions = {}): Promise<Buffer> {
    const { template = "modern" } = options;

    const html = await this.renderHTML(cv, template);
    const browser = await this.getBrowser();
    const page = await browser.newPage();

    try {
      await page.setContent(html, { waitUntil: "networkidle0", timeout: 30000 });

      const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
        tagged: true,
      });

      return Buffer.from(pdf);
    } finally {
      await page.close();
    }
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  private async getBrowser(): Promise<Browser> {
    if (!this.browser) {
      this.browser = await puppeteer.launch();
    }
    return this.browser;
  }
}
