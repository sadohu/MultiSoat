# Venta Certificado API

API para gestión de ventas de certificados individuales en el sistema MultiSoat.

## Descripción

Esta función maneja todas las operaciones CRUD para la relación entre ventas y certificados, permitiendo el registro detallado de cada certificado vendido con información financiera específica.

## Estructura de Datos

```typescript
interface VentaCertificado {
  id?: number
  id_venta: number                  // FK a venta (REQUERIDO)
  id_certificado: number            // FK a certificado (REQUERIDO) - UNIQUE
  precio_venta: number              // Decimal(12,2) (REQUERIDO)
  monto_fijo_proveedor?: number     // Decimal(12,2) (OPCIONAL)
  descuento_aplicado?: number       // Decimal(12,2) (default: 0)
  ganancia_pv?: number              // Decimal(12,2) (OPCIONAL)
  estado?: string                   // Estado (default: 'vendido')
  created_at?: string               // Timestamp de creación
  updated_at?: string               // Timestamp de actualización
  created_by?: string               // Usuario que creó
  updated_by?: string               // Usuario que actualizó
}
```

## Endpoints

### POST /venta_certificado
Crear nueva venta de certificado

**Campos requeridos:**
- `id_venta`: ID de la venta principal
- `id_certificado`: ID del certificado vendido (debe ser único)
- `precio_venta`: Precio de venta del certificado

**Campos opcionales:**
- `monto_fijo_proveedor`: Monto que va al proveedor
- `descuento_aplicado`: Descuento aplicado (default: 0)
- `ganancia_pv`: Ganancia del punto de venta
- `estado`: Estado de la venta (default: 'vendido')
- `created_by`: Usuario que crea
- `updated_by`: Usuario que actualiza

### GET /venta_certificado
Obtener todas las ventas de certificados con paginación y filtros

**Parámetros de consulta:**
- `page`: Número de página (default: 1)
- `limit`: Número de registros por página (default: 10)
- `venta_id`: Filtrar por venta específica
- `certificado_id`: Filtrar por certificado específico
- `estado`: Filtrar por estado

### GET /venta_certificado/{id}
Obtener venta de certificado específica por ID

### PUT /venta_certificado/{id}
Actualizar venta de certificado existente

**Nota:** Todos los campos son opcionales para actualización

### DELETE /venta_certificado/{id}
Eliminar venta de certificado

## Características

### Validaciones
- Validación de campos requeridos (`id_venta`, `id_certificado`, `precio_venta`)
- Validación de unicidad de certificado (un certificado solo puede venderse una vez)
- Validación de foreign keys (venta y certificado deben existir)

### Relaciones
- Incluye información de la venta asociada con datos del punto de venta
- Incluye información del certificado con datos del proveedor
- Relación uno a uno con certificado (UNIQUE constraint)

### Filtros y Búsqueda
- Filtrado por venta específica
- Filtrado por certificado específico
- Filtrado por estado
- Paginación configurable
- Ordenamiento por fecha de creación (más recientes primero)

### Cálculos Financieros
- Precio de venta individual por certificado
- Monto fijo para proveedor
- Descuentos aplicados
- Ganancia del punto de venta
- Soporte para decimales de precisión financiera

### Manejo de Errores
- Validación de entrada completa
- Manejo de constraint de unicidad
- Mensajes de error descriptivos
- Códigos de estado HTTP apropiados

### Flexibilidad
- Campos financieros opcionales con manejo de null
- Valores por defecto para campos comunes
- Actualización parcial permitida

## Ejemplos de Uso

### Crear Venta de Certificado Básica
```json
{
  "id_venta": 1,
  "id_certificado": 2,
  "precio_venta": 115000.00
}
```

### Crear Venta de Certificado Completa
```json
{
  "id_venta": 1,
  "id_certificado": 1,
  "precio_venta": 125000.00,
  "monto_fijo_proveedor": 100000.00,
  "descuento_aplicado": 5000.00,
  "ganancia_pv": 20000.00,
  "estado": "vendido",
  "created_by": "admin"
}
```

### Obtener Certificados de una Venta
```
GET /venta_certificado?venta_id=1
```

### Buscar por Certificado Específico
```
GET /venta_certificado?certificado_id=5
```

## Estados de Venta de Certificados

Los estados típicos incluyen:
- `vendido` (default)
- `cancelado`
- `devuelto`
- `anulado`

## Constraint Importante

⚠️ **UNIQUE CONSTRAINT**: Cada certificado solo puede venderse UNA vez. Si intentas vender el mismo certificado en múltiples ventas, obtendrás un error de constraint de unicidad.

## Casos de Uso

1. **Registro Detallado**: Registrar cada certificado vendido con información financiera específica
2. **Trazabilidad**: Seguir el historial de venta de cada certificado individual
3. **Cálculos Financieros**: Determinar ganancias, comisiones y distribución de ingresos
4. **Reportes**: Generar reportes detallados de ventas por certificado
5. **Auditoría**: Mantener registro completo de transacciones por certificado
6. **Control de Inventario**: Evitar venta duplicada de certificados

## Relaciones con Otras Entidades

- **venta**: Venta principal que agrupa múltiples certificados
- **certificado**: Certificado específico que se está vendiendo
- **punto_venta**: A través de la venta, punto donde se realizó la transacción
- **proveedor**: A través del certificado, proveedor del certificado

## Notas Técnicas

- Constraint de unicidad en `id_certificado` para evitar ventas duplicadas
- Soporte para decimales de precisión financiera (12,2)
- Ordenamiento por fecha de creación descendente
- Incluye información completa de relaciones en respuestas
- Paginación optimizada para grandes volúmenes de ventas
