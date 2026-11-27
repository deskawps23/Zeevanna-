const SHEET_NAME = 'Pesanan';

const SPLIT_CONFIG = {
  operator: 0.35,
  kurir: 0.20,
  adminPic: 0.15,
  kasUsaha: 0.30
};

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Zeevanna Ops')
    .addItem('Refresh Rekap Bagi Hasil', 'refreshRekapBagiHasil')
    .addItem('Generate Laporan Harian', 'buatLaporanHarian')
    .addToUi();
}

function doGet(e) {
  const params = (e && e.parameter) ? e.parameter : {};
  const action = params.action || 'ping';

  if (action === 'status' && params.order_id) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet || sheet.getLastRow() < 2) {
      return jsonResponse({ status: 'not_found', message: 'Data pesanan belum tersedia.' });
    }

    const rows = sheet.getDataRange().getValues();
    const targetId = String(params.order_id).trim().toUpperCase();

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const rowOrderId = String(row[1] || '').trim().toUpperCase();
      if (rowOrderId === targetId) {
        return jsonResponse({
          status: 'success',
          order_id: row[1],
          nama: row[3],
          zona: row[2],
          layanan: row[6],
          alur_status: row[row.length - 1] || 'Menunggu Proses'
        });
      }
    }
    return jsonResponse({ status: 'not_found', message: 'Order ID tidak ditemukan.' });
  }

  return jsonResponse({ status: 'ok', service: 'Zeevanna Customer-Provider API aktif' });
}

function doPost(e) {
  try {
    const raw = (e && e.postData && e.postData.contents) ? e.postData.contents : '{}';
    const data = JSON.parse(raw);

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }

    const headers = [
      'Timestamp',
      'Order ID',
      'Zona',
      'Nama Pelanggan',
      'No. WA Pelanggan',
      'Bisnis / Unit',
      'Layanan',
      'Lokasi Penjemputan',
      'Detail Pesanan',
      'Metode Pembayaran',
      'Bukti / Ref QRIS',
      'Nominal (Opsional)',
      'Porsi Operator',
      'Porsi Kurir',
      'Porsi Admin/PIC',
      'Kas Usaha',
      'Update Terakhir',
      'Waktu Selesai',
      'Status Alur'
    ];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    }

    const orderId = data.order_id || generateOrderId();
    const nominal = extractNominal(data.detail || '');
    const porsiOperator = nominal > 0 ? Math.round(nominal * SPLIT_CONFIG.operator) : 0;
    const porsiKurir    = nominal > 0 ? Math.round(nominal * SPLIT_CONFIG.kurir) : 0;
    const porsiAdmin    = nominal > 0 ? Math.round(nominal * SPLIT_CONFIG.adminPic) : 0;
    const kasUsaha      = nominal > 0 ? (nominal - porsiOperator - porsiKurir - porsiAdmin) : 0;

    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      orderId,
      data.zona || 'Zona 1 - Kec. Pandeglang (Kab. Pandeglang)',
      data.nama || '-',
      data.no_wa || '-',
      data.bisnis || 'Zeevanna Digital & Service',
      data.layanan || '-',
      data.lokasi_penjemputan || '-',
      data.detail || '-',
      data.metode_pembayaran || '-',
      data.bukti_bayar_qris || '-',
      nominal,
      porsiOperator,
      porsiKurir,
      porsiAdmin,
      kasUsaha,
      '',
      '',
      '1. Pelanggan (Menunggu Kasir)'
    ]);

    return jsonResponse({
      status: 'success',
      order_id: orderId,
      alur_status: '1. Pelanggan (Menunggu Kasir)',
      message: 'Pesanan berhasil masuk ke sistem Zeevanna.'
    });

  } catch (err) {
    return jsonResponse({ status: 'error', message: err.message });
  }
}

