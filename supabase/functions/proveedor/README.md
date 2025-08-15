# Documentación: Edge Function Proveedor

## Descripción
Edge Function para el **CRUD completo de proveedores** en el sistema MultiSoat. Implementa operaciones de Create, Read, Update y Delete sobre la tabla `proveedor` con validaciones específicas para documentos peruanos.

## Configuración
- **Autenticación**: Deshabilitada (`verify_jwt = false`)
- **CORS**: Habilitado automáticamente
- **Métodos HTTP**: GET, POST, PUT, DELETE
- **Tabla de datos**: `proveedor`
- **Códigos HTTP**: Correctamente implementados (200, 400, 404, 500)
- **Arquitectura**: Queries separadas para count y datos (evita conflictos JSON)

## ⚡ Características Técnicas

### 🔄 **Paginación Optimizada**
- **Estrategia de doble query**: Primero obtiene el `count`, luego los datos
- **Validación anticipada**: Verifica páginas válidas antes de consultar datos
- **Prevención de errores**: Evita JSON malformado en responses de Supabase

### 🔒 **Validaciones Robustas**
- **Documentos Peruanos**: RUC (11 dígitos), DNI (8 dígitos), CE (12 dígitos)
- **Email**: Formato RFC válido
- **Teléfono**: 9 dígitos, comenzando con 9
- **Parámetros**: Sanitización de caracteres especiales en búsquedas

### 🌐 **HTTP Status Codes**
- **200 OK**: Operaciones exitosas
- **400 Bad Request**: Errores de validación, parámetros inválidos, páginas inexistentes
- **404 Not Found**: Recurso no encontrado
- **500 Internal Server Error**: Errores de servidor/base de datos

## 📋 Modelo de Datos

### Interface ProveedorData
```typescript
interface ProveedorData {
  nombre?: string;           // Nombre comercial
  razon_social?: string;     // Razón social completa
  tipo_documento: string;    // "RUC", "DNI", "CE"
  numero_documento: string;  // Número del documento
  email?: string;           // Email de contacto
  telefono?: string;        // Teléfono (9 dígitos, inicia con 9)
  direccion?: string;       // Dirección física
  estado?: string;          // "activo", "inactivo"
}
```

### Campos de la tabla `proveedor`
- **id**: number (auto-increment, PK)
- **nombre**: string (nombre comercial)
- **razon_social**: string (razón social legal)
- **tipo_documento**: string (RUC/DNI/CE)
- **numero_documento**: string (documento único)
- **email**: string (contacto)
- **telefono**: string (teléfono)
- **direccion**: string (dirección)
- **estado**: string (activo/inactivo)
- **created_at**: timestamp
- **updated_at**: timestamp

## 🔧 API Endpoints

### 1. **GET /proveedor** - Listar proveedores
Lista todos los proveedores con paginación y filtros opcionales.

#### Query Parameters:
- `page`: número de página (default: 1, min: 1)
- `limit`: proveedores por página (default: 10, min: 1, max: 100)
- `search`: búsqueda por nombre, razón social o documento
- `estado`: filtrar por estado ("activo", "inactivo")
- `tipo_documento`: filtrar por tipo ("RUC", "DNI", "CE")

#### Validaciones de Paginación:
- Si `page` es menor a 1 o no es un número: Error 400
- Si `limit` es menor a 1, mayor a 100, o no es un número: Error 400
- Si se solicita una página que no existe: Error 400 con mensaje informativo
- Si no hay resultados: Response 200 con array vacío y mensaje explicativo

#### Ejemplo de Request:
```bash
curl "https://wtaqmoxytfnxsggxqdhx.supabase.co/functions/v1/proveedor?page=1&limit=5&search=ACME&estado=activo"
```

