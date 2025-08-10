-- 1. proveedor
CREATE TABLE proveedor (
  id SERIAL PRIMARY KEY,
  tipo_documento VARCHAR(10) NOT NULL,
  numero_documento VARCHAR(20) NOT NULL,
  razon_social VARCHAR(150),
  nombre VARCHAR(100),
  direccion VARCHAR(200),
  telefono VARCHAR(20),
  email VARCHAR(100),
  id_externo_db_data VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by INTEGER,
  updated_by INTEGER,
  estado VARCHAR(20) DEFAULT 'registrado'
);

-- 2. distribuidor
CREATE TABLE distribuidor (
  id SERIAL PRIMARY KEY,
  id_proveedor INTEGER REFERENCES proveedor(id),
  nombre VARCHAR(100),
  telefono VARCHAR(20),
  email VARCHAR(100),
  id_externo_db_data VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by INTEGER,
  updated_by INTEGER,
  estado VARCHAR(20) DEFAULT 'registrado'
);

-- 3. punto_venta
CREATE TABLE punto_venta (
  id SERIAL PRIMARY KEY,
  tipo_documento VARCHAR(10) NOT NULL,
  numero_documento VARCHAR(20) NOT NULL,
  nombre VARCHAR(100),
  direccion VARCHAR(200),
  telefono VARCHAR(20),
  email VARCHAR(100),
  id_externo_db_data VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by INTEGER,
  updated_by INTEGER,
  estado VARCHAR(20) DEFAULT 'registrado'
);

-- 4. afiliacion_pv_proveedor
CREATE TABLE afiliacion_pv_proveedor (
  id SERIAL PRIMARY KEY,
  id_proveedor INTEGER REFERENCES proveedor(id),
  id_distribuidor INTEGER REFERENCES distribuidor(id),
  id_punto_venta INTEGER REFERENCES punto_venta(id),
  estado VARCHAR(20) DEFAULT 'pendiente',
  fecha_verificacion TIMESTAMP,
  usuario_verificador INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by INTEGER,
  updated_by INTEGER
);

-- 5. zona
CREATE TABLE zona (
  id SERIAL PRIMARY KEY,
  id_proveedor INTEGER REFERENCES proveedor(id),
  nombre VARCHAR(100),
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by INTEGER,
  updated_by INTEGER,
  estado VARCHAR(20) DEFAULT 'registrado'
);

-- 6. zona_punto_venta
CREATE TABLE zona_punto_venta (
  id SERIAL PRIMARY KEY,
  id_zona INTEGER REFERENCES zona(id),
  id_punto_venta INTEGER REFERENCES punto_venta(id),
  fecha_asignacion TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by INTEGER,
  updated_by INTEGER,
  estado VARCHAR(20) DEFAULT 'registrado'
);

-- 7. certificado
CREATE TABLE certificado (
  id SERIAL PRIMARY KEY,
  id_proveedor INTEGER REFERENCES proveedor(id),
  numero_serie VARCHAR(50) NOT NULL,
  categoria VARCHAR(50),
  foto_url VARCHAR(200),
  datos_vehiculo_externo VARCHAR(50),
  estado VARCHAR(20) DEFAULT 'disponible',
  fecha_registro TIMESTAMP DEFAULT NOW(),
  fecha_asignacion TIMESTAMP,
  fecha_venta TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by INTEGER,
  updated_by INTEGER
);

-- 8. venta
CREATE TABLE venta (
  id SERIAL PRIMARY KEY,
  id_punto_venta INTEGER REFERENCES punto_venta(id),
  fecha TIMESTAMP DEFAULT NOW(),
  precio_total DECIMAL(12,2),
  id_cliente_externo VARCHAR(50),
  observaciones TEXT,
  estado VARCHAR(20) DEFAULT 'activa',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by INTEGER,
  updated_by INTEGER
);

-- 9. venta_certificado
CREATE TABLE venta_certificado (
  id SERIAL PRIMARY KEY,
  id_venta INTEGER REFERENCES venta(id),
  id_certificado INTEGER REFERENCES certificado(id),
  precio_venta DECIMAL(12,2),
  monto_fijo_proveedor DECIMAL(12,2),
  descuento_aplicado DECIMAL(12,2),
  ganancia_pv DECIMAL(12,2),
  estado VARCHAR(20) DEFAULT 'vendido',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by INTEGER,
  updated_by INTEGER
);

