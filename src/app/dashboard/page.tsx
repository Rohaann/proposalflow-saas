"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, FileText, FileSignature, DollarSign, Loader2, ArrowRight, Plus, Activity, AlertTriangle, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { useBrand } from "@/components/BrandContext";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { LineChart, Line, ResponsiveContainer } from "recharts";

const supabase = createClient();

// Mock data for sparklines to make the dashboard look alive
const sparklineData = [
  { value: 400 }, { value: 300 }, { value: 550 }, { value: 450 }, { value: 700 }
];
const sparklineData2 = [
  { value: 200 }, { value: 400 }, { value: 350 }, { value: 600 }, { value: 800 }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function DashboardPage() {
  const { formatCurrency } = useBrand();
  const [deals, setDeals] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [dealsRes, activitiesRes] = await Promise.all([
        supabase.from('deals').select('*').order('created_at', { ascending: false }),
        supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(5)
      ]);
        
      if (dealsRes.data) setDeals(dealsRes.data);
      if (activitiesRes.data) setActivities(activitiesRes.data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const activeDeals = deals.filter(d => d.status !== "Paid" && d.status !== "Archived" && d.status !== "Lost" && d.status !== "Cancelled");
  const pendingSignatures = deals.filter(d => d.status === "Sent" || d.status === "Viewed").length;
  const outstandingPayments = deals.filter(d => d.status === "Signed").length;
  
  const revenue = deals.filter(d => d.status === "Paid").reduce((acc, deal) => {
    const numericValue = Number(deal.budget?.replace(/[^0-9.-]+/g,"")) || 0;
    return acc + numericValue;
  }, 0);

  const pipelineValue = activeDeals.reduce((acc, deal) => {
    const numericValue = Number(deal.budget?.replace(/[^0-9.-]+/g,"")) || 0;
    return acc + numericValue;
  }, 0);

  const recentDeals = deals.slice(0, 5);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-8 relative z-10"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back. Here is what's happening with your deals.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/deals/new">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all">
              <Plus className="mr-2 h-4 w-4" />
              New Deal
            </Button>
          </Link>
        </div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <motion.div variants={itemVariants}>
          <Card className="bg-background/40 backdrop-blur-xl border-white/5 shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent z-0"></div>
            <div className="absolute bottom-0 left-0 right-0 h-16 opacity-20 z-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData2}>
                  <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-foreground/80">Revenue</CardTitle>
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <DollarSign className="h-4 w-4 text-emerald-500" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                <>
                  <div className="text-3xl font-black tracking-tight">{formatCurrency(revenue)}</div>
                  <p className="text-xs text-emerald-500 mt-1 font-medium flex items-center"><TrendingUp className="w-3 h-3 mr-1"/> +14% from last month</p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-background/40 backdrop-blur-xl border-white/5 shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent z-0"></div>
            <div className="absolute bottom-0 left-0 right-0 h-16 opacity-20 z-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData}>
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-foreground/80">Pipeline Value</CardTitle>
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <DollarSign className="h-4 w-4 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                <>
                  <div className="text-3xl font-black tracking-tight">{formatCurrency(pipelineValue)}</div>
                  <p className="text-xs text-blue-400 mt-1 font-medium">Estimated value</p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-background/40 backdrop-blur-xl border-white/5 shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent z-0"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-foreground/80">Active Deals</CardTitle>
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Briefcase className="h-4 w-4 text-purple-400" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                <>
                  <div className="text-3xl font-black tracking-tight">{activeDeals.length}</div>
                  <p className="text-xs text-purple-400 mt-1 font-medium">In progress</p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-background/40 backdrop-blur-xl border-white/5 shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent z-0"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-foreground/80">Pending Signatures</CardTitle>
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <FileSignature className="h-4 w-4 text-amber-400" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                <>
                  <div className="text-3xl font-black tracking-tight">{pendingSignatures}</div>
                  <p className="text-xs text-amber-400 mt-1 font-medium">Awaiting client</p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-background/40 backdrop-blur-xl border-white/5 shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent z-0"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-foreground/80">Outstanding Invoices</CardTitle>
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <FileText className="h-4 w-4 text-cyan-400" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                <>
                  <div className="text-3xl font-black tracking-tight">{outstandingPayments}</div>
                  <p className="text-xs text-cyan-400 mt-1 font-medium">Unpaid invoices</p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Quick Actions Reimagined */}
        <motion.div variants={itemVariants} className="col-span-3 lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold tracking-tight">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/dashboard/deals/new" className="group">
              <div className="h-full p-5 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-2xl flex flex-col items-center justify-center text-center gap-3 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-emerald-50">New Deal</span>
              </div>
            </Link>
            
            <Link href="/dashboard/deal-doctor" className="group">
              <div className="h-full p-5 bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 rounded-2xl flex flex-col items-center justify-center text-center gap-3 hover:bg-amber-500/20 hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1 shadow-[0_0_15px_rgba(245,158,11,0.05)]">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-amber-50">Deal Doctor</span>
              </div>
            </Link>

            <Link href="/dashboard/documents/proposal" className="group">
              <div className="h-full p-5 bg-background/50 border border-white/5 rounded-2xl flex flex-col items-center justify-center text-center gap-3 hover:bg-white/5 transition-all duration-300 hover:-translate-y-1">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-foreground/80">Proposals</span>
              </div>
            </Link>

            <Link href="/dashboard/documents/contract" className="group">
              <div className="h-full p-5 bg-background/50 border border-white/5 rounded-2xl flex flex-col items-center justify-center text-center gap-3 hover:bg-white/5 transition-all duration-300 hover:-translate-y-1">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground group-hover:scale-110 transition-transform">
                  <FileSignature className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-foreground/80">Contracts</span>
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Recent Deals Table */}
        <motion.div variants={itemVariants} className="col-span-4 lg:col-span-5">
          <Card className="bg-background/40 backdrop-blur-xl border-white/5 shadow-xl h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-white/5">
              <div>
                <CardTitle>Recent Deals</CardTitle>
                <CardDescription>Your active pipeline and client requests.</CardDescription>
              </div>
              <Link href="/dashboard/deals">
                <Button variant="ghost" size="sm" className="hover:bg-white/5">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="flex-1 pt-6">
              {isLoading ? (
                <div className="flex justify-center items-center h-full"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
              ) : recentDeals.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground">
                    <Briefcase className="w-6 h-6"/>
                  </div>
                  <p className="text-muted-foreground">No deals yet. Click "New Deal" to get started!</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead>Client</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead className="text-right">Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentDeals.map((deal) => (
                      <TableRow key={deal.id} className="border-white/5 hover:bg-white/5 transition-colors">
                        <TableCell className="font-medium">
                          <Link href={`/dashboard/deals/${deal.id}`} className="hover:text-emerald-400 transition-colors">
                            {deal.client_name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{deal.project_type}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline"
                            className={
                              deal.status === "Paid" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                              deal.status === "Signed" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                              deal.status === "Proposal Sent" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : 
                              "bg-white/5 text-foreground/60 border-white/10"
                            }
                          >
                            {deal.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{deal.budget}</TableCell>
                        <TableCell className="text-right text-muted-foreground text-xs">
                          {formatDistanceToNow(new Date(deal.created_at), { addSuffix: true })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants}>
        <Card className="bg-background/40 backdrop-blur-xl border-white/5 shadow-xl">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-emerald-500/20">
                <Activity className="h-4 w-4 text-emerald-400" />
              </div>
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
            ) : activities.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground text-sm">
                No recent activity found.
              </div>
            ) : (
              <div className="space-y-6">
                {activities.map((activity, i) => (
                  <div key={activity.id} className="relative flex items-start gap-4">
                    {/* Timeline Line */}
                    {i !== activities.length - 1 && (
                      <div className="absolute top-8 left-[11px] w-[2px] h-full -bottom-6 bg-white/5 z-0" />
                    )}
                    <div className="relative z-10 w-6 h-6 rounded-full bg-background border-2 border-emerald-500/50 flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                    </div>
                    <div className="flex flex-col flex-1 pb-1">
                      <span className="text-sm font-semibold text-foreground/90">{activity.action}</span>
                      <span className="text-sm text-muted-foreground mt-1">{activity.description || "Action completed"}</span>
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap bg-white/5 px-2 py-1 rounded-md">
                      {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
