import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// Webhooks don't have a user session, so we MUST use the Service Role Key to bypass RLS.

// Since webhooks require a raw body, we handle it
export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2023-10-16" as any,
  });

  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  try {
    const rawBody = await req.text();
    const event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        // The dealId should be passed in client_reference_id or metadata
        const dealId = session.client_reference_id || session.metadata?.dealId;

        if (dealId) {
          // Update deal status to Paid
          await supabase.from("deals").update({ status: "Paid" }).eq("id", dealId);
          
          // Log the activity
          await supabase.from("activity_logs").insert({
            deal_id: dealId,
            action: "Payment Received",
            description: `Client paid via Stripe. Amount: ${session.amount_total ? session.amount_total / 100 : 0}`,
          });
        }
        break;
      
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook error:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }
}
