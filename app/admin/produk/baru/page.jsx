import { buatKoneksiAdminSesi } from "@/lib/supabase/admin";
import NavAdmin from "@/components/NavAdmin";
import FormTambahProdukClient from "./FormTambahProdukClient";

export const dynamic = "force-dynamic";

export default async function HalamanTambahProduk() {
  const supabase = await buatKoneksiAdminSesi();
  const { data: kategoriList = [] } = await supabase
    .from("kategori")
    .select("nama")
    .order("nama", { ascending: true });

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Tambah produk</h1>
      <FormTambahProdukClient daftarKategori={kategoriList} />
    </div>
  );
}

