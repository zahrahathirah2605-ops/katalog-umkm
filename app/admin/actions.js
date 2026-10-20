"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { buatKoneksiAdminSesi } from "@/lib/supabase/admin";

export async function loginAdmin(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const supabase = await buatKoneksiAdminSesi();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message || "Login gagal. Periksa email dan password." };
  }

  redirect("/admin");
}

export async function keluarAdmin() {
  const supabase = await buatKoneksiAdminSesi();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function gantiPasswordAdmin(prevState, formData) {
  const passwordBaru = formData.get("password_baru");
  const konfirmasiPassword = formData.get("konfirmasi_password");

  if (!passwordBaru || !konfirmasiPassword) {
    return { error: "Semua kolom password wajib diisi." };
  }

  if (passwordBaru.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (passwordBaru !== konfirmasiPassword) {
    return { error: "Konfirmasi password tidak cocok dengan password baru." };
  }

  const supabase = await buatKoneksiAdminSesi();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sesi tidak ditemukan. Silakan login kembali." };
  }

  const { error } = await supabase.auth.updateUser({
    password: passwordBaru,
  });

  if (error) {
    return { error: error.message || "Gagal mengganti password." };
  }

  return { sukses: "Password berhasil diperbarui." };
}

// US-29: Upload foto ke Supabase Storage dari Server
async function prosesUploadFoto(supabase, fileFoto) {
  if (!fileFoto || fileFoto.size === 0) return null;

  // Validasi tipe file
  if (!fileFoto.type.startsWith("image/")) {
    throw new Error("File harus berupa gambar (JPEG, PNG, WEBP, atau SVG).");
  }

  // Validasi ukuran file (maksimal 2MB)
  const MAX_SIZE = 2 * 1024 * 1024;
  if (fileFoto.size > MAX_SIZE) {
    throw new Error("Ukuran foto maksimal adalah 2MB.");
  }

  const ekstensi = fileFoto.name.split(".").pop();
  const namaFile = `produk-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ekstensi}`;

  const { data, error } = await supabase.storage
    .from("produk")
    .upload(namaFile, fileFoto, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    // Jika bucket 'produk' belum dibuat di Supabase Storage, fallback ke pesan jelas
    throw new Error(`Upload storage: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("produk").getPublicUrl(data.path);

  return publicUrl;
}

export async function tambahProduk(prevState, formData) {
  const supabase = await buatKoneksiAdminSesi();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Akses ditolak: Hanya admin yang dapat menambah produk." };
  }

  const nama = formData.get("nama")?.toString().trim();
  const hargaRaw = formData.get("harga")?.toString().trim();
  const kategori = formData.get("kategori")?.toString().trim() || null;
  let foto_url = formData.get("foto_url")?.toString().trim() || null;
  const deskripsi = formData.get("deskripsi")?.toString().trim() || null;
  const fileFoto = formData.get("file_foto");

  if (!nama) {
    return { error: "Nama produk wajib diisi." };
  }

  const harga = parseInt(hargaRaw, 10);
  if (isNaN(harga) || harga < 0) {
    return { error: "Harga harus berupa angka dan tidak boleh negatif." };
  }

  // Upload foto jika ada file yang diunggah (US-29)
  if (fileFoto && fileFoto.size > 0) {
    try {
      const urlHasilUpload = await prosesUploadFoto(supabase, fileFoto);
      if (urlHasilUpload) {
        foto_url = urlHasilUpload;
      }
    } catch (err) {
      return { error: err.message };
    }
  }

  const { error } = await supabase.from("produk").insert({
    nama,
    harga,
    kategori,
    foto_url,
    deskripsi,
  });

  if (error) {
    return { error: error.message || "Gagal menambahkan produk." };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

export async function ubahProduk(id, prevState, formData) {
  const supabase = await buatKoneksiAdminSesi();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Akses ditolak: Hanya admin yang dapat mengubah produk." };
  }

  const nama = formData.get("nama")?.toString().trim();
  const hargaRaw = formData.get("harga")?.toString().trim();
  const kategori = formData.get("kategori")?.toString().trim() || null;
  let foto_url = formData.get("foto_url")?.toString().trim() || null;
  const deskripsi = formData.get("deskripsi")?.toString().trim() || null;
  const fileFoto = formData.get("file_foto");

  if (!nama) {
    return { error: "Nama produk wajib diisi." };
  }

  const harga = parseInt(hargaRaw, 10);
  if (isNaN(harga) || harga < 0) {
    return { error: "Harga harus berupa angka dan tidak boleh negatif." };
  }

  if (fileFoto && fileFoto.size > 0) {
    try {
      const urlHasilUpload = await prosesUploadFoto(supabase, fileFoto);
      if (urlHasilUpload) {
        foto_url = urlHasilUpload;
      }
    } catch (err) {
      return { error: err.message };
    }
  }

  const { error } = await supabase
    .from("produk")
    .update({
      nama,
      harga,
      kategori,
      foto_url,
      deskripsi,
    })
    .eq("id", id);

  if (error) {
    return { error: error.message || "Gagal memperbarui produk." };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/produk/${id}`);
  redirect("/admin");
}

export async function hapusProduk(formData) {
  const id = formData.get("id");
  if (!id) return;

  const supabase = await buatKoneksiAdminSesi();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Akses ditolak: Hanya admin yang dapat menghapus produk.");
  }

  const { error } = await supabase.from("produk").delete().eq("id", id);

  if (error) {
    throw new Error(error.message || "Gagal menghapus produk.");
  }

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}
