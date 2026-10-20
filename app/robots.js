export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://katalog-umkm.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/*"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
