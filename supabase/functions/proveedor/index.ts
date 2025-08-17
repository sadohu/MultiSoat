// Edge Function: Proveedor - CRUD completo para proveedores con auditoría
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import {
  http200,
  http201,
  http400,
  http404,
  http500,
  withCors,
} from "shared/utils/http.ts";
import { getSupabaseClient } from "shared/utils/client-auth.ts";
import { Validator } from "shared/utils/Validator.ts";
import {
  enrichWithAuditInfo,
  withAudit,
  withOptionalAuth,
} from "shared/utils/audit.ts";

console.log(
  "Edge Function: Proveedor - CRUD Proveedores con Auditoría Completa",
);

interface ProveedorData {
  nombre?: string;
  razon_social?: string;
  tipo_documento: string; // RUC, DNI, CE
  numero_documento: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  estado?: string;
}

// Constantes
const VALID_ESTADOS = ["registrado", "inactivo"] as const;
const VALID_TIPO_DOCUMENTOS = ["RUC", "DNI", "CE"] as const;
const DEFAULT_PAGE_LIMIT = 10;
const MAX_PAGE_LIMIT = 100;

// Funciones auxiliares
function parseProveedorId(pathSegments: string[]): number | null {
  const id = pathSegments[pathSegments.length - 1];
  return id && !isNaN(Number(id)) ? Number(id) : null;
}

function validatePaginationParams(
  page: string,
  limit: string,
): { valid: boolean; error?: string; page?: number; limit?: number } {
  const parsedPage = parseInt(page || "1");
  const parsedLimit = parseInt(limit || DEFAULT_PAGE_LIMIT.toString());

  if (isNaN(parsedPage) || parsedPage < 1) {
    return {
      valid: false,
      error: "El parámetro 'page' debe ser un número entero mayor a 0",
    };
  }
  if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > MAX_PAGE_LIMIT) {
    return {
      valid: false,
      error:
        `El parámetro 'limit' debe ser un número entero entre 1 y ${MAX_PAGE_LIMIT}`,
    };
  }

  return { valid: true, page: parsedPage, limit: parsedLimit };
}

function validateFilterParams(
  estado: string,
  tipo_documento: string,
): { valid: boolean; error?: string } {
  if (
    estado && !VALID_ESTADOS.includes(estado as typeof VALID_ESTADOS[number])
  ) {
    return {
      valid: false,
      error: `El parámetro 'estado' debe ser uno de: ${
        VALID_ESTADOS.join(", ")
      }`,
    };
  }
  if (
    tipo_documento &&
    !VALID_TIPO_DOCUMENTOS.includes(
      tipo_documento as typeof VALID_TIPO_DOCUMENTOS[number],
    )
  ) {
    return {
      valid: false,
      error: `El parámetro 'tipo_documento' debe ser uno de: ${
        VALID_TIPO_DOCUMENTOS.join(", ")
      }`,
    };
  }
  return { valid: true };
}

