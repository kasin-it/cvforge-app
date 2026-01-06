"use client";

import { CVWizardReturn, TemplateType, ExportFormat } from "@/hooks/use-cv-wizard";
import { StepContainer } from "@/components/layout/step-container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Code,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

type PreviewStepProps = {
  wizard: CVWizardReturn;
};

export function PreviewStep({ wizard }: PreviewStepProps) {
  const { enrichedCV } = wizard;

  if (!enrichedCV) {
    return (
      <StepContainer title="Preview" description="Something went wrong">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            No optimized CV found. Please go back and try again.
          </p>
          <Button onClick={() => wizard.goToStep(3)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Optimization
          </Button>
        </div>
      </StepContainer>
    );
  }

  const { _meta: meta } = enrichedCV;
  const scoreColor =
    meta.atsScore >= 80
      ? "text-green-600"
      : meta.atsScore >= 60
        ? "text-yellow-600"
        : "text-red-600";

  return (
    <StepContainer
      title="Your Optimized CV"
      description="Review the optimization results and export your CV"
    >
      <div className="grid gap-6 lg:grid-cols-5">
        {/* CV Preview */}
        <div className="lg:col-span-3">
          <div className="border border-border rounded-xl overflow-hidden bg-white shadow-lg">
            {/* Preview header */}
            <div className="bg-muted/50 px-4 py-3 border-b border-border flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                CV Preview
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => wizard.setTemplate("modern")}
                  className={cn(
                    "px-3 py-1 text-xs rounded-full transition-colors",
                    wizard.template === "modern"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted-foreground/10"
                  )}
                >
                  Modern
                </button>
                <button
                  onClick={() => wizard.setTemplate("minimal")}
                  className={cn(
                    "px-3 py-1 text-xs rounded-full transition-colors",
                    wizard.template === "minimal"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted-foreground/10"
                  )}
                >
                  Minimal
                </button>
              </div>
            </div>

            {/* CV Content Preview */}
            <div className="p-8 min-h-[600px] bg-white">
              {wizard.template === "modern" ? (
                <ModernTemplate cv={enrichedCV} />
              ) : (
                <MinimalTemplate cv={enrichedCV} />
              )}
            </div>
          </div>
        </div>

        {/* Optimization Results */}
        <div className="lg:col-span-2 space-y-4">
          {/* ATS Score */}
          <div className="border border-border rounded-xl p-5 bg-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-semibold">ATS Score</h3>
              <span className={cn("text-3xl font-bold", scoreColor)}>
                {meta.atsScore}%
              </span>
            </div>
            <Progress value={meta.atsScore} className="h-3" />
            <p className="text-sm text-muted-foreground mt-3">
              {meta.atsScore >= 80
                ? "Excellent match for this position!"
                : meta.atsScore >= 60
                  ? "Good match, but there's room for improvement."
                  : "Consider adding more relevant experience."}
            </p>
          </div>

          {/* Matched Keywords */}
          <div className="border border-border rounded-xl p-5 bg-card">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <h3 className="font-display font-semibold">Matched Keywords</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {meta.matchedKeywords.map((keyword) => (
                <Badge
                  key={keyword}
                  variant="secondary"
                  className="bg-green-100 text-green-800 hover:bg-green-100"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>

          {/* Added Keywords */}
          <div className="border border-border rounded-xl p-5 bg-card">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="default" className="h-5 w-5 p-0 justify-center">
                +
              </Badge>
              <h3 className="font-display font-semibold">Added Keywords</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {meta.injectedKeywords.map((keyword) => (
                <Badge key={keyword} variant="default">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>

          {/* Gaps */}
          {meta.gapAnalysis.length > 0 && (
            <div className="border border-border rounded-xl p-5 bg-card">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <h3 className="font-display font-semibold">Gaps to Address</h3>
              </div>
              <ul className="space-y-2">
                {meta.gapAnalysis.map((gap, index) => (
                  <li
                    key={index}
                    className="text-sm text-muted-foreground flex items-start gap-2"
                  >
                    <span className="text-yellow-600 mt-0.5">•</span>
                    {gap}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Fit Summary */}
          <div className="border border-border rounded-xl p-5 bg-card">
            <h3 className="font-display font-semibold mb-3">Fit Summary</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {meta.fitSummary}
            </p>
          </div>

          {/* Export Options */}
          <div className="border border-primary/20 rounded-xl p-5 bg-primary/5">
            <h3 className="font-display font-semibold mb-4">Export</h3>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => wizard.setFormat("pdf")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all",
                  wizard.format === "pdf"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:border-primary/50"
                )}
              >
                <FileText className="h-4 w-4" />
                PDF
              </button>
              <button
                onClick={() => wizard.setFormat("html")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all",
                  wizard.format === "html"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:border-primary/50"
                )}
              >
                <Code className="h-4 w-4" />
                HTML
              </button>
            </div>
            <Button className="w-full" size="lg" onClick={wizard.downloadCV}>
              <Download className="h-4 w-4 mr-2" />
              Download {wizard.format.toUpperCase()}
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
        <Button variant="outline" onClick={() => wizard.goToStep(3)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Settings
        </Button>
        <Button variant="outline" onClick={() => wizard.goToStep(3)}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Re-optimize
        </Button>
      </div>
    </StepContainer>
  );
}

// Modern Template Component
function ModernTemplate({ cv }: { cv: CVWizardReturn["enrichedCV"] }) {
  if (!cv) return null;

  return (
    <div className="font-sans text-gray-800 text-sm leading-relaxed">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6 pb-4 border-b-2 border-primary/30">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
          {cv.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{cv.name}</h1>
          <p className="text-primary font-medium">{cv.title}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-600">
            <span>{cv.contact.email}</span>
            {cv.contact.phone && <span>{cv.contact.phone}</span>}
            <span>{cv.contact.location}</span>
          </div>
        </div>
      </div>

      {/* Summary */}
      {cv.summary && (
        <div className="mb-5">
          <p className="text-gray-600 italic">{cv.summary}</p>
        </div>
      )}

      {/* Experience */}
      {cv.experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">
            Experience
          </h2>
          <div className="space-y-4">
            {cv.experience.slice(0, 2).map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold text-gray-900">{exp.role}</h3>
                  <span className="text-xs text-gray-500">{exp.period}</span>
                </div>
                <p className="text-gray-600 text-xs mb-1">{exp.company}</p>
                <ul className="list-disc list-inside text-xs text-gray-600 space-y-0.5">
                  {exp.bullets.slice(0, 2).map((bullet, i) => (
                    <li key={i}>{bullet || "..."}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {cv.skills.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">
            Skills
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {cv.skills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {cv.education.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">
            Education
          </h2>
          {cv.education.slice(0, 1).map((edu, index) => (
            <div key={index} className="flex justify-between">
              <div>
                <p className="font-semibold text-gray-900">{edu.degree}</p>
                <p className="text-xs text-gray-600">{edu.school}</p>
              </div>
              <span className="text-xs text-gray-500">{edu.year}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Minimal Template Component
function MinimalTemplate({ cv }: { cv: CVWizardReturn["enrichedCV"] }) {
  if (!cv) return null;

  return (
    <div className="font-serif text-gray-800 text-sm leading-relaxed">
      {/* Header */}
      <div className="text-center mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-normal tracking-wide text-gray-900 mb-1">
          {cv.name}
        </h1>
        <p className="text-gray-600">{cv.title}</p>
        <div className="flex justify-center flex-wrap gap-x-3 mt-2 text-xs text-gray-500">
          <span>{cv.contact.email}</span>
          {cv.contact.phone && (
            <>
              <span>|</span>
              <span>{cv.contact.phone}</span>
            </>
          )}
          <span>|</span>
          <span>{cv.contact.location}</span>
        </div>
      </div>

      {/* Summary */}
      {cv.summary && (
        <div className="mb-5">
          <p className="text-gray-600 text-center">{cv.summary}</p>
        </div>
      )}

      {/* Experience */}
      {cv.experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3 text-center">
            Experience
          </h2>
          <div className="space-y-4">
            {cv.experience.slice(0, 2).map((exp, index) => (
              <div key={index}>
                <div className="text-center mb-1">
                  <h3 className="font-semibold text-gray-900">
                    {exp.role} at {exp.company}
                  </h3>
                  <span className="text-xs text-gray-500">{exp.period}</span>
                </div>
                <ul className="text-xs text-gray-600 space-y-0.5">
                  {exp.bullets.slice(0, 2).map((bullet, i) => (
                    <li key={i} className="text-center">
                      {bullet || "..."}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {cv.skills.length > 0 && (
        <div className="mb-5 text-center">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
            Skills
          </h2>
          <p className="text-xs text-gray-600">{cv.skills.join(" • ")}</p>
        </div>
      )}

      {/* Education */}
      {cv.education.length > 0 && (
        <div className="text-center">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
            Education
          </h2>
          {cv.education.slice(0, 1).map((edu, index) => (
            <div key={index}>
              <p className="font-semibold text-gray-900">{edu.degree}</p>
              <p className="text-xs text-gray-600">
                {edu.school}, {edu.year}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
