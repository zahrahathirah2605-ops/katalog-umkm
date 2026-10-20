import { NextResponse } from "next/server";
import { buatKoneksiAdminSesi } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = await buatKoneksiAdminSesi();

    // Pastikan admin login (US-35: Endpoint memeriksa login: tanpa login ditolak)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Akses ditolak: Anda harus login sebagai admin." },
        { status: 401 }
      );
    }

    // Ambil semua produk
    const { data: daftarProduk, error } = await supabase
      .from("produk")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Format kolom CSV dengan aman (escape kutip ganda dan karakter khusus)
    const escapeCsv = (str) => {
      if (str === null || str === undefined) return '""';
      const clean = String(str).replace(/"/g, '""');
      return `"${clean}"`;
    };

    const headers = ["ID", "Nama Produk", "Harga", "Kategori", "Status", "Deskripsi", "URL Foto", "Dibuat Pada"];
    const rows = (daftarProduk || []).map((p) => [
      p.id,
      escapeCsv(p.nama),
      p.harga,
      escapeCsv(p.kategori || ""),
      p.aktif !== false ? "Aktif" : "Nonaktif",
      escapeCsv(p.deskripsi || ""),
      escapeCsv(p.foto_url || ""),
      escapeCsv(p.created_at || ""),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\r\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="produk-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