#### Ejemplo de Response exitoso:
```json
{
  "data": {
    "proveedores": [
      {
        "id": 1,
        "nombre": "ACME Corp",
        "razon_social": "ACME Corporation S.A.C.",
        "tipo_documento": "RUC",
        "numero_documento": "12345678901",
        "email": "info@acme.com",
        "telefono": "987654321",
        "direccion": "Av. Lima 123",
        "estado": "activo",
        "created_at": "2025-01-01T10:00:00Z",
        "updated_at": null
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 5,
      "total": 1,
      "totalPages": 1,
      "hasNextPage": false,
      "hasPrevPage": false
    },
    "filters": {
      "search": "ACME",
      "estado": "activo",
      "tipo_documento": ""
    },
    "message": "Se encontraron 1 proveedor(es). Mostrando página 1 de 1."
  },
  "success": true,
  "status": 200
}
```

#### Ejemplo de Response sin resultados:
```json
{
  "data": {
    "proveedores": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 0,
      "totalPages": 0,
      "hasNextPage": false,
      "hasPrevPage": false
    },
    "filters": {
      "search": "NoExiste",
      "estado": "",
      "tipo_documento": ""
    },
    "message": "No se encontraron proveedores con los filtros aplicados"
  },
  "success": true,
  "status": 200
}
```

#### Ejemplo de Error de paginación:
```json
{
  "error": "La página 5 no existe. Solo hay 2 página(s) disponible(s) con 15 registro(s) total(es).",
  "success": false,
  "status": 400
}
```

**📌 Nota Importante**: Con las mejoras implementadas, este error ahora:
- ✅ Devuelve código HTTP 400 real (no 200)
- ✅ Proporciona mensaje claro y específico
- ✅ No genera errores JSON malformados
- ✅ Se valida antes de ejecutar queries innecesarias
```

### 2. **GET /proveedor/{id}** - Obtener proveedor específico
Obtiene los datos de un proveedor por su ID.

#### Ejemplo de Request:
```bash
curl "https://wtaqmoxytfnxsggxqdhx.supabase.co/functions/v1/proveedor/1"
```

#### Ejemplo de Response:
```json
{
  "data": {
    "proveedor": {
      "id": 1,
      "nombre": "ACME Corp",
      "razon_social": "ACME Corporation S.A.C.",
      "tipo_documento": "RUC",
      "numero_documento": "12345678901",
      "email": "info@acme.com",
      "telefono": "987654321",
      "direccion": "Av. Lima 123",
      "estado": "activo"
    },
    "message": "Proveedor encontrado"
  },
  "success": true,
  "status": 200
}
```

### 3. **POST /proveedor** - Crear nuevo proveedor
Crea un nuevo proveedor con validaciones completas.

#### Ejemplo de Request:
```bash
curl -X POST "https://wtaqmoxytfnxsggxqdhx.supabase.co/functions/v1/proveedor" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Tech Solutions",
    "razon_social": "Tech Solutions S.A.C.",
    "tipo_documento": "RUC",
    "numero_documento": "20123456789",
    "email": "contacto@techsolutions.pe",
    "telefono": "987654321",
    "direccion": "Av. Tecnología 456",
    "estado": "activo"
  }'
```

#### Ejemplo de Response:
```json
{
  "data": {
    "id": 2,
    "nombre": "Tech Solutions",
    "razon_social": "Tech Solutions S.A.C.",
    "tipo_documento": "RUC",
    "numero_documento": "20123456789",
    "email": "contacto@techsolutions.pe",
    "telefono": "987654321",
    "direccion": "Av. Tecnología 456",
    "estado": "activo",
    "created_at": "2025-01-01T11:00:00Z"
  },
  "success": true,
  "status": 201,
  "message": "Proveedor creado exitosamente"
}
```

### 4. **PUT /proveedor/{id}** - Actualizar proveedor
Actualiza los datos de un proveedor existente.

#### Ejemplo de Request:
```bash
curl -X PUT "https://wtaqmoxytfnxsggxqdhx.supabase.co/functions/v1/proveedor/2" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Tech Solutions Pro",
    "email": "info@techsolutionspro.pe",
    "telefono": "987123456"
  }'
