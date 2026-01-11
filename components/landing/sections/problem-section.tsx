"use client";

import { useScrollAnimation } from "../hooks/use-scroll-animation";
import { AnimatedCounter } from "../ui/animated-counter";
import { cn } from "@/lib/utils";
import { XCircle, Users, Clock } from "lucide-react";

const stats = [
  {
    icon: XCircle,
    value: 75,
    suffix: "%",
    label: "CV Rejection Rate",
    description: "filtered out by ATS before human review",
    color: "from-red-500 to-orange-500",
  },
  {
    icon: Users,
    value: 250,
    suffix: "+",
    label: "Applications Per Job",
    description: "average for desirable positions",
    color: "from-violet-500 to-purple-500",
  },
  {
    icon: Clock,
    value: 6,
    suffix: "s",
    label: "Review Time",
    description: "if your CV makes it through",
    color: "from-blue-500 to-cyan-500",
  },
];

export function ProblemSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();

  return (
    <section
      ref={ref}
      className="relative py-16 lg:py-28 overflow-hidden"
    >
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />

      <div className="relative max-w-6xl mx-auto px-5">
        {/* Header */}
        <div
          className={cn(
            "text-center mb-20 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-destructive/10 text-destructive text-sm font-medium mb-6">
            The Hidden Problem
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Your CV Never Reaches
            <br />
            <span className="text-muted-foreground">Human Eyes</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Applicant Tracking Systems silently filter candidates before recruiters
            even see their applications. The numbers are staggering.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid md:grid-cols-3 gap-4 lg:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={cn(
                  "group relative p-8 rounded-2xl bg-card border border-border/50 transition-all duration-700 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5",
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                )}
                style={{ transitionDelay: `${150 + index * 100}ms` }}
              >
                {/* Icon */}
                <div
                  className={cn(
                    "w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center mb-6 group-hover:scale-110 transition-transform",
                    stat.color
                  )}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Value */}
                <div className="font-display text-5xl sm:text-6xl font-bold text-foreground mb-2">
                  {isVisible ? <AnimatedCounter value={stat.value} /> : "0"}
                  <span className="text-primary">{stat.suffix}</span>
                </div>

                {/* Label & description */}
                <div className="text-lg font-semibold text-foreground mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.description}
                </div>

                {/* Decorative corner */}
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-border/30 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
