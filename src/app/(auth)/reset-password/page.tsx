"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Presentation, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050807] p-4 font-sans text-white">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#00FF73]/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#00FF73] flex items-center justify-center shadow-[0_0_20px_rgba(0,255,115,0.3)] mb-4">
            <Presentation className="h-6 w-6 text-black" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Set new password</h1>
          <p className="text-sm text-[#8FAD96]">Please enter your new password below.</p>
        </div>

        <Card className="bg-[#101D16] border-[#00DC5A]/20 shadow-2xl overflow-hidden">
          <CardContent className="pt-6 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm bg-red-500/10 border border-red-500/20 text-red-400 rounded-md">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#DFF0E5]">New Password</label>
                <Input 
                  name="password"
                  type="password" 
                  required
                  className="bg-[#0B1410] border-[#00DC5A]/20 focus-visible:ring-[#00FF73]/50 text-white"
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full bg-[#00FF73] hover:bg-[#00DD62] text-black font-bold h-11">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Update password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
