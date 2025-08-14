// Edge Function: Empresa - CRUD completo para proveedores/empresas
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

console.log("Edge Function: Empresa - CRUD Proveedores");

interface EmpresaData {
    nombre?: string;
    razon_social?: string;
    tipo_documento: string; // RUC, DNI, CE
    numero_documento: string;
    email?: string;
    telefono?: string;
    direccion?: string;
    estado?: string;
}

// Validar datos de empresa
function validateEmpresaData(
    data: Partial<EmpresaData>,
    isUpdate = false,
): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!isUpdate) {
        // Validaciones requeridas para CREATE
        if (!data.tipo_documento) errors.push("tipo_documento es requerido");
        if (!data.numero_documento) {
            errors.push("numero_documento es requerido");
        }
    }

    // Validaciones de formato
    if (
        data.tipo_documento &&
        !["RUC", "DNI", "CE"].includes(data.tipo_documento)
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
    const empresaId = pathSegments[pathSegments.length - 1];

    try {
        switch (method) {
            case "GET": {
                if (empresaId && !isNaN(Number(empresaId))) {
                    // GET /empresa/{id} - Obtener empresa específica
                    const { data: empresa, error } = await supabase
                        .from("proveedor")
                        .select("*")
                        .eq("id", empresaId)
                        .single();

                    if (error || !empresa) {
                        return http404("Empresa no encontrada");
                    }

                    return http200({
                        empresa,
                        message: "Empresa encontrada",
                    });
                } else {
                    // GET /empresa - Listar todas las empresas con filtros opcionales
                    const page = parseInt(url.searchParams.get("page") || "1");
                    const limit = parseInt(
                        url.searchParams.get("limit") || "10",
                    );
                    const search = url.searchParams.get("search") || "";
                    const estado = url.searchParams.get("estado") || "";
                    const tipo_documento =
                        url.searchParams.get("tipo_documento") || "";

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

                    const { data: empresas, error, count } = await query;

                    if (error) {
                        return http500(
                            "Error al obtener empresas",
                            error.message,
                        );
                    }

                    return http200({
                        empresas: empresas || [],
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
                // POST /empresa - Crear nueva empresa
                const empresaData: EmpresaData = await req.json();

                const validation = validateEmpresaData(empresaData);
                if (!validation.valid) {
                    return http400("Datos de empresa inválidos", {
                        errors: validation.errors,
                    });
                }

                // Verificar si ya existe empresa con el mismo documento
                const { data: existing } = await supabase
                    .from("proveedor")
                    .select("id")
                    .eq("numero_documento", empresaData.numero_documento)
                    .single();

                if (existing) {
                    return http400(
                        "Ya existe una empresa con este número de documento",
                    );
                }

                const { data: newEmpresa, error: createError } = await supabase
                    .from("proveedor")
                    .insert({
                        nombre: empresaData.nombre,
                        razon_social: empresaData.razon_social,
                        tipo_documento: empresaData.tipo_documento,
                        numero_documento: empresaData.numero_documento,
                        email: empresaData.email,
                        telefono: empresaData.telefono,
                        direccion: empresaData.direccion,
                        estado: empresaData.estado || "activo",
                        created_at: new Date().toISOString(),
                    })
                    .select()
                    .single();

                if (createError) {
                    return http500(
                        "Error al crear empresa",
                        createError.message,
                    );
                }

                return http201(newEmpresa, "Empresa creada exitosamente");
            }

            case "PUT": {
                // PUT /empresa/{id} - Actualizar empresa completa
                if (!empresaId || isNaN(Number(empresaId))) {
                    return http400("ID de empresa requerido");
                }

                const updateData: Partial<EmpresaData> = await req.json();

                const updateValidation = validateEmpresaData(updateData, true);
                if (!updateValidation.valid) {
                    return http400("Datos de empresa inválidos", {
                        errors: updateValidation.errors,
                    });
                }

                // Verificar que la empresa existe
                const { data: existingEmpresa } = await supabase
                    .from("proveedor")
                    .select("id")
                    .eq("id", empresaId)
                    .single();

                if (!existingEmpresa) {
                    return http404("Empresa no encontrada");
                }

                // Si se actualiza el documento, verificar que no exista otro con el mismo
                if (updateData.numero_documento) {
                    const { data: docExists } = await supabase
                        .from("proveedor")
                        .select("id")
                        .eq("numero_documento", updateData.numero_documento)
                        .neq("id", empresaId)
                        .single();

                    if (docExists) {
                        return http400(
                            "Ya existe otra empresa con este número de documento",
                        );
                    }
                }

                const { data: updatedEmpresa, error: updateError } =
                    await supabase
                        .from("proveedor")
                        .update({
                            ...updateData,
                            updated_at: new Date().toISOString(),
                        })
                        .eq("id", empresaId)
                        .select()
                        .single();

                if (updateError) {
                    return http500(
                        "Error al actualizar empresa",
                        updateError.message,
                    );
                }

                return http200(
                    updatedEmpresa,
                    "Empresa actualizada exitosamente",
                );
            }

            case "DELETE": {
                // DELETE /empresa/{id} - Eliminar empresa (soft delete)
                if (!empresaId || isNaN(Number(empresaId))) {
                    return http400("ID de empresa requerido");
                }

                // Verificar que la empresa existe
                const { data: empresaToDelete } = await supabase
                    .from("proveedor")
                    .select("id, estado")
                    .eq("id", empresaId)
                    .single();

                if (!empresaToDelete) {
                    return http404("Empresa no encontrada");
                }

                // Soft delete: cambiar estado a "inactivo"
                const { error: deleteError } = await supabase
                    .from("proveedor")
                    .update({
                        estado: "inactivo",
                        updated_at: new Date().toISOString(),
                    })
                    .eq("id", empresaId);

                if (deleteError) {
                    return http500(
                        "Error al eliminar empresa",
                        deleteError.message,
                    );
                }

                return http200(
                    { id: empresaId, estado: "inactivo" },
                    "Empresa eliminada exitosamente",
                );
            }

            default: {
                return http400(`Método ${method} no permitido`);
            }
        }
    } catch (error) {
        console.error("Error en Edge Function Empresa:", error);
        return http500("Error interno del servidor", (error as Error).message);
    }
}));
