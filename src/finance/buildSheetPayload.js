import { splitPayment } from "./splitPayment.js";

export function buildSheetPayload({
  txId,
  roleContext,
  entityId,
  paymentMethod,
  grossAmount,
  status = "pending",
  zone = "pandeglang-z1"
}) {
  const split = splitPayment({ grossAmount });

  return {
    event_id: txId,
    timestamp_iso: new Date().toISOString(),
    group_unit: "ASAS_GROUP_GLOBAL_WORLD",
    service_unit: "ZEEVANNA",
    zone_code: zone,
    role_context: roleContext,
    entity_id: entityId,
    payment_method: paymentMethod,
    status,
    customer_bill: split.customerBill,
    partner_share: split.partnerShare,
    payroll_share: split.payrollShare,
    platform_fee: split.platformFee
  };
}
