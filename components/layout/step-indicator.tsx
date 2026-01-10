"use client";

import { cn } from "@/lib/utils";
import { WizardStep } from "@/lib/types";
import { FileText, Briefcase, Download } from "lucide-react";

type StepIndicatorProps = {
  currentStep: WizardStep;
  onStepClick?: (step: WizardStep) => void;
};

const steps = [
  { number: 1 as const, label: "CV Input", icon: FileText },
  { number: 2 as const, label: "Job Posting", icon: Briefcase },
  { number: 3 as const, label: "Preview", icon: Download },
];

export function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = step.number === currentStep;
          const isCompleted = step.number < currentStep;
          const Icon = step.icon;

          return (
            <div key={step.number} className="flex items-center flex-1 last:flex-none">
                            <button
                onClick={() => onStepClick?.(step.number)}
                disabled={step.number > currentStep}
                className={cn(
                  "relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300",
                  "border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  isActive && "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20",
                  isCompleted && "border-primary bg-primary/10 text-primary cursor-pointer hover:bg-primary/20",
                  !isActive && !isCompleted && "border-border bg-card text-muted-foreground cursor-not-allowed"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 transition-transform duration-300",
                  isActive && "scale-110"
                )} />

                                {isActive && (
                  <span className="absolute inset-0 rounded-full animate-ping bg-primary/20" />
                )}
              </button>

                            {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-3 bg-border relative overflow-hidden">
                  <div
                    className={cn(
                      "absolute inset-y-0 left-0 bg-primary transition-all duration-500",
                      isCompleted ? "w-full" : "w-0"
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

            <div className="flex items-center justify-between mt-3">
        {steps.map((step, index) => {
          const isActive = step.number === currentStep;
          const isCompleted = step.number < currentStep;

          return (
            <div
              key={step.number}
              className={cn(
                "flex-1 text-center last:flex-none transition-colors duration-300",
                index < steps.length - 1 && "pr-3 mr-3"
              )}
            >
              <span
                className={cn(
                  "text-sm font-medium transition-colors",
                  isActive && "text-foreground",
                  isCompleted && "text-primary",
                  !isActive && !isCompleted && "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
