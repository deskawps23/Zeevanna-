export default function LogoZeevanna({
  tampilkanTeks = true,
  animasiMasuk = false,
  className = "",
}) {
  return (
    <div
      className={`inline-flex items-center gap-2.5 select-none ${
        animasiMasuk ? "animasi-masuk-lembut" : ""
      } ${className}`}
    >
      <span
        style={{
          backgroundColor: "var(--burgundy-utama)",
          color: "var(--permukaan-kartu)",
        }}
        className="w-10 h-10 rounded-2xl inline-flex items-center justify-center shrink-0 transition-colors duration-150"
      >
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect
            x="3.5"
            y="3.5"
            width="17"
            height="17"
            rx="7"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M8.2 8.5H15.8L8.2 15.5H13.6"
            stroke="currentColor"
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="15.8"
            cy="15.5"
            r="1.7"
            fill="#f4a6be"
          />
        </svg>
      </span>

      {tampilkanTeks && (
        <div className="min-w-0 leading-tight">
          <div
            style={{ color: "var(--teks-utama)" }}
            className="text-sm font-semibold tracking-tight truncate"
          >
            Zeevanna
          </div>
          <div
            style={{ color: "var(--teks-redup)" }}
            className="text-[11px] font-medium truncate"
          >
            Digital &amp; Service
          </div>
        </div>
      )}
    </div>
  );
}
