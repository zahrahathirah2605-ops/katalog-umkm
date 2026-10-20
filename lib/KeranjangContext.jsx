"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { formatRupiah } from "@/lib/format";
import { toko } from "@/lib/toko";

const KeranjangContext = createContext();

export function KeranjangProvider({ children }) {
  const [itemKeranjang, setItemKeranjang] = useState([]);
  const [buka, setBuka] = useState(false);
  const [dimuat, setDimuat] = useState(false);

  // Muat dari localStorage saat awal
  useEffect(() => {
    try {
      const data = localStorage.getItem("keranjang_umkm");
      if (data) {
        setItemKeranjang(JSON.parse(data));
      }
    } catch {}
    setDimuat(true);
  }, []);

  // Simpan ke localStorage saat berubah
  useEffect(() => {
    if (dimuat) {
      try {
        localStorage.setItem("keranjang_umkm", JSON.stringify(itemKeranjang));
      } catch {}
    }
  }, [itemKeranjang, dimuat]);

  const tambahItem = (produk, jumlah = 1) => {
    const hargaPakai = produk.harga_diskon || produk.harga;
    setItemKeranjang((prev) => {
      const index = prev.findIndex((i) => i.id === produk.id);
      if (index > -1) {
        const baru = [...prev];
        baru[index].jumlah += jumlah;
        return baru;
      }
      return [
        ...prev,
        {
          id: produk.id,
          nama: produk.nama,
          harga: hargaPakai,
          foto_url: produk.foto_url,
          jumlah,
        },
      ];
    });
    setBuka(true);
  };

  const ubahJumlah = (id, jumlah) => {
    if (jumlah <= 0) {
      hapusItem(id);
      return;
    }
    setItemKeranjang((prev) =>
      prev.map((item) => (item.id === id ? { ...item, jumlah } : item))
    );
  };

  const hapusItem = (id) => {
    setItemKeranjang((prev) => prev.filter((item) => item.id !== id));
  };

  const totalItem = itemKeranjang.reduce((acc, curr) => acc + curr.jumlah, 0);
  const totalHarga = itemKeranjang.reduce(
    (acc, curr) => acc + curr.harga * curr.jumlah,
    0
  );

  const pesanSemuaWhatsApp = () => {
    if (itemKeranjang.length === 0) return;
    let daftarTeks = itemKeranjang
      .map(
        (i, idx) =>
          `${idx + 1}. ${i.nama} (${i.jumlah}x @ ${formatRupiah(i.harga)}) = ${formatRupiah(i.harga * i.jumlah)}`
      )
      .join("\n");

    const pesan = `Halo, saya ingin memesan produk berikut:\n\n${daftarTeks}\n\n*Total Belanja:* ${formatRupiah(totalHarga)}\n\nApakah semua pesanan di atas tersedia?`;
    const url = `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(pesan)}`;
    window.open(url, "_blank");
  };

  return (
    <KeranjangContext.Provider
      value={{
        itemKeranjang,
        tambahItem,
        ubahJumlah,
        hapusItem,
        totalItem,
        totalHarga,
        pesanSemuaWhatsApp,
        buka,
        setBuka,
      }}
    >
      {children}
    </KeranjangContext.Provider>
  );
}

export function useKeranjang() {
  return useContext(KeranjangContext);
}
