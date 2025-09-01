import type { RequestHandler } from "express";
import { error, success } from "../lib/response";
import { emitEvent } from "../lib/eventBus";

export const createCheckoutSession: RequestHandler = async (req, res) => {
  const plan = req.body?.plan;
  if (!plan) return error(req, res, "INVALID_REQUEST", "Missing plan", undefined, 400);

  // Stub until Stripe is configured
  return error(
    req,
    res,
    "STRIPE_NOT_CONFIGURED",
    "Stripe not configured. Set STRIPE_SECRET_KEY and price IDs to enable checkout.",
    undefined,
    501,
    false,
  );
};

export const createBillingPortal: RequestHandler = async (req, res) => {
  // Stub until Stripe is configured
  return error(
    req,
    res,
    "STRIPE_NOT_CONFIGURED",
    "Stripe not configured. Set STRIPE_SECRET_KEY to enable portal.",
    undefined,
    501,
    false,
  );
};

export const stripeWebhook: RequestHandler = async (req, res) => {
  // Accept webhook and enqueue event without verification until configured
  await emitEvent("billing.webhook_received_unverified", { receivedAt: new Date().toISOString() });
  return success(req, res, { received: true });
};
