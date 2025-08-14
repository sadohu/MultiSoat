// supabase.ts - Supabase client and authentication helpers
import { createClient } from "jsr:@supabase/supabase-js";
import type { Database } from "../config/supabase.ts";
import { http401 } from "./http.ts";

// Create Supabase client with proper typing from dashboard
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

export async function requireAuth(req: Request) {
    const supabase = getSupabaseClient(req);
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return {
            success: false,
            error: error?.message || "Unauthorized",
            user: null,
        };
    }

    return { success: true, error: null, user };
}

/**
 * withAuth - Envuelve un handler y responde 401 si no hay usuario autenticado.
 * No se usa por defecto; las funciones quedan públicas salvo que:
 *  - Configures en el dashboard de Supabase (JWT required)
 *  - O explícitamente envuelvas tu handler con withAuth.
 * Ejemplo:
 *   import { withAuth } from "shared/utils/supabase.ts";
 *   Deno.serve(withCors(withAuth(async (req,{ user, supabase }) => { ... })));
 */
export function withAuth<T extends any[]>(
    handler: (
        req: Request,
        context: { user: any; supabase: ReturnType<typeof getSupabaseClient> },
        ...args: T
    ) => Promise<Response>,
) {
    return async (req: Request, ...args: T): Promise<Response> => {
        const authResult = await requireAuth(req);
        if (!authResult.success) {
            return http401(authResult.error);
        }

        const supabase = getSupabaseClient(req);
        return handler(req, { user: authResult.user, supabase }, ...args);
    };
}
