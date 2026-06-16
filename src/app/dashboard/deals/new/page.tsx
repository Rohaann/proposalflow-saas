"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles, Loader2, Zap, FileText, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthContext";

const EXAMPLES = {
  web: "Need a SaaS landing page redesign. Budget $3,500. Must be done in 4 weeks. Mobile responsive, CMS integration (Webflow preferred), clean modern aesthetic with conversion-focused copy. Need 5 sections: hero, features, pricing, testimonials, CTA.",
  app: "Looking for a React developer to build an MVP for my startup. Marketplace app connecting dog owners with groomers. Budget $8,000. 8-week timeline. Need user auth, listings, booking calendar, Stripe payments, and a simple admin dashboard.",
  marketing: "Need a 3-month digital marketing strategy + execution. Includes SEO audit, content calendar (8 posts/month), Google Ads management (up to $2k/month ad spend), and monthly reporting. Budget $2,500/month retainer. Ongoing engagement.",
};

const LOADING_STEPS = [
  "Analyzing project brief...",
  "Extracting intent & requirements...",
  "Drafting proposal & contract terms...",
  "Applying Deal Doctor scope protection...",
  "Saving deal package..."
];

export default function NewDealPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [intakeMode, setIntakeMode] = useState<"quick" | "detailed">("quick");
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [briefText, setBriefText] = useState("");
  
  // Detailed form states
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [projectType, setProjectType] = useState("");
  const [budget, setBudget] = useState("");

  const autoGenTriggered = useRef(false);

  useEffect(() => {
    if (autoGenTriggered.current) return;
    
    const pendingPrompt = sessionStorage.getItem('pending_deal_prompt');
    if (pendingPrompt && user) {
      autoGenTriggered.current = true;
      setBriefText(pendingPrompt);
      sessionStorage.removeItem('pending_deal_prompt');
      // Give state a moment to update before triggering
      setTimeout(() => {
        handleSubmit(undefined, pendingPrompt);
      }, 500);
    }
  }, [user]);

  const handleSubmit = async (e?: React.FormEvent, overrideText?: string) => {
    if (e) e.preventDefault();
    const textToUse = overrideText || briefText;
    if (intakeMode === "quick" && !textToUse.trim()) return;
    
    if (!user) {
      alert("You must be logged in to create a deal.");
      return;
    }

    setIsGenerating(true);
    setLoadingStep(0);

    // AI Generation Simulation loop
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < LOADING_STEPS.length - 1) {
        setLoadingStep(currentStep);
      }
    }, 1200);

    try {
      // Create mockup content based on the input
      const derivedClient = intakeMode === "quick" ? "Acme Corp (Auto-detected)" : clientName || "New Client";
      const derivedType = intakeMode === "quick" ? "Custom Project" : projectType || "Custom Project";
      const derivedBudget = intakeMode === "quick" ? "$3,500" : budget || "$0";

      const mockProposal = `
# ${derivedType} Proposal
**Prepared for:** ${derivedClient}
**Date:** ${new Date().toLocaleDateString()}

## 1. Executive Summary
Thank you for considering our services. This proposal outlines a comprehensive strategy to achieve your goals based on the brief provided.

## 2. Project Scope & Deliverables
${textToUse.split('.').slice(0, 3).map(s => `- ${s.trim()}`).filter(s => s.length > 2).join('\n')}

## 3. Timeline
The project will be executed over the standard timeline.

## 4. Investment
Total estimated investment is ${derivedBudget}.
      `.trim();

      // Actually insert into Supabase!
      setLoadingStep(LOADING_STEPS.length - 1); // "Saving deal package..."

      const { data, error } = await supabase
        .from('deals')
        .insert([
          { 
            user_id: user.id,
            client_name: derivedClient,
            client_email: clientEmail,
            project_type: derivedType,
            budget: derivedBudget,
            brief_text: textToUse,
            status: 'Draft',
            proposal_content: mockProposal,
            contract_content: 'Standard Master Services Agreement terms apply.',
            invoice_items: [{ desc: "Initial Scope", price: 3500 }]
          }
        ])
        .select()
        .single();

      clearInterval(interval);

      if (error) {
        console.error("Supabase Error:", error);
        alert("Failed to save deal. Did you run the Auth SQL script to update the table?");
        setIsGenerating(false);
        return;
      }

      if (data) {
        // Redirect to the newly created deal!
        router.push(`/dashboard/proposals/${data.id}`);
      }

    } catch (err) {
      console.error(err);
      clearInterval(interval);
      setIsGenerating(false);
    }
  };

  const fillExample = (key: keyof typeof EXAMPLES) => {
    setBriefText(EXAMPLES[key]);
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/deals">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Deal</h1>
          <p className="text-muted-foreground mt-1">Paste your client brief to let AI generate the rest.</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isGenerating ? (
          <motion.div
            key="generating"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 space-y-8"
          >
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            </div>
            
            <div className="text-center space-y-2 max-w-md w-full">
              <h3 className="text-2xl font-bold font-serif">Building Deal Package...</h3>
              <div className="h-6 flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={loadingStep}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="text-muted-foreground font-mono text-sm"
                  >
                    {LOADING_STEPS[loadingStep]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            <div className="w-full max-w-md space-y-3">
              {LOADING_STEPS.map((step, idx) => (
                <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${idx < loadingStep ? "bg-primary/10 border-primary/30" : idx === loadingStep ? "bg-card border-border shadow-sm" : "opacity-40"}`}>
                  {idx < loadingStep ? (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  ) : idx === loadingStep ? (
                    <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-muted" />
                  )}
                  <span className={`text-sm font-medium ${idx <= loadingStep ? "text-foreground" : "text-muted-foreground"}`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="border-border/60 shadow-lg overflow-hidden">
              <div className="flex border-b border-border/40">
                <button
                  type="button"
                  onClick={() => setIntakeMode("quick")}
                  className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${intakeMode === "quick" ? "bg-background text-primary border-b-2 border-primary" : "bg-muted/30 text-muted-foreground hover:bg-muted/50"}`}
                >
                  <Zap className="h-4 w-4" /> Quick Paste
                </button>
                <button
                  type="button"
                  onClick={() => setIntakeMode("detailed")}
                  className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${intakeMode === "detailed" ? "bg-background text-primary border-b-2 border-primary" : "bg-muted/30 text-muted-foreground hover:bg-muted/50"}`}
                >
                  <FileText className="h-4 w-4" /> Detailed Form
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <CardContent className="p-6 md:p-8">
                  {intakeMode === "quick" ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                      <div className="space-y-3">
                        <Label htmlFor="quick-brief" className="text-lg font-semibold flex items-center">
                          Paste client message or describe the project
                        </Label>
                        <Textarea 
                          id="quick-brief" 
                          value={briefText}
                          onChange={(e) => setBriefText(e.target.value)}
                          placeholder="e.g. &quot;Need SaaS landing page redesign, budget $3,500, 4 weeks. Must be mobile responsive with CMS. Looking for clean, modern design.&quot;" 
                          className="min-h-[250px] resize-y text-base p-5 bg-muted/20"
                          required
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Or try an example prompt:</span>
                        <div className="flex flex-wrap gap-2">
                          <Button type="button" variant="outline" size="sm" onClick={() => fillExample('web')} className="bg-primary/5 hover:bg-primary/10 border-primary/20 hover:border-primary/30">
                            Web Design
                          </Button>
                          <Button type="button" variant="outline" size="sm" onClick={() => fillExample('app')} className="bg-primary/5 hover:bg-primary/10 border-primary/20 hover:border-primary/30">
                            App Dev
                          </Button>
                          <Button type="button" variant="outline" size="sm" onClick={() => fillExample('marketing')} className="bg-primary/5 hover:bg-primary/10 border-primary/20 hover:border-primary/30">
                            Marketing
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="clientName">Client Name</Label>
                          <Input id="clientName" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="John Doe" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company">Company</Label>
                          <Input id="company" placeholder="Acme Corp" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="john@acmecorp.com" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="projectType">Project Type</Label>
                          <Select required onValueChange={(val) => setProjectType(val || "")}>
                            <SelectTrigger id="projectType">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Web Design">Web Design</SelectItem>
                              <SelectItem value="Web Development">Web Development</SelectItem>
                              <SelectItem value="SEO">SEO</SelectItem>
                              <SelectItem value="Marketing Retainer">Marketing Retainer</SelectItem>
                              <SelectItem value="Consulting">Consulting</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="budget">Estimated Budget</Label>
                          <Input id="budget" value={budget} onChange={e => setBudget(e.target.value)} placeholder="$5,000" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="timeline">Timeline</Label>
                          <Input id="timeline" placeholder="e.g. 4 weeks" />
                        </div>
                      </div>

                      <div className="space-y-3 pt-6 border-t">
                        <Label htmlFor="brief" className="text-lg font-semibold flex items-center">
                          Project Description / Brief
                          <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 font-medium">
                            <Sparkles className="mr-1 h-3 w-3" /> AI Analyzed
                          </Badge>
                        </Label>
                        <Textarea 
                          id="brief" 
                          value={briefText}
                          onChange={(e) => setBriefText(e.target.value)}
                          placeholder="Describe what the client needs..." 
                          className="min-h-[150px] resize-y"
                          required
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="flex justify-end gap-4 border-t p-6 bg-muted/10 rounded-b-xl">
                  <Link href="/dashboard/deals">
                    <Button variant="ghost" type="button">Cancel</Button>
                  </Link>
                  <Button type="submit" size="lg" className="min-w-[200px] font-bold shadow-lg shadow-primary/20">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Deal Package →
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