function onEdit(e) {
  if (!e || !e.range) return;
  const sheet = e.range.getSheet();
  if (sheet.getName() !== SHEET_NAME) return;

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const statusCol = headers.indexOf('Status Alur') + 1;
  if (!statusCol || e.range.getColumn() !== statusCol || e.range.getRow() === 1) return;

  const newStatus = String(e.value || '').trim();
  const updatedAtCol = headers.indexOf('Update Terakhir') + 1;

  if (updatedAtCol > 0) {
    sheet.getRange(e.range.getRow(), updatedAtCol).setValue(new Date());
  }

  if (newStatus === '5. Selesai') {
    const selesaiCol = headers.indexOf('Waktu Selesai') + 1;
    if (selesaiCol > 0 && !sheet.getRange(e.range.getRow(), selesaiCol).getValue()) {
      sheet.getRange(e.range.getRow(), selesaiCol).setValue(new Date());
    }
  }
}

function refreshRekapBagiHasil() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const pesananSheet = ss.getSheetByName(SHEET_NAME);
  if (!pesananSheet || pesananSheet.getLastRow() < 2) {
    SpreadsheetApp.getUi().alert('Belum ada data pesanan pada tab "Pesanan".');
    return;
  }

  let rekapSheet = ss.getSheetByName('Rekap_Bagi_Hasil');
  if (!rekapSheet) {
    rekapSheet = ss.insertSheet('Rekap_Bagi_Hasil');
  }

  const data = pesananSheet.getDataRange().getValues();
  const headers = data[0];
  const idxZona = headers.indexOf('Zona');
  const idxNominal = headers.indexOf('Nominal (Opsional)');
  const idxOp = headers.indexOf('Porsi Operator');
  const idxKurir = headers.indexOf('Porsi Kurir');
  const idxAdmin = headers.indexOf('Porsi Admin/PIC');
  const idxKas = headers.indexOf('Kas Usaha');
  const idxStatus = headers.indexOf('Status Alur');

  let totalOmzet = 0;
  let omzetSelesai = 0;
  let porsiOpSelesai = 0;
  let porsiKurirSelesai = 0;
  let porsiAdminSelesai = 0;
  let kasSelesai = 0;
  const perZona = {};

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const nominal = Number(row[idxNominal] || 0);
    const status = String(row[idxStatus] || '');
    const zona = String(row[idxZona] || 'Zona 1 - Lainnya');
    const isSelesai = status === '5. Selesai';

    totalOmzet += nominal;
    if (!perZona[zona]) {
      perZona[zona] = { jumlahPesanan: 0, omzet: 0, selesai: 0 };
    }
    perZona[zona].jumlahPesanan += 1;
    perZona[zona].omzet += nominal;

    if (isSelesai) {
      omzetSelesai += nominal;
      porsiOpSelesai += Number(row[idxOp] || 0);
      porsiKurirSelesai += Number(row[idxKurir] || 0);
      porsiAdminSelesai += Number(row[idxAdmin] || 0);
      kasSelesai += Number(row[idxKas] || 0);
      perZona[zona].selesai += 1;
    }
  }

  rekapSheet.clear();
  const rowsOut = [
    ['REKAP BAGI HASIL ZEEVANNA DIGITAL & SERVICE', ''],
    ['Terakhir Diperbarui', new Date()],
    ['', ''],
    ['RINGKASAN KEUANGAN (PESANAN 5. SELESAI)', 'Nilai (Rp)'],
    ['Total Omzet Seluruh Pesanan', totalOmzet],
    ['Omzet Status 5. Selesai', omzetSelesai],
    ['Porsi Operator (35% - Selesai)', porsiOpSelesai],
    ['Porsi Kurir (20% - Selesai)', porsiKurirSelesai],
    ['Porsi Admin/PIC (15% - Selesai)', porsiAdminSelesai],
    ['Kas Usaha (30% - Selesai)', kasSelesai],
    ['', ''],
    ['REKAP ZONA 1 (KAB. PANDEGLANG)', 'Jumlah Pesanan | Selesai | Omzet (Rp)']
  ];

  Object.keys(perZona).forEach((z) => {
    const info = perZona[z];
    rowsOut.push([z, `${info.jumlahPesanan} pesanan | ${info.selesai} selesai | Rp ${info.omzet.toLocaleString('id-ID')}`]);
  });

  rekapSheet.getRange(1, 1, rowsOut.length, 2).setValues(rowsOut);
  rekapSheet.getRange('A1:B1').setFontWeight('bold');
  rekapSheet.getRange('A4:B4').setFontWeight('bold');
  rekapSheet.getRange('A12:B12').setFontWeight('bold');
  rekapSheet.getRange('B5:B10').setNumberFormat('#,##0');
  rekapSheet.autoResizeColumns(1, 2);

  SpreadsheetApp.getUi().alert('Rekap Bagi Hasil berhasil diperbarui.');
}

