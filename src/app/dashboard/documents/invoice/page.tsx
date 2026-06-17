"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { convertDocumentToDealAction } from "@/app/actions/deals";
import { saveTemplateAction, getTemplatesAction } from "@/app/actions/templates";
import { Loader2, Receipt, ArrowRight, Plus, Trash2, Save, FolderOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function InvoiceGeneratorPage() {
  const router = useRouter();
  const [items, setItems] = useState<{ description: string; price: number }[]>([
    { description: "", price: 0 }
  ]);
  const [isConverting, setIsConverting] = useState(false);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [savedTemplates, setSavedTemplates] = useState<any[]>([]);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);

  const handleAddItem = () => {
    setItems([...items, { description: "", price: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: 'description' | 'price', value: string) => {
    const newItems = [...items];
    if (field === 'price') {
      newItems[index][field] = parseFloat(value) || 0;
    } else {
      newItems[index][field] = value;
    }
    setItems(newItems);
  };

  const handleConvertToDeal = async () => {
    const validItems = items.filter(i => i.description.trim() !== "");
    if (validItems.length === 0) {
      alert("Please add at least one valid line item.");
      return;
    }
    setIsConverting(true);
    try {
      const deal = await convertDocumentToDealAction('invoice', JSON.stringify(validItems));
      router.push(`/dashboard/deals/${deal.id}`);
    } catch (error) {
      console.error(error);
      alert("Failed to convert to deal.");
    } finally {
      setIsConverting(false);
    }
  };

  const handleSaveTemplate = async () => {
    const validItems = items.filter(i => i.description.trim() !== "");
    if (validItems.length === 0) return alert("Add an item first.");
    const name = prompt("Enter a name for this invoice template:");
    if (!name) return;
    setIsSavingTemplate(true);
    try {
      await saveTemplateAction('invoice', name, JSON.stringify(validItems));
      alert("Template saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to save template.");
    } finally {
      setIsSavingTemplate(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const data = await getTemplatesAction('invoice');
      setSavedTemplates(data);
    } catch (error) {
      console.error(error);
    }
  };

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Invoice Builder</h1>
        <p className="text-muted-foreground mt-1">Quickly draft an invoice with line items.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Line Items</CardTitle>
            <CardDescription>Add the services and prices for this invoice.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isTemplatesOpen} onOpenChange={setIsTemplatesOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" onClick={fetchTemplates}>
                  <FolderOpen className="mr-2 h-4 w-4" /> Load Template
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Saved Templates</DialogTitle>
                  <DialogDescription>Select a previously saved invoice template.</DialogDescription>
                </DialogHeader>
                <div className="space-y-2 mt-4 max-h-[300px] overflow-y-auto">
                  {savedTemplates.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No templates found.</p>
                  ) : (
                    savedTemplates.map(t => (
                      <Button 
                        key={t.id} 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => {
                          try {
                            const parsed = JSON.parse(t.content);
                            setItems(parsed);
                          } catch (e) {}
                          setIsTemplatesOpen(false);
                        }}
                      >
                        <Receipt className="mr-2 h-4 w-4" /> {t.name}
                      </Button>
                    ))
                  )}
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={handleSaveTemplate} disabled={isSavingTemplate}>
              {isSavingTemplate ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Template
            </Button>
            <Button onClick={handleConvertToDeal} disabled={isConverting} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {isConverting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
              Convert to Deal
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <div className="space-y-3">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <Input 
                  className="flex-1"
                  placeholder="Service description"
                  value={item.description}
                  onChange={(e) => handleChange(idx, 'description', e.target.value)}
                />
                <div className="relative w-32">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input 
                    type="number"
                    className="pl-7"
                    placeholder="0.00"
                    value={item.price || ""}
                    onChange={(e) => handleChange(idx, 'price', e.target.value)}
                  />
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(idx)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>

          <Button variant="outline" onClick={handleAddItem} className="w-full border-dashed">
            <Plus className="mr-2 h-4 w-4" /> Add Item
          </Button>

          <div className="pt-6 border-t flex justify-between items-center text-xl font-bold">
            <span>Total:</span>
            <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total)}</span>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
