"use client";

import { useCVWizard } from "@/hooks/use-cv-wizard";
import { Header } from "@/components/layout/header";
import { StepIndicator } from "@/components/layout/step-indicator";
import { CVInputStep } from "@/components/steps/cv-input-step";
import { JobPostingStep } from "@/components/steps/job-posting-step";
import { GapAnalysisStep } from "@/components/steps/gap-analysis-step";
import { OptimizationStep } from "@/components/steps/optimization-step";
import { PreviewStep } from "@/components/steps/preview-step";

export function CVWizard() {
  const wizard = useCVWizard();

  const renderStep = () => {
    switch (wizard.currentStep) {
      case 1:
        return <CVInputStep wizard={wizard} />;
      case 2:
        return <JobPostingStep wizard={wizard} />;
      case 3:
        return <GapAnalysisStep wizard={wizard} />;
      case 4:
        return <OptimizationStep wizard={wizard} />;
      case 5:
        return <PreviewStep wizard={wizard} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-5xl mx-auto px-6">
          {/* Step Indicator */}
          <div className="mb-12">
            <StepIndicator
              currentStep={wizard.currentStep}
              onStepClick={(step) => {
                if (step < wizard.currentStep) {
                  wizard.goToStep(step);
                }
              }}
            />
          </div>

          {/* Step Content */}
          <div key={wizard.currentStep}>
            {renderStep()}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 mt-auto">
        <div className="max-w-5xl mx-auto px-6 text-center text-sm text-muted-foreground">
          Built with care to help you land your dream job
        </div>
      </footer>
    </div>
  );
}
