"use server";

import { redirect } from "next/navigation";
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
