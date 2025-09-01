import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { attachRequestId, errorHandler, success } from "./lib/response";
import { createCheckoutSession, createBillingPortal, stripeWebhook } from "./routes/stripe";

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

  // Error handler last
  app.use(errorHandler);

  return app;
}
