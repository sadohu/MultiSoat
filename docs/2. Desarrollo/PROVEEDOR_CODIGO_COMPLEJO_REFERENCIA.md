# CÓDIGO COMPLEJO PROVEEDOR - REFERENCIA FUTURA

## 📝 **PROPÓSITO**
Este archivo contiene el código complejo que tenía la función proveedor antes de simplificarla para productividad. Incluye sistema de auditoría, autenticación avanzada, validaciones complejas y filtros avanzados.

---

## 🔧 **IMPORTS COMPLEJOS**

```typescript
import { Validator } from "shared/utils/Validator.ts";
import {
  enrichWithAuditInfo,
  withAudit,
  withOptionalAuth,
} from "shared/utils/audit.ts";
import { getSupabaseClient } from "shared/utils/client-auth.ts";
```

---

## 📊 **CONSTANTES Y VALIDACIONES AVANZADAS**

```typescript
// Constantes avanzadas
const VALID_ESTADOS = ["registrado", "inactivo"] as const;
const VALID_TIPO_DOCUMENTOS = ["RUC", "DNI", "CE"] as const;

// Funciones de validación compleja
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
      error: `El parámetro 'limit' debe ser un número entero entre 1 y ${MAX_PAGE_LIMIT}`,
    };
  }

  return { valid: true, page: parsedPage, limit: parsedLimit };
}

function validateFilterParams(
  estado: string,
  tipo_documento: string,
): { valid: boolean; error?: string } {
  if (estado && !VALID_ESTADOS.includes(estado as typeof VALID_ESTADOS[number])) {
    return {
      valid: false,
      error: `El parámetro 'estado' debe ser uno de: ${VALID_ESTADOS.join(", ")}`,
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
      error: `El parámetro 'tipo_documento' debe ser uno de: ${VALID_TIPO_DOCUMENTOS.join(", ")}`,
    };
  }
  return { valid: true };
}
```

---

## 🔍 **SISTEMA DE FILTROS Y BÚSQUEDA AVANZADA**

```typescript
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
```

---

## 🛡️ **MANEJO AVANZADO DE ERRORES**

```typescript
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
```

---

## 🔄 **VERIFICACIÓN DE DUPLICADOS AVANZADA**

```typescript
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
```

---

## 📖 **GET CON AUTENTICACIÓN OPCIONAL Y FILTROS AVANZADOS**

```typescript
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
      const filterValidation = validateFilterParams(estado, tipo_documento);
      if (!filterValidation.valid) {
        return http400(filterValidation.error!);
      }

      try {
        // Primera query: Solo obtener el count
        let countQuery = supabase
          .from("proveedor")
          .select("*", { count: "exact", head: true });

        // Aplicar filtros al count
        countQuery = applyFilters(countQuery, search, estado, tipo_documento);

        const { count, error: countError } = await countQuery;

        if (countError) {
          return http500("Error al consultar total de registros", countError.message);
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
        let dataQuery = supabase.from("proveedor").select("*");

        // Aplicar los mismos filtros
        dataQuery = applyFilters(dataQuery, search, estado, tipo_documento);

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
              canCreate: user.rol === "admin" || user.rol === "supervisor",
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
    }
  })(req);
}
```

---

## ✏️ **POST CON AUDITORÍA COMPLETA**

```typescript
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
      return http400("Ya existe un proveedor con este número de documento");
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
```

---

## 🔄 **PUT CON AUDITORÍA Y VALIDACIONES AVANZADAS**

```typescript
case "PUT": {
  // PUT /proveedor/{id} - Actualizar proveedor (CON AUDITORÍA OBLIGATORIA)
  if (!proveedorId || isNaN(Number(proveedorId))) {
    return http400("ID de proveedor requerido");
  }

  return withAudit(async (_req, auditInfo) => {
    const updateData: Partial<ProveedorData> = await req.json();

    const updateValidation = Validator.validateProveedorData(updateData, true);
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
        return http400("Ya existe otro proveedor con este número de documento");
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
      return http500("Error al actualizar proveedor", updateError.message);
    }

    // Respuesta enriquecida con información de auditoría
    return http200(
      enrichWithAuditInfo(updatedProveedor, auditInfo, "updated"),
      "Proveedor actualizado exitosamente",
    );
  })(req);
}
```

---

## 🗑️ **DELETE CON AUDITORÍA (SOFT DELETE)**

```typescript
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
```

---

## 🎯 **CARACTERÍSTICAS DEL CÓDIGO COMPLEJO**

### **✅ Ventajas:**
- 🔐 **Seguridad:** Autenticación JWT opcional/obligatoria
- 📊 **Auditoría:** Tracking completo de cambios (quién, cuándo, qué)
- 🔍 **Búsqueda:** Filtros avanzados por múltiples campos
- ✅ **Validación:** Validaciones robustas con Validator personalizado
- 🛡️ **Error Handling:** Manejo detallado de errores de base de datos
- 📄 **Paginación:** Paginación avanzada con metadatos completos
- 🚫 **Duplicados:** Verificación avanzada de duplicados con exclusiones
- 📈 **Metadata:** Respuestas enriquecidas con información contextual

### **❌ Complejidad:**
- 🔗 **Dependencias:** Múltiples utilidades y servicios externos
- 🧠 **Cognitive Load:** Lógica compleja difícil de seguir
- 🐛 **Debugging:** Más puntos de falla potencial
- ⏱️ **Performance:** Múltiples queries y validaciones
- 📝 **Mantenimiento:** Más código que mantener y actualizar

---

## 📌 **CUÁNDO USAR CADA VERSIÓN**

### **🚀 Versión Simplificada (Actual):**
- ✅ Prototipado rápido
- ✅ Desarrollo inicial
- ✅ APIs internas simples
- ✅ Debugging y testing
- ✅ Productividad inmediata

### **🏗️ Versión Compleja (Esta referencia):**
- ✅ Aplicaciones de producción
- ✅ Sistemas con múltiples usuarios
- ✅ Requerimientos de auditoría
- ✅ APIs públicas con filtros avanzados
- ✅ Sistemas con roles y permisos complejos

---

## 🔄 **MIGRACIÓN DE VUELTA**

Para restaurar la funcionalidad compleja:

1. **Restaurar imports:** Reemplazar imports simples por los complejos
2. **Agregar funciones auxiliares:** Copiar todas las funciones de validación y filtros
3. **Reemplazar switch cases:** Sustituir cada case por su versión compleja
4. **Configurar dependencias:** Asegurar que todas las utilidades estén disponibles
5. **Testing:** Probar todas las funcionalidades avanzadas

**Este archivo sirve como referencia completa para cuando necesites restaurar la funcionalidad avanzada.**
