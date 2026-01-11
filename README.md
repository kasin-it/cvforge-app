<div align="center">

# CVForge

### Transform Your Resume. Land Your Dream Job.

**AI-powered CV optimizer that tailors your resume to any job posting for maximum ATS compatibility**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[Features](#features) | [Quick Start](#quick-start) | [How It Works](#how-it-works) | [Tech Stack](#tech-stack)

---

</div>

## The Problem

> **75% of resumes are rejected by ATS before a human ever sees them.**

Applicant Tracking Systems (ATS) filter candidates based on keyword matches, formatting, and relevance scores. Even highly qualified candidates get filtered out when their resumes don't align with job-specific requirements.

## The Solution

CVForge uses AI to analyze job postings and intelligently optimize your CV to:
- Match the exact keywords and phrases recruiters are looking for
- Maintain your authentic experience while improving relevance
- Export in ATS-friendly formats (PDF/HTML)

---

## Features

<table>
<tr>
<td width="50%">

### CV Input
Import your CV data via structured form or paste JSON directly. Supports all standard resume sections including experience, education, skills, and more.

</td>
<td width="50%">

### Job Analysis
Paste any job URL or job description text. AI extracts key requirements, must-have skills, and hidden keywords that ATS systems look for.

</td>
</tr>
<tr>
<td width="50%">

### Smart Optimization
AI tailors your CV content to match job requirements while keeping your experience authentic.

</td>
<td width="50%">

### Export Options
Download your optimized CV as PDF or HTML, ready to submit to any application system.

</td>
</tr>
</table>

---

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) v1.0+ (or Node.js 18+)
- [OpenAI API Key](https://platform.openai.com/api-keys)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/cvforge-app.git
cd cvforge-app

# Install dependencies
bun install

# Configure environment
cp .env.example .env
```

Add your API key to `.env`:

```env
OPENAI_API_KEY=sk-your-key-here
JINA_AI_API_KEY=jina_your-key-here  # Optional: for faster job URL scraping
```

### Run

```bash
bun dev
```

Open **[http://localhost:3000](http://localhost:3000)** and start optimizing.

---

## How It Works

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CVForge Workflow                               │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
    │   Step   │      │   Step   │      │   Step   │      │   Step   │
    │    1     │ ──▶  │    2     │ ──▶  │    3     │ ──▶  │    4     │
    │          │      │          │      │          │      │          │
    │ CV Input │      │   Job    │      │ Optimize │      │  Export  │
    │          │      │ Analysis │      │          │      │          │
    └──────────┘      └──────────┘      └──────────┘      └──────────┘
         │                 │                 │                 │
         ▼                 ▼                 ▼                 ▼
    ┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
    │Form/JSON │      │URL/Text  │      │AI Engine │      │PDF/HTML  │
    │  Import  │      │ Scraping │      │Tailoring │      │ Download │
    └──────────┘      └──────────┘      └──────────┘      └──────────┘
```

| Step | Description |
|------|-------------|
| **1. CV Input** | Enter your CV data through a structured form or import existing JSON data |
| **2. Job Analysis** | Fetch job posting via URL (using Jina.ai Reader) or paste text directly. AI extracts key requirements, skills, and keywords |
| **3. Optimization** | AI tailors your CV content to match job requirements while maintaining authenticity |
| **4. Export** | Preview your optimized CV and download as PDF or HTML |

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | Next.js 16 | Full-stack React framework with App Router |
| **UI** | React 19 + Tailwind CSS v4 | Modern component library with utility-first styling |
| **Language** | TypeScript 5 | Type-safe development |
| **AI** | Vercel AI SDK + OpenAI | LLM integration for analysis & optimization |
| **Scraping** | Jina.ai Reader | Job posting URL extraction |
| **Validation** | Zod | Runtime type validation and schema definitions |
| **Forms** | React Hook Form | Performant form handling |

---

## Project Structure

```
cvforge-app/
├── app/
│   ├── actions/              # Server actions for AI operations
│   │   └── cv-actions.ts     # Main action handlers
│   └── page.tsx              # Application entry point
│
├── components/
│   ├── cv-wizard.tsx         # Main wizard orchestrator
│   ├── steps/                # Individual wizard step components
│   │   ├── cv-input-step.tsx
│   │   ├── job-posting-step.tsx
│   │   ├── optimization-step.tsx
│   │   └── preview-step.tsx
│   └── ui/                   # Reusable UI primitives
│
├── hooks/
│   └── use-cv-wizard.ts      # Wizard state management
│
├── services/
│   ├── job-posting-retriever-service.ts   # Web scraping
│   ├── job-posting-analyzer-service.ts    # AI job parsing
│   ├── cv-optimizer-service.ts            # AI CV enhancement
│   └── cv-renderer-service.ts             # PDF/HTML generation
│
├── templates/                # CV HTML templates (modern, minimal)
├── lib/                      # Utilities and form helpers
└── schema.ts                 # Zod schemas (single source of truth)
```

---

## Environment Variables

| Variable | Required | Description |
|----------|:--------:|-------------|
| `OPENAI_API_KEY` | Yes | OpenAI API key for AI-powered features |
| `JINA_AI_API_KEY` | No | Jina.ai key for faster URL scraping (works without, but rate-limited) |

---

## Commands

```bash
bun dev          # Start development server at localhost:3000
bun run build    # Create production build
bun run start    # Start production server
bun run lint     # Run ESLint checks
```

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with AI, designed for humans.**

[Report Bug](https://github.com/yourusername/cvforge-app/issues) | [Request Feature](https://github.com/yourusername/cvforge-app/issues)

</div>
