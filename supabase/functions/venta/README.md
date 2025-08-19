# Venta API

API para gestión de ventas en el sistema MultiSoat.

## Descripción

Esta función maneja todas las operaciones CRUD para ventas, permitiendo la creación, consulta, actualización y eliminación de registros de ventas realizadas en los puntos de venta.

## Estructura de Datos

```typescript
interface Venta {
  id?: number
  id_punto_venta: number        // FK a punto_venta (REQUERIDO)
  fecha_venta?: string          // Timestamp (default: NOW)
  precio_total: number          // Decimal(12,2) (REQUERIDO)
  id_cliente_externo?: string   // Identificador del cliente (OPCIONAL)
  observaciones?: string        // Notas adicionales (OPCIONAL)
  estado?: string              // Estado de la venta (default: 'completada')
  created_at?: string          // Timestamp de creación
  updated_at?: string          // Timestamp de actualización
  created_by?: string          // Usuario que creó
  updated_by?: string          // Usuario que actualizó
}
```

## Endpoints

### POST /venta
Crear nueva venta

**Campos requeridos:**
- `id_punto_venta`: ID del punto de venta
- `precio_total`: Precio total de la venta

**Campos opcionales:**
- `fecha_venta`: Fecha de la venta (default: NOW)
- `id_cliente_externo`: Identificador del cliente
- `observaciones`: Observaciones adicionales
- `estado`: Estado de la venta (default: 'completada')
- `created_by`: Usuario que crea
- `updated_by`: Usuario que actualiza

### GET /venta
Obtener todas las ventas con paginación y filtros

**Parámetros de consulta:**
- `page`: Número de página (default: 1)
- `limit`: Número de registros por página (default: 10)
- `punto_venta_id`: Filtrar por punto de venta
- `estado`: Filtrar por estado
- `fecha_desde`: Filtrar ventas desde fecha (YYYY-MM-DD)
- `fecha_hasta`: Filtrar ventas hasta fecha (YYYY-MM-DD)

### GET /venta/{id}
Obtener venta específica por ID

### PUT /venta/{id}
Actualizar venta existente

**Nota:** Todos los campos son opcionales para actualización

### DELETE /venta/{id}
Eliminar venta

## Características

### Validaciones
- Validación de campos requeridos (`id_punto_venta`, `precio_total`)
- Validación de formato de ID numérico
- Manejo de campos opcionales con valores null

### Relaciones
- Incluye información del punto de venta asociado en las respuestas
- Validación de foreign key con punto_venta

### Filtros y Búsqueda
- Filtrado por punto de venta
- Filtrado por estado
- Filtrado por rango de fechas
- Paginación configurable
- Ordenamiento por fecha (más recientes primero)

### Manejo de Errores
- Validación de entrada completa
- Mensajes de error descriptivos
- Códigos de estado HTTP apropiados
- Manejo de foreign key constraints

### Flexibilidad
- Campos opcionales con manejo de null
- Valores por defecto para campos comunes
- Actualización parcial permitida

## Ejemplos de Uso

### Crear Venta Básica
```json
{
  "id_punto_venta": 1,
  "precio_total": 125000.00
}
```

### Crear Venta Completa
```json
{
  "id_punto_venta": 1,
  "precio_total": 250000.00,
  "id_cliente_externo": "CLI001",
  "observaciones": "Venta de SOAT cliente empresarial",
  "estado": "completada",
  "created_by": "admin"
}
```

### Filtrar por Fecha
```
GET /venta?fecha_desde=2024-01-01&fecha_hasta=2024-12-31
```

### Filtrar por Punto de Venta
```
GET /venta?punto_venta_id=1&page=1&limit=10
```

## Estados de Venta

Los estados válidos deben estar definidos en el catálogo `cat_estados_venta`:
- `completada` (default)
- `pendiente`
- `cancelada`
- `anulada`

## Casos de Uso

1. **Registro de Ventas**: Crear nuevos registros de ventas al completar transacciones
2. **Consulta Histórica**: Obtener historial de ventas con filtros por fecha y punto de venta
3. **Seguimiento**: Actualizar estados y observaciones de ventas
4. **Reportes**: Generar reportes de ventas por período y ubicación
5. **Auditoría**: Mantener registro completo de cambios con timestamps y usuarios

## Notas Técnicas

- Usa paginación por defecto para optimizar performance
- Incluye información de punto de venta en respuestas para contexto completo
- Maneja precisión decimal para precios (12,2)
- Timestamp automático en creación si no se especifica
- Ordenamiento por fecha descendente para mostrar ventas más recientes primero
