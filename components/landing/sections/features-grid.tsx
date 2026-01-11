"use client";

import { useScrollAnimation } from "../hooks/use-scroll-animation";
import { cn } from "@/lib/utils";
import {
  Search,
  Wand2,
  FileDown,
  FileJson,
  Target,
  Zap,
  Shield,
  Github,
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Smart Job Analysis",
    description:
      "AI extracts key requirements, skills, and keywords from any job posting",
  },
  {
    icon: Wand2,
    title: "Intelligent Rewriting",
    description:
      "Automatically tailors your experience to match what recruiters seek",
  },
  {
    icon: FileDown,
    title: "Multiple Formats",
    description:
      "Download as professionally formatted PDF or HTML with beautiful templates",
  },
  {
    icon: FileJson,
    title: "JSON Import/Export",
    description:
      "Save and reuse your CV data across sessions with portable JSON format",
  },
  {
    icon: Target,
    title: "ATS Optimization",
    description:
      "Structured content and keyword matching to pass automated screening",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Get your optimized CV in seconds, not hours of manual editing",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Your data stays in your browser - no accounts, no tracking, no storage",
  },
  {
    icon: Github,
    title: "Open Source",
    description: "Fully transparent, self-hostable, and free to use forever",
  },
];

export function FeaturesGrid() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();

  return (
    <section ref={ref} className="py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/50 to-transparent" />
      <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Header */}
        <div
          className={cn(
            "text-center mb-16 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            Powerful Features
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-5">
            Everything You Need
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to maximize your job application success
          </p>
        </div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={cn(
                  "group relative p-6 rounded-2xl bg-card border border-border/50 transition-all duration-500 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1",
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                )}
                style={{
                  transitionDelay: `${index * 60}ms`,
                }}
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-6 h-6 text-primary" />
                </div>

                {/* Content */}
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover accent */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
