"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Send, Edit, Save, FileText, FileSignature, Receipt, ShieldAlert, ShieldCheck, Sparkles, TrendingUp, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { useBrand } from "@/components/BrandContext";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";

export default function ProposalPackagePage() {
  const { id } = useParams();
  const { brand, formatCurrency } = useBrand();
  
  const [deal, setDeal] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<"proposal" | "contract" | "invoice">("proposal");
  const [isEditing, setIsEditing] = useState(false);
  const [isContractFixed, setIsContractFixed] = useState(false);

  const [proposalContent, setProposalContent] = useState("");
  const [contractContentBefore, setContractContentBefore] = useState("");
  const [invoiceItems, setInvoiceItems] = useState<any[]>([]);
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    async function fetchDeal() {
      if (!id) return;
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .eq('id', id)
        .single();
        
      if (data) {
        setDeal(data);
        setProposalContent(data.proposal_content || "No proposal content generated.");
        setContractContentBefore(data.contract_content || "Standard terms apply.");
        const items = data.invoice_items || [];
        setInvoiceItems(items);
        
        // Naive sum of invoice items
        const sum = items.reduce((acc: number, item: any) => acc + (Number(item.price) || 0), 0);
        setTotalValue(sum);
      } else if (error) {
        console.error(error);
      }
      setIsLoading(false);
    }
    fetchDeal();
  }, [id]);

  // Market average data for Pricing Intelligence
  const marketAverage = 8500;
  const isUndercharging = totalValue > 0 && totalValue < marketAverage;
  const difference = marketAverage - totalValue;
  const underchargePercentage = Math.round((difference / marketAverage) * 100);

  const contractContentAfter = `...The Service Provider agrees to complete all revisions requested by the Client until the Client is fully satisfied. The project shall continue until the Client approves the final deliverable, with a maximum of 3 revision rounds. Additional revisions billed at $90/hr. All work remains property of the Service Provider until payment is received in full...`;

  const handleExportPDF = () => {
    window.print();
  };

  const saveProposal = async () => {
    setIsEditing(false);
    if (!deal) return;
    await supabase.from('deals').update({ proposal_content: proposalContent }).eq('id', deal.id);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-6rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-6rem)]">
        <p className="text-muted-foreground">Deal not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto h-[calc(100vh-6rem)] print:h-auto">
      {/* Header (Hidden when printing) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between shrink-0 gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/deals">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
                <Sparkles className="mr-1 h-3 w-3" /> AI Deal Package
              </Badge>
              <Badge variant="secondary">{deal.status}</Badge>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">{deal.client_name} - {deal.project_type}</h1>
          </div>
        </div>
        <div className="flex gap-2">
          {activeTab === "proposal" && (
            isEditing ? (
              <Button onClick={saveProposal} variant="secondary">
                <Save className="mr-2 h-4 w-4" /> Save
              </Button>
            ) : (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
            )
          )}
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="mr-2 h-4 w-4" /> Export All PDFs
          </Button>
          <Button className="shadow-lg shadow-primary/20" style={{ backgroundColor: brand.themeColor }}>
            <Send className="mr-2 h-4 w-4" /> Share via Portal
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0 print:block print:h-auto">
        
        {/* Left Sidebar Tabs (Hidden when printing) */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-2 print:hidden">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-2">Documents</p>
          <button
            onClick={() => setActiveTab("proposal")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === "proposal" ? "text-primary-foreground shadow-md" : "hover:bg-muted text-muted-foreground"}`}
            style={activeTab === "proposal" ? { backgroundColor: brand.themeColor } : {}}
          >
            <FileText className="h-4 w-4" /> Proposal
          </button>
          
          <button
            onClick={() => setActiveTab("contract")}
            className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === "contract" ? "text-primary-foreground shadow-md" : "hover:bg-muted text-muted-foreground"}`}
            style={activeTab === "contract" ? { backgroundColor: brand.themeColor } : {}}
          >
            <div className="flex items-center gap-3">
              <FileSignature className="h-4 w-4" /> Contract
            </div>
            {!isContractFixed && <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />}
          </button>
          
          <button
            onClick={() => setActiveTab("invoice")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === "invoice" ? "text-primary-foreground shadow-md" : "hover:bg-muted text-muted-foreground"}`}
            style={activeTab === "invoice" ? { backgroundColor: brand.themeColor } : {}}
          >
            <Receipt className="h-4 w-4" /> Invoice
          </button>
        </div>

        {/* Document Viewer */}
        <Card className="flex-1 overflow-hidden flex flex-col bg-muted/30 shadow-inner border-border/50 print:border-none print:shadow-none print:bg-white print:overflow-visible">
          <CardContent className="flex-1 overflow-y-auto p-0 relative print:overflow-visible">
            <AnimatePresence mode="wait">
              
              {/* PROPOSAL TAB */}
              {(activeTab === "proposal" || typeof window !== 'undefined' && window.matchMedia('print').matches) && (
                <motion.div 
                  key="proposal" 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="min-h-full p-6 md:p-12 print:p-0"
                >
                  <div className="bg-background max-w-3xl mx-auto min-h-full p-10 md:p-16 rounded-sm shadow-sm border whitespace-pre-wrap font-serif text-sm leading-relaxed text-foreground/90 print:shadow-none print:border-none">
                    {/* Inject Brand Header for PDF Export */}
                    <div className="hidden print:block mb-10 pb-6 border-b">
                      <h1 className="text-4xl font-bold" style={{ color: brand.themeColor }}>{brand.companyName}</h1>
                      <p className="text-muted-foreground mt-2">{brand.email}</p>
                    </div>

                    {isEditing ? (
                      <Textarea
                        value={proposalContent}
                        onChange={(e) => setProposalContent(e.target.value)}
                        className="min-h-[600px] border-0 focus-visible:ring-0 p-0 resize-none bg-transparent font-serif text-sm leading-relaxed"
                      />
                    ) : (
                      proposalContent
                    )}
                  </div>
                </motion.div>
              )}

              {/* CONTRACT TAB */}
              {activeTab === "contract" && (
                <motion.div 
                  key="contract" 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="min-h-full p-6 md:p-12 print:p-0"
                >
                  <div className="bg-background max-w-3xl mx-auto p-10 md:p-16 rounded-sm shadow-sm border font-serif text-sm leading-loose text-foreground/90 relative print:shadow-none print:border-none">
                    <div className="hidden print:block mb-10 pb-6 border-b">
                      <h1 className="text-4xl font-bold" style={{ color: brand.themeColor }}>{brand.companyName}</h1>
                      <p className="text-muted-foreground mt-2">{brand.email}</p>
                    </div>

                    <h2 className="text-xl font-bold mb-6 text-foreground">Master Services Agreement</h2>
                    <p className="mb-4">This Master Services Agreement is entered into by and between {deal.client_name} (&quot;Client&quot;) and {brand.companyName} (&quot;Service Provider&quot;)...</p>
                    
                    <div className={`p-1 -mx-1 rounded transition-colors duration-500 ${!isContractFixed ? "bg-amber-500/10 border-b-2 border-amber-500/50" : "bg-emerald-500/10 border-b-2 border-emerald-500/50"}`}>
                      {isContractFixed ? contractContentAfter : contractContentBefore}
                    </div>
                    
                    <p className="mt-4">The Client agrees to provide all necessary assets within 48 hours of request. Delays by the Client may result in timeline extensions...</p>
                    <p className="mt-4">Payment terms are Net 15. Late payments will incur a 1.5% monthly fee...</p>

                    {/* Deal Doctor Floating Widget (Hidden on Print) */}
                    <div className="print:hidden">
                      <AnimatePresence mode="wait">
                        {!isContractFixed ? (
                          <motion.div 
                            key="alert"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20, height: 0 }}
                            className="mt-10 bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 shadow-inner font-sans"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-3">
                                <ShieldAlert className="h-5 w-5 text-amber-600" />
                                <span className="text-sm font-bold text-amber-700">Scope Creep Risk Detected</span>
                              </div>
                              <Badge variant="outline" className="border-amber-500/30 text-amber-700 bg-amber-500/20 text-[10px]">HIGH RISK</Badge>
                            </div>
                            <p className="text-sm text-amber-800/80 mb-4 font-medium">The highlighted clause traps you in endless revisions with no extra pay. Clients can demand infinite changes.</p>
                            <div className="flex items-center gap-3 bg-background border border-border/50 rounded-lg p-3 shadow-sm">
                              <span className="text-xs font-bold text-primary font-mono shrink-0 px-2 py-1 bg-primary/10 rounded">AI FIX →</span>
                              <span className="text-sm text-foreground/80 flex-1 truncate font-medium">&quot;Includes 3 rounds of revisions...&quot;</span>
                              <Button onClick={() => setIsContractFixed(true)} size="sm" className="h-8 px-4 rounded-full font-bold shadow-md">Apply Fix</Button>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div 
                            key="fixed"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center justify-between font-sans shadow-inner"
                          >
                            <div className="flex items-center gap-3">
                              <ShieldCheck className="h-5 w-5 text-emerald-600" />
                              <span className="text-sm font-bold text-emerald-700">Scope secured. Revisions limited.</span>
                            </div>
                            <Button size="sm" variant="ghost" onClick={() => setIsContractFixed(false)} className="text-xs text-emerald-700 hover:text-emerald-800 hover:bg-emerald-500/20 px-4 rounded-full font-bold">Undo</Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* INVOICE TAB */}
              {activeTab === "invoice" && (
                <motion.div 
                  key="invoice" 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="min-h-full p-6 md:p-12 flex flex-col items-center print:p-0"
                >
                  <div className="bg-background w-full max-w-2xl p-10 rounded-sm shadow-sm border font-sans text-foreground/90 print:shadow-none print:border-none">
                    <div className="flex justify-between items-start mb-12">
                      <div>
                        <h2 className="text-3xl font-black text-muted-foreground/30 uppercase tracking-widest mb-2">Invoice</h2>
                        <p className="text-sm font-bold">INV-{new Date().getFullYear()}-{deal.id.split('-')[0]}</p>
                        <p className="text-sm text-muted-foreground mt-1">Due: {new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg" style={{ color: brand.themeColor }}>{brand.companyName}</p>
                        <p className="text-sm text-muted-foreground">{brand.email}</p>
                      </div>
                    </div>

                    <div className="mb-10">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Billed To</p>
                      <p className="font-bold">{deal.client_name}</p>
                      {deal.client_email && <p className="text-sm text-muted-foreground">{deal.client_email}</p>}
                    </div>

                    <table className="w-full text-sm mb-8">
                      <thead>
                        <tr className="border-b border-border/50">
                          <th className="text-left font-bold text-muted-foreground pb-3">Description</th>
                          <th className="text-right font-bold text-muted-foreground pb-3">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoiceItems.map((item: any, i: number) => (
                          <tr key={i} className="border-b border-border/30">
                            <td className="py-4 font-medium">{item.desc}</td>
                            <td className="py-4 text-right">{formatCurrency(item.price)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="flex justify-end mb-10">
                      <div className="w-64">
                        <div className="flex justify-between py-2 text-sm text-muted-foreground">
                          <span>Subtotal</span>
                          <span>{formatCurrency(totalValue)}</span>
                        </div>
                        <div className="flex justify-between py-4 border-t-2 text-xl font-bold" style={{ borderColor: brand.themeColor }}>
                          <span>Total</span>
                          <span>{formatCurrency(totalValue)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing Intelligence Widget (Hidden on Print) */}
                    {isUndercharging && (
                      <div className="print:hidden mt-8">
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 shadow-inner"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                <TrendingUp className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-bold text-blue-900">Pricing Intelligence</h3>
                                <p className="text-xs text-blue-800/70">Based on 1,400 similar web design projects.</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="border-blue-500/30 text-blue-700 bg-blue-500/20">Market Data</Badge>
                          </div>
                          
                          <div className="space-y-4">
                            <p className="text-sm text-blue-900/80 leading-relaxed font-medium">
                              You are charging <strong className="text-blue-700">{formatCurrency(totalValue)}</strong> for this scope. The market average for this exact deliverable is <strong className="text-blue-700">{formatCurrency(marketAverage)}</strong>.
                            </p>
                            
                            <div className="bg-background rounded-lg p-4 border border-border/50">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Your Price</span>
                                <span className="text-sm font-bold">{formatCurrency(totalValue)}</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2.5 mb-4">
                                <div className="bg-blue-400 h-2.5 rounded-full" style={{ width: "45%" }}></div>
                              </div>
                              
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Market Average</span>
                                <span className="text-sm font-bold">{formatCurrency(marketAverage)}</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2.5">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "100%" }}></div>
                              </div>
                            </div>

                            <p className="text-sm text-blue-900/80 font-medium">
                              You might be undercharging by <strong className="text-red-500">{underchargePercentage}%</strong>. Consider increasing your estimate before sending!
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
