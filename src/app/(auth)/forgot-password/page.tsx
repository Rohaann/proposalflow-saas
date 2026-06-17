"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Presentation, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050807] p-4 font-sans text-white">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#00FF73]/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <Link href="/" className="flex items-center justify-center group mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#00FF73] flex items-center justify-center shadow-[0_0_20px_rgba(0,255,115,0.3)]">
              <Presentation className="h-6 w-6 text-black" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-white">Reset password</h1>
          <p className="text-sm text-[#8FAD96]">Enter your email to receive a reset link.</p>
        </div>

        <Card className="bg-[#101D16] border-[#00DC5A]/20 shadow-2xl overflow-hidden">
          <CardContent className="pt-6 space-y-4">
            {success ? (
              <div className="p-4 text-sm bg-green-500/10 border border-green-500/20 text-green-400 rounded-md text-center">
                Check your email for a password reset link.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 text-sm bg-red-500/10 border border-red-500/20 text-red-400 rounded-md">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#DFF0E5]">Email</label>
                  <Input 
                    name="email"
                    type="email" 
                    required
                    placeholder="m@example.com" 
                    className="bg-[#0B1410] border-[#00DC5A]/20 focus-visible:ring-[#00FF73]/50 text-white"
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full bg-[#00FF73] hover:bg-[#00DD62] text-black font-bold h-11">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Send reset link
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center border-t border-[#00DC5A]/10 py-4">
            <Link href="/login" className="flex items-center text-sm text-[#8FAD96] hover:text-[#00FF73] transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to login
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
