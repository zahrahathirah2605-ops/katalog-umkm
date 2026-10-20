import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import CariAdmin from "@/components/CariAdmin";
import Paginasi from "@/components/Paginasi";
import { buatKoneksiAdminSesi } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const ITEM_PER_HALAMAN = 10;

export default async function HalamanAdmin({ searchParams }) {
  const params = await searchParams;
  const pencarian = params?.q || "";
  const halaman = Math.max(1, parseInt(params?.page || "1", 10));

  const supabase = await buatKoneksiAdminSesi();

  // Hitung ringkasan statistik (semua produk)
  const { data: semuaProduk = [] } = await supabase
    .from("produk")
    .select("id, kategori, aktif");

  const totalProduk = semuaProduk.length;
  const totalAktif = semuaProduk.filter((p) => p.aktif !== false).length;
  const kategoriCount = {};
  semuaProduk.forEach((p) => {
    const k = p.kategori || "Tanpa Kategori";
    kategoriCount[k] = (kategoriCount[k] || 0) + 1;
  });

  // US-33: Cari dan paginasi lewat query database
  let query = supabase.from("produk").select("*", { count: "exact" });

  if (pencarian) {
    query = query.ilike("nama", `%${pencarian}%`);
  }

  query = query.order("created_at", { ascending: false });

  const offsetAwal = (halaman - 1) * ITEM_PER_HALAMAN;
  const offsetAkhir = offsetAwal + ITEM_PER_HALAMAN - 1;
  query = query.range(offsetAwal, offsetAkhir);

  const { data: daftarProduk = [], count: totalHasil = 0, error } = await query;

  const totalHalaman = Math.ceil(totalHasil / ITEM_PER_HALAMAN);

  // Buat URL dasar untuk paginasi
  const queryObj = new URLSearchParams();
  if (pencarian) queryObj.set("q", pencarian);
  const baseUrl = `/admin?${queryObj.toString()}`;

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />

      {/* Header Halaman Admin */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Daftar Produk</h1>
          <p className="mt-0.5 text-xs text-teks-lembut">
            Kelola katalog toko, visibilitas, dan harga produk.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* US-35: Tombol Ekspor CSV */}
          <a
            href="/api/admin/ekspor-csv"
            download
            className="inline-flex items-center gap-1.5 rounded-lg border border-garis bg-permukaan px-3 py-2 text-xs font-semibold text-teks hover:bg-latar hover:border-utama transition-colors"
          >
            📥 Ekspor CSV
          </a>
          <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
        </div>
      </div>

      {/* US-30: Dashboard Ringkasan Admin */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <div className="rounded-2xl border border-garis bg-permukaan p-5">
          <p className="text-xs font-semibold text-teks-lembut uppercase tracking-wider">
            Total Produk
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-utama">{totalProduk}</span>
            <span className="text-xs text-teks-lembut">({totalAktif} aktif)</span>
          </div>
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

      {/* US-33: Pencarian di list admin */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-garis bg-permukaan p-3">
        <CariAdmin pencarianAwal={pencarian} />
        {pencarian && (
          <span className="text-xs text-teks-lembut">
            Menampilkan hasil untuk: &quot;<strong>{pencarian}</strong>&quot; ({totalHasil} produk)
          </span>
        )}
      </div>

      {/* Tabel Data Produk */}
      {error ? (
        <div className="rounded-xl border border-bahaya/30 bg-bahaya/10 p-4 text-bahaya">
          <p className="font-semibold">Gagal memuat daftar produk</p>
          <p className="mt-1 text-sm">{error.message}</p>
        </div>
      ) : daftarProduk.length === 0 ? (
        <div className="rounded-2xl border border-garis py-12 text-center text-teks-lembut">
          <p className="font-semibold">Tidak ada produk ditemukan</p>
          {pencarian && (
            <p className="mt-1 text-xs">Coba ganti kata kunci pencarian Anda.</p>
          )}
        </div>
      ) : (
        <>
          <TabelProduk daftarProduk={daftarProduk} />
          <Paginasi
            halamanSekarang={halaman}
            totalHalaman={totalHalaman}
            baseUrl={baseUrl}
          />
        </>
      )}
    </div>
  );
}

