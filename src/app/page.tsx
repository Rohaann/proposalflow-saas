"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  Zap, 
  ShieldAlert, 
  BarChart3, 
  Presentation,
  Clock,
  ShieldCheck,
  BrainCircuit,
  MessageSquare,
  Check
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function LandingPage() {
  const [quickstartText, setQuickstartText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const [isContractFixed, setIsContractFixed] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleGenerate = () => {
    if (!quickstartText.trim()) return;
    setIsGenerating(true);
    
    // Save to sessionStorage so it persists after they Auth
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pending_deal_prompt', quickstartText);
    }

    setTimeout(() => {
      setIsGenerating(false);
      if (user) {
        router.push('/dashboard/deals/new');
      } else {
        setShowSignupPrompt(true);
      }
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#050807] text-[#DFF0E5] font-sans selection:bg-[#00FF73] selection:text-black">
      <header className="px-6 lg:px-14 h-20 flex items-center border-b border-[#00DC5A]/10 bg-[#0B1410]/80 backdrop-blur-xl sticky top-0 z-50">
        <Link className="flex items-center justify-center group" href="#">
          <div className="w-8 h-8 rounded-lg bg-[#00FF73] flex items-center justify-center mr-3 group-hover:shadow-[0_0_15px_rgba(0,255,115,0.5)] transition-all">
            <Presentation className="h-5 w-5 text-black" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">ProposalFlow</span>
        </Link>
        <nav className="ml-auto flex gap-6 items-center">
          <Link className="hidden sm:inline-block text-sm font-medium text-[#8FAD96] hover:text-[#00FF73] transition-colors" href="#features">
            Features
          </Link>
          <Link className="hidden sm:inline-block text-sm font-medium text-[#8FAD96] hover:text-[#00FF73] transition-colors" href="#pricing">
            Pricing
          </Link>
          <Link href="/dashboard">
            <Button size="sm" className="rounded-full px-6 bg-white text-black hover:bg-gray-200 font-bold shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all">
              Sign In
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="w-full py-24 md:py-32 lg:py-40 flex flex-col items-center justify-center relative border-b border-[#00DC5A]/10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#00FF73]/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="container px-4 md:px-6 relative z-10"
          >
            <div className="flex flex-col items-center space-y-8 text-center">
              <motion.div variants={fadeIn} className="inline-flex items-center rounded-full border border-[#00FF73]/30 px-4 py-1.5 text-sm font-bold bg-[#00FF73]/10 text-[#00FF73] backdrop-blur-sm shadow-[0_0_20px_rgba(0,255,115,0.15)]">
                <Zap className="mr-2 h-4 w-4 fill-current" />
                <span>Stop losing deals to slow proposals</span>
              </motion.div>
              <motion.h1 variants={fadeIn} className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-[5rem] max-w-4xl leading-[1.1] text-white">
                Turn messy client emails into <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF73] to-[#00A844]">signed contracts</span>
              </motion.h1>
              <motion.p variants={fadeIn} className="mx-auto max-w-[700px] text-[#8FAD96] md:text-2xl lg:text-xl font-medium">
                ProposalFlow AI is a deal-closing platform for agencies and freelancers. Paste a client request and instantly generate a professional proposal, a protective contract, an invoice, and a deal risk analysis.
              </motion.p>
              
              <motion.div variants={fadeIn} className="w-full max-w-2xl mx-auto pt-8 text-left relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#00FF73]/30 to-[#00A844]/30 rounded-3xl blur opacity-30 animate-pulse"></div>
                <div className="bg-[#101D16] border border-[#00DC5A]/20 rounded-2xl overflow-hidden shadow-2xl relative z-10">
                  <div className="bg-[#0B1410] border-b border-[#00DC5A]/10 px-5 py-4 flex justify-between items-center">
                    <span className="text-sm font-mono font-bold text-[#00FF73] uppercase tracking-wider flex items-center">
                      <ArrowRight className="h-4 w-4 mr-2 inline"/> Paste client message
                    </span>
                    <div className="hidden sm:flex gap-2">
                      <button onClick={() => setQuickstartText("Need a SaaS landing page redesign, budget $3,500, 4 weeks. Mobile responsive with CMS.")} className="text-xs font-mono bg-[#00FF73]/10 text-[#00FF73] border border-[#00FF73]/20 px-3 py-1.5 rounded-full hover:bg-[#00FF73]/20 transition-colors">Web design</button>
                      <button onClick={() => setQuickstartText("Need an iOS app for my coffee shop. Budget $5k. Needs loyalty program.")} className="text-xs font-mono bg-[#00FF73]/10 text-[#00FF73] border border-[#00FF73]/20 px-3 py-1.5 rounded-full hover:bg-[#00FF73]/20 transition-colors">App dev</button>
                    </div>
                  </div>
                  <textarea 
                    value={quickstartText}
                    onChange={(e) => setQuickstartText(e.target.value)}
                    placeholder='e.g. "Need a SaaS landing page, budget $3,500, 4 weeks timeline..."'
                    className="w-full min-h-[160px] bg-transparent resize-none outline-none p-6 text-white placeholder:text-[#516259] text-lg leading-relaxed focus:ring-0"
                  />
                  <div className="bg-[#0B1410] border-t border-[#00DC5A]/10 px-5 py-4 flex justify-between items-center flex-wrap gap-4">
                    <span className="text-base text-[#8FAD96] font-medium italic">Generate your first deal package in seconds.</span>
                    <Button 
                      onClick={handleGenerate} 
                      disabled={isGenerating || showSignupPrompt || !quickstartText.trim()}
                      className="rounded-full font-bold shadow-[0_0_20px_rgba(0,255,115,0.2)] h-12 px-8 transition-all bg-[#00FF73] text-black hover:bg-[#00DD62] text-base"
                    >
                      {isGenerating ? (
                        <>
                          <div className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2" />
                          Generating...
                        </>
                      ) : showSignupPrompt ? (
                        <>
                          <Check className="mr-2 h-5 w-5" /> Ready!
                        </>
                      ) : (
                        <>
                          <Zap className="mr-2 h-5 w-5 fill-current" /> Generate Deal Package
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                
                <AnimatePresence>
                  {showSignupPrompt && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10, height: 0 }} 
                      animate={{ opacity: 1, y: 0, height: "auto" }} 
                      className="mt-6 p-6 bg-[#00FF73]/10 border border-[#00FF73]/30 rounded-xl text-center flex flex-col items-center shadow-lg overflow-hidden backdrop-blur-md"
                    >
                      <p className="text-lg font-bold text-white mb-4 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-[#00FF73] mr-2" />
                        Your proposal, contract, and invoice are ready!
                      </p>
                      <Link href="/dashboard">
                        <Button className="rounded-full shadow-[0_0_20px_rgba(0,255,115,0.3)] font-bold px-8 h-12 hover:scale-105 transition-transform bg-[#00FF73] text-black border-0 hover:bg-[#00DD62] text-base">
                          Sign in to view your package <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              
              <motion.div variants={fadeIn} className="pt-8 flex flex-wrap items-center justify-center gap-8 text-sm text-[#8FAD96] font-semibold">
                <div className="flex items-center"><Check className="text-[#00FF73] h-4 w-4 mr-2"/> No Credit Card Required</div>
                <div className="flex items-center"><Check className="text-[#00FF73] h-4 w-4 mr-2"/> Generates in 60 seconds</div>
                <div className="flex items-center"><Check className="text-[#00FF73] h-4 w-4 mr-2"/> Stripe Integrated</div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* THE PROBLEM VS SOLUTION */}
        <section className="w-full py-24 bg-[#0B1410] relative border-b border-[#00DC5A]/10">
          <div className="container px-4 md:px-6 mx-auto">
             <div className="grid md:grid-cols-2 gap-16 items-center">
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className="space-y-8"
                >
                  <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-white">The old way is costing you money.</h2>
                  <p className="text-[#8FAD96] text-lg font-medium leading-relaxed">
                    When a lead emails you asking for a website or service, every hour you wait to send a proposal drops your close rate by 10%.
                  </p>
                  <ul className="space-y-6">
                    <li className="flex items-start bg-[#101D16] p-4 rounded-xl border border-red-500/10">
                      <div className="h-8 w-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center shrink-0 mr-4 font-bold">✕</div>
                      <span className="text-[#DFF0E5] font-medium pt-1">Wasting 2 hours duplicating Google Docs.</span>
                    </li>
                    <li className="flex items-start bg-[#101D16] p-4 rounded-xl border border-red-500/10">
                      <div className="h-8 w-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center shrink-0 mr-4 font-bold">✕</div>
                      <span className="text-[#DFF0E5] font-medium pt-1">Forgetting to add revision limits and suffering scope creep.</span>
                    </li>
                    <li className="flex items-start bg-[#101D16] p-4 rounded-xl border border-red-500/10">
                      <div className="h-8 w-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center shrink-0 mr-4 font-bold">✕</div>
                      <span className="text-[#DFF0E5] font-medium pt-1">Undercharging because you didn&apos;t check the current market rates.</span>
                    </li>
                  </ul>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="bg-[#101D16] border-[#00FF73]/20 shadow-[0_0_50px_rgba(0,255,115,0.1)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#00FF73]/10 rounded-bl-full blur-xl -z-10"></div>
                    <CardContent className="p-10 space-y-8 relative z-10">
                      <h3 className="text-3xl font-extrabold text-[#00FF73] flex items-center">
                        <Zap className="mr-3 h-8 w-8 fill-current" /> The AI Way
                      </h3>
                      <ul className="space-y-6">
                      <li className="flex items-start">
                        <div className="h-8 w-8 rounded-full bg-[#00FF73]/20 text-[#00FF73] flex items-center justify-center shrink-0 mr-4"><Check className="h-5 w-5 stroke-[3]"/></div>
                        <span className="font-semibold text-white text-lg pt-0.5">Paste their messy email into the app.</span>
                      </li>
                      <li className="flex items-start">
                        <div className="h-8 w-8 rounded-full bg-[#00FF73]/20 text-[#00FF73] flex items-center justify-center shrink-0 mr-4"><Check className="h-5 w-5 stroke-[3]"/></div>
                        <span className="font-semibold text-white text-lg pt-0.5">AI instantly drafts a perfect proposal and contract.</span>
                      </li>
                      <li className="flex items-start">
                        <div className="h-8 w-8 rounded-full bg-[#00FF73]/20 text-[#00FF73] flex items-center justify-center shrink-0 mr-4"><Check className="h-5 w-5 stroke-[3]"/></div>
                        <span className="font-semibold text-white text-lg pt-0.5">AI analyzes the deal for risks (like vague deadlines).</span>
                      </li>
                      <li className="flex items-start">
                        <div className="h-8 w-8 rounded-full bg-[#00FF73]/20 text-[#00FF73] flex items-center justify-center shrink-0 mr-4"><Check className="h-5 w-5 stroke-[3]"/></div>
                        <span className="font-semibold text-white text-lg pt-0.5">Send a beautiful client portal link in under 60 seconds.</span>
                      </li>
                    </ul>
                    </CardContent>
                  </Card>
                </motion.div>
             </div>
          </div>
        </section>

        {/* EXAMPLE / SEE THE MAGIC */}
        <section id="example" className="w-full py-24 md:py-32 bg-background relative border-b border-border/40 overflow-hidden">
           <div className="container px-4 md:px-6 mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16 space-y-4"
            >
              <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl">See the magic in action</h2>
              <p className="text-xl text-muted-foreground max-w-[800px] mx-auto font-medium">
                Watch how we transform a chaotic client email into a structured, persuasive, and legally sound deal package.
              </p>
            </motion.div>

            <div className="max-w-5xl mx-auto space-y-16">
              <div className="grid md:grid-cols-2 gap-10 items-stretch">
                {/* Left: Client Input */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-wider pl-2">
                    <MessageSquare className="h-4 w-4" /> 1. Client Email Input
                  </div>
                  <Card className="border border-border/60 shadow-sm bg-muted/40 h-full">
                    <CardContent className="p-6 font-mono text-sm text-foreground/80 leading-relaxed h-full">
                      &quot;Hey there! We need a new website for our landscaping business. 
                      <br/><br/>
                      Our current one is from 2010. We want 5 pages (Home, About, Services, Gallery, Contact), a blog, and a contact form that emails us. 
                      <br/><br/>
                      We also need it to rank #1 on Google for &apos;Boston Landscaping&apos;. Our budget is around $1,500 and we need it live next week because our busy season is starting. 
                      <br/><br/>
                      Is this possible?&quot;
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Right: AI Output (Proposal) */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 text-sm font-bold text-primary uppercase tracking-wider pl-2">
                    <BrainCircuit className="h-4 w-4 animate-pulse" /> 2. AI Proposal Generated
                  </div>
                  <Card className="border-l-4 border-l-primary shadow-lg bg-card/60 backdrop-blur-md relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
                    <CardContent className="p-6 flex flex-col justify-center h-full">
                      <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 pointer-events-none w-fit">Exec Summary</Badge>
                      <h4 className="font-serif text-xl font-bold mb-3 group-hover:text-primary transition-colors">Acme Landscaping Website Redesign</h4>
                      <p className="text-base text-muted-foreground leading-relaxed font-medium">
                        We will construct a modern, high-converting 5-page website featuring a dynamic project gallery and an automated lead-generation contact form. The site will be built with a scalable CMS to manage your new blog effortlessly.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Bottom: Deal Doctor Full Width */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.5, duration: 0.6, type: "spring", bounce: 0.4 }}
                className="space-y-4 pt-8 border-t border-border/40"
              >
                <div className="flex items-center justify-center gap-2 text-sm font-bold text-amber-500 uppercase tracking-wider pl-2 mb-6">
                  <ShieldAlert className="h-5 w-5" /> 3. Deal Doctor Catches Scope Creep
                </div>
                
                <Card className="shadow-2xl bg-background border-2 border-border/50 relative overflow-hidden group transition-all duration-500 max-w-4xl mx-auto hover:shadow-primary/5 hover:border-primary/20">
                  <div className="bg-muted/40 border-b border-border/40 px-5 py-4 flex justify-between items-center">
                    <span className="text-sm font-bold text-foreground flex items-center">
                      <FileText className="h-5 w-5 mr-2" /> Contract.pdf
                    </span>
                    <Badge variant="outline" className="border-amber-500/30 text-amber-600 bg-amber-500/10 font-mono text-xs px-3 py-1">
                      <ShieldAlert className="h-4 w-4 mr-1.5" /> Scope Protection Active
                    </Badge>
                  </div>
                  <CardContent className="p-8 font-serif text-lg leading-loose text-muted-foreground md:p-10">
                    <p>
                      ...The Service Provider agrees to complete all revisions requested by the Client until the Client is fully satisfied. The project shall continue until the Client approves the final deliverable, with{" "}
                      <span className={`px-2 py-0.5 rounded transition-colors duration-500 ${isContractFixed ? "bg-emerald-500/20 text-emerald-800 border-b-4 border-emerald-500 font-medium" : "bg-amber-500/20 text-amber-800 border-b-4 border-amber-500 cursor-pointer shadow-sm"}`}>
                        {isContractFixed ? "a maximum of 3 revision rounds. Additional revisions billed at $90/hr." : "no defined revision limit or timeline."}
                      </span>
                      {" "}All work remains property of the Service Provider until payment is received in full...
                    </p>
                  </CardContent>
                  
                  <AnimatePresence mode="wait">
                    {!isContractFixed ? (
                      <motion.div 
                        key="alert"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20, height: 0 }}
                        className="m-6 mt-0 bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 shadow-inner"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <ShieldAlert className="h-6 w-6 text-amber-600" />
                            <span className="text-base font-bold text-amber-700">Unlimited revisions risk</span>
                          </div>
                          <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-700 px-3 py-1 rounded-full">HIGH RISK</span>
                        </div>
                        <p className="text-sm text-amber-800/80 mb-4 font-sans font-medium">This clause traps you in endless revisions with no extra pay. Clients can demand infinite changes.</p>
                        <div className="flex items-center gap-3 bg-background border border-border/50 rounded-lg p-3 font-sans shadow-sm">
                          <span className="text-xs font-bold text-primary font-mono shrink-0 px-2 py-1 bg-primary/10 rounded">AI FIX →</span>
                          <span className="text-sm text-foreground/80 flex-1 truncate font-medium">&quot;Includes 3 rounds of revisions...&quot;</span>
                          <Button onClick={() => setIsContractFixed(true)} className="h-9 px-5 rounded-full hover:scale-105 transition-transform font-bold shadow-md">Apply Fix</Button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="fixed"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="m-6 mt-0 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center justify-between font-sans shadow-inner"
                      >
                        <div className="flex items-center gap-3">
                          <ShieldCheck className="h-6 w-6 text-emerald-600" />
                          <span className="text-base font-bold text-emerald-700">Scope secured. Revisions limited.</span>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => setIsContractFixed(false)} className="text-xs text-emerald-700 hover:text-emerald-800 hover:bg-emerald-500/20 px-4 rounded-full font-bold">Undo</Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            </div>
           </div>
        </section>

        {/* DETAILED FEATURES SECTION */}
        <section id="features" className="w-full py-24 md:py-32 bg-muted/20 relative border-b border-border/40">
          <div className="container px-4 md:px-6 mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20 space-y-4"
            >
              <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl">Everything you need to run your freelance business</h2>
              <p className="text-xl text-muted-foreground max-w-[800px] mx-auto font-medium">
                We&apos;ve built an entire suite of tools specifically designed to protect you and help you earn more.
              </p>
            </motion.div>
            
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {/* Feature 1 */}
              <motion.div variants={fadeIn} className="space-y-4 p-6 bg-background rounded-2xl border shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 group">
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">AI Proposals</h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                  Stop writing from scratch. Our AI structures a highly persuasive proposal with an executive summary, clear deliverables, project phases, and a call-to-action that gets clients to say &quot;yes&quot;.
                </p>
              </motion.div>

              {/* Feature 2 */}
              <motion.div variants={fadeIn} className="space-y-4 p-6 bg-background rounded-2xl border shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 group">
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Bulletproof Contracts</h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                  Our contract generator acts like a senior agency lawyer. It automatically injects clauses to limit revisions, define ownership, protect against scope creep, and enforce late payment fees.
                </p>
              </motion.div>

              {/* Feature 3 */}
              <motion.div variants={fadeIn} className="space-y-4 p-6 bg-background rounded-2xl border shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 group">
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Deal Doctor Analysis</h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                  Before you send a quote, our AI gives the project a "Risk Score". It flags toxic client requests, highlights vague requirements that will burn you later, and suggests exactly how to mitigate them.
                </p>
              </motion.div>

              {/* Feature 4 */}
              <motion.div variants={fadeIn} className="space-y-4 p-6 bg-background rounded-2xl border shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 group">
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Pricing Intelligence</h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                  Are you leaving money on the table? Enter the service, your experience level, and client country to instantly see the Low, Average, and Premium market rates for that exact job.
                </p>
              </motion.div>

              {/* Feature 5 */}
              <motion.div variants={fadeIn} className="space-y-4 p-6 bg-background rounded-2xl border shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 group">
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
                  <Presentation className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Client Portal</h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                  Look like a premium agency. Instead of sending 3 separate PDF attachments, generate a single secure web link where the client can read the proposal, sign the contract, and pay the deposit.
                </p>
              </motion.div>

              {/* Feature 6 */}
              <motion.div variants={fadeIn} className="space-y-4 p-6 bg-background rounded-2xl border shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 group">
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Deal Pipeline</h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                  A built-in CRM dashboard to track the status of all your deals. Instantly see which proposals have been viewed, which contracts are signed, and who still owes a deposit.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* PRICING SECTION - 3 TIERS */}
        <section id="pricing" className="w-full py-24 md:py-32 bg-background border-b border-border/40">
          <div className="container px-4 md:px-6 mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl">Simple, transparent pricing</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed mx-auto font-medium">
                  Choose the plan that fits your deal flow. No hidden fees.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-3 items-center"
            >
              {/* Free Plan */}
              <motion.div variants={fadeIn} className="flex flex-col p-8 bg-background rounded-3xl border border-border/60 shadow-sm h-full hover:shadow-md transition-shadow">
                <div className="mb-4">
                  <h3 className="text-xl font-bold">Free</h3>
                  <p className="text-muted-foreground text-sm mt-2 font-medium">Try it out risk-free.</p>
                </div>
                <div className="mb-6 flex items-baseline text-4xl font-black">
                  $0<span className="text-lg font-medium text-muted-foreground ml-1">/mo</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1 font-medium">
                  <li className="flex items-center text-sm"><CheckCircle2 className="h-5 w-5 text-primary mr-3 shrink-0" /> 3 total generations</li>
                  <li className="flex items-center text-sm"><CheckCircle2 className="h-5 w-5 text-primary mr-3 shrink-0" /> Basic Proposal</li>
                  <li className="flex items-center text-sm"><CheckCircle2 className="h-5 w-5 text-primary mr-3 shrink-0" /> Basic Contract</li>
                  <li className="flex items-center text-sm"><CheckCircle2 className="h-5 w-5 text-primary mr-3 shrink-0" /> Basic Invoice</li>
                </ul>
                <Button className="w-full rounded-full font-bold" variant="outline">Get Started</Button>
              </motion.div>

              {/* Pro Plan */}
              <motion.div variants={fadeIn} className="flex flex-col p-8 bg-primary/5 rounded-3xl border-2 border-primary shadow-xl shadow-primary/10 relative h-full lg:-translate-y-4 hover:-translate-y-6 transition-transform duration-300">
                <div className="absolute top-0 right-8 transform -translate-y-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                    Most Popular
                  </span>
                </div>
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-primary">Pro</h3>
                  <p className="text-muted-foreground text-sm mt-2 font-medium">For active service providers.</p>
                </div>
                <div className="mb-6 flex items-baseline text-4xl font-black">
                  $19<span className="text-lg font-medium text-muted-foreground ml-1">/mo</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1 font-medium">
                  <li className="flex items-center text-sm"><CheckCircle2 className="h-5 w-5 text-primary mr-3 shrink-0" /> Unlimited generations</li>
                  <li className="flex items-center text-sm"><CheckCircle2 className="h-5 w-5 text-primary mr-3 shrink-0" /> Deal Doctor access</li>
                  <li className="flex items-center text-sm"><CheckCircle2 className="h-5 w-5 text-primary mr-3 shrink-0" /> Pricing Intelligence</li>
                  <li className="flex items-center text-sm"><CheckCircle2 className="h-5 w-5 text-primary mr-3 shrink-0" /> PDF Exports</li>
                  <li className="flex items-center text-sm"><CheckCircle2 className="h-5 w-5 text-primary mr-3 shrink-0" /> Client Portal</li>
                </ul>
                <Button className="w-full rounded-full font-bold shadow-md hover:shadow-lg transition-shadow">Subscribe Pro</Button>
              </motion.div>

              {/* Agency Plan */}
              <motion.div variants={fadeIn} className="flex flex-col p-8 bg-background rounded-3xl border border-border/60 shadow-sm h-full hover:shadow-md transition-shadow">
                <div className="mb-4">
                  <h3 className="text-xl font-bold">Agency</h3>
                  <p className="text-muted-foreground text-sm mt-2 font-medium">For growing teams.</p>
                </div>
                <div className="mb-6 flex items-baseline text-4xl font-black">
                  $49<span className="text-lg font-medium text-muted-foreground ml-1">/mo</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1 font-medium">
                  <li className="flex items-center text-sm"><CheckCircle2 className="h-5 w-5 text-primary mr-3 shrink-0" /> Everything in Pro</li>
                  <li className="flex items-center text-sm"><CheckCircle2 className="h-5 w-5 text-primary mr-3 shrink-0" /> Team members</li>
                  <li className="flex items-center text-sm"><CheckCircle2 className="h-5 w-5 text-primary mr-3 shrink-0" /> White-label portal</li>
                  <li className="flex items-center text-sm"><CheckCircle2 className="h-5 w-5 text-primary mr-3 shrink-0" /> Team analytics</li>
                </ul>
                <Button className="w-full rounded-full font-bold" variant="outline">Subscribe Agency</Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="w-full py-24 md:py-32 bg-primary text-primary-foreground overflow-hidden relative">
           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="container px-4 md:px-6 mx-auto relative z-10 text-center flex flex-col items-center"
          >
            <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl mb-6">Ready to close your next deal?</h2>
            <p className="max-w-[600px] md:text-xl mb-10 text-primary-foreground/90 font-medium">
              Stop wasting hours formatting documents and manually researching market rates. Jump in and see the magic for yourself.
            </p>
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="rounded-full h-14 px-10 text-lg font-bold shadow-xl hover:scale-105 transition-transform duration-300">
                Start For Free
              </Button>
            </Link>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-border/40 py-12 bg-background">
        <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
             <Presentation className="h-5 w-5 text-primary mr-2" />
            <span className="font-bold">ProposalFlow AI</span>
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            © {new Date().getFullYear()} ProposalFlow AI. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link className="text-sm text-muted-foreground font-medium hover:text-foreground transition-colors" href="#">
              Terms
            </Link>
            <Link className="text-sm text-muted-foreground font-medium hover:text-foreground transition-colors" href="#">
              Privacy
            </Link>
            <Link className="text-sm text-muted-foreground font-medium hover:text-foreground transition-colors" href="#">
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
