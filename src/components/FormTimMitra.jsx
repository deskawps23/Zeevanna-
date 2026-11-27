import { useState } from "react";
import {
  KATEGORI_PERAN,
  susunPayloadPratinjau,
} from "../config/strukturPeran";

export default function FormTimMitra({
  mode,
  peran,
  onGantiPeran,
  onHasilPratinjau,
}) {
  const [nama, setNama] = useState("");
  const [kontak, setKontak] = useState("");
  const [isianKhusus, setIsianKhusus] = useState("");
  const [pesanValidasi, setPesanValidasi] = useState("");

  function handlePilihPeran(peranBaru) {
    if (peranBaru === peran) return;
    setNama("");
    setKontak("");
    setIsianKhusus("");
    setPesanValidasi("");
    onHasilPratinjau(null);
    onGantiPeran(peranBaru);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const hasil = susunPayloadPratinjau({
      mode,
      peran,
      nama,
      kontak,
      isianUtama: isianKhusus,
    });

    if (!hasil.ok) {
      setPesanValidasi(hasil.pesan);
      onHasilPratinjau(null);
      return;
    }

    setPesanValidasi("");
    onHasilPratinjau(hasil.data);
  }

  const adalahMitra = peran === KATEGORI_PERAN.MITRA;

  return (
    <section
      style={{
        backgroundColor: "var(--permukaan-kartu)",
        borderColor: "var(--garis-halus)",
      }}
      className="rounded-2xl border p-4 sm:p-5 space-y-4 animasi-masuk-lembut"
    >
      <div>
        <span
          style={{
            backgroundColor: "var(--ungu-lembut)",
            color: "var(--ungu-aksen)",
          }}
          className="inline-flex items-center px-2.5 py-0.5 rounded-xl text-[11px] font-semibold"
        >
          Jalur Tim &amp; Mitra • tm-
        </span>
        <h2
          style={{ color: "var(--teks-utama)" }}
          className="text-base font-semibold mt-1.5"
        >
          Pendataan Staf Tim &amp; Mitra
        </h2>
        <p
          style={{ color: "var(--teks-redup)" }}
          className="text-xs mt-0.5"
        >
          Pilih kategori peran terlebih dahulu; perpindahan peran akan membersihkan isian lama
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => handlePilihPeran(KATEGORI_PERAN.STAF_TIM)}
          style={{
            backgroundColor: !adalahMitra
              ? "var(--burgundy-utama)"
              : "var(--bg-tulang)",
            color: !adalahMitra
              ? "var(--permukaan-kartu)"
              : "var(--teks-utama)",
            borderColor: "var(--garis-halus)",
          }}
          className="min-h-[44px] px-3 py-2 rounded-xl border text-xs font-medium transition-colors duration-150"
        >
          Staf / Tim
        </button>

        <button
          type="button"
          onClick={() => handlePilihPeran(KATEGORI_PERAN.MITRA)}
          style={{
            backgroundColor: adalahMitra
              ? "var(--burgundy-utama)"
              : "var(--bg-tulang)",
            color: adalahMitra
              ? "var(--permukaan-kartu)"
              : "var(--teks-utama)",
            borderColor: "var(--garis-halus)",
          }}
          className="min-h-[44px] px-3 py-2 rounded-xl border text-xs font-medium transition-colors duration-150"
        >
          Mitra
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="space-y-1">
          <label
            htmlFor="tm-nama"
            style={{ color: "var(--teks-utama)" }}
            className="block text-xs font-medium"
          >
            Nama Lengkap
          </label>
          <input
            id="tm-nama"
            type="text"
            value={nama}
            onChange={(e) => {
              setNama(e.target.value);
              if (pesanValidasi) setPesanValidasi("");
            }}
            placeholder="Masukkan nama lengkap"
            style={{
              backgroundColor: "var(--bg-tulang)",
              borderColor: "var(--garis-halus)",
              color: "var(--teks-utama)",
            }}
            className="w-full min-h-[44px] rounded-xl border px-3.5 py-2.5 text-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#5c162e]/30"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="tm-kontak"
            style={{ color: "var(--teks-utama)" }}
            className="block text-xs font-medium"
          >
            Nomor WhatsApp / Kontak
          </label>
          <input
            id="tm-kontak"
            type="text"
            value={kontak}
            onChange={(e) => {
              setKontak(e.target.value);
              if (pesanValidasi) setPesanValidasi("");
            }}
            placeholder="Contoh: 0813xxxxxxxx"
            style={{
              backgroundColor: "var(--bg-tulang)",
              borderColor: "var(--garis-halus)",
              color: "var(--teks-utama)",
            }}
            className="w-full min-h-[44px] rounded-xl border px-3.5 py-2.5 text-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#5c162e]/30"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="tm-khusus"
            style={{ color: "var(--teks-utama)" }}
            className="block text-xs font-medium"
          >
            {adalahMitra ? "Wilayah / Bentuk Kemitraan" : "Unit / Divisi Internal"}
          </label>
          <input
            id="tm-khusus"
            type="text"
            value={isianKhusus}
            onChange={(e) => {
              setIsianKhusus(e.target.value);
              if (pesanValidasi) setPesanValidasi("");
            }}
            placeholder={
              adalahMitra
                ? "Contoh: Mitra operasional zona & layanan"
                : "Contoh: Operasional lapangan / administrasi"
            }
            style={{
              backgroundColor: "var(--bg-tulang)",
              borderColor: "var(--garis-halus)",
              color: "var(--teks-utama)",
            }}
            className="w-full min-h-[44px] rounded-xl border px-3.5 py-2.5 text-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#5c162e]/30"
          />
        </div>

        {pesanValidasi && (
          <p
            style={{
              backgroundColor: "var(--pink-lembut)",
              color: "var(--burgundy-gelap)",
            }}
            className="text-xs font-medium rounded-xl px-3.5 py-2.5 animasi-masuk-lembut"
          >
            {pesanValidasi}
          </p>
        )}

        <button
          type="submit"
          style={{
            backgroundColor: "var(--burgundy-utama)",
            color: "var(--permukaan-kartu)",
          }}
          className="w-full min-h-[46px] rounded-xl text-sm font-medium transition-colors duration-150"
        >
          Perbarui Pratinjau {adalahMitra ? "Mitra" : "Staf / Tim"}
        </button>
      </form>
    </section>
  );
}
