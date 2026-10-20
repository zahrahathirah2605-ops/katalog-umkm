"use client";

import { useState } from "react";

export default function TombolBagikan({ produk }) {
  const [pesan, setPesan] = useState("");

  const handleBagikan = async () => {
    const url = window.location.href;
    const shareData = {
      title: produk.nama,
      text: `Lihat produk ${produk.nama} di toko kami!`,
      url: url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // user cancel atau browser fallback
      }
    }

    // Fallback salin link ke clipboard
    try {
      await navigator.clipboard.writeText(url);
      setPesan("Link tersalin!");
      setTimeout(() => setPesan(""), 2500);
    } catch {
      setPesan("Gagal menyalin link.");
      setTimeout(() => setPesan(""), 2500);
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={handleBagikan}
        className="inline-flex items-center gap-1.5 rounded-lg border border-garis bg-latar px-3 py-2 text-xs font-semibold text-teks hover:border-utama hover:text-utama cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
        Bagikan
      </button>
      {pesan && (
        <span className="absolute -bottom-7 left-0 whitespace-nowrap rounded bg-teks px-2 py-0.5 text-xs text-white shadow">
          {pesan}
        </span>
      )}
    </div>
  );
}
