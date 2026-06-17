"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { generateProposalAction } from "@/app/actions/ai";
import { convertDocumentToDealAction } from "@/app/actions/deals";
import { saveTemplateAction, getTemplatesAction } from "@/app/actions/templates";
import { Loader2, FileText, ArrowRight, Save, FolderOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ProposalGeneratorPage() {
  const router = useRouter();
  const [brief, setBrief] = useState("");
  const [projectType, setProjectType] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [savedTemplates, setSavedTemplates] = useState<any[]>([]);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);

  const handleGenerate = async () => {
    if (brief.length < 5 || projectType.length < 2) {
      alert("Please provide a valid brief and project type.");
      return;
    }
    setIsGenerating(true);
    try {
      const generated = await generateProposalAction(brief, projectType);
      setResult(generated);
    } catch (error) {
      console.error(error);
      alert("Failed to generate proposal.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConvertToDeal = async () => {
    if (!result) return;
    setIsConverting(true);
    try {
      const deal = await convertDocumentToDealAction('proposal', result);
      router.push(`/dashboard/deals/${deal.id}`);
    } catch (error) {
      console.error(error);
      alert("Failed to convert to deal.");
    } finally {
      setIsConverting(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!result) return;
    const name = prompt("Enter a name for this template:");
    if (!name) return;
    setIsSavingTemplate(true);
    try {
      await saveTemplateAction('proposal', name, result);
      alert("Template saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to save template.");
    } finally {
      setIsSavingTemplate(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const data = await getTemplatesAction('proposal');
      setSavedTemplates(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Proposal Generator</h1>
        <p className="text-muted-foreground mt-1">Quickly generate a professional proposal without creating a full deal.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Input</CardTitle>
          <CardDescription>Enter the basic project details to generate a proposal.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Project Type</label>
            <Input 
              placeholder="e.g. Website Redesign, Mobile App, SEO Audit" 
              value={projectType} 
              onChange={e => setProjectType(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Client Brief / Notes</label>
            <Textarea 
              className="h-32" 
              placeholder="Paste the client's inquiry, rough notes, or email..." 
              value={brief} 
              onChange={e => setBrief(e.target.value)} 
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleGenerate} disabled={isGenerating} className="flex-1">
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
              Generate Proposal
            </Button>
            <Dialog open={isTemplatesOpen} onOpenChange={setIsTemplatesOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" onClick={fetchTemplates} className="flex-1 sm:flex-none">
                  <FolderOpen className="mr-2 h-4 w-4" /> Load Template
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Saved Templates</DialogTitle>
                  <DialogDescription>Select a previously saved proposal template.</DialogDescription>
                </DialogHeader>
                <div className="space-y-2 mt-4 max-h-[300px] overflow-y-auto">
                  {savedTemplates.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No templates found.</p>
                  ) : (
                    savedTemplates.map(t => (
                      <Button 
                        key={t.id} 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => {
                          setResult(t.content);
                          setIsTemplatesOpen(false);
                        }}
                      >
                        <FileText className="mr-2 h-4 w-4" /> {t.name}
                      </Button>
                    ))
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-primary/50 shadow-lg">
          <CardHeader className="bg-primary/5 pb-4 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Generated Proposal</CardTitle>
                <CardDescription>Review your AI-generated proposal below.</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleSaveTemplate} disabled={isSavingTemplate}>
                  {isSavingTemplate ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save as Template
                </Button>
                <Button onClick={handleConvertToDeal} disabled={isConverting} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  {isConverting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                  Convert into Full Deal
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none whitespace-pre-wrap font-serif">
              {result}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
