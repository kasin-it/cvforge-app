export interface RetrievedContent {
  url: string;
  title: string;
  content: string;
  retrievedAt: Date;
}

export interface JobRetrieverConfig {
  apiKey?: string;
}

const JINA_BASE_URL = "https://r.jina.ai";

export class JobPostingRetrieverService {
  private readonly apiKey: string | undefined;

  constructor(config: JobRetrieverConfig = {}) {
    this.apiKey = config.apiKey ?? process.env.JINA_AI_API_KEY;
  }

  async retrieve(url: string): Promise<RetrievedContent> {
    const readerUrl = `${JINA_BASE_URL}/${url}`;

    const headers: Record<string, string> = {
      Accept: "text/markdown",
      "X-No-Cache": "true",
    };

    if (this.apiKey) {
      headers.Authorization = `Bearer ${this.apiKey}`;
    }

    const response = await fetch(readerUrl, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to retrieve: ${response.status} ${response.statusText}`
      );
    }

    const content = await response.text();

    return {
      url,
      title: this.extractTitle(content),
      content,
      retrievedAt: new Date(),
    };
  }

  private extractTitle(content: string): string {
    return content.match(/^#\s+(.+)$/m)?.[1] ?? "";
  }
}
