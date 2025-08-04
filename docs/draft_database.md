# Bosquejo de Base de Datos (Resumen de Tablas y Relaciones)

## Tablas Principales

### 1. proveedor
- id_proveedor (PK)
- tipo_documento (RUC/DNI)
- numero_documento
- razon_social
- direccion
- contacto

### 2. distribuidor
- id_distribuidor (PK)
- id_proveedor (FK)
- nombre
- contacto

### 3. punto_venta
- id_punto_venta (PK)
- tipo_documento (RUC/DNI)
- numero_documento
- nombre
- direccion
- contacto

### 4. afiliacion_pv_proveedor
- id_afiliacion (PK)
- id_proveedor (FK)
- id_distribuidor (FK)
- id_punto_venta (FK)
- estado (pendiente/verificado/activo)
- fecha_verificacion
- usuario_verificador

### 5. zona
- id_zona (PK)
- id_proveedor (FK)
- nombre
- descripcion

### 6. zona_punto_venta
- id_zona_pv (PK)
- id_zona (FK)
- id_punto_venta (FK)
- fecha_asignacion

### 7. certificado
- id_certificado (PK)
- id_proveedor (FK)
- numero_serie
- categoria
- foto
- datos_vehiculo
- estado (disponible/asignado/vendido)

### 8. venta
- id_venta (PK)
- id_punto_venta (FK)
- fecha
- precio_total
- id_cliente_externo

### 9. venta_certificado
- id_venta_cert (PK)
- id_venta (FK)
- id_certificado (FK)
- precio_venta
- monto_fijo_proveedor
- descuento_aplicado
- ganancia_pv

### 10. descuento_pv
- id_descuento (PK)
- id_proveedor (FK)
- id_punto_venta (FK)
- porcentaje
- monto_fijo
- fecha_inicio
- fecha_fin

### 11. deuda
- id_deuda (PK)
- id_venta (FK)
- id_punto_venta (FK)
- id_proveedor (FK)
- monto_original
- monto_pendiente
- fecha_vencimiento
- estado (pendiente/amortizado/pagado/vencido)
- mora_acumulada

### 12. cuota_deuda
- id_cuota (PK)
- id_deuda (FK)
- monto_cuota
- fecha_vencimiento
- estado (pendiente/pagada/vencida)
- fecha_pago

### 13. pago
- id_pago (PK)
- id_punto_venta (FK)
- id_proveedor (FK)
- monto
- fecha
- modalidad
- observaciones

### 14. pago_deuda
- id_pago_deuda (PK)
- id_pago (FK)
- id_deuda (FK)
- id_cuota (FK, nullable)
- monto_aplicado

### 15. politica_mora
- id_politica (PK)
- id_proveedor (FK)
- tipo (fijo/porcentaje)
- valor
- dias_gracia

### 16. visita
- id_visita (PK)
- id_proveedor (FK)
- id_distribuidor (FK)
- id_punto_venta (FK)
- fecha
- motivo
- estado (pendiente/realizada/vencida)
- observaciones

### 17. usuario
- id_usuario (PK)
- id_supabase
- nombre
- tipo_documento
- numero_documento

### 18. usuario_rol
- id_usuario_rol (PK)
- id_usuario (FK)
- rol (proveedor, distribuidor, pv, admin, etc.)
- id_entidad (FK a proveedor/distribuidor/pv)

---

# Procesos del Negocio y Tablas Involucradas

## Registro y Afiliación
- proveedor, distribuidor, punto_venta, afiliacion_pv_proveedor, usuario, usuario_rol

## Gestión de Zonas
- zona, zona_punto_venta, proveedor, punto_venta

## Gestión de Certificados
- certificado, proveedor, punto_venta

## Ventas y Ganancias
- venta, venta_certificado, punto_venta, proveedor, descuento_pv

## Créditos y Deudas
- deuda, cuota_deuda, proveedor, punto_venta

## Pagos y Moras
- pago, pago_deuda, deuda, cuota_deuda, politica_mora, proveedor, punto_venta

## Visitas
- visita, proveedor, distribuidor, punto_venta

## Usuarios y Roles
- usuario, usuario_rol

## Integración Externa
- venta (id_cliente_externo), certificado (datos_vehiculo)

---


# Ejemplos de Flujos para Procesos Esenciales

## 1. Registro de Punto de Venta (PV)
1. El distribuidor registra un nuevo punto de venta en el sistema (`punto_venta`).
2. El distribuidor crea la afiliación del PV con el proveedor (`afiliacion_pv_proveedor`, estado: pendiente).
3. El proveedor revisa y activa la afiliación (cambia estado a 'verificado' o 'activo').

## 2. Venta de Certificados
1. El PV selecciona uno o varios certificados disponibles (`certificado`, estado: disponible).
2. El PV realiza la venta, creando un registro en `venta`.
3. Se asocian los certificados vendidos a la venta (`venta_certificado`).
4. Se calcula el monto fijo para el proveedor, descuento aplicado y ganancia del PV.
5. Los certificados cambian su estado a 'vendido'.

## 3. Pagos de Recaudaciones (Venta al Contado)
1. Por cada venta, se genera una deuda en `deuda` (monto igual a la suma de los montos fijos de los certificados vendidos).
2. El PV realiza un pago (`pago`).
3. El pago se asocia a la deuda correspondiente (`pago_deuda`).
4. Si el pago cubre la deuda, la deuda se marca como 'pagada'.
5. Si hay atraso, se calcula y registra la mora (`politica_mora`).

## 4. Venta a Crédito (Cuotas)
1. El PV realiza una venta grande y solicita crédito.
2. Se genera una deuda en `deuda` (por el monto total a pagar al proveedor).
3. Se definen cuotas para esa deuda en `cuota_deuda` (por ejemplo, 3 cuotas de S/ 100 cada una, con fechas de vencimiento).
4. Cada cuota tiene su propio estado (pendiente/pagada/vencida).

## 5. Pagos de Deuda y Pagos de Cuotas
### Pago de Deuda Completa
1. El PV realiza un pago por el total de la deuda (`pago`).
2. El pago se asocia a la deuda en `pago_deuda` y la deuda se marca como 'pagada'.

### Pago de Cuotas
1. El PV realiza un pago parcial, cubriendo una o varias cuotas (`pago`).
2. El pago se asocia a las cuotas correspondientes en `pago_deuda` (puede cubrir una o varias cuotas, usando el campo `id_cuota`).
3. Las cuotas pagadas se marcan como 'pagadas'.
4. Si alguna cuota queda pendiente y vence, se calcula y registra la mora.

## 6. Conversión de deuda amortizada a cuotas
1. El PV tiene una deuda de venta parcialmente amortizada (por ejemplo, pagó una parte).
2. Solicita fraccionar el saldo pendiente en cuotas.
3. El sistema crea registros en `cuota_deuda` solo por el saldo pendiente.
4. Los pagos futuros se asocian a estas cuotas.
5. Cuando todas las cuotas estén pagadas, la deuda principal se marca como pagada.

---

> Este bosquejo y los ejemplos reflejan el modelo actualizado, con deuda por venta, trazabilidad por certificado a través de `venta_certificado`, y la flexibilidad para pagos parciales, amortizaciones y conversión de saldos en cuotas.
