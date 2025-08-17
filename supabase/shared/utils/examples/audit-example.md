# Sistema de Auditoría para MultiSoat

## Descripción
Sistema completo de auditoría que garantiza trazabilidad en todas las operaciones CRUD. **Todas las operaciones requieren autenticación obligatoria** según las reglas de negocio.

## 🔒 **Filosofía de Seguridad**
- **Autenticación obligatoria** para CREATE, UPDATE, DELETE
- **Auditoría automática** de todas las operaciones
- **Trazabilidad completa** de quién, cuándo y qué cambió
- **Usuario responsable** de cada acción registrada

## 🛠️ **Componentes**

### 1. **Helper `getAuditFields()`**
Función básica para obtener campos de auditoría:

```typescript
import { getAuditFields } from "../../shared/utils/audit.ts";

// Para operaciones CREATE
const auditInfo = await getAuditFields(req, false);
// auditInfo.fields = { created_by, updated_by, created_at, updated_at }

// Para operaciones UPDATE
const auditInfo = await getAuditFields(req, true);
// auditInfo.fields = { updated_by, updated_at }
```

### 2. **Middleware `withAudit()`**
Wrapper automático para operaciones CUD:

```typescript
import { withAudit } from "../../shared/utils/audit.ts";

const createProveedor = withAudit(async (req, auditInfo) => {
  const data = await req.json();
  
  const { data: proveedor, error } = await supabase
    .from("proveedor")
    .insert({
      ...data,
      ...auditInfo.fields  // Auditoría automática
    })
    .select()
    .single();

  return http201(proveedor);
});
```

### 3. **Middleware `withOptionalAuth()`**
Para operaciones READ con autenticación opcional:

```typescript
import { withOptionalAuth } from "../../shared/utils/audit.ts";

const getProveedores = withOptionalAuth(async (req, user) => {
  // user puede ser undefined si no está autenticado
  // Permite consultas públicas pero enriquece con info si hay usuario
});
```

## 📝 **Campos de Auditoría**

Todos los registros incluyen:

```sql
created_by    UUID      -- ID del usuario que creó
updated_by    UUID      -- ID del usuario que actualizó  
created_at    TIMESTAMP -- Fecha/hora de creación
updated_at    TIMESTAMP -- Fecha/hora de última actualización
```

## 🔄 **Flujo de Auditoría**

### CREATE (POST)
```
1. Validar token JWT → requireAuth()
2. Extraer usuario autenticado
3. Generar: created_by, updated_by, created_at, updated_at
4. Insertar registro con auditoría
5. Responder con info del usuario responsable
```

### UPDATE (PUT/PATCH)
```
1. Validar token JWT → requireAuth()
2. Extraer usuario autenticado
3. Generar: updated_by, updated_at
4. Actualizar registro con auditoría
5. Responder con info del usuario responsable
```

### DELETE
```
1. Validar token JWT → requireAuth()
2. Extraer usuario autenticado
3. Soft delete con updated_by, updated_at
4. Responder con info del usuario responsable
```

### READ (GET)
```
1. Autenticación opcional
2. Si autenticado: enriquecer respuesta con permisos
3. Si no autenticado: respuesta básica (según reglas de negocio)
```

## 🎯 **Ejemplos de Implementación**

### Ejemplo Completo: CRUD Proveedor

```typescript
// POST /proveedor - Crear (CON AUDITORÍA)
if (req.method === "POST") {
  return withAudit(async (req, auditInfo) => {
    const data = await req.json();
    
    const { data: proveedor, error } = await supabase
      .from("proveedor")
      .insert({
        ...data,
        ...auditInfo.fields,
        estado: "registrado"
      })
      .select()
      .single();

    return http201(
      enrichWithAuditInfo(proveedor, auditInfo, 'created'),
      "Proveedor creado exitosamente"
    );
  })(req);
}

// PUT /proveedor/:id - Actualizar (CON AUDITORÍA)
if (req.method === "PUT") {
  return withAudit(async (req, auditInfo) => {
    const data = await req.json();
    
    const { data: proveedor, error } = await supabase
      .from("proveedor")
      .update({
        ...data,
        ...auditInfo.fields
      })
      .eq("id", proveedorId)
      .select()
      .single();

    return http200(
      enrichWithAuditInfo(proveedor, auditInfo, 'updated'),
      "Proveedor actualizado exitosamente"
    );
  })(req);
}

// GET /proveedor - Listar (AUTENTICACIÓN OPCIONAL)
if (req.method === "GET") {
  return withOptionalAuth(async (req, user) => {
    const { data: proveedores, error } = await supabase
      .from("proveedor")
      .select("*");

    // Si está autenticado, puede ver más detalles
    if (user) {
      return http200({
        data: proveedores,
        userInfo: {
          canEdit: user.rol === "admin",
          viewedBy: user.email
        }
      });
    }

    // Vista pública limitada
    return http200({ data: proveedores });
  })(req);
}
```

## ⚠️ **Errores de Autenticación**

### Sin Token
```json
{
  "success": false,
  "status": 401,
  "error": {
    "message": "Acceso denegado", 
    "details": "Autenticación requerida: Token de autorización requerido"
  }
}
```

### Token Inválido
```json
{
  "success": false,
  "status": 401,
  "error": {
    "message": "Acceso denegado",
    "details": "Autenticación requerida: Token inválido o expirado"
  }
}
```

## 🔗 **Integración con Auth**

El sistema se integra automáticamente con el Edge Function `auth`:

```bash
# 1. Obtener token
POST /auth/login
{
  "email": "admin@gmail.com",
  "password": "password123"
}

# 2. Usar token en operaciones CRUD
POST /proveedor
Authorization: Bearer <access_token>
{
  "nombre": "Proveedor Ejemplo",
  "tipo_documento": "RUC",
  "numero_documento": "12345678901"
}
```

## 📊 **Respuestas Enriquecidas**

Todas las operaciones CUD devuelven información de auditoría:

```json
{
  "data": {
    "id": 1,
    "nombre": "Proveedor Ejemplo",
    "created_by": "uuid-del-usuario",
    "updated_by": "uuid-del-usuario",
    "created_at": "2025-08-15T10:30:00Z",
    "updated_at": "2025-08-15T10:30:00Z",
    "auditInfo": {
      "operation": "created",
      "performedBy": {
        "id": "uuid-del-usuario",
        "email": "admin@gmail.com",
        "nombre": "Admin",
        "rol": "admin"
      },
      "timestamp": "2025-08-15T10:30:00Z"
    }
  },
  "success": true,
  "status": 201
}
```

## 🚀 **Beneficios**

1. **Seguridad**: Todas las operaciones CUD requieren autenticación
2. **Trazabilidad**: Registro completo de quién hizo qué y cuándo
3. **Consistencia**: Sistema uniforme en todas las entidades
4. **Simplicidad**: Middleware automático reduce código repetitivo
5. **Flexibilidad**: Helper manual disponible para casos especiales
