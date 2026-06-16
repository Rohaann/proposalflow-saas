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

const sidebarLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Deals Pipeline", href: "/dashboard/deals", icon: Briefcase },
  { name: "Client Portal", href: "/dashboard/portal", icon: Users },
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
    <div className="flex min-h-screen bg-muted/20">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-64 border-r bg-background transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/" className="flex items-center font-bold text-lg tracking-tight">
              <Presentation className="h-5 w-5 text-primary mr-2" />
              ProposalFlow <span className="text-primary ml-1">AI</span>
            </Link>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-3">
              <div className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Main</div>
              {sidebarLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                const Icon = link.icon;
                return (
                  <Link key={link.name} href={link.href}>
                    <span className={`
                      flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all
                      ${isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }
                    `}>
                      <Icon className="h-4 w-4" />
                      {link.name}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="border-t p-4">
            <nav className="space-y-1 px-3">
              {bottomLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link key={link.name} href={link.href}>
                    <span className={`
                      flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all
                      ${isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }
                    `}>
                      <Icon className="h-4 w-4" />
                      {link.name}
                    </span>
                  </Link>
                );
              })}
            </nav>
            <div className="mt-4 flex flex-col gap-3 px-3 py-2 border-t pt-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs uppercase">
                  {user?.email?.charAt(0) || "U"}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-medium truncate">{user?.email || "User"}</span>
                  <span className="text-xs text-muted-foreground">Free Plan</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-red-400" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col w-full min-w-0">
        <header className="flex h-16 items-center gap-4 border-b bg-background px-6 lg:px-8">
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
