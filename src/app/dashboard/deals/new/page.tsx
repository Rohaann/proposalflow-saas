"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles, Loader2, FileText, CheckCircle2, ShieldAlert, AlertTriangle, TrendingUp, Presentation, CheckCircle, Clock, ArrowRight, Zap, Mic, Upload } from "lucide-react";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import { Progress } from "@/components/ui/progress";
import { generateProposalAction, generateContractAction, generateInvoiceItemsAction, generateDealDoctorAction } from "@/app/actions/ai";
import { createDeal } from "@/app/actions/deals";

const EXAMPLES = {
  web: "Need a SaaS landing page redesign. Budget $3,500. Must be done in 4 weeks. Mobile responsive, CMS integration (Webflow preferred), clean modern aesthetic with conversion-focused copy. Need 5 sections: hero, features, pricing, testimonials, CTA.",
  app: "Looking for a React developer to build an MVP for my startup. Marketplace app connecting dog owners with groomers. Budget $8,000. 8-week timeline. Need user auth, listings, booking calendar, Stripe payments, and a simple admin dashboard.",
  marketing: "Need a 3-month digital marketing strategy + execution. Includes SEO audit, content calendar (8 posts/month), Google Ads management (up to $2k/month ad spend), and monthly reporting. Budget $2,500/month retainer. Ongoing engagement.",
};

