import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://sportscalendar.xyz";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email required" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "SportsCalendar Pro — 1 Year",
              description:
                "TV channels, pre-game context, detailed stats, faster refresh, multi-team feeds, and season archives.",
            },
            unit_amount: 999, // $9.99
          },
          quantity: 1,
        },
      ],
      success_url: `${BASE_URL}/pro/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/?upgrade=cancelled`,
      metadata: { plan: "pro-yearly" },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
