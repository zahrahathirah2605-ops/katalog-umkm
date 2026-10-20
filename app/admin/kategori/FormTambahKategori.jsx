"use client";

import { useActionState, useEffect, useRef } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { tambahKategori } from "@/app/admin/actions";

export default function FormTambahKategori() {
  const [state, formAction, isPending] = useActionState(tambahKategori, null);
  const formRef = useRef(null);

  useEffect(() => {
    if (state?.sukses) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1">
        <Input
          label="Nama Kategori"
          name="nama"
          placeholder="Misal: Minuman, Aksesoris"
          required
        />
      </div>
      <Tombol type="submit" disabled={isPending}>
        {isPending ? "Menyimpan..." : "Tambah"}
      </Tombol>
      {state?.error && (
        <p className="text-xs text-bahaya font-medium sm:self-center">{state.error}</p>
      )}
      {state?.sukses && (
        <p className="text-xs text-utama font-medium sm:self-center">{state.sukses}</p>
      )}
    </form>
  );
}
