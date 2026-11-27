import {
  getActiveRole,
  canExecuteAdminControl,
  recordTransactionEvent,
} from "../integration/zeevannaBridge.js";

export default function TombolMenuKapsul({
  terbuka,
  onKlik,
  user = null,
  roleMap = {},
  superAdminEmails = [],
}) {
  const peranAktif = getActiveRole(user, roleMap, superAdminEmails);
  const bolehKontrolSuperAdmin = canExecuteAdminControl(peranAktif);

  async function tanganiKlikKapsul(event) {
    if (typeof onKlik === "function") {
      onKlik(event);
    }

    if (bolehKontrolSuperAdmin && user) {
      try {
        await recordTransactionEvent({
          user,
          role: peranAktif,
          source: "TombolMenuKapsul",
          status: terbuka ? "closed" : "opened",
        });
      } catch {
        // Biarkan interaksi UI kapsul tetap berjalan mulus
      }
    }
  }

  return (
    <button
      type="button"
      onClick={tanganiKlikKapsul}
      aria-expanded={terbuka}
      aria-label={terbuka ? "Tutup menu navigasi" : "Buka menu navigasi"}
      style={{
        backgroundColor: terbuka
          ? "var(--burgundy-utama)"
          : "var(--pink-lembut)",
        color: terbuka ? "var(--permukaan-kartu)" : "var(--burgundy-utama)",
        borderColor: "var(--garis-halus)",
      }}
      className="w-[44px] h-[44px] rounded-2xl border inline-flex items-center justify-center shrink-0 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#6b4c7b]/40"
    >
      {terbuka ? (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M6 6L18 18" />
          <path d="M18 6L6 18" />
        </svg>
      ) : (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M5 7.5H19" />
          <path d="M5 12H19" />
          <path d="M5 16.5H19" />
        </svg>
      )}
    </button>
  );
}