```

#### Ejemplo de Response:
```json
{
  "data": {
    "id": 2,
    "nombre": "Tech Solutions Pro",
    "razon_social": "Tech Solutions S.A.C.",
    "tipo_documento": "RUC", 
    "numero_documento": "20123456789",
    "email": "info@techsolutionspro.pe",
    "telefono": "987123456",
    "direccion": "Av. Tecnología 456",
    "estado": "activo",
    "updated_at": "2025-01-01T12:00:00Z"
  },
  "success": true,
  "status": 200,
  "message": "Proveedor actualizado exitosamente"
}
```

### 5. **DELETE /proveedor/{id}** - Eliminar proveedor
Realiza un "soft delete" cambiando el estado a "inactivo".

#### Ejemplo de Request:
```bash
curl -X DELETE "https://wtaqmoxytfnxsggxqdhx.supabase.co/functions/v1/proveedor/2"
```

#### Ejemplo de Response:
```json
{
  "data": {
    "id": "2",
    "estado": "inactivo"
  },
  "success": true,
  "status": 200,
  "message": "Proveedor eliminado exitosamente"
}
```

## ✅ Validaciones Implementadas

### Campos Requeridos (CREATE):
- `tipo_documento`: Debe ser "RUC", "DNI" o "CE"
- `numero_documento`: Requerido y único

### Validaciones de Formato:
- **RUC**: 11 dígitos exactos (validación con `Validator.isValidRUC()`)
- **DNI**: 8 dígitos exactos (validación con `Validator.isValidDNI()`)
- **Email**: Formato válido (validación con `Validator.isValidEmail()`)
- **Teléfono**: 9 dígitos iniciando con 9 (validación con `Validator.isValidPhone()`)

### Validaciones de Negocio:
- **Documento único**: No pueden existir dos proveedores con el mismo número de documento
- **Proveedor existente**: Verificar que el proveedor existe antes de UPDATE/DELETE
- **Soft delete**: DELETE no elimina físicamente, solo cambia estado

## 🚨 Manejo de Errores

### Error 400 - Bad Request:
```json
{
  "success": false,
  "status": 400,
  "message": "Datos de proveedor inválidos",
  "error": {
    "message": "Datos de proveedor inválidos",
    "details": {
      "errors": [
        "tipo_documento es requerido",
        "RUC inválido (debe tener 11 dígitos)"
      ]
    }
  }
}
```

### Error 404 - Not Found:
```json
{
  "success": false,
  "status": 404,
  "message": "Proveedor no encontrado"
}
```

### Error 500 - Internal Server Error:
```json
{
  "success": false,
  "status": 500,
  "message": "Error al crear proveedor",
  "error": {
    "message": "Error al crear proveedor",
    "details": "Database connection failed"
  }
}
```

## 🧪 Guía de Testing con Postman

### Setup Base URL
```
Base URL: https://wtaqmoxytfnxsggxqdhx.supabase.co/functions/v1/proveedor
```

### 🚀 FUNCIÓN DESPLEGADA Y LISTA PARA TESTING

#### Collection: CRUD Proveedores

#### 1. 📋 GET - Listar Proveedores
```
Method: GET
URL: https://wtaqmoxytfnxsggxqdhx.supabase.co/functions/v1/proveedor
Query Params:
- page: 1
- limit: 10
- search: (opcional - busca en nombre, razón social, documento)
- estado: activo (opcional - activo/inactivo)
- tipo_documento: (opcional - RUC/DNI/CE)

Headers: 
- Content-Type: application/json

Expected: 200 OK con lista paginada
```

#### 2. 👁️ GET - Obtener Proveedor por ID
```
Method: GET
URL: https://wtaqmoxytfnxsggxqdhx.supabase.co/functions/v1/proveedor/1

Headers: 
- Content-Type: application/json

