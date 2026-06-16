"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, Presentation, FileSignature, CreditCard, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ClientPortalPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [deal, setDeal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"proposal" | "contract" | "invoice">("proposal");
  const [isSigned, setIsSigned] = useState(false);
  const [signature, setSignature] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    const fetchDeal = async () => {
      if (!id) return;
      const { data } = await supabase.from('deals').select('*').eq('id', id).single();
      if (data) {
        setDeal(data);
        setIsSigned(data.status === 'Signed' || data.status === 'Paid');
      }
      setLoading(false);
    };
    fetchDeal();
  }, [id]);

  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signature.trim().length > 2) {
      setIsSigned(true);
      await supabase.from('deals').update({ status: 'Signed' }).eq('id', id);
      setActiveTab("invoice");
    }
  };

  const handlePay = () => {
    setIsPaying(true);
    setTimeout(async () => {
      await supabase.from('deals').update({ status: 'Paid' }).eq('id', id);
      setIsPaying(false);
      alert("Payment successful! The deal is now complete.");
      window.location.reload();
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-muted/20">
        <h1 className="text-2xl font-bold">Deal not found</h1>
        <p className="text-muted-foreground mt-2">This portal link may be invalid or expired.</p>
      </div>
    );
  }

  const depositAmount = (deal.budget || 0) * 0.5;

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="px-6 lg:px-14 h-16 flex items-center border-b bg-background sticky top-0 z-50 shadow-sm">
        <div className="flex items-center">
          <Presentation className="h-6 w-6 text-primary mr-2" />
          <span className="font-bold tracking-tighter text-lg">ProposalFlow AI</span>
          <span className="ml-3 text-xs font-medium px-2.5 py-0.5 bg-primary/10 text-primary rounded-full">
            Secure Client Portal
          </span>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{deal.client_name || "Client"} - {deal.project_type || "Project"}</h1>
          <p className="text-muted-foreground mt-1">Prepared for your review.</p>
        </div>

        {/* Status Tracker */}
        <div className="flex items-center justify-between mb-8 relative px-4">
          <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-muted -z-10 rounded-full" />
          <div className={`absolute left-4 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 rounded-full transition-all duration-500 ${deal.status === 'Paid' ? 'w-[calc(100%-2rem)]' : isSigned ? 'w-1/2' : 'w-0'}`} />
          
          <div className="flex flex-col items-center bg-muted/20 backdrop-blur-sm p-2 rounded-lg">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground mb-2 shadow-md">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold">Proposal Sent</span>
          </div>
          
          <div className="flex flex-col items-center bg-muted/20 backdrop-blur-sm p-2 rounded-lg">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center mb-2 shadow-md transition-colors ${isSigned ? 'bg-primary text-primary-foreground' : 'bg-background border-2 border-primary text-primary'}`}>
              {isSigned ? <CheckCircle2 className="h-5 w-5" /> : <span className="font-bold text-sm">2</span>}
            </div>
            <span className={`text-xs font-semibold ${isSigned ? '' : 'text-primary'}`}>Contract Signed</span>
          </div>

          <div className="flex flex-col items-center bg-muted/20 backdrop-blur-sm p-2 rounded-lg">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center mb-2 shadow-md transition-colors ${deal.status === 'Paid' ? 'bg-primary text-primary-foreground' : 'bg-background border-2 border-muted-foreground text-muted-foreground'}`}>
               {deal.status === 'Paid' ? <CheckCircle2 className="h-5 w-5" /> : <span className="font-bold text-sm">3</span>}
            </div>
            <span className={`text-xs font-semibold ${deal.status === 'Paid' ? '' : 'text-muted-foreground'}`}>Deposit Paid</span>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Navigation */}
          <div className="md:col-span-1 space-y-2">
            <Button 
              variant={activeTab === "proposal" ? "secondary" : "ghost"} 
              className={`w-full justify-start ${activeTab === "proposal" ? "bg-primary/10 text-primary hover:bg-primary/20 shadow-sm" : ""}`}
              onClick={() => setActiveTab("proposal")}
            >
              <Presentation className="mr-2 h-4 w-4" />
              Proposal
            </Button>
            <Button 
              variant={activeTab === "contract" ? "secondary" : "ghost"} 
              className={`w-full justify-start ${activeTab === "contract" ? "bg-primary/10 text-primary hover:bg-primary/20 shadow-sm" : ""}`}
              onClick={() => setActiveTab("contract")}
            >
              <FileSignature className="mr-2 h-4 w-4" />
              Contract
              {isSigned && <CheckCircle2 className="ml-auto h-4 w-4 text-green-500" />}
            </Button>
            <Button 
              variant={activeTab === "invoice" ? "secondary" : "ghost"} 
              className={`w-full justify-start ${activeTab === "invoice" ? "bg-primary/10 text-primary hover:bg-primary/20 shadow-sm" : ""}`}
              onClick={() => setActiveTab("invoice")}
              disabled={!isSigned}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Deposit Invoice
              {deal.status === 'Paid' && <CheckCircle2 className="ml-auto h-4 w-4 text-green-500" />}
            </Button>
          </div>

          {/* Content Area */}
          <div className="md:col-span-3">
            <Card className="min-h-[600px] flex flex-col shadow-lg border-border/50">
              <CardHeader className="border-b bg-muted/10 flex flex-row items-center justify-between">
                <div>
                  <CardTitle>
                    {activeTab === "proposal" && "Project Proposal"}
                    {activeTab === "contract" && "Service Agreement"}
                    {activeTab === "invoice" && "Initial Deposit Invoice"}
                  </CardTitle>
                  <CardDescription>
                    {activeTab === "proposal" && "Review the scope and deliverables."}
                    {activeTab === "contract" && "Please sign below to formally begin."}
                    {activeTab === "invoice" && "A 50% deposit is required to start."}
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <Download className="mr-2 h-4 w-4" />
                  PDF
                </Button>
              </CardHeader>
              
              <CardContent className="flex-1 p-8 font-serif leading-relaxed text-sm sm:text-base bg-background whitespace-pre-wrap">
                {activeTab === "proposal" && (deal.proposal_content || "No proposal generated.")}
                {activeTab === "contract" && (deal.contract_content || "No contract generated.")}
                {activeTab === "invoice" && (
                  <div className="font-sans">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h2 className="text-2xl font-bold text-primary">INVOICE</h2>
                        <p className="text-muted-foreground mt-1">#INV-{deal.id.split('-')[0].toUpperCase()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">Prepared By</p>
                        <p className="text-muted-foreground">ProposalFlow Vendor</p>
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <p className="font-semibold text-muted-foreground uppercase text-xs tracking-wider mb-2">Billed To</p>
                      <p className="font-medium text-lg">{deal.client_name}</p>
                      <p className="text-muted-foreground">{deal.client_email}</p>
                    </div>

                    <div className="border rounded-xl overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-muted">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold">Description</th>
                            <th className="px-4 py-3 text-right font-semibold">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          <tr>
                            <td className="px-4 py-4">{deal.project_type} - 50% Deposit</td>
                            <td className="px-4 py-4 text-right">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(depositAmount)}</td>
                          </tr>
                        </tbody>
                        <tfoot className="bg-muted/30">
                          <tr>
                            <td className="px-4 py-4 font-bold text-right">Total Due:</td>
                            <td className="px-4 py-4 font-bold text-right text-lg">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(depositAmount)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}
              </CardContent>
              
              {activeTab === "contract" && !isSigned && (
                <CardFooter className="bg-muted/20 border-t p-6 flex-col items-start gap-4">
                  <h3 className="font-semibold text-lg">Sign to Accept</h3>
                  <form onSubmit={handleSign} className="flex flex-col sm:flex-row gap-4 w-full">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="signature">Type your full name to sign electronically</Label>
                      <Input 
                        id="signature" 
                        placeholder="e.g. John Smith" 
                        value={signature}
                        onChange={(e) => setSignature(e.target.value)}
                        required 
                        className="font-serif italic text-lg h-12"
                      />
                    </div>
                    <Button type="submit" size="lg" className="sm:mt-8 w-full sm:w-auto">Sign & Proceed</Button>
                  </form>
                </CardFooter>
              )}
              
              {activeTab === "contract" && isSigned && (
                <CardFooter className="bg-green-500/10 border-t border-green-500/20 p-6">
                  <div className="flex items-center text-green-700">
                    <CheckCircle2 className="h-6 w-6 mr-3" />
                    <div>
                      <strong className="block text-lg">Contract Accepted</strong>
                      <span className="text-sm opacity-80">This agreement has been digitally signed and secured.</span>
                    </div>
                  </div>
                </CardFooter>
              )}

              {activeTab === "invoice" && deal.status !== 'Paid' && (
                <CardFooter className="bg-primary/5 border-t border-primary/20 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-center sm:text-left">
                    <span className="text-muted-foreground text-sm font-medium">Amount Due</span>
                    <div className="text-3xl font-black text-primary">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(depositAmount)}</div>
                  </div>
                  <Button size="lg" className="px-8 shadow-lg w-full sm:w-auto h-12 text-lg" onClick={handlePay} disabled={isPaying}>
                    {isPaying ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CreditCard className="mr-2 h-5 w-5" />}
                    Pay via Stripe
                  </Button>
                </CardFooter>
              )}

              {activeTab === "invoice" && deal.status === 'Paid' && (
                <CardFooter className="bg-green-500/10 border-t border-green-500/20 p-6">
                   <div className="flex items-center text-green-700">
                    <CheckCircle2 className="h-6 w-6 mr-3" />
                    <div>
                      <strong className="block text-lg">Invoice Paid</strong>
                      <span className="text-sm opacity-80">Thank you for your payment. The project will commence shortly.</span>
                    </div>
                  </div>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
