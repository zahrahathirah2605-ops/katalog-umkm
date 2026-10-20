import { notFound } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import FormUbahProduk from "./FormUbahProduk";
import { buatKoneksiAdminSesi } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function HalamanUbahProduk({ params }) {
  const { id } = await params;
  const supabase = await buatKoneksiAdminSesi();

  const { data: produk, error } = await supabase
    .from("produk")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !produk) {
    notFound();
  }

  const { data: kategoriList = [] } = await supabase
    .from("kategori")
    .select("nama")
    .order("nama", { ascending: true });

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Ubah produk</h1>
      <FormUbahProduk produk={produk} daftarKategori={kategoriList} />
    </div>
  );
}
