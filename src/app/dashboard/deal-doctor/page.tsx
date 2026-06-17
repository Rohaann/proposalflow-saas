"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ShieldAlert, AlertTriangle, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { generateDealDoctorAction } from "@/app/actions/ai";
import { useRouter } from "next/navigation";

export default function StandaloneDealDoctor() {
  const [proposal, setProposal] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const res = await generateDealDoctorAction(proposal);
      setAnalysis(res);
    } catch (e) {
      alert("Error generating analysis");
    } finally {
      setIsLoading(false);
    }
  };

  const convertToDeal = () => {
    sessionStorage.setItem("pending_deal_prompt", "Generate deal from Deal Doctor analysis...");
    router.push("/dashboard/deals/new");
  };

  const getScoreColor = (score: number) => {
    if (score > 70) return "bg-green-500 text-green-500";
    if (score > 40) return "bg-yellow-500 text-yellow-500";
    return "bg-red-500 text-red-500";
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 rounded-xl">
          <ShieldAlert className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Deal Doctor</h1>
          <p className="text-muted-foreground">Analyze any proposal for risks and get AI recommendations.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Proposal Content</Label>
              <Textarea 
                className="min-h-[300px]" 
                placeholder="Paste the proposal content here to analyze..."
                value={proposal}
                onChange={e => setProposal(e.target.value)}
              />
            </div>
            <Button className="w-full" onClick={handleGenerate} disabled={isLoading || !proposal.trim()}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Analyze Deal
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col h-full">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/10">
            <CardTitle>Analysis Results</CardTitle>
            {analysis && (
              <Button size="sm" onClick={convertToDeal} className="shadow-lg shadow-primary/20">
                Convert into Full Deal <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="flex-1 p-6 space-y-6">
            {!analysis ? (
              <p className="text-muted-foreground text-sm italic">Results will appear here...</p>
            ) : (
              <>
                <div className="flex gap-4 flex-wrap">
                  <div className="flex-1 min-w-[120px] rounded-xl bg-background border p-4 shadow-sm flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Risk Score</span>
                    <span className={`text-4xl font-black ${getScoreColor(analysis.riskScore).split(' ')[1]}`}>
                      {analysis.risk_score}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-[120px] rounded-xl bg-background border p-4 shadow-sm flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Risk Level</span>
                    <Badge variant="outline" className={`mt-2 ${getScoreColor(analysis.riskScore).split(' ')[1]}`}>
                      {analysis.risk_level}
                    </Badge>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-muted/30 border flex gap-3">
                  <AlertTriangle className={`h-5 w-5 shrink-0 ${getScoreColor(analysis.riskScore).split(' ')[1]}`} />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">AI Feedback</h4>
                    <p className="text-sm text-muted-foreground">{analysis.feedback}</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
