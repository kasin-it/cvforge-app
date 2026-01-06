"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type StepContainerProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function StepContainer({
  title,
  description,
  children,
  className,
}: StepContainerProps) {
  return (
    <div className={cn("animate-fade-in-up", className)}>
      <div className="mb-8">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-muted-foreground text-lg">
            {description}
          </p>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}
