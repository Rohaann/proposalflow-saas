"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, Loader2, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { generatePricingIntelligenceAction } from "@/app/actions/ai";

export default function PricingIntelligencePage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  const [service, setService] = useState("");
  const [experience, setExperience] = useState("");
  const [country, setCountry] = useState("");

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service || !experience || !country) return;
    
    setIsAnalyzing(true);
    setResults(null);

    try {
      const data = await generatePricingIntelligenceAction(service, experience, country);
      setResults(data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch pricing intelligence.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pricing Intelligence</h1>
        <p className="text-muted-foreground mt-1">Get AI-driven market rate estimates so you never leave money on the table.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <form onSubmit={handleAnalyze}>
          <Card>
            <CardHeader>
              <CardTitle>Calculate Market Rate</CardTitle>
              <CardDescription>
                Enter your service details to see what others are charging.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="service">Service Type</Label>
                <Select required value={service} onValueChange={(val) => setService(val || "")}>
                  <SelectTrigger id="service">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Web Design">Web Design</SelectItem>
                    <SelectItem value="Web Development">Web Development</SelectItem>
                    <SelectItem value="SEO">SEO</SelectItem>
                    <SelectItem value="Copywriting">Copywriting</SelectItem>
                    <SelectItem value="Consulting">Consulting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Experience Level</Label>
                <Select required value={experience} onValueChange={(val) => setExperience(val || "")}>
                  <SelectTrigger id="experience">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Junior (1-2 years)">Junior (1-2 years)</SelectItem>
                    <SelectItem value="Mid-Level (3-5 years)">Mid-Level (3-5 years)</SelectItem>
                    <SelectItem value="Senior (5+ years)">Senior (5+ years)</SelectItem>
                    <SelectItem value="Expert / Agency">Expert / Agency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Target Market (Client Country)</Label>
                <Select required value={country} onValueChange={(val) => setCountry(val || "")}>
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                    <SelectItem value="Global Average">Global Average</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 border-t p-6">
              <Button type="submit" disabled={isAnalyzing} className="w-full">
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Market Data...
                  </>
                ) : (
                  <>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Get Pricing Insights
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>

        {results ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/20 rounded-full text-primary">
                    <Info className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">AI Verdict</h3>
                    <p className="text-sm leading-relaxed">{results.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              <Card>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Low Market Rate</p>
                    <h3 className="text-2xl font-bold mt-1">{results.low}</h3>
                  </div>
                  <Badge variant="outline" className="text-muted-foreground">Bottom 25%</Badge>
                </CardContent>
              </Card>
              <Card className="border-primary shadow-sm relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-primary">Average Market Rate</p>
                    <h3 className="text-3xl font-black mt-1">{results.average}</h3>
                  </div>
                  <Badge className="bg-primary hover:bg-primary">Target Range</Badge>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Premium Rate</p>
                    <h3 className="text-2xl font-bold mt-1">{results.premium}</h3>
                  </div>
                  <Badge variant="outline" className="text-amber-500 border-amber-500/20 bg-amber-500/10">Top 10%</Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center p-12 border-2 border-dashed rounded-xl bg-muted/10 text-muted-foreground text-center">
            <div>
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Fill out the form to see real-time market data and pricing suggestions.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
