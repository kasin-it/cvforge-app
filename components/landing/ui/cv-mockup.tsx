"use client";

import { Check, Sparkles } from "lucide-react";

const skills = ["React", "TypeScript", "Next.js", "Node.js"];
const highlightedSkills = ["React", "TypeScript", "Next.js"];

export function CVMockup() {
  return (
    <div className="relative">
      {/* Ambient glow */}
      <div className="absolute -inset-8 rounded-[2rem] blur-3xl bg-gradient-to-br from-primary/25 via-primary/10 to-orange-500/15" />

      {/* Main card */}
      <div className="relative bg-card rounded-2xl shadow-2xl border border-primary/20 w-[340px] shadow-primary/10">
        {/* Header section */}
        <div className="p-6 pb-4 border-b border-border/50">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-28 bg-foreground/15 rounded" />
              <div className="h-3 w-20 bg-muted/70 rounded" />
            </div>
          </div>
        </div>

        {/* Skills section */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-12 bg-muted rounded" />
            <div className="h-px flex-1 bg-primary/30" />
          </div>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className={
                  highlightedSkills.includes(skill)
                    ? "px-3 py-1.5 rounded-full text-xs font-medium bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "px-3 py-1.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                }
              >
                {skill}
              </span>
            ))}
            <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
              + Tailwind
            </span>
          </div>
        </div>

        {/* Experience section */}
        <div className="px-6 pb-6 space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-3 w-16 bg-muted rounded" />
            <div className="h-px flex-1 bg-primary/30" />
          </div>

          {[1, 2, 3].map((line, i) => (
            <div key={line} className="space-y-1.5">
              <div className="h-2.5 rounded bg-foreground/12 w-full" />
              <div
                className={
                  i === 0
                    ? "h-2.5 rounded bg-primary/25 w-[95%]"
                    : "h-2.5 rounded bg-foreground/8 w-[85%]"
                }
              />
            </div>
          ))}
        </div>

        {/* Status badge */}
        <div className="absolute -top-3 -right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500 text-white shadow-lg">
          <Sparkles className="w-3 h-3" />
          Optimized
        </div>

        {/* Match score indicator */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-2 rounded-full bg-card border border-primary/30 shadow-xl">
          <Check className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-semibold text-foreground">
            92% ATS Match
          </span>
        </div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute -right-6 top-12 w-20 h-20 rounded-2xl rotate-12 bg-gradient-to-br from-primary/20 to-orange-500/10" />
      <div className="absolute -left-4 bottom-20 w-12 h-12 rounded-xl -rotate-6 bg-gradient-to-br from-emerald-500/20 to-primary/10" />
    </div>
  );
}
