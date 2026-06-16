"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Download, Presentation, FileSignature, CreditCard } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ClientPortalPage() {
  const [activeTab, setActiveTab] = useState<"proposal" | "contract" | "invoice">("proposal");
  const [isSigned, setIsSigned] = useState(false);
  const [signature, setSignature] = useState("");

  const handleSign = (e: React.FormEvent) => {
    e.preventDefault();
    if (signature.trim().length > 2) {
      setIsSigned(true);
      setActiveTab("invoice");
    }
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="px-6 lg:px-14 h-16 flex items-center border-b bg-background sticky top-0 z-50">
        <div className="flex items-center">
          <Presentation className="h-6 w-6 text-primary mr-2" />
          <span className="font-bold tracking-tighter text-lg">ProposalFlow AI</span>
          <span className="ml-2 text-xs font-medium px-2 py-1 bg-muted text-muted-foreground rounded-full">
            Client Portal
          </span>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Acme Corp - Web Redesign</h1>
          <p className="text-muted-foreground mt-1">Prepared by Jane Doe</p>
        </div>

        {/* Status Tracker */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted -z-10 rounded-full" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2/3 h-1 bg-primary -z-10 rounded-full" />
          
          <div className="flex flex-col items-center bg-muted/20 backdrop-blur-sm p-2 rounded-lg">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground mb-2">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold">Proposal Reviewed</span>
          </div>
          
          <div className="flex flex-col items-center bg-muted/20 backdrop-blur-sm p-2 rounded-lg">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center mb-2 ${isSigned ? 'bg-primary text-primary-foreground' : 'bg-muted border-2 border-primary text-primary'}`}>
              {isSigned ? <CheckCircle2 className="h-5 w-5" /> : <span className="font-bold text-sm">2</span>}
            </div>
            <span className={`text-xs font-semibold ${isSigned ? '' : 'text-primary'}`}>Contract Signed</span>
          </div>

          <div className="flex flex-col items-center bg-muted/20 backdrop-blur-sm p-2 rounded-lg">
            <div className="h-8 w-8 rounded-full bg-muted border-2 text-muted-foreground flex items-center justify-center mb-2">
              <span className="font-bold text-sm">3</span>
            </div>
            <span className="text-xs font-semibold text-muted-foreground">Deposit Paid</span>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Navigation */}
          <div className="md:col-span-1 space-y-2">
            <Button 
              variant={activeTab === "proposal" ? "secondary" : "ghost"} 
              className={`w-full justify-start ${activeTab === "proposal" ? "bg-primary/10 text-primary hover:bg-primary/20" : ""}`}
              onClick={() => setActiveTab("proposal")}
            >
              <Presentation className="mr-2 h-4 w-4" />
              Proposal
            </Button>
            <Button 
              variant={activeTab === "contract" ? "secondary" : "ghost"} 
              className={`w-full justify-start ${activeTab === "contract" ? "bg-primary/10 text-primary hover:bg-primary/20" : ""}`}
              onClick={() => setActiveTab("contract")}
            >
              <FileSignature className="mr-2 h-4 w-4" />
              Contract
              {isSigned && <CheckCircle2 className="ml-auto h-4 w-4 text-green-500" />}
            </Button>
            <Button 
              variant={activeTab === "invoice" ? "secondary" : "ghost"} 
              className={`w-full justify-start ${activeTab === "invoice" ? "bg-primary/10 text-primary hover:bg-primary/20" : ""}`}
              onClick={() => setActiveTab("invoice")}
              disabled={!isSigned}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Deposit Invoice
            </Button>
          </div>

          {/* Content Area */}
          <div className="md:col-span-3">
            <Card className="min-h-[600px] flex flex-col shadow-lg border-2">
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
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  PDF
                </Button>
              </CardHeader>
              
              <CardContent className="flex-1 p-8 font-serif leading-relaxed text-sm bg-background whitespace-pre-wrap">
                {activeTab === "proposal" && `
# Executive Summary
We understand that Acme Corp is looking to modernize its online presence to drive more inbound leads. This proposal outlines a comprehensive strategy to achieve your goals through a high-performance website.

# Project Scope
- Custom UI/UX Design
- Frontend Development (Next.js)
- CMS Integration
- On-Page SEO Setup

# Timeline
4 Weeks total duration.

# Investment
Core Website: $3,500
Blog & CMS: $1,000
Total: $4,500
                `}
                
                {activeTab === "contract" && `
# INDEPENDENT CONTRACTOR AGREEMENT

This Agreement is entered into by and between Jane Doe ("Contractor") and Acme Corp ("Client").

## 1. Services
Contractor agrees to perform the web design and development services as outlined in the attached Proposal.

## 2. Compensation
Client agrees to pay Contractor a total of $4,500. A non-refundable deposit of $2,250 is due upon signing.

## 3. Revisions
This agreement includes up to two (2) rounds of revisions per phase. Additional revisions will be billed at $100/hr.

## 4. Ownership
Upon full payment, Client will own the final deliverables. Contractor retains the right to display the work in their portfolio.
                `}
                
                {activeTab === "invoice" && `
# INVOICE #INV-2026-001

**From:** Jane Doe
**To:** Acme Corp

**Date:** Oct 25, 2026
**Due Date:** Due on Receipt

| Description | Amount |
|-------------|--------|
| Web Redesign - 50% Deposit | $2,250.00 |

**Total Due: $2,250.00**

Thank you for your business!
                `}
              </CardContent>
              
              {activeTab === "contract" && !isSigned && (
                <CardFooter className="bg-muted/20 border-t p-6 flex-col items-start gap-4">
                  <h3 className="font-semibold">Sign to Accept</h3>
                  <form onSubmit={handleSign} className="flex gap-4 w-full">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="signature">Type your full name to sign electronically</Label>
                      <Input 
                        id="signature" 
                        placeholder="e.g. John Smith" 
                        value={signature}
                        onChange={(e) => setSignature(e.target.value)}
                        required 
                        className="font-serif italic text-lg"
                      />
                    </div>
                    <Button type="submit" className="mt-8">Sign & Proceed</Button>
                  </form>
                </CardFooter>
              )}
              
              {activeTab === "contract" && isSigned && (
                <CardFooter className="bg-green-500/10 border-t border-green-500/20 p-6">
                  <div className="flex items-center text-green-700">
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    <strong>Signed by {signature}</strong> on {new Date().toLocaleDateString()}
                  </div>
                </CardFooter>
              )}

              {activeTab === "invoice" && (
                <CardFooter className="bg-primary/5 border-t border-primary/20 p-6 flex justify-between items-center">
                  <div>
                    <span className="text-muted-foreground text-sm">Amount Due</span>
                    <div className="text-3xl font-black">$2,250.00</div>
                  </div>
                  <Button size="lg" className="px-8 shadow-lg">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Pay via Stripe
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