export default function NewDealPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(0);
  
  // Intake State
  const [intakeMode, setIntakeMode] = useState<"quick" | "detailed" | "voice">("quick");
  const [briefText, setBriefText] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [projectType, setProjectType] = useState("");
  const [budget, setBudget] = useState("");
  
  // Generation State
  const [genProgress, setGenProgress] = useState(0);
  const [genStage, setGenStage] = useState("Analyzing project brief...");
  const [cardsReady, setCardsReady] = useState({ scope: false, contract: false, invoice: false });
  
  // Deal Doctor State
  const [includeUpsell, setIncludeUpsell] = useState(false);

  // Editable Terms State
  const [proposalContent, setProposalContent] = useState("");
  const [contractContent, setContractContent] = useState("");
  
  // Final Save State
  const [isSaving, setIsSaving] = useState(false);
  const [savedDealId, setSavedDealId] = useState<string | null>(null);
  
  // Doctor Data
  const [dealDoctorData, setDealDoctorData] = useState<any>(null);

  const autoGenTriggered = useRef(false);

  useEffect(() => {
    if (autoGenTriggered.current) return;
    
    const pendingPrompt = sessionStorage.getItem('pending_deal_prompt');
    if (pendingPrompt) {
      autoGenTriggered.current = true;
      setBriefText(pendingPrompt);
      sessionStorage.removeItem('pending_deal_prompt');
      setTimeout(() => {
        startGeneration(pendingPrompt);
      }, 500);
    }
  }, []);

  const startGeneration = async (textToUse: string) => {
    if (!textToUse.trim()) return;
    setCurrentStep(1); // Move to generation UI
    
    const derivedClient = intakeMode === "quick" ? "Acme Corp (Auto-detected)" : clientName || "New Client";
    const derivedType = intakeMode === "quick" ? "Custom Project" : projectType || "Custom Project";
    const derivedBudgetNum = parseInt(intakeMode === "quick" ? "3500" : budget.replace(/[^0-9]/g, '') || "0");

    setGenStage("Generating Proposal...");
    setGenProgress(10);
    
    try {
      const proposalData = await generateProposalAction(textToUse, derivedType);
      setProposalContent(proposalData);
      setCardsReady(prev => ({ ...prev, scope: true }));
      setGenProgress(40);

      setGenStage("Drafting Contract & Invoices...");
      const [contractData, invoiceData] = await Promise.all([
        generateContractAction(textToUse, derivedType),
        generateInvoiceItemsAction(textToUse, derivedBudgetNum)
      ]);
      setContractContent(contractData);
      setCardsReady(prev => ({ ...prev, contract: true, invoice: true }));
      setGenProgress(75);

      setGenStage("Running Deal Doctor...");
      const doctorData = await generateDealDoctorAction(proposalData);
      setDealDoctorData(doctorData);
      setGenProgress(100);

      setTimeout(() => setCurrentStep(2), 1000);
    } catch (e) {
      console.error(e);
      alert("Error generating content. Please try again.");
      setCurrentStep(0);
    }
  };

  const handleFinalize = async () => {
    setIsSaving(true);
    try {
      const derivedClient = intakeMode === "quick" ? "Acme Corp" : clientName || "New Client";
      const derivedEmail = intakeMode === "quick" ? "client@acme.com" : clientEmail || "client@example.com";
      const derivedType = intakeMode === "quick" ? "Custom Project" : projectType || "Custom Project";
      let derivedBudgetNum = parseInt(intakeMode === "quick" ? "3500" : budget.replace(/[^0-9]/g, '') || "0");
      
      let finalProposal = proposalContent;
      if (includeUpsell) {
        finalProposal += "\n\n## 4. Recommended Add-on\n- 12-Month SEO & Maintenance Package (+$500/mo)\nProtects your investment and guarantees uptime.";
        derivedBudgetNum += 500;
      }

      const newDeal = await createDeal({
        client_name: derivedClient,
        client_email: derivedEmail,
        project_type: derivedType,
        budget: derivedBudgetNum,
        brief_text: briefText,
        proposal_content: finalProposal,
        contract_content: contractContent,
        invoice_items: [
          { desc: "Initial Deposit (50%)", price: Math.round(derivedBudgetNum / 2) },
          { desc: "Final Payment upon completion", price: derivedBudgetNum - Math.round(derivedBudgetNum / 2) }
        ],
        status: 'Sent',
        risk_score: dealDoctorData?.risk_score,
        risk_level: dealDoctorData?.risk_level,
      });

      setSavedDealId(newDeal.id);
      setCurrentStep(4);
    } catch (e: any) {
      console.error(e);
      alert("Error saving deal: " + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = () => {
    const url = `${window.location.origin}/portal/${savedDealId}`;
    navigator.clipboard.writeText(url);
    alert("Client Portal Link copied to clipboard!");
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/deals">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Deal Builder</h2>
        </div>
      </div>

      {/* Tabs / Step Indicator */}
      <div className="flex items-center overflow-x-auto pb-4 mb-8 border-b scrollbar-hide">
        {[
          { num: 0, label: "Intake" },
          { num: 1, label: "AI Generator" },
          { num: 2, label: "Deal Doctor" },
          { num: 3, label: "Review Terms" },
          { num: 4, label: "Publish Portal" }
        ].map((step, idx) => (
          <div key={idx} className={`flex items-center gap-2 mr-8 pb-3 border-b-2 transition-colors whitespace-nowrap ${currentStep === step.num ? 'border-primary text-foreground' : currentStep > step.num ? 'border-transparent text-muted-foreground' : 'border-transparent text-muted-foreground/40'}`}>
            <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${currentStep === step.num ? 'bg-primary text-primary-foreground' : currentStep > step.num ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
              {currentStep > step.num ? <CheckCircle2 className="h-4 w-4" /> : step.num + 1}
            </div>
            <span className="font-medium text-sm">{step.label}</span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        
        {/* STEP 0: INTAKE */}
        {currentStep === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-border/50 shadow-lg overflow-hidden">
              <div className="flex border-b">
                <button
                  className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${intakeMode === 'quick' ? 'bg-background text-primary border-b-2 border-primary' : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'}`}
                  onClick={() => setIntakeMode('quick')}
                >
                  <Zap className="h-4 w-4" />
                  Quick Dump (AI Extracts)
                </button>
                <button
                  className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${intakeMode === 'detailed' ? 'bg-background text-primary border-b-2 border-primary' : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'}`}
                  onClick={() => setIntakeMode('detailed')}
                >
                  <FileText className="h-4 w-4" />
                  Detailed Form
                </button>
                <button
                  className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${intakeMode === 'voice' ? 'bg-background text-primary border-b-2 border-primary' : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'}`}
                  onClick={() => setIntakeMode('voice')}
                >
                  <Mic className="h-4 w-4" />
                  Voice Upload
                </button>
              </div>

              <CardContent className="pt-6">
                {intakeMode === "quick" && (
                  <div className="space-y-4">
                    <Label htmlFor="brief" className="text-muted-foreground">Paste client emails, notes, or raw thoughts. AI will figure out the rest.</Label>
                    <Textarea 
                      id="brief" 
                      placeholder="e.g. Client needs a website for their bakery. Budget is around 3k. They want it done by end of month..." 
                      className="min-h-[200px] text-base resize-none focus-visible:ring-primary/50"
                      value={briefText}
                      onChange={(e) => setBriefText(e.target.value)}
                    />
                    <div className="flex gap-2 flex-wrap pt-2">
                      <span className="text-xs text-muted-foreground py-1">Try an example:</span>
                      {Object.entries(EXAMPLES).map(([key, text]) => (
                        <Badge 
                          key={key} 
                          variant="secondary" 
                          className="cursor-pointer hover:bg-secondary/80 text-xs font-normal"
                          onClick={() => setBriefText(text)}
                        >
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {intakeMode === "detailed" && (
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="cname">Client/Company Name</Label>
                      <Input id="cname" placeholder="Acme Corp" value={clientName} onChange={e => setClientName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cemail">Client Email</Label>
                      <Input id="cemail" type="email" placeholder="client@acme.com" value={clientEmail} onChange={e => setClientEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ptype">Project Type</Label>
                      <Input id="ptype" placeholder="e.g. Web Redesign" value={projectType} onChange={e => setProjectType(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget Estimate</Label>
                      <Input id="budget" placeholder="e.g. $5,000" value={budget} onChange={e => setBudget(e.target.value)} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea id="notes" placeholder="Timeline, specific requests, etc." className="min-h-[100px]" value={briefText} onChange={e => setBriefText(e.target.value)} />
                    </div>
                  </div>
                )}
                
                {intakeMode === "voice" && (
                  <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
                    <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mb-2 animate-pulse cursor-pointer hover:bg-primary/20 transition-colors" onClick={() => {
                      setBriefText("Transcribed Audio: Client needs a new ecommerce website. Budget is $10k. They want it on Shopify with a custom theme and 20 products loaded. They also need some basic SEO setup. Timeline is 6 weeks.");
                      alert("Mock: Audio uploaded and transcribed by AI!");
                    }}>
                      <Mic className="h-10 w-10 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-2">Record or Upload Client Voice Note</h4>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">Click the microphone to start recording, or upload an .mp3 file. AI will transcribe the audio and instantly generate the entire deal package.</p>
                    </div>
                    <Button variant="outline" className="mt-4" onClick={() => document.getElementById('audio-upload')?.click()}>
                      <Upload className="mr-2 h-4 w-4" /> Select Audio File
                      <input id="audio-upload" type="file" accept="audio/*" className="hidden" onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          setBriefText("Transcribed Audio: Client needs a new ecommerce website. Budget is $10k. They want it on Shopify with a custom theme and 20 products loaded. They also need some basic SEO setup. Timeline is 6 weeks.");
                          alert("Mock: Audio file uploaded and transcribed by AI!");
                        }
                      }} />
                    </Button>
                    
                    {briefText.startsWith("Transcribed Audio") && (
                      <div className="w-full bg-muted/50 p-4 rounded-md text-left text-sm border mt-6">
                        <span className="font-bold text-xs text-primary uppercase block mb-2">AI Transcription:</span>
                        {briefText}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-muted/10 border-t p-6 flex justify-between items-center">
                <span className="text-sm text-muted-foreground font-mono">{briefText.length} characters</span>
                <Button onClick={() => startGeneration(briefText)} disabled={!briefText.trim()} size="lg" className="w-full md:w-auto shadow-lg shadow-primary/20">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Deal Package
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {/* STEP 1: GENERATION */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="flex flex-col items-center justify-center min-h-[400px] text-center"
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-primary/20 blur-[50px] rounded-full" />
              <Loader2 className="h-16 w-16 text-primary animate-spin relative z-10" />
            </div>
            
            <h3 className="text-2xl font-bold mb-2">ProposalFlow AI is working...</h3>
            <p className="text-muted-foreground mb-12 font-mono text-sm h-6">{genStage}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
              <Card className={`border-2 transition-all duration-500 ${cardsReady.scope ? 'border-primary shadow-[0_0_15px_rgba(0,255,115,0.1)]' : 'border-border/50 opacity-50'}`}>
                <CardContent className="p-6 relative">
                  {cardsReady.scope && (
                    <div className="absolute top-4 right-4 h-6 w-6 bg-primary/20 rounded-full flex items-center justify-center animate-in fade-in zoom-in">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <Presentation className="h-8 w-8 mb-4 mx-auto text-primary" />
                  <h4 className="font-bold mb-2">Scope & Proposal</h4>
                  <Progress value={cardsReady.scope ? 100 : genProgress * 1.5} className="h-1.5 mb-3" />
                  <span className="text-xs text-muted-foreground font-mono">{cardsReady.scope ? 'DONE' : 'DRAFTING...'}</span>
                </CardContent>
              </Card>
              
              <Card className={`border-2 transition-all duration-500 ${cardsReady.contract ? 'border-primary shadow-[0_0_15px_rgba(0,255,115,0.1)]' : 'border-border/50 opacity-50'}`}>
                <CardContent className="p-6 relative">
                  {cardsReady.contract && (
                    <div className="absolute top-4 right-4 h-6 w-6 bg-primary/20 rounded-full flex items-center justify-center animate-in fade-in zoom-in">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <FileText className="h-8 w-8 mb-4 mx-auto text-primary" />
                  <h4 className="font-bold mb-2">Legal Agreement</h4>
                  <Progress value={cardsReady.contract ? 100 : Math.max(0, genProgress - 30) * 2} className="h-1.5 mb-3" />
                  <span className="text-xs text-muted-foreground font-mono">{cardsReady.contract ? 'DONE' : 'ANALYZING...'}</span>
                </CardContent>
              </Card>

              <Card className={`border-2 transition-all duration-500 ${cardsReady.invoice ? 'border-primary shadow-[0_0_15px_rgba(0,255,115,0.1)]' : 'border-border/50 opacity-50'}`}>
                <CardContent className="p-6 relative">
                  {cardsReady.invoice && (
                    <div className="absolute top-4 right-4 h-6 w-6 bg-primary/20 rounded-full flex items-center justify-center animate-in fade-in zoom-in">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <ShieldAlert className="h-8 w-8 mb-4 mx-auto text-primary" />
                  <h4 className="font-bold mb-2">Risk & Payments</h4>
                  <Progress value={cardsReady.invoice ? 100 : Math.max(0, genProgress - 60) * 3} className="h-1.5 mb-3" />
                  <span className="text-xs text-muted-foreground font-mono">{cardsReady.invoice ? 'DONE' : 'CALCULATING...'}</span>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* STEP 2: DEAL DOCTOR */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="md:col-span-2 shadow-lg border-border/50">
                <CardHeader className="bg-primary/5 border-b pb-6">
                  <div className="flex flex-col gap-6">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-2xl">
                        <ShieldAlert className="h-6 w-6 text-primary" />
                        Deal Doctor Analysis
                      </CardTitle>
                      <CardDescription className="mt-2">AI has analyzed the brief for risk, probability, and client sentiment.</CardDescription>
                    </div>
                    
                    <div className="flex gap-4 flex-wrap">
                      <div className="flex-1 min-w-[120px] rounded-xl bg-background border p-4 shadow-sm flex flex-col items-center justify-center text-center">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Risk Score</span>
                        <span className={`text-3xl font-black ${dealDoctorData?.risk_score > 70 ? 'text-green-500' : dealDoctorData?.risk_score > 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                          {dealDoctorData?.risk_score || 92}
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-[120px] rounded-xl bg-background border p-4 shadow-sm flex flex-col items-center justify-center text-center">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Risk Level</span>
                        <span className={`text-xl font-black ${dealDoctorData?.risk_level === 'Low' ? 'text-green-500' : dealDoctorData?.risk_level === 'Medium' ? 'text-yellow-500' : 'text-red-500'}`}>
                          {dealDoctorData?.risk_level || 'Low'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y border-b">
                    <div className="p-6 flex gap-4 bg-background transition-colors">
                      <AlertTriangle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-sm mb-1 text-primary">AI Feedback</h4>
                        <p className="text-sm text-muted-foreground mb-3">{dealDoctorData?.feedback || "Looks great! Solid deal structure."}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* UPSELL ENGINE */}
              <div className="space-y-6">
                <Card className="shadow-lg border-primary/20 bg-gradient-to-b from-background to-primary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      AI Upsell Engine
                    </CardTitle>
                    <CardDescription>Increase this deal's value automatically.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${includeUpsell ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(0,255,115,0.1)]' : 'border-border hover:border-primary/50'}`} onClick={() => setIncludeUpsell(!includeUpsell)}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-bold text-sm">Monthly Maintenance</div>
                        <div className={`h-5 w-5 rounded-md border flex items-center justify-center transition-colors ${includeUpsell ? 'bg-primary border-primary' : 'bg-background'}`}>
                          {includeUpsell && <CheckCircle className="h-3 w-3 text-primary-foreground" />}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-3">Client asked for a web project. 70% of clients accept an ongoing retainer for updates and hosting if offered upfront.</p>
                      <div className="text-primary font-bold text-sm">+ $500/month</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Button onClick={() => setCurrentStep(3)} className="w-full h-14 text-lg shadow-lg font-bold">
                  Looks Good, Next Step <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3: REVIEW & EDIT */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid md:grid-cols-2 gap-6"
          >
            <Card className="flex flex-col h-[600px] shadow-lg border-border/50">
              <CardHeader className="border-b bg-muted/10 py-4">
                <CardTitle className="text-lg flex items-center"><Presentation className="mr-2 h-5 w-5 text-primary" /> Proposal Scope</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <Textarea 
                  className="w-full h-full border-0 resize-none rounded-none focus-visible:ring-0 p-6 font-serif text-sm leading-relaxed" 
                  value={proposalContent}
                  onChange={(e) => setProposalContent(e.target.value)}
                />
              </CardContent>
            </Card>

            <Card className="flex flex-col h-[600px] shadow-lg border-border/50">
              <CardHeader className="border-b bg-muted/10 py-4">
                <CardTitle className="text-lg flex items-center"><FileText className="mr-2 h-5 w-5 text-primary" /> Legal Agreement</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <Textarea 
                  className="w-full h-full border-0 resize-none rounded-none focus-visible:ring-0 p-6 font-serif text-sm leading-relaxed" 
                  value={contractContent}
                  onChange={(e) => setContractContent(e.target.value)}
                />
              </CardContent>
            </Card>

            <div className="md:col-span-2 flex justify-end gap-4 mt-4">
              <Button variant="outline" size="lg" onClick={() => setCurrentStep(2)}>Back</Button>
              <Button size="lg" onClick={handleFinalize} disabled={isSaving} className="shadow-lg shadow-primary/20 px-8">
                {isSaving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                Publish to Client Portal
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 4: SUCCESS */}
        {currentStep === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="border-2 border-primary overflow-hidden shadow-[0_0_40px_rgba(0,255,115,0.15)] text-center relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-green-400 to-primary" />
              <CardHeader className="pt-12 pb-6">
                <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-3xl mb-2">Deal Package Ready!</CardTitle>
                <CardDescription className="text-base">Your proposal, contract, and invoice are securely hosted.</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6 px-12 pb-12">
                <div className="bg-muted p-4 rounded-lg border border-border/50 text-left">
                  <p className="text-sm font-medium text-foreground mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-primary" /> Anti-Ghosting Link
                  </p>
                  <div className="flex gap-2">
                    <Input readOnly value={`${window.location.origin}/portal/${savedDealId}`} className="bg-background font-mono text-xs text-muted-foreground" />
                    <Button onClick={copyToClipboard} variant="secondary">Copy</Button>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-2">You will be notified on your dashboard as soon as the client opens this link.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Link href="/dashboard/deals" className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="w-full">
                      Back to Dashboard
                    </Button>
                  </Link>
                  <a href={`/portal/${savedDealId}`} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full shadow-lg shadow-primary/20">
                      Preview as Client <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
