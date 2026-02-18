BEGIN;

-- =====================================================
-- TABLAS BÁSICAS
-- =====================================================

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

-- =====================================================
-- UBICACIÓN
-- =====================================================

CREATE TABLE departamento (
    id_departamento INTEGER PRIMARY KEY,
    nombre VARCHAR(50),
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

ALTER TABLE ciudad
    ADD FOREIGN KEY (id_departamento) REFERENCES departamento(id_departamento);

-- =====================================================
-- SUPERADMIN (NO MODIFICADO)
-- =====================================================

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

ALTER TABLE superadmin
    ADD FOREIGN KEY (id_rol) REFERENCES rol(id_rol);

-- =====================================================
-- EMPRESA
-- =====================================================

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

ALTER TABLE empresa
    ADD FOREIGN KEY (id_estado) REFERENCES estado(id_estado),
    ADD FOREIGN KEY (id_ciudad) REFERENCES ciudad(codigo_postal);

-- =====================================================
-- USUARIO
-- =====================================================

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

ALTER TABLE usuario
    ADD FOREIGN KEY (id_rol) REFERENCES rol(id_rol),
    ADD FOREIGN KEY (id_estado) REFERENCES estado(id_estado),
    ADD FOREIGN KEY (nit) REFERENCES empresa(nit);

-- =====================================================
-- LICENCIAMIENTO
-- =====================================================

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

ALTER TABLE tipo_licencia
    ADD FOREIGN KEY (id_estado) REFERENCES estado(id_estado);

ALTER TABLE empresa_licencia
    ADD FOREIGN KEY (nit) REFERENCES empresa(nit),
    ADD FOREIGN KEY (id_tipo_licencia) REFERENCES tipo_licencia(id_tipo_licencia),
    ADD FOREIGN KEY (id_estado) REFERENCES estado(id_estado);

-- =====================================================
-- CITA
-- =====================================================

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

ALTER TABLE cita
    ADD FOREIGN KEY (doc_paciente) REFERENCES usuario(documento),
    ADD FOREIGN KEY (doc_medico) REFERENCES usuario(documento),
    ADD FOREIGN KEY (tipo_cita_id) REFERENCES tipo_cita(id_tipo_cita),
    ADD FOREIGN KEY (id_estado) REFERENCES estado(id_estado);

-- =====================================================
-- TRIGGER CITAS
-- =====================================================

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

-- =====================================================
-- HISTORIAL CLÍNICO
-- =====================================================

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

ALTER TABLE historial_clinico
    ADD FOREIGN KEY (id_paciente) REFERENCES usuario(documento);

ALTER TABLE historial_detalle
    ADD FOREIGN KEY (id_historial) REFERENCES historial_clinico(id_historial),
    ADD FOREIGN KEY (id_cita) REFERENCES cita(id_cita);

-- =====================================================
-- LARAVEL CORE
-- =====================================================

CREATE TABLE migrations (
    id SERIAL PRIMARY KEY,
    migration VARCHAR(255) NOT NULL,
    batch INTEGER NOT NULL
);

CREATE TABLE failed_jobs (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(255) NOT NULL UNIQUE,
    connection TEXT NOT NULL,
    queue TEXT NOT NULL,
    payload TEXT NOT NULL,
    exception TEXT NOT NULL,
    failed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cache (
    key VARCHAR(255) PRIMARY KEY,
    value TEXT NOT NULL,
    expiration INTEGER NOT NULL
);

CREATE TABLE cache_locks (
    key VARCHAR(255) PRIMARY KEY,
    owner VARCHAR(255) NOT NULL,
    expiration INTEGER NOT NULL
);

CREATE TABLE sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id BIGINT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    payload TEXT NOT NULL,
    last_activity INTEGER NOT NULL
);

CREATE TABLE personal_access_tokens (
    id BIGSERIAL PRIMARY KEY,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    token VARCHAR(64) NOT NULL UNIQUE,
    abilities TEXT,
    last_used_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX personal_access_tokens_tokenable_index
ON personal_access_tokens (tokenable_type, tokenable_id);

CREATE TABLE activities (
    id BIGSERIAL PRIMARY KEY,
    descripcion TEXT NOT NULL,
    tipo VARCHAR(100),
    modulo VARCHAR(100),
    usuario_documento INTEGER,
    empresa_nit VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE activities
    ADD FOREIGN KEY (usuario_documento) REFERENCES usuario(documento),
    ADD FOREIGN KEY (empresa_nit) REFERENCES empresa(nit);

COMMIT;
