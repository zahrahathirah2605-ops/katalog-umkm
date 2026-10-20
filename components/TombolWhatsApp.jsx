"use client";

import { useState } from "react";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

export default function TombolWhatsApp({ produk }) {
  const [jumlah, setJumlah] = useState(1);
  const isHabis = produk.stok === 0 || produk.status_stok === "habis";

  const kurangi = () => setJumlah((prev) => (prev > 1 ? prev - 1 : 1));
  const tambah = () => setJumlah((prev) => prev + 1);

  const totalHarga = produk.harga * jumlah;
  const teksPesan = `Halo, saya ingin memesan ${produk.nama} sebanyak ${jumlah} pcs (Total: ${formatRupiah(totalHarga)}). Apakah masih tersedia?`;
  const urlWhatsApp = `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(teksPesan)}`;

  if (isHabis) {
    return (
      <div className="flex flex-col gap-3">
        <span className="inline-flex self-start rounded-md bg-bahaya/10 px-3 py-1 text-sm font-semibold text-bahaya">
          Stok Habis
        </span>
        <button
          type="button"
          disabled
          className="inline-flex w-full items-center justify-center rounded-lg bg-garis px-5 py-3 font-semibold text-teks-lembut opacity-60 cursor-not-allowed sm:w-auto"
        >
          Produk Tidak Tersedia
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Pemilih Jumlah (US-12) */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-teks">Jumlah:</span>
        <div className="inline-flex items-center rounded-lg border border-garis bg-latar">
          <button
            type="button"
            onClick={kurangi}
            disabled={jumlah <= 1}
            aria-label="Kurangi jumlah"
            className="px-3 py-1.5 text-base font-bold text-teks-lembut hover:text-utama disabled:opacity-30 cursor-pointer"
          >
            -
          </button>
          <span className="min-w-[2.5rem] text-center text-sm font-semibold text-teks">
            {jumlah}
          </span>
          <button
            type="button"
            onClick={tambah}
            aria-label="Tambah jumlah"
            className="px-3 py-1.5 text-base font-bold text-teks-lembut hover:text-utama cursor-pointer"
          >
            +
          </button>
        </div>
        <span className="text-sm text-teks-lembut">
          (Subtotal: {formatRupiah(totalHarga)})
        </span>
      </div>

      {/* Tombol Pesan */}
      <a
        href={urlWhatsApp}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white hover:bg-utama-gelap sm:w-auto"
      >
        Pesan via WhatsApp
      </a>
    </div>
  );
}
