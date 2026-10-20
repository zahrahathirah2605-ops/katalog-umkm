import Link from "next/link";
import { notFound } from "next/navigation";
import TombolWhatsApp from "@/components/TombolWhatsApp";
import TombolBagikan from "@/components/TombolBagikan";
import TombolTambahKeranjang from "@/components/TombolTambahKeranjang";
import GaleriFoto from "@/components/GaleriFoto";
import KartuProduk from "@/components/KartuProduk";
import { formatRupiah } from "@/lib/format";
import { buatKoneksiServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// US-26: generateMetadata dinamis untuk SEO & Open Graph
export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const supabase = buatKoneksiServer();
    const { data: produk } = await supabase
      .from("produk")
      .select("nama, deskripsi, foto_url")
      .eq("id", id)
      .maybeSingle();

    if (!produk) return {};

    return {
      title: `${produk.nama} | Katalog Toko`,
      description: produk.deskripsi || `Beli ${produk.nama} terbaik dengan harga terjangkau.`,
      openGraph: {
        title: produk.nama,
        description: produk.deskripsi || `Beli ${produk.nama} sekarang.`,
        images: produk.foto_url ? [{ url: produk.foto_url }] : [],
      },
    };
  } catch {
    return {};
  }
}

export default async function HalamanDetailProduk({ params }) {
  const { id } = await params;

  const supabase = buatKoneksiServer();
  const { data: produk, error } = await supabase
    .from("produk")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !produk) {
    notFound();
  }

  // US-17: Produk terkait dari kategori yang sama
  let produkTerkait = [];
  if (produk.kategori) {
    const { data: terkait } = await supabase
      .from("produk")
      .select("*")
      .eq("kategori", produk.kategori)
      .neq("id", id)
      .limit(4);
    produkTerkait = terkait || [];
  }

  const daftarFoto = Array.isArray(produk.foto_urls)
    ? produk.foto_urls
    : produk.foto_url
    ? [produk.foto_url]
    : [];

  const isHabis = produk.stok === 0 || produk.status_stok === "habis";
  const adaDiskon = produk.harga_diskon && produk.harga_diskon < produk.harga;

  return (
    <div className="flex flex-col gap-12 py-8 md:py-12">
      <article className="grid gap-8 md:grid-cols-2">
        {/* US-18: Galeri foto produk */}
        <GaleriFoto fotoUtama={produk.foto_url} daftarFoto={daftarFoto} />

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama">
              Kembali ke katalog
            </Link>
            {/* US-23: Tombol Bagikan */}
            <TombolBagikan produk={produk} />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm text-teks-lembut">{produk.kategori}</p>
            {/* US-20: Badge Baru / Terlaris */}
            {produk.badge && (
              <span className="rounded-md bg-utama/15 px-2 py-0.5 text-xs font-bold text-utama">
                {produk.badge}
              </span>
            )}
            {isHabis && (
              <span className="rounded-md bg-bahaya/10 px-2 py-0.5 text-xs font-bold text-bahaya">
                Habis
              </span>
            )}
          </div>

          <h1 className="text-3xl font-extrabold leading-tight tracking-tight">{produk.nama}</h1>

          {/* US-20: Harga coret jika ada diskon */}
          <div className="flex items-baseline gap-3">
            <p className="self-start rounded-md bg-harga-latar px-3 py-1 text-xl font-bold text-harga">
              {formatRupiah(adaDiskon ? produk.harga_diskon : produk.harga)}
            </p>
            {adaDiskon && (
              <p className="text-base text-teks-lembut line-through">
                {formatRupiah(produk.harga)}
              </p>
            )}
          </div>

          <p className="max-w-prose leading-relaxed text-teks-lembut">{produk.deskripsi}</p>

          {/* US-21: Tombol Tambah ke Keranjang dan Pesan WhatsApp Langsung */}
          <div className="flex flex-col gap-3">
            {!isHabis && <TombolTambahKeranjang produk={produk} />}
            <TombolWhatsApp produk={adaDiskon ? { ...produk, harga: produk.harga_diskon } : produk} />
          </div>
        </div>
      </article>

      {/* US-17: Produk Terkait */}
      {produkTerkait.length > 0 && (
        <section className="border-t border-garis pt-8">
          <h2 className="text-xl font-bold mb-4">Produk Terkait</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {produkTerkait.map((item) => (
              <KartuProduk key={item.id} produk={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
