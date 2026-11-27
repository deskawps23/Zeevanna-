import { useState } from "react";
import { susunPayloadPratinjau } from "../config/strukturPeran";

const CHIP_KEBUTUHAN = [
  "Setrika Pakaian",
  "Housekeeping Harian",
  "Beres-Beres Rumah",
  "Layanan Rutin Mingguan",
];

export default function FormPelanggan({
  mode,
  peran,
  onBukaRuangSantai,
  onHasilPratinjau,
}) {
  const [nama, setNama] = useState("");
  const [kontak, setKontak] = useState("");
  const [kebutuhan, setKebutuhan] = useState("");
  const [pesanValidasi, setPesanValidasi] = useState("");

  function handleTambahChip(teksChip) {
    setKebutuhan((prev) => {
      const bersih = prev.trim();
      if (!bersih) return teksChip;
      if (bersih.toLowerCase().includes(teksChip.toLowerCase())) return prev;
      return `${bersih}, ${teksChip}`;
    });
    if (pesanValidasi) setPesanValidasi("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    const hasil = susunPayloadPratinjau({
      mode,
      peran,
      nama,
      kontak,
      isianUtama: kebutuhan,
    });

    if (!hasil.ok) {
      setPesanValidasi(hasil.pesan);
      onHasilPratinjau(null);
      return;
    }

    setPesanValidasi("");
    onHasilPratinjau(hasil.data);
  }

  return (
    <section
      style={{
        backgroundColor: "var(--permukaan-kartu)",
        borderColor: "var(--garis-halus)",
      }}
      className="rounded-2xl border p-4 sm:p-5 space-y-4 animasi-masuk-lembut"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <span
            style={{
              backgroundColor: "var(--pink-lembut)",
              color: "var(--burgundy-utama)",
            }}
            className="inline-flex items-center px-2.5 py-0.5 rounded-xl text-[11px] font-semibold"
          >
            Jalur Pelanggan • pel-
          </span>
          <h2
            style={{ color: "var(--teks-utama)" }}
            className="text-base font-semibold mt-1.5"
          >
            Kebutuhan Layanan Pelanggan
          </h2>
          <p
            style={{ color: "var(--teks-redup)" }}
            className="text-xs mt-0.5"
          >
            Isi kebutuhan layanan Anda atau mampir ke Ruang Santai sesama pelanggan
          </p>
        </div>

        <button
          type="button"
          onClick={onBukaRuangSantai}
          style={{
            backgroundColor: "var(--ungu-lembut)",
            color: "var(--ungu-aksen)",
          }}
          className="min-h-[44px] px-3.5 rounded-xl text-xs font-medium transition-colors duration-150 shrink-0"
        >
          Ruang Santai
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="space-y-1">
          <label
            htmlFor="pel-nama"
            style={{ color: "var(--teks-utama)" }}
            className="block text-xs font-medium"
          >
            Nama Lengkap / Panggilan
          </label>
          <input
            id="pel-nama"
            type="text"
            value={nama}
            onChange={(e) => {
              setNama(e.target.value);
              if (pesanValidasi) setPesanValidasi("");
            }}
            placeholder="Contoh: Rina Sari"
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
            htmlFor="pel-kontak"
            style={{ color: "var(--teks-utama)" }}
            className="block text-xs font-medium"
          >
            Nomor WhatsApp / Kontak
          </label>
          <input
            id="pel-kontak"
            type="text"
            value={kontak}
            onChange={(e) => {
              setKontak(e.target.value);
              if (pesanValidasi) setPesanValidasi("");
            }}
            placeholder="Contoh: 0812xxxxxxxx"
            style={{
              backgroundColor: "var(--bg-tulang)",
              borderColor: "var(--garis-halus)",
              color: "var(--teks-utama)",
            }}
            className="w-full min-h-[44px] rounded-xl border px-3.5 py-2.5 text-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#5c162e]/30"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="pel-kebutuhan"
              style={{ color: "var(--teks-utama)" }}
              className="block text-xs font-medium"
            >
              Catatan Kebutuhan
            </label>
            <span
              style={{ color: "var(--teks-redup)" }}
              className="text-[11px]"
            >
              Pilihan cepat:
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {CHIP_KEBUTUHAN.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleTambahChip(chip)}
                style={{
                  backgroundColor: "var(--pink-lembut)",
                  color: "var(--burgundy-utama)",
                }}
                className="min-h-[44px] px-3 py-1.5 rounded-xl text-xs font-medium transition-colors duration-150"
              >
                + {chip}
              </button>
            ))}
          </div>

          <textarea
            id="pel-kebutuhan"
            rows={3}
            value={kebutuhan}
            onChange={(e) => {
              setKebutuhan(e.target.value);
              if (pesanValidasi) setPesanValidasi("");
            }}
            placeholder="Tuliskan detail layanan, jadwal, atau catatan tambahan"
            style={{
              backgroundColor: "var(--bg-tulang)",
              borderColor: "var(--garis-halus)",
              color: "var(--teks-utama)",
            }}
            className="w-full rounded-xl border px-3.5 py-2.5 text-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#5c162e]/30"
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
          Perbarui Pratinjau Kebutuhan
        </button>
      </form>
    </section>
  );
}
