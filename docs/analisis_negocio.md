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


## 5. Límite de Stock (Crédito de Stock)

- Cada punto de venta tiene un **crédito de stock**: es el máximo número de certificados que puede tener asignados simultáneamente, definido por el proveedor.
- Cuando un distribuidor asigna certificados a un punto de venta, debe respetar este límite. Ejemplo: si el crédito de stock es 10 y el PV tiene 5 certificados en stock, solo puede recibir hasta 5 adicionales.
- El stock disponible se actualiza cada vez que el punto de venta vende un certificado (reduce stock) o recibe una nueva asignación (aumenta stock, sin exceder el límite).
- El proveedor puede modificar el crédito de stock de cada punto de venta según su política interna.
- No existe financiamiento ni cuotas: el control es únicamente sobre la cantidad máxima de certificados en poder del punto de venta.

> Nota: Eliminar toda referencia a financiamiento, deudas en cuotas o pagos parciales en este contexto. El sistema solo gestiona el stock asignado y vendido.

## 6. Deudas, Pagos y Moras
- Cada venta genera una deuda del punto de venta hacia el proveedor, con un plazo de pago determinado.
- Los pagos pueden aplicarse a una o varias deudas, según lo decida el usuario.
- Si el pago no cubre una deuda completa, se registra como amortización parcial.
- Cada proveedor define su política de mora (monto fijo o porcentaje, días de gracia).
- El sistema calcula y registra moras por atraso en los pagos de deudas.

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


## 10. Eliminación de cuotas y financiamiento
- El sistema no contempla cuotas ni financiamiento. Todas las deudas generadas por ventas deben ser pagadas según el plazo definido por el proveedor.
- Se mantiene la trazabilidad de pagos y amortizaciones parciales sobre cada deuda.

## 11. Resumen de gestión de deudas y pagos
- **Deuda:** Se genera por cada venta que el PV debe rendir al proveedor. Puede ser pagada al contado o mediante amortizaciones parciales, pero no se fracciona en cuotas.
- **Pagos:** Pueden aplicarse a deudas completas o parciales. El sistema permite pagos parciales y totales, manteniendo la trazabilidad de todos los movimientos asociados a cada deuda.
- El sistema está preparado para gestionar pagos parciales, amortizaciones y la trazabilidad de todos los movimientos asociados a cada deuda.

## 12. Relación de usuarios (credenciales) con entidades
- Los usuarios (credenciales) no están relacionados directamente con proveedor, distribuidor o punto de venta mediante un campo FK en esas tablas.
- La relación se gestiona a través de la tabla `usuario_rol`, que vincula cada usuario con uno o varios roles y entidades (proveedor, distribuidor, punto de venta, etc.).
- Esto permite que un usuario tenga múltiples roles y pertenezca a varias entidades, y que una entidad tenga varios usuarios asociados.
- Ejemplo: Un usuario puede ser operador de un punto de venta y, a la vez, administrador de un proveedor, todo gestionado desde `usuario_rol`.
- Para saber los usuarios de una entidad, se consulta `usuario_rol` filtrando por el rol y el id_entidad correspondiente.
- Para saber a qué entidades tiene acceso un usuario, se consulta `usuario_rol` filtrando por el id_usuario.

> Este modelo permite máxima flexibilidad y escalabilidad en la gestión de credenciales y permisos.
