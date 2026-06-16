"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, MoreHorizontal, FileText, FileSignature, Receipt, ShieldAlert, Loader2, Activity, Users } from "lucide-react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/supabase";

export default function DealsPage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDeals() {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (data) {
        setDeals(data);
      }
      setIsLoading(false);
    }
    fetchDeals();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Deals</h1>
          <p className="text-muted-foreground mt-1">Manage your active pipeline and client requests.</p>
        </div>
        <Link href="/dashboard/deals/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Deal
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Deals</CardTitle>
              <CardDescription>A list of all your active and past deals.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search deals..."
                  className="pl-8 w-[200px] lg:w-[300px]"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : deals.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p>No deals found. Create your first deal to get started!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Project Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deals.map((deal) => (
                  <TableRow key={deal.id}>
                    <TableCell>
                      <div className="font-medium">{deal.client_name}</div>
                      {deal.client_email && (
                        <div className="text-sm text-muted-foreground hidden md:block">{deal.client_email}</div>
                      )}
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
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {new Date(deal.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                          <DropdownMenuLabel>Deal Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => window.location.href = `/dashboard/proposals/${deal.id}`}>
                            <ShieldAlert className="mr-2 h-4 w-4 text-orange-500" />
                            View Deal Package
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.location.href = `/dashboard/deal-doctor?id=${deal.id}`}>
                            <Activity className="mr-2 h-4 w-4 text-blue-500" />
                            Deal Doctor Analysis
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.location.href = `/dashboard/portal`}>
                            <Users className="mr-2 h-4 w-4 text-purple-500" />
                            Client Portal
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
