import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function PortalPage() {
  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Client Portal</h1>
        <p className="text-muted-foreground mt-1">Manage your whitelabeled portal links.</p>
      </div>

      <Card className="border-border/60 shadow-sm text-center py-20">
        <CardContent className="flex flex-col items-center justify-center gap-4">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold">Portal Feature Coming Soon</h2>
          <p className="text-muted-foreground max-w-md">
            Soon, you will be able to share a secure, branded link with your clients where they can view all their active proposals, sign contracts, and pay invoices in one place.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
