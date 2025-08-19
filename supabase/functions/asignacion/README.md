# Asignación de Certificados - CRUD API

## Descripción
Esta API gestiona las asignaciones de certificados a distribuidores o puntos de venta dentro del sistema MultiSoat. Permite el seguimiento completo del ciclo de vida de los certificados desde su creación hasta su asignación.

## Funcionalidades

### ✅ Operaciones CRUD Completas
- **CREATE**: Crear nuevas asignaciones de certificados
- **READ**: Listar y obtener asignaciones con filtros avanzados
- **UPDATE**: Actualizar asignaciones existentes
- **DELETE**: Eliminación lógica (soft delete)

### ✅ Gestión de Estados
- **Activo**: Asignación vigente
- **Inactivo**: Asignación eliminada lógicamente

### ✅ Tipos de Asignación
- **Distribuidor**: Certificado asignado a un distribuidor
- **Punto de Venta**: Certificado asignado directamente a un punto de venta

### ✅ Validaciones de Negocio
- Verificación de existencia de certificados, distribuidores y puntos de venta
- Control de disponibilidad de certificados (estado DISPONIBLE)
- Prevención de asignaciones duplicadas
- Validación de tipos de asignación
- Actualización automática del estado del certificado

## Endpoints

### GET /asignacion
Lista todas las asignaciones con paginación y filtros opcionales.

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Elementos por página (default: 10)
- `certificado_id` (opcional): Filtrar por certificado
- `distribuidor_id` (opcional): Filtrar por distribuidor
- `punto_venta_id` (opcional): Filtrar por punto de venta
- `tipo_asignacion` (opcional): Filtrar por tipo (distribuidor/punto_venta)
- `estado` (opcional): Filtrar por estado (activo/inactivo)

### GET /asignacion/{id}
Obtiene una asignación específica por ID.

### POST /asignacion
Crea una nueva asignación de certificado.

**Body (Asignación a Distribuidor):**
```json
{
  "id_certificado": 1,
  "id_distribuidor": 1,
  "tipo_asignacion": "distribuidor",
  "usuario_asignacion": "user-id"
}
```

**Body (Asignación a Punto de Venta):**
```json
{
  "id_certificado": 2,
  "id_punto_venta": 1,
  "tipo_asignacion": "punto_venta",
  "usuario_asignacion": "user-id"
}
```

### PUT /asignacion/{id}
Actualiza una asignación existente.

**Restricciones:**
- No se puede cambiar el certificado asignado
- No se puede cambiar el tipo de asignación

### DELETE /asignacion/{id}
Elimina lógicamente una asignación (soft delete).

## Flujo de Estados del Certificado

### Estados de Certificados
1. **DISPONIBLE** → **ASIGNADO_DIST** (cuando se asigna a distribuidor)
2. **DISPONIBLE** → **ASIGNADO_PV** (cuando se asigna a punto de venta)
3. **ASIGNADO_DIST/ASIGNADO_PV** → **DISPONIBLE** (cuando se elimina asignación)

## Relaciones de Base de Datos

### Tabla: asignacion_certificado
```sql
- id (SERIAL PRIMARY KEY)
- id_certificado (INTEGER FK → certificado.id)
- id_distribuidor (INTEGER FK → distribuidor.id) [opcional]
- id_punto_venta (INTEGER FK → punto_venta.id) [opcional]
- tipo_asignacion (VARCHAR(20): 'distribuidor' | 'punto_venta')
- fecha_asignacion (TIMESTAMP)
- usuario_asignacion (UUID FK)
- estado (VARCHAR(20) DEFAULT 'activo')
- created_at, updated_at, created_by, updated_by
```

## Validaciones Implementadas

### ✅ Campos Requeridos
- `id_certificado`: Siempre requerido
- `tipo_asignacion`: Debe ser 'distribuidor' o 'punto_venta'
- `id_distribuidor`: Requerido cuando tipo_asignacion = 'distribuidor'
- `id_punto_venta`: Requerido cuando tipo_asignacion = 'punto_venta'

### ✅ Validaciones de Existencia
- El certificado debe existir en la base de datos
- El distribuidor debe existir (cuando aplique)
- El punto de venta debe existir (cuando aplique)

### ✅ Validaciones de Estado
- El certificado debe estar en estado 'DISPONIBLE' para ser asignado
- No puede haber asignaciones activas duplicadas para el mismo certificado

### ✅ Validaciones de Integridad
- No se puede cambiar el certificado de una asignación existente
- No se puede cambiar el tipo de asignación una vez creada

## Casos de Error Comunes

### 400 Bad Request
- Campos requeridos faltantes
- Tipo de asignación inválido
- Distribuidor/punto de venta faltante según tipo
- Certificado no disponible
- Asignación duplicada

### 404 Not Found
- Asignación no encontrada
- Certificado no existe
- Distribuidor no existe
- Punto de venta no existe

### 500 Internal Server Error
- Errores de base de datos
- Problemas de conectividad

## Testing
Utiliza la colección de Postman incluida (`postman-collection.json`) para probar todos los endpoints y casos de error.

### Casos de Prueba Incluidos
1. **Operaciones Básicas**: CRUD completo
2. **Filtros**: Por certificado, distribuidor, punto de venta, tipo, estado
3. **Paginación**: Control de resultados
4. **Validaciones**: Todos los casos de error esperados
5. **Estados**: Flujo completo de asignación y eliminación

## Consideraciones Técnicas

### Transaccionalidad
- Al crear una asignación, se actualiza automáticamente el estado del certificado
- Al eliminar una asignación, se restaura el certificado a estado DISPONIBLE

### Auditoria
- Todas las operaciones incluyen timestamps de creación y actualización
- Se registra el usuario responsable de cada operación

### Rendimiento
- Índices en campos de búsqueda frecuente
- Paginación para listas grandes
- Joins optimizados para obtener datos relacionados
