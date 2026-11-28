export const KECAMATAN_ZONA_1 = [
  "pandeglang",
  "majasari",
  "karangtanjung",
  "cadasari",
  "koroncong",
  "kaduhejo",
];

export function validasiWilayahZona1(teksWilayah = "") {
  const normal = String(teksWilayah).trim().toLowerCase();
  return KECAMATAN_ZONA_1.some((kec) => normal.includes(kec));
}
export const MODE_UTAMA = {
  PELANGGAN: "pelanggan",
  TIM_MITRA: "tim_mitra",
};

export const KATEGORI_PERAN = {
  PELANGGAN: "pelanggan",
  STAF_TIM: "staf_tim",
  MITRA: "mitra",
};

export function buatMetadataDasar(mode, peran) {
  const adalahPelanggan = mode === MODE_UTAMA.PELANGGAN;
  const kategoriValid = adalahPelanggan
    ? KATEGORI_PERAN.PELANGGAN
    : peran === KATEGORI_PERAN.MITRA
    ? KATEGORI_PERAN.MITRA
return {
  ok: false,
  pesan:
    "Wilayah harus termasuk Zona 1 (Pandeglang, Majasari, Karangtanjung, Cadasari, Koroncong, atau Kaduhejo).",
  data: null,

  return {
    tipe_pendaftar: adalahPelanggan ? MODE_UTAMA.PELANGGAN : MODE_UTAMA.TIM_MITRA,
    kategori_peran: kategoriValid,
    awalan_id: adalahPelanggan ? "pel-" : "tm-",
  };
}

export function susunPayloadPratinjau({ mode, peran, nama, kontak, isianUtama }) {
  const namaBersih = (nama || "").trim();
  const kontakBersih = (kontak || "").trim();
  const isianBersih = (isianUtama || "").trim();

  if (!namaBersih) {
    return {
      ok: false,
      pesan: "Nama perlu diisi terlebih dahulu.",
if (peran === KATEGORI_PERAN.MITRA && !validasiWilayahZona1(isianBersih)) {
  return {
    ok: false,
    pesan:
      "Wilayah Zona 1 harus mencakup Pandeglang, Majasari, Karangtanjung, Cadasari, Koroncong, atau Kaduhejo.",
    data: null,
  };
}
      data: null,
    };
  }

  if (!kontakBersih) {
    return {
      ok: false,
      pesan: "Nomor WhatsApp / kontak perlu diisi terlebih dahulu.",
      data: null,
    };
  }

  if (!isianBersih) {
    const pesanIsian =
      mode === MODE_UTAMA.PELANGGAN
        ? "Catatan kebutuhan perlu diisi terlebih dahulu."
        : peran === KATEGORI_PERAN.MITRA
        ? "Wilayah atau bentuk kemitraan perlu diisi terlebih dahulu."
        : "Unit atau divisi internal perlu diisi terlebih dahulu.";

    return {
      ok: false,
      pesan: pesanIsian,
      data: null,
    };
  }

  const meta = buatMetadataDasar(mode, peran);
  const bidangKhusus =
    meta.tipe_pendaftar === MODE_UTAMA.PELANGGAN
      ? { kebutuhan: isianBersih }
      : meta.kategori_peran === KATEGORI_PERAN.STAF_TIM
      ? { unit_kerja: isianBersih }
      : { area_kemitraan: isianBersih };

  return {
    ok: true,
    pesan: "",
    data: {
      ...meta,
      nama: namaBersih,
      kontak: kontakBersih,
      ...bidangKhusus,
      mode_penyimpanan: "pratinjau_lokal",
    },
  };
}
