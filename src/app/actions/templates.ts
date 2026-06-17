"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveTemplateAction(type: 'proposal' | 'contract' | 'invoice', name: string, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase.from("templates").insert({
    user_id: user.id,
    type,
    name,
    content
  }).select().single();

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/templates");
  return data;
}

export async function getTemplatesAction(type?: 'proposal' | 'contract' | 'invoice') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  let query = supabase.from("templates").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
  if (type) {
    query = query.eq("type", type);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return data;
}

export async function deleteTemplateAction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("templates").delete().eq("id", id).eq("user_id", user.id);
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/templates");
  return true;
}
