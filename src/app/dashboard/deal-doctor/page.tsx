"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldAlert, AlertTriangle, CheckCircle, TrendingDown, Clock, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { useSearchParams } from "next/navigation";

export default function DealDoctorPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  // Mock data for the "Deal Doctor" analysis
  // In a real app, we'd fetch this based on the ID
  const analysis = {
    client: "John Doe",
    project: "Web Design & Development",
    riskScore: 78,
    riskLevel: "High Risk",
    issues: [
      { id: 1, type: "Underpriced", desc: "Budget is $1,500 but requested features (custom design, blog, SEO) average $4,500+ in the market.", icon: TrendingDown, color: "text-red-500" },
      { id: 2, type: "Unrealistic Timeline", desc: "Client requested completion in 1 week. Standard timeline for this scope is 3-4 weeks.", icon: Clock, color: "text-orange-500" },
      { id: 3, type: "Scope Creep Risk", desc: "Vague requirement: 'rank #1 on Google'. This is an ongoing SEO task, not a one-time deliverable.", icon: AlertTriangle, color: "text-orange-500" },
    ],
    recommendations: [
      { id: 1, title: "Adjust Pricing Strategy", desc: "Propose a phased approach. Phase 1 (Core Site) for $2,500. Phase 2 (Blog & SEO setup) for $1,500." },
      { id: 2, title: "Define SEO Scope", desc: "Explicitly state in the contract that you will provide 'on-page SEO best practices' but cannot guarantee #1 rankings." },
      { id: 3, title: "Set Firm Timeline", desc: "Commit to a 3-week timeline, contingent on receiving all client assets within 48 hours." },
      { id: 4, title: "Add Revision Limits", desc: "Cap design revisions to 2 rounds to prevent endless feedback loops." },
    ]
  };

  const getScoreColor = (score: number) => {
    if (score > 70) return "bg-red-500";
    if (score > 40) return "bg-orange-500";
    return "bg-green-500";
  };

  const getScoreTextClass = (score: number) => {
    if (score > 70) return "text-red-500";
    if (score > 40) return "text-orange-500";
    return "text-green-500";
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
              <ShieldAlert className="mr-1 h-3 w-3" />
              AI Analysis Complete
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Deal Doctor Insights</h1>
          <p className="text-muted-foreground mt-1">
            Reviewing risks and recommendations for <span className="font-semibold text-foreground">{analysis.client}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/proposals/mock-123">
            <Button>
              Review Generated Proposal
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Risk Score Card */}
        <Card className="md:col-span-1 border-2 relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-1 ${getScoreColor(analysis.riskScore)}`} />
          <CardHeader>
            <CardTitle>Overall Risk Score</CardTitle>
            <CardDescription>Probability of issues arising</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className="relative flex items-center justify-center w-40 h-40">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-muted stroke-current"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={`${getScoreTextClass(analysis.riskScore)} stroke-current`}
                  strokeWidth="3"
                  strokeDasharray={`${analysis.riskScore}, 100`}
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className={`text-4xl font-black ${getScoreTextClass(analysis.riskScore)}`}>
                  {analysis.riskScore}
                </span>
                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider mt-1">
                  / 100
                </span>
              </div>
            </div>
            <Badge 
              variant="outline" 
              className={`mt-6 text-base px-4 py-1 font-bold ${getScoreTextClass(analysis.riskScore)} border-${getScoreColor(analysis.riskScore)}/50 bg-${getScoreColor(analysis.riskScore)}/10`}
            >
              {analysis.riskLevel}
            </Badge>
          </CardContent>
        </Card>

        {/* Identified Issues */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-orange-500" />
              Identified Red Flags
            </CardTitle>
            <CardDescription>
              We analyzed the client brief and found these potential hazards.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {analysis.issues.map((issue) => {
              const Icon = issue.icon;
              return (
                <div key={issue.id} className="flex gap-4 p-4 rounded-xl bg-muted/30 border">
                  <div className={`mt-0.5 ${issue.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{issue.type}</h4>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {issue.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5 text-green-500" />
              AI Recommendations applied to Contract
            </CardTitle>
            <CardDescription>
              We have automatically adjusted your generated Proposal and Contract to mitigate these risks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              {analysis.recommendations.map((rec) => (
                <div key={rec.id} className="flex gap-3 p-4 border rounded-xl bg-background shadow-sm">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">{rec.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {rec.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
