"use server";

import { buatKoneksiAdminSesi } from "@/lib/supabase/admin";

export async function buatDeskripsiAI(nama, kategori) {
  const supabase = await buatKoneksiAdminSesi();

  // Pastikan admin login
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Akses ditolak: Hanya admin yang dapat menggunakan fitur AI." };
  }

  if (!nama) {
    return { error: "Nama produk harus diisi terlebih dahulu." };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Fallback ramah jika GEMINI_API_KEY belum disetel
    const katText = kategori ? ` dalam kategori ${kategori}` : "";
    return {
      deskripsi: `${nama} adalah produk berkualitas unggulan${katText} yang dibuat dengan bahan-bahan pilihan bermutu tinggi, higienis, serta siap memberikan kepuasan terbaik untuk kebutuhan harian Anda.`,
    };
  }

  try {
    const prompt = `Buatkan deskripsi produk yang menarik, ramah, dan menjual untuk UMKM dalam 2-3 kalimat singkat berbahasa Indonesia. Nama produk: "${nama}". Kategori: "${kategori || "Umum"}". Berikan langsung isi teks deskripsi tanpa tanda petik pembuka/penutup.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await res.json();
    const teks = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!teks) {
      throw new Error("Respon AI kosong.");
    }

    return { deskripsi: teks };
  } catch (err) {
    const katText = kategori ? ` dalam kategori ${kategori}` : "";
    return {
      deskripsi: `${nama} merupakan pilihan terbaik${katText} yang menghadirkan kualitas premium dan keunggulan rasa/manfaat khas UMKM lokal.`,
    };
  }
}
