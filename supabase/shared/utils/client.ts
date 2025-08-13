// client.ts - Supabase client creation (core)
import { createClient } from "jsr:@supabase/supabase-js";
import type { Database } from "../config/supabase.ts";

export function getSupabaseClient(req: Request) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY env vars");
  }
  const authHeader = req.headers.get("Authorization") ?? "";
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });
}
