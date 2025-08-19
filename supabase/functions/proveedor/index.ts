// Edge Function: Proveedor - CRUD simplificado sin autenticación
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import {
  http200,
  http201,
  http400,
  http404,
  http500,
  withCors,
} from "shared/utils/http.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

console.log("Edge Function: Proveedor - CRUD Simplificado sin JWT");

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

// Constantes simplificadas
const DEFAULT_PAGE_LIMIT = 10;
const MAX_PAGE_LIMIT = 100;

// Funciones auxiliares básicas
function parseProveedorId(pathSegments: string[]): number | null {
  const id = pathSegments[pathSegments.length - 1];
  return id && !isNaN(Number(id)) ? Number(id) : null;
}

Deno.serve(withCors(async (req: Request) => {
  // Cliente Supabase simple sin autenticación
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const url = new URL(req.url);
  const method = req.method;
  const pathSegments = url.pathname.split("/").filter(Boolean);
  const proveedorId = parseProveedorId(pathSegments);

  try {
    switch (method) {
      case "GET": {
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

          return http200({
            success: true,
            data: proveedor,
            message: "Proveedor encontrado",
          });
        } else {
          // GET /proveedor - Listar todos los proveedores
          const searchParams = url.searchParams;
          const page = parseInt(searchParams.get("page") || "1");
          const limit = Math.min(
            parseInt(
              searchParams.get("limit") || DEFAULT_PAGE_LIMIT.toString(),
            ),
            MAX_PAGE_LIMIT,
          );
          const offset = (page - 1) * limit;

          // Consultar proveedores con paginación básica
          const { data: proveedores, error, count } = await supabase
            .from("proveedor")
            .select("*", { count: "exact" })
            .range(offset, offset + limit - 1);

          if (error) {
            return http500("Error al consultar proveedores", error.message);
          }

          const total = count || 0;
          const totalPages = Math.ceil(total / limit);

          return http200({
            success: true,
            data: proveedores || [],
            pagination: {
              page,
              limit,
              total,
              totalPages,
              hasNextPage: page < totalPages,
              hasPrevPage: page > 1,
            },
            message: `Se encontraron ${total} proveedor(es)`,
          });
        }
      }

      case "POST": {
        // POST /proveedor - Crear nuevo proveedor
        const proveedorData: ProveedorData = await req.json();

        // Validación básica
        if (
          !proveedorData.numero_documento || !proveedorData.tipo_documento ||
          !proveedorData.email
        ) {
          return http400(
            "numero_documento, tipo_documento y email son requeridos",
          );
        }

        // Verificar duplicado básico
        const { data: existing } = await supabase
          .from("proveedor")
          .select("id")
          .eq("numero_documento", proveedorData.numero_documento)
          .single();

        if (existing) {
          return http400("Ya existe un proveedor con este número de documento");
        }

        // Insertar nuevo proveedor
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
            estado: proveedorData.estado || "PENDIENTE_USUARIO",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (createError) {
          return http500("Error al crear proveedor", createError.message);
        }

        return http201({
          success: true,
          data: newProveedor,
          message: "Proveedor creado exitosamente",
        });
      }

      case "PUT": {
        // PUT /proveedor/{id} - Actualizar proveedor
        if (!proveedorId) {
          return http400("ID de proveedor requerido");
        }

        const updateData: Partial<ProveedorData> = await req.json();

        // Verificar que el proveedor existe
        const { data: existing } = await supabase
          .from("proveedor")
          .select("id")
          .eq("id", proveedorId)
          .single();

        if (!existing) {
          return http404("Proveedor no encontrado");
        }

        // Actualizar proveedor
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

        return http200({
          success: true,
          data: updatedProveedor,
          message: "Proveedor actualizado exitosamente",
        });
      }

      case "DELETE": {
        // DELETE /proveedor/{id} - Eliminar proveedor (soft delete)
        if (!proveedorId) {
          return http400("ID de proveedor requerido");
        }

        // Verificar que el proveedor existe
        const { data: existing } = await supabase
          .from("proveedor")
          .select("id")
          .eq("id", proveedorId)
          .single();

        if (!existing) {
          return http404("Proveedor no encontrado");
        }

        // Soft delete: cambiar estado a INACTIVO
        const { data: deletedProveedor, error: deleteError } = await supabase
          .from("proveedor")
          .update({
            estado: "INACTIVO",
            updated_at: new Date().toISOString(),
          })
          .eq("id", proveedorId)
          .select()
          .single();

        if (deleteError) {
          return http500("Error al eliminar proveedor", deleteError.message);
        }

        return http200({
          success: true,
          data: deletedProveedor,
          message: "Proveedor eliminado exitosamente",
        });
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
