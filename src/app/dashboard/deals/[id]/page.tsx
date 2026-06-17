"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Send, Edit, Save, FileText, FileSignature, Receipt, ShieldAlert, ShieldCheck, Sparkles, TrendingUp, Loader2, LayoutDashboard, ExternalLink, CreditCard, Activity, User, Clock } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { useBrand } from "@/components/BrandContext";
import { supabase } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { sendProposalEmailAction, sendFollowUpEmailAction } from "@/app/actions/email";

type TabType = "overview" | "proposal" | "contract" | "invoice" | "portal" | "payments" | "activity";

export default function DealPackagePage() {
  const { id } = useParams();
  const { brand, formatCurrency } = useBrand();
  
  const [deal, setDeal] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<TabType>("overview");
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

      const { data: logsData } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('deal_id', id)
        .order('created_at', { ascending: false });
        
      if (logsData) {
        setLogs(logsData);
      }

      setIsLoading(false);
    }
    fetchDeal();
  }, [id]);

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
    <div className="flex flex-col gap-6 max-w-7xl mx-auto h-[calc(100vh-6rem)] print:h-auto">
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
                <Sparkles className="mr-1 h-3 w-3" /> Deal Management
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
          {(activeTab === "proposal" || activeTab === "contract" || activeTab === "invoice") && (
            <Button variant="outline" onClick={handleExportPDF}>
              <Download className="mr-2 h-4 w-4" /> Export PDF
            </Button>
          )}
          <Button 
            className="shadow-lg shadow-primary/20" 
            style={{ backgroundColor: brand.themeColor }}
            onClick={async () => {
              if (!deal) return;
              const portalUrl = `${window.location.origin}/portal/${deal.id}`;
              const res = await sendProposalEmailAction(deal.id, deal.client_email, deal.client_name, portalUrl);
              if (res.success) {
                alert("Proposal sent successfully!");
                // Refresh to show status change
                window.location.reload();
              } else {
                alert(`Error: ${res.error}`);
              }
            }}
          >
            <Send className="mr-2 h-4 w-4" /> Share via Portal
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0 print:block print:h-auto">
        
        {/* Left Sidebar Tabs (Hidden when printing) */}
        <div className="w-full md:w-56 shrink-0 flex flex-col gap-1 print:hidden border-r pr-4">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 px-2">Management</p>
          
          <button onClick={() => setActiveTab("overview")} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "overview" ? "text-primary-foreground shadow-sm" : "hover:bg-muted text-muted-foreground"}`} style={activeTab === "overview" ? { backgroundColor: brand.themeColor } : {}}>
            <LayoutDashboard className="h-4 w-4" /> Overview
          </button>
          
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-4 mb-2 px-2">Documents</p>
          
          <button onClick={() => setActiveTab("proposal")} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "proposal" ? "text-primary-foreground shadow-sm" : "hover:bg-muted text-muted-foreground"}`} style={activeTab === "proposal" ? { backgroundColor: brand.themeColor } : {}}>
            <FileText className="h-4 w-4" /> Proposal
          </button>
          
          <button onClick={() => setActiveTab("contract")} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "contract" ? "text-primary-foreground shadow-sm" : "hover:bg-muted text-muted-foreground"}`} style={activeTab === "contract" ? { backgroundColor: brand.themeColor } : {}}>
            <FileSignature className="h-4 w-4" /> Contract
          </button>
          
          <button onClick={() => setActiveTab("invoice")} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "invoice" ? "text-primary-foreground shadow-sm" : "hover:bg-muted text-muted-foreground"}`} style={activeTab === "invoice" ? { backgroundColor: brand.themeColor } : {}}>
            <Receipt className="h-4 w-4" /> Invoice
          </button>
          
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-4 mb-2 px-2">Operations</p>
          
          <button onClick={() => setActiveTab("portal")} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "portal" ? "text-primary-foreground shadow-sm" : "hover:bg-muted text-muted-foreground"}`} style={activeTab === "portal" ? { backgroundColor: brand.themeColor } : {}}>
            <ExternalLink className="h-4 w-4" /> Client Portal
          </button>
          
          <button onClick={() => setActiveTab("payments")} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "payments" ? "text-primary-foreground shadow-sm" : "hover:bg-muted text-muted-foreground"}`} style={activeTab === "payments" ? { backgroundColor: brand.themeColor } : {}}>
            <CreditCard className="h-4 w-4" /> Payments
          </button>

          <button onClick={() => setActiveTab("activity")} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "activity" ? "text-primary-foreground shadow-sm" : "hover:bg-muted text-muted-foreground"}`} style={activeTab === "activity" ? { backgroundColor: brand.themeColor } : {}}>
            <Activity className="h-4 w-4" /> Activity Log
          </button>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 overflow-hidden flex flex-col bg-muted/20 rounded-xl border border-border/50 shadow-inner print:border-none print:shadow-none print:bg-white print:overflow-visible">
          <div className="flex-1 overflow-y-auto p-0 relative print:overflow-visible">
            <AnimatePresence mode="wait">
              
              {/* OVERVIEW TAB */}
              {activeTab === "overview" && (
                <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-6 md:p-8 space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2">
                      <CardHeader>
                        <CardTitle>Deal Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Client Name</p>
                            <p className="font-semibold">{deal.client_name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Client Email</p>
                            <p className="font-semibold">{deal.client_email}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Project Type</p>
                            <p className="font-semibold">{deal.project_type}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Budget</p>
                            <p className="font-semibold">{formatCurrency(deal.budget)}</p>
                          </div>
                        </div>
                        <div className="pt-4 border-t">
                          <p className="text-sm text-muted-foreground mb-2">Original Brief</p>
                          <div className="bg-muted p-4 rounded-md text-sm">{deal.brief_text}</div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="space-y-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-muted-foreground">Deal Doctor Risk</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-end gap-2">
                            <span className="text-4xl font-black text-green-500">{deal.risk_score || 92}</span>
                            <span className="text-sm text-muted-foreground mb-1">/ 100</span>
                          </div>
                          <Badge variant="outline" className="mt-2 text-green-500">{deal.risk_level || 'Low Risk'}</Badge>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-muted-foreground">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <Button variant="outline" className="w-full justify-start" onClick={async () => {
                            if (!deal) return;
                            const portalUrl = `${window.location.origin}/portal/${deal.id}`;
                            const res = await sendFollowUpEmailAction(deal.id, deal.client_email, deal.client_name, portalUrl);
                            if (res.success) {
                              alert("Reminder sent!");
                              window.location.reload();
                            } else {
                              alert(`Error: ${res.error}`);
                            }
                          }}>
                            <Send className="mr-2 h-4 w-4" /> Send Reminder
                          </Button>
                          <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("invoice")}>
                            <Receipt className="mr-2 h-4 w-4" /> Edit Invoice
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* PROPOSAL TAB */}
              {(activeTab === "proposal" || typeof window !== 'undefined' && window.matchMedia('print').matches) && (
                <motion.div key="proposal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="min-h-full p-6 md:p-8 print:p-0">
                  <div className="bg-background max-w-3xl mx-auto min-h-full p-10 md:p-16 rounded-sm shadow-sm border whitespace-pre-wrap font-serif text-sm leading-relaxed text-foreground/90 print:shadow-none print:border-none">
                    <div className="hidden print:block mb-10 pb-6 border-b">
                      <h1 className="text-4xl font-bold" style={{ color: brand.themeColor }}>{brand.companyName}</h1>
                      <p className="text-muted-foreground mt-2">{brand.email}</p>
                    </div>

                    {isEditing ? (
                      <Textarea value={proposalContent} onChange={(e) => setProposalContent(e.target.value)} className="min-h-[600px] border-0 focus-visible:ring-0 p-0 resize-none bg-transparent font-serif text-sm leading-relaxed" />
                    ) : (
                      proposalContent
                    )}
                  </div>
                </motion.div>
              )}

              {/* CONTRACT TAB */}
              {activeTab === "contract" && (
                <motion.div key="contract" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="min-h-full p-6 md:p-8 print:p-0">
                  <div className="bg-background max-w-3xl mx-auto p-10 md:p-16 rounded-sm shadow-sm border font-serif text-sm leading-loose text-foreground/90 relative print:shadow-none print:border-none">
                    <div className="hidden print:block mb-10 pb-6 border-b">
                      <h1 className="text-4xl font-bold" style={{ color: brand.themeColor }}>{brand.companyName}</h1>
                      <p className="text-muted-foreground mt-2">{brand.email}</p>
                    </div>
                    <h2 className="text-xl font-bold mb-6 text-foreground">Master Services Agreement</h2>
                    <div className="whitespace-pre-wrap">{contractContentBefore}</div>
                  </div>
                </motion.div>
              )}

              {/* INVOICE TAB */}
              {activeTab === "invoice" && (
                <motion.div key="invoice" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="min-h-full p-6 md:p-8 flex flex-col items-center print:p-0">
                  <div className="bg-background w-full max-w-2xl p-10 rounded-sm shadow-sm border font-sans text-foreground/90 print:shadow-none print:border-none">
                    <div className="flex justify-between items-start mb-12">
                      <div>
                        <h2 className="text-3xl font-black text-muted-foreground/30 uppercase tracking-widest mb-2">Invoice</h2>
                        <p className="text-sm font-bold">INV-{new Date().getFullYear()}-{deal.id.split('-')[0]}</p>
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
                        <div className="flex justify-between py-4 border-t-2 text-xl font-bold" style={{ borderColor: brand.themeColor }}>
                          <span>Total</span>
                          <span>{formatCurrency(totalValue)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* PORTAL TAB */}
              {activeTab === "portal" && (
                <motion.div key="portal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-6 md:p-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Client Portal Link</CardTitle>
                      <CardDescription>Share this secure link with your client to view and sign.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex gap-2">
                        <input readOnly value={`${window.location.origin}/portal/${deal.id}`} className="flex-1 bg-muted px-4 py-2 rounded-md font-mono text-sm" />
                        <Button onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/portal/${deal.id}`);
                          alert("Copied!");
                        }}>Copy Link</Button>
                      </div>
                      
                      <div className="border-t pt-6">
                        <h3 className="font-bold text-sm mb-2">Automated Follow-Up</h3>
                        <p className="text-sm text-muted-foreground mb-4">Send a polite nudge since the status is "{deal.status}".</p>
                        <Textarea className="font-serif text-sm h-32" defaultValue={`Hi ${deal.client_name.split(' ')[0]},\n\nJust checking in to see if you had any questions about the proposal I sent over for the ${deal.project_type} project? \n\nBest,\n${brand.userName}`} />
                        <Button className="mt-4" onClick={async () => {
                          if (!deal) return;
                          const portalUrl = `${window.location.origin}/portal/${deal.id}`;
                          const res = await sendFollowUpEmailAction(deal.id, deal.client_email, deal.client_name, portalUrl);
                          if (res.success) {
                            alert("Follow-up sent via Resend!");
                            window.location.reload();
                          } else {
                            alert(`Error: ${res.error}`);
                          }
                        }}>Send Email via Resend</Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* PAYMENTS TAB */}
              {activeTab === "payments" && (
                <motion.div key="payments" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-6 md:p-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment History</CardTitle>
                      <CardDescription>View payments processed through Stripe.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12 text-muted-foreground">
                        <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>No payments recorded yet.</p>
                        <p className="text-sm mt-2">When the client pays via the portal, it will appear here automatically.</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* ACTIVITY TAB */}
              {activeTab === "activity" && (
                <motion.div key="activity" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-6 md:p-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Activity Log</CardTitle>
                      <CardDescription>Track every interaction with this deal.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {logs.length === 0 ? (
                        <p className="text-muted-foreground text-sm">No activity recorded.</p>
                      ) : (
                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                          {logs.map((log: any, idx: number) => (
                            <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-background bg-muted text-muted-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                {log.action.includes('Email') ? <Send className="h-4 w-4" /> : log.action.includes('Paid') ? <CreditCard className="h-4 w-4" /> : log.action.includes('Viewed') ? <User className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                              </div>
                              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-background shadow-sm">
                                <div className="flex items-center justify-between space-x-2 mb-1">
                                  <div className="font-bold text-sm">{log.action}</div>
                                  <time className="font-mono text-xs text-muted-foreground">{formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}</time>
                                </div>
                                {log.details && <div className="text-sm text-muted-foreground">{log.details}</div>}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
