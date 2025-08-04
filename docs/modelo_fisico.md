# Definición de Tablas y Campos (Modelo Físico)

> Nota: Los datos de cliente, vehículo, distribuidores y proveedor pueden tener información referenciada desde la base de datos externa (DB_DATA). Aquí solo se almacenan los identificadores y datos mínimos necesarios para la operación y trazabilidad.

---

## 1. proveedor
- id_proveedor (PK, serial)
- tipo_documento (varchar, RUC/DNI)
- numero_documento (varchar)
- razon_social (varchar)
- nombre (varchar)
- direccion (varchar)
- telefono (varchar)
- email (varchar)
- id_externo_db_data (varchar)  # Referencia a DB_DATA
- fecha_creacion (timestamp)
- fecha_actualizacion (timestamp)
- usuario_creacion (FK a usuario)
- usuario_actualizacion (FK a usuario)
- estado (activo/inactivo)

## 2. distribuidor
- id_distribuidor (PK, serial)
- id_proveedor (FK)
- nombre (varchar)
- telefono (varchar)
- email (varchar)
- id_externo_db_data (varchar)  # Referencia a DB_DATA
- fecha_creacion (timestamp)
- fecha_actualizacion (timestamp)
- usuario_creacion (FK a usuario)
- usuario_actualizacion (FK a usuario)
- estado (activo/inactivo)

## 3. punto_venta
- id_punto_venta (PK, serial)
- tipo_documento (varchar, RUC/DNI)
- numero_documento (varchar)
- nombre (varchar)
- direccion (varchar)
- telefono (varchar)
- email (varchar)
- id_externo_db_data (varchar)  # Referencia a DB_DATA
- fecha_creacion (timestamp)
- fecha_actualizacion (timestamp)
- usuario_creacion (FK a usuario)
- usuario_actualizacion (FK a usuario)
- estado (activo/inactivo)

## 4. afiliacion_pv_proveedor
- id_afiliacion (PK, serial)
- id_proveedor (FK)
- id_distribuidor (FK)
- id_punto_venta (FK)
- estado (pendiente/verificado/activo/suspendido)
- fecha_verificacion (timestamp)
- usuario_verificador (FK a usuario)
- fecha_creacion (timestamp)
- fecha_actualizacion (timestamp)
- usuario_creacion (FK a usuario)
- usuario_actualizacion (FK a usuario)

## 5. zona
- id_zona (PK, serial)
- id_proveedor (FK)
- nombre (varchar)
- descripcion (text)
- fecha_creacion (timestamp)
- estado (activo/inactivo)

## 6. zona_punto_venta
- id_zona_pv (PK, serial)
- id_zona (FK)
- id_punto_venta (FK)
- fecha_asignacion (timestamp)
- estado (activo/inactivo)

## 7. certificado
- id_certificado (PK, serial)
- id_proveedor (FK)
- numero_serie (varchar)
- categoria (varchar)
- foto_url (varchar)
- datos_vehiculo_externo (varchar)  # ID externo DB_DATA
- estado (disponible/asignado/vendido/anulado)
- fecha_registro (timestamp)
- fecha_asignacion (timestamp)
- fecha_venta (timestamp)
- fecha_actualizacion (timestamp)
- usuario_creacion (FK a usuario)
- usuario_actualizacion (FK a usuario)

## 8. venta
- id_venta (PK, serial)
- id_punto_venta (FK)
- fecha (timestamp)
- precio_total (decimal)
- id_cliente_externo (varchar)  # ID externo DB_DATA
- observaciones (text)
- estado (activa/anulada)
- fecha_creacion (timestamp)
- fecha_actualizacion (timestamp)
- usuario_creacion (FK a usuario)
- usuario_actualizacion (FK a usuario)

## 9. venta_certificado
- id_venta_cert (PK, serial)
- id_venta (FK)
- id_certificado (FK)
- precio_venta (decimal)
- monto_fijo_proveedor (decimal)
- descuento_aplicado (decimal)
- ganancia_pv (decimal)
- estado (vendido/anulado)

## 10. descuento_pv
- id_descuento (PK, serial)
- id_proveedor (FK)
- id_punto_venta (FK)
- porcentaje (decimal)
- monto_fijo (decimal)
- fecha_inicio (date)
- fecha_fin (date)
- estado (activo/inactivo)

## 11. deuda
- id_deuda (PK, serial)
- id_venta (FK)
- id_punto_venta (FK)
- id_proveedor (FK)
- monto_original (decimal)
- monto_pendiente (decimal)
- fecha_vencimiento (date)
- estado (pendiente/amortizado/pagado/vencido)
- mora_acumulada (decimal)
- fecha_creacion (timestamp)
- fecha_actualizacion (timestamp)
- usuario_creacion (FK a usuario)
- usuario_actualizacion (FK a usuario)

## 12. cuota_deuda
- id_cuota (PK, serial)
- id_deuda (FK)
- monto_cuota (decimal)
- fecha_vencimiento (date)
- estado (pendiente/pagada/vencida)
- fecha_pago (timestamp)
- fecha_creacion (timestamp)
- usuario_creacion (FK a usuario)

## 13. pago
- id_pago (PK, serial)
- id_punto_venta (FK)
- id_proveedor (FK)
- monto (decimal)
- fecha (timestamp)
- modalidad (varchar)
- observaciones (text)
- usuario_registro (FK a usuario)
- fecha_creacion (timestamp)

## 14. pago_deuda
- id_pago_deuda (PK, serial)
- id_pago (FK)
- id_deuda (FK)
- id_cuota (FK, nullable)
- monto_aplicado (decimal)

## 15. politica_mora
- id_politica (PK, serial)
- id_proveedor (FK)
- tipo (fijo/porcentaje)
- valor (decimal)
- dias_gracia (int)
- estado (activo/inactivo)

## 16. visita
- id_visita (PK, serial)
- id_proveedor (FK)
- id_distribuidor (FK)
- id_punto_venta (FK)
- fecha (timestamp)
- motivo (varchar)
- estado (pendiente/realizada/vencida)
- observaciones (text)
- usuario_programa (FK a usuario)

## 17. usuario
- id_usuario (PK, serial)
- id_supabase (varchar)
- nombre (varchar)
- tipo_documento (varchar)
- numero_documento (varchar)
- email (varchar)
- telefono (varchar)
- estado (activo/inactivo)
- fecha_creacion (timestamp)

## 18. usuario_rol
- id_usuario_rol (PK, serial)
- id_usuario (FK)
- rol (varchar: proveedor, distribuidor, pv, admin, etc.)
- id_entidad (FK a proveedor/distribuidor/pv)
- fecha_asignacion (timestamp)

---

> Si necesitas agregar campos adicionales para auditoría, integración o trazabilidad, se recomienda usar campos como `fecha_creacion`, `usuario_registro`, `estado`, y referencias a DB_DATA donde corresponda.
