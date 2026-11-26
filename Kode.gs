
function doPost(e) {
  try {
    const raw = (e && e.postData && e.postData.contents) ? e.postData.contents : '{}';
    const data = JSON.parse(raw);

    if (data.action === 'register_driver') {
      const ss = SpreadsheetApp.openById('1CEMACd79hPIYmgAVay4AQHKmG0_ZFAN7-FknVn99Tu8');
      const sh = ss.getSheetByName('Mitra_Driver') || ss.insertSheet('Mitra_Driver');
      const idDriver = 'DRV-ZVN-' + Date.now();
      sh.appendRow([
        idDriver,
        new Date(),
        data.nama_lengkap || '',
        data.no_wa || '',
        data.kecamatan_zona_1 || '',
        data.alamat_domisili || '',
        data.jenis_kendaraan || '',
        data.plat_nomor || '',
        '',
        'Menunggu Verifikasi',
        ''
      ]);
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'ok', id_driver: idDriver }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ignored' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
