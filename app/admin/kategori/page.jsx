import Link from "next/link";
import NavAdmin from "@/components/NavAdmin";
import Tombol from "@/components/Tombol";
import { buatKoneksiAdminSesi } from "@/lib/supabase/admin";
import FormTambahKategori from "./FormTambahKategori";
import BarisKategori from "./BarisKategori";

export const dynamic = "force-dynamic";

export default async function HalamanKategoriAdmin() {
  const supabase = await buatKoneksiAdminSesi();

  // Ambil data kategori dari tabel kategori
  const { data: daftarKategori = [], error } = await supabase
    .from("kategori")
    .select("*")
    .order("nama", { ascending: true });

  // Hitung jumlah produk per kategori
  const { data: produkList = [] } = await supabase.from("produk").select("kategori");
  const countPerKat = {};
  produkList.forEach((p) => {
    if (p.kategori) {
      countPerKat[p.kategori] = (countPerKat[p.kategori] || 0) + 1;
    }
  });

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Kelola Kategori</h1>
          <p className="mt-1 text-sm text-teks-lembut">
            Atur kelompok kategori produk untuk katalog toko.
          </p>
        </div>
        <Link href="/admin" className="text-sm font-semibold text-utama hover:underline">
          &larr; Kembali ke daftar produk
        </Link>
      </div>

      {/* Form Tambah Kategori */}
      <div className="rounded-2xl border border-garis bg-permukaan p-5">
        <h2 className="text-base font-bold">Tambah Kategori Baru</h2>
        <FormTambahKategori />
      </div>

      {/* Tabel Kategori */}
      <div className="overflow-x-auto rounded-2xl border border-garis">
        <table className="w-full min-w-[500px] text-left text-sm">
          <thead className="bg-permukaan text-teks-lembut">
            <tr>
              <th className="px-4 py-3 font-semibold">Nama Kategori</th>
              <th className="px-4 py-3 font-semibold">Jumlah Produk</th>
              <th className="px-4 py-3 text-right font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {error ? (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-bahaya">
                  Gagal memuat kategori: {error.message}
                </td>
              </tr>
            ) : daftarKategori.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-teks-lembut">
                  Belum ada kategori tersimpan di database.
                </td>
              </tr>
            ) : (
              daftarKategori.map((kategori) => (
                <BarisKategori
                  key={kategori.id}
                  kategori={kategori}
                  jumlahProduk={countPerKat[kategori.nama] || 0}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
