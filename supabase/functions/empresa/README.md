# Documentación: Edge Function Empresa

## Descripción
Edge Function para el **CRUD completo de empresas/proveedores** en el sistema MultiSoat. Implementa operaciones de Create, Read, Update y Delete sobre la tabla `proveedor` con validaciones específicas para documentos peruanos.

## Configuración
- **Autenticación**: Deshabilitada (`verify_jwt = false`)
- **CORS**: Habilitado automáticamente
- **Métodos HTTP**: GET, POST, PUT, DELETE
- **Tabla de datos**: `proveedor`

## 📋 Modelo de Datos

### Interface EmpresaData
```typescript
interface EmpresaData {
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

### 1. **GET /empresa** - Listar empresas
Lista todas las empresas con paginación y filtros opcionales.

#### Query Parameters:
- `page`: número de página (default: 1)
- `limit`: empresas por página (default: 10)
- `search`: búsqueda por nombre, razón social o documento
- `estado`: filtrar por estado ("activo", "inactivo")
- `tipo_documento`: filtrar por tipo ("RUC", "DNI", "CE")

#### Ejemplo de Request:
```bash
curl "https://your-project.supabase.co/functions/v1/empresa?page=1&limit=5&search=ACME&estado=activo"
```

#### Ejemplo de Response:
```json
{
  "data": {
    "empresas": [
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
      "totalPages": 1
    },
    "filters": {
      "search": "ACME",
      "estado": "activo",
      "tipo_documento": ""
    }
  },
  "success": true,
  "status": 200
}
```

### 2. **GET /empresa/{id}** - Obtener empresa específica
Obtiene los datos de una empresa por su ID.

#### Ejemplo de Request:
```bash
curl "https://your-project.supabase.co/functions/v1/empresa/1"
```

#### Ejemplo de Response:
```json
{
  "data": {
    "empresa": {
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
    "message": "Empresa encontrada"
  },
  "success": true,
  "status": 200
}
```

### 3. **POST /empresa** - Crear nueva empresa
Crea una nueva empresa con validaciones completas.

#### Ejemplo de Request:
```bash
curl -X POST "https://your-project.supabase.co/functions/v1/empresa" \
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
  "message": "Empresa creada exitosamente"
}
```

### 4. **PUT /empresa/{id}** - Actualizar empresa
Actualiza los datos de una empresa existente.

#### Ejemplo de Request:
```bash
curl -X PUT "https://your-project.supabase.co/functions/v1/empresa/2" \
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
  "message": "Empresa actualizada exitosamente"
}
```

### 5. **DELETE /empresa/{id}** - Eliminar empresa
Realiza un "soft delete" cambiando el estado a "inactivo".

#### Ejemplo de Request:
```bash
curl -X DELETE "https://your-project.supabase.co/functions/v1/empresa/2"
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
  "message": "Empresa eliminada exitosamente"
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
- **Documento único**: No pueden existir dos empresas con el mismo número de documento
- **Empresa existente**: Verificar que la empresa existe antes de UPDATE/DELETE
- **Soft delete**: DELETE no elimina físicamente, solo cambia estado

## 🚨 Manejo de Errores

### Error 400 - Bad Request:
```json
{
  "success": false,
  "status": 400,
  "message": "Datos de empresa inválidos",
  "error": {
    "message": "Datos de empresa inválidos",
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
  "message": "Empresa no encontrada"
}
```

### Error 500 - Internal Server Error:
```json
{
  "success": false,
  "status": 500,
  "message": "Error al crear empresa",
  "error": {
    "message": "Error al crear empresa",
    "details": "Database connection failed"
  }
}
```

## 📝 Ejemplos de Uso

### JavaScript Frontend:
```javascript
// Obtener lista de empresas
const empresas = await fetch('/functions/v1/empresa?page=1&limit=10')
  .then(res => res.json());

// Crear nueva empresa
const nuevaEmpresa = await fetch('/functions/v1/empresa', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nombre: "Mi Empresa",
    tipo_documento: "RUC",
    numero_documento: "20123456789",
    email: "contacto@miempresa.pe"
  })
}).then(res => res.json());

// Actualizar empresa
const empresaActualizada = await fetch('/functions/v1/empresa/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    telefono: "987654321",
    direccion: "Nueva dirección"
  })
}).then(res => res.json());

// Eliminar empresa
const resultado = await fetch('/functions/v1/empresa/1', {
  method: 'DELETE'
}).then(res => res.json());
```

### Python Backend:
```python
import requests

# Obtener empresas
response = requests.get('https://your-project.supabase.co/functions/v1/empresa')
empresas = response.json()

# Crear empresa
nueva_empresa = {
    "nombre": "Python Corp",
    "tipo_documento": "RUC",
    "numero_documento": "20987654321",
    "email": "info@pythoncorp.pe"
}
response = requests.post(
    'https://your-project.supabase.co/functions/v1/empresa',
    json=nueva_empresa
)
```

## 🔧 Configuración en Dashboard

1. **Function deployed**: ✅ empresa
2. **JWT verification**: ❌ Deshabilitado
3. **CORS enabled**: ✅ Manejado por código
4. **Public access**: ✅ Habilitado

## 🎯 Features Destacadas

- **CRUD completo** con operaciones atómicas
- **Validaciones peruanas** integradas (RUC, DNI, teléfonos)
- **Paginación eficiente** con conteo total
- **Filtros múltiples** (search, estado, tipo_documento)
- **Soft delete** preservando historial
- **Responses unificadas** siguiendo estándar del proyecto
- **Error handling robusto** con mensajes descriptivos
- **Sin autenticación** para facilitar integración

Esta Edge Function está lista para ser usada como base del módulo de gestión de empresas en MultiSoat.
