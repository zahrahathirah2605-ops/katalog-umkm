"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

export default function CariAdmin({ pencarianAwal = "" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [kataKunci, setKataKunci] = useState(pencarianAwal);
  const [isPending, startTransition] = useTransition();

  const handleCari = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (kataKunci.trim()) {
      params.set("q", kataKunci.trim());
    } else {
      params.delete("q");
    }
    // Reset ke halaman 1 setiap kali mencari
    params.delete("page");

    startTransition(() => {
      router.push(`/admin?${params.toString()}`);
    });
  };

  const handleReset = () => {
    setKataKunci("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    params.delete("page");
    startTransition(() => {
      router.push(`/admin?${params.toString()}`);
    });
  };

  return (
    <form onSubmit={handleCari} className="flex flex-1 items-center gap-2">
      <div className="relative flex-1 max-w-sm">
        <input
          type="text"
          value={kataKunci}
          onChange={(e) => setKataKunci(e.target.value)}
          placeholder="Cari nama produk di admin..."
          className="w-full rounded-lg border border-garis bg-latar px-3.5 py-2 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
        />
        {kataKunci && (
          <button
            type="button"
            onClick={handleReset}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-teks-lembut hover:text-teks cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-utama px-3.5 py-2 text-xs font-semibold text-putih hover:opacity-90 cursor-pointer disabled:opacity-50"
      >
        {isPending ? "Mencari..." : "Cari"}
      </button>
    </form>
  );
}
