import React, { useState } from "react";

const STATUS_AWAL = [
  {
    id: "st-1",
    penulis: "Pelanggan Zona 1",
    prefiks: "pel-",
    waktu: "Baru saja",
    isi: "Hasil setrika rapi dan wanginya tahan lama, pas buat jadwal kerja minggu ini.",
    suka: 4,
    sudahSuka: false,
    hadiah: [],
    komentar: [
      {
        id: "km-1",
        nama: "Tim Zeevanna",
        isi: "Terima kasih atas ulasannya! Ditunggu pesanan berikutnya.",
      },
    ],
  },
];

const PILIHAN_HADIAH = [
  { id: "kopi", emoji: "☕", label: "Kopi Santai" },
  { id: "bintang", emoji: "⭐", label: "Bintang Rapi" },
  { id: "hati", emoji: "🩷", label: "Apresiasi" },
];

export default function RuangSantaiPelanggan({
  peranAktif = "pelanggan",
  kodeIdentitas = "pel-001",
}) {
  const [daftarStatus, setDaftarStatus] = useState(STATUS_AWAL);
  const [teksStatusBaru, setTeksStatusBaru] = useState("");
  const [namaPenulis, setNamaPenulis] = useState("");
  const [komentarTerbuka, setKomentarTerbuka] = useState({});
  const [drafKomentar, setDrafKomentar] = useState({});

  const handleKirimStatus = (e) => {
    e.preventDefault();
    const isiBersih = teksStatusBaru.trim();
    if (!isiBersih) return;

    const prefiks = peranAktif === "mitra" ? "tm-" : "pel-";
    const namaBersih = namaPenulis.trim() || `${prefiks}tamu`;

    const statusBaru = {
      id: `st-${Date.now()}`,
      penulis: namaBersih,
      prefiks,
      waktu: "Baru saja",
      isi: isiBersih,
      suka: 0,
      sudahSuka: false,
      hadiah: [],
      komentar: [],
    };

    setDaftarStatus((prev) => [statusBaru, ...prev]);
    setTeksStatusBaru("");
  };

  const handleToggleSuka = (idStatus) => {
    setDaftarStatus((prev) =>
      prev.map((item) => {
        if (item.id !== idStatus) return item;
        const berikutnya = !item.sudahSuka;
        return {
          ...item,
          sudahSuka: berikutnya,
          suka: berikutnya ? item.suka + 1 : Math.max(0, item.suka - 1),
        };
      })
    );
  };

  const handleBeriHadiah = (idStatus, hadiahId) => {
    setDaftarStatus((prev) =>
      prev.map((item) => {
        if (item.id !== idStatus) return item;
        return {
          ...item,
          hadiah: [...item.hadiah, hadiahId],
        };
      })
    );
  };

  const handleToggleKomentar = (idStatus) => {
    setKomentarTerbuka((prev) => ({
      ...prev,
      [idStatus]: !prev[idStatus],
    }));
  };

  const handleUbahDrafKomentar = (idStatus, field, nilai) => {
    setDrafKomentar((prev) => ({
      ...prev,
      [idStatus]: {
        nama: prev[idStatus]?.nama || "",
        isi: prev[idStatus]?.isi || "",
        [field]: nilai,
      },
    }));
  };

  const handleKirimKomentar = (e, idStatus) => {
    e.preventDefault();
    const draf = drafKomentar[idStatus] || { nama: "", isi: "" };
    const isiBersih = draf.isi.trim();
    if (!isiBersih) return;

    const namaBersih = draf.nama.trim() || "Anggota Ruang Santai";

    setDaftarStatus((prev) =>
      prev.map((item) => {
        if (item.id !== idStatus) return item;
        return {
          ...item,
          komentar: [
            ...item.komentar,
            {
              id: `km-${Date.now()}`,
              nama: namaBersih,
              isi: isiBersih,
            },
          ],
        };
      })
    );

    setDrafKomentar((prev) => ({
      ...prev,
      [idStatus]: { nama: draf.nama, isi: "" },
    }));
  };

  return (
    <section
      style={{
        backgroundColor: "var(--permukaan-kartu)",
        borderColor: "var(--garis-halus)",
      }}
      className="rounded-[44px] border p-4 space-y-3 animasi-masuk-lembut"
    >
      <div className="flex items-center justify-between gap-2 px-1">
        <div>
          <h2
            style={{ color: "var(--burgundy-utama)" }}
            className="text-sm font-bold"
          >
            Ruang Santai
          </h2>
          <p
            style={{ color: "var(--teks-redup)" }}
            className="text-[11px]"
          >
            Jalur aktif: {kodeIdentitas || (peranAktif === "mitra" ? "tm-" : "pel-")}
          </p>
        </div>
        <span
          style={{
            backgroundColor: "var(--pink-lembut)",
            color: "var(--burgundy-utama)",
          }}
          className="px-3 py-1 rounded-full text-[11px] font-semibold"
        >
          {daftarStatus.length} catatan
        </span>
      </div>

      <form onSubmit={handleKirimStatus} className="space-y-2">
        <input
          type="text"
          value={namaPenulis}
          onChange={(e) => setNamaPenulis(e.target.value)}
          placeholder="Nama / ID singkat (mis. pel-01 atau tm-01)"
          style={{
            backgroundColor: "var(--bg-tulang)",
            borderColor: "var(--garis-halus)",
            color: "var(--teks-utama)",
          }}
          className="w-full min-h-[44px] rounded-2xl border px-3.5 py-2 text-xs focus:outline-none"
        />
        <div className="flex gap-2">
          <input
            type="text"
            value={teksStatusBaru}
            onChange={(e) => setTeksStatusBaru(e.target.value)}
            placeholder="Bagikan kabar santai hari ini..."
            style={{
              backgroundColor: "var(--bg-tulang)",
              borderColor: "var(--garis-halus)",
              color: "var(--teks-utama)",
            }}
            className="flex-1 min-h-[44px] rounded-2xl border px-3.5 py-2 text-xs focus:outline-none"
          />
          <button
            type="submit"
            style={{
              backgroundColor: "var(--burgundy-utama)",
              color: "var(--permukaan-kartu)",
            }}
            className="min-h-[44px] px-4 rounded-2xl text-xs font-semibold shrink-0"
          >
            Kirim
          </button>
        </div>
      </form>

      <div className="space-y-2.5">
        {daftarStatus.map((status) => {
          const terbuka = !!komentarTerbuka[status.id];
          const draf = drafKomentar[status.id] || { nama: "", isi: "" };

          return (
            <article
              key={status.id}
              style={{
                backgroundColor: "var(--bg-tulang)",
                borderColor: "var(--garis-halus)",
              }}
              className="rounded-3xl border p-3.5 space-y-2.5 animasi-masuk-lembut"
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  style={{ color: "var(--teks-utama)" }}
                  className="text-xs font-bold"
                >
                  {status.penulis}
                </span>
                <span
                  style={{
                    backgroundColor: "var(--ungu-lembut)",
                    color: "var(--ungu-aksen)",
                  }}
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-medium"
                >
                  {status.waktu}
                </span>
              </div>

              <p
                style={{ color: "var(--teks-utama)" }}
                className="text-xs leading-relaxed"
              >
                {status.isi}
              </p>

              {status.hadiah.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {status.hadiah.map((hId, idx) => {
                    const info = PILIHAN_HADIAH.find((x) => x.id === hId);
                    if (!info) return null;
                    return (
                      <span
                        key={`${status.id}-h-${idx}`}
                        style={{
                          backgroundColor: "var(--pink-lembut)",
                          color: "var(--burgundy-utama)",
                        }}
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-medium"
                      >
                        {info.emoji} {info.label}
                      </span>
                    );
                  })}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <button
                  type="button"
                  onClick={() => handleToggleSuka(status.id)}
                  style={{
                    backgroundColor: status.sudahSuka
                      ? "var(--pink-lembut)"
                      : "var(--permukaan-kartu)",
                    borderColor: "var(--garis-halus)",
                    color: status.sudahSuka
                      ? "var(--burgundy-utama)"
                      : "var(--teks-utama)",
                  }}
                  className="min-h-[44px] px-3 rounded-2xl border text-xs font-medium"
                >
                  ♥ {status.suka}
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleKomentar(status.id)}
                  style={{
                    backgroundColor: "var(--permukaan-kartu)",
                    borderColor: "var(--garis-halus)",
                    color: "var(--teks-utama)",
                  }}
                  className="min-h-[44px] px-3 rounded-2xl border text-xs font-medium"
                >
                  Komentar ({status.komentar.length})
                </button>

                {PILIHAN_HADIAH.map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => handleBeriHadiah(status.id, h.id)}
                    style={{
                      backgroundColor: "var(--permukaan-kartu)",
                      borderColor: "var(--garis-halus)",
                      color: "var(--teks-utama)",
                    }}
                    className="min-h-[44px] px-2.5 rounded-2xl border text-xs font-medium"
                  >
                    {h.emoji}
                  </button>
                ))}
              </div>

              {terbuka && (
                <div className="space-y-2 pt-1 animasi-masuk-lembut">
                  {status.komentar.map((komen) => (
                    <div
                      key={komen.id}
                      style={{
                        backgroundColor: "var(--permukaan-kartu)",
                        borderColor: "var(--garis-halus)",
                      }}
                      className="rounded-2xl border px-3 py-2 space-y-0.5"
                    >
                      <div
                        style={{ color: "var(--teks-utama)" }}
                        className="text-xs font-semibold"
                      >
                        {komen.nama}
                      </div>
                      <p
                        style={{ color: "var(--teks-redup)" }}
                        className="text-xs leading-relaxed"
                      >
                        {komen.isi}
                      </p>
                    </div>
                  ))}

                  <form
                    onSubmit={(e) => handleKirimKomentar(e, status.id)}
                    className="space-y-2 pt-1"
                  >
                    <input
                      type="text"
                      value={draf.nama}
                      onChange={(e) =>
                        handleUbahDrafKomentar(status.id, "nama", e.target.value)
                      }
                      placeholder="Nama Anda"
                      style={{
                        backgroundColor: "var(--permukaan-kartu)",
                        borderColor: "var(--garis-halus)",
                        color: "var(--teks-utama)",
                      }}
                      className="w-full min-h-[44px] rounded-2xl border px-3 py-2 text-xs focus:outline-none"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={draf.isi}
                        onChange={(e) =>
                          handleUbahDrafKomentar(status.id, "isi", e.target.value)
                        }
                        placeholder="Tulis komentar..."
                        style={{
                          backgroundColor: "var(--permukaan-kartu)",
                          borderColor: "var(--garis-halus)",
                          color: "var(--teks-utama)",
                        }}
                        className="flex-1 min-h-[44px] rounded-2xl border px-3 py-2 text-xs focus:outline-none"
                      />
                      <button
                        type="submit"
                        style={{
                          backgroundColor: "var(--burgundy-utama)",
                          color: "var(--permukaan-kartu)",
                        }}
                        className="min-h-[44px] px-3.5 rounded-2xl text-xs font-semibold shrink-0"
                      >
                        Balas
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
