import { generateText, Output } from "ai";
import { jobPostingExtractSchema, type JobPosting } from "../schema";
import { JobPostingRetrieverService } from "./job-posting-retriever-service";
import { createOpenAIClient, DEFAULT_MODEL } from "../lib/openai";

export interface JobAnalyzerConfig {
  apiKey?: string;
}

export class JobPostingAnalyzerService {
  private readonly retriever: JobPostingRetrieverService;
  private readonly apiKey?: string;

  constructor(config: JobAnalyzerConfig = {}) {
    this.retriever = new JobPostingRetrieverService();
    this.apiKey = config.apiKey;
  }

  async analyzeFromUrl(url: string): Promise<JobPosting> {
    const retrieved = await this.retriever.retrieve(url);

    const posting = await this.extractStructuredData(retrieved.content);

    return { ...posting, sourceUrl: url };
  }

  async analyzeFromText(content: string): Promise<JobPosting> {
    return this.extractStructuredData(content);
  }

  private async extractStructuredData(content: string): Promise<JobPosting> {
    const openai = createOpenAIClient(this.apiKey);

    const { output } = await generateText({
      model: openai(DEFAULT_MODEL),
      output: Output.object({ schema: jobPostingExtractSchema }),
      prompt: `
You are an expert ATS (Applicant Tracking System) parser. Your goal is to analyze the provided job posting and extract ALL data that could help optimize a candidate's CV for maximum ATS match.

Analyze the text thoroughly and output a JSON object. Be EXHAUSTIVE - missing a keyword means a worse ATS score.

### EXTRACTION RULES

**1. title**
*   Extract the specific job role.
*   **Clean:** Remove buzzwords, location, salary, or internal codes (e.g., convert "URGENT: Senior React Dev - Remote - $150k (J-202)" to "Senior React Developer").

**2. tags** (Atomic Keywords for ATS Matching)
*   Extract a COMPREHENSIVE list of atomic keywords (1-3 words max).
*   **Goal:** These tags will be used for keyword density matching. Be EXHAUSTIVE - extract 30-50+ tags minimum.

**CATEGORIES TO EXTRACT (do not skip ANY):**

**A. ALL Programming Languages & Frameworks (extract EVERY one mentioned):**
*   Languages: JavaScript, TypeScript, Python, Java, Go, Rust, PHP, Ruby, C#, Kotlin, Swift, etc.
*   Frameworks: React, Angular, Vue, Next.js, Node.js, Express, Django, Flask, Spring, Laravel, Symfony, Rails, .NET, etc.
*   Include BOTH if language and framework are mentioned (e.g., "PHP" AND "Symfony" separately)

**B. Testing & Quality (extract even if implied):**
*   If job mentions "quality", "reliable code", "well-tested" → extract: "testing", "quality engineering", "code quality"
*   Testing types: "unit testing", "integration testing", "e2e testing", "TDD", "BDD"
*   Testing tools: Jest, Cypress, Playwright, PHPUnit, pytest, JUnit, etc.
*   Quality concepts: "quality assurance", "QA", "test automation", "testable code"

**C. Engineering Practices & Principles:**
*   Architecture: "microservices", "monolith", "modularity", "modular architecture", "clean architecture", "DDD"
*   Design: "design patterns", "SOLID", "OOP", "functional programming"
*   Practices: "code review", "pair programming", "agile", "scrum", "kanban", "CI/CD"
*   Thinking skills: "complex systems thinking", "problem solving", "analytical thinking", "system design"

**D. Business Domain & Industry (CRITICAL - often missed):**
*   Industry: "travel", "fintech", "e-commerce", "healthcare", "SaaS", "B2B", "enterprise"
*   Specific domains: "online travel agency", "OTA", "travel data", "booking systems", "payments", "banking"
*   If company type is mentioned, extract it: "startup", "scale-up", "enterprise"

**E. Infrastructure & DevOps:**
*   Cloud: AWS, GCP, Azure, DigitalOcean (individually)
*   Containers: Docker, Kubernetes, k8s
*   Databases: PostgreSQL, MySQL, MongoDB, Redis, Elasticsearch
*   Tools: Terraform, Ansible, Jenkins, GitHub Actions

**F. Soft Skills & Methodologies:**
*   Collaboration: "team leadership", "mentoring", "cross-functional collaboration"
*   Communication: "stakeholder communication", "documentation", "technical writing"
*   Methodologies: Agile, Scrum, Kanban, Lean

**G. Implicit Skills (infer from context):**
*   "scale" or "high traffic" → "scalability", "performance optimization", "high availability"
*   "multiple services" → "distributed systems", "microservices"
*   "complex codebase" → "complex systems thinking", "legacy code", "refactoring"
*   "modular" or "reusable" → "modularity", "component design", "reusability"
*   "maintain" or "maintainable" → "code maintainability", "clean code"

**3. skills** (Key Requirements - CONCISE)
*   Extract core requirements as SHORT phrases (not full sentences).
*   Focus on: years of experience + technology/skill
*   Keep each skill to under 10 words when possible
*   Include both explicit AND implied requirements
*   **Examples:**
    *   *Good:* "5+ years PHP/Symfony experience"
    *   *Good:* "Experience with travel/OTA domain"
    *   *Good:* "Strong testing and quality engineering mindset"
    *   *Bad:* "We are looking for a candidate with at least 5 years of commercial experience..."

### RESPONSE FORMAT

Output **only** a raw JSON object matching this structure exactly:

{
  "title": "string",
  "tags": ["string", "string", ...],  // AIM FOR 30-50+ TAGS
  "skills": ["string", "string", ...]
}

### JOB POSTING CONTENT
${content}

      `.trim(),
    });

    return output;
  }
}
