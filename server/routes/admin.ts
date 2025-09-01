import type { RequestHandler } from "express";
import { success, error } from "../lib/response";
import { emitEvent, getOutboxSnapshot } from "../lib/eventBus";

// simple in-memory stores
let FEATURE_FLAGS: { key: string; enabled: boolean }[] = [
  { key: "new-analytics", enabled: true },
  { key: "beta-pos", enabled: false },
];
const DLQ: { id: string; reason: string }[] = [
  { id: "dlq-1", reason: "stripe webhook verify failed" },
  { id: "dlq-2", reason: "zapier timeout" },
];
const CONFIG_LOG: { id: string; change: string; at: string }[] = [
  { id: "cfg-1", change: "Updated plan pricing", at: new Date().toISOString() },
  { id: "cfg-2", change: "Rotated Slack webhook key", at: new Date().toISOString() },
];

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

export const getOutbox: RequestHandler = async (req, res) => {
  return success(req, res, { events: getOutboxSnapshot() });
};

export const getDLQ: RequestHandler = async (req, res) => {
  return success(req, res, { items: DLQ });
};

export const dlqReplay: RequestHandler = async (req, res) => {
  const id = req.body?.id as string | undefined;
  if (!id) return error(req, res, "INVALID_REQUEST", "Missing id", undefined, 400);
  await emitEvent("admin.dlq_replay_triggered", { id });
  return success(req, res, { ok: true });
};

export const getFeatureFlags: RequestHandler = async (req, res) => {
  return success(req, res, { flags: FEATURE_FLAGS });
};

export const setFeatureFlags: RequestHandler = async (req, res) => {
  const flags = req.body?.flags as typeof FEATURE_FLAGS | undefined;
  if (!flags) return error(req, res, "INVALID_REQUEST", "Missing flags", undefined, 400);
  FEATURE_FLAGS = flags;
  await emitEvent("admin.feature_flags_updated", { flags });
  return success(req, res, { ok: true });
};

export const getConfigChanges: RequestHandler = async (req, res) => {
  return success(req, res, { items: CONFIG_LOG });
};

export const listStripeEvents: RequestHandler = async (req, res) => {
  const events = [
    { id: "evt_1", type: "invoice.payment_succeeded", created_at: new Date().toISOString() },
    { id: "evt_2", type: "invoice.payment_failed", created_at: new Date().toISOString() },
  ];
  return success(req, res, { events });
};

export const reconcileSubscriptions: RequestHandler = async (req, res) => {
  await emitEvent("billing.reconcile_requested", { at: new Date().toISOString() });
  return success(req, res, { ok: true });
};

export const sendInvite: RequestHandler = async (req, res) => {
  const { email, org } = req.body || {};
  if (!email) return error(req, res, "INVALID_REQUEST", "Missing email", undefined, 400);
  await emitEvent("admin.invite_sent", { email, org });
  return success(req, res, { ok: true });
};

export const rbacUpdate: RequestHandler = async (req, res) => {
  await emitEvent("admin.rbac_updated", { matrix: req.body?.matrix });
  return success(req, res, { ok: true });
};

export const gdprExport: RequestHandler = async (req, res) => {
  await emitEvent("admin.gdpr_export_requested", { email: req.body?.email });
  return success(req, res, { ok: true });
};

export const gdprDelete: RequestHandler = async (req, res) => {
  await emitEvent("admin.gdpr_delete_scheduled", { email: req.body?.email });
  return success(req, res, { ok: true });
};

export const rotateKeys: RequestHandler = async (req, res) => {
  await emitEvent("integrations.keys_rotated", { at: new Date().toISOString() });
  return success(req, res, { ok: true });
};

export const revokeKeys: RequestHandler = async (req, res) => {
  await emitEvent("integrations.keys_revoked", { at: new Date().toISOString() });
  return success(req, res, { ok: true });
};

export const retrySyncs: RequestHandler = async (req, res) => {
  await emitEvent("integrations.retry_syncs", { at: new Date().toISOString() });
  return success(req, res, { ok: true });
};
