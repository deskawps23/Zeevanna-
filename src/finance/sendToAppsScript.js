export async function sendToAppsScript(endpointUrl, payload) {
  if (!endpointUrl) {
    throw new Error("Endpoint Google Apps Script belum diisi");
  }

  const response = await fetch(endpointUrl, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Gagal kirim ke Apps Script: HTTP ${response.status}`);
  }

  return response.text();
}
