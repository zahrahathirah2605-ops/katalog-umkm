"use client";

import { hapusProduk } from "@/app/admin/actions";
import Tombol from "@/components/Tombol";

export default function TombolHapusProduk({ produk }) {
  const handleSubmit = (e) => {
    const yakin = window.confirm(
      `Apakah Anda yakin ingin menghapus produk "${produk.nama}"?`
    );
    if (!yakin) {
      e.preventDefault();
    }
  };

  return (
    <form action={hapusProduk} onSubmit={handleSubmit} className="inline-flex">
      <input type="hidden" name="id" value={produk.id} />
      <Tombol type="submit" varian="bahaya">
        Hapus
      </Tombol>
    </form>
  );
}
