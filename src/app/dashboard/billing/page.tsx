import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, CheckCircle2 } from "lucide-react";

export default function BillingPage() {
  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Plans</h1>
        <p className="text-muted-foreground mt-1">Manage your subscription and payment methods.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-border/60 shadow-sm relative overflow-hidden">
          <CardHeader>
            <CardTitle>Free Plan</CardTitle>
            <CardDescription>Perfect for getting started.</CardDescription>
            <div className="mt-4 flex items-baseline text-4xl font-extrabold">
              $0
              <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> 3 AI Deals per month</li>
              <li className="flex items-center gap-3 text-sm"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Basic PDF Exports</li>
              <li className="flex items-center gap-3 text-sm"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Standard Support</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>Current Plan</Button>
          </CardFooter>
        </Card>

        <Card className="border-primary shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
            RECOMMENDED
          </div>
          <CardHeader>
            <CardTitle>Pro Plan</CardTitle>
            <CardDescription>For serious freelancers.</CardDescription>
            <div className="mt-4 flex items-baseline text-4xl font-extrabold text-primary">
              $29
              <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm"><CheckCircle2 className="h-4 w-4 text-primary" /> Unlimited AI Deals</li>
              <li className="flex items-center gap-3 text-sm"><CheckCircle2 className="h-4 w-4 text-primary" /> Custom Brand Kit</li>
              <li className="flex items-center gap-3 text-sm"><CheckCircle2 className="h-4 w-4 text-primary" /> Pricing Intelligence</li>
              <li className="flex items-center gap-3 text-sm"><CheckCircle2 className="h-4 w-4 text-primary" /> Whitelabeled Client Portal</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full font-bold shadow-lg shadow-primary/20">Upgrade to Pro</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
