import type { RequestHandler } from "express";
import { success, error } from "../lib/response";
import { emitEvent } from "../lib/eventBus";

export const exportAuditCSV: RequestHandler = async (req, res) => {
  const csv = [
    "id,org,user,action,created_at",
    `e1,TechCorp,admin@techcorp.com,billing.subscription_updated,${new Date().toISOString()}`,
  ].join("\n");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="audit-${Date.now()}.csv"`);
  return res.status(200).send(csv);
};

export const impersonate: RequestHandler = async (req, res) => {
  const userId = req.body?.userId as string | undefined;
  if (!userId) return error(req, res, "INVALID_REQUEST", "Missing userId", undefined, 400);
  await emitEvent("admin.impersonation_requested", { userId, requestedAt: new Date().toISOString() });
  return success(req, res, { ok: true, note: "Impersonation requires secure backend session exchange; stubbed here." });
};

export const replayError: RequestHandler = async (req, res) => {
  const id = req.body?.id as string | undefined;
  if (!id) return error(req, res, "INVALID_REQUEST", "Missing id", undefined, 400, false);
  await emitEvent("admin.error_replay_triggered", { id });
  return success(req, res, { ok: true });
};
