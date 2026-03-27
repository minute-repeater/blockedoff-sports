import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { kv } from "@vercel/kv";
import crypto from "crypto";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email =
      session.customer_email || session.customer_details?.email;

    if (!email) {
      return NextResponse.json({ error: "No email" }, { status: 400 });
    }

    // Generate unique token
    const token = crypto.randomBytes(32).toString("hex");
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    const tokenData = {
      token,
      email,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      plan: "pro-yearly" as const,
      stripeSessionId: session.id,
    };

    // Store in KV with two keys for lookup
    const ttl = 366 * 24 * 60 * 60; // 366 days
    await kv.set(`token:${token}`, tokenData);
    await kv.expire(`token:${token}`, ttl);
    await kv.set(`email:${email}`, token);
    await kv.expire(`email:${email}`, ttl);
  }

  return NextResponse.json({ received: true });
}
