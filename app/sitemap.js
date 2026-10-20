import { buatKoneksiServer } from "@/lib/supabase/server";

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://katalog-umkm.vercel.app";

  let produkUrls = [];
  try {
    const supabase = buatKoneksiServer();
    const { data: produk } = await supabase.from("produk").select("id, created_at");
    if (produk) {
      produkUrls = produk.map((p) => ({
        url: `${baseUrl}/produk/${p.id}`,
        lastModified: new Date(p.created_at || Date.now()),
      }));
    }
  } catch (err) {
    // fallback
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/tentang`,
      lastModified: new Date(),
    },
    ...produkUrls,
  ];
}
