import type { CV } from "../schema";
import { escapeHtml, sanitizeUrl } from "./utils";

export function creative(data: CV): string {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        @page {
            margin: 40px 0 0 0;
        }

        @page :first {
            margin-top: 0;
        }

        body {
            font-family: 'Poppins', sans-serif;
            font-size: 10pt;
            line-height: 1.6;
            color: #1f2937;
            padding: 0;
            background: #ffffff;
        }

        a {
            color: #8b5cf6;
            text-decoration: none;
        }

        a:hover {
            text-decoration: underline;
        }

        .accent-bar {
            height: 8px;
            background: linear-gradient(90deg, #8b5cf6 0%, #ec4899 50%, #f97316 100%);
        }

        .header {
            padding: 36px 50px 28px;
            background: #faf5ff;
            page-break-inside: avoid;
        }

        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }

        .name {
            font-size: 28pt;
            font-weight: 700;
            background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            line-height: 1.1;
        }

        .title {
            font-size: 12pt;
            color: #6b7280;
            font-weight: 500;
            margin-top: 6px;
        }

        .links {
            margin-top: 10px;
            font-size: 9pt;
        }

        .links a {
            display: inline-block;
            background: #f3e8ff;
            color: #7c3aed;
            padding: 4px 12px;
            border-radius: 20px;
            margin-right: 8px;
            margin-bottom: 6px;
            transition: background 0.2s;
        }

        .contact {
            text-align: right;
            font-size: 9pt;
            color: #6b7280;
        }

        .contact div {
            margin: 4px 0;
        }

        .contact-icon {
            display: inline-block;
            width: 16px;
            text-align: center;
            margin-right: 4px;
        }

        .content {
            padding: 32px 50px 40px;
        }

        .section {
            margin-bottom: 28px;
        }

        .section:last-child {
            margin-bottom: 0;
        }

        .section-title {
            font-size: 11pt;
            font-weight: 600;
            color: #8b5cf6;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 14px;
            display: flex;
            align-items: center;
            gap: 12px;
            page-break-after: avoid;
        }

        .section-title::after {
            content: '';
            flex: 1;
            height: 2px;
            background: linear-gradient(90deg, #e9d5ff 0%, transparent 100%);
        }

        .summary {
            color: #4b5563;
            font-size: 10.5pt;
            line-height: 1.75;
            padding-left: 2px;
        }

        .job {
            margin-bottom: 22px;
            padding-left: 16px;
            border-left: 3px solid #e9d5ff;
            page-break-inside: avoid;
        }

        .job:last-child {
            margin-bottom: 0;
        }

        .job-header {
            margin-bottom: 8px;
        }

        .job-role {
            font-weight: 600;
            font-size: 11pt;
            color: #1f2937;
        }

        .job-meta {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 2px;
        }

        .job-company {
            color: #8b5cf6;
            font-weight: 500;
            font-size: 10pt;
        }

        .job-period {
            color: #9ca3af;
            font-size: 9pt;
        }

        .job-period::before {
            content: '•';
            margin-right: 8px;
        }

        .bullets {
            padding-left: 18px;
            color: #4b5563;
            font-size: 9.5pt;
        }

        .bullets li {
            margin: 5px 0;
        }

        .bullets li::marker {
            color: #c4b5fd;
        }

        .skills-container {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }

        .skill-pill {
            display: inline-block;
            background: linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%);
            color: #7c3aed;
            font-size: 9pt;
            font-weight: 500;
            padding: 6px 14px;
            border-radius: 20px;
        }

        .project {
            margin-bottom: 18px;
            padding: 14px 18px;
            background: #faf5ff;
            border-radius: 10px;
            page-break-inside: avoid;
        }

        .project:last-child {
            margin-bottom: 0;
        }

        .project-header {
            display: flex;
            align-items: baseline;
            gap: 10px;
            margin-bottom: 6px;
        }

        .project-name {
            font-weight: 600;
            font-size: 10.5pt;
            color: #1f2937;
        }

        .project-link {
            font-size: 8pt;
            color: #a78bfa;
        }

        .project-description {
            color: #4b5563;
            font-size: 9.5pt;
            margin-bottom: 8px;
        }

        .project-tech {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
        }

        .tech-tag {
            font-size: 8pt;
            color: #7c3aed;
            background: #ede9fe;
            padding: 3px 10px;
            border-radius: 12px;
        }

        .blog-post {
            margin-bottom: 14px;
            padding-left: 16px;
            border-left: 3px solid #fce7f3;
            page-break-inside: avoid;
        }

        .blog-post:last-child {
            margin-bottom: 0;
        }

        .blog-post-title {
            font-weight: 500;
            font-size: 10pt;
            color: #1f2937;
        }

        .blog-post-description {
            font-size: 9pt;
            color: #6b7280;
            margin-top: 3px;
        }

        .two-column {
            display: flex;
            gap: 50px;
        }

        .two-column > div {
            flex: 1;
        }

        .edu-item {
            margin-bottom: 10px;
            page-break-inside: avoid;
        }

        .edu-item:last-child {
            margin-bottom: 0;
        }

        .edu-degree {
            font-weight: 500;
            font-size: 10pt;
            color: #1f2937;
        }

        .edu-details {
            font-size: 9pt;
            color: #6b7280;
            margin-top: 2px;
        }

        .language-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }

        .language-tag {
            display: inline-block;
            background: #fce7f3;
            color: #be185d;
            font-size: 9pt;
            font-weight: 500;
            padding: 5px 12px;
            border-radius: 16px;
        }
    </style>
