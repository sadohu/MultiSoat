-- 1. proveedor
CREATE TABLE proveedor (
  id_proveedor SERIAL PRIMARY KEY,
  tipo_documento VARCHAR(10) NOT NULL,
  numero_documento VARCHAR(20) NOT NULL,
  razon_social VARCHAR(150),
  nombre VARCHAR(100),
  direccion VARCHAR(200),
  telefono VARCHAR(20),
  email VARCHAR(100),
  id_externo_db_data VARCHAR(50),
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP,
  usuario_creacion INTEGER,
  usuario_actualizacion INTEGER,
  estado VARCHAR(20) DEFAULT 'registrado'
);

-- 2. distribuidor
CREATE TABLE distribuidor (
  id_distribuidor SERIAL PRIMARY KEY,
  id_proveedor INTEGER REFERENCES proveedor(id_proveedor),
  nombre VARCHAR(100),
  telefono VARCHAR(20),
  email VARCHAR(100),
  id_externo_db_data VARCHAR(50),
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP,
  usuario_creacion INTEGER,
  usuario_actualizacion INTEGER,
  estado VARCHAR(20) DEFAULT 'registrado'
);

-- 3. punto_venta
CREATE TABLE punto_venta (
  id_punto_venta SERIAL PRIMARY KEY,
  tipo_documento VARCHAR(10) NOT NULL,
  numero_documento VARCHAR(20) NOT NULL,
  nombre VARCHAR(100),
  direccion VARCHAR(200),
  telefono VARCHAR(20),
  email VARCHAR(100),
  id_externo_db_data VARCHAR(50),
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP,
  usuario_creacion INTEGER,
  usuario_actualizacion INTEGER,
  estado VARCHAR(20) DEFAULT 'registrado'
);

-- 4. afiliacion_pv_proveedor
CREATE TABLE afiliacion_pv_proveedor (
  id_afiliacion SERIAL PRIMARY KEY,
  id_proveedor INTEGER REFERENCES proveedor(id_proveedor),
  id_distribuidor INTEGER REFERENCES distribuidor(id_distribuidor),
  id_punto_venta INTEGER REFERENCES punto_venta(id_punto_venta),
  estado VARCHAR(20) DEFAULT 'pendiente',
  fecha_verificacion TIMESTAMP,
  usuario_verificador INTEGER,
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP,
  usuario_creacion INTEGER,
  usuario_actualizacion INTEGER
);

-- 5. zona
CREATE TABLE zona (
  id_zona SERIAL PRIMARY KEY,
  id_proveedor INTEGER REFERENCES proveedor(id_proveedor),
  nombre VARCHAR(100),
  descripcion TEXT,
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  estado VARCHAR(20) DEFAULT 'registrado'
);

-- 6. zona_punto_venta
CREATE TABLE zona_punto_venta (
  id_zona_pv SERIAL PRIMARY KEY,
  id_zona INTEGER REFERENCES zona(id_zona),
  id_punto_venta INTEGER REFERENCES punto_venta(id_punto_venta),
  fecha_asignacion TIMESTAMP DEFAULT NOW(),
  estado VARCHAR(20) DEFAULT 'registrado'
);

-- 7. certificado
CREATE TABLE certificado (
  id_certificado SERIAL PRIMARY KEY,
  id_proveedor INTEGER REFERENCES proveedor(id_proveedor),
  numero_serie VARCHAR(50) NOT NULL,
  categoria VARCHAR(50),
  foto_url VARCHAR(200),
  datos_vehiculo_externo VARCHAR(50),
  estado VARCHAR(20) DEFAULT 'disponible',
  fecha_registro TIMESTAMP DEFAULT NOW(),
  fecha_asignacion TIMESTAMP,
  fecha_venta TIMESTAMP,
  fecha_actualizacion TIMESTAMP,
  usuario_creacion INTEGER,
  usuario_actualizacion INTEGER
);

-- 8. venta
CREATE TABLE venta (
  id_venta SERIAL PRIMARY KEY,
  id_punto_venta INTEGER REFERENCES punto_venta(id_punto_venta),
  fecha TIMESTAMP DEFAULT NOW(),
  precio_total DECIMAL(12,2),
  id_cliente_externo VARCHAR(50),
  observaciones TEXT,
  estado VARCHAR(20) DEFAULT 'activa',
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP,
  usuario_creacion INTEGER,
  usuario_actualizacion INTEGER
);

