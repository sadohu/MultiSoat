// supabase.ts - solo helpers de autenticación (cliente en client.ts)
import { getSupabaseClient } from "./client.ts";
import { http401 } from "./http.ts";

export async function requireAuth(req: Request) {
    const token = (req.headers.get("Authorization") || "").replace(
        /^Bearer\s+/i,
        "",
    );
    if (!token) {
        return { user: null, error: new Error("Missing token") } as const;
    }
    const supabase = getSupabaseClient(req);
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) {
        return {
            user: null,
            error: error ?? new Error("Invalid token"),
        } as const;
    }
    return { user: data.user, error: null } as const;
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
export function withAuth(
    handler: (
        req: Request,
        ctx: { user: any; supabase: ReturnType<typeof getSupabaseClient> },
    ) => Promise<Response> | Response,
) {
    return async (req: Request): Promise<Response> => {
        const supabase = getSupabaseClient(req);
        const token = (req.headers.get("Authorization") || "").replace(
            /^Bearer\s+/i,
            "",
        );
        if (!token) return http401("Unauthorized");
        const { data, error } = await supabase.auth.getUser(token);
        const user = data?.user;
        if (error || !user) return http401("Unauthorized");
        return handler(req, { user, supabase });
    };
}
