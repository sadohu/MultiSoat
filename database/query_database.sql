-- ================================
-- MULTISOAT DATABASE SCHEMA
-- Versión alineada con documentación
-- ================================

-- ================================
-- TABLAS DE CATÁLOGOS
-- ================================

-- 1. cat_tipos_documento
CREATE TABLE cat_tipos_documento (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  descripcion VARCHAR(100) NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID,
  updated_by UUID
);

-- 2. cat_tipos_pago
CREATE TABLE cat_tipos_pago (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  descripcion VARCHAR(100) NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID,
  updated_by UUID
);

-- 3. cat_estados_certificado
CREATE TABLE cat_estados_certificado (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  descripcion VARCHAR(100) NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID,
  updated_by UUID
);

-- 4. cat_estados_entidad
CREATE TABLE cat_estados_entidad (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  descripcion VARCHAR(100) NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID,
  updated_by UUID
);

-- 5. cat_estados_venta
CREATE TABLE cat_estados_venta (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  descripcion VARCHAR(100) NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID,
  updated_by UUID
);

-- 6. cat_estados_deuda
CREATE TABLE cat_estados_deuda (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  descripcion VARCHAR(100) NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID,
  updated_by UUID
);

-- 7. cat_estados_afiliacion
CREATE TABLE cat_estados_afiliacion (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  descripcion VARCHAR(100) NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID,
  updated_by UUID
);

-- 8. cat_tipos_mora
CREATE TABLE cat_tipos_mora (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  descripcion VARCHAR(100) NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID,
  updated_by UUID
);

-- 9. cat_motivos_visita
CREATE TABLE cat_motivos_visita (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(30) NOT NULL UNIQUE,
  descripcion VARCHAR(100) NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID,
  updated_by UUID
);

-- 10. cat_estados_visita
CREATE TABLE cat_estados_visita (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  descripcion VARCHAR(100) NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID,
  updated_by UUID
);

-- 11. cat_categorias_certificado
CREATE TABLE cat_categorias_certificado (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(30) NOT NULL UNIQUE,
  servicio VARCHAR(20) NOT NULL,
  categoria VARCHAR(10) NOT NULL,
  clase VARCHAR(100) NOT NULL,
  descripcion VARCHAR(200) NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID,
  updated_by UUID
);

-- 12. cat_tipos_descuento
CREATE TABLE cat_tipos_descuento (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  descripcion VARCHAR(100) NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID,
  updated_by UUID
);

-- ================================
-- GESTIÓN DE USUARIOS Y ROLES
-- ================================

-- 13. usuario (Complementa Supabase Auth)
CREATE TABLE usuario (
  id SERIAL PRIMARY KEY,
  id_supabase UUID NOT NULL UNIQUE, -- Referencia a auth.users.id de Supabase
  nombre VARCHAR(100),
  tipo_documento VARCHAR(10),
  numero_documento VARCHAR(20),
  email VARCHAR(100) NOT NULL,
  telefono VARCHAR(20),
  estado VARCHAR(20) DEFAULT 'activo',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID,
  updated_by UUID
);

-- 14. rol
CREATE TABLE rol (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(30) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  nivel_jerarquico INTEGER NOT NULL, -- 1=sistema, 2=proveedor, 3=distribuidor, 4=punto_venta
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID,
  updated_by UUID
);

-- 15. permiso
CREATE TABLE permiso (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(50) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  modulo VARCHAR(50),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID,
  updated_by UUID
);

