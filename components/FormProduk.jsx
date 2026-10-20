"use client";

import { useState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { buatDeskripsiAI } from "@/app/admin/ai-action";

// Dipakai untuk tambah produk (US-08) dan ubah produk (US-09).
export default function FormProduk({
  produk = {},
  labelTombol,
  action,
  error,
  isPending = false,
}) {
  const [nama, setNama] = useState(produk.nama || "");
  const [kategori, setKategori] = useState(produk.kategori || "");
  const [deskripsi, setDeskripsi] = useState(produk.deskripsi || "");
  const [loadingAI, setLoadingAI] = useState(false);
  const [errorAI, setErrorAI] = useState("");

  const handleBuatDeskripsiAI = async () => {
    if (!nama.trim()) {
      setErrorAI("Isi nama produk terlebih dahulu.");
      return;
    }
    setErrorAI("");
    setLoadingAI(true);
    try {
      const res = await buatDeskripsiAI(nama, kategori);
      if (res.error) {
        setErrorAI(res.error);
      } else if (res.deskripsi) {
        setDeskripsi(res.deskripsi);
      }
    } catch (err) {
      setErrorAI(err.message || "Gagal membuat deskripsi.");
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <form action={action} className="flex max-w-xl flex-col gap-4">
      {error && (
        <div className="rounded-xl border border-bahaya/30 bg-bahaya/10 p-3 text-sm text-bahaya">
          {error}
        </div>
      )}
      <Input
        label="Nama produk"
        name="nama"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        required
      />
      <Input
        label="Harga (Rp)"
        name="harga"
        type="number"
        min="0"
        defaultValue={produk.harga}
        required
      />
      <Input
        label="Kategori"
        name="kategori"
        value={kategori}
        onChange={(e) => setKategori(e.target.value)}
      />

      {/* US-29: Input upload file foto ke Supabase Storage */}
      <div className="flex flex-col gap-1.5 text-sm font-semibold">
        <label>Upload foto (Supabase Storage)</label>
        <input
          type="file"
          name="file_foto"
          accept="image/*"
          className="w-full rounded-lg border border-garis bg-latar px-3 py-2 text-sm text-teks file:mr-3 file:rounded-md file:border-0 file:bg-permukaan file:px-3 file:py-1 file:text-xs file:font-semibold file:text-teks hover:file:bg-garis cursor-pointer"
        />
        <p className="text-xs font-normal text-teks-lembut">Format: JPG, PNG, WEBP, SVG. Maks 2MB.</p>
      </div>

      <Input
        label="Atau link foto manual (opsional)"
        name="foto_url"
        placeholder="https://... atau /produk/nama-file.svg"
        defaultValue={produk.foto_url}
      />

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold">Deskripsi</label>
          <button
            type="button"
            onClick={handleBuatDeskripsiAI}
            disabled={loadingAI}
            className="text-xs font-semibold text-utama hover:underline cursor-pointer disabled:opacity-50"
          >
            {loadingAI ? "✨ Membuat deskripsi..." : "✨ Buat deskripsi dengan AI"}
          </button>
        </div>
        {errorAI && <p className="text-xs text-bahaya">{errorAI}</p>}
        <textarea
          name="deskripsi"
          rows={4}
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Tombol type="submit" disabled={isPending}>
          {isPending ? "Menyimpan..." : labelTombol}
        </Tombol>
        <Tombol href="/admin" varian="garis">
          Batal
        </Tombol>
      </div>
    </form>
  );
}
