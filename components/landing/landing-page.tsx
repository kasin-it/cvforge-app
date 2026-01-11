"use client";

import { HeroSection } from "./sections/hero-section";
import { ProblemSection } from "./sections/problem-section";
import { HowItWorksSection } from "./sections/how-it-works";
import { FeaturesGrid } from "./sections/features-grid";
import { BenefitsSection } from "./sections/benefits-section";
import { CTASection } from "./sections/cta-section";
import { FooterSection } from "./sections/footer-section";

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col noise-overlay overflow-x-hidden">
      <HeroSection />
      <ProblemSection />
      <HowItWorksSection />
      <FeaturesGrid />
      <BenefitsSection />
      <CTASection />
      <FooterSection />
    </div>
  );
}