-- 9. venta_certificado
CREATE TABLE venta_certificado (
  id_venta_cert SERIAL PRIMARY KEY,
  id_venta INTEGER REFERENCES venta(id_venta),
  id_certificado INTEGER REFERENCES certificado(id_certificado),
  precio_venta DECIMAL(12,2),
  monto_fijo_proveedor DECIMAL(12,2),
  descuento_aplicado DECIMAL(12,2),
  ganancia_pv DECIMAL(12,2),
  estado VARCHAR(20) DEFAULT 'vendido'
);

-- 10. descuento_pv
CREATE TABLE descuento_pv (
  id_descuento SERIAL PRIMARY KEY,
  id_proveedor INTEGER REFERENCES proveedor(id_proveedor),
  id_punto_venta INTEGER REFERENCES punto_venta(id_punto_venta),
  porcentaje DECIMAL(5,2),
  monto_fijo DECIMAL(12,2),
  fecha_inicio DATE,
  fecha_fin DATE,
  estado VARCHAR(20) DEFAULT 'activo'
);

-- 11. deuda
CREATE TABLE deuda (
  id_deuda SERIAL PRIMARY KEY,
  id_venta INTEGER REFERENCES venta(id_venta),
  id_punto_venta INTEGER REFERENCES punto_venta(id_punto_venta),
  id_proveedor INTEGER REFERENCES proveedor(id_proveedor),
  monto_original DECIMAL(12,2),
  monto_pendiente DECIMAL(12,2),
  fecha_vencimiento DATE,
  estado VARCHAR(20) DEFAULT 'pendiente',
  mora_acumulada DECIMAL(12,2),
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP,
  usuario_creacion INTEGER,
  usuario_actualizacion INTEGER
);

-- 12. credito
CREATE TABLE credito (
  id_credito SERIAL PRIMARY KEY,
  id_punto_venta INTEGER REFERENCES punto_venta(id_punto_venta),
  id_proveedor INTEGER REFERENCES proveedor(id_proveedor),
  limite_credito INTEGER,
  stock_actual INTEGER,
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP,
  usuario_creacion INTEGER,
  usuario_actualizacion INTEGER,
  estado VARCHAR(20) DEFAULT 'activo'
);

-- 13. pago
CREATE TABLE pago (
  id_pago SERIAL PRIMARY KEY,
  id_punto_venta INTEGER REFERENCES punto_venta(id_punto_venta),
  id_proveedor INTEGER REFERENCES proveedor(id_proveedor),
  monto DECIMAL(12,2),
  fecha TIMESTAMP DEFAULT NOW(),
  modalidad VARCHAR(30),
  observaciones TEXT,
  usuario_registro INTEGER,
  fecha_creacion TIMESTAMP DEFAULT NOW()
);

-- 14. pago_deuda
CREATE TABLE pago_deuda (
  id_pago_deuda SERIAL PRIMARY KEY,
  id_pago INTEGER REFERENCES pago(id_pago),
  id_deuda INTEGER REFERENCES deuda(id_deuda),
  monto_aplicado DECIMAL(12,2)
);

-- 15. politica_mora
CREATE TABLE politica_mora (
  id_politica SERIAL PRIMARY KEY,
  id_proveedor INTEGER REFERENCES proveedor(id_proveedor),
  tipo VARCHAR(20),
  valor DECIMAL(8,2),
  dias_gracia INTEGER,
  estado VARCHAR(20) DEFAULT 'activo'
);

-- 16. visita
CREATE TABLE visita (
  id_visita SERIAL PRIMARY KEY,
  id_proveedor INTEGER REFERENCES proveedor(id_proveedor),
  id_distribuidor INTEGER REFERENCES distribuidor(id_distribuidor),
  id_punto_venta INTEGER REFERENCES punto_venta(id_punto_venta),
  fecha TIMESTAMP,
  motivo VARCHAR(100),
  estado VARCHAR(20),
  observaciones TEXT,
  usuario_programa INTEGER
);

-- 17. usuario
CREATE TABLE usuario (
  id_usuario SERIAL PRIMARY KEY,
  id_supabase VARCHAR(50),
  nombre VARCHAR(100),
  tipo_documento VARCHAR(10),
  numero_documento VARCHAR(20),
  email VARCHAR(100),
  telefono VARCHAR(20),
  estado VARCHAR(20) DEFAULT 'registrado',
  fecha_creacion TIMESTAMP DEFAULT NOW()
);

-- 18. usuario_rol
CREATE TABLE usuario_rol (
  id_usuario_rol SERIAL PRIMARY KEY,
  id_usuario INTEGER REFERENCES usuario(id_usuario),
  rol VARCHAR(30),
  id_entidad INTEGER,
  fecha_asignacion TIMESTAMP DEFAULT NOW()
);