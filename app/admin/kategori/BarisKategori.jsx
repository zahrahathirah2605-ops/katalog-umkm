"use client";

import { useState, useActionState } from "react";
import Tombol from "@/components/Tombol";
import { ubahKategori, hapusKategori } from "@/app/admin/actions";

export default function BarisKategori({ kategori, jumlahProduk = 0 }) {
  const [sedangEdit, setSedangEdit] = useState(false);
  const [namaBaru, setNamaBaru] = useState(kategori.nama);
  const [stateUbah, formActionUbah, isPendingUbah] = useActionState(ubahKategori, null);

  const handleHapus = (e) => {
    if (jumlahProduk > 0) {
      alert(`Kategori "${kategori.nama}" tidak bisa dihapus karena masih dipakai oleh ${jumlahProduk} produk.`);
      e.preventDefault();
      return;
    }
    const konfirmasi = window.confirm(`Yakin ingin menghapus kategori "${kategori.nama}"?`);
    if (!konfirmasi) {
      e.preventDefault();
    }
  };

  return (
    <tr className="border-t border-garis">
      <td className="px-4 py-3 font-medium">
        {sedangEdit ? (
          <form
            action={async (formData) => {
              await formActionUbah(formData);
              setSedangEdit(false);
            }}
            className="flex items-center gap-2"
          >
            <input type="hidden" name="id" value={kategori.id} />
            <input type="hidden" name="nama_lama" value={kategori.nama} />
            <input
              type="text"
              name="nama"
              value={namaBaru}
              onChange={(e) => setNamaBaru(e.target.value)}
              className="rounded-lg border border-garis bg-latar px-2.5 py-1 text-sm focus:border-utama focus:outline-none"
              required
            />
            <button
              type="submit"
              disabled={isPendingUbah}
              className="rounded bg-utama px-2.5 py-1 text-xs font-semibold text-putih hover:opacity-90 cursor-pointer"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={() => {
                setNamaBaru(kategori.nama);
                setSedangEdit(false);
              }}
              className="rounded border border-garis px-2 py-1 text-xs text-teks-lembut hover:text-teks cursor-pointer"
            >
              Batal
            </button>
          </form>
        ) : (
          <span>{kategori.nama}</span>
        )}
      </td>
      <td className="px-4 py-3 text-teks-lembut">
        {jumlahProduk} produk
      </td>
      <td className="px-4 py-3 text-right">
        {!sedangEdit && (
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setSedangEdit(true)}
              className="rounded-lg border border-garis px-2.5 py-1 text-xs font-semibold hover:border-utama hover:text-utama cursor-pointer"
            >
              Ubah
            </button>
            <form action={hapusKategori} onSubmit={handleHapus} className="inline-flex">
              <input type="hidden" name="id" value={kategori.id} />
              <input type="hidden" name="nama" value={kategori.nama} />
              <button
                type="submit"
                className="rounded-lg border border-bahaya/30 bg-bahaya/10 px-2.5 py-1 text-xs font-semibold text-bahaya hover:bg-bahaya/20 cursor-pointer"
              >
                Hapus
              </button>
            </form>
          </div>
        )}
      </td>
    </tr>
  );
}
