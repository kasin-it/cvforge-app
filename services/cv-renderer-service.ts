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
      await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 10000 });

      // Wait for fonts to load
      await page.evaluateHandle("document.fonts.ready");

      const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "0", right: "0", bottom: "0", left: "0" },
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
      this.browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    }
    return this.browser;
  }
}
