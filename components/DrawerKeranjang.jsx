"use client";

import { useKeranjang } from "@/lib/KeranjangContext";
import { formatRupiah } from "@/lib/format";

export default function DrawerKeranjang() {
  const {
    itemKeranjang,
    ubahJumlah,
    hapusItem,
    totalItem,
    totalHarga,
    pesanSemuaWhatsApp,
    buka,
    setBuka,
  } = useKeranjang();

  if (!buka) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
      <div className="flex h-full w-full max-w-md flex-col bg-latar border-l border-garis shadow-2xl">
        {/* Header Drawer */}
        <div className="flex items-center justify-between border-b border-garis px-5 py-4">
          <h2 className="text-lg font-bold">Keranjang ({totalItem})</h2>
          <button
            type="button"
            onClick={() => setBuka(false)}
            className="rounded-lg p-1 text-teks-lembut hover:bg-permukaan hover:text-teks cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Daftar Item */}
        <div className="flex-1 overflow-y-auto p-5">
          {itemKeranjang.length === 0 ? (
            <p className="py-12 text-center text-sm text-teks-lembut">
              Keranjang masih kosong.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {itemKeranjang.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-xl border border-garis p-3"
                >
                  <img
                    src={item.foto_url}
                    alt=""
                    className="h-14 w-14 rounded-lg object-cover bg-permukaan"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-sm leading-tight">{item.nama}</p>
                    <p className="text-xs text-utama font-bold mt-1">
                      {formatRupiah(item.harga)}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => ubahJumlah(item.id, item.jumlah - 1)}
                        className="h-6 w-6 rounded border border-garis text-xs font-bold hover:bg-permukaan"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold px-1">{item.jumlah}</span>
                      <button
                        type="button"
                        onClick={() => ubahJumlah(item.id, item.jumlah + 1)}
                        className="h-6 w-6 rounded border border-garis text-xs font-bold hover:bg-permukaan"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => hapusItem(item.id)}
                    className="text-xs text-bahaya hover:underline cursor-pointer p-1"
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Keranjang */}
        {itemKeranjang.length > 0 && (
          <div className="border-t border-garis p-5 flex flex-col gap-3 bg-permukaan/30">
            <div className="flex items-center justify-between font-bold text-base">
              <span>Total Belanja:</span>
              <span className="text-harga">{formatRupiah(totalHarga)}</span>
            </div>
            <button
              type="button"
              onClick={pesanSemuaWhatsApp}
              className="w-full rounded-lg bg-utama py-3 font-semibold text-white hover:bg-utama-gelap text-sm cursor-pointer"
            >
              Pesan Semua via WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
