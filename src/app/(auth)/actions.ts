"use server"

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  try {
    const supabase = await createClient();

    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
      if (error.message.includes("fetch failed")) {
        return { error: "Could not connect to Supabase. Please ensure you have added a valid NEXT_PUBLIC_SUPABASE_URL and Anon Key to your .env.local file." };
      }
      return { error: error.message };
    }
  } catch (err: any) {
    if (err?.message?.includes("fetch failed") || err?.cause?.message?.includes("fetch failed")) {
      return { error: "Could not connect to Supabase. Please ensure you have a valid NEXT_PUBLIC_SUPABASE_URL in your .env.local file." };
    }
    return { error: "An unexpected error occurred during login." };
  }

  revalidatePath("/dashboard", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  try {
    const supabase = await createClient();

    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const { error } = await supabase.auth.signUp(data);

    if (error) {
      if (error.message.includes("fetch failed")) {
        return { error: "Could not connect to Supabase. Please ensure you have added a valid NEXT_PUBLIC_SUPABASE_URL and Anon Key to your .env.local file." };
      }
      return { error: error.message };
    }
  } catch (err: any) {
    if (err?.message?.includes("fetch failed") || err?.cause?.message?.includes("fetch failed")) {
      return { error: "Could not connect to Supabase. Please ensure you have a valid NEXT_PUBLIC_SUPABASE_URL in your .env.local file." };
    }
    return { error: "An unexpected error occurred during signup." };
  }

  revalidatePath("/dashboard", "layout");
  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