-- 10. descuento_pv
CREATE TABLE descuento_pv (
  id SERIAL PRIMARY KEY,
  id_proveedor INTEGER REFERENCES proveedor(id),
  id_punto_venta INTEGER REFERENCES punto_venta(id),
  porcentaje DECIMAL(5,2),
  monto_fijo DECIMAL(12,2),
  fecha_inicio DATE,
  fecha_fin DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by INTEGER,
  updated_by INTEGER,
  estado VARCHAR(20) DEFAULT 'activo'
);

-- 11. deuda
CREATE TABLE deuda (
  id SERIAL PRIMARY KEY,
  id_venta INTEGER REFERENCES venta(id),
  id_punto_venta INTEGER REFERENCES punto_venta(id),
  id_proveedor INTEGER REFERENCES proveedor(id),
  monto_original DECIMAL(12,2),
  monto_pendiente DECIMAL(12,2),
  fecha_vencimiento DATE,
  estado VARCHAR(20) DEFAULT 'pendiente',
  mora_acumulada DECIMAL(12,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by INTEGER,
  updated_by INTEGER
);

-- 12. credito
CREATE TABLE credito (
  id SERIAL PRIMARY KEY,
  id_punto_venta INTEGER REFERENCES punto_venta(id),
  id_proveedor INTEGER REFERENCES proveedor(id),
  limite_credito INTEGER,
  stock_actual INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by INTEGER,
  updated_by INTEGER,
  estado VARCHAR(20) DEFAULT 'activo'
);

-- 13. pago
CREATE TABLE pago (
  id SERIAL PRIMARY KEY,
  id_punto_venta INTEGER REFERENCES punto_venta(id),
  id_proveedor INTEGER REFERENCES proveedor(id),
  monto DECIMAL(12,2),
  fecha TIMESTAMP DEFAULT NOW(),
  modalidad VARCHAR(30),
  observaciones TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by INTEGER,
  updated_by INTEGER
);

-- 14. pago_deuda
CREATE TABLE pago_deuda (
  id SERIAL PRIMARY KEY,
  id_pago INTEGER REFERENCES pago(id),
  id_deuda INTEGER REFERENCES deuda(id),
  monto_aplicado DECIMAL(12,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by INTEGER,
  updated_by INTEGER
);

-- 15. politica_mora
CREATE TABLE politica_mora (
  id SERIAL PRIMARY KEY,
  id_proveedor INTEGER REFERENCES proveedor(id),
  tipo VARCHAR(20),
  valor DECIMAL(8,2),
  dias_gracia INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by INTEGER,
  updated_by INTEGER,
  estado VARCHAR(20) DEFAULT 'activo'
);

-- 16. visita
CREATE TABLE visita (
  id SERIAL PRIMARY KEY,
  id_proveedor INTEGER REFERENCES proveedor(id),
  id_distribuidor INTEGER REFERENCES distribuidor(id),
  id_punto_venta INTEGER REFERENCES punto_venta(id),
  fecha TIMESTAMP,
  motivo VARCHAR(100),
  estado VARCHAR(20),
  observaciones TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by INTEGER,
  updated_by INTEGER
);

-- 17. usuario
CREATE TABLE usuario (
  id SERIAL PRIMARY KEY,
  id_supabase VARCHAR(50),
  nombre VARCHAR(100),
  tipo_documento VARCHAR(10),
  numero_documento VARCHAR(20),
  email VARCHAR(100),
  telefono VARCHAR(20),
  estado VARCHAR(20) DEFAULT 'registrado',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by INTEGER,
  updated_by INTEGER
);

-- 18. usuario_rol
CREATE TABLE usuario_rol (
  id SERIAL PRIMARY KEY,
  id_usuario INTEGER REFERENCES usuario(id),
  rol VARCHAR(30),
  id_entidad INTEGER,
  fecha_asignacion TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by INTEGER,
  updated_by INTEGER
);