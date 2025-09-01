import type { RequestHandler } from "express";
import Stripe from "stripe";
import { error, success } from "../lib/response";
import { emitEvent } from "../lib/eventBus";

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: "2024-06-20" as any });
}

export const createCheckoutSession: RequestHandler = async (req, res) => {
  const stripe = getStripe();
  const plan = req.body?.plan;
  if (!plan) return error(req, res, "INVALID_REQUEST", "Missing plan", undefined, 400);

  if (!stripe) {
    return error(
      req,
      res,
      "STRIPE_NOT_CONFIGURED",
      "Stripe not configured. Set STRIPE_SECRET_KEY to enable checkout.",
      undefined,
      501,
      false,
    );
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: process.env[`STRIPE_PRICE_${plan.toUpperCase()}` as any], quantity: 1 }],
      success_url: `${req.headers.origin || ""}/app/billing?success=1`,
      cancel_url: `${req.headers.origin || ""}/app/billing?canceled=1`,
    });

    await emitEvent("billing.checkout_session_created", { plan, sessionId: session.id });
    return success(req, res, { url: session.url });
  } catch (e: any) {
    return error(req, res, "STRIPE_ERROR", e?.message || "Stripe error", e, 502, true);
  }
};

export const createBillingPortal: RequestHandler = async (req, res) => {
  const stripe = getStripe();
  if (!stripe) {
    return error(
      req,
      res,
      "STRIPE_NOT_CONFIGURED",
      "Stripe not configured. Set STRIPE_SECRET_KEY to enable portal.",
      undefined,
      501,
      false,
    );
  }

  try {
    const customerId = req.query.customerId as string | undefined;
    if (!customerId) return error(req, res, "INVALID_REQUEST", "Missing customerId", undefined, 400);
    const session = await stripe.billingPortal.sessions.create({ customer: customerId, return_url: `${req.headers.origin || ""}/app/billing` });
    await emitEvent("billing.portal_session_created", { customerId, sessionId: session.id });
    return success(req, res, { url: session.url });
  } catch (e: any) {
    return error(req, res, "STRIPE_ERROR", e?.message || "Stripe error", e, 502, true);
  }
};

export const stripeWebhook: RequestHandler = async (req, res) => {
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const buf = (req as any).rawBody as Buffer | undefined;
  const stripe = getStripe();

  if (!stripe || !whSecret) {
    await emitEvent("billing.webhook_received_unverified", { info: "Stripe not configured" });
    return success(req, res, { received: true });
  }

  try {
    const sig = req.headers["stripe-signature"] as string;
    const event = stripe.webhooks.constructEvent(buf!, sig, whSecret);
    await emitEvent("billing.webhook_received", { id: event.id, type: event.type });
    return success(req, res, { received: true });
  } catch (e: any) {
    return error(req, res, "WEBHOOK_VERIFY_FAILED", e?.message || "Invalid webhook", undefined, 400);
  }
};
