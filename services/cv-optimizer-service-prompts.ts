import type { CV, JobPosting } from "../schema";

/**
 * CV Optimizer Prompts - Streamlined for performance
 */

const WRITING_RULES = `
## WRITING STYLE

Each bullet: 2-3 sentences with What you did + How + Result/Impact.
Include context (team size, scope) and measurable outcomes.

GOOD: "Rebuilt checkout using Next.js and Stripe, reducing cart abandonment by 23%. Ran A/B tests with design team over 6 weeks."
BAD: "Worked on checkout improvements."

Rules:
- No em dashes (—). Use commas or periods
- Avoid "spearheaded", "synergized"
- Vary sentence structure
- No keyword stuffing
`;

export function buildOptimizationPrompt(
  cv: CV,
  job: JobPosting,
  userContext?: string
): string {
  return `
You are optimizing a CV for a job posting. Rewrite the CV to match job requirements.

${WRITING_RULES}

## INSTRUCTIONS

### Summary
Rewrite to position candidate as strong fit. Mirror job language. NEVER mention the target company name.

### Experience Bullets
Completely rewrite each bullet to match the TARGET job's tech stack and terminology.

Process:
1. Extract transferable skill from original bullet
2. Rewrite using target job's terminology
3. Add specific numbers (team size, %, timeline)
4. Make 2-3 sentences

### Skills
- Lead with job's must-have requirements
- Use exact terminology from job posting
- Add skills inferable from their experience

### Rules
- Keep dates, company names, education unchanged
- Title can be adjusted to match job
- If original has no projects, output projects as null
- NEVER invent new jobs, degrees, projects, or certifications

## JOB POSTING

**Position:** ${job.title}

**Required Skills:**
${job.skills.map((s) => `- ${s}`).join("\n")}

**Keywords:** ${job.tags.join(", ")}

${userContext ? `## CANDIDATE CONTEXT\n${userContext}` : ""}

## ORIGINAL CV
\`\`\`json
${JSON.stringify(cv, null, 2)}
\`\`\`

Return ONLY the optimized CV as a JSON object. No explanations, no markdown, just the JSON.
Include _meta: { optimizationApplied: true } in the response.
`.trim();
}
