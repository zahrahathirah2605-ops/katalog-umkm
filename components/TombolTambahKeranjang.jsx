"use client";

import { useKeranjang } from "@/lib/KeranjangContext";

export default function TombolTambahKeranjang({ produk }) {
  const { tambahItem } = useKeranjang();

  return (
    <button
      type="button"
      onClick={() => tambahItem(produk, 1)}
      className="inline-flex w-full items-center justify-center rounded-lg border border-utama px-4 py-3 font-semibold text-utama hover:bg-utama/10 sm:w-auto cursor-pointer"
    >
      + Tambah ke Keranjang
    </button>
  );
}
