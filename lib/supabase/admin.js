import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function buatKoneksiAdminSesi() {
  const cookieStore = await cookies();

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY harus disetel di environment variable."
    );
  }

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Dipanggil dari Server Component bisa diabaikan jika middleware/proxy yang refresh
        }
      },
    },
  });
}