Expected: 200 OK si existe, 404 si no existe
```

#### 3. ➕ POST - Crear Proveedor
```
Method: POST
URL: https://wtaqmoxytfnxsggxqdhx.supabase.co/functions/v1/proveedor

Headers:
- Content-Type: application/json

Body (JSON):
{
  "nombre": "Distribuidora Lima",
  "razon_social": "Distribuidora Lima S.A.C.",
  "tipo_documento": "RUC",
  "numero_documento": "20123456789",
  "email": "contacto@distribuidora.pe",
  "telefono": "987654321",
  "direccion": "Av. Lima 123, Lima",
  "estado": "activo"
}

Expected: 201 Created con datos del proveedor creado
```

#### 4. ✏️ PUT - Actualizar Proveedor
```
Method: PUT
URL: https://wtaqmoxytfnxsggxqdhx.supabase.co/functions/v1/proveedor/{{proveedor_id}}

Headers:
- Content-Type: application/json

Body (JSON):
{
  "nombre": "Distribuidora Lima Pro",
  "email": "info@distribuidorapro.pe",
  "telefono": "987123456"
}

Expected: 200 OK con datos actualizados
```

#### 5. 🗑️ DELETE - Eliminar Proveedor (Soft Delete)
```
Method: DELETE
URL: https://wtaqmoxytfnxsggxqdhx.supabase.co/functions/v1/proveedor/{{proveedor_id}}

Headers:
- Content-Type: application/json

Expected: 200 OK con confirmación (estado cambia a "inactivo")
```

### 🔧 Variables de Postman Recomendadas
```json
{
  "base_url": "https://wtaqmoxytfnxsggxqdhx.supabase.co/functions/v1/proveedor",
  "proveedor_id": "1",
  "test_ruc": "20123456789",
  "test_dni": "12345678"
}
```

### ✅ Tests de Validación (Postman Scripts)
```javascript
// Test general para responses exitosas
pm.test("Response successful", function () {
    pm.response.to.have.status.oneOf([200, 201]);
    pm.expect(pm.response.json().success).to.be.true;
});

// Test específico para POST - Validar creación
pm.test("Proveedor creado exitosamente", function () {
    if (pm.response.code === 201) {
        pm.expect(pm.response.json().data).to.have.property("id");
        pm.expect(pm.response.json().data).to.have.property("numero_documento");
        // Guardar ID para tests posteriores
        pm.environment.set("proveedor_id", pm.response.json().data.id);
    }
});

// Test específico para GET lista - Validar estructura
pm.test("Lista de proveedores estructura válida", function () {
    if (pm.response.code === 200 && pm.request.url.query.size === 0) {
        pm.expect(pm.response.json().data).to.have.property("proveedores");
        pm.expect(pm.response.json().data).to.have.property("pagination");
        pm.expect(pm.response.json().data.pagination).to.have.property("total");
    }
});

