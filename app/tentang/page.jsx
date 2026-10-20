import Link from "next/link";
import { toko } from "@/lib/toko";

export const metadata = {
  title: `Tentang Kami - ${toko.nama}`,
  description: `Profil dan kontak resmi ${toko.nama}`,
};

export default function HalamanTentang() {
  return (
    <div className="mx-auto max-w-2xl py-12">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Tentang Kami</h1>
      <p className="mt-4 text-lg text-teks-lembut">{toko.tagline}</p>

      <div className="mt-8 flex flex-col gap-6 rounded-2xl border border-garis bg-permukaan/50 p-6">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-teks-lembut">Alamat Toko</h2>
          <p className="mt-1 text-base font-medium text-teks">{toko.alamat}</p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-teks-lembut">Jam Operasional</h2>
          <p className="mt-1 text-base font-medium text-teks">{toko.jamBuka}</p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-teks-lembut">Kontak WhatsApp</h2>
          <p className="mt-1 text-base font-medium text-teks">+{toko.nomorWhatsApp}</p>
          <a
            href={`https://wa.me/${toko.nomorWhatsApp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center justify-center rounded-lg bg-utama px-4 py-2 text-sm font-semibold text-white hover:bg-utama-gelap"
          >
            Hubungi via WhatsApp
          </a>
        </div>
      </div>

      <div className="mt-8">
        <Link href="/" className="text-sm text-teks-lembut underline hover:text-utama">
          ← Kembali ke katalog produk
        </Link>
      </div>
    </div>
  );
}
