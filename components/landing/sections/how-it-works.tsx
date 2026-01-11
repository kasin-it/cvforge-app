"use client";

import { useScrollAnimation } from "../hooks/use-scroll-animation";
import { cn } from "@/lib/utils";
import { FileText, Briefcase, Sparkles, Download } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: FileText,
    title: "Enter Your CV",
    description: "Fill in your professional details or import existing CV data as JSON",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    number: 2,
    icon: Briefcase,
    title: "Add Job Posting",
    description: "Paste the job URL or description you want to apply for",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    number: 3,
    icon: Sparkles,
    title: "AI Optimization",
    description: "Our AI tailors your CV to match the job requirements and beat ATS",
    gradient: "from-primary to-orange-500",
  },
  {
    number: 4,
    icon: Download,
    title: "Download & Apply",
    description: "Export your optimized CV as PDF or HTML and land that interview",
    gradient: "from-emerald-500 to-teal-600",
  },
];

export function HowItWorksSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();

  return (
    <section id="how-it-works" ref={ref} className="py-28 relative">
      {/* Background accent */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Header */}
        <div
          className={cn(
            "text-center mb-20 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            Simple Process
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-5">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Four simple steps to your perfectly tailored CV
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line (desktop) */}
          <div className="hidden lg:block absolute top-[72px] left-[12%] right-[12%] h-[2px]">
            <div className="absolute inset-0 bg-border" />
            <div
              className={cn(
                "h-full bg-gradient-to-r from-primary via-violet-500 to-emerald-500 transition-all duration-1000 ease-out origin-left",
                isVisible ? "scale-x-100" : "scale-x-0"
              )}
              style={{ transitionDelay: "400ms" }}
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className={cn(
                    "relative text-center transition-all duration-700",
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-12"
                  )}
                  style={{ transitionDelay: `${200 + index * 120}ms` }}
                >
                  {/* Icon container */}
                  <div className="relative inline-block mb-6">
                    <div
                      className={cn(
                        "w-[88px] h-[88px] rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg transition-transform hover:scale-105",
                        step.gradient
                      )}
                    >
                      <Icon className="w-9 h-9 text-white" />
                    </div>

                    {/* Step number */}
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-card border-2 border-primary flex items-center justify-center text-sm font-bold text-primary shadow-md">
                      {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-[240px] mx-auto">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