-- 16. rol_permiso
CREATE TABLE rol_permiso (
  id SERIAL PRIMARY KEY,
  id_rol INTEGER REFERENCES rol(id),
  id_permiso INTEGER REFERENCES permiso(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID,
  updated_by UUID,
  UNIQUE(id_rol, id_permiso)
);

-- 17. usuario_rol
CREATE TABLE usuario_rol (
  id SERIAL PRIMARY KEY,
  id_usuario INTEGER REFERENCES usuario(id),
  id_rol INTEGER REFERENCES rol(id),
  id_entidad INTEGER, -- ID de proveedor/distribuidor/punto_venta según el rol
  tipo_entidad VARCHAR(20), -- 'proveedor', 'distribuidor', 'punto_venta'
  fecha_asignacion TIMESTAMP DEFAULT NOW(),
  fecha_expiracion TIMESTAMP,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID,
  updated_by UUID
);

-- ================================
-- ENTIDADES PRINCIPALES
-- ================================

-- ================================
-- ENTIDADES PRINCIPALES
-- ================================

-- 18. proveedor
CREATE TABLE proveedor (
  id SERIAL PRIMARY KEY,
  tipo_documento VARCHAR(10) NOT NULL REFERENCES cat_tipos_documento(codigo),
  numero_documento VARCHAR(20) NOT NULL UNIQUE,
  razon_social VARCHAR(150),
  nombre VARCHAR(100),
  direccion VARCHAR(200),
  telefono VARCHAR(20),
  email VARCHAR(100) NOT NULL,
  id_externo_db_data VARCHAR(50),
  estado VARCHAR(20) DEFAULT 'pendiente_usuario' REFERENCES cat_estados_entidad(codigo),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID REFERENCES usuario(id_supabase),
  updated_by UUID REFERENCES usuario(id_supabase)
);

-- 19. distribuidor
CREATE TABLE distribuidor (
  id SERIAL PRIMARY KEY,
  id_proveedor INTEGER NOT NULL REFERENCES proveedor(id),
  nombre VARCHAR(100),
  telefono VARCHAR(20),
  email VARCHAR(100) NOT NULL,
  id_externo_db_data VARCHAR(50),
  estado VARCHAR(20) DEFAULT 'pendiente_usuario' REFERENCES cat_estados_entidad(codigo),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID REFERENCES usuario(id_supabase),
  updated_by UUID REFERENCES usuario(id_supabase)
);

-- 20. punto_venta
CREATE TABLE punto_venta (
  id SERIAL PRIMARY KEY,
  tipo_documento VARCHAR(10) NOT NULL REFERENCES cat_tipos_documento(codigo),
  numero_documento VARCHAR(20) NOT NULL UNIQUE,
  nombre VARCHAR(100),
  direccion VARCHAR(200),
  telefono VARCHAR(20),
  email VARCHAR(100) NOT NULL,
  id_externo_db_data VARCHAR(50),
  estado VARCHAR(20) DEFAULT 'pendiente_usuario' REFERENCES cat_estados_entidad(codigo),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID REFERENCES usuario(id_supabase),
  updated_by UUID REFERENCES usuario(id_supabase)
);

-- 21. afiliacion_pv_proveedor
CREATE TABLE afiliacion_pv_proveedor (
  id SERIAL PRIMARY KEY,
  id_proveedor INTEGER NOT NULL REFERENCES proveedor(id),
  id_distribuidor INTEGER REFERENCES distribuidor(id),
  id_punto_venta INTEGER NOT NULL REFERENCES punto_venta(id),
  estado VARCHAR(20) DEFAULT 'pendiente_aprobacion' REFERENCES cat_estados_afiliacion(codigo),
  fecha_aprobacion TIMESTAMP,
  usuario_aprobador UUID REFERENCES usuario(id_supabase),
  observaciones TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID REFERENCES usuario(id_supabase),
  updated_by UUID REFERENCES usuario(id_supabase),
  UNIQUE(id_proveedor, id_punto_venta)
);

-- 22. zona
CREATE TABLE zona (
  id SERIAL PRIMARY KEY,
  id_proveedor INTEGER NOT NULL REFERENCES proveedor(id),
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  estado VARCHAR(20) DEFAULT 'activo' REFERENCES cat_estados_entidad(codigo),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID REFERENCES usuario(id_supabase),
  updated_by UUID REFERENCES usuario(id_supabase)
);

-- 23. zona_punto_venta
CREATE TABLE zona_punto_venta (
  id SERIAL PRIMARY KEY,
  id_zona INTEGER NOT NULL REFERENCES zona(id),
  id_punto_venta INTEGER NOT NULL REFERENCES punto_venta(id),
  fecha_asignacion TIMESTAMP DEFAULT NOW(),
  fecha_desasignacion TIMESTAMP,
  estado VARCHAR(20) DEFAULT 'activo',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID REFERENCES usuario(id_supabase),
  updated_by UUID REFERENCES usuario(id_supabase),
  UNIQUE(id_zona, id_punto_venta)
);

-- ================================
-- GESTIÓN DE CERTIFICADOS
-- ================================

-- 24. certificado
CREATE TABLE certificado (
  id SERIAL PRIMARY KEY,
  id_proveedor INTEGER NOT NULL REFERENCES proveedor(id),
  numero_serie VARCHAR(50) NOT NULL UNIQUE,
  categoria VARCHAR(30) REFERENCES cat_categorias_certificado(codigo),
  foto_url VARCHAR(200),
  datos_vehiculo_externo VARCHAR(50),
  estado VARCHAR(20) DEFAULT 'disponible' REFERENCES cat_estados_certificado(codigo),
  fecha_registro TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID REFERENCES usuario(id_supabase),
  updated_by UUID REFERENCES usuario(id_supabase)
);

-- 25. asignacion_certificado
CREATE TABLE asignacion_certificado (
  id SERIAL PRIMARY KEY,
  id_certificado INTEGER NOT NULL REFERENCES certificado(id),
  id_distribuidor INTEGER REFERENCES distribuidor(id),
  id_punto_venta INTEGER REFERENCES punto_venta(id),
  tipo_asignacion VARCHAR(20) NOT NULL, -- 'distribuidor' o 'punto_venta'
  fecha_asignacion TIMESTAMP DEFAULT NOW(),
  usuario_asignacion UUID REFERENCES usuario(id_supabase),
  estado VARCHAR(20) DEFAULT 'activo',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID REFERENCES usuario(id_supabase),
  updated_by UUID REFERENCES usuario(id_supabase)
);

-- ================================
-- GESTIÓN DE VENTAS
-- ================================

-- ================================
-- GESTIÓN DE VENTAS
-- ================================

-- 26. venta
CREATE TABLE venta (
  id SERIAL PRIMARY KEY,
  id_punto_venta INTEGER NOT NULL REFERENCES punto_venta(id),
  fecha_venta TIMESTAMP DEFAULT NOW(),
  precio_total DECIMAL(12,2) NOT NULL,
  id_cliente_externo VARCHAR(50),
  observaciones TEXT,
  estado VARCHAR(20) DEFAULT 'completada' REFERENCES cat_estados_venta(codigo),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID REFERENCES usuario(id_supabase),
  updated_by UUID REFERENCES usuario(id_supabase)
);

-- 27. venta_certificado
CREATE TABLE venta_certificado (
  id SERIAL PRIMARY KEY,
  id_venta INTEGER NOT NULL REFERENCES venta(id),
  id_certificado INTEGER NOT NULL REFERENCES certificado(id),
  precio_venta DECIMAL(12,2) NOT NULL,
  monto_fijo_proveedor DECIMAL(12,2),
  descuento_aplicado DECIMAL(12,2) DEFAULT 0,
  ganancia_pv DECIMAL(12,2),
  estado VARCHAR(20) DEFAULT 'vendido',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID REFERENCES usuario(id_supabase),
  updated_by UUID REFERENCES usuario(id_supabase),
  UNIQUE(id_certificado) -- Un certificado solo puede venderse una vez
);

-- ================================
-- GESTIÓN DE DESCUENTOS
-- ================================

-- 28. descuento_pv
CREATE TABLE descuento_pv (
  id SERIAL PRIMARY KEY,
  id_proveedor INTEGER NOT NULL REFERENCES proveedor(id),
  id_punto_venta INTEGER NOT NULL REFERENCES punto_venta(id),
  tipo_descuento VARCHAR(20) REFERENCES cat_tipos_descuento(codigo),
  porcentaje DECIMAL(5,2),
  monto_fijo DECIMAL(12,2),
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID REFERENCES usuario(id_supabase),
  updated_by UUID REFERENCES usuario(id_supabase)
);

-- ================================
-- GESTIÓN FINANCIERA
-- ================================

-- 29. credito
CREATE TABLE credito (
  id SERIAL PRIMARY KEY,
  id_punto_venta INTEGER NOT NULL REFERENCES punto_venta(id),
  id_proveedor INTEGER NOT NULL REFERENCES proveedor(id),
  limite_credito DECIMAL(12,2) NOT NULL,
  saldo_actual DECIMAL(12,2) DEFAULT 0,
  fecha_otorgamiento DATE DEFAULT CURRENT_DATE,
  fecha_vencimiento DATE,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID REFERENCES usuario(id_supabase),
  updated_by UUID REFERENCES usuario(id_supabase),
  UNIQUE(id_punto_venta, id_proveedor)
);

-- 30. deuda
CREATE TABLE deuda (
  id SERIAL PRIMARY KEY,
  id_venta INTEGER NOT NULL REFERENCES venta(id),
  id_punto_venta INTEGER NOT NULL REFERENCES punto_venta(id),
  id_proveedor INTEGER NOT NULL REFERENCES proveedor(id),
  monto_original DECIMAL(12,2) NOT NULL,
  monto_pendiente DECIMAL(12,2) NOT NULL,
  fecha_vencimiento DATE NOT NULL,
  estado VARCHAR(20) DEFAULT 'pendiente' REFERENCES cat_estados_deuda(codigo),
  mora_acumulada DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID REFERENCES usuario(id_supabase),
  updated_by UUID REFERENCES usuario(id_supabase)
);

-- 31. pago
CREATE TABLE pago (
  id SERIAL PRIMARY KEY,
  id_punto_venta INTEGER NOT NULL REFERENCES punto_venta(id),
  id_proveedor INTEGER NOT NULL REFERENCES proveedor(id),
  monto DECIMAL(12,2) NOT NULL,
  fecha_pago TIMESTAMP DEFAULT NOW(),
  tipo_pago VARCHAR(20) REFERENCES cat_tipos_pago(codigo),
  numero_operacion VARCHAR(100),
  observaciones TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID REFERENCES usuario(id_supabase),
  updated_by UUID REFERENCES usuario(id_supabase)
);

-- 32. pago_deuda
CREATE TABLE pago_deuda (
  id SERIAL PRIMARY KEY,
  id_pago INTEGER NOT NULL REFERENCES pago(id),
  id_deuda INTEGER NOT NULL REFERENCES deuda(id),
  monto_aplicado DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID REFERENCES usuario(id_supabase),
  updated_by UUID REFERENCES usuario(id_supabase)
);

-- 33. politica_mora
CREATE TABLE politica_mora (
  id SERIAL PRIMARY KEY,
  id_proveedor INTEGER NOT NULL REFERENCES proveedor(id),
  tipo_mora VARCHAR(20) REFERENCES cat_tipos_mora(codigo),
  valor DECIMAL(8,2) NOT NULL,
  dias_gracia INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID REFERENCES usuario(id_supabase),
  updated_by UUID REFERENCES usuario(id_supabase)
);

-- ================================
-- GESTIÓN DE VISITAS
-- ================================

-- 34. visita
CREATE TABLE visita (
  id SERIAL PRIMARY KEY,
  id_proveedor INTEGER REFERENCES proveedor(id),
  id_distribuidor INTEGER REFERENCES distribuidor(id),
  id_punto_venta INTEGER REFERENCES punto_venta(id),
  fecha_programada TIMESTAMP,
  fecha_realizada TIMESTAMP,
  motivo VARCHAR(30) REFERENCES cat_motivos_visita(codigo),
  estado VARCHAR(20) REFERENCES cat_estados_visita(codigo),
  observaciones TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID REFERENCES usuario(id_supabase),
  updated_by UUID REFERENCES usuario(id_supabase)
);

-- ================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ================================

-- Índices para búsquedas frecuentes
CREATE INDEX idx_proveedor_documento ON proveedor(tipo_documento, numero_documento);
CREATE INDEX idx_punto_venta_documento ON punto_venta(tipo_documento, numero_documento);
CREATE INDEX idx_certificado_serie ON certificado(numero_serie);
CREATE INDEX idx_certificado_estado ON certificado(estado);
CREATE INDEX idx_venta_fecha ON venta(fecha_venta);
CREATE INDEX idx_deuda_vencimiento ON deuda(fecha_vencimiento);
CREATE INDEX idx_deuda_estado ON deuda(estado);
CREATE INDEX idx_usuario_supabase ON usuario(id_supabase);
CREATE INDEX idx_usuario_rol_entidad ON usuario_rol(id_entidad, tipo_entidad);

-- Índices para auditoría
CREATE INDEX idx_created_by ON proveedor(created_by);
CREATE INDEX idx_created_at ON venta(created_at);

-- ================================
-- COMENTARIOS ADICIONALES
-- ================================

-- COMMENT ON TABLE usuario IS 'Tabla complementaria a Supabase Auth para datos de negocio';
-- COMMENT ON COLUMN usuario.id_supabase IS 'Referencia al auth.users.id de Supabase';
-- COMMENT ON TABLE certificado IS 'Inventario de certificados por proveedor';
-- COMMENT ON TABLE asignacion_certificado IS 'Trazabilidad de asignaciones de certificados';
-- COMMENT ON TABLE afiliacion_pv_proveedor IS 'Relación entre puntos de venta y proveedores con estados';
-- COMMENT ON TABLE pago_deuda IS 'Aplicación de pagos a deudas específicas';

-- ================================
-- DATOS INICIALES DE CATÁLOGOS
-- ================================

-- Insertar tipos de documento
INSERT INTO cat_tipos_documento (codigo, descripcion) VALUES 
('DNI', 'Documento Nacional de Identidad'),
('RUC', 'Registro Único de Contribuyentes'),
('CE', 'Carné de Extranjería'),
('PASSPORT', 'Pasaporte');

-- Insertar tipos de pago
INSERT INTO cat_tipos_pago (codigo, descripcion) VALUES 
('EFECTIVO', 'Pago en efectivo'),
('TRANSFERENCIA', 'Transferencia bancaria'),
('DEPOSITO', 'Depósito bancario'),
-- ('CHEQUE', 'Pago con cheque'),
('YAPE', 'Pago por Yape'),
('PLIN', 'Pago por Plin');
-- ('BCP', 'Transferencia BCP'),
-- ('BBVA', 'Transferencia BBVA'),
-- ('INTERBANK', 'Transferencia Interbank'),
-- ('SCOTIABANK', 'Transferencia Scotiabank');

-- Insertar estados de certificado
INSERT INTO cat_estados_certificado (codigo, descripcion) VALUES 
('DISPONIBLE', 'Certificado disponible para asignar'),
('ASIGNADO_DIST', 'Asignado a distribuidor'),
('ASIGNADO_PV', 'Asignado a punto de venta'),
('VENDIDO', 'Certificado vendido'),
('ANULADO', 'Certificado anulado');
-- ('VENCIDO', 'Certificado vencido');
-- ('BLOQUEADO', 'Certificado bloqueado');

-- Insertar estados de entidad
INSERT INTO cat_estados_entidad (codigo, descripcion) VALUES 
('PENDIENTE_USUARIO', 'Entidad registrada, pendiente de usuario'),
('ACTIVO', 'Entidad activa y operativa'),
('INACTIVO', 'Entidad inactiva temporalmente'),
('SUSPENDIDO', 'Entidad suspendida por incumplimiento'),
('BLOQUEADO', 'Entidad bloqueada por administración'),
('CANCELADO', 'Entidad cancelada definitivamente');

-- Insertar estados de venta
INSERT INTO cat_estados_venta (codigo, descripcion) VALUES 
('PENDIENTE', 'Venta pendiente de confirmación'),
('COMPLETADA', 'Venta completada exitosamente'),
('ANULADA', 'Venta anulada'),
('DEVUELTA', 'Venta devuelta'),
('FACTURADA', 'Venta facturada');

-- Insertar estados de deuda
INSERT INTO cat_estados_deuda (codigo, descripcion) VALUES 
('PENDIENTE', 'Deuda pendiente de pago'),
('PARCIAL', 'Deuda con pago parcial'),
('PAGADA', 'Deuda completamente pagada'),
('VENCIDA', 'Deuda vencida'),
('MOROSA', 'Deuda en mora');
-- ('CONDONADA', 'Deuda condonada'),
-- ('CASTIGADA', 'Deuda castigada');

-- Insertar estados de afiliación
INSERT INTO cat_estados_afiliacion (codigo, descripcion) VALUES 
('PENDIENTE_APROBACION', 'Afiliación pendiente de aprobación'),
('ACTIVA', 'Afiliación activa y operativa'),
('INACTIVA', 'Afiliación inactiva temporalmente'),
('RECHAZADA', 'Afiliación rechazada'),
('SUSPENDIDA', 'Afiliación suspendida'),
('CANCELADA', 'Afiliación cancelada');

-- Insertar tipos de mora
INSERT INTO cat_tipos_mora (codigo, descripcion) VALUES 
('PORCENTUAL', 'Mora por porcentaje'),
('FIJO_DIARIO', 'Mora fija por día'),
('FIJO_MENSUAL', 'Mora fija por mes'),
('ESCALONADO', 'Mora escalonada por tiempo');

-- Insertar motivos de visita
INSERT INTO cat_motivos_visita (codigo, descripcion) VALUES 
('SUPERVISION', 'Visita de supervisión rutinaria'),
('CAPACITACION', 'Visita para capacitación'),
('AUDITORIA', 'Visita de auditoría'),
('COBRANZA', 'Visita para gestión de cobranza'),
('SOPORTE_TECNICO', 'Visita de soporte técnico'),
('ENTREGA_CERTIFICADOS', 'Entrega de certificados'),
('RESOLUCION_PROBLEMAS', 'Resolución de problemas'),
('SEGUIMIENTO_VENTAS', 'Seguimiento de ventas'),
('VERIFICACION', 'Verificación de documentos'),
('COMERCIAL', 'Visita comercial');

-- Insertar estados de visita
INSERT INTO cat_estados_visita (codigo, descripcion) VALUES 
('PROGRAMADA', 'Visita programada'),
('EN_CURSO', 'Visita en curso'),
('COMPLETADA', 'Visita completada'),
('CANCELADA', 'Visita cancelada'),
('REPROGRAMADA', 'Visita reprogramada'),
('NO_REALIZADA', 'Visita no realizada');

-- Insertar categorías de certificado
INSERT INTO cat_categorias_certificado (codigo, servicio, categoria, clase, descripcion) VALUES 
-- Servicio Público
('PUB_L5_MOTOTAXI', 'PUBLICO', 'L5', 'Mototaxi', 'Seguro para servicio público - Categoría L5 - Mototaxi'),

-- Servicio Taxi
('TAXI_M1_AUTO', 'TAXI', 'M1', 'Automovil', 'Seguro para servicio taxi - Categoría M1 - Automóvil'),
('TAXI_M1_STATION', 'TAXI', 'M1', 'Station Wagon', 'Seguro para servicio taxi - Categoría M1 - Station Wagon'),
('TAXI_M1_CAM_7', 'TAXI', 'M1', 'Camioneta Rural (hasta 7 Asientos)', 'Seguro para servicio taxi - Categoría M1 - Camioneta Rural hasta 7 asientos'),
('TAXI_M1_CAM_89', 'TAXI', 'M1', 'Camioneta Rural (8 y 9 Asientos)', 'Seguro para servicio taxi - Categoría M1 - Camioneta Rural 8 y 9 asientos'),

-- Servicio Urbano
('URB_M2_CAM_RURAL', 'URBANO', 'M2', 'Camioneta Rural', 'Seguro para servicio urbano - Categoría M2 - Camioneta Rural'),
('URB_M3_OMNIBUS', 'URBANO', 'M3', 'Omnibus', 'Seguro para servicio urbano - Categoría M3 - Omnibus'),
('URB_M3_MICROBUS', 'URBANO', 'M3', 'MicroBus', 'Seguro para servicio urbano - Categoría M3 - MicroBus'),

-- Servicio Turismo
('TUR_M2_CAM_RURAL', 'TURISMO', 'M2', 'Camioneta Rural', 'Seguro para servicio turismo - Categoría M2 - Camioneta Rural'),
('TUR_M3_OMNIBUS', 'TURISMO', 'M3', 'Omnibus', 'Seguro para servicio turismo - Categoría M3 - Omnibus'),
('TUR_M3_MICROBUS', 'TURISMO', 'M3', 'MicroBus', 'Seguro para servicio turismo - Categoría M3 - MicroBus'),

-- Servicio Escolar
('ESC_M2_CAM_RURAL', 'ESCOLAR', 'M2', 'Camioneta Rural', 'Seguro para servicio escolar - Categoría M2 - Camioneta Rural'),
('ESC_M3_OMNIBUS', 'ESCOLAR', 'M3', 'Omnibus', 'Seguro para servicio escolar - Categoría M3 - Omnibus'),
('ESC_M3_MICROBUS', 'ESCOLAR', 'M3', 'MicroBus', 'Seguro para servicio escolar - Categoría M3 - MicroBus');

-- Insertar tipos de descuento
INSERT INTO cat_tipos_descuento (codigo, descripcion) VALUES 
('PORCENTUAL', 'Descuento por porcentaje'),
('MONTO_FIJO', 'Descuento de monto fijo'),
('PROMOCIONAL', 'Descuento promocional'),
('VOLUMEN', 'Descuento por volumen'),
('FIDELIDAD', 'Descuento por fidelidad'),
('TEMPORAL', 'Descuento temporal'),
('PRIMERA_COMPRA', 'Descuento primera compra');

-- ================================
-- DATOS INICIALES DE ROLES
-- ================================

-- Insertar roles del sistema
INSERT INTO rol (codigo, nombre, descripcion, nivel_jerarquico) VALUES 
-- Nivel Sistema (1)
('SISTEMA_ADMIN', 'Administrador del Sistema', 'Acceso completo a todo el sistema', 1),

-- Nivel Proveedor (2)
('PROVEEDOR_ADMIN', 'Administrador de Proveedor', 'Gestión completa del proveedor y sus distribuidores', 2),
('PROVEEDOR_SUPERVISOR', 'Supervisor de Proveedor', 'Supervisión operativa del proveedor', 2),
('PROVEEDOR_OPERADOR', 'Operador de Proveedor', 'Operaciones básicas del proveedor', 2),

-- Nivel Distribuidor (3)
('DISTRIBUIDOR_ADMIN', 'Administrador de Distribuidor', 'Gestión completa del distribuidor y puntos de venta', 3),
('DISTRIBUIDOR_SUPERVISOR', 'Supervisor de Distribuidor', 'Supervisión operativa del distribuidor', 3),
('DISTRIBUIDOR_OPERADOR', 'Operador de Distribuidor', 'Operaciones básicas del distribuidor', 3),

-- Nivel Punto de Venta (4)
('PUNTO_VENTA_ADMIN', 'Administrador de Punto de Venta', 'Gestión completa del punto de venta', 4),
('PUNTO_VENTA_SUPERVISOR', 'Supervisor de Punto de Venta', 'Supervisión de ventas del punto de venta', 4),
('PUNTO_VENTA_OPERADOR', 'Operador de Punto de Venta', 'Ventas y operaciones básicas', 4);

-- ================================
-- DATOS INICIALES DE PERMISOS
-- ================================

-- Insertar permisos básicos por módulo
INSERT INTO permiso (codigo, nombre, descripcion, modulo) VALUES 
-- Módulo Usuarios
('USUARIO_CREAR', 'Crear Usuario', 'Permiso para crear nuevos usuarios', 'USUARIOS'),
('USUARIO_LEER', 'Leer Usuario', 'Permiso para consultar usuarios', 'USUARIOS'),
('USUARIO_EDITAR', 'Editar Usuario', 'Permiso para modificar usuarios', 'USUARIOS'),
('USUARIO_ELIMINAR', 'Eliminar Usuario', 'Permiso para eliminar usuarios', 'USUARIOS'),

-- Módulo Proveedores
('PROVEEDOR_CREAR', 'Crear Proveedor', 'Permiso para registrar proveedores', 'PROVEEDORES'),
('PROVEEDOR_LEER', 'Leer Proveedor', 'Permiso para consultar proveedores', 'PROVEEDORES'),
('PROVEEDOR_EDITAR', 'Editar Proveedor', 'Permiso para modificar proveedores', 'PROVEEDORES'),
('PROVEEDOR_ELIMINAR', 'Eliminar Proveedor', 'Permiso para eliminar proveedores', 'PROVEEDORES'),

-- Módulo Distribuidores
('DISTRIBUIDOR_CREAR', 'Crear Distribuidor', 'Permiso para registrar distribuidores', 'DISTRIBUIDORES'),
('DISTRIBUIDOR_LEER', 'Leer Distribuidor', 'Permiso para consultar distribuidores', 'DISTRIBUIDORES'),
('DISTRIBUIDOR_EDITAR', 'Editar Distribuidor', 'Permiso para modificar distribuidores', 'DISTRIBUIDORES'),
('DISTRIBUIDOR_ELIMINAR', 'Eliminar Distribuidor', 'Permiso para eliminar distribuidores', 'DISTRIBUIDORES'),

-- Módulo Puntos de Venta
('PUNTO_VENTA_CREAR', 'Crear Punto de Venta', 'Permiso para registrar puntos de venta', 'PUNTOS_VENTA'),
('PUNTO_VENTA_LEER', 'Leer Punto de Venta', 'Permiso para consultar puntos de venta', 'PUNTOS_VENTA'),
('PUNTO_VENTA_EDITAR', 'Editar Punto de Venta', 'Permiso para modificar puntos de venta', 'PUNTOS_VENTA'),
('PUNTO_VENTA_ELIMINAR', 'Eliminar Punto de Venta', 'Permiso para eliminar puntos de venta', 'PUNTOS_VENTA'),

-- Módulo Certificados
('CERTIFICADO_CREAR', 'Crear Certificado', 'Permiso para registrar certificados', 'CERTIFICADOS'),
('CERTIFICADO_LEER', 'Leer Certificado', 'Permiso para consultar certificados', 'CERTIFICADOS'),
('CERTIFICADO_EDITAR', 'Editar Certificado', 'Permiso para modificar certificados', 'CERTIFICADOS'),
('CERTIFICADO_ASIGNAR', 'Asignar Certificado', 'Permiso para asignar certificados', 'CERTIFICADOS'),

-- Módulo Ventas
('VENTA_CREAR', 'Crear Venta', 'Permiso para registrar ventas', 'VENTAS'),
('VENTA_LEER', 'Leer Venta', 'Permiso para consultar ventas', 'VENTAS'),
('VENTA_EDITAR', 'Editar Venta', 'Permiso para modificar ventas', 'VENTAS'),
('VENTA_ANULAR', 'Anular Venta', 'Permiso para anular ventas', 'VENTAS'),

-- Módulo Financiero
('PAGO_CREAR', 'Crear Pago', 'Permiso para registrar pagos', 'FINANCIERO'),
('PAGO_LEER', 'Leer Pago', 'Permiso para consultar pagos', 'FINANCIERO'),
('DEUDA_LEER', 'Leer Deuda', 'Permiso para consultar deudas', 'FINANCIERO'),
('CREDITO_GESTIONAR', 'Gestionar Crédito', 'Permiso para gestionar créditos', 'FINANCIERO'),

-- Módulo Reportes
('REPORTE_VENTAS', 'Reportes de Ventas', 'Acceso a reportes de ventas', 'REPORTES'),
('REPORTE_FINANCIERO', 'Reportes Financieros', 'Acceso a reportes financieros', 'REPORTES'),
('REPORTE_AUDITORIA', 'Reportes de Auditoría', 'Acceso a reportes de auditoría', 'REPORTES'),

-- Módulo Configuración
('CONFIG_CATALOGOS', 'Configurar Catálogos', 'Permiso para gestionar catálogos', 'CONFIGURACION'),
('CONFIG_SISTEMA', 'Configurar Sistema', 'Permiso para configuración general', 'CONFIGURACION');

-- ================================
-- ASIGNACIÓN DE PERMISOS A ROLES
-- ================================

-- SISTEMA_ADMIN: Todos los permisos
INSERT INTO rol_permiso (id_rol, id_permiso) 
SELECT r.id, p.id 
FROM rol r, permiso p 
WHERE r.codigo = 'SISTEMA_ADMIN';

-- PROVEEDOR_ADMIN: Gestión completa de su nivel y subordinados
INSERT INTO rol_permiso (id_rol, id_permiso) 
SELECT r.id, p.id 
FROM rol r, permiso p 
WHERE r.codigo = 'PROVEEDOR_ADMIN' 
AND p.codigo IN (
  'USUARIO_CREAR', 'USUARIO_LEER', 'USUARIO_EDITAR',
  'PROVEEDOR_LEER', 'PROVEEDOR_EDITAR',
  'DISTRIBUIDOR_CREAR', 'DISTRIBUIDOR_LEER', 'DISTRIBUIDOR_EDITAR', 'DISTRIBUIDOR_ELIMINAR',
  'PUNTO_VENTA_CREAR', 'PUNTO_VENTA_LEER', 'PUNTO_VENTA_EDITAR', 'PUNTO_VENTA_ELIMINAR',
  'CERTIFICADO_CREAR', 'CERTIFICADO_LEER', 'CERTIFICADO_EDITAR', 'CERTIFICADO_ASIGNAR',
  'VENTA_LEER', 'PAGO_LEER', 'DEUDA_LEER', 'CREDITO_GESTIONAR',
  'REPORTE_VENTAS', 'REPORTE_FINANCIERO', 'REPORTE_AUDITORIA'
);

-- PROVEEDOR_SUPERVISOR: Supervisión y reportes
INSERT INTO rol_permiso (id_rol, id_permiso) 
SELECT r.id, p.id 
FROM rol r, permiso p 
WHERE r.codigo = 'PROVEEDOR_SUPERVISOR' 
AND p.codigo IN (
  'USUARIO_LEER',
  'PROVEEDOR_LEER',
  'DISTRIBUIDOR_LEER', 'DISTRIBUIDOR_EDITAR',
  'PUNTO_VENTA_LEER', 'PUNTO_VENTA_EDITAR',
  'CERTIFICADO_LEER', 'CERTIFICADO_ASIGNAR',
  'VENTA_LEER', 'PAGO_LEER', 'DEUDA_LEER',
  'REPORTE_VENTAS', 'REPORTE_FINANCIERO'
);

-- PROVEEDOR_OPERADOR: Operaciones básicas
INSERT INTO rol_permiso (id_rol, id_permiso) 
SELECT r.id, p.id 
FROM rol r, permiso p 
WHERE r.codigo = 'PROVEEDOR_OPERADOR' 
AND p.codigo IN (
  'PROVEEDOR_LEER',
  'DISTRIBUIDOR_LEER',
  'PUNTO_VENTA_LEER',
  'CERTIFICADO_LEER', 'CERTIFICADO_CREAR',
  'VENTA_LEER', 'PAGO_LEER',
  'REPORTE_VENTAS'
);

-- DISTRIBUIDOR_ADMIN: Gestión de su distribuidor y puntos de venta
INSERT INTO rol_permiso (id_rol, id_permiso) 
SELECT r.id, p.id 
FROM rol r, permiso p 
WHERE r.codigo = 'DISTRIBUIDOR_ADMIN' 
AND p.codigo IN (
  'USUARIO_CREAR', 'USUARIO_LEER', 'USUARIO_EDITAR',
  'DISTRIBUIDOR_LEER', 'DISTRIBUIDOR_EDITAR',
  'PUNTO_VENTA_CREAR', 'PUNTO_VENTA_LEER', 'PUNTO_VENTA_EDITAR',
  'CERTIFICADO_LEER', 'CERTIFICADO_ASIGNAR',
  'VENTA_LEER', 'PAGO_LEER', 'DEUDA_LEER',
  'REPORTE_VENTAS', 'REPORTE_FINANCIERO'
);

-- DISTRIBUIDOR_SUPERVISOR: Supervisión operativa
INSERT INTO rol_permiso (id_rol, id_permiso) 
SELECT r.id, p.id 
FROM rol r, permiso p 
WHERE r.codigo = 'DISTRIBUIDOR_SUPERVISOR' 
AND p.codigo IN (
  'USUARIO_LEER',
  'DISTRIBUIDOR_LEER',
  'PUNTO_VENTA_LEER', 'PUNTO_VENTA_EDITAR',
  'CERTIFICADO_LEER', 'CERTIFICADO_ASIGNAR',
  'VENTA_LEER', 'PAGO_LEER', 'DEUDA_LEER',
  'REPORTE_VENTAS'
);

-- DISTRIBUIDOR_OPERADOR: Operaciones básicas
INSERT INTO rol_permiso (id_rol, id_permiso) 
SELECT r.id, p.id 
FROM rol r, permiso p 
WHERE r.codigo = 'DISTRIBUIDOR_OPERADOR' 
AND p.codigo IN (
  'DISTRIBUIDOR_LEER',
  'PUNTO_VENTA_LEER',
  'CERTIFICADO_LEER',
  'VENTA_LEER', 'PAGO_LEER',
  'REPORTE_VENTAS'
);

-- PUNTO_VENTA_ADMIN: Gestión completa del punto de venta
INSERT INTO rol_permiso (id_rol, id_permiso) 
SELECT r.id, p.id 
FROM rol r, permiso p 
WHERE r.codigo = 'PUNTO_VENTA_ADMIN' 
AND p.codigo IN (
  'USUARIO_LEER', 'USUARIO_EDITAR',
  'PUNTO_VENTA_LEER', 'PUNTO_VENTA_EDITAR',
  'CERTIFICADO_LEER',
  'VENTA_CREAR', 'VENTA_LEER', 'VENTA_EDITAR', 'VENTA_ANULAR',
  'PAGO_CREAR', 'PAGO_LEER', 'DEUDA_LEER',
  'REPORTE_VENTAS'
);

-- PUNTO_VENTA_SUPERVISOR: Supervisión de ventas
INSERT INTO rol_permiso (id_rol, id_permiso) 
SELECT r.id, p.id 
FROM rol r, permiso p 
WHERE r.codigo = 'PUNTO_VENTA_SUPERVISOR' 
AND p.codigo IN (
  'PUNTO_VENTA_LEER',
  'CERTIFICADO_LEER',
  'VENTA_CREAR', 'VENTA_LEER', 'VENTA_EDITAR',
  'PAGO_LEER', 'DEUDA_LEER',
  'REPORTE_VENTAS'
);

-- PUNTO_VENTA_OPERADOR: Ventas y operaciones básicas
INSERT INTO rol_permiso (id_rol, id_permiso) 
SELECT r.id, p.id 
FROM rol r, permiso p 
WHERE r.codigo = 'PUNTO_VENTA_OPERADOR' 
AND p.codigo IN (
  'PUNTO_VENTA_LEER',
  'CERTIFICADO_LEER',
  'VENTA_CREAR', 'VENTA_LEER',
  'PAGO_LEER'
);

-- ================================
-- USUARIO ADMINISTRADOR INICIAL
-- ================================

-- Nota: Este usuario debe crearse después de tener un usuario real en Supabase Auth
-- INSERT INTO usuario (id_supabase, nombre, email, estado) VALUES 
-- ('system-admin-uuid', 'Administrador del Sistema', 'admin@multisoat.com', 'activo');

-- Asignar rol de sistema admin al usuario inicial
-- INSERT INTO usuario_rol (id_usuario, id_rol, tipo_entidad, activo) 
-- SELECT u.id, r.id, 'sistema', true
-- FROM usuario u, rol r 
-- WHERE u.email = 'admin@multisoat.com' AND r.codigo = 'SISTEMA_ADMIN';

-- ================================
-- SCRIPTS DE VALIDACIÓN
-- ================================

-- Verificar que todos los catálogos tengan datos
SELECT 'cat_tipos_documento' as tabla, COUNT(*) as registros FROM cat_tipos_documento
UNION ALL
SELECT 'cat_tipos_pago', COUNT(*) FROM cat_tipos_pago
UNION ALL
SELECT 'cat_estados_certificado', COUNT(*) FROM cat_estados_certificado
UNION ALL
SELECT 'cat_estados_entidad', COUNT(*) FROM cat_estados_entidad
UNION ALL
SELECT 'cat_estados_venta', COUNT(*) FROM cat_estados_venta
UNION ALL
SELECT 'cat_estados_deuda', COUNT(*) FROM cat_estados_deuda
UNION ALL
SELECT 'cat_estados_afiliacion', COUNT(*) FROM cat_estados_afiliacion
UNION ALL
SELECT 'cat_tipos_mora', COUNT(*) FROM cat_tipos_mora
UNION ALL
SELECT 'cat_motivos_visita', COUNT(*) FROM cat_motivos_visita
UNION ALL
SELECT 'cat_estados_visita', COUNT(*) FROM cat_estados_visita
UNION ALL
SELECT 'cat_categorias_certificado', COUNT(*) FROM cat_categorias_certificado
UNION ALL
SELECT 'cat_tipos_descuento', COUNT(*) FROM cat_tipos_descuento
UNION ALL
SELECT 'rol', COUNT(*) FROM rol
UNION ALL
SELECT 'permiso', COUNT(*) FROM permiso
UNION ALL
SELECT 'rol_permiso', COUNT(*) FROM rol_permiso;

-- Verificar estructura de roles y permisos por rol
SELECT r.codigo as rol, COUNT(rp.id_permiso) as permisos_asignados
FROM rol r
LEFT JOIN rol_permiso rp ON r.id = rp.id_rol
GROUP BY r.codigo, r.nivel_jerarquico
ORDER BY r.nivel_jerarquico, r.codigo;

-- ================================
-- CONSULTA DE CATEGORÍAS DE CERTIFICADO
-- ================================

-- Verificar las categorías de certificado organizadas por servicio
SELECT 
  servicio,
  categoria,
  clase,
  codigo,
  descripcion
FROM cat_categorias_certificado 
WHERE activo = true
ORDER BY servicio, categoria, clase;

-- Resumen por servicio y categoría
SELECT 
  servicio,
  categoria,
  COUNT(*) as cantidad_clases
FROM cat_categorias_certificado 
WHERE activo = true
GROUP BY servicio, categoria
ORDER BY servicio, categoria;