// ================================
// CONSTANTES DEL SISTEMA MULTISOAT
// ================================

// Estados de entidades (desde cat_estados_entidad)
export const ESTADOS_ENTIDAD = [
  "PENDIENTE_USUARIO",
  "ACTIVO", 
  "INACTIVO",
  "SUSPENDIDO",
  "BLOQUEADO",
  "CANCELADO"
] as const;

// Tipos de documento (desde cat_tipos_documento)
export const TIPOS_DOCUMENTO = [
  "DNI",
  "RUC", 
  "CE"
] as const;

// Estados de certificado (desde cat_estados_certificado)
export const ESTADOS_CERTIFICADO = [
  "DISPONIBLE",
  "ASIGNADO_DIST",
  "ASIGNADO_PV", 
  "VENDIDO",
  "ANULADO"
] as const;

// Estados de venta (desde cat_estados_venta)
export const ESTADOS_VENTA = [
  "PENDIENTE",
  "COMPLETADA",
  "ANULADA",
  "DEVUELTA",
  "FACTURADA"
] as const;

// Estados de deuda (desde cat_estados_deuda)
export const ESTADOS_DEUDA = [
  "PENDIENTE",
  "PARCIAL",
  "PAGADA",
  "VENCIDA",
  "MOROSA"
] as const;

// Estados de afiliación (desde cat_estados_afiliacion)
export const ESTADOS_AFILIACION = [
  "PENDIENTE_APROBACION",
  "ACTIVA",
  "INACTIVA", 
  "RECHAZADA",
  "SUSPENDIDA",
  "CANCELADA"
] as const;

// Tipos de pago (desde cat_tipos_pago)
export const TIPOS_PAGO = [
  "EFECTIVO",
  "TRANSFERENCIA",
  "DEPOSITO",
  "YAPE",
  "PLIN"
] as const;

// Roles del sistema (desde tabla rol)
export const ROLES_SISTEMA = {
  SISTEMA_ADMIN: "SISTEMA_ADMIN",
  
  // Roles Proveedor
  PROVEEDOR_ADMIN: "PROVEEDOR_ADMIN",
  PROVEEDOR_SUPERVISOR: "PROVEEDOR_SUPERVISOR", 
  PROVEEDOR_OPERADOR: "PROVEEDOR_OPERADOR",
  
  // Roles Distribuidor
  DISTRIBUIDOR_ADMIN: "DISTRIBUIDOR_ADMIN",
  DISTRIBUIDOR_SUPERVISOR: "DISTRIBUIDOR_SUPERVISOR",
  DISTRIBUIDOR_OPERADOR: "DISTRIBUIDOR_OPERADOR",
  
  // Roles Punto de Venta
  PUNTO_VENTA_ADMIN: "PUNTO_VENTA_ADMIN",
  PUNTO_VENTA_SUPERVISOR: "PUNTO_VENTA_SUPERVISOR",
  PUNTO_VENTA_OPERADOR: "PUNTO_VENTA_OPERADOR"
} as const;

// Mapeo de roles por defecto según tipo de entidad
export const ROLES_DEFAULT_POR_ENTIDAD = {
  proveedor: ROLES_SISTEMA.PROVEEDOR_ADMIN,
  distribuidor: ROLES_SISTEMA.DISTRIBUIDOR_ADMIN,
  punto_venta: ROLES_SISTEMA.PUNTO_VENTA_ADMIN
} as const;

// Tipos de entidad del sistema
export const TIPOS_ENTIDAD = [
  "proveedor",
  "distribuidor", 
  "punto_venta"
] as const;

// Estados de usuario
export const ESTADOS_USUARIO = [
  "ACTIVO",
  "INACTIVO",
  "PENDIENTE_USUARIO"
] as const;

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
} as const;

// Patrones de validación
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  TELEFONO: /^[\d\s\-\+\(\)]{7,15}$/,
  DNI: /^\d{8}$/,
  RUC: /^\d{11}$/,
  CE: /^[A-Z0-9]{9,12}$/
} as const;

// Mensajes de error estándar
export const ERROR_MESSAGES = {
  INVALID_EMAIL: "Email inválido",
  INVALID_PHONE: "Teléfono inválido", 
  INVALID_DOCUMENT: "Documento inválido",
  DUPLICATE_DOCUMENT: "Ya existe una entidad con este documento",
  DUPLICATE_EMAIL: "Ya existe un usuario con este email",
  ENTITY_NOT_FOUND: "Entidad no encontrada",
  USER_NOT_FOUND: "Usuario no encontrado",
  UNAUTHORIZED: "No autorizado",
  INVALID_STATE: "Estado inválido",
  REQUIRED_FIELD: "Campo requerido"
} as const;

// Tipos TypeScript para las constantes
export type EstadoEntidad = typeof ESTADOS_ENTIDAD[number];
export type TipoDocumento = typeof TIPOS_DOCUMENTO[number];
export type EstadoCertificado = typeof ESTADOS_CERTIFICADO[number];
export type EstadoVenta = typeof ESTADOS_VENTA[number];
export type EstadoDeuda = typeof ESTADOS_DEUDA[number];
export type EstadoAfiliacion = typeof ESTADOS_AFILIACION[number];
export type TipoPago = typeof TIPOS_PAGO[number];
export type RolSistema = typeof ROLES_SISTEMA[keyof typeof ROLES_SISTEMA];
export type TipoEntidad = typeof TIPOS_ENTIDAD[number];
export type EstadoUsuario = typeof ESTADOS_USUARIO[number];
