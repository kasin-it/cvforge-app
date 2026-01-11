"use client";

import { useScrollAnimation } from "../hooks/use-scroll-animation";
import { cn } from "@/lib/utils";
import { Check, ArrowRight } from "lucide-react";

const benefits = [
  "Increase your interview callback rate by matching job requirements precisely",
  "Save hours of manual CV tailoring for each application",
  "Beat ATS systems with properly formatted, keyword-optimized content",
  "Present your experience in the most impactful way possible",
  "Export professional PDFs ready for immediate submission",
];

export function BenefitsSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();

  return (
    <section ref={ref} className="py-28 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Visual comparison */}
          <div
            className={cn(
              "relative transition-all duration-700",
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-12"
            )}
          >
            {/* Glow effect */}
            <div className="absolute -inset-8 bg-gradient-to-br from-primary/15 via-transparent to-emerald-500/10 rounded-3xl blur-2xl" />

            {/* Comparison card */}
            <div className="relative bg-card rounded-2xl border border-border/50 p-8 shadow-2xl shadow-primary/5">
              <div className="grid grid-cols-2 gap-6">
                {/* Before */}
                <div className="p-5 rounded-xl bg-destructive/5 border border-destructive/20">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-destructive" />
                    <span className="text-xs font-semibold text-destructive uppercase tracking-wide">
                      Before
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="h-2 bg-muted rounded w-full" />
                    <div className="h-2 bg-muted rounded w-3/4" />
                    <div className="h-2 bg-muted rounded w-1/2" />
                    <div className="h-2 bg-muted rounded w-2/3" />
                  </div>
                  <div className="mt-4 pt-4 border-t border-destructive/10">
                    <div className="text-xs text-destructive/70 font-medium">
                      Generic, unfocused content
                    </div>
                    <div className="mt-2 text-2xl font-display font-bold text-destructive">
                      32%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ATS match score
                    </div>
                  </div>
                </div>

                {/* After */}
                <div className="p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                      After
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="h-2 bg-emerald-500/30 rounded w-full" />
                    <div className="h-2 bg-primary/30 rounded w-[95%]" />
                    <div className="h-2 bg-emerald-500/30 rounded w-[88%]" />
                    <div className="h-2 bg-primary/25 rounded w-[92%]" />
                  </div>
                  <div className="mt-4 pt-4 border-t border-emerald-500/10">
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      Targeted, keyword-rich
                    </div>
                    <div className="mt-2 text-2xl font-display font-bold text-emerald-600 dark:text-emerald-400">
                      94%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ATS match score
                    </div>
                  </div>
                </div>
              </div>

              {/* Arrow indicator */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center shadow-lg">
                <ArrowRight className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>

          {/* Right: Benefits list */}
          <div
            className={cn(
              "transition-all duration-700",
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-12"
            )}
            style={{ transitionDelay: "150ms" }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Why CVForge
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-8">
              Transform Your
              <br />
              <span className="text-primary">Job Search</span>
            </h2>

            <ul className="space-y-5">
              {benefits.map((benefit, index) => (
                <li
                  key={index}
                  className={cn(
                    "flex items-start gap-4 transition-all duration-500",
                    isVisible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-8"
                  )}
                  style={{ transitionDelay: `${300 + index * 80}ms` }}
                >
                  <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-muted-foreground leading-relaxed">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
