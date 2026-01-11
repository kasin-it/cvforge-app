"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CVMockup } from "../ui/cv-mockup";
import { ArrowRight, Sparkles, Hammer } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] lg:min-h-[92vh] flex items-center">
      {/* Background layers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-primary/15 via-primary/5 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-orange-500/10 via-primary/5 to-transparent rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />

        {/* Diagonal accent lines */}
        <svg
          className="absolute top-20 right-0 w-[400px] h-[400px] text-primary/10"
          viewBox="0 0 400 400"
          fill="none"
        >
          <path
            d="M400 0L0 400"
            stroke="currentColor"
            strokeWidth="1"
            className="animate-draw-line"
            style={{ animationDelay: "0.5s" }}
          />
          <path
            d="M400 80L80 400"
            stroke="currentColor"
            strokeWidth="1"
            className="animate-draw-line"
            style={{ animationDelay: "0.7s" }}
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-5 py-12 lg:py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left: Content */}
          <div>
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full bg-primary/10 border border-primary/20 text-xs lg:text-sm font-medium text-primary mb-4 lg:mb-8 animate-slide-up"
              style={{ animationDelay: "0ms" }}
            >
              <Sparkles className="w-4 h-4" />
              AI-Powered CV Optimization
            </div>

            {/* Main headline */}
            <h1
              className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.05] mb-4 lg:mb-6 animate-slide-up"
              style={{ animationDelay: "100ms" }}
            >
              Stop Getting{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-primary">Rejected</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-primary/30"
                  viewBox="0 0 200 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 8C40 2 80 2 100 8C120 14 160 6 198 8"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="animate-draw-line"
                    style={{ animationDelay: "0.8s" }}
                  />
                </svg>
              </span>
              <br />
              by ATS Systems
            </h1>

            {/* Subheadline */}
            <p
              className="text-base lg:text-xl text-muted-foreground leading-relaxed mb-6 lg:mb-10 max-w-lg animate-slide-up"
              style={{ animationDelay: "200ms" }}
            >
              CVForge uses AI to intelligently tailor your CV for each job posting,
              maximizing your chances of landing that interview.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row gap-3 mb-8 lg:mb-12 animate-slide-up"
              style={{ animationDelay: "300ms" }}
            >
              <Button
                size="lg"
                className="text-base px-8 h-12 animate-glow-pulse group"
                asChild
              >
                <Link href="/wizard">
                  <Hammer className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                  Forge Your CV
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-base h-12"
                asChild
              >
                <a href="#how-it-works">See How It Works</a>
              </Button>
            </div>

            {/* Trust indicators */}
            <div
              className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground animate-slide-up"
              style={{ animationDelay: "400ms" }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Free to use
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" style={{ animationDelay: "0.5s" }} />
                No sign-up required
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" style={{ animationDelay: "1s" }} />
                Open source
              </div>
            </div>
          </div>

          {/* Right: CV Mockup */}
          <div className="hidden lg:flex justify-center animate-float-gentle">
            <CVMockup />
          </div>
        </div>

        {/* Mobile CV indication */}
        <div className="lg:hidden mt-8 flex justify-center">
          <div className="flex items-center gap-4">
            <div className="w-16 h-24 rounded-lg bg-muted/50 border border-border -rotate-6 shadow-lg" />
            <div className="relative w-16 h-24 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rotate-3 shadow-lg">
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/50">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-muted-foreground/50 to-transparent" />
      </div>
    </section>
  );
}
