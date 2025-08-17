// Utilidades de Auditoría para MultiSoat
// Sistema completo de trazabilidad con autenticación obligatoria

import { getSupabaseClient } from "./client-auth.ts";
import { http401 } from "./http.ts";

// ====================================
// TIPOS DE AUDITORÍA
// ====================================

export interface AuditFields {
  created_by?: string; // UUID de Supabase Auth
  updated_by?: string; // UUID de Supabase Auth
  created_at?: string; // ISO timestamp
  updated_at?: string; // ISO timestamp
}

export interface AuditInfo {
  user: {
    id: string;
    email: string;
    nombre?: string;
    apellido?: string;
    rol?: string;
  };
  fields: AuditFields;
}

// ====================================
// AUTENTICACIÓN REQUERIDA
// ====================================

/**
 * Extrae y valida el usuario autenticado desde el token JWT
 * Requerido para todas las operaciones CRUD
 */
export async function requireAuth(req: Request): Promise<{
  user: any;
  error?: string;
}> {
  try {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { user: null, error: "Token de autorización requerido" };
    }

    const token = authHeader.substring(7);

    // Usar cliente Supabase existente
    const supabase = getSupabaseClient(req);

    // Validar token con Supabase Auth
    const { data: userData, error: userError } = await supabase.auth.getUser(
      token,
    );

    if (userError || !userData.user) {
      return { user: null, error: "Token inválido o expirado" };
    }

    return {
      user: {
        id: userData.user.id,
        email: userData.user.email!,
        nombre: userData.user.user_metadata?.nombre || "",
        apellido: userData.user.user_metadata?.apellido || "",
        rol: userData.user.user_metadata?.rol || "usuario",
      },
      error: undefined,
    };
  } catch (error) {
    return { user: null, error: "Error al validar autenticación" };
  }
}

// ====================================
// CAMPOS DE AUDITORÍA
// ====================================

/**
 * Genera campos de auditoría basados en el usuario autenticado
 * @param req Request con token de autorización
 * @param isUpdate true para operaciones UPDATE, false para CREATE
 */
export async function getAuditFields(
  req: Request,
  isUpdate = false,
): Promise<AuditInfo> {
  const { user, error } = await requireAuth(req);

  if (error || !user) {
    throw new Error(`Autenticación requerida: ${error || "Usuario no válido"}`);
  }

  const now = new Date().toISOString();

  if (isUpdate) {
    return {
      user,
      fields: {
        updated_by: user.id,
        updated_at: now,
      },
    };
  }

  return {
    user,
    fields: {
      created_by: user.id,
      updated_by: user.id,
      created_at: now,
      updated_at: now,
    },
  };
}

// ====================================
// MIDDLEWARE DE AUDITORÍA
// ====================================

/**
 * Middleware que automaticamente maneja autenticación y auditoría
 * Todas las operaciones CUD requieren autenticación
 */
export function withAudit<T>(
  handler: (req: Request, auditInfo: AuditInfo) => Promise<Response>,
) {
  return async (req: Request): Promise<Response> => {
    try {
      const isUpdate = req.method === "PUT" || req.method === "PATCH";
      const auditInfo = await getAuditFields(req, isUpdate);

      return await handler(req, auditInfo);
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : "Error de autenticación";
      return http401("Acceso denegado", errorMessage);
    }
  };
}

/**
 * Middleware específico para operaciones de lectura con autenticación opcional
 * Permite consultas públicas pero enriquece con info de usuario si está autenticado
 */
export function withOptionalAuth(
  handler: (req: Request, user?: AuditInfo["user"]) => Promise<Response>,
) {
  return async (req: Request): Promise<Response> => {
    try {
      const { user } = await requireAuth(req);
      return await handler(req, user);
    } catch {
      // Si falla la auth en operaciones de lectura, continúa sin usuario
      return await handler(req, undefined);
    }
  };
}

// ====================================
// HELPERS DE RESPUESTA CON AUDITORÍA
// ====================================

/**
 * Enriquece respuestas con información de auditoría
 */
export function enrichWithAuditInfo(
  data: any,
  auditInfo: AuditInfo,
  operation: "created" | "updated",
) {
  return {
    ...data,
    auditInfo: {
      operation,
      performedBy: {
        id: auditInfo.user.id,
        email: auditInfo.user.email,
        nombre: auditInfo.user.nombre,
        rol: auditInfo.user.rol,
      },
      timestamp: operation === "created"
        ? auditInfo.fields.created_at
        : auditInfo.fields.updated_at,
    },
  };
}
