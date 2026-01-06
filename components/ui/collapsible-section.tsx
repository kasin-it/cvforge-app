"use client";

import { useState, ReactNode } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type CollapsibleSectionProps = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  onAdd?: () => void;
  addLabel?: string;
  optional?: boolean;
};

export function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
  onAdd,
  addLabel = "Add",
  optional = false,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden transition-all duration-300 shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <h3 className="font-display text-lg font-semibold text-foreground">
            {title}
          </h3>
          {optional && (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              Optional
            </span>
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-muted-foreground transition-transform duration-300",
            isOpen && "rotate-180"
          )}
        />
      </button>

      <div
        className={cn(
          "grid transition-all duration-300",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="p-4 pt-0 space-y-4">
            {children}

            {onAdd && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onAdd}
                className="w-full border-dashed"
              >
                <Plus className="h-4 w-4 mr-2" />
                {addLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
