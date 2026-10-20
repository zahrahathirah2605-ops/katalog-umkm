"use client";

import { useState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { buatDeskripsiAI } from "@/app/admin/ai-action";

// Dipakai untuk tambah produk (US-08) dan ubah produk (US-09).
// US-31: Kategori dari database
// US-34: Validasi form di server & error per-field
export default function FormProduk({
  produk = {},
  labelTombol,
  action,
  error,
  errors = {},
  values = {},
  daftarKategori = [],
  isPending = false,
}) {
  const [nama, setNama] = useState(values.nama !== undefined ? values.nama : produk.nama || "");
  const [harga, setHarga] = useState(values.harga !== undefined ? values.harga : produk.harga !== undefined ? produk.harga : "");
  const [kategori, setKategori] = useState(values.kategori !== undefined ? values.kategori : produk.kategori || "");
  const [fotoUrl, setFotoUrl] = useState(values.foto_url !== undefined ? values.foto_url : produk.foto_url || "");
  const [deskripsi, setDeskripsi] = useState(values.deskripsi !== undefined ? values.deskripsi : produk.deskripsi || "");
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

      {/* Input Nama */}
      <div>
        <Input
          label="Nama produk"
          name="nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          required
        />
        {errors?.nama && (
          <p className="mt-1 text-xs text-bahaya font-medium">{errors.nama}</p>
        )}
      </div>

      {/* Input Harga */}
      <div>
        <Input
          label="Harga (Rp)"
          name="harga"
          type="number"
          min="0"
          value={harga}
          onChange={(e) => setHarga(e.target.value)}
          required
        />
        {errors?.harga && (
          <p className="mt-1 text-xs text-bahaya font-medium">{errors.harga}</p>
        )}
      </div>

      {/* Input / Select Kategori */}
      <div className="flex flex-col gap-1.5 text-sm font-semibold">
        <label>Kategori</label>
        {daftarKategori.length > 0 ? (
          <div className="flex flex-col gap-2">
            <select
              name="kategori"
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks focus:border-utama focus:outline-none"
            >
              <option value="">-- Pilih Kategori --</option>
              {daftarKategori.map((k) => {
                const namaKat = typeof k === "string" ? k : k.nama;
                return (
                  <option key={namaKat} value={namaKat}>
                    {namaKat}
                  </option>
                );
              })}
            </select>
          </div>
        ) : (
          <Input
            name="kategori"
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            placeholder="Misal: Minuman, Camilan"
          />
        )}
        {errors?.kategori && (
          <p className="mt-1 text-xs text-bahaya font-medium">{errors.kategori}</p>
        )}
      </div>

      {/* US-29: Input upload file foto ke Supabase Storage */}
      <div className="flex flex-col gap-1.5 text-sm font-semibold">
        <label>Upload foto (Supabase Storage)</label>
        <input
          type="file"
          name="file_foto"
          accept="image/*"
          className="w-full rounded-lg border border-garis bg-latar px-3 py-2 text-sm text-teks file:mr-3 file:rounded-md file:border-0 file:bg-permukaan file:px-3 file:py-1 file:text-xs file:font-semibold file:text-teks hover:file:bg-garis cursor-pointer"
        />
        <p className="text-xs font-normal text-teks-lembut">
          Format: JPG, PNG, WEBP, SVG. Maks 2MB.
        </p>
        {errors?.foto_url && (
          <p className="mt-1 text-xs text-bahaya font-medium">{errors.foto_url}</p>
        )}
      </div>

      <div>
        <Input
          label="Atau link foto manual (opsional)"
          name="foto_url"
          placeholder="https://... atau /produk/nama-file.svg"
          value={fotoUrl}
          onChange={(e) => setFotoUrl(e.target.value)}
        />
      </div>

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

