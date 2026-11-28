function doPost(e) {
  try {
    const raw = e && e.postData && e.postData.contents ? e.postData.contents : "{}";
    const data = JSON.parse(raw);

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("Transactions") || ss.getActiveSheet();

    sheet.appendRow([
      new Date(),
      data.txId || "",
      data.entityId || "",
      data.zone || "",
      data.paymentMethod || "",
      data.grossAmount || 0,
      data.status || "",
      JSON.stringify(data)
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({
        ok: true,
        txId: data.txId || null,
        receivedAt: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({
        ok: false,
        error: String(err && err.message ? err.message : err)
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
