import { NextRequest, NextResponse } from "next/server";
import getStripe from "@/lib/stripe";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = getStripe();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("[Stripe Webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const email = session.customer_details?.email;
        const customerId =
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id;
        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;

        if (!email || !customerId) {
          console.error("[Stripe Webhook] Missing email or customerId");
          break;
        }

        await prisma.client.upsert({
          where: { email },
          update: {
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId || null,
            planStatus: "active",
          },
          create: {
            email,
            name: session.customer_details?.name || null,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId || null,
            plan: "country-monitor",
            planStatus: "active",
          },
        });

        console.log(`[Stripe Webhook] Client created/updated: ${email}`);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const status = subscription.status;

        const planStatus =
          status === "active"
            ? "active"
            : status === "past_due"
              ? "past_due"
              : status === "canceled"
                ? "cancelled"
                : status;

        await prisma.client.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: { planStatus },
        });

        console.log(
          `[Stripe Webhook] Subscription ${subscription.id} → ${planStatus}`
        );
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;

        await prisma.client.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: { planStatus: "cancelled" },
        });

        console.log(
          `[Stripe Webhook] Subscription ${subscription.id} cancelled`
        );
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const customerId =
          typeof invoice.customer === "string"
            ? invoice.customer
            : invoice.customer?.id;

        if (customerId) {
          await prisma.client.updateMany({
            where: { stripeCustomerId: customerId },
            data: { planStatus: "past_due" },
          });

          console.log(
            `[Stripe Webhook] Payment failed for customer ${customerId}`
          );
        }
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error("[Stripe Webhook] Processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
