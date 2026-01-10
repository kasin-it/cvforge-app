export interface RetrievedContent {
  url: string;
  title: string;
  content: string;
  retrievedAt: Date;
}

export interface JobRetrieverConfig {
  apiKey?: string;
  /** Cache TTL in milliseconds (default: 1 hour) */
  cacheTtl?: number;
}

interface CacheEntry {
  content: RetrievedContent;
  expiresAt: number;
}

const JINA_BASE_URL = "https://r.jina.ai";
const DEFAULT_CACHE_TTL = 60 * 60 * 1000; // 1 hour

// Global cache shared across service instances
const cache = new Map<string, CacheEntry>();

export class JobPostingRetrieverService {
  private readonly apiKey: string | undefined;
  private readonly cacheTtl: number;

  constructor(config: JobRetrieverConfig = {}) {
    this.apiKey = config.apiKey ?? process.env.JINA_AI_API_KEY;
    this.cacheTtl = config.cacheTtl ?? DEFAULT_CACHE_TTL;
  }

  async retrieve(url: string): Promise<RetrievedContent> {
    // Check cache first
    const cached = this.getFromCache(url);
    if (cached) {
      console.log(`[JobRetriever] Cache hit for: ${url}`);
      return cached;
    }

    console.log(`[JobRetriever] Cache miss, fetching: ${url}`);
    // Ensure URL is properly encoded for non-ASCII characters
    const encodedUrl = encodeURI(url);
    const readerUrl = `${JINA_BASE_URL}/${encodedUrl}`;

    const headers: Record<string, string> = {
      Accept: "text/markdown",
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

    const result: RetrievedContent = {
      url,
      title: this.extractTitle(content),
      content,
      retrievedAt: new Date(),
    };

    // Store in cache
    this.setInCache(url, result);

    return result;
  }

  private getFromCache(url: string): RetrievedContent | null {
    const entry = cache.get(url);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      // Cache expired, remove it
      cache.delete(url);
      return null;
    }

    return entry.content;
  }

  private setInCache(url: string, content: RetrievedContent): void {
    cache.set(url, {
      content,
      expiresAt: Date.now() + this.cacheTtl,
    });

    // Clean up old entries periodically (simple cleanup)
    if (cache.size > 100) {
      this.cleanupCache();
    }
  }

  private cleanupCache(): void {
    const now = Date.now();
    for (const [key, entry] of cache.entries()) {
      if (now > entry.expiresAt) {
        cache.delete(key);
      }
    }
  }

  /** Clear all cached entries */
  static clearCache(): void {
    cache.clear();
  }

  /** Get cache stats for debugging */
  static getCacheStats(): { size: number; urls: string[] } {
    return {
      size: cache.size,
      urls: Array.from(cache.keys()),
    };
  }

  private extractTitle(content: string): string {
    return content.match(/^#\s+(.+)$/m)?.[1] ?? "";
  }
}
