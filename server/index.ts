import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { attachRequestId, errorHandler, success } from "./lib/response";
import { createCheckoutSession, createBillingPortal, stripeWebhook } from "./routes/stripe";
import { exportAuditCSV, impersonate, replayError, getOutbox, getDLQ, dlqReplay, getFeatureFlags, setFeatureFlags, getConfigChanges, listStripeEvents, reconcileSubscriptions, sendInvite, rbacUpdate, gdprExport, gdprDelete, rotateKeys, revokeKeys, retrySyncs } from "./routes/admin";

export function createServer() {
  const app = express();

  // Core middleware
  app.use(cors());
  app.use(attachRequestId);

  // Webhook must receive raw body for signature verification
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    (req, _res, next) => {
      (req as any).rawBody = req.body as Buffer;
      next();
    },
    stripeWebhook,
  );

  // JSON parsing for other routes
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health & demo
  app.get("/api/ping", (req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    return success(req, res, { message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Billing routes
  app.post("/api/billing/checkout-session", createCheckoutSession);
  app.get("/api/billing/portal", createBillingPortal);

  // Super Admin routes (secured via Supabase RLS in real setup)
  app.get("/api/admin/audit/export", exportAuditCSV);
  app.post("/api/admin/impersonate", impersonate);
  app.post("/api/admin/errors/replay", replayError);
  app.get("/api/admin/events/outbox", getOutbox);
  app.get("/api/admin/dlq", getDLQ);
  app.post("/api/admin/dlq/replay", dlqReplay);
  app.get("/api/admin/feature-flags", getFeatureFlags);
  app.post("/api/admin/feature-flags", setFeatureFlags);
  app.get("/api/admin/config-changes", getConfigChanges);
  app.get("/api/admin/stripe/events", listStripeEvents);
  app.post("/api/admin/subscriptions/reconcile", reconcileSubscriptions);
  app.post("/api/admin/invites/send", sendInvite);
  app.post("/api/admin/rbac/update", rbacUpdate);
  app.post("/api/admin/gdpr/export", gdprExport);
  app.post("/api/admin/gdpr/delete", gdprDelete);
  app.post("/api/admin/integrations/rotate", rotateKeys);
  app.post("/api/admin/integrations/revoke", revokeKeys);
  app.post("/api/admin/integrations/retry-syncs", retrySyncs);

  // Error handler last
  app.use(errorHandler);

  return app;
}
