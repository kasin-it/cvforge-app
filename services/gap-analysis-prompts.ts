import type { CV, JobPosting } from "../schema";

/**
 * Filtered CV type containing only fields relevant for gap analysis.
 * Excludes: name, contact, education, blogPosts, certifications
 */
export type FilteredCV = Pick<
  CV,
  "title" | "summary" | "experience" | "skills" | "projects" | "languages"
>;

/**
 * Filters CV to only include fields needed for gap analysis.
 * Reduces token usage and focuses LLM on relevant content.
 */
export function filterCVForGapAnalysis(cv: CV): FilteredCV {
  return {
    title: cv.title,
    summary: cv.summary,
    experience: cv.experience,
    skills: cv.skills,
    projects: cv.projects,
    languages: cv.languages,
  };
}

/**
 * Production-grade prompt for structured gap analysis.
 * Uses Chain-of-Thought reasoning to identify gaps and generate actionable suggestions.
 */
export function buildGapAnalysisPrompt(
  filteredCV: FilteredCV,
  job: JobPosting
): string {
  return `
You are an Expert Technical Recruiter and ATS Specialist. Your task is to perform a comprehensive gap analysis between a candidate's CV and a job posting, then provide structured, actionable optimization suggestions.

## CRITICAL: ATS KEYWORD MATCHING

Applicant Tracking Systems perform LITERAL keyword matching. This means:
- "React" does NOT match "React.js" or "ReactJS"
- "Node" does NOT match "Node.js" or "NodeJS"
- "AWS" does NOT match "Amazon Web Services"
- "K8s" does NOT match "Kubernetes"

When the CV uses a different term than the job posting, flag it as a TERMINOLOGY gap. The candidate must use the EXACT term from the job posting to pass ATS filters.

## ANALYSIS PROCESS

Follow these steps in order:

### Step 1: Extract Job Requirements
Parse the job posting and categorize each requirement:
- Technical skills (languages, frameworks, tools, databases, cloud platforms)
- Soft skills (leadership, communication, collaboration)
- Methodologies (Agile, Scrum, CI/CD, DevOps practices)
- Experience requirements (years, specific achievements, domain expertise)
- Certifications or qualifications mentioned

### Step 2: Map CV Content
For each CV section, identify demonstrated skills:
- **Skills array**: Explicit skills listed
- **Summary**: Highlighted expertise and focus areas
- **Experience bullets**: Technologies used, methodologies practiced, achievements
- **Projects**: Technical skills, tools, technologies demonstrated
- **Languages**: Spoken language proficiencies

### Step 3: Match and Identify Gaps
For each job requirement, determine:
1. **Exact match**: Same term exists in CV (add to matchedKeywords)
2. **Terminology gap**: Similar skill exists but with different term (type: "terminology")
3. **Missing gap**: No evidence of this skill/requirement (type: "missing")

### Step 4: Prioritize Gaps
Assign priority based on job posting emphasis:
- **critical**: Explicitly required, mentioned in title, listed first, or repeated multiple times
- **recommended**: Important skills in main requirements section
- **nice-to-have**: Listed as "bonus", "preferred", or secondary skills

### Step 5: Generate Suggestions
For each gap, provide:
- Specific locations where it should be added (skills, summary, experience, projects)
- Concrete, actionable suggestion for how to incorporate it
- For terminology gaps: identify the existing CV term to replace

## JOB POSTING

**Title:** ${job.title}

**Required Skills/Experience:**
${job.skills.map((s, i) => `${i + 1}. ${s}`).join("\n")}

**Keywords/Tags for ATS:**
${job.tags.join(", ")}

## CANDIDATE CV

\`\`\`json
${JSON.stringify(filteredCV, null, 2)}
\`\`\`

## OUTPUT FORMAT

Return a JSON object with this exact structure:

{
  "suggestions": [
    {
      "gap": "The exact term from job posting",
      "type": "missing" | "terminology",
      "category": "technical-skill" | "soft-skill" | "domain-knowledge" | "methodology" | "certification" | "experience",
      "priority": "critical" | "recommended" | "nice-to-have",
      "locations": ["skills", "summary", "experience", "projects"],
      "suggestion": "Specific, actionable instruction for how to add this. Be concrete.",
      "existingTerm": "For terminology gaps: the term currently in CV. Null for missing gaps."
    }
  ],
  "matchedKeywords": ["exact", "matches", "found"]
}

## RULES

1. Maximum 10 suggestions, prioritize the most impactful gaps
2. Every suggestion must be ACTIONABLE with specific instructions
3. For terminology gaps, always specify the existingTerm being replaced
4. Be conservative, only flag genuine gaps
5. Consider what can be reasonably inferred from the CV
6. Focus on gaps that will meaningfully improve ATS matching

Generate the gap analysis now.
`.trim();
}
