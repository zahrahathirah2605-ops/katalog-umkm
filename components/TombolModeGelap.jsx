"use client";

import { useEffect, useState } from "react";

export default function TombolModeGelap() {
  const [tema, setTema] = useState("terang");

  useEffect(() => {
    const simpanan = localStorage.getItem("tema");
    if (simpanan === "gelap" || (!simpanan && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setTema("gelap");
      document.documentElement.classList.add("dark");
    } else {
      setTema("terang");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const gantiTema = () => {
    if (tema === "terang") {
      setTema("gelap");
      document.documentElement.classList.add("dark");
      localStorage.setItem("tema", "gelap");
    } else {
      setTema("terang");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("tema", "terang");
    }
  };

  return (
    <button
      type="button"
      onClick={gantiTema}
      className="rounded-full p-2 text-teks-lembut hover:bg-permukaan hover:text-utama cursor-pointer transition-colors"
      aria-label="Ganti mode gelap/terang"
      title="Ganti mode gelap/terang"
    >
      {tema === "gelap" ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
}
