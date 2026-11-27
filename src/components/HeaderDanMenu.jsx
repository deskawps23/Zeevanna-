import { useState } from "react";
import { KATEGORI_PERAN, MODE_UTAMA } from "../config/strukturPeran";
import LogoZeevanna from "./LogoZeevanna";
import TombolMenuKapsul from "./TombolMenuKapsul";

export default function HeaderDanMenu({
  mode,
  peran,
  halamanPelanggan,
  onPilihTujuan,
}) {
  const [menuTerbuka, setMenuTerbuka] = useState(false);

  function handleToggleMenu() {
    setMenuTerbuka((prev) => !prev);
  }

  function pilihItem(modeTujuan, peranTujuan, halamanTujuan = "kebutuhan") {
    onPilihTujuan({
      mode: modeTujuan,
      peran: peranTujuan,
      halamanPelanggan: halamanTujuan,
    });
    setTimeout(() => {
      setMenuTerbuka(false);
    }, 150);
  }

  const labelAktif =
    mode === MODE_UTAMA.PELANGGAN
      ? halamanPelanggan === "ruang_santai"
        ? "Pelanggan • Ruang Santai"
        : "Pelanggan • Kebutuhan"
      : peran === KATEGORI_PERAN.MITRA
      ? "Tim & Mitra • Mitra"
      : "Tim & Mitra • Staf / Tim";

  return (
    <header className="relative space-y-2.5">
      <div
        style={{
          backgroundColor: "var(--permukaan-kartu)",
          borderColor: "var(--garis-halus)",
        }}
        className="rounded-2xl border px-3.5 py-2.5 flex items-center justify-between gap-2"
      >
        <LogoZeevanna tampilkanTeks={true} animasiMasuk={true} />

        <div className="flex items-center gap-2 shrink-0">
          <span
            style={{
              backgroundColor:
                mode === MODE_UTAMA.PELANGGAN
                  ? halamanPelanggan === "ruang_santai"
                    ? "var(--ungu-lembut)"
                    : "var(--pink-lembut)"
                  : "var(--ungu-lembut)",
              color:
                mode === MODE_UTAMA.PELANGGAN
                  ? halamanPelanggan === "ruang_santai"
                    ? "var(--ungu-aksen)"
                    : "var(--burgundy-utama)"
                  : "var(--ungu-aksen)",
            }}
            className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-medium transition-colors duration-150"
          >
            {labelAktif}
          </span>

          <TombolMenuKapsul terbuka={menuTerbuka} onKlik={handleToggleMenu} />
        </div>
      </div>

      {menuTerbuka && (
        <nav
          aria-label="Menu utama"
          style={{
            backgroundColor: "var(--permukaan-kartu)",
            borderColor: "var(--garis-halus)",
          }}
          className="rounded-2xl border p-3 space-y-3 animasi-masuk-lembut"
        >
          <div className="space-y-1.5">
            <div
              style={{ color: "var(--teks-redup)" }}
              className="px-2 text-[11px] font-semibold uppercase tracking-wider"
            >
              Jalur Pelanggan (pel-)
            </div>

            <button
              type="button"
              onClick={() =>
                pilihItem(
                  MODE_UTAMA.PELANGGAN,
                  KATEGORI_PERAN.PELANGGAN,
                  "kebutuhan"
                )
              }
              style={{
                backgroundColor:
                  mode === MODE_UTAMA.PELANGGAN &&
                  halamanPelanggan === "kebutuhan"
                    ? "var(--burgundy-utama)"
                    : "var(--pink-lembut)",
                color:
                  mode === MODE_UTAMA.PELANGGAN &&
                  halamanPelanggan === "kebutuhan"
                    ? "var(--permukaan-kartu)"
                    : "var(--burgundy-utama)",
              }}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-left text-xs font-medium transition-colors duration-150"
            >
              Pelanggan — Kebutuhan Layanan
            </button>

            <button
              type="button"
              onClick={() =>
                pilihItem(
                  MODE_UTAMA.PELANGGAN,
                  KATEGORI_PERAN.PELANGGAN,
                  "ruang_santai"
                )
              }
              style={{
                backgroundColor:
                  mode === MODE_UTAMA.PELANGGAN &&
                  halamanPelanggan === "ruang_santai"
                    ? "var(--ungu-aksen)"
                    : "var(--ungu-lembut)",
                color:
                  mode === MODE_UTAMA.PELANGGAN &&
                  halamanPelanggan === "ruang_santai"
                    ? "var(--permukaan-kartu)"
                    : "var(--ungu-aksen)",
              }}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-left text-xs font-medium transition-colors duration-150"
            >
              Pelanggan — Ruang Santai
            </button>
          </div>

          <div
            style={{ borderColor: "var(--garis-halus)" }}
            className="pt-2 border-t space-y-1.5"
          >
            <div
              style={{ color: "var(--teks-redup)" }}
              className="px-2 text-[11px] font-semibold uppercase tracking-wider"
            >
              Jalur Tim &amp; Mitra (tm-)
            </div>

            <button
              type="button"
              onClick={() =>
                pilihItem(
                  MODE_UTAMA.TIM_MITRA,
                  KATEGORI_PERAN.STAF_TIM,
                  "kebutuhan"
                )
              }
              style={{
                backgroundColor:
                  mode === MODE_UTAMA.TIM_MITRA &&
                  peran === KATEGORI_PERAN.STAF_TIM
                    ? "var(--burgundy-utama)"
                    : "var(--bg-tulang)",
                color:
                  mode === MODE_UTAMA.TIM_MITRA &&
                  peran === KATEGORI_PERAN.STAF_TIM
                    ? "var(--permukaan-kartu)"
                    : "var(--teks-utama)",
                borderColor: "var(--garis-halus)",
              }}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-left text-xs font-medium transition-colors duration-150"
            >
              Tim &amp; Mitra — Staf / Tim
            </button>

            <button
              type="button"
              onClick={() =>
                pilihItem(
                  MODE_UTAMA.TIM_MITRA,
                  KATEGORI_PERAN.MITRA,
                  "kebutuhan"
                )
              }
              style={{
                backgroundColor:
                  mode === MODE_UTAMA.TIM_MITRA &&
                  peran === KATEGORI_PERAN.MITRA
                    ? "var(--burgundy-utama)"
                    : "var(--bg-tulang)",
                color:
                  mode === MODE_UTAMA.TIM_MITRA &&
                  peran === KATEGORI_PERAN.MITRA
                    ? "var(--permukaan-kartu)"
                    : "var(--teks-utama)",
                borderColor: "var(--garis-halus)",
              }}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-left text-xs font-medium transition-colors duration-150"
            >
              Tim &amp; Mitra — Mitra
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
