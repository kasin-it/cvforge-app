import puppeteer, { type Browser } from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";
import type { CV, RenderOptions } from "../schema";
import { modern } from "../templates/modern";
import { minimal } from "../templates/minimal";

const templates = {
  modern,
  minimal,
} as const;

type TemplateName = keyof typeof templates;

const isDev = process.env.NODE_ENV === "development";

// Chromium binary URL - self-hosted in public folder on Vercel
function getChromiumPackUrl(): string {
  const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : null;

  if (baseUrl) {
    return `${baseUrl}/chromium-pack.tar`;
  }

  // Fallback to GitHub release
  return "https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.x86_64.tar";
}

// Cache executable path to avoid re-downloading
let cachedExecutablePath: string | null = null;

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
      if (isDev) {
        // Local development: use puppeteer's bundled chromium
        const localPuppeteer = await import("puppeteer");
        this.browser = await localPuppeteer.default.launch({
          headless: true,
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
      } else {
        // Production (Vercel): use @sparticuz/chromium-min with self-hosted binary
        if (!cachedExecutablePath) {
          const packUrl = getChromiumPackUrl();
          console.log(`Downloading chromium from: ${packUrl}`);
          cachedExecutablePath = await chromium.executablePath(packUrl);
        }

        this.browser = await puppeteer.launch({
          args: chromium.args,
          defaultViewport: { width: 1920, height: 1080 },
          executablePath: cachedExecutablePath,
          headless: true,
        });
      }
    }
    return this.browser;
  }
}
