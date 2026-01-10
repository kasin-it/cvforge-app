# CVForge

AI-powered CV/resume optimizer that tailors your CV to specific job postings for maximum ATS compatibility.

## Features

- **CV Input** - Enter CV data via form or import from JSON
- **Job Analysis** - Analyze job postings from URL (via Jina.ai Reader) or pasted text
- **AI Optimization** - Tailor your CV content to match job requirements
- **ATS Scoring** - Get keyword match analysis and ATS compatibility score
- **Export** - Download optimized CV as PDF or HTML

## Tech Stack

- Next.js 16 with React 19
- TypeScript
- Tailwind CSS v4
- Vercel AI SDK with OpenAI
- Jina.ai Reader for web scraping
- Zod for schema validation

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) runtime
- OpenAI API key

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/cvforge-app.git
cd cvforge-app

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

### Development

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
bun run build
```

### Lint

```bash
bun run lint
```

## Project Structure

```
cvforge-app/
├── app/
│   ├── actions/        # Server actions for AI operations
│   └── page.tsx        # Main page
├── components/
│   ├── cv-wizard.tsx   # Main wizard component
│   ├── steps/          # Wizard step components
│   └── ui/             # Reusable UI components
├── hooks/
│   └── use-cv-wizard.ts # Wizard state management
├── lib/
│   ├── form-schemas.ts # Form validation schemas
│   └── form-helpers.ts # Form utilities
├── services/
│   ├── job-posting-retriever-service.ts  # Jina.ai web scraping
│   ├── job-posting-analyzer-service.ts   # AI job analysis
│   ├── cv-optimizer-service.ts           # AI CV optimization
│   └── cv-renderer-service.ts            # PDF/HTML generation
├── templates/          # CV HTML templates
└── schema.ts           # Zod schemas (single source of truth)
```

## How It Works

1. **CV Input**: User enters their CV data through a structured form or imports JSON
2. **Job Posting**: App fetches job URL via Jina.ai Reader or accepts pasted text, then uses AI to extract key requirements, skills, and keywords
3. **Optimization**: AI tailors the CV content to match job requirements while maintaining authenticity
4. **Preview**: View the optimized CV with ATS score, matched keywords, and export options

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for AI features | Yes |
| `JINA_AI_API_KEY` | Jina.ai API key for web scraping | No (works without, but rate-limited) |

## License

MIT
