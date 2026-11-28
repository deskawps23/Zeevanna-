import fs from "node:fs";
import path from "node:path";
import { recordTransactionEvent } from "../src/integration/zeevannaBridge.js";

const envPath = path.resolve(".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) {
      const val = m[2].replace(/^["']|["']$/g, "");
      if (!process.env[m[1]]) process.env[m[1]] = val;
    }
  }
}

const url = (process.env.APPS_SCRIPT_URL || "").trim();
const email = (process.env.TEST_SUPER_ADMIN_EMAIL || "").trim();

if (!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(url)) {
  console.error("STOP: APPS_SCRIPT_URL belum berupa URL /exec yang valid:", url);
  process.exit(1);
}
if (!email || email.includes("<") || email.includes("domain-anda")) {
  console.error("STOP: TEST_SUPER_ADMIN_EMAIL belum diisi email asli:", email);
  process.exit(1);
}

const res = await recordTransactionEvent({
  endpointUrl: url,
  txId: `LIVE-${Date.now()}`,
  entityId: "super-admin-check",
  paymentMethod: "QRIS",
  grossAmount: 100000,
  status: "LIVE_PING",
  zone: "ZONA-1",
  user: { email },
  superAdminEmails: [email],
  requireSuperAdmin: true,
});

console.log(JSON.stringify(res, null, 2));
