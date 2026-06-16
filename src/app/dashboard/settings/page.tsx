"use client";

import { useBrand, Currency } from "@/components/BrandContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";

export default function SettingsPage() {
  const { brand, setBrand } = useBrand();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate saving to backend
    alert("Brand Kit settings saved successfully!");
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your Brand Kit and global preferences.</p>
      </div>

      <form onSubmit={handleSave}>
        <Card>
          <CardHeader>
            <CardTitle>Brand Kit</CardTitle>
            <CardDescription>
              These settings will be applied to all your generated Proposals, Contracts, and Invoices.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company / Agency Name</Label>
                <Input 
                  id="companyName" 
                  value={brand.companyName} 
                  onChange={(e) => setBrand({ ...brand, companyName: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userName">Your Name</Label>
                <Input 
                  id="userName" 
                  value={brand.userName} 
                  onChange={(e) => setBrand({ ...brand, userName: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Contact Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={brand.email} 
                  onChange={(e) => setBrand({ ...brand, email: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Default Currency</Label>
                <Select 
                  value={brand.currency} 
                  onValueChange={(val) => setBrand({ ...brand, currency: (val as Currency) || "USD" })}
                >
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="AUD">AUD (A$)</SelectItem>
                    <SelectItem value="CAD">CAD (C$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="themeColor">Theme Color (Hex)</Label>
              <div className="flex gap-4 items-center">
                <Input 
                  id="themeColor" 
                  type="color" 
                  className="w-20 h-10 p-1"
                  value={brand.themeColor} 
                  onChange={(e) => setBrand({ ...brand, themeColor: e.target.value })} 
                />
                <Input 
                  value={brand.themeColor} 
                  onChange={(e) => setBrand({ ...brand, themeColor: e.target.value })} 
                  className="font-mono max-w-[150px]"
                />
              </div>
              <p className="text-xs text-muted-foreground">This color will be used for buttons and highlights on your client portal.</p>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/30 border-t px-6 py-4">
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" /> Save Settings
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
