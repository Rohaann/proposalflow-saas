"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Users, Link as LinkIcon, ExternalLink, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";

const supabase = createClient();

export default function PortalPage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const fetchDeals = async () => {
      const { data } = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setDeals(data);
      setIsLoading(false);
    };

    fetchDeals();
  }, [user]);

  const copyToClipboard = (dealId: string) => {
    const url = `${window.location.origin}/portal/${dealId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(dealId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Client Portals</h1>
        <p className="text-muted-foreground mt-1">Share secure, whitelabeled portal links with your clients to get proposals approved and invoices paid.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>
      ) : deals.length === 0 ? (
        <Card className="border-border/60 shadow-sm text-center py-20">
          <CardContent className="flex flex-col items-center justify-center gap-4">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold">No deals generated yet</h2>
            <p className="text-muted-foreground max-w-md">
              Generate a deal first to get a client portal link.
            </p>
            <Link href="/dashboard/deals/new">
              <Button className="mt-2">Generate Deal</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {deals.map(deal => (
            <Card key={deal.id} className="flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge 
                    variant={deal.status === 'Signed' || deal.status === 'Paid' ? 'default' : deal.status === 'Viewed' ? 'outline' : 'secondary'} 
                    className={`mb-2 ${deal.status === 'Viewed' ? 'border-primary text-primary bg-primary/5' : ''}`}
                  >
                    {deal.status === 'Signed' || deal.status === 'Paid' ? (
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                    ) : deal.status === 'Viewed' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    ) : (
                      <Clock className="h-3 w-3 mr-1" />
                    )}
                    {deal.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(deal.created_at).toLocaleDateString()}
                  </span>
                </div>
                <CardTitle className="text-lg line-clamp-1">{deal.client_name}</CardTitle>
                <CardDescription className="line-clamp-1">{deal.project_type}</CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(deal.budget || 0)}
                </div>
              </CardContent>
              <CardFooter className="flex gap-2 pt-3 border-t bg-muted/20">
                <Button 
                  variant={copiedId === deal.id ? "default" : "outline"} 
                  className="w-full flex-1" 
                  onClick={() => copyToClipboard(deal.id)}
                >
                  {copiedId === deal.id ? (
                    <>Copied!</>
                  ) : (
                    <><LinkIcon className="h-4 w-4 mr-2" /> Copy Link</>
                  )}
                </Button>
                <Link href={`/portal/${deal.id}`} target="_blank" className="flex-1">
                  <Button variant="secondary" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" /> Preview
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
