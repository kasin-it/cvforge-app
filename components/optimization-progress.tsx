"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Search,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

type OptimizationStep = {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  duration: number; // estimated duration in ms
};

const OPTIMIZATION_STEPS: OptimizationStep[] = [
  {
    id: 1,
    title: "Analyzing Requirements",
    description: "Understanding what the job posting is looking for",
    icon: Search,
    duration: 5000,
  },
  {
    id: 2,
    title: "Rewriting Content",
    description: "Optimizing your experience bullets and summary",
    icon: Sparkles,
    duration: 12000,
  },
  {
    id: 3,
    title: "Finalizing CV",
    description: "Polishing skills and formatting the output",
    icon: CheckCircle2,
    duration: 8000,
  },
];

const TOTAL_DURATION = OPTIMIZATION_STEPS.reduce((sum, s) => sum + s.duration, 0);

function getStepFromElapsed(elapsed: number): { stepIndex: number; stepProgress: number } {
  let accumulatedDuration = 0;

  for (let i = 0; i < OPTIMIZATION_STEPS.length; i++) {
    const stepStart = accumulatedDuration;
    accumulatedDuration += OPTIMIZATION_STEPS[i].duration;

    if (elapsed < accumulatedDuration) {
      const stepElapsed = elapsed - stepStart;
      const stepProgress = Math.min((stepElapsed / OPTIMIZATION_STEPS[i].duration) * 100, 100);
      return { stepIndex: i, stepProgress };
    }
  }

  // If we've exceeded total duration, stay on last step at 100%
  return { stepIndex: OPTIMIZATION_STEPS.length - 1, stepProgress: 100 };
}

export function OptimizationProgress() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const elapsedRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      elapsedRef.current += 100;

      // Calculate overall progress (cap at 95% to indicate still working)
      const overallProgress = Math.min((elapsedRef.current / TOTAL_DURATION) * 100, 95);
      setProgress(overallProgress);

      // Calculate current step and step progress
      const { stepIndex, stepProgress: newStepProgress } = getStepFromElapsed(elapsedRef.current);
      setCurrentStepIndex(stepIndex);
      setStepProgress(newStepProgress);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const currentStep = OPTIMIZATION_STEPS[currentStepIndex];
  const CurrentIcon = currentStep.icon;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full shadow-2xl border-primary/20">
        <CardContent className="pt-8 pb-8">
          {/* Main icon with animation */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
            {/* Animated progress ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="44"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-primary transition-all duration-100"
                strokeDasharray={`${progress * 2.76} 276`}
                strokeLinecap="round"
              />
            </svg>
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <CurrentIcon className="h-10 w-10 text-primary animate-pulse" />
            </div>
          </div>

          {/* Current step info */}
          <div className="text-center mb-8">
            <h3 className="font-display text-xl font-semibold mb-2">
              {currentStep.title}
            </h3>
            <p className="text-muted-foreground text-sm">
              {currentStep.description}
            </p>
          </div>

          {/* Step progress bar */}
          <div className="mb-8">
            <Progress value={stepProgress} className="h-2" />
          </div>

          {/* Steps list */}
          <div className="space-y-3">
            {OPTIMIZATION_STEPS.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const isPending = index > currentStepIndex;

              return (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg transition-all duration-300",
                    isCompleted && "bg-primary/10",
                    isCurrent && "bg-primary/5 border border-primary/20",
                    isPending && "opacity-50"
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300",
                      isCompleted && "bg-primary text-primary-foreground",
                      isCurrent && "bg-primary/20 text-primary",
                      isPending && "bg-muted text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <StepIcon className={cn("h-4 w-4", isCurrent && "animate-pulse")} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm font-medium truncate",
                        isCompleted && "text-primary",
                        isCurrent && "text-foreground",
                        isPending && "text-muted-foreground"
                      )}
                    >
                      {step.title}
                    </p>
                  </div>
                  {isCompleted && (
                    <span className="text-xs text-primary font-medium">Done</span>
                  )}
                  {isCurrent && (
                    <span className="text-xs text-muted-foreground">In progress...</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer tip */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            This usually takes 20-40 seconds
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
