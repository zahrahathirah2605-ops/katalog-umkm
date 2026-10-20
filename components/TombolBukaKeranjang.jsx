"use client";

import { useKeranjang } from "@/lib/KeranjangContext";

export default function TombolBukaKeranjang() {
  const { totalItem, setBuka } = useKeranjang();

  return (
    <button
      type="button"
      onClick={() => setBuka(true)}
      className="relative rounded-full p-2 text-teks-lembut hover:bg-permukaan hover:text-utama cursor-pointer transition-colors"
      aria-label="Buka keranjang"
      title="Keranjang belanja"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
      {totalItem > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-utama text-[10px] font-bold text-white shadow-xs">
          {totalItem}
        </span>
      )}
    </button>
  );
}
