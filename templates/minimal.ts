import type { CV } from "../schema";

export function minimal(data: CV): string {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600&family=Source+Sans+3:wght@400;500;600&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        @page {
            margin: 48px 0 0 0;
        }

        @page :first {
            margin-top: 0;
        }

        body {
            font-family: 'Source Sans 3', sans-serif;
            font-size: 10.5pt;
            line-height: 1.6;
            color: #222;
            padding: 48px 56px;
            max-width: 100%;
        }

        h1, h2, h3 {
            font-family: 'Source Serif 4', serif;
        }

        a {
            color: #222;
            text-decoration: underline;
        }

        .header {
            text-align: center;
            margin-bottom: 28px;
            padding-bottom: 20px;
            border-bottom: 1px solid #222;
            page-break-inside: avoid;
        }

        .name {
            font-size: 22pt;
            font-weight: 600;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }

        .title {
            font-size: 11pt;
            color: #555;
            font-weight: 400;
            margin-bottom: 12px;
        }

        .contact-line {
            font-size: 9pt;
            color: #444;
        }

        .contact-line span {
            margin: 0 8px;
        }

        .contact-line span:first-child {
            margin-left: 0;
        }

        .section {
            margin: 24px 0;
        }

        .section-title {
            font-size: 11pt;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 12px;
            padding-bottom: 4px;
            border-bottom: 1px solid #ccc;
            page-break-after: avoid;
        }

        .summary {
            font-size: 10.5pt;
            color: #333;
            text-align: justify;
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
            font-family: 'Source Serif 4', serif;
            font-weight: 600;
            font-size: 11pt;
        }

        .job-period {
            font-size: 9pt;
            color: #666;
        }

        .job-company {
            font-size: 10pt;
            color: #555;
            font-style: italic;
        }

        .bullets {
            padding-left: 20px;
            color: #333;
        }

        .bullets li {
            margin: 8px 0;
            text-align: justify;
        }

        .skills-text {
            font-size: 10pt;
            color: #333;
            line-height: 1.8;
        }

        .project {
            margin-bottom: 16px;
            page-break-inside: avoid;
        }

        .project:last-child {
            margin-bottom: 0;
        }

        .project-name {
            font-weight: 600;
            font-size: 10.5pt;
        }

        .project-link {
            font-size: 9pt;
            margin-left: 8px;
        }

        .project-description {
            color: #444;
            font-size: 10pt;
            margin-top: 2px;
        }

        .project-tech {
            font-size: 9pt;
            color: #666;
            margin-top: 4px;
            font-style: italic;
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
        }

        .blog-post-description {
            font-size: 9.5pt;
            color: #555;
            margin-top: 2px;
        }

        .edu-item {
            margin-bottom: 8px;
            page-break-inside: avoid;
        }

        .edu-item:last-child {
            margin-bottom: 0;
        }

        .edu-degree {
            font-weight: 500;
        }

        .edu-details {
            font-size: 9.5pt;
            color: #555;
        }

        .two-column {
            display: flex;
            gap: 40px;
        }

        .two-column > div {
            flex: 1;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="name">${data.name}</div>
        <div class="title">${data.title}</div>
        <div class="contact-line">
            <span>${data.contact.email}</span>
            ${data.contact.phone ? `<span>${data.contact.phone}</span>` : ""}
            <span>${data.contact.location}</span>
            ${data.contact.linkedin ? `<span><a href="${data.contact.linkedin}">LinkedIn</a></span>` : ""}
            ${data.contact.github ? `<span><a href="${data.contact.github}">GitHub</a></span>` : ""}
            ${data.contact.website ? `<span><a href="${data.contact.website}">Portfolio</a></span>` : ""}
        </div>
    </div>

    <div class="section">
        <div class="section-title">Profile</div>
        <div class="summary">${data.summary}</div>
    </div>

    <div class="section">
        <div class="section-title">Experience</div>
        ${data.experience
          .map(
            (job) => `
            <div class="job">
                <div class="job-header">
                    <div class="job-title-line">
                        <span class="job-role">${job.role}</span>
                        <span class="job-period">${job.period}</span>
                    </div>
                    <div class="job-company">${job.company}</div>
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
                <div>
                    <span class="project-name">${project.name}</span>
                    ${project.url ? `<a href="${project.url}" class="project-link">${project.url}</a>` : ""}
                </div>
                <div class="project-description">${project.description}</div>
                ${project.technologies.length > 0 ? `<div class="project-tech">Technologies: ${project.technologies.join(", ")}</div>` : ""}
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
                <a href="${post.url}" class="blog-post-title">${post.name}</a>
                <div class="blog-post-description">${post.description}</div>
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
        <div class="skills-text">${data.skills.join(", ")}</div>
    </div>

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
                    <div class="edu-degree">${edu.degree}</div>
                    <div class="edu-details">${edu.school}, ${edu.year}</div>
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
            <div class="skills-text">${data.languages.join(", ")}</div>
        </div>
        `
            : ""
        }
    </div>
</body>
</html>`;
}
