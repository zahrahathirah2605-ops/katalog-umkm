"use client";

import { ubahStatusProduk } from "@/app/admin/actions";

export default function TombolStatusProduk({ produk }) {
  // Bila aktif bernilai null/undefined, default adalah true
  const isAktif = produk.aktif !== false;

  return (
    <form action={ubahStatusProduk} className="inline-flex items-center">
      <input type="hidden" name="id" value={produk.id} />
      <input type="hidden" name="aktif" value={isAktif ? "false" : "true"} />
      <button
        type="submit"
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold cursor-pointer transition-colors ${
          isAktif
            ? "bg-hijau-muda/30 text-utama hover:bg-hijau-muda/50 border border-utama/30"
            : "bg-garis text-teks-lembut hover:bg-garis/80 border border-garis"
        }`}
        title={`Klik untuk ${isAktif ? "menonaktifkan" : "mengaktifkan"} produk`}
      >
        <span
          className={`h-2 w-2 rounded-full ${
            isAktif ? "bg-utama animate-pulse" : "bg-teks-lembut"
          }`}
        />
        {isAktif ? "Aktif" : "Nonaktif"}
      </button>
    </form>
  );
}
