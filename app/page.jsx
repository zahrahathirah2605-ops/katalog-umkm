import KartuProduk from "@/components/KartuProduk";
import FilterDanCari from "@/components/FilterDanCari";
import Paginasi from "@/components/Paginasi";
import { toko } from "@/lib/toko";
import { buatKoneksiServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const ITEM_PER_HALAMAN = 6;

export default async function HalamanKatalog({ searchParams }) {
  const params = await searchParams;
  const kategoriTerpilih = params?.kategori || "";
  const pencarian = params?.q || "";
  const urutan = params?.sort || "terbaru";
  const halaman = Math.max(1, parseInt(params?.page || "1", 10));

  let daftarProduk = [];
  let kategoriList = [];
  let totalProduk = 0;
  let errorMsg = null;

  try {
    const supabase = buatKoneksiServer();

    // Ambil semua kategori unik
    const { data: semuaProduk } = await supabase
      .from("produk")
      .select("kategori");

    if (semuaProduk) {
      kategoriList = Array.from(
        new Set(semuaProduk.map((p) => p.kategori).filter(Boolean))
      );
    }

    // US-32: Hanya tampilkan produk aktif (aktif != false)
    let query = supabase
      .from("produk")
      .select("*", { count: "exact" })
      .neq("aktif", false);

    if (kategoriTerpilih) {
      query = query.eq("kategori", kategoriTerpilih);
    }

    if (pencarian) {
      query = query.ilike("nama", `%${pencarian}%`);
    }

    // US-15: Pengurutan query di database
    if (urutan === "termurah") {
      query = query.order("harga", { ascending: true });
    } else if (urutan === "termahal") {
      query = query.order("harga", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    // US-16: Paginasi via query Supabase range
    const offsetAwal = (halaman - 1) * ITEM_PER_HALAMAN;
    const offsetAkhir = offsetAwal + ITEM_PER_HALAMAN - 1;
    query = query.range(offsetAwal, offsetAkhir);

    const { data, count, error } = await query;

    if (error) {
      errorMsg = error.message;
    } else {
      daftarProduk = data || [];
      totalProduk = count || 0;
    }
  } catch (err) {
    errorMsg = err.message;
  }

  const totalHalaman = Math.ceil(totalProduk / ITEM_PER_HALAMAN);

  // Buat query string untuk pagination link
  const queryObj = new URLSearchParams();
  if (kategoriTerpilih) queryObj.set("kategori", kategoriTerpilih);
  if (pencarian) queryObj.set("q", pencarian);
  if (urutan !== "terbaru") queryObj.set("sort", urutan);
  const baseUrl = `/?${queryObj.toString()}`;

  return (
    <>
      <section className="py-10 sm:py-14">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {toko.nama}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-teks-lembut">{toko.tagline}</p>
        <p className="mt-4 text-sm text-teks-lembut">{toko.jamBuka}</p>
      </section>

      <section aria-labelledby="judul-produk" className="flex flex-col gap-5 pb-12">
        <div className="flex flex-col gap-4">
          <h2 id="judul-produk" className="text-xl font-bold">
            Produk kami
          </h2>
          <FilterDanCari
            kategoriList={kategoriList}
            kategoriTerpilih={kategoriTerpilih}
            pencarianAwal={pencarian}
            urutanTerpilih={urutan}
          />
        </div>

        {errorMsg ? (
          <div className="rounded-xl border border-bahaya/30 bg-bahaya/10 p-4 text-bahaya">
            <p className="font-semibold">Gagal memuat daftar produk</p>
            <p className="mt-1 text-sm">{errorMsg}</p>
          </div>
        ) : daftarProduk.length === 0 ? (
          <div className="py-12 text-center text-teks-lembut">
            <p className="font-semibold">Belum ada produk</p>
            {(kategoriTerpilih || pencarian) && (
              <p className="mt-1 text-sm">Coba kata kunci lain atau pilih kategori Semua.</p>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {daftarProduk.map((produk) => (
                <KartuProduk key={produk.id} produk={produk} />
              ))}
            </div>
            <Paginasi
              halamanSekarang={halaman}
              totalHalaman={totalHalaman}
              baseUrl={baseUrl}
            />
          </>
        )}
      </section>
    </>
  );
}
