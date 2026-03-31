import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL!;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    success_url: `${origin}/?payment=success`,
    cancel_url: `${origin}/?payment=cancel`,
    customer_email: user.email,
    metadata: { user_id: user.id },
  });

  return NextResponse.json({ url: session.url });
}
