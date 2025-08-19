# Punto de Venta CRUD API

API RESTful simple para gestión de puntos de venta en MultiSoat.

## Características

- ✅ CRUD completo (Crear, Leer, Actualizar, Eliminar)
- ✅ Sin autenticación JWT (para desarrollo)
- ✅ Validación de datos y documentos
- ✅ Soft delete (estado INACTIVO)
- ✅ Paginación
- ✅ Validación de tipos de documento del catálogo
- ✅ Unicidad de documentos y emails
- ✅ Manejo de errores

## Endpoints

### 1. Crear Punto de Venta
```
POST /punto_venta
```

**Body:**
```json
{
  "tipo_documento": "RUC",
  "numero_documento": "20123456789",
  "nombre": "Punto de Venta Norte",
  "email": "norte@puntoventa.com",
  "telefono": "987654321",
  "direccion": "Av. Principal 123 - Lima",
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
      "tipo_documento": "RUC",
      "numero_documento": "20123456789",
      "nombre": "Punto de Venta Norte",
      "direccion": "Av. Principal 123 - Lima",
      "telefono": "987654321",
      "email": "norte@puntoventa.com",
      "id_externo_db_data": 12345,
      "estado": "PENDIENTE_USUARIO",
      "created_at": "2025-08-19T03:30:00.000Z",
      "updated_at": "2025-08-19T03:30:00.000Z"
    },
    "message": "Punto de venta creado exitosamente"
  }
}
```

### 2. Obtener Punto de Venta por ID
```
GET /punto_venta/{id}
```

**Response (200):**
```json
{
  "success": true,
  "status": 200,
  "data": {
    "id": 1,
    "tipo_documento": "RUC",
    "numero_documento": "20123456789",
    "nombre": "Punto de Venta Norte",
    "direccion": "Av. Principal 123 - Lima",
    "telefono": "987654321",
    "email": "norte@puntoventa.com",
    "estado": "PENDIENTE_USUARIO"
  },
  "message": "Punto de venta encontrado exitosamente"
}
```

### 3. Listar Puntos de Venta
```
GET /punto_venta
GET /punto_venta?page=1&limit=10
```

**Response (200):**
```json
{
  "success": true,
  "status": 200,
  "data": [
    {
      "id": 1,
      "tipo_documento": "RUC",
      "numero_documento": "20123456789",
      "nombre": "Punto de Venta Norte",
      "email": "norte@puntoventa.com",
      "estado": "ACTIVO"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  },
  "message": "Puntos de venta obtenidos exitosamente"
}
```

### 4. Actualizar Punto de Venta
```
PUT /punto_venta/{id}
```

**Body:**
```json
{
  "nombre": "Punto de Venta Norte - Actualizado",
  "telefono": "956789123",
  "direccion": "Av. Principal 456 - Lima"
}
```

**Response (200):**
```json
{
  "success": true,
  "status": 200,
  "data": {
    "id": 1,
    "nombre": "Punto de Venta Norte - Actualizado",
    "telefono": "956789123",
    "direccion": "Av. Principal 456 - Lima",
    "updated_at": "2025-08-19T04:00:00.000Z"
  },
  "message": "Punto de venta actualizado exitosamente"
}
```

### 5. Eliminar Punto de Venta (Soft Delete)
```
DELETE /punto_venta/{id}
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
  "message": "Punto de venta eliminado exitosamente"
}
```

## Validaciones

### Campos Requeridos (POST)
- `tipo_documento`: Debe existir en cat_tipos_documento (RUC, DNI, CE, PASSPORT)
- `numero_documento`: Único por punto de venta
- `nombre`: Nombre del punto de venta
- `email`: Email único

### Validaciones Adicionales
- Tipo de documento válido según catálogo
- Número de documento único
- Email único por punto de venta
- Soft delete cambia estado a 'INACTIVO'

### Tipos de Documento Soportados
- **RUC**: Registro Único de Contribuyentes (11 dígitos)
- **DNI**: Documento Nacional de Identidad (8 dígitos)
- **CE**: Carné de Extranjería
- **PASSPORT**: Pasaporte

## Códigos de Error

- **400**: Datos inválidos, requeridos faltantes, duplicados o tipo documento inválido
- **404**: Punto de venta no encontrado
- **500**: Error interno del servidor

## Estructura de Base de Datos

```sql
CREATE TABLE punto_venta (
  id SERIAL PRIMARY KEY,
  tipo_documento VARCHAR(10) NOT NULL REFERENCES cat_tipos_documento(codigo),
  numero_documento VARCHAR(20) NOT NULL UNIQUE,
  nombre VARCHAR(100),
  direccion VARCHAR(200),
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

1. Crear punto de venta (RUC)
2. Crear punto de venta (DNI)
3. Obtener por ID
4. Listar todos
5. Actualizar
6. Eliminar (soft delete)
7. Casos de error:
   - Campos requeridos faltantes
   - Tipo documento inválido
   - Documento duplicado
   - Email duplicado
   - No encontrado

## Configuración

La función está configurada en `config.toml`:

```toml
[functions.punto_venta]
enabled = true
verify_jwt = false
import_map = "./functions/punto_venta/deno.json"
entrypoint = "./functions/punto_venta/index.ts"
```

## Despliegue

```bash
# Desplegar la función
supabase functions deploy punto_venta

# Verificar el despliegue
curl https://tu-proyecto.supabase.co/functions/v1/punto_venta
```

## Ejemplos de Uso

### Crear Punto de Venta con RUC
```bash
curl -X POST https://tu-proyecto.supabase.co/functions/v1/punto_venta \
  -H "Content-Type: application/json" \
  -d '{
    "tipo_documento": "RUC",
    "numero_documento": "20123456789",
    "nombre": "Mi Punto de Venta",
    "email": "contacto@mipuntoventa.com",
    "telefono": "987654321",
    "direccion": "Av. Principal 123"
  }'
```

### Crear Punto de Venta con DNI
```bash
curl -X POST https://tu-proyecto.supabase.co/functions/v1/punto_venta \
  -H "Content-Type: application/json" \
  -d '{
    "tipo_documento": "DNI",
    "numero_documento": "12345678",
    "nombre": "Juan Pérez",
    "email": "juan.perez@email.com",
    "telefono": "987654321"
  }'
```
