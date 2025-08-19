# Distribuidor CRUD API

API RESTful simple para gestión de distribuidores en MultiSoat.

## Características

- ✅ CRUD completo (Crear, Leer, Actualizar, Eliminar)
- ✅ Sin autenticación JWT (para desarrollo)
- ✅ Validación de datos
- ✅ Soft delete (estado INACTIVO)
- ✅ Paginación
- ✅ Relación con proveedores
- ✅ Manejo de errores

## Endpoints

### 1. Crear Distribuidor
```
POST /distribuidor
```

**Body:**
```json
{
  "id_proveedor": 1,
  "nombre": "Distribuidor Norte SAC",
  "email": "norte@distribuidores.com",
  "telefono": "987654321",
  "id_externo_db_data": 12345
}
```

**Response (201):**
```json
{
  "success": true,
  "status": 201,
  "data": {
    "success": true,
    "data": {
      "id": 1,
      "id_proveedor": 1,
      "nombre": "Distribuidor Norte SAC",
      "telefono": "987654321",
      "email": "norte@distribuidores.com",
      "id_externo_db_data": 12345,
      "estado": "PENDIENTE_USUARIO",
      "created_at": "2025-08-19T03:30:00.000Z",
      "updated_at": "2025-08-19T03:30:00.000Z",
      "proveedor": {
        "id": 1,
        "razon_social": "Proveedor Principal SAC",
        "numero_documento": "20123456789"
      }
    },
    "message": "Distribuidor creado exitosamente"
  }
}
```

### 2. Obtener Distribuidor por ID
```
GET /distribuidor/{id}
```

**Response (200):**
```json
{
  "success": true,
  "status": 200,
  "data": {
    "id": 1,
    "id_proveedor": 1,
    "nombre": "Distribuidor Norte SAC",
    "telefono": "987654321",
    "email": "norte@distribuidores.com",
    "estado": "PENDIENTE_USUARIO",
    "proveedor": {
      "id": 1,
      "razon_social": "Proveedor Principal SAC",
      "numero_documento": "20123456789"
    }
  },
  "message": "Distribuidor encontrado exitosamente"
}
```

### 3. Listar Distribuidores
```
GET /distribuidor
GET /distribuidor?page=1&limit=10
```

**Response (200):**
```json
{
  "success": true,
  "status": 200,
  "data": [
    {
      "id": 1,
      "id_proveedor": 1,
      "nombre": "Distribuidor Norte SAC",
      "email": "norte@distribuidores.com",
      "estado": "ACTIVO",
      "proveedor": {
        "razon_social": "Proveedor Principal SAC"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  },
  "message": "Distribuidores obtenidos exitosamente"
}
```

### 4. Actualizar Distribuidor
```
PUT /distribuidor/{id}
```

**Body:**
```json
{
  "nombre": "Distribuidor Norte SAC - Actualizado",
  "telefono": "956789123"
}
```

**Response (200):**
```json
{
  "success": true,
  "status": 200,
  "data": {
    "id": 1,
    "nombre": "Distribuidor Norte SAC - Actualizado",
    "telefono": "956789123",
    "updated_at": "2025-08-19T04:00:00.000Z"
  },
  "message": "Distribuidor actualizado exitosamente"
}
```

### 5. Eliminar Distribuidor (Soft Delete)
```
DELETE /distribuidor/{id}
```

**Response (200):**
```json
{
  "success": true,
  "status": 200,
  "data": {
    "id": 1,
    "estado": "INACTIVO",
    "updated_at": "2025-08-19T04:00:00.000Z"
  },
  "message": "Distribuidor eliminado exitosamente"
}
```

## Validaciones

### Campos Requeridos (POST)
- `id_proveedor`: Debe existir en la tabla proveedor
- `nombre`: Nombre del distribuidor
- `email`: Email único

### Validaciones Adicionales
- Email único por distribuidor
- Proveedor debe existir en la base de datos
- Soft delete cambia estado a 'INACTIVO'

## Códigos de Error

- **400**: Datos inválidos o requeridos faltantes
- **404**: Distribuidor no encontrado
- **500**: Error interno del servidor

## Estructura de Base de Datos

```sql
CREATE TABLE distribuidor (
  id SERIAL PRIMARY KEY,
  id_proveedor INTEGER NOT NULL REFERENCES proveedor(id),
  nombre VARCHAR(100),
  telefono VARCHAR(20),
  email VARCHAR(100) NOT NULL,
  id_externo_db_data INTEGER,
  estado VARCHAR(20) DEFAULT 'PENDIENTE_USUARIO',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID,
  updated_by UUID
);
```

## Testing

Usa la colección de Postman incluida (`postman-collection.json`) para probar todos los endpoints:

1. Crear distribuidor
2. Obtener por ID
3. Listar todos
4. Actualizar
5. Eliminar (soft delete)
6. Casos de error

## Configuración

La función está configurada en `config.toml`:

```toml
[functions.distribuidor]
enabled = true
verify_jwt = false
import_map = "./functions/distribuidor/deno.json"
entrypoint = "./functions/distribuidor/index.ts"
```

## Despliegue

```bash
# Desplegar la función
supabase functions deploy distribuidor

# Verificar el despliegue
curl https://tu-proyecto.supabase.co/functions/v1/distribuidor
```
