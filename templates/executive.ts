import type { CV } from "../schema";
import { escapeHtml, sanitizeUrl } from "./utils";

export function executive(data: CV): string {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Roboto:wght@400;500&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        @page {
            margin: 0;
        }

        body {
            font-family: 'Roboto', sans-serif;
            font-size: 10pt;
            line-height: 1.55;
            color: #1e293b;
            display: flex;
            min-height: 100vh;
        }

        a {
            color: inherit;
            text-decoration: none;
        }

        a:hover {
            text-decoration: underline;
        }

        .sidebar {
            width: 220px;
            min-width: 220px;
            background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
            color: #f1f5f9;
            padding: 40px 24px;
        }

        .sidebar-name {
            font-family: 'Playfair Display', serif;
            font-size: 20pt;
            font-weight: 700;
            line-height: 1.2;
            margin-bottom: 6px;
        }

        .sidebar-title {
            font-size: 10pt;
            color: #94a3b8;
            font-weight: 400;
            margin-bottom: 28px;
            padding-bottom: 20px;
            border-bottom: 1px solid #334155;
        }

        .sidebar-section {
            margin-bottom: 24px;
        }

        .sidebar-section-title {
            font-size: 8pt;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #64748b;
            margin-bottom: 12px;
        }

        .sidebar-item {
            font-size: 9pt;
            color: #cbd5e1;
            margin: 6px 0;
            word-break: break-word;
        }

        .sidebar-item a {
            color: #93c5fd;
        }

        .skill-tag {
            display: inline-block;
            background: #334155;
            color: #e2e8f0;
            font-size: 8pt;
            padding: 4px 10px;
            border-radius: 3px;
            margin: 3px 4px 3px 0;
        }

        .language-item {
            font-size: 9pt;
            color: #cbd5e1;
            margin: 5px 0;
        }

        .edu-sidebar {
            margin-bottom: 12px;
        }

        .edu-sidebar-degree {
            font-size: 9pt;
            color: #e2e8f0;
            font-weight: 500;
        }

        .edu-sidebar-details {
            font-size: 8pt;
            color: #94a3b8;
            margin-top: 2px;
        }

        .main {
            flex: 1;
            padding: 40px 44px;
            background: #ffffff;
        }

        .section {
            margin-bottom: 26px;
        }

        .section:last-child {
            margin-bottom: 0;
        }

        .section-title {
            font-family: 'Playfair Display', serif;
            font-size: 13pt;
            font-weight: 600;
            color: #0f172a;
            margin-bottom: 14px;
            padding-bottom: 8px;
            border-bottom: 2px solid #1e293b;
            page-break-after: avoid;
        }

        .summary {
            color: #475569;
            font-size: 10pt;
            line-height: 1.7;
        }

        .job {
            margin-bottom: 20px;
            page-break-inside: avoid;
        }

        .job:last-child {
            margin-bottom: 0;
        }

        .job-header {
            margin-bottom: 8px;
        }

        .job-title-line {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
        }

        .job-role {
            font-family: 'Playfair Display', serif;
            font-weight: 600;
            font-size: 11pt;
            color: #0f172a;
        }

        .job-period {
            font-size: 9pt;
            color: #64748b;
            white-space: nowrap;
        }

        .job-company {
            font-size: 10pt;
            color: #475569;
            font-weight: 500;
            margin-top: 2px;
        }

        .bullets {
            padding-left: 18px;
            color: #475569;
            font-size: 9.5pt;
        }

        .bullets li {
            margin: 5px 0;
        }

        .project {
            margin-bottom: 16px;
            page-break-inside: avoid;
        }

        .project:last-child {
            margin-bottom: 0;
        }

        .project-header {
            display: flex;
            align-items: baseline;
            gap: 10px;
            margin-bottom: 4px;
        }

        .project-name {
            font-family: 'Playfair Display', serif;
            font-weight: 600;
            font-size: 10.5pt;
            color: #0f172a;
        }

        .project-link {
            font-size: 8pt;
            color: #64748b;
        }

        .project-description {
            color: #475569;
            font-size: 9.5pt;
            margin-bottom: 4px;
        }

        .project-tech {
            font-size: 8.5pt;
            color: #64748b;
        }

        .blog-post {
            margin-bottom: 12px;
            page-break-inside: avoid;
        }

        .blog-post:last-child {
            margin-bottom: 0;
        }

        .blog-post-title {
            font-weight: 500;
            font-size: 10pt;
            color: #0f172a;
        }

        .blog-post-description {
            font-size: 9pt;
            color: #64748b;
            margin-top: 2px;
        }
    </style>
</head>
<body>
    <div class="sidebar">
        <div class="sidebar-name">${escapeHtml(data.name)}</div>
        <div class="sidebar-title">${escapeHtml(data.title)}</div>

        <div class="sidebar-section">
            <div class="sidebar-section-title">Contact</div>
            <div class="sidebar-item">${escapeHtml(data.contact.email)}</div>
            ${data.contact.phone ? `<div class="sidebar-item">${escapeHtml(data.contact.phone)}</div>` : ""}
            <div class="sidebar-item">${escapeHtml(data.contact.location)}</div>
            ${data.contact.linkedin ? `<div class="sidebar-item"><a href="${sanitizeUrl(data.contact.linkedin)}">LinkedIn</a></div>` : ""}
            ${data.contact.github ? `<div class="sidebar-item"><a href="${sanitizeUrl(data.contact.github)}">GitHub</a></div>` : ""}
            ${data.contact.website ? `<div class="sidebar-item"><a href="${sanitizeUrl(data.contact.website)}">Website</a></div>` : ""}
        </div>

        <div class="sidebar-section">
            <div class="sidebar-section-title">Expertise</div>
            <div>
                ${data.skills.map((skill) => `<span class="skill-tag">${escapeHtml(skill)}</span>`).join("")}
            </div>
        </div>

        ${
          data.education && data.education.length > 0
            ? `
        <div class="sidebar-section">
            <div class="sidebar-section-title">Education</div>
            ${data.education
              .map(
                (edu) => `
                <div class="edu-sidebar">
                    <div class="edu-sidebar-degree">${escapeHtml(edu.degree)}</div>
                    <div class="edu-sidebar-details">${escapeHtml(edu.school)}, ${escapeHtml(edu.year)}</div>
                </div>
            `
              )
              .join("")}
        </div>
        `
            : ""
        }

        ${
          data.languages && data.languages.length > 0
            ? `
        <div class="sidebar-section">
            <div class="sidebar-section-title">Languages</div>
            ${data.languages.map((lang) => `<div class="language-item">${escapeHtml(lang)}</div>`).join("")}
        </div>
        `
            : ""
        }
    </div>

    <div class="main">
        <div class="section">
            <div class="section-title">Professional Summary</div>
            <div class="summary">${escapeHtml(data.summary)}</div>
        </div>

        <div class="section">
            <div class="section-title">Professional Experience</div>
            ${data.experience
              .map(
                (job) => `
                <div class="job">
                    <div class="job-header">
                        <div class="job-title-line">
                            <span class="job-role">${escapeHtml(job.role)}</span>
                            <span class="job-period">${escapeHtml(job.period)}</span>
                        </div>
                        <div class="job-company">${escapeHtml(job.company)}</div>
                    </div>
                    <ul class="bullets">
                        ${job.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}
                    </ul>
                </div>
            `
              )
              .join("")}
        </div>

        ${
          data.projects && data.projects.length > 0
            ? `
        <div class="section">
            <div class="section-title">Key Projects</div>
            ${data.projects
              .map(
                (project) => `
                <div class="project">
                    <div class="project-header">
                        <span class="project-name">${escapeHtml(project.name)}</span>
                        ${project.url ? `<a href="${sanitizeUrl(project.url)}" class="project-link">${escapeHtml(project.url)}</a>` : ""}
                    </div>
                    <div class="project-description">${escapeHtml(project.description)}</div>
                    ${project.technologies.length > 0 ? `<div class="project-tech">Technologies: ${project.technologies.map((t) => escapeHtml(t)).join(", ")}</div>` : ""}
                </div>
            `
              )
              .join("")}
        </div>
        `
            : ""
        }

        ${
          data.blogPosts && data.blogPosts.length > 0
            ? `
        <div class="section">
            <div class="section-title">Publications & Writing</div>
            ${data.blogPosts
              .map(
                (post) => `
                <div class="blog-post">
                    <a href="${sanitizeUrl(post.url)}" class="blog-post-title">${escapeHtml(post.name)}</a>
                    <div class="blog-post-description">${escapeHtml(post.description)}</div>
                </div>
            `
              )
              .join("")}
        </div>
        `
            : ""
        }
    </div>
</body>
</html>`;
}
