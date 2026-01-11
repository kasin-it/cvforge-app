"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "../hooks/use-scroll-animation";
import { cn } from "@/lib/utils";
import { ArrowRight, Hammer, Sparkles } from "lucide-react";

export function CTASection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();

  return (
    <section ref={ref} className="py-28 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-orange-500/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-32 h-32 border border-primary/10 rounded-2xl rotate-12 hidden lg:block" />
      <div className="absolute bottom-20 right-20 w-24 h-24 border border-primary/10 rounded-xl -rotate-6 hidden lg:block" />

      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <div
          className={cn(
            "transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          {/* Icon */}
          <div className="relative inline-flex items-center justify-center mb-10">
            <div className="absolute inset-0 w-24 h-24 bg-primary/30 rounded-3xl blur-xl" />
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center shadow-2xl shadow-primary/30">
              <Hammer className="w-10 h-10 text-white" />
            </div>
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-primary animate-pulse" />
          </div>

          {/* Heading */}
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Ready to Land Your
            <br />
            <span className="text-primary">Dream Job?</span>
          </h2>

          <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
            Stop sending generic CVs into the void. Start getting interviews
            with an ATS-optimized CV tailored to each application.
          </p>

          {/* CTA Button */}
          <Button
            size="lg"
            className="text-lg px-12 h-14 animate-glow-pulse group"
            asChild
          >
            <Link href="/wizard">
              <Hammer className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              Start Forging Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>

          {/* Trust copy */}
          <p className="mt-8 text-sm text-muted-foreground">
            No sign-up required &bull; Free forever &bull; Open source
          </p>
        </div>
      </div>
    </section>
  );
}
