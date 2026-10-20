import Link from "next/link";
import { formatRupiah } from "@/lib/format";

export default function KartuProduk({ produk }) {
  const isHabis = produk.stok === 0 || produk.status_stok === "habis";
  const adaDiskon = produk.harga_diskon && produk.harga_diskon < produk.harga;

  return (
    <Link
      href={`/produk/${produk.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-garis bg-latar"
    >
      <div className="relative aspect-square w-full bg-permukaan overflow-hidden">
        <img
          src={produk.foto_url}
          alt={produk.nama}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        {/* US-19: Label Habis */}
        {isHabis && (
          <span className="absolute top-2 left-2 rounded-md bg-bahaya px-2 py-0.5 text-xs font-bold text-white shadow-sm">
            Habis
          </span>
        )}
        {/* US-20: Badge Baru / Terlaris */}
        {!isHabis && produk.badge && (
          <span className="absolute top-2 left-2 rounded-md bg-utama px-2 py-0.5 text-xs font-bold text-white shadow-sm">
            {produk.badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <p className="text-xs text-teks-lembut">{produk.kategori}</p>
        <h3 className="font-semibold leading-snug group-hover:text-utama">{produk.nama}</h3>
        
        {/* US-20: Harga diskon dan harga coret */}
        <div className="mt-auto flex items-center gap-1.5 flex-wrap">
          <p className="rounded-md bg-harga-latar px-2 py-0.5 text-sm font-bold text-harga">
            {formatRupiah(adaDiskon ? produk.harga_diskon : produk.harga)}
          </p>
          {adaDiskon && (
            <span className="text-xs text-teks-lembut line-through">
              {formatRupiah(produk.harga)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
