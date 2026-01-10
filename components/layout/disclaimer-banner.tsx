"use client";

import { useState } from "react";
import { Key, Github, AlertTriangle, X, ChevronDown, Eye, EyeOff, Check } from "lucide-react";
import { useApiKey } from "@/contexts/api-key-context";

export function DisclaimerBanner() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const { apiKey, setApiKey, hasValidKey, hasEnvKey } = useApiKey();

  if (isDismissed) return null;

  return (
    <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-50/80 via-orange-50/60 to-amber-50/80 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-amber-950/30" />
      <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl translate-x-1/2 translate-y-1/2" />

            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="relative max-w-5xl mx-auto px-6 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
                        <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 group cursor-pointer w-full text-left"
            >
              <div className="flex items-center justify-center w-6 h-6 rounded-md bg-primary/10 dark:bg-primary/20 flex-shrink-0">
                <AlertTriangle className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="font-display text-sm font-semibold text-foreground tracking-tight">
                Before You Begin
              </span>
              {hasValidKey && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                  <Check className="w-3 h-3" />
                  API Key Set
                </span>
              )}
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>

                        <div
              className={`grid transition-all duration-300 ease-out ${
                isExpanded ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0 mt-0"
              }`}
            >
              <div className="overflow-hidden">
                                {!hasEnvKey && (
                  <div className="mb-4 p-4 rounded-xl bg-card/80 border border-primary/20 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <Key className="w-4 h-4 text-primary" />
                      <h3 className="text-sm font-semibold text-foreground">
                        Enter your OpenAI API Key
                      </h3>
                    </div>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type={showKey ? "text" : "password"}
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder=""
                          className="w-full px-3 py-2 pr-10 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowKey(!showKey)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={showKey ? "Hide API key" : "Show API key"}
                        >
                          {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {hasValidKey && (
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                          <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Your key is stored in memory only and cleared when you refresh the page.
                    </p>
                  </div>
                )}

                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="group flex gap-3 p-3 rounded-lg bg-card/60 border border-border/50 hover:border-primary/30 hover:bg-card/80 transition-all duration-200">
                    <div className="flex-shrink-0 w-8 h-8 rounded-md bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/20 transition-colors">
                      <Github className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-semibold text-foreground mb-0.5">
                        Run Locally
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Self-host with full control.{" "}
                        <a
                          href="https://github.com/kasin-it/cvforge-app"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-medium underline underline-offset-2 decoration-primary/30 hover:decoration-primary/60 transition-colors"
                        >
                          View on GitHub
                          <span className="text-[10px]">↗</span>
                        </a>
                      </p>
                    </div>
                  </div>

                                    <div className="group flex gap-3 p-3 rounded-lg bg-gradient-to-br from-orange-50/50 to-amber-50/30 dark:from-orange-950/20 dark:to-amber-950/10 border border-orange-200/50 dark:border-orange-800/30 hover:border-orange-300/60 dark:hover:border-orange-700/40 transition-all duration-200">
                    <div className="flex-shrink-0 w-8 h-8 rounded-md bg-gradient-to-br from-orange-500/20 to-amber-500/10 flex items-center justify-center group-hover:from-orange-500/30 group-hover:to-amber-500/20 transition-colors">
                      <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-semibold text-foreground mb-0.5">
                        Review Output Carefully
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        The optimizer is aggressive — remove anything that doesn't match your actual experience
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

                    <button
            onClick={() => setIsDismissed(true)}
            className="flex-shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-card/80 transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  );
}
