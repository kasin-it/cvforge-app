import type { CV } from "../schema";

export function modern(data: CV): string {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        @page {
            margin: 40px 0 0 0;
        }

        @page :first {
            margin-top: 0;
        }

        body {
            font-family: 'Inter', -apple-system, sans-serif;
            font-size: 10pt;
            line-height: 1.5;
            color: #1a1a1a;
            padding: 40px 50px;
        }

        a {
            color: #2563eb;
            text-decoration: none;
        }

        a:hover {
            text-decoration: underline;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
            padding-bottom: 16px;
            border-bottom: 2px solid #2563eb;
            page-break-inside: avoid;
        }

        .name {
            font-size: 24pt;
            font-weight: 700;
            line-height: 1.2;
        }

        .title {
            font-size: 11pt;
            color: #2563eb;
            margin-top: 4px;
            font-weight: 500;
        }

        .links {
            font-size: 9pt;
            color: #4b5563;
            margin-top: 6px;
        }

        .links a {
            color: #4b5563;
        }

        .contact {
            text-align: right;
            font-size: 9pt;
            color: #4b5563;
        }

        .contact div {
            margin: 2px 0;
        }

        .section {
            margin: 18px 0;
        }

        .section-title {
            font-size: 10pt;
            font-weight: 600;
            color: #2563eb;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 10px;
            padding-bottom: 4px;
            border-bottom: 1px solid #e5e7eb;
            page-break-after: avoid;
        }

        .summary {
            color: #4b5563;
            font-size: 10pt;
        }

        .job {
            margin-bottom: 14px;
            page-break-inside: avoid;
        }

        .job:last-child {
            margin-bottom: 0;
        }

        .job-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 4px;
        }

        .job-role {
            font-weight: 600;
            font-size: 10.5pt;
        }

        .job-company {
            color: #2563eb;
            font-weight: 500;
        }

        .job-period {
            color: #9ca3af;
            font-size: 9pt;
            white-space: nowrap;
        }

        .bullets {
            padding-left: 18px;
            color: #4b5563;
            font-size: 9.5pt;
        }

        .bullets li {
            margin: 3px 0;
        }

        .skills-list {
            color: #4b5563;
            font-size: 10pt;
            line-height: 1.6;
        }

        .project {
            margin-bottom: 12px;
            page-break-inside: avoid;
        }

        .project:last-child {
            margin-bottom: 0;
        }

        .project-header {
            display: flex;
            align-items: baseline;
            gap: 8px;
            margin-bottom: 2px;
        }

        .project-name {
            font-weight: 600;
            font-size: 10.5pt;
        }

        .project-link {
            font-size: 9pt;
        }

        .project-description {
            color: #4b5563;
            font-size: 9.5pt;
            margin-bottom: 4px;
        }

        .project-tech {
            font-size: 9pt;
            color: #6b7280;
        }

        .blog-post {
            margin-bottom: 10px;
            page-break-inside: avoid;
        }

        .blog-post:last-child {
            margin-bottom: 0;
        }

        .blog-post-name {
            font-weight: 500;
            font-size: 10pt;
        }

        .blog-post-description {
            display: block;
            color: #6b7280;
            font-size: 9pt;
            margin-top: 2px;
        }

        .edu-item {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
            page-break-inside: avoid;
        }

        .edu-degree {
            font-weight: 500;
        }

        .edu-school {
            color: #6b7280;
        }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <div class="name">${data.name}</div>
            <div class="title">${data.title}</div>
            ${(() => {
              const links = [
                data.contact.linkedin ? `<a href="${data.contact.linkedin}">LinkedIn</a>` : null,
                data.contact.github ? `<a href="${data.contact.github}">GitHub</a>` : null,
                data.contact.website ? `<a href="${data.contact.website}">Website</a>` : null,
              ].filter(Boolean);
              return links.length > 0 ? `<div class="links">${links.join(" · ")}</div>` : "";
            })()}
        </div>
        <div class="contact">
            <div>${data.contact.email}</div>
            ${data.contact.phone ? `<div>${data.contact.phone}</div>` : ""}
            <div>${data.contact.location}</div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Summary</div>
        <div class="summary">${data.summary}</div>
    </div>

    <div class="section">
        <div class="section-title">Experience</div>
        ${data.experience
          .map(
            (job) => `
            <div class="job">
                <div class="job-header">
                    <div>
                        <span class="job-role">${job.role}</span>
                        <span class="job-company"> · ${job.company}</span>
                    </div>
                    <span class="job-period">${job.period}</span>
                </div>
                <ul class="bullets">
                    ${job.bullets.map((b) => `<li>${b}</li>`).join("")}
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
        <div class="section-title">Projects</div>
        ${data.projects
          .map(
            (project) => `
            <div class="project">
                <div class="project-header">
                    <span class="project-name">${project.name}</span>
                    ${project.url ? `<a href="${project.url}" class="project-link">${project.url}</a>` : ""}
                </div>
                <div class="project-description">${project.description}</div>
                ${project.technologies.length > 0 ? `<div class="project-tech">${project.technologies.join(" · ")}</div>` : ""}
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
        <div class="section-title">Blog Posts</div>
        ${data.blogPosts
          .map(
            (post) => `
            <div class="blog-post">
                <a href="${post.url}" class="blog-post-name">${post.name}</a>
                <span class="blog-post-description">${post.description}</span>
            </div>
        `
          )
          .join("")}
    </div>
    `
        : ""
    }

    <div class="section">
        <div class="section-title">Skills</div>
        <div class="skills-list">${data.skills.join(" · ")}</div>
    </div>

    ${
      data.education && data.education.length > 0
        ? `
    <div class="section">
        <div class="section-title">Education</div>
        ${data.education
          .map(
            (edu) => `
            <div class="edu-item">
                <div>
                    <span class="edu-degree">${edu.degree}</span>
                    <span class="edu-school"> · ${edu.school}</span>
                </div>
                <span class="job-period">${edu.year}</span>
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
        <div class="skills-list">${data.languages.join(" · ")}</div>
    </div>
    `
        : ""
    }
</body>
</html>`;
}
