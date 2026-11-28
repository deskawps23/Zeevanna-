import { useState } from "react";
import { KATEGORI_PERAN, MODE_UTAMA } from "./config/strukturPeran";
import HeaderDanMenu from "./components/HeaderDanMenu";
import FormPelanggan from "./components/FormPelanggan";
import FormTimMitra from "./components/FormTimMitra";
import RuangSantaiPelanggan from "./components/RuangSantaiPelanggan";

export default function App() {
  const [mode, setMode] = useState(MODE_UTAMA.PELANGGAN);
  const [peran, setPeran] = useState(KATEGORI_PERAN.PELANGGAN);
  const [halamanPelanggan, setHalamanPelanggan] = useState("kebutuhan");
  const [pratinjauData, setPratinjauData] = useState(null);
  const [kunciForm, setKunciForm] = useState(0);

  function handlePilihTujuan({
    mode: modeBaru,
    peran: peranBaru,
    halamanPelanggan: halamanBaru = "kebutuhan",
  }) {
    setMode(modeBaru);
    setPeran(peranBaru);
    setHalamanPelanggan(halamanBaru);
    setPratinjauData(null);
    setKunciForm((k) => k + 1);
  }

  function handleGantiPeranTimMitra(peranBaru) {
    setPeran(peranBaru);
    setPratinjauData(null);
  }

  return (
    <div
      style={{
        backgroundColor: "var(--bg-tulang)",
        color: "var(--teks-utama)",
      }}
      className="min-h-screen px-3.5 py-4 sm:px-6 sm:py-6"
    >
      <div className="max-w-xl mx-auto space-y-4">
        <HeaderDanMenu
          mode={mode}
          peran={peran}
          halamanPelanggan={halamanPelanggan}
          onPilihTujuan={handlePilihTujuan}
          roleMap={typeof roleMap !== "undefined" ? roleMap : {}}
          superAdminEmails={typeof superAdminEmails !== "undefined" ? superAdminEmails : []}
        />

        <div
          style={{
            backgroundColor: "var(--permukaan-kartu)",
            borderColor: "var(--garis-halus)",
          }}
          className="rounded-2xl border p-2 grid grid-cols-3 gap-1.5"
        >
          <button
            type="button"
            onClick={() =>
              handlePilihTujuan({
                mode: MODE_UTAMA.PELANGGAN,
                peran: KATEGORI_PERAN.PELANGGAN,
                halamanPelanggan: "kebutuhan",
              })
            }
            style={{
              backgroundColor:
                mode === MODE_UTAMA.PELANGGAN &&
                halamanPelanggan === "kebutuhan"
                  ? "var(--burgundy-utama)"
                  : "transparent",
              color:
                mode === MODE_UTAMA.PELANGGAN &&
                halamanPelanggan === "kebutuhan"
                  ? "var(--permukaan-kartu)"
                  : "var(--teks-utama)",
            }}
            className="min-h-[44px] px-2.5 py-2 rounded-xl text-xs font-medium transition-colors duration-150 truncate"
          >
            Kebutuhan
          </button>

          <button
            type="button"
            onClick={() =>
              handlePilihTujuan({
                mode: MODE_UTAMA.PELANGGAN,
                peran: KATEGORI_PERAN.PELANGGAN,
                halamanPelanggan: "ruang_santai",
              })
            }
            style={{
              backgroundColor:
                mode === MODE_UTAMA.PELANGGAN &&
                halamanPelanggan === "ruang_santai"
                  ? "var(--ungu-aksen)"
                  : "transparent",
              color:
                mode === MODE_UTAMA.PELANGGAN &&
                halamanPelanggan === "ruang_santai"
                  ? "var(--permukaan-kartu)"
                  : "var(--teks-utama)",
            }}
            className="min-h-[44px] px-2.5 py-2 rounded-xl text-xs font-medium transition-colors duration-150 truncate"
          >
            Ruang Santai
          </button>

          <button
            type="button"
            onClick={() =>
              handlePilihTujuan({
                mode: MODE_UTAMA.TIM_MITRA,
                peran:
                  peran === KATEGORI_PERAN.MITRA
                    ? KATEGORI_PERAN.MITRA
                    : KATEGORI_PERAN.STAF_TIM,
                halamanPelanggan: "kebutuhan",
              })
            }
            style={{
              backgroundColor:
                mode === MODE_UTAMA.TIM_MITRA
                  ? "var(--burgundy-utama)"
                  : "transparent",
              color:
                mode === MODE_UTAMA.TIM_MITRA
                  ? "var(--permukaan-kartu)"
                  : "var(--teks-utama)",
            }}
            className="min-h-[44px] px-2.5 py-2 rounded-xl text-xs font-medium transition-colors duration-150 truncate"
          >
            Tim &amp; Mitra
          </button>
        </div>

        <main className="space-y-4">
          {mode === MODE_UTAMA.PELANGGAN ? (
            halamanPelanggan === "ruang_santai" ? (
              <RuangSantaiPelanggan
                onKembaliKeKebutuhan={() =>
                  handlePilihTujuan({
                    mode: MODE_UTAMA.PELANGGAN,
                    peran: KATEGORI_PERAN.PELANGGAN,
                    halamanPelanggan: "kebutuhan",
                  })
                }
              />
            ) : (
              <FormPelanggan
                key={`pel-${kunciForm}`}
                mode={mode}
                peran={peran}
                onBukaRuangSantai={() =>
                  handlePilihTujuan({
                    mode: MODE_UTAMA.PELANGGAN,
                    peran: KATEGORI_PERAN.PELANGGAN,
                    halamanPelanggan: "ruang_santai",
                  })
                }
                onHasilPratinjau={setPratinjauData}
              />
            )
          ) : (
            <FormTimMitra
              key={`tm-${kunciForm}`}
              mode={mode}
              peran={peran}
              onGantiPeran={handleGantiPeranTimMitra}
              onHasilPratinjau={setPratinjauData}
            />
          )}

          {pratinjauData && (
            <section
              style={{
                backgroundColor: "var(--permukaan-kartu)",
                borderColor: "var(--garis-halus)",
              }}
              className="rounded-2xl border p-4 space-y-2.5 animasi-masuk-lembut"
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  style={{ color: "var(--teks-utama)" }}
                  className="text-xs font-semibold uppercase tracking-wider"
                >
                  Pratinjau Metadata Siap Integrasi
                </span>
                <button
                  type="button"
                  onClick={() => setPratinjauData(null)}
                  style={{
                    backgroundColor: "var(--bg-tulang)",
                    color: "var(--teks-redup)",
                    borderColor: "var(--garis-halus)",
                  }}
                  className="min-h-[36px] px-2.5 py-1 rounded-xl border text-[11px] font-medium transition-colors duration-150"
                >
                  Tutup
                </button>
              </div>

              <pre
                style={{
                  backgroundColor: "var(--bg-tulang)",
                  borderColor: "var(--garis-halus)",
                  color: "var(--teks-utama)",
                }}
                className="rounded-xl border p-3 text-xs overflow-x-auto leading-relaxed"
              >
                {JSON.stringify(pratinjauData, null, 2)}
              </pre>
            </section>
          )}
        </main>

      <footer
        className="w-full py-6 px-4 mt-12 border-t text-center text-xs"
        style={{
          borderColor: "var(--garis-halus)",
          color: "var(--teks-utama)",
        }}
      >
        <p className="font-medium">
          Created, Design &amp; Development by <strong>deskawps</strong>
        </p>
        <p className="mt-1 tracking-wide opacity-80">
          Zeevanna Digital &amp; Service &mdash; ASAS, Inc. &mdash; ASAS Group Global World
        </p>
      </footer>
      </div>
    </div>
  );
}
