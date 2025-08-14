// Edge Function: Proveedor - CRUD completo para proveedores
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

console.log("Edge Function: Proveedor - CRUD Proveedores");

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

// Validar datos de proveedor
function validateProveedorData(
  data: Partial<ProveedorData>,
  isUpdate = false,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!isUpdate) {
    // Validaciones requeridas para CREATE
    if (!data.tipo_documento) errors.push("tipo_documento es requerido");
    if (!data.numero_documento) errors.push("numero_documento es requerido");
  }

  // Validaciones de formato
  if (
    data.tipo_documento && !["RUC", "DNI", "CE"].includes(data.tipo_documento)
  ) {
    errors.push("tipo_documento debe ser: RUC, DNI o CE");
  }

  if (data.numero_documento) {
    if (
      data.tipo_documento === "RUC" &&
      !Validator.isValidRUC(data.numero_documento)
    ) {
      errors.push("RUC inválido (debe tener 11 dígitos)");
    }
    if (
      data.tipo_documento === "DNI" &&
      !Validator.isValidDNI(data.numero_documento)
    ) {
      errors.push("DNI inválido (debe tener 8 dígitos)");
    }
  }

  if (data.email && !Validator.isValidEmail(data.email)) {
    errors.push("Email tiene formato inválido");
  }

  if (data.telefono && !Validator.isValidPhone(data.telefono)) {
    errors.push("Teléfono inválido (debe tener 9 dígitos y empezar por 9)");
  }

  return { valid: errors.length === 0, errors };
}

Deno.serve(withCors(async (req: Request) => {
  const supabase = getSupabaseClient(req);
  const url = new URL(req.url);
  const method = req.method;
  const pathSegments = url.pathname.split("/").filter(Boolean);
  const proveedorId = pathSegments[pathSegments.length - 1];

  try {
    switch (method) {
      case "GET": {
        if (proveedorId && !isNaN(Number(proveedorId))) {
          // GET /proveedor/{id} - Obtener proveedor específico
          const { data: proveedor, error } = await supabase
            .from("proveedor")
            .select("*")
            .eq("id", proveedorId)
            .single();

          if (error || !proveedor) {
            return http404("Proveedor no encontrado");
          }

          return http200({
            proveedor,
            message: "Proveedor encontrado",
          });
        } else {
          // GET /proveedor - Listar todos los proveedores con filtros opcionales
          const page = parseInt(url.searchParams.get("page") || "1");
          const limit = parseInt(url.searchParams.get("limit") || "10");
          const search = url.searchParams.get("search") || "";
          const estado = url.searchParams.get("estado") || "";
          const tipo_documento = url.searchParams.get("tipo_documento") || "";

          let query = supabase
            .from("proveedor")
            .select("*", { count: "exact" });

          // Aplicar filtros
          if (search) {
            query = query.or(
              `nombre.ilike.%${search}%,razon_social.ilike.%${search}%,numero_documento.ilike.%${search}%`,
            );
          }
          if (estado) {
            query = query.eq("estado", estado);
          }
          if (tipo_documento) {
            query = query.eq("tipo_documento", tipo_documento);
          }

          // Paginación
          const offset = (page - 1) * limit;
          query = query.range(offset, offset + limit - 1);

          const { data: proveedores, error, count } = await query;

          if (error) {
            return http500("Error al obtener proveedores", error.message);
          }

          return http200({
            proveedores: proveedores || [],
            pagination: {
              page,
              limit,
              total: count || 0,
              totalPages: Math.ceil((count || 0) / limit),
            },
            filters: { search, estado, tipo_documento },
          });
        }
      }

      case "POST": {
        // POST /proveedor - Crear nuevo proveedor
        const proveedorData: ProveedorData = await req.json();

        const validation = validateProveedorData(proveedorData);
        if (!validation.valid) {
          return http400("Datos de proveedor inválidos", {
            errors: validation.errors,
          });
        }

        // Verificar si ya existe proveedor con el mismo documento
        const { data: existing } = await supabase
          .from("proveedor")
          .select("id")
          .eq("numero_documento", proveedorData.numero_documento)
          .single();

        if (existing) {
          return http400("Ya existe un proveedor con este número de documento");
        }

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
            estado: proveedorData.estado || "activo",
            created_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (createError) {
          return http500("Error al crear proveedor", createError.message);
        }

        return http201(newProveedor, "Proveedor creado exitosamente");
      }

      case "PUT": {
        // PUT /proveedor/{id} - Actualizar proveedor completo
        if (!proveedorId || isNaN(Number(proveedorId))) {
          return http400("ID de proveedor requerido");
        }

        const updateData: Partial<ProveedorData> = await req.json();

        const updateValidation = validateProveedorData(updateData, true);
        if (!updateValidation.valid) {
          return http400("Datos de proveedor inválidos", {
            errors: updateValidation.errors,
          });
        }

        // Verificar que el proveedor existe
        const { data: existingProveedor } = await supabase
          .from("proveedor")
          .select("id")
          .eq("id", proveedorId)
          .single();

        if (!existingProveedor) {
          return http404("Proveedor no encontrado");
        }

        // Si se actualiza el documento, verificar que no exista otro con el mismo
        if (updateData.numero_documento) {
          const { data: docExists } = await supabase
            .from("proveedor")
            .select("id")
            .eq("numero_documento", updateData.numero_documento)
            .neq("id", proveedorId)
            .single();

          if (docExists) {
            return http400(
              "Ya existe otro proveedor con este número de documento",
            );
          }
        }

        const { data: updatedProveedor, error: updateError } = await supabase
          .from("proveedor")
          .update({
            ...updateData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", proveedorId)
          .select()
          .single();

        if (updateError) {
          return http500("Error al actualizar proveedor", updateError.message);
        }

        return http200(updatedProveedor, "Proveedor actualizado exitosamente");
      }

      case "DELETE": {
        // DELETE /proveedor/{id} - Eliminar proveedor (soft delete)
        if (!proveedorId || isNaN(Number(proveedorId))) {
          return http400("ID de proveedor requerido");
        }

        // Verificar que el proveedor existe
        const { data: proveedorToDelete } = await supabase
          .from("proveedor")
          .select("id, estado")
          .eq("id", proveedorId)
          .single();

        if (!proveedorToDelete) {
          return http404("Proveedor no encontrado");
        }

        // Soft delete: cambiar estado a "inactivo"
        const { error: deleteError } = await supabase
          .from("proveedor")
          .update({
            estado: "inactivo",
            updated_at: new Date().toISOString(),
          })
          .eq("id", proveedorId);

        if (deleteError) {
          return http500("Error al eliminar proveedor", deleteError.message);
        }

        return http200(
          { id: proveedorId, estado: "inactivo" },
          "Proveedor eliminado exitosamente",
        );
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
