// Reusable HTTP helpers for Edge Functions (Deno) - Patrón unificado
import { corsConfig } from "../config/config.ts";

// Construye headers CORS a partir de corsConfig
export function getCorsHeaders(): HeadersInit {
    return {
        "Access-Control-Allow-Origin": corsConfig.allowedOrigins.join(","),
        "Access-Control-Allow-Headers": corsConfig.allowedHeaders.join(", "),
        "Access-Control-Allow-Methods": corsConfig.allowedMethods.join(","),
    };
}

// Snapshot inicial
export const corsHeaders: HeadersInit = getCorsHeaders();

// Tipo para respuestas estandarizadas
type ApiResponse<T = unknown> = {
    data?: T;
    success: boolean;
    status: number;
    message?: string;
    error?: { message: string; code?: string; details?: unknown };
};

// Constructor base para todas las respuestas
function buildResponse<T>(
    success: boolean,
    status: number,
    data?: T,
    message?: string,
    error?: { message: string; code?: string; details?: unknown },
    logLevel: "log" | "error" = "log",
): Response {
    const payload: ApiResponse<T> = { success, status };

    if (data !== undefined) payload.data = data;
    if (message) payload.message = message;
    if (error) payload.error = error;

    // Log según nivel
    if (logLevel === "error") {
        console.error(
            `[${status}]`,
            message || error?.message || "",
            data || error?.details,
        );
    } else {
        console.log(`[${status}]`, message || "", data);
    }

    return new Response(JSON.stringify(payload), {
        status,
        headers: mergeHeaders(getCorsHeaders(), {
            "Content-Type": "application/json",
        }),
    });
}

// Respuestas de éxito
export function http200<T>(data: T, message?: string): Response {
    return buildResponse(true, 200, data, message);
}

export function http201<T>(data: T, message?: string): Response {
    return buildResponse(true, 201, data, message);
}

// Respuestas de error
export function http400(
    message = "Solicitud incorrecta",
    details?: unknown,
): Response {
    return buildResponse(
        false,
        400,
        undefined,
        undefined,
        { message, details },
        "error",
    );
}

export function http401(
    message = "No autorizado",
    details?: unknown,
): Response {
    return buildResponse(
        false,
        401,
        undefined,
        undefined,
        { message, details },
        "error",
    );
}

export function http404(
    message = "No encontrado",
    details?: unknown,
): Response {
    return buildResponse(
        false,
        404,
        undefined,
        undefined,
        { message, details },
        "error",
    );
}

export function http500(
    message = "Error interno del servidor",
    details?: unknown,
): Response {
    return buildResponse(
        false,
        500,
        undefined,
        undefined,
        { message, details },
        "error",
    );
}

// Helpers genéricos (compatibilidad hacia atrás)
export function jsonResponse<T>(data: T, init: ResponseInit = {}): Response {
    const headers = mergeHeaders(init.headers, {
        "Content-Type": "application/json",
        ...getCorsHeaders(),
    });
    return new Response(JSON.stringify(data), { ...init, headers });
}

export function errorResponse(
    message: string,
    status = 400,
    code?: string,
    details?: unknown,
): Response {
    return buildResponse(false, status, undefined, undefined, {
        message,
        code,
        details,
    }, "error");
}

// CORS middleware
export function withCors(
    handler: (req: Request) => Promise<Response> | Response,
): (req: Request) => Promise<Response> {
    return async (req: Request) => {
        const ch = getCorsHeaders();
        if (req.method === "OPTIONS") {
            return new Response("ok", { headers: ch });
        }

        try {
            const res = await handler(req);
            return withHeaders(res, ch);
        } catch (e) {
            return http500("Internal Server Error", e);
        }
    };
}

// Utilidades de headers
export function withHeaders(res: Response, extra: HeadersInit): Response {
    const headers = mergeHeaders(res.headers, extra);
    return new Response(res.body, { ...res, headers });
}

export function mergeHeaders(
    a?: HeadersInit | null,
    b?: HeadersInit | null,
): Headers {
    const h = new Headers();
    const appendAll = (src?: HeadersInit | null) => {
        if (!src) return;
        const iter = src instanceof Headers
            ? src.entries()
            : Object.entries(src);
        for (const [k, v] of iter as Iterable<[string, string]>) {
            h.set(k, v);
        }
    };
    appendAll(a);
    appendAll(b);
    return h;
}