// Test para errores - Validar estructura de error
pm.test("Error response structure", function () {
    if (pm.response.code >= 400) {
        pm.expect(pm.response.json().success).to.be.false;
        pm.expect(pm.response.json()).to.have.property("error");
    }
});
```

### 📝 Casos de Test Prioritarios

#### ✅ Tests Básicos (CRUD)
1. **Listar proveedores vacío** → GET `/proveedor` (primera vez)
2. **Crear proveedor válido RUC** → POST con RUC válido
3. **Crear proveedor válido DNI** → POST con DNI válido  
4. **Obtener proveedor por ID** → GET `/proveedor/{id}`
5. **Actualizar proveedor** → PUT `/proveedor/{id}`
6. **Eliminar proveedor** → DELETE `/proveedor/{id}` (soft delete)
7. **Listar proveedores con datos** → GET `/proveedor` (después de crear)

#### ⚠️ Tests de Validación
1. **RUC inválido** → POST con `"numero_documento": "123"` (esperado: 400)
2. **DNI inválido** → POST con `"numero_documento": "123"` y `"tipo_documento": "DNI"` (esperado: 400)
3. **Email inválido** → POST con `"email": "invalid-email"` (esperado: 400)
4. **Teléfono inválido** → POST con `"telefono": "123"` (esperado: 400)
5. **Documento duplicado** → POST con mismo número_documento (esperado: 400)
6. **Campos requeridos** → POST sin `tipo_documento` (esperado: 400)

#### 🔍 Tests de Filtros y Paginación
1. **Buscar por nombre** → GET `/proveedor?search=Lima`
2. **Filtrar por estado** → GET `/proveedor?estado=activo`
3. **Filtrar por tipo documento** → GET `/proveedor?tipo_documento=RUC`
4. **Paginación página 1** → GET `/proveedor?page=1&limit=5`
5. **Paginación página inexistente** → GET `/proveedor?page=99&limit=10` (esperado: 400)
6. **Parámetros inválidos** → GET `/proveedor?page=0&limit=abc` (esperado: 400)
7. **Límite excedido** → GET `/proveedor?limit=200` (esperado: 400)
8. **Sin resultados con filtros** → GET `/proveedor?search=NoExiste` (esperado: 200 con array vacío)

#### 🚫 Tests de Errores
1. **ID inexistente** → GET `/proveedor/9999` (esperado: 404)
2. **Actualizar inexistente** → PUT `/proveedor/9999` (esperado: 404)

## 📝 Comandos de Test Rápido

### **Test de Códigos HTTP Corregidos** ✅
```bash
# Test 1: Error 400 (parámetro inválido) - Ahora devuelve HTTP 400 real
curl -i "https://wtaqmoxytfnxsggxqdhx.supabase.co/functions/v1/proveedor?page=0"
# Esperado: HTTP/1.1 400 Bad Request

# Test 2: Error 400 (página inexistente) - Ahora devuelve HTTP 400 real  
curl -i "https://wtaqmoxytfnxsggxqdhx.supabase.co/functions/v1/proveedor?page=2&limit=10"
# Esperado: HTTP/1.1 400 Bad Request + mensaje claro

# Test 3: Éxito - Devuelve HTTP 200
curl -i "https://wtaqmoxytfnxsggxqdhx.supabase.co/functions/v1/proveedor?page=1&limit=10"
# Esperado: HTTP/1.1 200 OK
```

### Test de Paginación Mejorada
```bash
# 1. Crear un proveedor primero
curl -X POST "https://wtaqmoxytfnxsggxqdhx.supabase.co/functions/v1/proveedor" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test Corp",
    "razon_social": "Test Corporation S.A.C.", 
    "tipo_documento": "RUC",
    "numero_documento": "12345678901",
    "email": "test@test.com",
    "telefono": "987654321"
  }'

# 2. Listar página 1 (debería funcionar)
curl "https://wtaqmoxytfnxsggxqdhx.supabase.co/functions/v1/proveedor?page=1&limit=10"

# 3. Intentar página 2 (debería dar error claro si solo hay 1 registro)
curl "https://wtaqmoxytfnxsggxqdhx.supabase.co/functions/v1/proveedor?page=2&limit=10"

# 4. Test de validación de parámetros
curl "https://wtaqmoxytfnxsggxqdhx.supabase.co/functions/v1/proveedor?page=0&limit=200"

