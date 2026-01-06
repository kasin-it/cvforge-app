"use client";

import { useRef, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CVWizardReturn } from "@/hooks/use-cv-wizard";
import { cvFormSchema, type CVFormValues } from "@/lib/form-schemas";
import { StepContainer } from "@/components/layout/step-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { TagInput } from "@/components/ui/tag-input";
import { ArrowRight, Download, Upload, X, GripVertical } from "lucide-react";

type CVInputStepProps = {
  wizard: CVWizardReturn;
};

export function CVInputStep({ wizard }: CVInputStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CVFormValues>({
    resolver: zodResolver(cvFormSchema),
    defaultValues: wizard.cvFormData || undefined,
    mode: "onBlur",
  });

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;

  // Field arrays for dynamic sections
  const experienceArray = useFieldArray({
    control,
    name: "experience",
  });

  const educationArray = useFieldArray({
    control,
    name: "education",
  });

  const projectsArray = useFieldArray({
    control,
    name: "projects" as "experience", // Type hack for nullable array
  });

  const blogPostsArray = useFieldArray({
    control,
    name: "blogPosts" as "experience", // Type hack for nullable array
  });

  // Save form data to wizard state on blur/submit only (not on every change)
  // Using watch with subscription to avoid infinite loops
  useEffect(() => {
    const subscription = form.watch((data) => {
      wizard.setCVFormData(data as CVFormValues);
    });
    return () => subscription.unsubscribe();
  }, [form, wizard.setCVFormData]);

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (wizard.importCVFromJSON(content)) {
          // Reset form with imported data
          const imported = JSON.parse(content);
          form.reset({
            ...imported,
            experience: imported.experience.map((exp: any) => ({
              ...exp,
              id: wizard.generateId(),
            })),
            education: imported.education.map((edu: any) => ({
              ...edu,
              id: wizard.generateId(),
            })),
            projects: imported.projects?.map((proj: any) => ({
              ...proj,
              id: wizard.generateId(),
            })) ?? null,
            blogPosts: imported.blogPosts?.map((post: any) => ({
              ...post,
              id: wizard.generateId(),
            })) ?? null,
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const onSubmit = (data: CVFormValues) => {
    wizard.setCVFormData(data);
    wizard.nextStep();
  };

  // Add experience
  const addExperience = () => {
    experienceArray.append({
      id: wizard.generateId(),
      role: "",
      company: "",
      period: "",
      bullets: [""],
    });
  };

  // Add education
  const addEducation = () => {
    educationArray.append({
      id: wizard.generateId(),
      degree: "",
      school: "",
      year: "",
    });
  };

  // Add project
  const addProject = () => {
    const currentProjects = watch("projects") || [];
    setValue("projects", [
      ...currentProjects,
      {
        id: wizard.generateId(),
        name: "",
        description: "",
        url: null,
        technologies: [],
      },
    ]);
  };

  // Add blog post
  const addBlogPost = () => {
    const currentPosts = watch("blogPosts") || [];
    setValue("blogPosts", [
      ...currentPosts,
      {
        id: wizard.generateId(),
        name: "",
        description: "",
        url: "",
      },
    ]);
  };

  return (
    <StepContainer
      title="Your CV"
      description="Enter your professional information or import from JSON"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="manual">Edit Manually</TabsTrigger>
            <TabsTrigger value="import">Import JSON</TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-6">
            {/* Personal Info */}
            <CollapsibleSection title="Personal Info">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Senior Frontend Developer"
                    {...register("title")}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    {...register("contact.email")}
                  />
                  {errors.contact?.email && (
                    <p className="text-sm text-destructive">{errors.contact.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="+1 234 567 890"
                    {...register("contact.phone")}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="New York, NY"
                    {...register("contact.location")}
                  />
                  {errors.contact?.location && (
                    <p className="text-sm text-destructive">{errors.contact.location.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input
                    id="linkedin"
                    placeholder="linkedin.com/in/johndoe"
                    {...register("contact.linkedin")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub URL</Label>
                  <Input
                    id="github"
                    placeholder="github.com/johndoe"
                    {...register("contact.github")}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="johndoe.com"
                    {...register("contact.website")}
                  />
                </div>
              </div>
            </CollapsibleSection>

            {/* Summary */}
            <CollapsibleSection title="Summary">
              <div className="space-y-2">
                <Label htmlFor="summary">Professional Summary</Label>
                <Textarea
                  id="summary"
                  placeholder="A brief overview of your professional background, key skills, and career objectives..."
                  rows={5}
                  {...register("summary")}
                />
                {errors.summary && (
                  <p className="text-sm text-destructive">{errors.summary.message}</p>
                )}
              </div>
            </CollapsibleSection>

            {/* Experience */}
            <CollapsibleSection
              title="Experience"
              onAdd={addExperience}
              addLabel="Add another position"
            >
              {experienceArray.fields.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">
                  No experience added yet. Click below to add your first position.
                </p>
              ) : (
                <div className="space-y-6">
                  {experienceArray.fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="relative border border-border rounded-lg p-4 bg-muted/30"
                    >
                      <button
                        type="button"
                        onClick={() => experienceArray.remove(index)}
                        className="absolute top-3 right-3 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>

                      <input type="hidden" {...register(`experience.${index}.id`)} />

                      <div className="grid gap-4 sm:grid-cols-2 mb-4">
                        <div className="space-y-2">
                          <Label>Role</Label>
                          <Input
                            placeholder="Senior Developer"
                            {...register(`experience.${index}.role`)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Company</Label>
                          <Input
                            placeholder="TechCorp Inc."
                            {...register(`experience.${index}.company`)}
                          />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <Label>Period</Label>
                          <Input
                            placeholder="Jan 2020 - Present"
                            {...register(`experience.${index}.period`)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Achievements & Responsibilities</Label>
                        <Controller
                          control={control}
                          name={`experience.${index}.bullets`}
                          render={({ field }) => (
                            <div className="space-y-2">
                              {(field.value || []).map((bullet, bulletIndex) => (
                                <div key={bulletIndex} className="flex items-center gap-2">
                                  <GripVertical className="h-4 w-4 text-muted-foreground/50" />
                                  <Input
                                    placeholder="Describe an achievement or responsibility..."
                                    value={bullet}
                                    onChange={(e) => {
                                      const newBullets = [...field.value];
                                      newBullets[bulletIndex] = e.target.value;
                                      field.onChange(newBullets);
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newBullets = field.value.filter(
                                        (_, i) => i !== bulletIndex
                                      );
                                      field.onChange(newBullets);
                                    }}
                                    className="p-2 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
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
                                + Add bullet point
                              </Button>
                            </div>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CollapsibleSection>

            {/* Skills */}
            <CollapsibleSection title="Skills">
              <div className="space-y-2">
                <Label>Technical Skills</Label>
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
            </CollapsibleSection>

            {/* Education */}
            <CollapsibleSection
              title="Education"
              onAdd={addEducation}
              addLabel="Add another degree"
            >
              {educationArray.fields.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">
                  No education added yet. Click below to add your first degree.
                </p>
              ) : (
                <div className="space-y-4">
                  {educationArray.fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="relative border border-border rounded-lg p-4 bg-muted/30"
                    >
                      <button
                        type="button"
                        onClick={() => educationArray.remove(index)}
                        className="absolute top-3 right-3 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>

                      <input type="hidden" {...register(`education.${index}.id`)} />

                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-2">
                          <Label>Degree</Label>
                          <Input
                            placeholder="BSc Computer Science"
                            {...register(`education.${index}.degree`)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>School</Label>
                          <Input
                            placeholder="MIT"
                            {...register(`education.${index}.school`)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Year</Label>
                          <Input
                            placeholder="2020"
                            {...register(`education.${index}.year`)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CollapsibleSection>

            {/* Languages */}
            <CollapsibleSection title="Languages" optional defaultOpen={false}>
              <div className="space-y-2">
                <Label>Languages</Label>
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
            </CollapsibleSection>
          </TabsContent>

          <TabsContent value="import" className="space-y-6">
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-muted/30">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-display text-lg font-semibold mb-2">Import CV Data</h3>
              <p className="text-muted-foreground mb-4">
                Upload a JSON file with your CV data
              </p>
              <Button type="button" onClick={() => fileInputRef.current?.click()}>
                Choose File
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <Button type="button" variant="outline" onClick={wizard.exportCVToJSON}>
            <Download className="h-4 w-4 mr-2" />
            Save as JSON
          </Button>
          <Button type="submit">
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </form>
    </StepContainer>
  );
}
