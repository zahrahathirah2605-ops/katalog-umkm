"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function FilterDanCari({
  kategoriList = [],
  kategoriTerpilih = "",
  pencarianAwal = "",
  urutanTerpilih = "terbaru",
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const perbaruiParams = (kunci, nilai) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nilai) {
      params.set(kunci, nilai);
    } else {
      params.delete(kunci);
    }
    // Reset halaman ke 1 setiap ganti filter/sort
    if (kunci !== "page") {
      params.delete("page");
    }
    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  };

  const handleCari = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get("q")?.toString().trim() || "";
    perbaruiParams("q", q);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Filter Kategori */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => perbaruiParams("kategori", "")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              !kategoriTerpilih
                ? "bg-utama text-white"
                : "bg-permukaan text-teks hover:bg-garis"
            }`}
          >
            Semua
          </button>
          {kategoriList.map((kat) => (
            <button
              key={kat}
              type="button"
              onClick={() => perbaruiParams("kategori", kat === kategoriTerpilih ? "" : kat)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                kat === kategoriTerpilih
                  ? "bg-utama text-white"
                  : "bg-permukaan text-teks hover:bg-garis"
              }`}
            >
              {kat}
            </button>
          ))}
        </div>

        {/* Urutkan & Cari */}
        <div className="flex flex-wrap items-center gap-3">
          {/* US-15: Urutkan produk */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-teks-lembut">Urutkan:</span>
            <select
              value={urutanTerpilih}
              onChange={(e) => perbaruiParams("sort", e.target.value)}
              className="rounded-lg border border-garis bg-latar px-2.5 py-1.5 text-xs text-teks focus:border-utama focus:outline-none cursor-pointer"
            >
              <option value="terbaru">Terbaru</option>
              <option value="termurah">Termurah</option>
              <option value="termahal">Termahal</option>
            </select>
          </div>

          {/* Form Pencarian */}
          <form onSubmit={handleCari} className="relative flex max-w-xs items-center">
            <input
              name="q"
              type="search"
              defaultValue={pencarianAwal}
              placeholder="Cari produk..."
              className="w-full rounded-full border border-garis bg-latar py-1.5 pl-3.5 pr-9 text-xs text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-1.5 rounded-full p-1 text-teks-lembut hover:text-utama cursor-pointer"
              aria-label="Cari"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
