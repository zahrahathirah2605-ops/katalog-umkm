"use client";

import { useActionState } from "react";
import FormProduk from "@/components/FormProduk";
import { ubahProduk } from "@/app/admin/actions";

export default function FormUbahProduk({ produk, daftarKategori = [] }) {
  const ubahProdukDenganId = ubahProduk.bind(null, produk.id);
  const [state, formAction, isPending] = useActionState(ubahProdukDenganId, null);

  return (
    <FormProduk
      produk={produk}
      labelTombol="Simpan perubahan"
      action={formAction}
      error={state?.error}
      errors={state?.errors}
      values={state?.values}
      daftarKategori={daftarKategori}
      isPending={isPending}
    />
  );
}

