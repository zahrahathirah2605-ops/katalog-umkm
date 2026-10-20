import Link from "next/link";
import { toko } from "@/lib/toko";
import TombolModeGelap from "@/components/TombolModeGelap";
import TombolBukaKeranjang from "@/components/TombolBukaKeranjang";

export default function Header() {
  return (
    <header className="border-b border-garis bg-latar">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-extrabold tracking-tight text-utama">
          {toko.nama}
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/tentang" className="text-sm font-semibold text-teks-lembut hover:text-utama">
            Tentang
          </Link>
          <TombolModeGelap />
          <TombolBukaKeranjang />
        </div>
      </div>
    </header>
  );
}
