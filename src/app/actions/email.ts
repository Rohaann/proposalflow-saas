"use server";

import { Resend } from "resend";
import { supabase } from "@/lib/supabase/client"; // For saving activity logs

const resend = new Resend(process.env.RESEND_API_KEY);

// Dummy sender domain
const FROM_EMAIL = "ProposalFlow AI <onboarding@resend.dev>"; 

export async function sendProposalEmailAction(dealId: string, clientEmail: string, clientName: string, portalUrl: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: clientEmail,
      subject: `Your Proposal is Ready - ProposalFlow AI`,
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px;">
          <h2>Hi ${clientName},</h2>
          <p>Your proposal is ready for review.</p>
          <p>Please click the link below to access your secure client portal where you can review the proposal, sign the contract, and pay the deposit.</p>
          <a href="${portalUrl}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 6px; margin-top: 20px;">View Proposal</a>
        </div>
      `,
    });

    if (error) throw new Error(error.message);

    // Update deal status to 'Sent' and log activity
    await supabase.from("deals").update({ status: "Sent" }).eq("id", dealId);
    await supabase.from("activity_logs").insert({
      deal_id: dealId,
      action: "Email Sent: Proposal",
      details: `Sent to ${clientEmail}`,
    });

    return { success: true };
  } catch (err: any) {
    console.error("Failed to send email:", err);
    return { success: false, error: err.message };
  }
}

export async function sendFollowUpEmailAction(dealId: string, clientEmail: string, clientName: string, portalUrl: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: clientEmail,
      subject: `Checking in - ProposalFlow AI`,
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px;">
          <h2>Hi ${clientName},</h2>
          <p>Just checking in to see if you had any questions about the proposal I sent over?</p>
          <p>You can view it again here:</p>
          <a href="${portalUrl}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 6px; margin-top: 20px;">View Proposal</a>
        </div>
      `,
    });

    if (error) throw new Error(error.message);

    await supabase.from("activity_logs").insert({
      deal_id: dealId,
      action: "Email Sent: Follow-Up",
      details: `Sent to ${clientEmail}`,
    });

    return { success: true };
  } catch (err: any) {
    console.error("Failed to send email:", err);
    return { success: false, error: err.message };
  }
}
