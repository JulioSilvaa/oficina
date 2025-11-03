import { createClient } from "@supabase/supabase-js";

// Factory para criar o cliente do Supabase apenas quando as envs existem.
// Evita erro em tempo de import em ambientes sem .env configurado.
export function getSupabaseServer() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase não configurado. Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env.local"
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false },
    db: { schema: "public" },
  });
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];
