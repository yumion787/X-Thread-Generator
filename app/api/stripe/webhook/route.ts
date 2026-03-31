import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Stripe Webhook は生のボディが必要なため bodyParser を使わない
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  console.log("[Webhook] POST received");
  const rawBody = await request.text();
  const sig = request.headers.get("stripe-signature");
  console.log("[Webhook] sig present:", !!sig);

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  console.log("[Webhook] event.type:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.user_id;

    console.log("[Webhook] session.metadata:", session.metadata);
    console.log("[Webhook] userId:", userId);

    if (!userId) {
      console.error("[Webhook] Missing user_id in metadata");
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    // Service Role キーで RLS をバイパスしてクレジットを +10
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    console.log("[Webhook] Calling add_credits RPC for user:", userId);
    const { error } = await supabase.rpc("add_credits", {
      p_user_id: userId,
      p_amount: 10,
    });

    if (error) {
      console.error("[Webhook] Failed to add credits:", error);
      return NextResponse.json({ error: "Failed to add credits" }, { status: 500 });
    }

    console.log("[Webhook] Credits added successfully");
  }

  return NextResponse.json({ received: true });
}
