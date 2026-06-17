"use server";

import { createClient } from "@/lib/supabase/server";
import { DealSchema, Deal } from "@/lib/schema";
import { revalidatePath } from "next/cache";

export async function createDeal(data: Deal) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const parsed = DealSchema.parse(data);

  const { data: newDeal, error } = await supabase.from("deals").insert({
    ...parsed,
    user_id: user.id
  }).select().single();

  if (error) throw new Error(error.message);
  
  revalidatePath("/dashboard/deals");
  return newDeal;
}

export async function updateDeal(id: string, data: Partial<Deal>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: updatedDeal, error } = await supabase.from("deals")
    .update(data)
    .eq("id", id)
    .eq("user_id", user.id)
    .select().single();

  if (error) throw new Error(error.message);
  
  revalidatePath(`/dashboard/deals/${id}`);
  revalidatePath("/dashboard/deals");
  return updatedDeal;
}

export async function getDeal(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("deals").select("*").eq("id", id).single();
  if (error) throw new Error(error.message);
  return data;
}

export async function getDeals() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase.from("deals")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
    
  if (error) throw new Error(error.message);
  return data;
}

export async function convertDocumentToDealAction(documentType: 'proposal' | 'contract' | 'invoice', content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Create a minimal deal with just the content of the selected document
  const dealData: any = {
    user_id: user.id,
    client_name: "New Client from " + documentType,
    client_email: "",
    project_type: "Converted " + documentType,
    status: "Draft"
  };

  if (documentType === 'proposal') {
    dealData.proposal_content = content;
  } else if (documentType === 'contract') {
    dealData.contract_content = content;
  } else if (documentType === 'invoice') {
    dealData.invoice_items = JSON.parse(content || '[]'); // assuming stringified JSON for invoice items
  }

  const { data: newDeal, error } = await supabase.from("deals").insert(dealData).select().single();

  if (error) throw new Error(error.message);
  
  revalidatePath("/dashboard/deals");
  return newDeal;
}
