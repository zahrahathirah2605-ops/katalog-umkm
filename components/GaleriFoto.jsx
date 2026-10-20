"use client";

import { useState } from "react";

export default function GaleriFoto({ fotoUtama, daftarFoto = [] }) {
  // Satukan semua foto unik
  const semuaFoto = Array.from(new Set([fotoUtama, ...daftarFoto].filter(Boolean)));
  const [fotoAktif, setFotoAktif] = useState(semuaFoto[0] || fotoUtama);

  return (
    <div className="flex flex-col gap-3">
      <img
        src={fotoAktif}
        alt="Foto produk"
        className="aspect-square w-full rounded-2xl border border-garis bg-permukaan object-cover"
      />
      {semuaFoto.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {semuaFoto.map((foto, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setFotoAktif(foto)}
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all cursor-pointer ${
                fotoAktif === foto ? "border-utama" : "border-garis opacity-70 hover:opacity-100"
              }`}
            >
              <img src={foto} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