function buatLaporanHarian() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const pesananSheet = ss.getSheetByName(SHEET_NAME);
  if (!pesananSheet || pesananSheet.getLastRow() < 2) {
    SpreadsheetApp.getUi().alert('Belum ada data pesanan pada tab "Pesanan".');
    return;
  }

  const now = new Date();
  const tz = ss.getSpreadsheetTimeZone() || 'Asia/Jakarta';
  const todayStr = Utilities.formatDate(now, tz, 'yyyy-MM-dd');
  const lapName = `Laporan_${todayStr}`;

  let lapSheet = ss.getSheetByName(lapName);
  if (!lapSheet) {
    lapSheet = ss.insertSheet(lapName);
  }
  lapSheet.clear();

  const data = pesananSheet.getDataRange().getValues();
  const headers = data[0];
  const idxTs = headers.indexOf('Timestamp');
  const idxOrderId = headers.indexOf('Order ID');
  const idxNama = headers.indexOf('Nama Pelanggan');
  const idxZona = headers.indexOf('Zona');
  const idxBayar = headers.indexOf('Metode Pembayaran');
  const idxNominal = headers.indexOf('Nominal (Opsional)');
  const idxStatus = headers.indexOf('Status Alur');

  const todayRows = [[
    'Order ID',
    'Nama Pelanggan',
    'Zona',
    'Metode Pembayaran',
    'Nominal (Rp)',
    'Status Alur'
  ]];

  let subtotal = 0;

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const tsVal = row[idxTs];
    let rowDateStr = '';
    if (tsVal instanceof Date) {
      rowDateStr = Utilities.formatDate(tsVal, tz, 'yyyy-MM-dd');
    } else if (tsVal) {
      const parsed = new Date(tsVal);
      if (!isNaN(parsed.getTime())) {
        rowDateStr = Utilities.formatDate(parsed, tz, 'yyyy-MM-dd');
      }
    }

    if (rowDateStr === todayStr) {
      const nom = Number(row[idxNominal] || 0);
      subtotal += nom;
      todayRows.push([
        row[idxOrderId] || '-',
        row[idxNama] || '-',
        row[idxZona] || '-',
        row[idxBayar] || '-',
        nom,
        row[idxStatus] || '-'
      ]);
    }
  }

  lapSheet.getRange(1, 1, 1, 2).setValues([
    [`LAPORAN HARIAN ZEEVANNA (${todayStr})`, `Total Pesanan Hari Ini: ${todayRows.length - 1}`]
  ]);
  lapSheet.getRange(1, 1, 1, 2).setFontWeight('bold');

  lapSheet.getRange(3, 1, todayRows.length, todayRows[0].length).setValues(todayRows);
  lapSheet.getRange(3, 1, 3, todayRows[0].length).setFontWeight('bold');

  const totalRowIdx = 3 + todayRows.length;
  lapSheet.getRange(totalRowIdx, 1, 1, 5).setValues([
    ['TOTAL OMZET HARI INI', '', '', '', subtotal]
  ]);
  lapSheet.getRange(totalRowIdx, 1, 1, 5).setFontWeight('bold');
  lapSheet.autoResizeColumns(1, 6);

  SpreadsheetApp.getUi().alert(`Laporan harian (${lapName}) berhasil dibuat.`);
}

function generateOrderId() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(100 + Math.random() * 900);
  return `ZVN-${y}${m}${d}-${rand}`;
}

function extractNominal(text) {
  const match = String(text).replace(/\./g, '').match(/(?:rp\s*)?(\d{4,})/i);
  return match ? Number(match[1]) : 0;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
