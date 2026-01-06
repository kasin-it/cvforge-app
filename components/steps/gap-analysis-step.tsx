"use client";

import { CVWizardReturn } from "@/hooks/use-cv-wizard";
import { StepContainer } from "@/components/layout/step-container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Lightbulb,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

type GapAnalysisStepProps = {
  wizard: CVWizardReturn;
};

export function GapAnalysisStep({ wizard }: GapAnalysisStepProps) {
  const { gapAnalysis, selectedGaps, isAnalyzingGaps } = wizard;

  // Loading state
  if (isAnalyzingGaps) {
    return (
      <StepContainer
        title="Analyzing Your CV"
        description="Finding gaps between your CV and the job requirements"
      >
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative w-20 h-20 mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <Lightbulb className="absolute inset-0 m-auto h-8 w-8 text-primary animate-pulse" />
          </div>
          <h3 className="font-display text-xl font-semibold mb-2">
            Analyzing Gaps
          </h3>
          <p className="text-muted-foreground text-center max-w-md">
            We're comparing your CV against the job requirements to identify
            areas for improvement...
          </p>
        </div>
      </StepContainer>
    );
  }

  // No analysis yet - shouldn't happen normally, but handle it
  if (!gapAnalysis) {
    return (
      <StepContainer
        title="Gap Analysis"
        description="Something went wrong"
      >
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            No gap analysis found. Please go back and try again.
          </p>
          <Button onClick={() => wizard.goToStep(2)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Job Posting
          </Button>
        </div>
      </StepContainer>
    );
  }

  const scoreColor =
    gapAnalysis.atsScore >= 80
      ? "text-green-600"
      : gapAnalysis.atsScore >= 60
        ? "text-yellow-600"
        : "text-red-600";

  return (
    <StepContainer
      title="Gap Analysis"
      description="Review the gaps between your CV and the job requirements, then select which ones to address"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Analysis Results */}
        <div className="space-y-4">
          {/* Current ATS Score */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display font-semibold">Current Match Score</h3>
                  <p className="text-sm text-muted-foreground">
                    Before optimization
                  </p>
                </div>
                <span className={cn("text-4xl font-bold", scoreColor)}>
                  {gapAnalysis.atsScore}%
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    gapAnalysis.atsScore >= 80
                      ? "bg-green-500"
                      : gapAnalysis.atsScore >= 60
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  )}
                  style={{ width: `${gapAnalysis.atsScore}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Matched Keywords */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <h3 className="font-display font-semibold">Already Matching</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Keywords from the job posting already in your CV
              </p>
              <div className="flex flex-wrap gap-2">
                {gapAnalysis.matchedKeywords.map((keyword) => (
                  <Badge
                    key={keyword}
                    variant="secondary"
                    className="bg-green-100 text-green-800 hover:bg-green-100"
                  >
                    {keyword}
                  </Badge>
                ))}
                {gapAnalysis.matchedKeywords.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">
                    No exact keyword matches found yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Fit Summary */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="font-display font-semibold">Fit Summary</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {gapAnalysis.fitSummary}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Gaps to Address */}
        <div className="space-y-4">
          <Card className="border-primary/30">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <h3 className="font-display font-semibold">Gaps to Address</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Select which gaps you want the optimizer to address. Uncheck any
                that don't apply to you.
              </p>

              {gapAnalysis.gapAnalysis.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <p className="font-medium text-green-700">
                    No significant gaps found!
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your CV already aligns well with this job posting.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {gapAnalysis.gapAnalysis.map((gap, index) => {
                    const isSelected = selectedGaps.includes(gap);
                    return (
                      <label
                        key={index}
                        className={cn(
                          "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => wizard.toggleGap(gap)}
                          className="mt-0.5"
                        />
                        <span
                          className={cn(
                            "text-sm leading-relaxed",
                            isSelected ? "text-foreground" : "text-muted-foreground"
                          )}
                        >
                          {gap}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}

              {gapAnalysis.gapAnalysis.length > 0 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <span className="text-sm text-muted-foreground">
                    {selectedGaps.length} of {gapAnalysis.gapAnalysis.length} selected
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => wizard.setSelectedGaps([])}
                    >
                      Clear all
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => wizard.setSelectedGaps(gapAnalysis.gapAnalysis)}
                    >
                      Select all
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Keywords to Add */}
          {gapAnalysis.injectedKeywords.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="default" className="h-5 w-5 p-0 justify-center">
                    +
                  </Badge>
                  <h3 className="font-display font-semibold">Keywords to Add</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  These keywords will be naturally incorporated during optimization
                </p>
                <div className="flex flex-wrap gap-2">
                  {gapAnalysis.injectedKeywords.map((keyword) => (
                    <Badge key={keyword} variant="default">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
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
        <Button variant="outline" onClick={() => wizard.goToStep(2)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button onClick={() => wizard.goToStep(4)}>
          Continue to Optimization
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </StepContainer>
  );
}
