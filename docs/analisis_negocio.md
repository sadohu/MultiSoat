# Análisis del Negocio: Sistema de Venta de Certificados AFOCAT

## 1. Jerarquía y Flujo de Registro
- El sistema administra **proveedores** (personas naturales o jurídicas) de certificados.
- Cada proveedor registra distribuidores (relación 1:1).
- Los distribuidores registran puntos de venta, pero la afiliación solo es válida tras la verificación final del proveedor.
- Un punto de venta puede estar afiliado a varios proveedores, pero solo una vez por proveedor.

## 2. Certificados
- Los certificados son creados y gestionados por los proveedores.
- Cada certificado es único y contiene información relevante (foto, motor, precio, categoría, etc.).
- Los certificados se asignan a puntos de venta a través de los distribuidores, pudiendo ser asignados en bloques (especialmente en modalidad de crédito).

## 3. Zonas y Distribuidores
- Cada proveedor define sus propias zonas.
- Los distribuidores y puntos de venta pueden ser asignados a zonas, pero un punto de venta solo puede pertenecer a una zona por proveedor.
- Las zonas y su gestión son independientes entre proveedores.

## 4. Ventas, Ganancias y Descuentos
- El punto de venta realiza la venta de certificados, fijando el precio final.
- El proveedor recibe un monto fijo por cada certificado vendido, que puede ser reducido por un descuento específico asignado al punto de venta.
- El resto es ganancia del punto de venta.
- Los puntos de venta pueden visualizar sus ganancias por las ventas generadas.

## 5. Créditos y Cuotas
- Cuando una venta es excepcionalmente grande y el punto de venta no puede pagar al contado, se genera un crédito para esa venta.
- Se crea una deuda asociada a la venta y se pueden definir cuotas para el pago de esa deuda (tabla `cuota_deuda`).
- El punto de venta debe pagar al proveedor según las ventas realizadas y las condiciones de crédito/cuotas.

## 6. Deudas, Cuotas, Pagos y Moras
- Cada venta puede generar una deuda del punto de venta hacia el proveedor.
- Las deudas pueden dividirse en cuotas (tabla `cuota_deuda`), cada una con su propio vencimiento y estado.
- Los pagos pueden aplicarse a una o varias deudas/cuotas, según lo decida el usuario.
- Si el pago no cubre una deuda/cuota completa, se registra como amortización parcial.
- Cada proveedor define su política de mora (monto fijo o porcentaje, días de gracia).
- El sistema calcula y registra moras por atraso en los pagos de deudas o cuotas.

## 7. Visitas
- Los proveedores o jefes de distribución pueden programar visitas de distribuidores a puntos de venta (por restock, cobros, soporte, etc.).
- Las visitas tienen fecha, motivo, estado y pueden ser gestionadas y monitoreadas.

## 8. Identificación y Usuarios
- Proveedores: identificados por tipo y número de documento (RUC, DNI, etc.).
- Puntos de venta: pueden ser RUC o DNI.
- Usuarios autenticados por Supabase (ID externo), con posibilidad de múltiples roles y afiliaciones.
- Al registrar un punto de venta, solo se crea una credencial la primera vez; nuevas afiliaciones solo habilitan la relación con el proveedor.

## 9. Integración Externa
- Los datos de clientes y vehículos se almacenan en otra base de datos; solo se requiere referencia (ID externo) en las ventas o certificados.

## 10. Conversión de deuda amortizada a cuotas
- Si un punto de venta (PV) tiene una deuda parcialmente amortizada (ha realizado un pago parcial sobre una deuda de venta) y luego solicita fraccionar el saldo pendiente en cuotas, el sistema permite:
  1. Verificar el monto pendiente de la deuda original.
  2. Crear registros en `cuota_deuda` solo por el saldo pendiente.
  3. Asociar los pagos futuros a estas cuotas.
  4. Marcar la deuda principal como pagada cuando todas las cuotas estén pagadas.
- Esto otorga flexibilidad y trazabilidad, manteniendo el historial de pagos y la relación entre la deuda original y las cuotas generadas posteriormente.

## 11. Resumen de gestión de deudas, cuotas y pagos
- **Deuda:** Se genera por cada venta que el PV debe rendir al proveedor. Puede ser pagada al contado o fraccionada en cuotas.
- **Cuota_deuda:** Se utiliza cuando el saldo de una deuda se acuerda pagar en partes. Cada cuota tiene su propio monto, vencimiento y estado.
- **Pagos:** Pueden aplicarse a deudas completas o a cuotas específicas. El sistema permite pagos parciales, totales y la conversión de saldos pendientes en cuotas.
- El sistema está preparado para gestionar pagos parciales, amortizaciones, fraccionamiento de deudas en cuotas y la trazabilidad de todos los movimientos asociados a cada deuda y cuota.
