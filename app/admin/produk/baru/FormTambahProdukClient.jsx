"use client";

import { useActionState } from "react";
import FormProduk from "@/components/FormProduk";
import { tambahProduk } from "@/app/admin/actions";

export default function FormTambahProdukClient({ daftarKategori = [] }) {
  const [state, formAction, isPending] = useActionState(tambahProduk, null);

  return (
    <FormProduk
      labelTombol="Simpan produk"
      action={formAction}
      error={state?.error}
      errors={state?.errors}
      values={state?.values}
      daftarKategori={daftarKategori}
      isPending={isPending}
    />
  );
}
