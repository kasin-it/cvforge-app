"use client";

import { useMemo } from "react";
import type { CV } from "@/schema";
import type { TemplateType } from "@/lib/types";
import { modern } from "@/templates/modern";
import { minimal } from "@/templates/minimal";
import { cn } from "@/lib/utils";

const templates = {
  modern,
  minimal,
} as const;

type CVPreviewProps = {
  cv: CV;
  template: TemplateType;
  className?: string;
};

export function CVPreview({ cv, template, className }: CVPreviewProps) {
  const html = useMemo(() => {
    const templateFn = templates[template];
    return templateFn(cv);
  }, [cv, template]);

  return (
    <iframe
      srcDoc={html}
      title="CV Preview"
      className={cn("border-0 bg-white", className)}
    />
  );
}
