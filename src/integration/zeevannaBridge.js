import { resolveRole } from "../auth/resolveRole.js";
import { buildSheetPayload } from "../finance/buildSheetPayload.js";
import { sendToAppsScript } from "../finance/sendToAppsScript.js";

export function getActiveRole(user, roleMap = {}, superAdminEmails = []) {
  return resolveRole(user, roleMap, superAdminEmails);
}

export function canExecuteAdminControl(role) {
  return role === "super_admin";
}

export async function recordTransactionEvent({
  endpointUrl,
  user,
  roleMap = {},
  superAdminEmails = [],
  roleContext,
  requireSuperAdmin = false,
  txId,
  entityId,
  paymentMethod = "qris",
  grossAmount = 0,
  status = "pending",
  zone = "pandeglang-z1"
}) {
  const resolvedRole = roleContext || getActiveRole(user, roleMap, superAdminEmails);

  if (requireSuperAdmin && !canExecuteAdminControl(resolvedRole)) {
    throw new Error("Akses ditolak: aksi ini hanya diizinkan untuk Super Admin ASAS");
  }

  const resolvedEntityId = entityId || user?.uid || user?.email || "guest";
  const resolvedTxId = txId || `TX-${Date.now()}`;

  const payload = buildSheetPayload({
    txId: resolvedTxId,
    roleContext: resolvedRole,
    entityId: resolvedEntityId,
    paymentMethod,
    grossAmount,
    status,
    zone
  });

  const result = await sendToAppsScript(endpointUrl, payload);
  return { payload, result };
}