function sanitizeSearchTerm(search: string): string {
  return search.replace(/[%_'"\\]/g, "");
}

// deno-lint-ignore no-explicit-any
function applyFilters(
  query: any,
  search: string,
  estado: string,
  tipo_documento: string,
) {
  if (search) {
    const sanitizedSearch = sanitizeSearchTerm(search);
    if (sanitizedSearch.length > 0) {
      query = query.or(
        `nombre.ilike.%${sanitizedSearch}%,razon_social.ilike.%${sanitizedSearch}%,numero_documento.ilike.%${sanitizedSearch}%`,
      );
    }
  }
  if (estado) {
    query = query.eq("estado", estado);
  }
  if (tipo_documento) {
    query = query.eq("tipo_documento", tipo_documento);
  }
  return query;
}

// deno-lint-ignore no-explicit-any
function handleDatabaseError(error: any): Response {
  let errorMessage = "Error desconocido en consulta";
  let errorCode = "unknown";

  try {
    if (error.code) {
      errorCode = error.code;
    }

    if (error.message && error.message.startsWith('{"')) {
      errorMessage = "Error de consulta en base de datos";
    } else if (error.message) {
      errorMessage = error.message;
    }

    if (
      error.details && typeof error.details === "string" &&
      !error.details.startsWith('{"')
    ) {
      errorMessage = error.details;
    }
  } catch (_parseError) {
    errorMessage = "Error al procesar respuesta de base de datos";
  }

  return http500(
    "Error al obtener proveedores",
    `${errorCode !== "unknown" ? `Code ${errorCode}: ` : ""}${errorMessage}`,
  );
}

// deno-lint-ignore no-explicit-any
async function checkDuplicateDocument(
  supabase: any,
  numero_documento: string,
  excludeId?: number,
): Promise<boolean> {
  let query = supabase
    .from("proveedor")
    .select("id")
    .eq("numero_documento", numero_documento);

  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { data } = await query.single();
  return !!data;
}

Deno.serve(withCors((req: Request) => {
  const supabase = getSupabaseClient(req);
  const url = new URL(req.url);
  const method = req.method;
  const pathSegments = url.pathname.split("/").filter(Boolean);
  const proveedorId = parseProveedorId(pathSegments);

  try {
    switch (method) {
      case "GET": {
        // GET /proveedor - Operaciones de lectura (AUTENTICACIÓN OPCIONAL)
        return withOptionalAuth(async (_req, user) => {
          if (proveedorId) {
            // GET /proveedor/{id} - Obtener proveedor específico
            const { data: proveedor, error } = await supabase
              .from("proveedor")
              .select("*")
              .eq("id", proveedorId)
              .single();

            if (error || !proveedor) {
              return http404("Proveedor no encontrado");
            }

            // Enriquecer respuesta si el usuario está autenticado
            if (user) {
              return http200({
                proveedor,
                message: "Proveedor encontrado",
                userInfo: {
                  viewedBy: user.email,
                  canEdit: user.rol === "admin" || user.rol === "supervisor",
                  timestamp: new Date().toISOString(),
                },
              });
            }

            // Respuesta básica para usuarios no autenticados
            return http200({
              proveedor,
              message: "Proveedor encontrado",
            });
          } else {
            // GET /proveedor - Listar todos los proveedores con filtros opcionales
            const searchParams = url.searchParams;
            const search = searchParams.get("search") || "";
            const estado = searchParams.get("estado") || "";
            const tipo_documento = searchParams.get("tipo_documento") || "";

            // Validar parámetros de paginación
            const paginationValidation = validatePaginationParams(
              searchParams.get("page") || "",
              searchParams.get("limit") || "",
            );
            if (!paginationValidation.valid) {
              return http400(paginationValidation.error!);
            }
            const { page, limit } = paginationValidation;

            // TypeScript assertion - ya validamos que existen
            const validPage = page!;
            const validLimit = limit!;

            // Validar parámetros de filtro
            const filterValidation = validateFilterParams(
              estado,
              tipo_documento,
            );
            if (!filterValidation.valid) {
              return http400(filterValidation.error!);
            }

            try {
              // Primera query: Solo obtener el count
              let countQuery = supabase
                .from("proveedor")
                .select("*", { count: "exact", head: true });

              // Aplicar filtros al count
              countQuery = applyFilters(
                countQuery,
                search,
                estado,
                tipo_documento,
              );

              const { count, error: countError } = await countQuery;

              if (countError) {
                return http500(
                  "Error al consultar total de registros",
                  countError.message,
                );
              }

              const total = count || 0;
              const totalPages = Math.ceil(total / validLimit);

              // Verificar si la página solicitada existe
              if (validPage > totalPages && total > 0) {
                return http400(
                  `La página ${validPage} no existe. Solo hay ${totalPages} página(s) disponible(s) con ${total} registro(s) total(es).`,
                );
              }

              // Segunda query: Obtener los datos con paginación
              let dataQuery = supabase
                .from("proveedor")
                .select("*");

              // Aplicar los mismos filtros
              dataQuery = applyFilters(
                dataQuery,
                search,
                estado,
                tipo_documento,
              );

              const offset = (validPage - 1) * validLimit;
              dataQuery = dataQuery.range(offset, offset + validLimit - 1);

              const { data: proveedores, error } = await dataQuery;

              if (error) {
                return handleDatabaseError(error);
              }

              // Enriquecer respuesta según estado de autenticación
              const responseData = {
                data: proveedores || [],
                pagination: {
                  page: validPage,
                  limit: validLimit,
                  total,
                  totalPages,
                  hasNextPage: validPage < totalPages,
                  hasPrevPage: validPage > 1,
                },
                filters: { search, estado, tipo_documento },
                message: total === 0
                  ? "No se encontraron proveedores con los filtros aplicados"
                  : `Se encontraron ${total} proveedor(es). Mostrando página ${validPage} de ${totalPages}.`,
              };

              // Si hay usuario autenticado, agregar información adicional
              if (user) {
                return http200({
                  ...responseData,
                  userInfo: {
                    viewedBy: user.email,
                    canCreate: user.rol === "admin" ||
                      user.rol === "supervisor",
                    canEdit: user.rol === "admin" || user.rol === "supervisor",
                    viewTimestamp: new Date().toISOString(),
                  },
                });
              }

              return http200(responseData);
            } catch (generalError) {
              return http500(
                "Error general",
                `${(generalError as Error).message || "Error desconocido"}`,
              );
            }
          } // Cerrar else
        })(req); // Cerrar withOptionalAuth
      }

      case "POST": {
        // POST /proveedor - Crear nuevo proveedor (CON AUDITORÍA OBLIGATORIA)
        return withAudit(async (_req, auditInfo) => {
          const proveedorData: ProveedorData = await req.json();

          const validation = Validator.validateProveedorData(proveedorData);
          if (!validation.valid) {
            return http400("Datos de proveedor inválidos", {
              errors: validation.errors,
            });
          }

          // Verificar si ya existe proveedor con el mismo documento
          const duplicateExists = await checkDuplicateDocument(
            supabase,
            proveedorData.numero_documento,
          );
          if (duplicateExists) {
            return http400(
              "Ya existe un proveedor con este número de documento",
            );
          }

          // Insertar con campos de auditoría automáticos
          const { data: newProveedor, error: createError } = await supabase
            .from("proveedor")
            .insert({
              nombre: proveedorData.nombre,
              razon_social: proveedorData.razon_social,
              tipo_documento: proveedorData.tipo_documento,
              numero_documento: proveedorData.numero_documento,
              email: proveedorData.email,
              telefono: proveedorData.telefono,
              direccion: proveedorData.direccion,
              estado: proveedorData.estado || "registrado",
              ...auditInfo.fields, // Campos de auditoría: created_by, updated_by, created_at, updated_at
            })
            .select()
            .single();

          if (createError) {
            return http500("Error al crear proveedor", createError.message);
          }

          // Respuesta enriquecida con información de auditoría
          return http201(
            enrichWithAuditInfo(newProveedor, auditInfo, "created"),
            "Proveedor creado exitosamente",
          );
        })(req);
      }

      case "PUT": {
        // PUT /proveedor/{id} - Actualizar proveedor (CON AUDITORÍA OBLIGATORIA)
        if (!proveedorId || isNaN(Number(proveedorId))) {
          return http400("ID de proveedor requerido");
        }

        return withAudit(async (_req, auditInfo) => {
          const updateData: Partial<ProveedorData> = await req.json();

          const updateValidation = Validator.validateProveedorData(
            updateData,
            true,
          );
          if (!updateValidation.valid) {
            return http400("Datos de proveedor inválidos", {
              errors: updateValidation.errors,
            });
          }

          // Verificar que el proveedor existe
          const { data: existingProveedor } = await supabase
            .from("proveedor")
            .select("id")
            .eq("id", proveedorId!)
            .single();

          if (!existingProveedor) {
            return http404("Proveedor no encontrado");
          }

          // Si se actualiza el documento, verificar que no exista otro con el mismo
          if (updateData.numero_documento) {
            const duplicateExists = await checkDuplicateDocument(
              supabase,
              updateData.numero_documento,
              proveedorId!,
            );
            if (duplicateExists) {
              return http400(
                "Ya existe otro proveedor con este número de documento",
              );
            }
          }

          // Actualizar con campos de auditoría
          const { data: updatedProveedor, error: updateError } = await supabase
            .from("proveedor")
            .update({
              ...updateData,
              ...auditInfo.fields, // Campos de auditoría: updated_by, updated_at
            })
            .eq("id", proveedorId!)
            .select()
            .single();

          if (updateError) {
            return http500(
              "Error al actualizar proveedor",
              updateError.message,
            );
          }

          // Respuesta enriquecida con información de auditoría
          return http200(
            enrichWithAuditInfo(updatedProveedor, auditInfo, "updated"),
            "Proveedor actualizado exitosamente",
          );
        })(req);
      }

      case "DELETE": {
        // DELETE /proveedor/{id} - Eliminar proveedor (CON AUDITORÍA OBLIGATORIA)
        if (!proveedorId) {
          return http400("ID de proveedor requerido");
        }

        return withAudit(async (_req, auditInfo) => {
          // Verificar que el proveedor existe
          const { data: proveedorToDelete } = await supabase
            .from("proveedor")
            .select("id, estado")
            .eq("id", proveedorId!)
            .single();

          if (!proveedorToDelete) {
            return http404("Proveedor no encontrado");
          }

          // Soft delete: cambiar estado a "inactivo" con auditoría
          const { data: deletedProveedor, error: deleteError } = await supabase
            .from("proveedor")
            .update({
              estado: "inactivo",
              ...auditInfo.fields, // Campos de auditoría: updated_by, updated_at
            })
            .eq("id", proveedorId!)
            .select()
            .single();

          if (deleteError) {
            return http500("Error al eliminar proveedor", deleteError.message);
          }

          // Respuesta enriquecida con información de auditoría
          return http200(
            enrichWithAuditInfo(deletedProveedor, auditInfo, "updated"),
            "Proveedor eliminado exitosamente",
          );
        })(req);
      }

      default: {
        return http400(`Método ${method} no permitido`);
      }
    }
  } catch (error) {
    console.error("Error en Edge Function Proveedor:", error);
    return http500("Error interno del servidor", (error as Error).message);
  }
}));
