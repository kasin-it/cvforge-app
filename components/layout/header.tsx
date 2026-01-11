"use client";

import Link from "next/link";
import { Hammer } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity w-fit"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Hammer className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="absolute -inset-1 rounded-xl bg-primary/20 blur-md -z-10" />
          </div>
          <div className="text-left">
            <h1 className="font-display text-xl font-semibold tracking-tight text-foreground">
              CVForge
            </h1>
            <p className="text-xs text-muted-foreground">
              Craft your perfect CV
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}
