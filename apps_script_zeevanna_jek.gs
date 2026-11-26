const ZVN_SPREADSHEET_ID = '1CEMACd79hPIYmgAVay4AQHKmG0_ZFAN7-FknVn99Tu8';

function getZvnSpreadsheet_() {
  return SpreadsheetApp.openById(ZVN_SPREADSHEET_ID);
}

function setupZeevannaJekSheets() {
  const ss = getZvnSpreadsheet_();

  const driverHeaders = [
    'id_driver',
    'tanggal_daftar',
    'nama_lengkap',
    'no_wa',
    'kecamatan_zona_1',
    'alamat_domisili',
    'jenis_kendaraan',
    'plat_nomor',
    'dokumen_verifikasi',
    'status_mitra',
    'catatan_admin'
  ];

  const tripHeaders = [
    'id_trip',
    'tanggal_trip',
    'jam_trip',
    'id_driver',
    'nama_driver',
    'kecamatan_zona_1',
    'jarak_km',
    'tarif_dasar',
    'biaya_jarak',
    'total_tarif',
    'bagian_driver',
    'bagian_kas_admin',
    'metode_bayar',
    'status_rekap_20wib',
    'saldo_tunai_driver',
    'status_pencairan'
  ];

  ensureSheetWithHeaders_(ss, 'Mitra_Driver', driverHeaders);
  ensureSheetWithHeaders_(ss, 'Zeevanna_Jek_Trip', tripHeaders);
}

function updateZeevannaJekPayoutColumns() {
  const ss = getZvnSpreadsheet_();
  const sh = ss.getSheetByName('Zeevanna_Jek_Trip');
  if (!sh) return;

  const extraHeaders = [
    'batas_tunai_driver',
    'status_kliring_harian',
    'nominal_transfer_non_tunai',
    'tanggal_kliring',
    'catatan_kliring'
  ];

  const lastCol = Math.max(sh.getLastColumn(), 1);
  const currentHeaders = sh.getRange(1, 1, 1, lastCol).getValues()[0];

  extraHeaders.forEach((h) => {
    if (currentHeaders.indexOf(h) === -1) {
      const nextCol = sh.getLastColumn() + 1;
      sh.getRange(1, nextCol).setValue(h);
    }
  });
}

function ensureSheetWithHeaders_(ss, name, headers) {
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
  }
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, headers.length).setValues([headers]);
    sh.setFrozenRows(1);
  }
  return sh;
}

function doPost(e) {
  try {
    const raw = (e && e.postData && e.postData.contents) ? e.postData.contents : '{}';
    const data = JSON.parse(raw);
    const action = String(data.action || '').trim();

    if (action === 'register_driver') {
      const result = handleDriverRegistration_(data);
      return jsonResponse_(result);
    }

    return jsonResponse_({
      ok: false,
      message: 'Aksi tidak dikenali: ' + action
    });
  } catch (err) {
    return jsonResponse_({
      ok: false,
      message: err && err.message ? err.message : String(err)
    });
  }
}

function handleDriverRegistration_(data) {
  setupZeevannaJekSheets();
  const ss = getZvnSpreadsheet_();
  const sh = ss.getSheetByName('Mitra_Driver');

  const lastRow = sh.getLastRow();
  const nextNum = Math.max(1, lastRow);
  const idDriver = 'DRV-ZVN-' + String(nextNum).padStart(3, '0');
  const tz = Session.getScriptTimeZone() || 'Asia/Jakarta';
  const tanggalDaftar = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd HH:mm:ss');

  const nama = String(data.nama_lengkap || '').trim();
  const noWa = String(data.no_wa || '').trim();
  const kec = String(data.kecamatan_zona_1 || '').trim();
  const alamat = String(data.alamat_domisili || '').trim();
  const kendaraan = String(data.jenis_kendaraan || '').trim();
  const plat = String(data.plat_nomor || '').trim();
  const statusMitra = 'Menunggu Verifikasi';

  sh.appendRow([
    idDriver,
    tanggalDaftar,
    nama,
    noWa,
    kec,
    alamat,
    kendaraan,
    plat,
    'Pending',
    statusMitra,
    'Input via web form Zona 1 (rekap 20.00 WIB, batas tunai Rp100.000)'
  ]);

  return {
    ok: true,
    id_driver: idDriver,
    status_mitra: statusMitra,
    message: 'Pendaftaran mitra driver berhasil disimpan.'
  };
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
