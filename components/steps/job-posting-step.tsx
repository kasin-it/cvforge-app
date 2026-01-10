"use client";

import { useState } from "react";
import { CVWizardReturn } from "@/hooks/use-cv-wizard";
import { StepContainer } from "@/components/layout/step-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Link2,
  FileText,
  Loader2,
  CheckCircle2,
  RefreshCw,
  Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { OptimizationProgress } from "@/components/optimization-progress";

type JobPostingStepProps = {
  wizard: CVWizardReturn;
};

type InputMethod = "url" | "text" | null;

export function JobPostingStep({ wizard }: JobPostingStepProps) {
  const [inputMethod, setInputMethod] = useState<InputMethod>(null);

  const handleAnalyze = async () => {
    if (inputMethod === "url" && wizard.jobUrl) {
      await wizard.analyzeJob({ url: wizard.jobUrl });
    } else if (inputMethod === "text" && wizard.jobText) {
      await wizard.analyzeJob({ text: wizard.jobText });
    }
  };

  const handleReanalyze = () => {
    wizard.setJobPosting(null);
    setInputMethod(null);
  };

  // Show analysis results
  if (wizard.jobPosting) {
    const job = wizard.jobPosting;

    return (
      <StepContainer
        title="Job Analyzed"
        description="We've extracted the key details from the job posting"
      >
        <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
          <CardContent className="pt-6">
                        <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold">{job.title}</h3>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
                            <div>
                <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Keywords (ATS Tags)
                </p>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <Badge key={tag} variant="default">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

                            <div>
                <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-destructive" />
                  Required Skills & Experience
                </p>
                <ul className="space-y-1">
                  {job.skills.map((skill, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <CheckCircle2 className="h-3 w-3 mt-1 text-muted-foreground shrink-0" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

                        <div className="flex gap-3 mt-6 pt-4 border-t border-border">
              <Button variant="outline" size="sm" onClick={handleReanalyze}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Re-analyze
              </Button>
            </div>
          </CardContent>
        </Card>

                {wizard.error && (
          <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
            {wizard.error}
          </div>
        )}

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <Button variant="outline" onClick={wizard.prevStep}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button onClick={wizard.optimizeCV} disabled={wizard.isOptimizing}>
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

                {wizard.isOptimizing && <OptimizationProgress />}
      </StepContainer>
    );
  }

  // Show input method selection or input form
  return (
    <StepContainer
      title="Job Posting"
      description="Add the job posting you want to optimize your CV for"
    >
            {!inputMethod && (
        <div className="grid gap-4 sm:grid-cols-2 max-w-2xl mx-auto">
          <button
            onClick={() => setInputMethod("url")}
            className={cn(
              "group relative flex flex-col items-center p-8 rounded-xl border-2 border-border",
              "hover:border-primary hover:bg-primary/5 transition-all duration-300",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            )}
          >
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
              <Link2 className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h3 className="font-display text-lg font-semibold mb-2">Paste URL</h3>
            <p className="text-sm text-muted-foreground text-center">
              We'll fetch and analyze the job posting automatically
            </p>
          </button>

          <button
            onClick={() => setInputMethod("text")}
            className={cn(
              "group relative flex flex-col items-center p-8 rounded-xl border-2 border-border",
              "hover:border-primary hover:bg-primary/5 transition-all duration-300",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            )}
          >
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
              <FileText className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h3 className="font-display text-lg font-semibold mb-2">Paste Text</h3>
            <p className="text-sm text-muted-foreground text-center">
              Copy and paste the job description directly
            </p>
          </button>
        </div>
      )}

            {inputMethod === "url" && (
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="job-url">Job Posting URL</Label>
                  <Input
                    id="job-url"
                    placeholder="https://example.com/jobs/frontend-developer"
                    value={wizard.jobUrl}
                    onChange={(e) => wizard.setJobUrl(e.target.value)}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setInputMethod(null)}
                    disabled={wizard.isAnalyzing}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAnalyze}
                    disabled={!wizard.jobUrl || wizard.isAnalyzing}
                    className="flex-1"
                  >
                    {wizard.isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      "Analyze Job Posting"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {wizard.isAnalyzing && (
            <div className="text-center py-8">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-muted">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">
                  Fetching and analyzing the job posting...
                </span>
              </div>
            </div>
          )}
        </div>
      )}

            {inputMethod === "text" && (
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="job-text">Job Posting Text</Label>
                  <Textarea
                    id="job-text"
                    placeholder="Paste the full job description here..."
                    rows={12}
                    value={wizard.jobText}
                    onChange={(e) => wizard.setJobText(e.target.value)}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setInputMethod(null)}
                    disabled={wizard.isAnalyzing}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAnalyze}
                    disabled={!wizard.jobText || wizard.isAnalyzing}
                    className="flex-1"
                  >
                    {wizard.isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      "Analyze Job Posting"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {wizard.isAnalyzing && (
            <div className="text-center py-8">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-muted">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">
                  Analyzing the job posting...
                </span>
              </div>
            </div>
          )}
        </div>
      )}

            {wizard.error && (
        <div className="max-w-2xl mx-auto mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
          {wizard.error}
        </div>
      )}

            {!inputMethod && (
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <Button variant="outline" onClick={wizard.prevStep}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div />
        </div>
      )}
    </StepContainer>
  );
}
