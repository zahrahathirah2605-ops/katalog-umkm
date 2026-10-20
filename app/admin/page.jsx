import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { buatKoneksiAdminSesi } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function HalamanAdmin() {
  const supabase = await buatKoneksiAdminSesi();
  const { data: daftarProduk = [], error } = await supabase
    .from("produk")
    .select("*")
    .order("created_at", { ascending: false });

  // US-30: Hitung ringkasan dashboard (total produk & produk per kategori)
  const totalProduk = daftarProduk.length;
  const kategoriCount = {};
  daftarProduk.forEach((p) => {
    const k = p.kategori || "Tanpa Kategori";
    kategoriCount[k] = (kategoriCount[k] || 0) + 1;
  });

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Produk</h1>
        <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
      </div>

      {/* US-30: Dashboard Ringkasan Admin */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <div className="rounded-2xl border border-garis bg-permukaan p-5">
          <p className="text-xs font-semibold text-teks-lembut uppercase tracking-wider">
            Total Produk
          </p>
          <p className="mt-2 text-3xl font-extrabold text-utama">{totalProduk}</p>
        </div>
        <div className="rounded-2xl border border-garis bg-permukaan p-5 sm:col-span-1 md:col-span-3">
          <p className="text-xs font-semibold text-teks-lembut uppercase tracking-wider">
            Produk per Kategori
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.keys(kategoriCount).length === 0 ? (
              <span className="text-sm text-teks-lembut">-</span>
            ) : (
              Object.entries(kategoriCount).map(([kat, jml]) => (
                <span
                  key={kat}
                  className="rounded-lg border border-garis bg-latar px-2.5 py-1 text-xs font-medium text-teks"
                >
                  {kat}: <strong className="text-utama">{jml}</strong>
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-bahaya/30 bg-bahaya/10 p-4 text-bahaya">
          <p className="font-semibold">Gagal memuat daftar produk</p>
          <p className="mt-1 text-sm">{error.message}</p>
        </div>
      ) : daftarProduk.length === 0 ? (
        <p className="py-8 text-center text-teks-lembut">Belum ada produk</p>
      ) : (
        <TabelProduk daftarProduk={daftarProduk} />
      )}
    </div>
  );
}
