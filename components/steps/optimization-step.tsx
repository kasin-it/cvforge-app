"use client";

import { CVWizardReturn, OptimizationMode, TemplateType } from "@/hooks/use-cv-wizard";
import { StepContainer } from "@/components/layout/step-container";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Loader2,
  Wand2,
  Sparkles,
  Zap,
  Target,
  FileText,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";

type OptimizationStepProps = {
  wizard: CVWizardReturn;
};

const optimizationModes: {
  value: OptimizationMode;
  title: string;
  description: string;
  icon: typeof Sparkles;
  recommended?: boolean;
}[] = [
  {
    value: "rephrase",
    title: "Rephrase",
    description:
      "Minimal changes. Swaps synonyms to match job terminology, reorders skills. No new content added.",
    icon: Minus,
  },
  {
    value: "enhance",
    title: "Enhance",
    description:
      "Adds inferred skills, strengthens bullets with job-relevant framing. Keeps all claims truthful.",
    icon: Sparkles,
    recommended: true,
  },
  {
    value: "tailor",
    title: "Tailor",
    description:
      "Full optimization. Rewrites content to match job requirements, creates compelling narratives, adds metrics.",
    icon: Target,
  },
];

const templates: {
  value: TemplateType;
  title: string;
  description: string;
}[] = [
  {
    value: "modern",
    title: "Modern",
    description: "Clean layout with subtle accents",
  },
  {
    value: "minimal",
    title: "Minimal",
    description: "Simple, text-focused design",
  },
];

export function OptimizationStep({ wizard }: OptimizationStepProps) {
  return (
    <StepContainer
      title="Optimization Settings"
      description="Choose how you'd like your CV to be optimized"
    >
      <div className="space-y-8">
        {/* Optimization Mode */}
        <div className="space-y-4">
          <Label className="text-base font-display">Optimization Mode</Label>
          <div className="grid gap-4 sm:grid-cols-3">
            {optimizationModes.map((mode) => {
              const Icon = mode.icon;
              const isSelected = wizard.mode === mode.value;

              return (
                <button
                  key={mode.value}
                  onClick={() => wizard.setMode(mode.value)}
                  className={cn(
                    "relative flex flex-col items-start p-5 rounded-xl border-2 text-left transition-all duration-200",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                    isSelected
                      ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  {mode.recommended && (
                    <span className="absolute -top-2.5 left-4 px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                      Recommended
                    </span>
                  )}

                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors",
                      isSelected ? "bg-primary/10" : "bg-muted"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5 transition-colors",
                        isSelected ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                  </div>

                  <h3
                    className={cn(
                      "font-display font-semibold mb-1 transition-colors",
                      isSelected ? "text-primary" : "text-foreground"
                    )}
                  >
                    {mode.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {mode.description}
                  </p>

                  {/* Selection indicator */}
                  <div
                    className={cn(
                      "absolute top-4 right-4 w-5 h-5 rounded-full border-2 transition-all",
                      isSelected
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/30"
                    )}
                  >
                    {isSelected && (
                      <svg
                        className="w-full h-full text-primary-foreground p-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Additional Context */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <Label htmlFor="context" className="text-base font-display">
                    Additional Context
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add any information not in your CV that might help
                  </p>
                </div>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  Optional
                </span>
              </div>
              <Textarea
                id="context"
                placeholder={`e.g., "I also have experience with GraphQL that's not on my CV. I led a team of 3 on the migration project. Emphasize my performance work."`}
                rows={4}
                value={wizard.context}
                onChange={(e) => wizard.setContext(e.target.value)}
                className="resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Template Selection */}
        <div className="space-y-4">
          <Label className="text-base font-display">Template</Label>
          <div className="grid gap-4 sm:grid-cols-2">
            {templates.map((template) => {
              const isSelected = wizard.template === template.value;

              return (
                <button
                  key={template.value}
                  onClick={() => wizard.setTemplate(template.value)}
                  className={cn(
                    "relative flex flex-col rounded-xl border-2 overflow-hidden transition-all duration-200",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                    isSelected
                      ? "border-primary shadow-lg shadow-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  {/* Template preview mockup */}
                  <div className="aspect-[8.5/11] bg-white p-4 relative">
                    {template.value === "modern" ? (
                      <div className="h-full flex flex-col">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20" />
                          <div className="flex-1 space-y-1">
                            <div className="h-2 bg-foreground/80 rounded w-24" />
                            <div className="h-1.5 bg-muted-foreground/30 rounded w-16" />
                          </div>
                        </div>
                        <div className="h-1 bg-primary/30 rounded w-full mb-3" />
                        <div className="space-y-1.5 flex-1">
                          <div className="h-1.5 bg-muted-foreground/20 rounded w-full" />
                          <div className="h-1.5 bg-muted-foreground/20 rounded w-5/6" />
                          <div className="h-1.5 bg-muted-foreground/20 rounded w-4/5" />
                          <div className="h-1.5 bg-muted-foreground/20 rounded w-full" />
                          <div className="h-1.5 bg-muted-foreground/20 rounded w-3/4" />
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col">
                        <div className="text-center mb-3">
                          <div className="h-2 bg-foreground/80 rounded w-20 mx-auto mb-1" />
                          <div className="h-1.5 bg-muted-foreground/30 rounded w-14 mx-auto" />
                        </div>
                        <div className="space-y-1.5 flex-1">
                          <div className="h-1.5 bg-muted-foreground/20 rounded w-full" />
                          <div className="h-1.5 bg-muted-foreground/20 rounded w-full" />
                          <div className="h-1.5 bg-muted-foreground/20 rounded w-4/5" />
                          <div className="mt-2 h-1.5 bg-foreground/60 rounded w-16" />
                          <div className="h-1.5 bg-muted-foreground/20 rounded w-full" />
                          <div className="h-1.5 bg-muted-foreground/20 rounded w-5/6" />
                        </div>
                      </div>
                    )}

                    {/* Selection overlay */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-primary/5 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-primary-foreground"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Template info */}
                  <div
                    className={cn(
                      "p-4 transition-colors",
                      isSelected ? "bg-primary/5" : "bg-muted/50"
                    )}
                  >
                    <h3 className="font-display font-semibold">{template.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {template.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Error display */}
      {wizard.error && (
        <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
          {wizard.error}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
        <Button variant="outline" onClick={wizard.prevStep}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={wizard.optimizeCV}
          disabled={wizard.isOptimizing}
          size="lg"
          className="min-w-[180px]"
        >
          {wizard.isOptimizing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Optimizing...
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4 mr-2" />
              Optimize CV
            </>
          )}
        </Button>
      </div>

      {/* Loading overlay */}
      {wizard.isOptimizing && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <Card className="max-w-md mx-4">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                <Wand2 className="absolute inset-0 m-auto h-8 w-8 text-primary animate-pulse" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">
                Optimizing Your CV
              </h3>
              <p className="text-muted-foreground">
                We're tailoring your CV to match the job requirements. This may take
                a moment...
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </StepContainer>
  );
}