# 5. Test sin resultados
curl "https://wtaqmoxytfnxsggxqdhx.supabase.co/functions/v1/proveedor?search=NoExiste"
```
3. **Eliminar inexistente** → DELETE `/proveedor/9999` (esperado: 404)
4. **Método no permitido** → PATCH `/proveedor` (esperado: 400)

### 📊 Data de Prueba Sugerida

#### Proveedor RUC válido:
```json
{
  "nombre": "TechCorp Solutions",
  "razon_social": "TechCorp Solutions S.A.C.",
  "tipo_documento": "RUC",
  "numero_documento": "20123456789",
  "email": "contacto@techcorp.pe",
  "telefono": "987654321",
  "direccion": "Av. Tecnología 456, San Isidro",
  "estado": "activo"
}
```

#### Proveedor DNI válido:
```json
{
  "nombre": "Juan Pérez Distribuciones",
  "razon_social": "Juan Carlos Pérez Rojas",
  "tipo_documento": "DNI",
  "numero_documento": "12345678",
  "email": "juan.perez@email.pe",
  "telefono": "987123456",
  "direccion": "Jr. Comercio 123, Lima",
  "estado": "activo"
}
```

### 🎯 Resultado Esperado
Después de completar todos los tests, deberías poder:
- ✅ Crear proveedores con validaciones completas
- ✅ Listar y filtrar proveedores eficientemente
- ✅ Actualizar información de proveedores existentes
- ✅ Eliminar proveedores (soft delete)
- ✅ Recibir códigos HTTP correctos (400, 404, 500)
- ✅ Manejar paginación sin errores JSON malformados

## 🚀 **Historial de Mejoras**

### **v2.1 - Arquitectura Optimizada (Agosto 2025)**
- **🔧 Códigos HTTP Corregidos**: Los errores 400/500 ahora devuelven códigos HTTP reales (no 200)
- **⚡ Paginación Mejorada**: Queries separadas previenen errores JSON malformados de Supabase
- **🧹 Código Limpio**: Eliminación de logs de debugging innecesarios
- **🔒 Validación Robusta**: Manejo mejorado de errores y sanitización de parámetros

### **Correcciones Técnicas Implementadas:**
1. **withHeaders() Fix**: Preserva `status` y `statusText` en respuestas CORS
2. **Doble Query Strategy**: Count separado de datos para evitar conflictos
3. **Error Handling**: Detección y manejo de JSON malformado de Supabase
4. **Parameter Sanitization**: Limpieza de caracteres especiales en búsquedas

### **URL de Deployment Actual:**
```
https://wtaqmoxytfnxsggxqdhx.supabase.co/functions/v1/proveedor
```

### **Estado del Proyecto:**
- ✅ **Funcionalidad**: CRUD completo operativo
- ✅ **HTTP Codes**: Funcionando correctamente
- ✅ **Validaciones**: Documentos peruanos implementados
- ✅ **Paginación**: Sin errores JSON malformados
- ✅ **CORS**: Configurado y funcionando
- ✅ **Tests**: Todos los casos de prueba superados

## 🛠️ **Troubleshooting**

### **Problema: Códigos HTTP siempre 200**
**Síntoma**: Errores 400/500 llegan como HTTP 200
**Causa**: `withHeaders()` no preservaba `status` original
**Solución**: 
```typescript
// ❌ Antes
return new Response(res.body, { ...res, headers });

// ✅ Después  
return new Response(res.body, { 
    status: res.status,
    statusText: res.statusText,
    headers 
});
```

### **Problema: JSON malformado en paginación**
**Síntoma**: `error.message: '{"'` (JSON truncado)
**Causa**: Query con `count: "exact"` + `range()` causa conflicto en Supabase
**Solución**: Separar en dos queries:
1. Primera query: Solo count con `head: true`
2. Segunda query: Solo datos con paginación

### **Problema: Páginas inexistentes dan error 500**
**Síntoma**: `page=2` con 1 registro da error 500
**Causa**: Validación tardía después de ejecutar query problemática
**Solución**: Validar páginas **antes** de consultar datos

### **Enlaces Útiles**
- **Dashboard Functions**: https://supabase.com/dashboard/project/wtaqmoxytfnxsggxqdhx/functions
- **Logs en Tiempo Real**: https://supabase.com/dashboard/project/wtaqmoxytfnxsggxqdhx/logs/edge-functions
- ✅ Manejar errores apropiadamente
- ✅ Confirmar que todas las validaciones funcionan

La API está **100% funcional y lista para integración en producción**.
