BEGIN;

-- =========================
-- TABLAS BÁSICAS
-- =========================

CREATE TABLE categoria_medicamento (
    id_categoria INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    categoria VARCHAR(100)
);

CREATE TABLE categoria_examen (
    id_categoria_examen INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    categoria VARCHAR(100)
);

CREATE TABLE estado (
    id_estado INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_estado VARCHAR(50),
    descripcion VARCHAR(200)
);

CREATE TABLE especialidad (
    id_especialidad INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    especialidad VARCHAR(150) NOT NULL
);

CREATE TABLE prioridad (
    id_prioridad INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    prioridad VARCHAR(30)
);

CREATE TABLE tipo_cita (
    id_tipo_cita INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tipo VARCHAR(50)
);

CREATE TABLE rol (
    id_rol INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tipo_usu VARCHAR(50)
);

CREATE TABLE superadmin (
    documento INTEGER PRIMARY KEY,
    nombre VARCHAR(50),
    usuario VARCHAR(50) UNIQUE,
    email VARCHAR(100) UNIQUE,
    contrasena VARCHAR(500) NOT NULL,
    id_rol INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ciudad (
    codigo_postal INTEGER PRIMARY KEY,
    nombre VARCHAR(50),
    id_departamento INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE departamento (
    id_departamento INTEGER PRIMARY KEY,
    nombre VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- USUARIO
-- =========================

CREATE TABLE usuario (
    documento INTEGER PRIMARY KEY,
    nombre VARCHAR(50),
    apellido VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    telefono VARCHAR(30),
    direccion VARCHAR(150),
    sexo VARCHAR(10) NOT NULL CHECK (sexo IN ('Masculino','Femenino')),
    fecha_nacimiento DATE NOT NULL,
    grupo_sanguineo VARCHAR(3) NOT NULL,
    contrasena VARCHAR(500) NOT NULL,
    registro_profesional VARCHAR(50),
    nit VARCHAR(20),
    id_rol INTEGER,
    id_estado INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- EMPRESA
-- =========================

CREATE TABLE empresa (
    nit VARCHAR(20) PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    email_contacto VARCHAR(100),
    telefono VARCHAR(30),
    direccion VARCHAR(100),
    documento_representante INTEGER UNIQUE,
    nombre_representante VARCHAR(70),
    telefono_representante VARCHAR(30),
    email_representante VARCHAR(100) UNIQUE,
    id_ciudad INTEGER,
    id_estado INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- LICENCIA
-- =========================

CREATE TABLE tipo_licencia (
    id_tipo_licencia INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL,
    descripcion VARCHAR(200) NOT NULL,
    duracion_meses INTEGER NOT NULL CHECK (duracion_meses > 0),
    precio NUMERIC(12,2) NOT NULL CHECK (precio > 0),
    id_estado INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE empresa_licencia (
    id_empresa_licencia VARCHAR(12) PRIMARY KEY,
    nit VARCHAR(20) NOT NULL,
    id_tipo_licencia INTEGER NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    id_estado INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- CITA
-- =========================

CREATE TABLE cita (
    id_cita INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    doc_paciente INTEGER,
    doc_medico INTEGER,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    motivo VARCHAR(300),
    tipo_cita_id INTEGER,
    id_estado INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cita_fecha ON cita(fecha);

-- =========================
-- TRIGGER: NO EDITAR CITAS PASADAS
-- =========================

CREATE OR REPLACE FUNCTION prevent_past_cita_edit()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.fecha < CURRENT_DATE THEN
        RAISE EXCEPTION 'No se pueden editar citas pasadas';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_past_cita_edit
BEFORE UPDATE ON cita
FOR EACH ROW
EXECUTE FUNCTION prevent_past_cita_edit();



-- =========================
-- HISTORIAL CLÍNICO
-- =========================

CREATE TABLE historial_clinico (
    id_historial INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_paciente INTEGER,
    antecedentes_personales TEXT,
    antecedentes_familiares TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE historial_detalle (
    id_detalle INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_historial INTEGER NOT NULL,
    id_cita INTEGER NOT NULL,
    diagnostico TEXT,
    tratamiento TEXT,
    notas_medicas TEXT,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- FARMACIA / MEDICAMENTO
-- =========================

CREATE TABLE farmacia (
    nit VARCHAR(20) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(150),
    telefono VARCHAR(30),
    email VARCHAR(100),
    nombre_contacto VARCHAR(100),
    horario_apertura TIME,
    horario_cierre TIME,
    abierto_24h BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE medicamento (
    id_medicamento INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(150),
    presentacion VARCHAR(100),
    descripcion TEXT,
    stock_disponible INTEGER,
    precio_unitario NUMERIC(11,2),
    id_categoria INTEGER,
    id_estado INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE detalle_medicamento (
    id_detalle_medicamento INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_orden INTEGER NOT NULL,
    id_medicamento INTEGER NOT NULL,
    dosis VARCHAR(100) NOT NULL,
    frecuencia VARCHAR(100) NOT NULL,
    duracion VARCHAR(100) NOT NULL,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- INVENTARIO
-- =========================

CREATE TABLE movimiento_inventario (
    id_movimiento INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_medicamento INTEGER,
    tipo_movimiento VARCHAR(20)
        CHECK (tipo_movimiento IN ('Ingreso','Salida','Reserva')),
    cantidad INTEGER,
    fecha DATE,
    documento INTEGER,
    motivo VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- ÓRDENES / REMISIONES
-- =========================

CREATE TABLE orden_medicamento (
    id_orden INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_detalle_cita INTEGER NOT NULL,
    nit_farmacia VARCHAR(20) NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    id_estado INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE remision (
    id_remision INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_detalle_cita INTEGER NOT NULL,
    tipo_remision VARCHAR(10)
        CHECK (tipo_remision IN ('cita','examen')),
    id_especialidad INTEGER,
    id_examen INTEGER,
    id_prioridad INTEGER,
    notas TEXT NOT NULL,
    id_estado INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE examen (
    id_examen INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    id_categoria_examen INTEGER,
    requiere_ayuno BOOLEAN,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================
-- SOLICITUD CITA
-- =========================

CREATE TABLE solicitud_cita (
    id_solicitud INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_especialidad INTEGER,
    fecha_preferida DATE,
    motivo TEXT,
    id_estado INTEGER NOT NULL,
    id_cita INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- FOREIGN KEYS
-- =========================

ALTER TABLE superadmin
    ADD FOREIGN KEY (id_rol) REFERENCES rol(id_rol);

ALTER TABLE ciudad
    ADD FOREIGN KEY (id_departamento) REFERENCES departamento(id_departamento);

ALTER TABLE usuario
    ADD FOREIGN KEY (id_rol) REFERENCES rol(id_rol),
    ADD FOREIGN KEY (id_estado) REFERENCES estado(id_estado),
    ADD FOREIGN KEY (nit) REFERENCES empresa(nit);

ALTER TABLE cita
    ADD FOREIGN KEY (doc_paciente) REFERENCES usuario(documento),
    ADD FOREIGN KEY (doc_medico) REFERENCES usuario(documento),
    ADD FOREIGN KEY (tipo_cita_id) REFERENCES tipo_cita(id_tipo_cita),
    ADD FOREIGN KEY (id_estado) REFERENCES estado(id_estado);

ALTER TABLE historial_clinico
    ADD FOREIGN KEY (id_paciente) REFERENCES usuario(documento);

ALTER TABLE historial_detalle
    ADD FOREIGN KEY (id_historial) REFERENCES historial_clinico(id_historial),
    ADD FOREIGN KEY (id_cita) REFERENCES cita(id_cita);

ALTER TABLE medicamento
    ADD FOREIGN KEY (id_categoria) REFERENCES categoria_medicamento(id_categoria),
    ADD FOREIGN KEY (id_estado) REFERENCES estado(id_estado);

ALTER TABLE detalle_medicamento
    ADD FOREIGN KEY (id_orden) REFERENCES orden_medicamento(id_orden),
    ADD FOREIGN KEY (id_medicamento) REFERENCES medicamento(id_medicamento);

ALTER TABLE examen
    ADD FOREIGN KEY (id_categoria_examen) REFERENCES categoria_examen(id_categoria_examen);

ALTER TABLE movimiento_inventario
    ADD FOREIGN KEY (id_medicamento) REFERENCES medicamento(id_medicamento),
    ADD FOREIGN KEY (documento) REFERENCES usuario(documento);

ALTER TABLE orden_medicamento
    ADD FOREIGN KEY (nit_farmacia) REFERENCES farmacia(nit) ON DELETE CASCADE,
    ADD FOREIGN KEY (id_estado) REFERENCES estado(id_estado),
    ADD FOREIGN KEY (id_detalle_cita) REFERENCES historial_detalle(id_detalle);

ALTER TABLE remision
    ADD FOREIGN KEY (id_estado) REFERENCES estado(id_estado),
    ADD FOREIGN KEY (id_especialidad) REFERENCES especialidad(id_especialidad),
    ADD FOREIGN KEY (id_prioridad) REFERENCES prioridad(id_prioridad),
    ADD FOREIGN KEY (id_detalle_cita) REFERENCES historial_detalle(id_detalle),
    ADD FOREIGN KEY (id_examen) REFERENCES examen(id_examen);

ALTER TABLE solicitud_cita
    ADD FOREIGN KEY (id_especialidad) REFERENCES especialidad(id_especialidad),
    ADD FOREIGN KEY (id_estado) REFERENCES estado(id_estado),
    ADD FOREIGN KEY (id_cita) REFERENCES cita(id_cita);

ALTER TABLE empresa
    ADD FOREIGN KEY (id_estado) REFERENCES estado(id_estado),
    add FOREIGN KEY (id_ciudad) REFERENCES ciudad(codigo_postal);

ALTER TABLE empresa_licencia
    ADD FOREIGN KEY (nit) REFERENCES empresa(nit),
    ADD FOREIGN KEY (id_tipo_licencia) REFERENCES tipo_licencia(id_tipo_licencia),  
    ADD FOREIGN KEY (id_estado) REFERENCES estado(id_estado);

ALTER TABLE tipo_licencia
    ADD FOREIGN KEY (id_estado) REFERENCES estado(id_estado);

COMMIT;
