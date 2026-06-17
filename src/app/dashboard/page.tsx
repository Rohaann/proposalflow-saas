"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, FileText, FileSignature, DollarSign, Loader2 } from "lucide-react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { useBrand } from "@/components/BrandContext";
import { formatDistanceToNow } from "date-fns";

export default function DashboardPage() {
  const { formatCurrency } = useBrand();
  const [deals, setDeals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDeals() {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (data) setDeals(data);
      setIsLoading(false);
    }
    fetchDeals();
  }, []);

  const totalDeals = deals.length;
  const proposalsSent = deals.filter(d => d.status !== "Draft").length;
  const contractsSigned = deals.filter(d => d.status === "Signed" || d.status === "Paid").length;
  
  // Clean string budgets (e.g. "$4,500") into numbers for the pipeline total
  const pipelineValue = deals.reduce((acc, deal) => {
    const numericValue = Number(deal.budget?.replace(/[^0-9.-]+/g,"")) || 0;
    return acc + numericValue;
  }, 0);

  const recentDeals = deals.slice(0, 5);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/dashboard/deals/new">
            <Button>
              <Briefcase className="mr-2 h-4 w-4" />
              New Deal
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
              <>
                <div className="text-2xl font-bold">{totalDeals}</div>
                <p className="text-xs text-muted-foreground mt-1">Active in pipeline</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proposals Sent</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
              <>
                <div className="text-2xl font-bold">{proposalsSent}</div>
                <p className="text-xs text-muted-foreground mt-1">Pending client review</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contracts Signed</CardTitle>
            <FileSignature className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
              <>
                <div className="text-2xl font-bold">{contractsSigned}</div>
                <p className="text-xs text-emerald-500 mt-1">Ready to invoice</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
              <>
                <div className="text-2xl font-bold">{formatCurrency(pipelineValue)}</div>
                <p className="text-xs text-muted-foreground mt-1">Total estimated revenue</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Recent Deals</CardTitle>
          <CardDescription>
            Your active pipeline and recent client requests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : recentDeals.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No deals yet. Click "New Deal" to get started!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead className="text-right">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentDeals.map((deal) => (
                  <TableRow key={deal.id}>
                    <TableCell className="font-medium">
                      <Link href={`/dashboard/deals/${deal.id}`} className="hover:underline hover:text-primary">
                        {deal.client_name}
                      </Link>
                    </TableCell>
                    <TableCell>{deal.project_type}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          deal.status === "Paid" ? "default" :
                          deal.status === "Signed" ? "secondary" :
                          deal.status === "Proposal Sent" ? "outline" : "secondary"
                        }
                        className={
                          deal.status === "Paid" ? "bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20" : ""
                        }
                      >
                        {deal.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{deal.budget}</TableCell>
                    <TableCell className="text-right text-muted-foreground text-sm">
                      {formatDistanceToNow(new Date(deal.created_at), { addSuffix: true })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