</head>
<body>
    <div class="accent-bar"></div>

    <div class="header">
        <div class="header-content">
            <div>
                <div class="name">${escapeHtml(data.name)}</div>
                <div class="title">${escapeHtml(data.title)}</div>
                ${(() => {
                  const links = [
                    data.contact.linkedin ? `<a href="${sanitizeUrl(data.contact.linkedin)}">LinkedIn</a>` : null,
                    data.contact.github ? `<a href="${sanitizeUrl(data.contact.github)}">GitHub</a>` : null,
                    data.contact.website ? `<a href="${sanitizeUrl(data.contact.website)}">Portfolio</a>` : null,
                  ].filter(Boolean);
                  return links.length > 0 ? `<div class="links">${links.join("")}</div>` : "";
                })()}
            </div>
            <div class="contact">
                <div>${escapeHtml(data.contact.email)}</div>
                ${data.contact.phone ? `<div>${escapeHtml(data.contact.phone)}</div>` : ""}
                <div>${escapeHtml(data.contact.location)}</div>
            </div>
        </div>
    </div>

    <div class="content">
        <div class="section">
            <div class="section-title">About Me</div>
            <div class="summary">${escapeHtml(data.summary)}</div>
        </div>

        <div class="section">
            <div class="section-title">Experience</div>
            ${data.experience
              .map(
                (job) => `
                <div class="job">
                    <div class="job-header">
                        <div class="job-role">${escapeHtml(job.role)}</div>
                        <div class="job-meta">
                            <span class="job-company">${escapeHtml(job.company)}</span>
                            <span class="job-period">${escapeHtml(job.period)}</span>
                        </div>
                    </div>
                    <ul class="bullets">
                        ${job.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}
                    </ul>
                </div>
            `
              )
              .join("")}
        </div>

        <div class="section">
            <div class="section-title">Skills</div>
            <div class="skills-container">
                ${data.skills.map((skill) => `<span class="skill-pill">${escapeHtml(skill)}</span>`).join("")}
            </div>
        </div>

        ${
          data.projects && data.projects.length > 0
            ? `
        <div class="section">
            <div class="section-title">Projects</div>
            ${data.projects
              .map(
                (project) => `
                <div class="project">
                    <div class="project-header">
                        <span class="project-name">${escapeHtml(project.name)}</span>
                        ${project.url ? `<a href="${sanitizeUrl(project.url)}" class="project-link">${escapeHtml(project.url)}</a>` : ""}
                    </div>
                    <div class="project-description">${escapeHtml(project.description)}</div>
                    ${project.technologies.length > 0 ? `<div class="project-tech">${project.technologies.map((t) => `<span class="tech-tag">${escapeHtml(t)}</span>`).join("")}</div>` : ""}
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
            <div class="section-title">Writing</div>
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

        <div class="two-column">
            ${
              data.education && data.education.length > 0
                ? `
            <div class="section">
                <div class="section-title">Education</div>
                ${data.education
                  .map(
                    (edu) => `
                    <div class="edu-item">
                        <div class="edu-degree">${escapeHtml(edu.degree)}</div>
                        <div class="edu-details">${escapeHtml(edu.school)}, ${escapeHtml(edu.year)}</div>
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
            <div class="section">
                <div class="section-title">Languages</div>
                <div class="language-list">
                    ${data.languages.map((lang) => `<span class="language-tag">${escapeHtml(lang)}</span>`).join("")}
                </div>
            </div>
            `
                : ""
            }
        </div>
    </div>
</body>
</html>`;
}
