"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  FileSignature, 
  Receipt, 
  ShieldAlert, 
  BarChart3, 
  Users, 
  Settings, 
  CreditCard,
  Presentation,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/components/AuthContext";

const mainLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Deals", href: "/dashboard/deals", icon: Briefcase },
  { name: "Client Portals", href: "/dashboard/portal", icon: Users },
];

const aiToolLinks = [
  { name: "Proposal Generator", href: "/dashboard/documents/proposal", icon: FileText },
  { name: "Contract Generator", href: "/dashboard/documents/contract", icon: FileSignature },
  { name: "Invoice Generator", href: "/dashboard/documents/invoice", icon: Receipt },
  { name: "Deal Doctor", href: "/dashboard/deal-doctor", icon: ShieldAlert },
  { name: "Pricing Intelligence", href: "/dashboard/pricing", icon: BarChart3 },
];

const bottomLinks = [
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <div className="flex min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/10 via-background to-background">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-md lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-64 border-r border-white/5 bg-background/40 backdrop-blur-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static shadow-2xl
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b border-white/5 px-6">
            <Link href="/" className="flex items-center font-bold text-lg tracking-tight">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mr-3 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <Presentation className="h-4 w-4 text-emerald-400" />
              </div>
              ProposalFlow <span className="text-emerald-500 ml-1">AI</span>
            </Link>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-6 px-3">
              <div className="space-y-1">
                <div className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Main</div>
                {mainLinks.map((link) => {
                  const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/dashboard");
                  const Icon = link.icon;
                  return (
                    <Link key={link.name} href={link.href}>
                      <span className={`
                        flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group
                        ${isActive 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.05)]" 
                          : "text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent"
                        }
                      `}>
                        <Icon className="h-4 w-4" />
                        {link.name}
                      </span>
                    </Link>
                  );
                })}
              </div>

              <div className="space-y-1">
                <div className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI Tools</div>
                {aiToolLinks.map((link) => {
                  const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                  const Icon = link.icon;
                  return (
                    <Link key={link.name} href={link.href}>
                      <span className={`
                        flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group
                        ${isActive 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.05)]" 
                          : "text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent"
                        }
                      `}>
                        <Icon className="h-4 w-4" />
                        {link.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </nav>
          </div>

          <div className="border-t border-white/5 p-4">
            <nav className="space-y-1 px-3">
              {bottomLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link key={link.name} href={link.href}>
                    <span className={`
                      flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200
                      ${isActive 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent"
                      }
                    `}>
                      <Icon className="h-4 w-4" />
                      {link.name}
                    </span>
                  </Link>
                );
              })}
            </nav>
            <div className="mt-4 flex flex-col gap-3 px-3 py-2 border-t border-white/5 pt-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-xs uppercase shadow-md">
                  {user?.email?.charAt(0) || "U"}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-medium truncate text-foreground">{user?.email || "User"}</span>
                  <span className="text-xs text-emerald-500 font-medium">Pro Plan</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-red-400 hover:bg-red-500/10 mt-2" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col w-full min-w-0">
        <header className="flex h-16 items-center gap-4 border-b border-white/5 bg-background/40 backdrop-blur-xl px-6 lg:px-8 z-40 sticky top-0">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <div className="flex-1">
            {/* Header search or title could go here */}
          </div>
          <Button variant="outline" size="sm">New Deal</Button>
        </header>
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
