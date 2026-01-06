"use client";

import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { CVWizardReturn, TemplateType, ExportFormat } from "@/hooks/use-cv-wizard";
import { EnrichedCV } from "@/schema";
import { StepContainer } from "@/components/layout/step-container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TagInput } from "@/components/ui/tag-input";
import {
  ArrowLeft,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Code,
  Pencil,
  X,
  Save,
  Plus,
  GripVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";

type PreviewStepProps = {
  wizard: CVWizardReturn;
};

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function PreviewStep({ wizard }: PreviewStepProps) {
  const { enrichedCV } = wizard;
  const [isEditing, setIsEditing] = useState(false);

  if (!enrichedCV) {
    return (
      <StepContainer title="Preview" description="Something went wrong">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            No optimized CV found. Please go back and try again.
          </p>
          <Button onClick={() => wizard.goToStep(3)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Optimization
          </Button>
        </div>
      </StepContainer>
    );
  }

  const { _meta: meta } = enrichedCV;
  const scoreColor =
    meta.atsScore >= 80
      ? "text-green-600"
      : meta.atsScore >= 60
        ? "text-yellow-600"
        : "text-red-600";

  if (isEditing) {
    return (
      <EditMode
        cv={enrichedCV}
        onSave={(updatedCV) => {
          wizard.setEnrichedCV(updatedCV);
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <StepContainer
      title="Your Optimized CV"
      description="Review the optimization results and export your CV"
    >
      <div className="grid gap-6 lg:grid-cols-5">
        {/* CV Preview */}
        <div className="lg:col-span-3">
          <div className="border border-border rounded-xl overflow-hidden bg-white shadow-lg">
            {/* Preview header */}
            <div className="bg-muted/50 px-4 py-3 border-b border-border flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                CV Preview
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <div className="h-4 w-px bg-border" />
                <button
                  onClick={() => wizard.setTemplate("modern")}
                  className={cn(
                    "px-3 py-1 text-xs rounded-full transition-colors",
                    wizard.template === "modern"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted-foreground/10"
                  )}
                >
                  Modern
                </button>
                <button
                  onClick={() => wizard.setTemplate("minimal")}
                  className={cn(
                    "px-3 py-1 text-xs rounded-full transition-colors",
                    wizard.template === "minimal"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted-foreground/10"
                  )}
                >
                  Minimal
                </button>
              </div>
            </div>

            {/* CV Content Preview */}
            <div className="p-8 min-h-[600px] max-h-[800px] overflow-y-auto bg-white">
              {wizard.template === "modern" ? (
                <ModernTemplate cv={enrichedCV} />
              ) : (
                <MinimalTemplate cv={enrichedCV} />
              )}
            </div>
          </div>
        </div>

        {/* Optimization Results */}
        <div className="lg:col-span-2 space-y-4">
          {/* ATS Score */}
          <div className="border border-border rounded-xl p-5 bg-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-semibold">ATS Score</h3>
              <span className={cn("text-3xl font-bold", scoreColor)}>
                {meta.atsScore}%
              </span>
            </div>
            <Progress value={meta.atsScore} className="h-3" />
            <p className="text-sm text-muted-foreground mt-3">
              {meta.atsScore >= 80
                ? "Excellent match for this position!"
                : meta.atsScore >= 60
                  ? "Good match, but there's room for improvement."
                  : "Consider adding more relevant experience."}
            </p>
          </div>

          {/* Matched Keywords */}
          <div className="border border-border rounded-xl p-5 bg-card">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <h3 className="font-display font-semibold">Matched Keywords</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {meta.matchedKeywords.map((keyword) => (
                <Badge
                  key={keyword}
                  variant="secondary"
                  className="bg-green-100 text-green-800 hover:bg-green-100"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>

          {/* Added Keywords */}
          <div className="border border-border rounded-xl p-5 bg-card">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="default" className="h-5 w-5 p-0 justify-center">
                +
              </Badge>
              <h3 className="font-display font-semibold">Added Keywords</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {meta.injectedKeywords.map((keyword) => (
                <Badge key={keyword} variant="default">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>

          {/* Gaps */}
          {meta.gapAnalysis.length > 0 && (
            <div className="border border-border rounded-xl p-5 bg-card">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <h3 className="font-display font-semibold">Gaps to Address</h3>
              </div>
              <ul className="space-y-2">
                {meta.gapAnalysis.map((gap, index) => (
                  <li
                    key={index}
                    className="text-sm text-muted-foreground flex items-start gap-2"
                  >
                    <span className="text-yellow-600 mt-0.5">•</span>
                    {gap}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Fit Summary */}
          <div className="border border-border rounded-xl p-5 bg-card">
            <h3 className="font-display font-semibold mb-3">Fit Summary</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {meta.fitSummary}
            </p>
          </div>

          {/* Export Options */}
          <div className="border border-primary/20 rounded-xl p-5 bg-primary/5">
            <h3 className="font-display font-semibold mb-4">Export</h3>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => wizard.setFormat("pdf")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all",
                  wizard.format === "pdf"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:border-primary/50"
                )}
              >
                <FileText className="h-4 w-4" />
                PDF
              </button>
              <button
                onClick={() => wizard.setFormat("html")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all",
                  wizard.format === "html"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:border-primary/50"
                )}
              >
                <Code className="h-4 w-4" />
                HTML
              </button>
            </div>
            <Button className="w-full" size="lg" onClick={wizard.downloadCV}>
              <Download className="h-4 w-4 mr-2" />
              Download {wizard.format.toUpperCase()}
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
        <Button variant="outline" onClick={() => wizard.goToStep(4)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Settings
        </Button>
        <Button variant="outline" onClick={() => wizard.goToStep(4)}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Re-optimize
        </Button>
      </div>
    </StepContainer>
  );
}

// Edit Mode Component
type EditModeProps = {
  cv: EnrichedCV;
  onSave: (cv: EnrichedCV) => void;
  onCancel: () => void;
};

type ExperienceWithId = EnrichedCV["experience"][0] & { id: string };
type EducationWithId = { id: string; degree: string; school: string; year: string };
type ProjectWithId = { id: string; name: string; description: string; url: string | null; technologies: string[] };

type EditFormValues = Omit<EnrichedCV, "_meta" | "experience" | "education" | "projects"> & {
  experience: ExperienceWithId[];
  education: EducationWithId[] | null;
  projects: ProjectWithId[] | null;
};

function EditMode({ cv, onSave, onCancel }: EditModeProps) {
  const { _meta, ...cvData } = cv;

  const defaultValues: EditFormValues = {
    ...cvData,
    experience: cvData.experience.map((exp) => ({ ...exp, id: generateId() })),
    education: cvData.education?.map((edu) => ({ ...edu, id: generateId() })) ?? null,
    projects: cvData.projects?.map((proj) => ({ ...proj, id: generateId() })) ?? null,
  };

  const form = useForm<EditFormValues>({
    defaultValues,
    mode: "onBlur",
  });

  const { control, register, handleSubmit, watch, setValue } = form;

  const experienceArray = useFieldArray({
    control,
    name: "experience",
  });

  const handleSave = (data: EditFormValues) => {
    // Strip IDs and reconstruct enrichedCV
    const updatedCV: EnrichedCV = {
      name: data.name,
      title: data.title,
      contact: data.contact,
      summary: data.summary,
      experience: data.experience.map((exp) => ({
        role: exp.role,
        company: exp.company,
        period: exp.period,
        bullets: exp.bullets,
      })),
      skills: data.skills,
      education: data.education?.map((edu) => ({
        degree: edu.degree,
        school: edu.school,
        year: edu.year,
      })) ?? null,
      projects: data.projects?.map((proj) => ({
        name: proj.name,
        description: proj.description,
        url: proj.url,
        technologies: proj.technologies,
      })) ?? null,
      blogPosts: data.blogPosts,
      languages: data.languages,
      certifications: data.certifications,
      _meta,
    };
    onSave(updatedCV);
  };

  const addExperience = () => {
    experienceArray.append({
      id: generateId(),
      role: "",
      company: "",
      period: "",
      bullets: [""],
    });
  };

  const addEducation = () => {
    const current = watch("education") || [];
    setValue("education", [
      ...current,
      { id: generateId(), degree: "", school: "", year: "" },
    ]);
  };

  const removeEducation = (index: number) => {
    const current = watch("education") || [];
    const updated = current.filter((_, i) => i !== index);
    setValue("education", updated.length > 0 ? updated : null, { shouldValidate: false });
  };

  const addProject = () => {
    const current = watch("projects") || [];
    setValue("projects", [
      ...current,
      { id: generateId(), name: "", description: "", url: null, technologies: [] },
    ]);
  };

  const removeProject = (index: number) => {
    const current = watch("projects") || [];
    const updated = current.filter((_, i) => i !== index);
    setValue("projects", updated.length > 0 ? updated : null);
  };

  return (
    <StepContainer
      title="Edit Your CV"
      description="Make any corrections or adjustments to your optimized CV"
    >
      <form onSubmit={handleSubmit(handleSave)} className="space-y-6">
        {/* Personal Info */}
        <div className="border border-border rounded-xl p-5 bg-card">
          <h3 className="font-display font-semibold mb-4">Personal Info</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...register("name")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register("title")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("contact.email")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register("contact.phone")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" {...register("contact.location")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input id="linkedin" {...register("contact.linkedin")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github">GitHub</Label>
              <Input id="github" {...register("contact.github")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" {...register("contact.website")} />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="border border-border rounded-xl p-5 bg-card">
          <h3 className="font-display font-semibold mb-4">Summary</h3>
          <Textarea
            {...register("summary")}
            rows={4}
            placeholder="Professional summary..."
          />
        </div>

        {/* Experience */}
        <div className="border border-border rounded-xl p-5 bg-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold">Experience</h3>
            <Button type="button" variant="outline" size="sm" onClick={addExperience}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          <div className="space-y-4">
            {experienceArray.fields.map((field, index) => (
              <div key={field.id} className="border border-border rounded-lg p-4 bg-muted/30">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    Position {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => experienceArray.remove(index)}
                    className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 mb-3">
                  <Input placeholder="Role" {...register(`experience.${index}.role`)} />
                  <Input placeholder="Company" {...register(`experience.${index}.company`)} />
                  <Input placeholder="Period" {...register(`experience.${index}.period`)} className="sm:col-span-2" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Bullet Points</Label>
                  <Controller
                    control={control}
                    name={`experience.${index}.bullets`}
                    render={({ field }) => (
                      <div className="space-y-2">
                        {(field.value || []).map((bullet, bulletIndex) => (
                          <div key={bulletIndex} className="flex items-center gap-2">
                            <GripVertical className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                            <Input
                              value={bullet}
                              onChange={(e) => {
                                const newBullets = [...field.value];
                                newBullets[bulletIndex] = e.target.value;
                                field.onChange(newBullets);
                              }}
                              placeholder="Achievement or responsibility..."
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newBullets = field.value.filter((_, i) => i !== bulletIndex);
                                field.onChange(newBullets);
                              }}
                              className="p-2 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive flex-shrink-0"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => field.onChange([...field.value, ""])}
                          className="text-muted-foreground"
                        >
                          + Add bullet
                        </Button>
                      </div>
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="border border-border rounded-xl p-5 bg-card">
          <h3 className="font-display font-semibold mb-4">Skills</h3>
          <Controller
            control={control}
            name="skills"
            render={({ field }) => (
              <TagInput
                value={field.value}
                onChange={field.onChange}
                placeholder="Add a skill..."
              />
            )}
          />
        </div>

        {/* Education */}
        <div className="border border-border rounded-xl p-5 bg-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold">Education</h3>
            <Button type="button" variant="outline" size="sm" onClick={addEducation}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          <div className="space-y-4">
            {(watch("education") || []).map((edu, index) => (
              <div key={edu.id} className="border border-border rounded-lg p-4 bg-muted/30">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    Education {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeEducation(index)}
                    className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Input
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={(e) => {
                      const current = watch("education") || [];
                      const updated = [...current];
                      updated[index] = { ...updated[index], degree: e.target.value };
                      setValue("education", updated);
                    }}
                  />
                  <Input
                    placeholder="School"
                    value={edu.school}
                    onChange={(e) => {
                      const current = watch("education") || [];
                      const updated = [...current];
                      updated[index] = { ...updated[index], school: e.target.value };
                      setValue("education", updated);
                    }}
                  />
                  <Input
                    placeholder="Year"
                    value={edu.year}
                    onChange={(e) => {
                      const current = watch("education") || [];
                      const updated = [...current];
                      updated[index] = { ...updated[index], year: e.target.value };
                      setValue("education", updated);
                    }}
                  />
                </div>
              </div>
            ))}
            {(!watch("education") || watch("education")?.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No education added. Click "Add" to add education.
              </p>
            )}
          </div>
        </div>

        {/* Projects */}
        <div className="border border-border rounded-xl p-5 bg-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold">Projects</h3>
            <Button type="button" variant="outline" size="sm" onClick={addProject}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          <div className="space-y-4">
            {(watch("projects") || []).map((proj, index) => (
              <div key={proj.id} className="border border-border rounded-lg p-4 bg-muted/30">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    Project {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeProject(index)}
                    className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 mb-3">
                  <Input
                    placeholder="Project Name"
                    value={proj.name}
                    onChange={(e) => {
                      const current = watch("projects") || [];
                      const updated = [...current];
                      updated[index] = { ...updated[index], name: e.target.value };
                      setValue("projects", updated);
                    }}
                  />
                  <Input
                    placeholder="URL (optional)"
                    value={proj.url || ""}
                    onChange={(e) => {
                      const current = watch("projects") || [];
                      const updated = [...current];
                      updated[index] = { ...updated[index], url: e.target.value || null };
                      setValue("projects", updated);
                    }}
                  />
                </div>
                <Textarea
                  placeholder="Description"
                  value={proj.description}
                  onChange={(e) => {
                    const current = watch("projects") || [];
                    const updated = [...current];
                    updated[index] = { ...updated[index], description: e.target.value };
                    setValue("projects", updated);
                  }}
                  rows={2}
                  className="mb-3"
                />
                <Controller
                  control={control}
                  name={`projects.${index}.technologies` as any}
                  render={({ field }) => (
                    <TagInput
                      value={field.value || []}
                      onChange={field.onChange}
                      placeholder="Add technology..."
                    />
                  )}
                />
              </div>
            ))}
            {(!watch("projects") || watch("projects")?.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No projects added. Click "Add" to add a project.
              </p>
            )}
          </div>
        </div>

        {/* Languages */}
        <div className="border border-border rounded-xl p-5 bg-card">
          <h3 className="font-display font-semibold mb-4">Languages</h3>
          <Controller
            control={control}
            name="languages"
            render={({ field }) => (
              <TagInput
                value={field.value || []}
                onChange={(val) => field.onChange(val.length ? val : null)}
                placeholder="Add a language..."
              />
            )}
          />
        </div>

        {/* Certifications */}
        <div className="border border-border rounded-xl p-5 bg-card">
          <h3 className="font-display font-semibold mb-4">Certifications</h3>
          <Controller
            control={control}
            name="certifications"
            render={({ field }) => (
              <TagInput
                value={field.value || []}
                onChange={(val) => field.onChange(val.length ? val : null)}
                placeholder="Add a certification..."
              />
            )}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-border">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </form>
    </StepContainer>
  );
}

// Modern Template Component - Full Preview
function ModernTemplate({ cv }: { cv: EnrichedCV }) {
  return (
    <div className="font-sans text-gray-800 text-sm leading-relaxed">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6 pb-4 border-b-2 border-primary/30">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl flex-shrink-0">
          {cv.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{cv.name}</h1>
          <p className="text-primary font-medium">{cv.title}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-600">
            <span>{cv.contact.email}</span>
            {cv.contact.phone && <span>{cv.contact.phone}</span>}
            {cv.contact.location && <span>{cv.contact.location}</span>}
            {cv.contact.linkedin && <span>{cv.contact.linkedin}</span>}
            {cv.contact.github && <span>{cv.contact.github}</span>}
          </div>
        </div>
      </div>

      {/* Summary */}
      {cv.summary && (
        <div className="mb-5">
          <p className="text-gray-600 italic">{cv.summary}</p>
        </div>
      )}

      {/* Experience */}
      {cv.experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">
            Experience
          </h2>
          <div className="space-y-4">
            {cv.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold text-gray-900">{exp.role}</h3>
                  <span className="text-xs text-gray-500">{exp.period}</span>
                </div>
                <p className="text-gray-600 text-xs mb-1">{exp.company}</p>
                <ul className="list-disc list-inside text-xs text-gray-600 space-y-0.5">
                  {exp.bullets.map((bullet, i) => (
                    <li key={i}>{bullet || "..."}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {cv.skills.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">
            Skills
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {cv.skills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {cv.education && cv.education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">
            Education
          </h2>
          <div className="space-y-2">
            {cv.education.map((edu, index) => (
              <div key={index} className="flex justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{edu.degree}</p>
                  <p className="text-xs text-gray-600">{edu.school}</p>
                </div>
                <span className="text-xs text-gray-500">{edu.year}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {cv.projects && cv.projects.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">
            Projects
          </h2>
          <div className="space-y-3">
            {cv.projects.map((proj, index) => (
              <div key={index}>
                <div className="flex items-baseline gap-2">
                  <h3 className="font-semibold text-gray-900">{proj.name}</h3>
                  {proj.url && (
                    <span className="text-xs text-primary">{proj.url}</span>
                  )}
                </div>
                <p className="text-xs text-gray-600 mb-1">{proj.description}</p>
                {proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {proj.technologies.map((tech) => (
                      <span key={tech} className="text-xs text-primary/70">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {cv.languages && cv.languages.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">
            Languages
          </h2>
          <p className="text-xs text-gray-600">{cv.languages.join(", ")}</p>
        </div>
      )}

      {/* Certifications */}
      {cv.certifications && cv.certifications.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">
            Certifications
          </h2>
          <ul className="text-xs text-gray-600 space-y-0.5">
            {cv.certifications.map((cert, index) => (
              <li key={index}>{cert}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Minimal Template Component - Full Preview
function MinimalTemplate({ cv }: { cv: EnrichedCV }) {
  return (
    <div className="font-serif text-gray-800 text-sm leading-relaxed">
      {/* Header */}
      <div className="text-center mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-normal tracking-wide text-gray-900 mb-1">
          {cv.name}
        </h1>
        <p className="text-gray-600">{cv.title}</p>
        <div className="flex justify-center flex-wrap gap-x-3 mt-2 text-xs text-gray-500">
          <span>{cv.contact.email}</span>
          {cv.contact.phone && (
            <>
              <span>|</span>
              <span>{cv.contact.phone}</span>
            </>
          )}
          {cv.contact.location && (
            <>
              <span>|</span>
              <span>{cv.contact.location}</span>
            </>
          )}
        </div>
      </div>

      {/* Summary */}
      {cv.summary && (
        <div className="mb-5">
          <p className="text-gray-600 text-center">{cv.summary}</p>
        </div>
      )}

      {/* Experience */}
      {cv.experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3 text-center">
            Experience
          </h2>
          <div className="space-y-4">
            {cv.experience.map((exp, index) => (
              <div key={index}>
                <div className="text-center mb-1">
                  <h3 className="font-semibold text-gray-900">
                    {exp.role} at {exp.company}
                  </h3>
                  <span className="text-xs text-gray-500">{exp.period}</span>
                </div>
                <ul className="text-xs text-gray-600 space-y-0.5">
                  {exp.bullets.map((bullet, i) => (
                    <li key={i} className="text-center">
                      {bullet || "..."}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {cv.skills.length > 0 && (
        <div className="mb-5 text-center">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
            Skills
          </h2>
          <p className="text-xs text-gray-600">{cv.skills.join(" • ")}</p>
        </div>
      )}

      {/* Education */}
      {cv.education && cv.education.length > 0 && (
        <div className="mb-5 text-center">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
            Education
          </h2>
          {cv.education.map((edu, index) => (
            <div key={index}>
              <p className="font-semibold text-gray-900">{edu.degree}</p>
              <p className="text-xs text-gray-600">
                {edu.school}, {edu.year}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {cv.projects && cv.projects.length > 0 && (
        <div className="mb-5 text-center">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
            Projects
          </h2>
          <div className="space-y-2">
            {cv.projects.map((proj, index) => (
              <div key={index}>
                <p className="font-semibold text-gray-900">{proj.name}</p>
                <p className="text-xs text-gray-600">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {cv.languages && cv.languages.length > 0 && (
        <div className="mb-5 text-center">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
            Languages
          </h2>
          <p className="text-xs text-gray-600">{cv.languages.join(" • ")}</p>
        </div>
      )}

      {/* Certifications */}
      {cv.certifications && cv.certifications.length > 0 && (
        <div className="text-center">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
            Certifications
          </h2>
          <p className="text-xs text-gray-600">{cv.certifications.join(" • ")}</p>
        </div>
      )}
    </div>
  );
}
