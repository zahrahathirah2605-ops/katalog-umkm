import Link from "next/link";

export default function Paginasi({ halamanSekarang, totalHalaman, baseUrl }) {
  if (totalHalaman <= 1) return null;

  const buatUrl = (hlm) => {
    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}page=${hlm}`;
  };

  return (
    <div className="flex items-center justify-center gap-2 pt-6">
      {halamanSekarang > 1 && (
        <Link
          href={buatUrl(halamanSekarang - 1)}
          className="rounded-lg border border-garis bg-latar px-3 py-1.5 text-xs font-semibold text-teks hover:bg-permukaan"
        >
          Sebelumnya
        </Link>
      )}

      <span className="text-xs text-teks-lembut">
        Halaman <span className="font-bold text-teks">{halamanSekarang}</span> dari{" "}
        <span className="font-bold text-teks">{totalHalaman}</span>
      </span>

      {halamanSekarang < totalHalaman && (
        <Link
          href={buatUrl(halamanSekarang + 1)}
          className="rounded-lg border border-garis bg-latar px-3 py-1.5 text-xs font-semibold text-teks hover:bg-permukaan"
        >
          Selanjutnya
        </Link>
      )}
    </div>
  );
}
