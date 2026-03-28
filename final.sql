--
-- PostgreSQL database dump
--

\restrict onbxibOf4za8v6oGu93bA6x6p32MLEF19g5HvNW34FZ10aJgkC8CwFtdFOrUC3Z

-- Dumped from database version 18.2
-- Dumped by pg_dump version 18.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: guardar_historial_admins(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.guardar_historial_admins() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN

   IF NEW.id_rol = 2 THEN

      INSERT INTO historial_admins (
         documento,
         primer_nombre,
         segundo_nombre,
         primer_apellido,
         segundo_apellido,
         email,
         telefono,
         contrasena,
         nit,
         fecha_respaldo
      )
      VALUES (
         NEW.documento,
         NEW.primer_nombre,
         NEW.segundo_nombre,
         NEW.primer_apellido,
         NEW.segundo_apellido,
         NEW.email,
         NEW.telefono,
         NEW.contrasena,
         NEW.nit,
         CURRENT_TIMESTAMP
      );

   END IF;

   RETURN NEW;

END;
$$;


ALTER FUNCTION public.guardar_historial_admins() OWNER TO postgres;

--
-- Name: guardar_historial_empresa(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.guardar_historial_empresa() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN

   -- Solo guarda si cambió algún dato del representante
   IF OLD.nombre_representante IS DISTINCT FROM NEW.nombre_representante
      OR OLD.documento_representante IS DISTINCT FROM NEW.documento_representante
      OR OLD.telefono_representante IS DISTINCT FROM NEW.telefono_representante
      OR OLD.email_representante IS DISTINCT FROM NEW.email_representante
   THEN

      INSERT INTO respaldo_empresa (
         nit_empresa,
         nombre_representante,
         documento_representante,
         telefono_representante,
         email_representante,
         fecha_respaldo
      )
      VALUES (
         OLD.nit,
         OLD.nombre_representante,
         OLD.documento_representante,
         OLD.telefono_representante,
         OLD.email_representante,
         CURRENT_TIMESTAMP
      );

   END IF;

   RETURN NEW;

END;
$$;


ALTER FUNCTION public.guardar_historial_empresa() OWNER TO postgres;

--
-- Name: prevent_past_cita_edit(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.prevent_past_cita_edit() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF OLD.fecha < CURRENT_DATE AND NEW.id_estado = OLD.id_estado THEN
        RAISE EXCEPTION 'No se pueden editar citas pasadas';
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.prevent_past_cita_edit() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Historial_admins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Historial_admins" (
    documento bigint NOT NULL,
    primer_nombre character varying(50) NOT NULL,
    segundo_nombre character varying(50) NOT NULL,
    primer_apellido character varying(50) NOT NULL,
    segundo_apellido character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    telefono character varying(12) NOT NULL,
    contrasena character varying(500) NOT NULL,
    nit character varying(20) NOT NULL,
    fecha_respaldo timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Historial_admins" OWNER TO postgres;

--
-- Name: activities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activities (
    id bigint NOT NULL,
    title character varying(255) NOT NULL,
    type character varying(255) NOT NULL,
    icon character varying(255) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    channel_name character varying(100) NOT NULL
);


ALTER TABLE public.activities OWNER TO postgres;

--
-- Name: activities_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.activities_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.activities_id_seq OWNER TO postgres;

--
-- Name: activities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.activities_id_seq OWNED BY public.activities.id;


--
-- Name: cache; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cache (
    key character varying(255) NOT NULL,
    value text NOT NULL,
    expiration integer NOT NULL
);


ALTER TABLE public.cache OWNER TO postgres;

--
-- Name: cache_locks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cache_locks (
    key character varying(255) NOT NULL,
    owner character varying(255) NOT NULL,
    expiration integer NOT NULL
);


ALTER TABLE public.cache_locks OWNER TO postgres;

--
-- Name: categoria_examen; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categoria_examen (
    id_categoria_examen integer NOT NULL,
    categoria character varying(100),
    id_estado integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    requiere_ayuno boolean DEFAULT false
);


ALTER TABLE public.categoria_examen OWNER TO postgres;

--
-- Name: categoria_examen_id_categoria_examen_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.categoria_examen ALTER COLUMN id_categoria_examen ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.categoria_examen_id_categoria_examen_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: categoria_medicamento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categoria_medicamento (
    id_categoria integer NOT NULL,
    categoria character varying(100),
    id_estado integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.categoria_medicamento OWNER TO postgres;

--
-- Name: categoria_medicamento_id_categoria_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.categoria_medicamento ALTER COLUMN id_categoria ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.categoria_medicamento_id_categoria_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: cita; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cita (
    id_cita integer NOT NULL,
    doc_paciente integer,
    doc_medico integer,
    fecha date,
    hora_inicio time(0) without time zone,
    hora_fin time(0) without time zone,
    motivo character varying(300),
    id_estado integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    recordatorio_enviado boolean DEFAULT false NOT NULL,
    tipo_evento character varying(255) DEFAULT 'consulta'::character varying NOT NULL,
    id_especialidad bigint,
    id_examen bigint,
    id_motivo integer
);


ALTER TABLE public.cita OWNER TO postgres;

--
-- Name: COLUMN cita.recordatorio_enviado; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.cita.recordatorio_enviado IS 'true cuando el recordatorio automático ya fue despachado para esta cita';


--
-- Name: cita_id_cita_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.cita ALTER COLUMN id_cita ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.cita_id_cita_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: ciudad; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ciudad (
    codigo_postal integer NOT NULL,
    nombre character varying(50),
    id_departamento integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_estado integer
);


ALTER TABLE public.ciudad OWNER TO postgres;

--
-- Name: concentracion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.concentracion (
    id_concentracion integer NOT NULL,
    concentracion character varying(20)
);


ALTER TABLE public.concentracion OWNER TO postgres;

--
-- Name: concentracion_id_concentracion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.concentracion ALTER COLUMN id_concentracion ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.concentracion_id_concentracion_seq
    START WITH 2
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: consultorio; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.consultorio (
    id_consultorio integer NOT NULL,
    numero_consultorio integer
);


ALTER TABLE public.consultorio OWNER TO postgres;

--
-- Name: consultorio_id_consultorio_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.consultorio ALTER COLUMN id_consultorio ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.consultorio_id_consultorio_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: departamento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departamento (
    "codigo_DANE" integer CONSTRAINT departamento_id_departamento_not_null NOT NULL,
    nombre character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_estado integer
);


ALTER TABLE public.departamento OWNER TO postgres;

--
-- Name: receta_detalle; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.receta_detalle (
    id_detalle_receta integer CONSTRAINT detalle_medicamento_id_detalle_medicamento_not_null NOT NULL,
    id_receta integer CONSTRAINT detalle_medicamento_id_orden_not_null NOT NULL,
    id_presentacion integer CONSTRAINT detalle_medicamento_id_medicamento_not_null NOT NULL,
    dosis character varying(100) CONSTRAINT detalle_medicamento_dosis_not_null NOT NULL,
    frecuencia character varying(100) CONSTRAINT detalle_medicamento_frecuencia_not_null NOT NULL,
    duracion character varying(100) CONSTRAINT detalle_medicamento_duracion_not_null NOT NULL,
    observaciones text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    nit_farmacia character varying,
    cantidad_dispensar integer
);


ALTER TABLE public.receta_detalle OWNER TO postgres;

--
-- Name: detalle_medicamento_id_detalle_medicamento_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.receta_detalle ALTER COLUMN id_detalle_receta ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.detalle_medicamento_id_detalle_medicamento_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: dispensacion_farmacia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dispensacion_farmacia (
    id_dispensacion integer NOT NULL,
    id_detalle_receta integer NOT NULL,
    nit_farmacia character varying NOT NULL,
    cantidad integer,
    fecha_dispensacion timestamp without time zone,
    documento_farmaceutico integer,
    id_estado integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.dispensacion_farmacia OWNER TO postgres;

--
-- Name: dispensacion_farmacia_id_dispensacion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.dispensacion_farmacia ALTER COLUMN id_dispensacion ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.dispensacion_farmacia_id_dispensacion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: empresa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.empresa (
    nit character varying(20) NOT NULL,
    nombre character varying(150) NOT NULL,
    email_contacto character varying(100),
    telefono character varying(30),
    direccion character varying(100),
    documento_representante integer,
    nombre_representante character varying(70),
    telefono_representante character varying(30),
    email_representante character varying(100),
    id_ciudad integer,
    id_estado integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.empresa OWNER TO postgres;

--
-- Name: empresa_licencia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.empresa_licencia (
    id_empresa_licencia character varying(12) NOT NULL,
    nit character varying(20) NOT NULL,
    id_tipo_licencia integer NOT NULL,
    fecha_inicio date,
    fecha_fin date,
    id_estado integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.empresa_licencia OWNER TO postgres;

--
-- Name: enfermedades; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.enfermedades (
    codigo_icd character varying(20) NOT NULL,
    nombre text NOT NULL,
    descripcion text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.enfermedades OWNER TO postgres;

--
-- Name: especialidad; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.especialidad (
    id_especialidad integer NOT NULL,
    especialidad character varying(150) NOT NULL,
    id_estado integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    acceso_directo boolean DEFAULT false
);


ALTER TABLE public.especialidad OWNER TO postgres;

--
-- Name: especialidad_id_especialidad_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.especialidad ALTER COLUMN id_especialidad ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.especialidad_id_especialidad_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: estado; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estado (
    id_estado integer NOT NULL,
    nombre_estado character varying(50)
);


ALTER TABLE public.estado OWNER TO postgres;

--
-- Name: estado_id_estado_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.estado ALTER COLUMN id_estado ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.estado_id_estado_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: examen; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.examen (
    id_examen integer NOT NULL,
    nombre character varying(100) NOT NULL,
    id_categoria_examen integer,
    requiere_ayuno boolean,
    descripcion text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    doc_paciente bigint,
    fecha date,
    hora_inicio time without time zone,
    hora_fin time without time zone,
    id_estado bigint,
    resultado_pdf character varying(255)
);


ALTER TABLE public.examen OWNER TO postgres;

--
-- Name: examen_id_examen_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.examen ALTER COLUMN id_examen ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.examen_id_examen_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: failed_jobs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.failed_jobs (
    id bigint NOT NULL,
    uuid character varying(255) NOT NULL,
    connection text NOT NULL,
    queue text NOT NULL,
    payload text NOT NULL,
    exception text NOT NULL,
    failed_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.failed_jobs OWNER TO postgres;

--
-- Name: failed_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.failed_jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.failed_jobs_id_seq OWNER TO postgres;

--
-- Name: failed_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.failed_jobs_id_seq OWNED BY public.failed_jobs.id;


--
-- Name: farmacia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.farmacia (
    nit character varying(20) NOT NULL,
    nombre character varying(100) NOT NULL,
    direccion character varying(150),
    telefono character varying(30),
    email character varying(100),
    nombre_contacto character varying(100),
    horario_apertura time without time zone,
    horario_cierre time without time zone,
    abierto_24h boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    nit_empresa character varying,
    id_estado integer
);


ALTER TABLE public.farmacia OWNER TO postgres;

--
-- Name: forma_farmaceutica; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.forma_farmaceutica (
    id_forma integer NOT NULL,
    forma_farmaceutica character varying(50)
);


ALTER TABLE public.forma_farmaceutica OWNER TO postgres;

--
-- Name: forma_farmaceutica_id_forma_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.forma_farmaceutica ALTER COLUMN id_forma ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.forma_farmaceutica_id_forma_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: historial_clinico; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historial_clinico (
    id_historial integer NOT NULL,
    id_paciente integer,
    antecedentes_personales text,
    antecedentes_familiares text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    alergias text,
    habitos_vida jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE public.historial_clinico OWNER TO postgres;

--
-- Name: historial_clinico_id_historial_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.historial_clinico ALTER COLUMN id_historial ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.historial_clinico_id_historial_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: historial_detalle; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historial_detalle (
    id_detalle integer NOT NULL,
    id_historial integer NOT NULL,
    id_cita integer NOT NULL,
    diagnostico text,
    tratamiento text,
    notas_medicas text,
    observaciones text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    subjetivo text,
    signos_vitales jsonb
);


ALTER TABLE public.historial_detalle OWNER TO postgres;

--
-- Name: COLUMN historial_detalle.subjetivo; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.historial_detalle.subjetivo IS 'SOAP S — Síntomas y motivo de consulta narrado por el paciente';


--
-- Name: COLUMN historial_detalle.signos_vitales; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.historial_detalle.signos_vitales IS 'SOAP O — Hallazgos objetivos: signos vitales como JSON';


--
-- Name: historial_detalle_id_detalle_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.historial_detalle ALTER COLUMN id_detalle ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.historial_detalle_id_detalle_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: historial_enfermedades; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historial_enfermedades (
    id bigint CONSTRAINT historial_enfermedads_id_not_null NOT NULL,
    historial_detalle_id bigint CONSTRAINT historial_enfermedads_historial_detalle_id_not_null NOT NULL,
    enfermedad_codigo_icd character varying(255) CONSTRAINT historial_enfermedads_enfermedad_codigo_icd_not_null NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.historial_enfermedades OWNER TO postgres;

--
-- Name: historial_enfermedads_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.historial_enfermedads_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.historial_enfermedads_id_seq OWNER TO postgres;

--
-- Name: historial_enfermedads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.historial_enfermedads_id_seq OWNED BY public.historial_enfermedades.id;


--
-- Name: historial_reportes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historial_reportes (
    id bigint NOT NULL,
    id_usuario bigint,
    tabla_relacion character varying(255) NOT NULL,
    num_registros integer NOT NULL,
    ejemplo_registro json,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.historial_reportes OWNER TO postgres;

--
-- Name: historial_reportes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.historial_reportes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.historial_reportes_id_seq OWNER TO postgres;

--
-- Name: historial_reportes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.historial_reportes_id_seq OWNED BY public.historial_reportes.id;


--
-- Name: inventario_farmacia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventario_farmacia (
    id_inventario integer NOT NULL,
    nit_farmacia character varying(12) NOT NULL,
    id_presentacion integer NOT NULL,
    stock_actual integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.inventario_farmacia OWNER TO postgres;

--
-- Name: inventario_farmacia_id_inventario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.inventario_farmacia ALTER COLUMN id_inventario ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.inventario_farmacia_id_inventario_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: job_batches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.job_batches (
    id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    total_jobs integer NOT NULL,
    pending_jobs integer NOT NULL,
    failed_jobs integer NOT NULL,
    failed_job_ids text NOT NULL,
    options text,
    cancelled_at integer,
    created_at integer NOT NULL,
    finished_at integer
);


ALTER TABLE public.job_batches OWNER TO postgres;

--
-- Name: jobs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jobs (
    id bigint NOT NULL,
    queue character varying(255) NOT NULL,
    payload text NOT NULL,
    attempts smallint NOT NULL,
    reserved_at integer,
    available_at integer NOT NULL,
    created_at integer NOT NULL
);


ALTER TABLE public.jobs OWNER TO postgres;

--
-- Name: jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.jobs_id_seq OWNER TO postgres;

--
-- Name: jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;


--
-- Name: lote_medicamento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lote_medicamento (
    id_lote integer NOT NULL,
    id_presentacion integer,
    nit_farmacia character varying,
    fecha_vencimiento date,
    stock_actual integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.lote_medicamento OWNER TO postgres;

--
-- Name: lote_medicamento_id_lote_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.lote_medicamento ALTER COLUMN id_lote ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.lote_medicamento_id_lote_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: medicamento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.medicamento (
    id_medicamento integer NOT NULL,
    nombre character varying(150),
    descripcion text,
    id_categoria integer,
    id_estado integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.medicamento OWNER TO postgres;

--
-- Name: medicamento_id_medicamento_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.medicamento ALTER COLUMN id_medicamento ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.medicamento_id_medicamento_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    migration character varying(255) NOT NULL,
    batch integer NOT NULL
);


ALTER TABLE public.migrations OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.migrations_id_seq OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: motivo_consulta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.motivo_consulta (
    id_motivo integer NOT NULL,
    motivo text,
    id_estado integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.motivo_consulta OWNER TO postgres;

--
-- Name: motivo_consulta_id_motivo_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.motivo_consulta ALTER COLUMN id_motivo ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.motivo_consulta_id_motivo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: movimiento_inventario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movimiento_inventario (
    id_movimiento integer NOT NULL,
    id_lote integer,
    tipo_movimiento character varying(20),
    cantidad integer,
    fecha date,
    documento integer,
    motivo character varying(200),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_dispensacion integer,
    CONSTRAINT movimiento_inventario_tipo_movimiento_check CHECK (((tipo_movimiento)::text = ANY ((ARRAY['Ingreso'::character varying, 'Salida'::character varying, 'Reserva'::character varying])::text[])))
);


ALTER TABLE public.movimiento_inventario OWNER TO postgres;

--
-- Name: movimiento_inventario_id_movimiento_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.movimiento_inventario ALTER COLUMN id_movimiento ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.movimiento_inventario_id_movimiento_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: notificacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notificacion (
    id_notificacion bigint NOT NULL,
    doc_usuario bigint NOT NULL,
    id_cita bigint,
    titulo character varying(150) NOT NULL,
    mensaje text NOT NULL,
    tipo character varying(50) DEFAULT 'informacion'::character varying NOT NULL,
    leida boolean DEFAULT false NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.notificacion OWNER TO postgres;

--
-- Name: notificacion_id_notificacion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notificacion_id_notificacion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notificacion_id_notificacion_seq OWNER TO postgres;

--
-- Name: notificacion_id_notificacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notificacion_id_notificacion_seq OWNED BY public.notificacion.id_notificacion;


--
-- Name: receta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.receta (
    id_receta integer CONSTRAINT orden_medicamento_id_orden_not_null NOT NULL,
    id_detalle_cita integer CONSTRAINT orden_medicamento_id_detalle_cita_not_null NOT NULL,
    fecha_vencimiento date CONSTRAINT orden_medicamento_fecha_vencimiento_not_null NOT NULL,
    id_estado integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.receta OWNER TO postgres;

--
-- Name: orden_medicamento_id_orden_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.receta ALTER COLUMN id_receta ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.orden_medicamento_id_orden_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.password_reset_tokens (
    email character varying(255) NOT NULL,
    token character varying(255) NOT NULL,
    created_at timestamp(0) without time zone
);


ALTER TABLE public.password_reset_tokens OWNER TO postgres;

--
-- Name: personal_access_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.personal_access_tokens (
    id bigint NOT NULL,
    tokenable_type character varying(255) NOT NULL,
    tokenable_id bigint NOT NULL,
    name character varying(255) NOT NULL,
    token character varying(64) NOT NULL,
    abilities text,
    last_used_at timestamp(0) without time zone,
    expires_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.personal_access_tokens OWNER TO postgres;

--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.personal_access_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.personal_access_tokens_id_seq OWNER TO postgres;

--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.personal_access_tokens_id_seq OWNED BY public.personal_access_tokens.id;


--
-- Name: pqr; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pqr (
    id_pqr integer NOT NULL,
    nombre_usuario character varying(150),
    email character varying(200),
    telefono character varying(20),
    asunto character varying(50),
    mensaje text,
    respuesta text,
    id_estado integer NOT NULL,
    created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    archivo_adjunto character varying(255)
);


ALTER TABLE public.pqr OWNER TO postgres;

--
-- Name: pqr_id_pqr_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.pqr ALTER COLUMN id_pqr ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.pqr_id_pqr_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: presentacion_medicamento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.presentacion_medicamento (
    id_presentacion integer NOT NULL,
    id_medicamento integer NOT NULL,
    id_concentracion integer NOT NULL,
    id_forma_farmaceutica integer NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    precio_unitario numeric
);


ALTER TABLE public.presentacion_medicamento OWNER TO postgres;

--
-- Name: presentacion_medicamento_id_presentacion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.presentacion_medicamento ALTER COLUMN id_presentacion ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.presentacion_medicamento_id_presentacion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: prioridad; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prioridad (
    id_prioridad integer NOT NULL,
    prioridad character varying(30),
    id_estado integer NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.prioridad OWNER TO postgres;

--
-- Name: prioridad_id_prioridad_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.prioridad ALTER COLUMN id_prioridad ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.prioridad_id_prioridad_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id bigint NOT NULL,
    description character varying(255) NOT NULL,
    price numeric(10,2) NOT NULL,
    stock integer NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: remision; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.remision (
    id_remision integer NOT NULL,
    id_detalle_cita integer NOT NULL,
    tipo_remision character varying(10),
    id_especialidad integer,
    id_examen integer,
    id_prioridad integer,
    notas text NOT NULL,
    id_estado integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_categoria_examen bigint,
    requiere_ayuno boolean DEFAULT false NOT NULL,
    id_cita bigint,
    CONSTRAINT remision_tipo_remision_check CHECK (((tipo_remision)::text = ANY ((ARRAY['cita'::character varying, 'examen'::character varying])::text[])))
);


ALTER TABLE public.remision OWNER TO postgres;

--
-- Name: remision_id_remision_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.remision ALTER COLUMN id_remision ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.remision_id_remision_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: respaldo_empresa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.respaldo_empresa (
    id_respaldo integer NOT NULL,
    nit_empresa character varying(20),
    nombre_representante character varying(150),
    documento_representante character varying(50),
    telefono_representante character varying(20),
    email_representante character varying(100),
    fecha_respaldo timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.respaldo_empresa OWNER TO postgres;

--
-- Name: respaldo_empresa_id_respaldo_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.respaldo_empresa_id_respaldo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.respaldo_empresa_id_respaldo_seq OWNER TO postgres;

--
-- Name: respaldo_empresa_id_respaldo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.respaldo_empresa_id_respaldo_seq OWNED BY public.respaldo_empresa.id_respaldo;


--
-- Name: rol; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rol (
    id_rol integer NOT NULL,
    tipo_usu character varying(50),
    id_estado integer
);


ALTER TABLE public.rol OWNER TO postgres;

--
-- Name: rol_id_rol_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.rol ALTER COLUMN id_rol ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.rol_id_rol_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    id character varying(255) NOT NULL,
    user_id bigint,
    ip_address character varying(45),
    user_agent text,
    payload text NOT NULL,
    last_activity integer NOT NULL
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- Name: solicitud_cita; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.solicitud_cita (
    id_solicitud integer NOT NULL,
    id_especialidad integer,
    fecha_preferida date,
    motivo text,
    id_estado integer NOT NULL,
    id_cita integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.solicitud_cita OWNER TO postgres;

--
-- Name: solicitud_cita_id_solicitud_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.solicitud_cita ALTER COLUMN id_solicitud ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.solicitud_cita_id_solicitud_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: superadmin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.superadmin (
    documento integer NOT NULL,
    nombre character varying(50),
    usuario character varying(50),
    email character varying(100),
    contrasena character varying(500) NOT NULL,
    id_rol integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.superadmin OWNER TO postgres;

--
-- Name: tipo_cita; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipo_cita (
    id_tipo_cita integer NOT NULL,
    tipo character varying(50),
    id_estado integer NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    acceso_directo boolean DEFAULT false
);


ALTER TABLE public.tipo_cita OWNER TO postgres;

--
-- Name: tipo_cita_id_tipo_cita_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.tipo_cita ALTER COLUMN id_tipo_cita ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.tipo_cita_id_tipo_cita_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tipo_documento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipo_documento (
    id_tipo_documento integer NOT NULL,
    tipo_documento character varying(100),
    id_estado integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tipo_documento OWNER TO postgres;

--
-- Name: tipo_documento_id_tipo_documento_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.tipo_documento ALTER COLUMN id_tipo_documento ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.tipo_documento_id_tipo_documento_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tipo_licencia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipo_licencia (
    id_tipo_licencia integer NOT NULL,
    tipo character varying(50) NOT NULL,
    descripcion character varying(200) NOT NULL,
    duracion_meses integer NOT NULL,
    precio numeric(12,2) NOT NULL,
    id_estado integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tipo_licencia_duracion_meses_check CHECK ((duracion_meses > 0)),
    CONSTRAINT tipo_licencia_precio_check CHECK ((precio > (0)::numeric))
);


ALTER TABLE public.tipo_licencia OWNER TO postgres;

--
-- Name: tipo_licencia_id_tipo_licencia_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.tipo_licencia ALTER COLUMN id_tipo_licencia ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.tipo_licencia_id_tipo_licencia_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario (
    documento bigint NOT NULL,
    primer_nombre character varying(50),
    primer_apellido character varying(50),
    email character varying(100),
    telefono character varying(30),
    direccion character varying(150),
    sexo character varying(10),
    fecha_nacimiento date,
    grupo_sanguineo character varying(3),
    contrasena character varying(500) NOT NULL,
    registro_profesional character varying(50),
    nit character varying(20) NOT NULL,
    id_rol integer NOT NULL,
    id_estado integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_especialidad integer,
    segundo_nombre character varying(40),
    segundo_apellido character varying(40),
    id_farmacia character varying(20),
    examenes boolean DEFAULT false,
    id_consultorio integer,
    id_tipo_documento integer,
    CONSTRAINT usuario_sexo_check CHECK (((sexo)::text = ANY ((ARRAY['Masculino'::character varying, 'Femenino'::character varying])::text[])))
);


ALTER TABLE public.usuario OWNER TO postgres;

--
-- Name: activities id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities ALTER COLUMN id SET DEFAULT nextval('public.activities_id_seq'::regclass);


--
-- Name: failed_jobs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.failed_jobs ALTER COLUMN id SET DEFAULT nextval('public.failed_jobs_id_seq'::regclass);


--
-- Name: historial_enfermedades id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_enfermedades ALTER COLUMN id SET DEFAULT nextval('public.historial_enfermedads_id_seq'::regclass);


--
-- Name: historial_reportes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_reportes ALTER COLUMN id SET DEFAULT nextval('public.historial_reportes_id_seq'::regclass);


--
-- Name: jobs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: notificacion id_notificacion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificacion ALTER COLUMN id_notificacion SET DEFAULT nextval('public.notificacion_id_notificacion_seq'::regclass);


--
-- Name: personal_access_tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal_access_tokens ALTER COLUMN id SET DEFAULT nextval('public.personal_access_tokens_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: respaldo_empresa id_respaldo; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.respaldo_empresa ALTER COLUMN id_respaldo SET DEFAULT nextval('public.respaldo_empresa_id_respaldo_seq'::regclass);


--
-- Data for Name: Historial_admins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Historial_admins" (documento, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, email, telefono, contrasena, nit, fecha_respaldo) FROM stdin;
\.


--
-- Data for Name: activities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activities (id, title, type, icon, created_at, updated_at, channel_name) FROM stdin;
97	Nueva empresa registrada: exito	red	store	2026-02-27 22:32:32	2026-02-27 22:32:32	superadmin-feed
98	Nueva licencia registrada: 273868PNJXBH	blue	store	2026-02-27 22:32:33	2026-02-27 22:32:33	superadmin-feed
99	Licencia activada: 273868PNJXBH	blue	store	2026-02-27 22:34:18	2026-02-27 22:34:18	superadmin-feed
100	Nueva empresa registrada: Jose Luis	red	store	2026-03-02 20:16:27	2026-03-02 20:16:27	superadmin-feed
101	Nueva licencia registrada: 082219USHNAD	blue	store	2026-03-02 20:16:35	2026-03-02 20:16:35	superadmin-feed
102	Nueva empresa registrada: didier	red	store	2026-03-02 21:24:10	2026-03-02 21:24:10	superadmin-feed
103	Nueva licencia registrada: 753592JVDKUT	blue	store	2026-03-02 21:24:11	2026-03-02 21:24:11	superadmin-feed
104	Licencia activada: 753592JVDKUT	blue	store	2026-03-03 01:11:09	2026-03-03 01:11:09	superadmin-feed
105	Usuario creado: jose rodriguez	blue	person_add	2026-03-05 19:07:14	2026-03-05 19:07:14	admin-feed
106	Nueva empresa registrada: Sena	red	store	2026-03-06 18:05:08	2026-03-06 18:05:08	superadmin-feed
107	Nueva empresa registrada: Jose Lui	red	store	2026-03-06 18:22:03	2026-03-06 18:22:03	superadmin-feed
108	Nueva licencia registrada: 238493ZJPUDX	blue	store	2026-03-06 18:22:03	2026-03-06 18:22:03	superadmin-feed
109	Usuario creado: jose rodriguez	blue	person_add	2026-03-06 18:55:00	2026-03-06 18:55:00	admin-feed
110	Nueva licencia registrada: 559744GDPNTZ	blue	store	2026-03-08 16:25:05	2026-03-08 16:25:05	superadmin-feed
111	Licencia activada: 559744GDPNTZ	blue	store	2026-03-08 16:25:19	2026-03-08 16:25:19	superadmin-feed
112	Usuario creado: jose rodriguez	blue	person_add	2026-03-09 18:07:59	2026-03-09 18:07:59	admin-feed
113	Usuario editado: Luis rodriguez	orange	manage_accounts	2026-03-11 18:11:33	2026-03-11 18:11:33	admin-feed
114	Usuario creado: Juan Garcia	blue	person_add	2026-03-13 18:56:19	2026-03-13 18:56:19	admin-feed
115	Usuario editado: Juan Garcia	orange	manage_accounts	2026-03-13 18:57:53	2026-03-13 18:57:53	admin-feed
116	Cita agendada: Juan Rodriguez — 2026-03-14	teal	event_available	2026-03-13 22:08:47	2026-03-13 22:08:47	admin-feed
117	Cita agendada: Juan Rodriguez — 2026-03-14	teal	event_available	2026-03-13 22:28:43	2026-03-13 22:28:43	admin-feed
118	Cita agendada: Juan Rodriguez — 2026-03-16	teal	event_available	2026-03-16 02:19:28	2026-03-16 02:19:28	admin-feed
119	Cita agendada: Juan Rodriguez — 2026-03-16	teal	event_available	2026-03-16 15:44:15	2026-03-16 15:44:15	admin-feed
120	Cita agendada: Juan Rodriguez — 2026-03-18	teal	event_available	2026-03-16 15:45:16	2026-03-16 15:45:16	admin-feed
121	Usuario editado: David Gomez	orange	manage_accounts	2026-03-19 19:07:06	2026-03-19 19:07:06	admin-feed
122	Usuario editado: Juan Rodriguez	orange	manage_accounts	2026-03-20 02:21:13	2026-03-20 02:21:13	admin-feed
123	Cita agendada: Juan Rodriguez — 2026-03-21	teal	event_available	2026-03-20 18:39:53	2026-03-20 18:39:53	admin-feed
124	Cita agendada: Juan Rodriguez — 2026-03-21	teal	event_available	2026-03-20 19:09:43	2026-03-20 19:09:43	admin-feed
125	Licencia creada: Semestral	teal	add	2026-03-20 21:00:24	2026-03-20 21:00:24	superadmin-feed
126	Licencia creada: Trimestral	teal	add	2026-03-20 21:04:09	2026-03-20 21:04:09	superadmin-feed
127	Usuario creado: Juan Ramirez	blue	person_add	2026-03-20 21:16:36	2026-03-20 21:16:36	admin-feed
128	Cita agendada: Juan Ramirez — 2026-03-23	teal	event_available	2026-03-20 21:18:52	2026-03-20 21:18:52	admin-feed
129	Cita agendada: Juan Ramirez — 2026-03-25	teal	event_available	2026-03-20 21:42:52	2026-03-20 21:42:52	admin-feed
130	Usuario creado: Alejandro Diagama	blue	person_add	2026-03-21 21:44:04	2026-03-21 21:44:04	admin-feed
131	Usuario creado: Andres Avila	blue	person_add	2026-03-21 21:49:41	2026-03-21 21:49:41	admin-feed
132	Usuario creado: Jose Rodriguez	blue	person_add	2026-03-21 21:53:09	2026-03-21 21:53:09	admin-feed
133	Usuario creado: Nubia Avila	blue	person_add	2026-03-21 21:55:01	2026-03-21 21:55:01	admin-feed
134	Usuario editado: Andres Avila	orange	manage_accounts	2026-03-21 21:59:54	2026-03-21 21:59:54	admin-feed
135	Usuario editado: Nubia Avila	orange	manage_accounts	2026-03-21 22:00:33	2026-03-21 22:00:33	admin-feed
136	Usuario editado: Alejandro Diagama	orange	manage_accounts	2026-03-21 22:00:56	2026-03-21 22:00:56	admin-feed
137	Usuario creado: Jorge Ramirez	blue	person_add	2026-03-21 22:02:30	2026-03-21 22:02:30	admin-feed
138	Usuario editado: Jose Rodriguez	orange	manage_accounts	2026-03-21 22:50:49	2026-03-21 22:50:49	admin-feed
139	Cita agendada: Jose Rodriguez — 2026-03-22	teal	event_available	2026-03-22 00:30:17	2026-03-22 00:30:17	admin-feed
140	Usuario creado: Sandra Avila	blue	person_add	2026-03-22 01:15:20	2026-03-22 01:15:20	admin-feed
141	Cita agendada: Jose Rodriguez — 2026-03-22	teal	event_available	2026-03-22 04:15:59	2026-03-22 04:15:59	admin-feed
142	Cita agendada: Jose Rodriguez — 2026-03-23	teal	event_available	2026-03-22 22:15:07	2026-03-22 22:15:07	admin-feed
143	Cita agendada: Jose Rodriguez — 2026-03-23	teal	event_available	2026-03-23 17:12:52	2026-03-23 17:12:52	admin-feed
144	Cita agendada: Jose Rodriguez — 2026-03-23	teal	event_available	2026-03-23 13:36:24	2026-03-23 13:36:24	admin-feed
145	Cita agendada: Jose Rodriguez — 2026-03-23	teal	event_available	2026-03-23 14:50:53	2026-03-23 14:50:53	admin-feed
146	Cita cancelada — fecha: 2026-03-23	red	event_busy	2026-03-23 14:51:38	2026-03-23 14:51:38	admin-feed
147	Cita agendada: Jose Rodriguez — 2026-03-23	teal	event_available	2026-03-23 15:26:33	2026-03-23 15:26:33	admin-feed
148	Cita agendada: Jose Rodriguez — 2026-03-25	teal	event_available	2026-03-24 13:59:12	2026-03-24 13:59:12	admin-feed
149	Cita agendada: Jose Rodriguez — 2026-04-03	teal	event_available	2026-03-26 13:19:56	2026-03-26 13:19:56	admin-feed
150	Cita agendada: Jose Rodriguez — 2026-03-27	teal	event_available	2026-03-26 17:11:07	2026-03-26 17:11:07	admin-feed
\.


--
-- Data for Name: cache; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cache (key, value, expiration) FROM stdin;
\.


--
-- Data for Name: cache_locks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cache_locks (key, owner, expiration) FROM stdin;
\.


--
-- Data for Name: categoria_examen; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categoria_examen (id_categoria_examen, categoria, id_estado, created_at, updated_at, requiere_ayuno) FROM stdin;
2	Orina	1	2026-03-06 16:51:39	2026-03-06 16:51:39	f
3	Fisicos	1	2026-03-06 16:51:59	2026-03-06 16:51:59	f
1	Sangre	1	2026-03-01 20:01:15	2026-03-01 20:01:15	t
\.


--
-- Data for Name: categoria_medicamento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categoria_medicamento (id_categoria, categoria, id_estado, created_at, updated_at) FROM stdin;
1	Antibioticos	1	2026-03-01 20:02:31	2026-03-06 16:53:14
2	Analgésicos	1	2026-03-06 16:53:26	2026-03-06 16:53:26
3	Antialérgicos	1	2026-03-06 16:53:51	2026-03-06 16:53:51
\.


--
-- Data for Name: cita; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cita (id_cita, doc_paciente, doc_medico, fecha, hora_inicio, hora_fin, motivo, id_estado, created_at, updated_at, recordatorio_enviado, tipo_evento, id_especialidad, id_examen, id_motivo) FROM stdin;
16	121212121	11047812	2026-03-22	08:30:00	09:00:00	\N	11	2026-03-22 00:30:07	2026-03-22 17:17:42	f	consulta	1	\N	1
17	121212121	12121211	2026-03-22	12:30:00	13:00:00	ayuda	11	2026-03-22 04:15:56	2026-03-22 17:17:42	f	consulta	6	\N	18
18	121212121	11047812	2026-03-23	10:30:00	11:00:00	\N	11	2026-03-22 22:14:58	2026-03-23 00:02:02	f	consulta	1	\N	1
19	121212121	11047812	2026-03-23	13:30:00	14:00:00	tambien siento perdida del equilibrio	11	2026-03-23 17:12:42	2026-03-23 17:12:57	f	consulta	1	\N	1
20	121212121	11047812	2026-03-23	15:00:00	15:30:00	perdida del equilibrio	16	2026-03-23 13:36:16	2026-03-23 13:38:05	f	consulta	1	\N	1
21	121212121	11047812	2026-03-23	16:00:00	16:30:00	\N	11	2026-03-23 14:50:51	2026-03-23 14:51:38	f	consulta	1	\N	1
23	121212121	11047812	2026-03-23	16:00:00	16:30:00	\N	10	2026-03-23 15:26:31	2026-03-23 16:25:30	f	consulta	1	\N	1
25	121212121	11047812	2026-03-25	10:30:00	11:00:00	\N	11	2026-03-24 13:59:10	2026-03-25 11:11:17	f	consulta	1	\N	11
30	121212121	11047812	2026-03-31	14:00:00	\N	xxxxxxx	9	2026-03-26 13:37:37	2026-03-26 13:37:37	f	remision	1	\N	1
26	121212121	11047812	2026-04-10	10:30:00	11:00:00	\N	10	2026-03-26 13:19:53	2026-03-26 13:37:37	f	consulta	1	\N	1
24	121212121	12121211	2026-03-28	10:30:00	11:00:00	necesita una citologia	10	2026-03-23 16:25:30	2026-03-26 15:00:28	f	remision	6	\N	\N
31	121212121	12121211	2026-03-27	10:30:00	11:00:00	\N	11	2026-03-26 17:11:05	2026-03-27 13:55:56	f	consulta	6	\N	1
\.


--
-- Data for Name: ciudad; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ciudad (codigo_postal, nombre, id_departamento, created_at, updated_at, id_estado) FROM stdin;
730001	Ibagué	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730024	Alpujarra	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730026	Alvarado	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730030	Ambalema	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730043	Anzoátegui	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730055	Armero	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730067	Ataco	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730124	Cajamarca	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730148	Carmen de Apicalá	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730152	Casabianca	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730168	Chaparral	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730200	Coello	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730217	Coyaima	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730226	Cunday	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730236	Dolores	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730268	Espinal	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730270	Falan	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730275	Flandes	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730283	Fresno	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730319	Guamo	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730347	Herveo	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730349	Honda	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730352	Icononzo	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730408	Lérida	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730411	Líbano	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730443	Mariquita	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730449	Melgar	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730461	Murillo	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730483	Natagaima	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730504	Ortega	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730520	Palocabildo	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730547	Piedras	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730555	Planadas	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730563	Prado	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730585	Purificación	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730616	Rioblanco	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730622	Roncesvalles	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730624	Rovira	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730671	Saldaña	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730675	San Antonio	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730678	San Luis	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730686	Santa Isabel	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730770	Suárez	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730854	Valle de San Juan	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730861	Venadillo	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730870	Villahermosa	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
730873	Villarrica	73	2026-02-18 09:16:48.909778	2026-03-01 20:48:46	1
73221	Medellin	11	2026-03-27 13:25:21	2026-03-27 13:25:21	1
\.


--
-- Data for Name: concentracion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.concentracion (id_concentracion, concentracion) FROM stdin;
1	500mg
2	10g
\.


--
-- Data for Name: consultorio; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.consultorio (id_consultorio, numero_consultorio) FROM stdin;
1	101
2	102
3	103
4	104
5	105
\.


--
-- Data for Name: departamento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departamento ("codigo_DANE", nombre, created_at, updated_at, id_estado) FROM stdin;
73	Tolima	2026-02-18 09:10:51.975251	2026-03-01 20:48:46	1
18	Caldas	2026-03-06 16:56:25	2026-03-06 16:56:25	1
11	Antioquia	2026-03-27 13:24:47	2026-03-27 13:24:47	1
\.


--
-- Data for Name: dispensacion_farmacia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dispensacion_farmacia (id_dispensacion, id_detalle_receta, nit_farmacia, cantidad, fecha_dispensacion, documento_farmaceutico, id_estado, created_at, updated_at) FROM stdin;
2	6	298765432-1	30	2026-03-27 10:48:24	11111111	1	2026-03-27 10:48:24	2026-03-27 10:48:24
\.


--
-- Data for Name: empresa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.empresa (nit, nombre, email_contacto, telefono, direccion, documento_representante, nombre_representante, telefono_representante, email_representante, id_ciudad, id_estado, created_at, updated_at) FROM stdin;
909090909-1	exito	esquivel7809@gmail.com	3213173993	cr 5 n 12 34 bloque 2	90909090	cesar esquivel	3211231222	esquivel7809@gmail.com	730001	1	2026-02-27 22:32:32	2026-02-27 22:32:32
900123456-5	Empresa Uno	empresa@gmail.com	3124567899	calle 14 # 2-42	1103999991	Carlos Rodriguez	3124567800	carlos@gmail.com	730236	5	2026-03-06 18:22:03	2026-03-20 21:05:32
\.


--
-- Data for Name: empresa_licencia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.empresa_licencia (id_empresa_licencia, nit, id_tipo_licencia, fecha_inicio, fecha_fin, id_estado, created_at, updated_at) FROM stdin;
238493ZJPUDX	900123456-5	23	2026-02-02	2027-02-02	1	2026-03-06 18:22:03	2026-03-06 18:50:26
559744GDPNTZ	909090909-1	23	2026-03-08	2027-03-08	1	2026-03-08 16:25:04	2026-03-08 16:25:18
\.


--
-- Data for Name: enfermedades; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.enfermedades (codigo_icd, nombre, descripcion, created_at, updated_at) FROM stdin;
I10	Hipertensión esencial	Elevación persistente de la presión arterial sin causa identificable. Puede ser asintomática, pero aumenta el riesgo de infarto, accidente cerebrovascular y daño renal. Requiere control periódico y manejo con cambios en el estilo de vida y/o medicamentos.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
E11	Diabetes mellitus tipo 2	Enfermedad metabólica caracterizada por hiperglucemia debido a resistencia a la insulina. Se asocia con obesidad, sed excesiva, poliuria y fatiga. Puede causar complicaciones como neuropatía, retinopatía y enfermedad renal.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
J45	Asma	Enfermedad inflamatoria crónica de las vías respiratorias que causa episodios de disnea, sibilancias y tos. Desencadenada por alérgenos, ejercicio o infecciones. Generalmente reversible con tratamiento.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
J00	Resfriado común	Infección viral leve del tracto respiratorio superior. Produce congestión nasal, estornudos, dolor de garganta y malestar general. Suele resolverse espontáneamente en pocos días.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
J06	Infección respiratoria aguda	Conjunto de infecciones de vías respiratorias superiores de origen viral o bacteriano. Incluye síntomas como tos, fiebre y congestión. Frecuente en atención primaria.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
K21	Enfermedad por reflujo gastroesofágico	Paso del contenido gástrico hacia el esófago causando ardor retroesternal. Puede generar complicaciones como esofagitis si no se trata adecuadamente.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
F41	Trastornos de ansiedad	Condiciones caracterizadas por preocupación excesiva, nerviosismo y síntomas físicos como palpitaciones o sudoración. Impactan la calidad de vida y pueden requerir terapia y medicación.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
F32	Episodio depresivo	Trastorno del estado de ánimo con tristeza persistente, pérdida de interés, fatiga y alteraciones del sueño. Puede afectar el funcionamiento diario y requiere evaluación clínica.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
M54	Dolor de espalda	Dolor localizado en la región lumbar o dorsal. Frecuentemente asociado a mala postura, esfuerzo físico o lesiones musculares. Es una de las principales causas de consulta médica.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
M17	Artrosis de rodilla	Degeneración del cartílago articular que produce dolor, rigidez y limitación funcional. Común en adultos mayores y personas con sobrepeso.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
E78	Hiperlipidemia	Elevación de colesterol y/o triglicéridos en sangre. Factor de riesgo importante para enfermedades cardiovasculares. Generalmente asintomática.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
J18	Neumonía	Infección pulmonar que provoca fiebre, tos con expectoración y dificultad respiratoria. Puede ser grave en niños, adultos mayores o pacientes con comorbilidades.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
A09	Gastroenteritis infecciosa	Inflamación del tracto gastrointestinal causada por virus, bacterias o parásitos. Se presenta con diarrea, vómitos y deshidratación.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
N39	Infección del tracto urinario	Infección bacteriana frecuente, especialmente en mujeres. Produce ardor al orinar, urgencia urinaria y dolor suprapúbico.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
B34	Infección viral no especificada	Proceso infeccioso causado por virus sin identificación específica. Se presenta con síntomas generales como fiebre, malestar y fatiga.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
G43	Migraña	Cefalea intensa, pulsátil, a menudo unilateral, acompañada de náuseas y sensibilidad a la luz o sonido. Puede afectar la funcionalidad diaria.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
J30	Rinitis alérgica	Inflamación de la mucosa nasal por alérgenos como polvo o polen. Produce estornudos, congestión y secreción nasal.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
K29	Gastritis	Inflamación de la mucosa gástrica que causa dolor epigástrico, náuseas y sensación de llenura. Asociada a infección por H. pylori o uso de antiinflamatorios.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
K02	Caries dental	Destrucción progresiva del esmalte dental por bacterias. Puede causar dolor, infección y pérdida del diente si no se trata.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
M79	Dolor muscular	Dolor en músculos debido a sobreuso, tensión o infección. Puede ser localizado o generalizado.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
L20	Dermatitis atópica	Enfermedad inflamatoria crónica de la piel con picazón intensa, sequedad y lesiones recurrentes. Frecuente en niños.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
L30	Dermatitis no especificada	Inflamación cutánea con enrojecimiento, picazón o descamación. Puede tener múltiples causas.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
B35	Micosis superficial	Infección por hongos en piel, uñas o cabello. Produce picazón, descamación y lesiones visibles.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
E66	Obesidad	Exceso de grasa corporal que aumenta el riesgo de enfermedades cardiovasculares, diabetes y problemas articulares.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
D50	Anemia por deficiencia de hierro	Disminución de hemoglobina por falta de hierro. Produce fatiga, palidez y debilidad.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
J44	EPOC	Enfermedad pulmonar crónica que limita el flujo de aire. Asociada principalmente al tabaquismo.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
K80	Cálculos biliares	Formación de piedras en la vesícula biliar. Puede causar dolor abdominal intenso después de comer.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
K40	Hernia inguinal	Protrusión de tejido a través de la pared abdominal en la región inguinal. Puede causar dolor o masa visible.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
N20	Cálculo renal	Formación de piedras en riñón que causan dolor intenso tipo cólico y dificultad para orinar.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
M10	Gota	Artritis causada por acumulación de ácido úrico. Provoca dolor súbito e inflamación en articulaciones.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
M81	Osteoporosis	Disminución de la densidad ósea que aumenta el riesgo de fracturas, especialmente en adultos mayores.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
I20	Angina de pecho	Dolor torácico por disminución del flujo sanguíneo al corazón. Puede ser un signo de enfermedad coronaria.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
I21	Infarto agudo de miocardio	Obstrucción del flujo sanguíneo al corazón causando daño al músculo cardíaco. Es una emergencia médica.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
I50	Insuficiencia cardíaca	El corazón no bombea sangre adecuadamente. Produce fatiga, edema y dificultad respiratoria.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
I63	Accidente cerebrovascular isquémico	Interrupción del flujo sanguíneo cerebral. Puede causar parálisis, dificultad para hablar o pérdida de conciencia.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
G40	Epilepsia	Trastorno neurológico con convulsiones recurrentes debido a actividad eléctrica anormal en el cerebro.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
G47	Trastornos del sueño	Alteraciones como insomnio o somnolencia excesiva que afectan el descanso y la salud general.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
H10	Conjuntivitis	Inflamación ocular con enrojecimiento, secreción y picazón. Puede ser infecciosa o alérgica.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
H66	Otitis media	Infección del oído medio que causa dolor, fiebre y pérdida auditiva temporal.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
J02	Faringitis aguda	Inflamación de la garganta con dolor al tragar, fiebre y enrojecimiento.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
J04	Laringitis	Inflamación de la laringe que produce ronquera o pérdida de la voz.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
K59	Estreñimiento	Disminución de la frecuencia de evacuaciones o dificultad para defecar.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
R51	Dolor de cabeza	Síntoma frecuente que puede tener múltiples causas, desde tensión hasta enfermedades más graves.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
R10	Dolor abdominal	Dolor en la región abdominal que puede indicar diversas patologías.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
R05	Tos	Reflejo protector de las vías respiratorias, puede ser agudo o crónico.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
R50	Fiebre	Elevación de la temperatura corporal, generalmente por infección.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
Z00	Examen médico general	Evaluación integral del estado de salud sin presencia de enfermedad específica.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
Z23	Vacunación	Administración de vacunas para prevenir enfermedades infecciosas.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
Z71	Consejería médica	Orientación profesional sobre salud, prevención o tratamiento.	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
Z76	Contacto con servicios de salud	Consulta por motivos administrativos o seguimiento sin enfermedad activa	2026-03-19 13:04:11.85589	2026-03-19 13:04:11.85589
E10	Diabetes mellitus tipo 1	Enfermedad autoinmune caracterizada por destrucción de células beta pancreáticas. Produce déficit absoluto de insulina, con síntomas como poliuria, polidipsia y pérdida de peso. Requiere insulinoterapia de por vida.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
E13	Otros tipos de diabetes mellitus	Incluye formas secundarias de diabetes causadas por enfermedades pancreáticas, medicamentos o alteraciones genéticas.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
E11.9	Diabetes tipo 2 sin complicaciones	Forma más común de diabetes, sin evidencia de daño en órganos. Requiere control glicémico continuo.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
E11.65	Diabetes tipo 2 con hiperglucemia	Diabetes mal controlada con niveles elevados de glucosa, aumentando riesgo de complicaciones.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
E11.4	Diabetes tipo 2 con neuropatía	Daño en nervios periféricos causado por hiperglucemia crónica. Produce dolor, hormigueo o pérdida de sensibilidad.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
E11.3	Diabetes tipo 2 con retinopatía	Complicación ocular que puede causar pérdida de visión progresiva.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
I15	Hipertensión secundaria	Elevación de la presión arterial causada por una condición subyacente como enfermedad renal o endocrina.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
I11	Enfermedad cardíaca hipertensiva	Daño estructural del corazón debido a hipertensión crónica. Puede causar insuficiencia cardíaca.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
I12	Enfermedad renal hipertensiva	Daño progresivo de los riñones asociado a hipertensión arterial.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
E03	Hipotiroidismo	Disminución de la función tiroidea que causa fatiga, aumento de peso, piel seca y sensibilidad al frío.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
E05	Hipertiroidismo	Exceso de hormonas tiroideas que produce pérdida de peso, ansiedad, taquicardia y sudoración.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
E04	Bocio	Aumento del tamaño de la glándula tiroides. Puede asociarse a alteraciones hormonales.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
E16	Hipoglucemia	Disminución anormal de glucosa en sangre. Produce sudoración, confusión y riesgo de pérdida de conciencia.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
E87	Trastornos de electrolitos	Alteraciones en sodio, potasio u otros electrolitos que afectan funciones vitales.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
J20	Bronquitis aguda	Inflamación de los bronquios generalmente por infección viral. Produce tos persistente y expectoración.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
J41	Bronquitis crónica	Inflamación persistente de los bronquios asociada a tabaquismo. Parte del EPOC.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
J44.1	EPOC con exacerbación	Empeoramiento agudo de síntomas respiratorios en pacientes con EPOC. Puede requerir hospitalización.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
J12	Neumonía viral	Infección pulmonar causada por virus. Puede ser leve o grave según el paciente.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
J15	Neumonía bacteriana	Infección pulmonar causada por bacterias. Suele requerir antibióticos.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
J46	Estado asmático	Crisis grave de asma que no responde al tratamiento habitual. Es una urgencia médica.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
A15	Tuberculosis pulmonar	Infección bacteriana crónica que afecta principalmente los pulmones. Produce tos prolongada, fiebre y pérdida de peso.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
B20	VIH	Infección viral que debilita el sistema inmunológico, aumentando el riesgo de infecciones oportunistas.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
B18	Hepatitis viral crónica	Inflamación del hígado por infección viral persistente. Puede evolucionar a cirrosis.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
K70	Enfermedad hepática alcohólica	Daño hepático causado por consumo excesivo de alcohol. Incluye hepatitis y cirrosis.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
K74	Cirrosis hepática	Daño crónico del hígado con fibrosis. Puede causar insuficiencia hepática.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
K25	Úlcera gástrica	Lesión en la mucosa del estómago que causa dolor y riesgo de sangrado.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
K26	Úlcera duodenal	Lesión en el duodeno asociada a H. pylori o uso de medicamentos.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
K52	Colitis	Inflamación del colon con diarrea, dolor abdominal y urgencia evacuatoria.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
K50	Enfermedad de Crohn	Enfermedad inflamatoria intestinal crónica que afecta cualquier parte del tracto digestivo.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
K51	Colitis ulcerativa	Inflamación crónica del colon que causa diarrea con sangre y dolor abdominal.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
N18	Enfermedad renal crónica	Pérdida progresiva de la función renal. Puede requerir diálisis en etapas avanzadas.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
N17	Insuficiencia renal aguda	Disminución súbita de la función renal. Es potencialmente reversible si se trata a tiempo.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
N40	Hiperplasia prostática benigna	Aumento del tamaño de la próstata que dificulta la micción en hombres mayores.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
N41	Prostatitis	Inflamación de la próstata, generalmente por infección. Produce dolor y dificultad urinaria.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
N30	Cistitis	Inflamación de la vejiga, generalmente infecciosa. Produce dolor y ardor al orinar.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
O80	Parto normal	Proceso de nacimiento sin complicaciones. Código usado en registros clínicos.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
O82	Parto por cesárea	Nacimiento mediante intervención quirúrgica.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
O24	Diabetes gestacional	Alteración de la glucosa durante el embarazo. Puede afectar madre y feto.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
O13	Hipertensión gestacional	Elevación de presión arterial durante el embarazo sin daño orgánico.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
O14	Preeclampsia	Complicación del embarazo con hipertensión y daño a órganos. Puede ser grave.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
F10	Trastornos por consumo de alcohol	Uso problemático de alcohol que afecta la salud física y mental.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
F17	Dependencia del tabaco	Adicción a la nicotina con impacto en múltiples órganos.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
F20	Esquizofrenia	Trastorno mental grave con alteraciones del pensamiento, percepción y comportamiento.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
F31	Trastorno bipolar	Alteración del estado de ánimo con episodios de manía y depresión.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
F43	Trastorno por estrés	Respuesta psicológica a eventos traumáticos. Puede incluir ansiedad intensa.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
F45	Trastornos somatomorfos	Síntomas físicos sin causa médica clara, asociados a factores psicológicos.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
G30	Enfermedad de Alzheimer	Trastorno neurodegenerativo progresivo que afecta la memoria y funciones cognitivas.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
G20	Enfermedad de Parkinson	Trastorno neurológico que afecta el movimiento, causando temblores y rigidez.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
G62	Neuropatía periférica	Daño a nervios periféricos que causa debilidad, dolor o entumecimiento.	2026-03-19 13:04:34.489985	2026-03-19 13:04:34.489985
I25	Enfermedad isquémica crónica del corazón	Disminución persistente del flujo sanguíneo al corazón, generalmente por aterosclerosis. Puede causar angina e infarto.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
I48	Fibrilación auricular	Arritmia cardíaca frecuente caracterizada por ritmo irregular. Aumenta el riesgo de accidente cerebrovascular.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
I49	Arritmias cardíacas	Alteraciones del ritmo cardíaco que pueden ser benignas o potencialmente graves.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
I70	Aterosclerosis	Acumulación de placas de grasa en las arterias que reduce el flujo sanguíneo. Principal causa de enfermedades cardiovasculares.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
I71	Aneurisma de aorta	Dilatación anormal de la aorta con riesgo de ruptura. Puede ser mortal si no se trata.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
I73	Enfermedad vascular periférica	Alteración del flujo sanguíneo en extremidades, causando dolor y riesgo de ulceraciones.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
I80	Tromboflebitis	Inflamación de una vena asociada a formación de coágulos. Puede causar dolor e hinchazón.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
I82	Trombosis venosa profunda	Formación de coágulos en venas profundas, generalmente en piernas. Riesgo de embolia pulmonar.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
I26	Embolia pulmonar	Obstrucción de arterias pulmonares por un coágulo. Es una emergencia médica.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
C34	Cáncer de pulmón	Tumor maligno del pulmón, frecuentemente asociado al tabaquismo. Puede causar tos persistente y pérdida de peso.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
C50	Cáncer de mama	Neoplasia maligna del tejido mamario. Es uno de los cánceres más frecuentes en mujeres.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
C61	Cáncer de próstata	Tumor maligno en la próstata. Puede ser asintomático en etapas iniciales.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
C18	Cáncer de colon	Neoplasia maligna del intestino grueso. Puede causar sangrado y cambios en el hábito intestinal.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
C16	Cáncer gástrico	Tumor maligno del estómago. Puede producir dolor abdominal y pérdida de peso.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
C22	Cáncer de hígado	Neoplasia hepática asociada a cirrosis o hepatitis crónica.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
C25	Cáncer de páncreas	Tumor agresivo del páncreas con síntomas tardíos como ictericia y dolor abdominal.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
C53	Cáncer de cuello uterino	Tumor maligno asociado a infección por VPH. Prevenible con tamizaje.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
C64	Cáncer de riñón	Neoplasia renal que puede causar hematuria y dolor lumbar.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
C67	Cáncer de vejiga	Tumor maligno que suele manifestarse con sangre en la orina.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
D64	Anemia no especificada	Disminución de la hemoglobina por diversas causas. Produce fatiga y debilidad.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
D69	Trastornos hemorrágicos	Alteraciones de la coagulación que aumentan el riesgo de sangrado.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
M05	Artritis reumatoide	Enfermedad autoinmune que causa inflamación crónica de las articulaciones. Produce dolor y deformidad.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
M32	Lupus eritematoso sistémico	Enfermedad autoinmune que afecta múltiples órganos como piel, riñones y articulaciones.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
M34	Esclerosis sistémica	Enfermedad autoinmune que provoca endurecimiento de la piel y órganos internos.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
M33	Dermatomiositis	Enfermedad inflamatoria que afecta músculos y piel. Produce debilidad muscular.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
M35	Síndrome de Sjögren	Trastorno autoinmune que causa sequedad en ojos y boca.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
M45	Espondilitis anquilosante	Inflamación crónica de la columna vertebral que causa rigidez y dolor.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
M25	Trastornos articulares	Dolor o disfunción en articulaciones por diversas causas.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
G35	Esclerosis múltiple	Enfermedad autoinmune que afecta el sistema nervioso central, causando debilidad y problemas de coordinación.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
G60	Neuropatía hereditaria	Trastornos genéticos que afectan los nervios periféricos.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
G93	Trastornos cerebrales	Alteraciones del cerebro por diversas causas, incluyendo infecciones o trauma.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
G25	Otros trastornos del movimiento	Alteraciones motoras como temblores o tics.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
H40	Glaucoma	Aumento de la presión intraocular que puede causar pérdida de visión.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
H25	Catarata	Opacidad del cristalino que provoca visión borrosa. Frecuente en adultos mayores.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
H90	Pérdida auditiva	Disminución de la capacidad auditiva, puede ser parcial o total.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
H81	Trastornos del equilibrio	Alteraciones del oído interno que causan vértigo o mareo.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
J32	Sinusitis crónica	Inflamación persistente de los senos paranasales con congestión y dolor facial.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
J31	Rinitis crónica	Inflamación persistente de la mucosa nasal.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
J37	Laringitis crónica	Inflamación prolongada de la laringe con cambios en la voz.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
K58	Síndrome de intestino irritable	Trastorno funcional intestinal con dolor abdominal y cambios en el tránsito intestinal.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
K76	Enfermedad hepática no alcohólica	Acumulación de grasa en el hígado no relacionada con alcohol. Asociada a obesidad.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
K85	Pancreatitis aguda	Inflamación súbita del páncreas con dolor abdominal intenso.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
K86	Pancreatitis crónica	Inflamación persistente del páncreas que afecta la digestión.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
N92	Trastornos menstruales	Alteraciones en la frecuencia o cantidad del sangrado menstrual.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
N94	Dolor pélvico	Dolor en la región pélvica asociado a múltiples causas ginecológicas.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
O03	Aborto espontáneo	Pérdida del embarazo antes de las 20 semanas.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
O99	Complicaciones del embarazo	Condiciones médicas que afectan el embarazo y requieren seguimiento.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
R42	Mareos	Sensación de inestabilidad o vértigo con múltiples causas posibles.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
R06	Dificultad respiratoria	Sensación de falta de aire asociada a enfermedades pulmonares o cardíacas.	2026-03-19 13:06:24.393118	2026-03-19 13:06:24.393118
U07.1	COVID-19	Infección causada por el virus SARS-CoV-2. Puede variar desde síntomas leves hasta enfermedad grave con compromiso respiratorio.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
A90	Dengue	Enfermedad viral transmitida por mosquitos. Produce fiebre alta, dolor muscular y riesgo de complicaciones hemorrágicas.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
A91	Dengue grave	Forma severa del dengue con sangrado, shock o daño a órganos. Requiere atención urgente.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
A82	Rabia	Enfermedad viral grave transmitida por mordedura de animales infectados. Es casi siempre mortal si no se trata a tiempo.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
A33	Tétanos	Infección bacteriana que causa rigidez muscular y espasmos. Asociada a heridas contaminadas.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
A37	Tos ferina	Infección bacteriana que causa tos intensa y prolongada. Frecuente en niños.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
A50	Sífilis congénita	Infección transmitida de madre a hijo durante el embarazo. Puede causar múltiples complicaciones.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
A51	Sífilis	Infección de transmisión sexual causada por bacteria. Evoluciona en etapas si no se trata.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
A54	Gonorrea	Infección bacteriana de transmisión sexual que afecta tracto genital.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
A56	Clamidia	Infección de transmisión sexual frecuentemente asintomática. Puede causar infertilidad si no se trata.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
B01	Varicela	Infección viral que causa erupción cutánea vesicular y fiebre. Frecuente en la infancia.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
B02	Herpes zóster	Reactivación del virus varicela que produce lesiones dolorosas en la piel.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
B00	Herpes simple	Infección viral que causa ampollas en labios o genitales.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
B07	Verrugas virales	Lesiones benignas de la piel causadas por virus del papiloma humano.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
B08	Otras infecciones virales de la piel	Incluye diversas infecciones cutáneas virales.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
B86	Escabiosis	Infestación por ácaros que causa picazón intensa en la piel.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
B85	Pediculosis	Infestación por piojos en cuero cabelludo o cuerpo. Frecuente en niños.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
L70	Acné	Enfermedad inflamatoria de la piel que afecta folículos pilosos. Frecuente en adolescentes.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
L40	Psoriasis	Enfermedad autoinmune que causa placas escamosas en la piel.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
L50	Urticaria	Reacción alérgica que produce ronchas y picazón en la piel.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
L60	Trastornos de las uñas	Alteraciones en forma, color o estructura de las uñas.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
L72	Quistes cutáneos	Lesiones benignas llenas de material sebáceo bajo la piel.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
T14	Traumatismo	Lesiones físicas causadas por golpes o accidentes.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
T81	Complicaciones postquirúrgicas	Problemas derivados de procedimientos quirúrgicos como infecciones o sangrado.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
T78	Reacciones alérgicas	Respuesta exagerada del sistema inmune ante sustancias externas.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
T63	Intoxicación por picadura	Reacción a venenos de insectos o animales.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
T50	Intoxicación por medicamentos	Efectos adversos por sobredosis o uso incorrecto de fármacos.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
R07	Dolor torácico	Síntoma que puede indicar desde problemas musculares hasta enfermedades cardíacas graves.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
R11	Náuseas y vómitos	Síntomas gastrointestinales comunes en múltiples enfermedades.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
R19	Síntomas digestivos	Incluye distensión, gases y otros trastornos abdominales.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
R63	Alteraciones del apetito	Aumento o disminución del apetito asociado a diversas condiciones.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
R53	Fatiga	Sensación persistente de cansancio que puede tener múltiples causas.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
R41	Alteración cognitiva	Problemas de memoria, concentración o pensamiento.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
R45	Alteraciones emocionales	Cambios en el estado emocional como irritabilidad o tristeza.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
R73	Prediabetes	Nivel de glucosa elevado que no alcanza criterios de diabetes. Factor de riesgo importante.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
Z01	Examen médico especializado	Evaluación médica específica según área clínica.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
Z30	Planificación familiar	Atención relacionada con métodos anticonceptivos.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
Z34	Control de embarazo	Seguimiento médico durante el embarazo.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
Z39	Atención postparto	Cuidado médico posterior al parto.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
Z48	Seguimiento postquirúrgico	Control médico después de una cirugía.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
Z51	Atención médica continua	Tratamientos prolongados como quimioterapia o diálisis.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
Z72	Hábitos de riesgo	Factores como sedentarismo, tabaquismo o mala alimentación.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
Z73	Estrés	Respuesta física y emocional ante situaciones demandantes.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
Z74	Dependencia	Necesidad de ayuda para actividades diarias.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
Z75	Problemas sociales	Condiciones sociales que afectan la salud.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
Z99	Dependencia de dispositivos médicos	Uso de equipos como oxígeno o marcapasos.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
P07	Bajo peso al nacer	Condición en recién nacidos con peso inferior al normal.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
P22	Dificultad respiratoria neonatal	Problemas respiratorios en recién nacidos.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
P59	Ictericia neonatal	Coloración amarilla en recién nacidos por acumulación de bilirrubina.	2026-03-19 13:07:56.263918	2026-03-19 13:07:56.263918
E66.9	Obesidad no especificada	Acumulación excesiva de grasa corporal sin clasificación específica. Aumenta el riesgo de enfermedades cardiovasculares y metabólicas.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
E88	Otros trastornos metabólicos	Alteraciones metabólicas que afectan el procesamiento de nutrientes y energía.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
E83	Trastornos del metabolismo mineral	Alteraciones en calcio, fósforo u otros minerales esenciales.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
E86	Deshidratación	Déficit de líquidos corporales que puede causar debilidad, mareos y alteraciones electrolíticas.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
I95	Hipotensión	Disminución de la presión arterial que puede causar mareo, debilidad o síncope.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
I51	Otras enfermedades del corazón	Incluye diversas alteraciones cardíacas no clasificadas específicamente.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
I27	Hipertensión pulmonar	Elevación de la presión en arterias pulmonares, causando dificultad respiratoria.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
I42	Cardiomiopatía	Enfermedad del músculo cardíaco que afecta su capacidad de bombeo.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
J21	Bronquiolitis	Infección respiratoria común en lactantes que causa dificultad respiratoria.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
J98	Otros trastornos respiratorios	Alteraciones respiratorias no especificadas.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
J93	Neumotórax	Presencia de aire en la cavidad pleural que colapsa el pulmón. Es una urgencia médica.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
J95	Complicaciones respiratorias postquirúrgicas	Problemas respiratorios tras procedimientos quirúrgicos.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
K35	Apendicitis aguda	Inflamación del apéndice que causa dolor abdominal y requiere cirugía urgente.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
K37	Apendicitis no especificada	Inflamación del apéndice sin clasificación clara.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
K42	Hernia umbilical	Protrusión de contenido abdominal a través del ombligo.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
K43	Hernia ventral	Hernia en la pared abdominal anterior.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
K60	Fisura anal	Pequeña lesión en el ano que causa dolor al evacuar.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
K62	Trastornos del recto	Incluye diversas patologías rectales como inflamación o sangrado.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
N10	Infección renal aguda	Infección del riñón que puede causar fiebre, dolor lumbar y malestar general.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
N11	Infección renal crónica	Infección persistente del riñón que puede dañar su función.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
N19	Insuficiencia renal no especificada	Disminución de la función renal sin causa definida.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
N76	Infección vaginal	Inflamación o infección del tracto vaginal con flujo y molestias.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
N77	Vaginitis	Inflamación vaginal causada por infecciones o irritantes.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
O21	Vómitos del embarazo	Náuseas y vómitos asociados al embarazo, especialmente en el primer trimestre.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
O26	Complicaciones del embarazo	Condiciones médicas que afectan el embarazo sin clasificación específica.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
O36	Problemas fetales	Condiciones que afectan el bienestar del feto durante el embarazo.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
F06	Trastornos mentales orgánicos	Alteraciones mentales causadas por enfermedades físicas.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
F07	Trastornos de personalidad orgánicos	Cambios en la personalidad debido a daño cerebral.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
F50	Trastornos alimentarios	Alteraciones en la conducta alimentaria como anorexia o bulimia.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
F51	Trastornos del sueño no orgánicos	Problemas de sueño relacionados con factores psicológicos.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
G44	Otros tipos de cefalea	Incluye cefalea tensional y otras variantes no migrañosas.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
G56	Síndrome del túnel carpiano	Compresión del nervio mediano que causa dolor y hormigueo en la mano.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
G57	Neuropatías de extremidades inferiores	Afectación de nervios en piernas con dolor o debilidad.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
H52	Trastornos de la refracción	Problemas visuales como miopía, hipermetropía o astigmatismo.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
H60	Otitis externa	Infección del canal auditivo externo, conocida como “oído de nadador”.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
H72	Perforación del tímpano	Ruptura de la membrana timpánica que puede afectar la audición.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
L01	Impétigo	Infección bacteriana de la piel con lesiones costrosas. Frecuente en niños.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
L02	Absceso cutáneo	Acumulación de pus en la piel por infección.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
L03	Celulitis	Infección bacteriana de la piel y tejidos subcutáneos.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
L98	Otros trastornos de la piel	Incluye diversas afecciones cutáneas no especificadas.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
M13	Otras artritis	Inflamación articular de diversas causas no clasificadas.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
M19	Artrosis generalizada	Degeneración articular que afecta múltiples articulaciones.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
M51	Trastornos de discos intervertebrales	Problemas como hernias discales que causan dolor y limitación.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
M62	Trastornos musculares	Alteraciones del músculo que afectan fuerza o función.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
R00	Alteraciones del pulso	Cambios en la frecuencia o ritmo cardíaco detectables clínicamente.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
R04	Hemorragia	Sangrado de diversas localizaciones que puede ser leve o grave.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
R13	Dificultad para tragar	Problema al deglutir alimentos o líquidos.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
R20	Alteraciones de la sensibilidad	Cambios como hormigueo, entumecimiento o dolor anormal.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
R25	Movimientos involuntarios	Presencia de espasmos, temblores o tics.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
R60	Edema	Acumulación de líquido en tejidos que causa hinchazón.	2026-03-19 13:09:03.475366	2026-03-19 13:09:03.475366
E55	Deficiencia de vitamina D	Bajos niveles de vitamina D que afectan la salud ósea y pueden causar debilidad muscular.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
E53	Deficiencia de vitamina B	Falta de vitaminas del complejo B que puede causar anemia y alteraciones neurológicas.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
E54	Deficiencia de vitamina C	Déficit de vitamina C que puede provocar debilidad, sangrado de encías y mala cicatrización.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
E64	Secuelas de malnutrición	Consecuencias a largo plazo de deficiencias nutricionales.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
I05	Enfermedad de la válvula mitral	Alteración estructural o funcional de la válvula mitral del corazón.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
I06	Enfermedad de la válvula aórtica	Trastornos que afectan la válvula aórtica, alterando el flujo sanguíneo.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
I07	Enfermedad de la válvula tricúspide	Alteraciones en la válvula tricúspide que afectan el retorno venoso.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
I08	Enfermedad de múltiples válvulas	Afectación simultánea de varias válvulas cardíacas.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
J34	Trastornos de la nariz	Incluye desviación del tabique y otras alteraciones nasales.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
J35	Enfermedades de amígdalas y adenoides	Inflamación o infección de amígdalas, frecuente en niños.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
J36	Absceso periamigdalino	Acumulación de pus cerca de las amígdalas, causa dolor intenso al tragar.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
J39	Enfermedades de vías respiratorias superiores	Alteraciones no especificadas de nariz, garganta o laringe.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
K11	Trastornos de glándulas salivales	Alteraciones que afectan la producción de saliva.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
K12	Estomatitis	Inflamación de la mucosa oral que causa dolor y úlceras.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
K13	Otras enfermedades de la boca	Incluye lesiones y trastornos de la cavidad oral.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
K14	Enfermedades de la lengua	Alteraciones inflamatorias o infecciosas de la lengua.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
N60	Trastornos benignos de la mama	Cambios no cancerosos en el tejido mamario.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
N61	Mastitis	Inflamación de la mama, frecuente en lactancia.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
N62	Hipertrofia mamaria	Aumento excesivo del tamaño de las mamas.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
N63	Masa mamaria	Presencia de bulto en la mama que requiere evaluación.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
O10	Hipertensión preexistente en embarazo	Presión arterial alta presente antes del embarazo.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
O41	Trastornos del líquido amniótico	Alteraciones en la cantidad de líquido amniótico.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
O42	Ruptura prematura de membranas	Ruptura del saco amniótico antes del inicio del parto.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
O44	Placenta previa	Implantación anormal de la placenta que puede causar sangrado.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
O45	Desprendimiento de placenta	Separación prematura de la placenta, situación grave.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
F11	Trastornos por opioides	Uso problemático de sustancias opioides con dependencia.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
F12	Trastornos por cannabis	Uso problemático de cannabis con efectos en la salud mental.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
F13	Trastornos por sedantes	Dependencia a medicamentos sedantes o hipnóticos.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
F14	Trastornos por cocaína	Uso problemático de cocaína con efectos cardiovasculares y psicológicos.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
F15	Trastornos por estimulantes	Consumo de sustancias estimulantes como anfetaminas.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
G04	Encefalitis	Inflamación del cerebro generalmente por infección.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
G06	Absceso cerebral	Acumulación de pus en el cerebro. Es una condición grave.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
G08	Trombosis intracraneal	Formación de coágulos en venas cerebrales.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
G09	Secuelas de enfermedades neurológicas	Consecuencias a largo plazo de enfermedades del sistema nervioso.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
H01	Blefaritis	Inflamación del borde de los párpados.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
H02	Trastornos del párpado	Incluye caída del párpado o alteraciones estructurales.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
H04	Trastornos lagrimales	Problemas en la producción o drenaje de lágrimas.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
H11	Trastornos de la conjuntiva	Alteraciones de la membrana que recubre el ojo.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
L04	Linfadenitis	Inflamación de ganglios linfáticos por infección.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
L05	Quiste pilonidal	Lesión en la región sacra que puede infectarse.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
L08	Otras infecciones de la piel	Incluye diversas infecciones cutáneas no clasificadas.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
M20	Deformidades de los dedos	Alteraciones estructurales en dedos de manos o pies.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
M21	Deformidades adquiridas de extremidades	Cambios en forma o alineación de extremidades.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
M22	Trastornos de la rótula	Problemas en la articulación de la rodilla.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
M23	Lesiones internas de rodilla	Daño en meniscos o ligamentos.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
R26	Trastornos de la marcha	Dificultad para caminar por causas neurológicas o musculares.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
R27	Alteraciones de la coordinación	Problemas para realizar movimientos coordinados.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
R29	Otros síntomas neurológicos	Incluye signos neurológicos no especificados.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
R31	Hematuria	Presencia de sangre en la orina.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
R33	Retención urinaria	Dificultad para vaciar completamente la vejiga.	2026-03-19 13:10:19.225089	2026-03-19 13:10:19.225089
\.


--
-- Data for Name: especialidad; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.especialidad (id_especialidad, especialidad, id_estado, created_at, updated_at, acceso_directo) FROM stdin;
11	Cardiologia	1	\N	\N	f
3	Medicina Interna	1	\N	\N	f
4	Cardiología	1	\N	\N	f
5	Traumatología	1	\N	\N	f
7	Neurología	1	\N	\N	f
8	Neumología	1	\N	\N	f
9	Dermatología	1	\N	\N	f
10	Oftalmología	1	\N	\N	f
1	Medicina General	1	\N	\N	t
2	Pediatría	1	\N	\N	t
6	Ginecología	1	\N	\N	t
\.


--
-- Data for Name: estado; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.estado (id_estado, nombre_estado) FROM stdin;
1	Activo
2	Inactivo
3	Sin Licencia
4	Expira Pronto
5	Licencia Expirada
6	Licencia Bloqueada
9	Agendada
10	Atendida
11	Cancelada
12	Activa
13	Pendiente
14	Parcialmente Entregada
15	Entregada
16	Inasistencia
17	wad
\.


--
-- Data for Name: examen; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.examen (id_examen, nombre, id_categoria_examen, requiere_ayuno, descripcion, created_at, updated_at, doc_paciente, fecha, hora_inicio, hora_fin, id_estado, resultado_pdf) FROM stdin;
1	Examen Remitido	1	t	axamenes fisicos normales	2026-03-23 16:25:30	2026-03-24 11:05:14	121212121	2026-03-27	15:30:00	16:00:00	10	app/examenes_resultados/examen_1_1774368314.pdf
\.


--
-- Data for Name: failed_jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.failed_jobs (id, uuid, connection, queue, payload, exception, failed_at) FROM stdin;
1	453edfd0-34d1-41b3-b5b3-78fd2a9298f0	database	default	{"uuid":"453edfd0-34d1-41b3-b5b3-78fd2a9298f0","displayName":"App\\\\Mail\\\\RegistroEmpresaContacto","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Mail\\\\SendQueuedMailable","command":"O:34:\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\":17:{s:8:\\"mailable\\";O:32:\\"App\\\\Mail\\\\RegistroEmpresaContacto\\":3:{s:7:\\"empresa\\";O:45:\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\":5:{s:5:\\"class\\";s:18:\\"App\\\\Models\\\\Empresa\\";s:2:\\"id\\";s:11:\\"909090909-6\\";s:9:\\"relations\\";a:0:{}s:10:\\"connection\\";s:5:\\"pgsql\\";s:15:\\"collectionClass\\";N;}s:2:\\"to\\";a:1:{i:0;a:2:{s:4:\\"name\\";N;s:7:\\"address\\";s:14:\\"sena@gmail.com\\";}}s:6:\\"mailer\\";s:4:\\"smtp\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:13:\\"maxExceptions\\";N;s:17:\\"shouldBeEncrypted\\";b:0;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:12:\\"messageGroup\\";N;s:12:\\"deduplicator\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;s:3:\\"job\\";N;}"},"createdAt":1772820311,"delay":null}	Illuminate\\Database\\Eloquent\\ModelNotFoundException: No query results for model [App\\Models\\Empresa]. in C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Eloquent\\Builder.php:780\nStack trace:\n#0 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\SerializesAndRestoresModelIdentifiers.php(110): Illuminate\\Database\\Eloquent\\Builder->firstOrFail()\n#1 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\SerializesAndRestoresModelIdentifiers.php(63): App\\Mail\\RegistroEmpresaContacto->restoreModel(Object(Illuminate\\Contracts\\Database\\ModelIdentifier))\n#2 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\SerializesModels.php(97): App\\Mail\\RegistroEmpresaContacto->getRestoredPropertyValue(Object(Illuminate\\Contracts\\Database\\ModelIdentifier))\n#3 [internal function]: App\\Mail\\RegistroEmpresaContacto->__unserialize(Array)\n#4 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(95): unserialize('O:34:"Illuminat...')\n#5 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(62): Illuminate\\Queue\\CallQueuedHandler->getCommand(Array)\n#6 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Jobs\\Job.php(102): Illuminate\\Queue\\CallQueuedHandler->call(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Array)\n#7 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(451): Illuminate\\Queue\\Jobs\\Job->fire()\n#8 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(401): Illuminate\\Queue\\Worker->process('database', Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(Illuminate\\Queue\\WorkerOptions))\n#9 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(187): Illuminate\\Queue\\Worker->runJob(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), 'database', Object(Illuminate\\Queue\\WorkerOptions))\n#10 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(148): Illuminate\\Queue\\Worker->daemon('database', 'default', Object(Illuminate\\Queue\\WorkerOptions))\n#11 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(131): Illuminate\\Queue\\Console\\WorkCommand->runWorker('database', 'default')\n#12 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Queue\\Console\\WorkCommand->handle()\n#13 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#14 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#15 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#16 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(836): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#17 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)\n#18 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\symfony\\console\\Command\\Command.php(318): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#19 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(180): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#20 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\symfony\\console\\Application.php(1110): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#21 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\symfony\\console\\Application.php(359): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Queue\\Console\\WorkCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#22 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\symfony\\console\\Application.php(194): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#23 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(197): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#24 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1235): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#25 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\artisan(16): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))\n#26 {main}	2026-03-11 20:55:16
2	fac0a660-2617-4f3b-94a9-eb21bf1b43d2	database	default	{"uuid":"fac0a660-2617-4f3b-94a9-eb21bf1b43d2","displayName":"App\\\\Mail\\\\RegistroEmpresaRepresentante","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Mail\\\\SendQueuedMailable","command":"O:34:\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\":17:{s:8:\\"mailable\\";O:37:\\"App\\\\Mail\\\\RegistroEmpresaRepresentante\\":3:{s:7:\\"empresa\\";O:45:\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\":5:{s:5:\\"class\\";s:18:\\"App\\\\Models\\\\Empresa\\";s:2:\\"id\\";s:11:\\"909090909-6\\";s:9:\\"relations\\";a:0:{}s:10:\\"connection\\";s:5:\\"pgsql\\";s:15:\\"collectionClass\\";N;}s:2:\\"to\\";a:1:{i:0;a:2:{s:4:\\"name\\";N;s:7:\\"address\\";s:17:\\"equivel@gmail.com\\";}}s:6:\\"mailer\\";s:4:\\"smtp\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:13:\\"maxExceptions\\";N;s:17:\\"shouldBeEncrypted\\";b:0;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:12:\\"messageGroup\\";N;s:12:\\"deduplicator\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;s:3:\\"job\\";N;}"},"createdAt":1772820311,"delay":null}	Illuminate\\Database\\Eloquent\\ModelNotFoundException: No query results for model [App\\Models\\Empresa]. in C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Eloquent\\Builder.php:780\nStack trace:\n#0 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\SerializesAndRestoresModelIdentifiers.php(110): Illuminate\\Database\\Eloquent\\Builder->firstOrFail()\n#1 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\SerializesAndRestoresModelIdentifiers.php(63): App\\Mail\\RegistroEmpresaRepresentante->restoreModel(Object(Illuminate\\Contracts\\Database\\ModelIdentifier))\n#2 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\SerializesModels.php(97): App\\Mail\\RegistroEmpresaRepresentante->getRestoredPropertyValue(Object(Illuminate\\Contracts\\Database\\ModelIdentifier))\n#3 [internal function]: App\\Mail\\RegistroEmpresaRepresentante->__unserialize(Array)\n#4 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(95): unserialize('O:34:"Illuminat...')\n#5 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(62): Illuminate\\Queue\\CallQueuedHandler->getCommand(Array)\n#6 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Jobs\\Job.php(102): Illuminate\\Queue\\CallQueuedHandler->call(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Array)\n#7 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(451): Illuminate\\Queue\\Jobs\\Job->fire()\n#8 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(401): Illuminate\\Queue\\Worker->process('database', Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(Illuminate\\Queue\\WorkerOptions))\n#9 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(187): Illuminate\\Queue\\Worker->runJob(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), 'database', Object(Illuminate\\Queue\\WorkerOptions))\n#10 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(148): Illuminate\\Queue\\Worker->daemon('database', 'default', Object(Illuminate\\Queue\\WorkerOptions))\n#11 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(131): Illuminate\\Queue\\Console\\WorkCommand->runWorker('database', 'default')\n#12 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Queue\\Console\\WorkCommand->handle()\n#13 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#14 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#15 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#16 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(836): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#17 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)\n#18 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\symfony\\console\\Command\\Command.php(318): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#19 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(180): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#20 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\symfony\\console\\Application.php(1110): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#21 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\symfony\\console\\Application.php(359): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Queue\\Console\\WorkCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#22 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\symfony\\console\\Application.php(194): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#23 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(197): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#24 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1235): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#25 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\artisan(16): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))\n#26 {main}	2026-03-11 20:55:16
3	dd7a471f-4ae3-4c88-ac2c-51dbe53c6a03	database	default	{"uuid":"dd7a471f-4ae3-4c88-ac2c-51dbe53c6a03","displayName":"App\\\\Mail\\\\RegistroEmpresaAdmin","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Mail\\\\SendQueuedMailable","command":"O:34:\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\":17:{s:8:\\"mailable\\";O:29:\\"App\\\\Mail\\\\RegistroEmpresaAdmin\\":5:{s:7:\\"empresa\\";O:45:\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\":5:{s:5:\\"class\\";s:18:\\"App\\\\Models\\\\Empresa\\";s:2:\\"id\\";s:11:\\"909090909-6\\";s:9:\\"relations\\";a:0:{}s:10:\\"connection\\";s:5:\\"pgsql\\";s:15:\\"collectionClass\\";N;}s:4:\\"user\\";O:45:\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\":5:{s:5:\\"class\\";s:18:\\"App\\\\Models\\\\Usuario\\";s:2:\\"id\\";s:8:\\"12345671\\";s:9:\\"relations\\";a:0:{}s:10:\\"connection\\";s:5:\\"pgsql\\";s:15:\\"collectionClass\\";N;}s:8:\\"password\\";s:12:\\"adsoSENA123$\\";s:2:\\"to\\";a:1:{i:0;a:2:{s:4:\\"name\\";N;s:7:\\"address\\";s:16:\\"retfas@gmail.com\\";}}s:6:\\"mailer\\";s:4:\\"smtp\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:13:\\"maxExceptions\\";N;s:17:\\"shouldBeEncrypted\\";b:0;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:12:\\"messageGroup\\";N;s:12:\\"deduplicator\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;s:3:\\"job\\";N;}"},"createdAt":1772820311,"delay":null}	Illuminate\\Database\\Eloquent\\ModelNotFoundException: No query results for model [App\\Models\\Empresa]. in C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Eloquent\\Builder.php:780\nStack trace:\n#0 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\SerializesAndRestoresModelIdentifiers.php(110): Illuminate\\Database\\Eloquent\\Builder->firstOrFail()\n#1 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\SerializesAndRestoresModelIdentifiers.php(63): App\\Mail\\RegistroEmpresaAdmin->restoreModel(Object(Illuminate\\Contracts\\Database\\ModelIdentifier))\n#2 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\SerializesModels.php(97): App\\Mail\\RegistroEmpresaAdmin->getRestoredPropertyValue(Object(Illuminate\\Contracts\\Database\\ModelIdentifier))\n#3 [internal function]: App\\Mail\\RegistroEmpresaAdmin->__unserialize(Array)\n#4 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(95): unserialize('O:34:"Illuminat...')\n#5 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(62): Illuminate\\Queue\\CallQueuedHandler->getCommand(Array)\n#6 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Jobs\\Job.php(102): Illuminate\\Queue\\CallQueuedHandler->call(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Array)\n#7 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(451): Illuminate\\Queue\\Jobs\\Job->fire()\n#8 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(401): Illuminate\\Queue\\Worker->process('database', Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(Illuminate\\Queue\\WorkerOptions))\n#9 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(187): Illuminate\\Queue\\Worker->runJob(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), 'database', Object(Illuminate\\Queue\\WorkerOptions))\n#10 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(148): Illuminate\\Queue\\Worker->daemon('database', 'default', Object(Illuminate\\Queue\\WorkerOptions))\n#11 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(131): Illuminate\\Queue\\Console\\WorkCommand->runWorker('database', 'default')\n#12 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Queue\\Console\\WorkCommand->handle()\n#13 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#14 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#15 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#16 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(836): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#17 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)\n#18 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\symfony\\console\\Command\\Command.php(318): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#19 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(180): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#20 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\symfony\\console\\Application.php(1110): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#21 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\symfony\\console\\Application.php(359): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Queue\\Console\\WorkCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#22 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\symfony\\console\\Application.php(194): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#23 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(197): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#24 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1235): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#25 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\artisan(16): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))\n#26 {main}	2026-03-11 20:55:16
4	9576155c-abf2-4d18-9ba7-f77f7dc98a63	database	default	{"uuid":"9576155c-abf2-4d18-9ba7-f77f7dc98a63","displayName":"App\\\\Mail\\\\RegistroEmpresaAdmin","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Mail\\\\SendQueuedMailable","command":"O:34:\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\":17:{s:8:\\"mailable\\";O:29:\\"App\\\\Mail\\\\RegistroEmpresaAdmin\\":5:{s:7:\\"empresa\\";O:45:\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\":5:{s:5:\\"class\\";s:18:\\"App\\\\Models\\\\Empresa\\";s:2:\\"id\\";s:11:\\"900123456-5\\";s:9:\\"relations\\";a:0:{}s:10:\\"connection\\";s:5:\\"pgsql\\";s:15:\\"collectionClass\\";N;}s:4:\\"user\\";O:45:\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\":5:{s:5:\\"class\\";s:18:\\"App\\\\Models\\\\Usuario\\";s:2:\\"id\\";s:8:\\"12345672\\";s:9:\\"relations\\";a:0:{}s:10:\\"connection\\";s:5:\\"pgsql\\";s:15:\\"collectionClass\\";N;}s:8:\\"password\\";s:12:\\"adsoSENA123$\\";s:2:\\"to\\";a:1:{i:0;a:2:{s:4:\\"name\\";N;s:7:\\"address\\";s:17:\\"re2tfas@gmail.com\\";}}s:6:\\"mailer\\";s:4:\\"smtp\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:13:\\"maxExceptions\\";N;s:17:\\"shouldBeEncrypted\\";b:0;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:12:\\"messageGroup\\";N;s:12:\\"deduplicator\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;s:3:\\"job\\";N;}"},"createdAt":1772821323,"delay":null}	Illuminate\\Database\\Eloquent\\ModelNotFoundException: No query results for model [App\\Models\\Usuario]. in C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Eloquent\\Builder.php:780\nStack trace:\n#0 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\SerializesAndRestoresModelIdentifiers.php(110): Illuminate\\Database\\Eloquent\\Builder->firstOrFail()\n#1 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\SerializesAndRestoresModelIdentifiers.php(63): App\\Mail\\RegistroEmpresaAdmin->restoreModel(Object(Illuminate\\Contracts\\Database\\ModelIdentifier))\n#2 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\SerializesModels.php(97): App\\Mail\\RegistroEmpresaAdmin->getRestoredPropertyValue(Object(Illuminate\\Contracts\\Database\\ModelIdentifier))\n#3 [internal function]: App\\Mail\\RegistroEmpresaAdmin->__unserialize(Array)\n#4 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(95): unserialize('O:34:"Illuminat...')\n#5 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(62): Illuminate\\Queue\\CallQueuedHandler->getCommand(Array)\n#6 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Jobs\\Job.php(102): Illuminate\\Queue\\CallQueuedHandler->call(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Array)\n#7 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(451): Illuminate\\Queue\\Jobs\\Job->fire()\n#8 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(401): Illuminate\\Queue\\Worker->process('database', Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(Illuminate\\Queue\\WorkerOptions))\n#9 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(187): Illuminate\\Queue\\Worker->runJob(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), 'database', Object(Illuminate\\Queue\\WorkerOptions))\n#10 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(148): Illuminate\\Queue\\Worker->daemon('database', 'default', Object(Illuminate\\Queue\\WorkerOptions))\n#11 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(131): Illuminate\\Queue\\Console\\WorkCommand->runWorker('database', 'default')\n#12 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Queue\\Console\\WorkCommand->handle()\n#13 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#14 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#15 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#16 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(836): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#17 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)\n#18 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\symfony\\console\\Command\\Command.php(318): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#19 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(180): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#20 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\symfony\\console\\Application.php(1110): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#21 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\symfony\\console\\Application.php(359): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Queue\\Console\\WorkCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#22 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\symfony\\console\\Application.php(194): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#23 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(197): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#24 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1235): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#25 C:\\Users\\ASUS\\OneDrive\\Desktop\\Proyecto EPS\\api\\artisan(16): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))\n#26 {main}	2026-03-11 20:55:22
\.


--
-- Data for Name: farmacia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.farmacia (nit, nombre, direccion, telefono, email, nombre_contacto, horario_apertura, horario_cierre, abierto_24h, created_at, updated_at, nit_empresa, id_estado) FROM stdin;
900123456-7	FarmaTodo	calle 23 askjs	123456	e@gmail.c	Jose #443	08:00:00	16:00:00	t	2026-03-01 20:07:37	2026-03-01 20:07:37	909090909-1	1
298765432-1	Sanitas	calle 14 # 2-42	3124567890	admin@gmail.com	Jose asasas	06:00:00	22:00:00	t	2026-03-06 18:56:36	2026-03-06 18:56:36	900123456-5	1
\.


--
-- Data for Name: forma_farmaceutica; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.forma_farmaceutica (id_forma, forma_farmaceutica) FROM stdin;
1	Pastillas
3	Jarabe
2	Crema
\.


--
-- Data for Name: historial_clinico; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historial_clinico (id_historial, id_paciente, antecedentes_personales, antecedentes_familiares, created_at, updated_at, alergias, habitos_vida) FROM stdin;
3	121212121	\N	\N	2026-03-23 16:25:29	2026-03-23 16:25:29	\N	{}
\.


--
-- Data for Name: historial_detalle; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historial_detalle (id_detalle, id_historial, id_cita, diagnostico, tratamiento, notas_medicas, observaciones, created_at, updated_at, subjetivo, signos_vitales) FROM stdin;
8	3	23	asma leve	acetaminofen	\N	el paciente tiene asma	2026-03-23 16:25:29	2026-03-23 16:25:29	Dolor de cabeza frecuente o migraña	{"fc": 123, "fr": 34, "peso": 30, "talla": 1.23, "temperatura": 45, "ta_sistolica": 121, "saturacion_o2": 70, "ta_diastolica": 120}
12	3	26	xxxxx	se receto ibuprofeno	\N	se registro un resfriado	2026-03-26 13:37:37	2026-03-26 13:37:37	Dolor de cabeza frecuente o migraña	{"fc": 56, "fr": 12, "peso": 90, "talla": 1.7, "temperatura": 38, "ta_sistolica": 120, "saturacion_o2": 100, "ta_diastolica": 100}
13	3	24	asdasdasda	asdsdadasd	\N	asdsdasdasd	2026-03-26 15:00:28	2026-03-26 15:00:28	necesita una citologia	{"fc": 122, "fr": 12, "peso": 120, "talla": 0.53, "temperatura": 40, "ta_sistolica": 102, "saturacion_o2": 100, "ta_diastolica": 121}
\.


--
-- Data for Name: historial_enfermedades; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historial_enfermedades (id, historial_detalle_id, enfermedad_codigo_icd, created_at, updated_at) FROM stdin;
8	8	J45	\N	\N
12	12	J00	\N	\N
13	13	E11	\N	\N
\.


--
-- Data for Name: historial_reportes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historial_reportes (id, id_usuario, tabla_relacion, num_registros, ejemplo_registro, created_at, updated_at) FROM stdin;
4	11021221	citas	1	{"id_cita":20,"doc_paciente":121212121,"doc_medico":11047812,"fecha":"2026-03-23","hora_inicio":"15:00:00","hora_fin":"15:30:00","motivo":"perdida del equilibrio","id_estado":16,"created_at":"2026-03-23T18:36:16.000000Z","updated_at":"2026-03-23T18:38:05.000000Z","recordatorio_enviado":false,"tipo_evento":"consulta","id_especialidad":1,"id_examen":null,"id_motivo":1,"estado":{"id_estado":16,"nombre_estado":"Inasistencia"},"paciente":{"documento":121212121,"primer_nombre":"Jose","primer_apellido":"Rodriguez","email":"jose.luis2020rodriguez.a@gmail.com","telefono":"3138621212","direccion":"calle 14 # 2","sexo":"Masculino","fecha_nacimiento":"2016-06-22T05:00:00.000000Z","grupo_sanguineo":"A+","registro_profesional":null,"nit":"900123456-5","id_rol":5,"id_estado":1,"created_at":"2026-03-22T02:53:09.000000Z","updated_at":"2026-03-22T03:50:49.000000Z","id_especialidad":null,"segundo_nombre":"Luis","segundo_apellido":"Avila","id_farmacia":null,"examenes":false,"id_consultorio":null,"id_tipo_documento":2,"edad":9},"medico":{"documento":11047812,"primer_nombre":"Andres","primer_apellido":"Avila","email":"medico@gmail.com","telefono":"3122111111","direccion":"calle 14 # 2-41","sexo":"Masculino","fecha_nacimiento":"2007-07-19T05:00:00.000000Z","grupo_sanguineo":null,"registro_profesional":"121221211","nit":"900123456-5","id_rol":4,"id_estado":1,"created_at":"2026-03-22T02:49:41.000000Z","updated_at":"2026-03-22T02:59:54.000000Z","id_especialidad":1,"segundo_nombre":null,"segundo_apellido":"Pinilla","id_farmacia":null,"examenes":false,"id_consultorio":1,"id_tipo_documento":1,"edad":18},"especialidad":{"id_especialidad":1,"especialidad":"Medicina General","id_estado":1,"created_at":null,"updated_at":null,"acceso_directo":true},"motivo_consulta":{"id_motivo":1,"motivo":"Dolor de cabeza frecuente o migra\\u00f1a","id_estado":1,"created_at":"2026-03-20T19:51:19.416298Z","updated_at":"2026-03-20T19:51:19.416298Z"},"historial_detalle":null}	2026-03-24 17:15:57	2026-03-24 17:15:57
10	11021221	pqrs	1	{"id_pqr":1,"nombre_usuario":"Jose Luis","email":"joseluis1409rodriguez@gmail.com","telefono":"3138623104","asunto":"Informaci\\u00f3n General","mensaje":"holaaaaaaa","respuesta":"holaaa joseeee","id_estado":10}	2026-03-25 10:51:45	2026-03-25 10:51:45
11	11021221	pqrs	1	{"id_pqr":1,"nombre_usuario":"Jose Luis","email":"joseluis1409rodriguez@gmail.com","telefono":"3138623104","asunto":"Informaci\\u00f3n General","mensaje":"holaaaaaaa","respuesta":"holaaa joseeee","id_estado":10,"created_at":"2026-03-25 10:57:38","updated_at":"2026-03-25 10:57:38"}	2026-03-25 10:58:21	2026-03-25 10:58:21
12	11021221	citas	9	{"id_cita":25,"doc_paciente":121212121,"doc_medico":11047812,"fecha":"2026-03-25","hora_inicio":"10:30:00","hora_fin":"11:00:00","motivo":null,"id_estado":11,"created_at":"2026-03-24 13:59:10","updated_at":"2026-03-25 11:11:17","recordatorio_enviado":false,"tipo_evento":"consulta","id_especialidad":1,"id_examen":null,"id_motivo":11}	2026-03-25 16:52:12	2026-03-25 16:52:12
13	11047812	citas	1	{"id_cita":23,"doc_paciente":121212121,"doc_medico":11047812,"fecha":"2026-03-23","hora_inicio":"16:00:00","hora_fin":"16:30:00","motivo":null,"id_estado":10,"created_at":"2026-03-23 15:26:31","updated_at":"2026-03-23 16:25:30","recordatorio_enviado":false,"tipo_evento":"consulta","id_especialidad":1,"id_examen":null,"id_motivo":1}	2026-03-25 17:00:57	2026-03-25 17:00:57
14	11047812	citas	1	{"id_cita":23,"doc_paciente":121212121,"doc_medico":11047812,"fecha":"2026-03-23","hora_inicio":"16:00:00","hora_fin":"16:30:00","motivo":null,"id_estado":10,"created_at":"2026-03-23 15:26:31","updated_at":"2026-03-23 16:25:30","recordatorio_enviado":false,"tipo_evento":"consulta","id_especialidad":1,"id_examen":null,"id_motivo":1}	2026-03-25 17:03:29	2026-03-25 17:03:29
15	11047812	citas	1	{"id_cita":23,"doc_paciente":121212121,"doc_medico":11047812,"fecha":"2026-03-23","hora_inicio":"16:00:00","hora_fin":"16:30:00","motivo":null,"id_estado":10,"created_at":"2026-03-23 15:26:31","updated_at":"2026-03-23 16:25:30","recordatorio_enviado":false,"tipo_evento":"consulta","id_especialidad":1,"id_examen":null,"id_motivo":1}	2026-03-25 17:05:52	2026-03-25 17:05:52
16	11111111	Historial de Movimientos	7	{"tipo_movimiento":"Ingreso","medicamento":"Ibuprofeno 500mg (Pastillas)","cantidad":200,"fecha":"27\\/03\\/2026","motivo":"Reponer stock","responsable":"Nubia Avila","paciente":"N\\/A"}	2026-03-27 10:54:49	2026-03-27 10:54:49
17	110345212	Exámenes Clínicos (realizados)	1	{"id_examen":1,"fecha":"27\\/03\\/2026","tipo_examen":"Sangre","nombre_examen":"Examen Remitido","paciente":"Jose Rodriguez","estado":"Atendida","archivo":"examen_1_1774368314.pdf","id_estado":10}	2026-03-27 11:05:06	2026-03-27 11:05:06
18	12345671	Historial de Movimientos	7	{"tipo_movimiento":"Ingreso","medicamento":"Ibuprofeno 500mg (Pastillas)","cantidad":200,"fecha":"27\\/03\\/2026","motivo":"Reponer stock","responsable":"Nubia Avila","paciente":"N\\/A"}	2026-03-27 12:10:31	2026-03-27 12:10:31
5	11021221	citas	1	{"id_cita":20,"doc_paciente":121212121,"doc_medico":11047812,"fecha":"2026-03-23","hora_inicio":"15:00:00","hora_fin":"15:30:00","motivo":"perdida del equilibrio","id_estado":16,"created_at":"2026-03-23T18:36:16.000000Z","updated_at":"2026-03-23T18:38:05.000000Z","recordatorio_enviado":false,"tipo_evento":"consulta","id_especialidad":1,"id_examen":null,"id_motivo":1,"estado":{"id_estado":16,"nombre_estado":"Inasistencia"},"paciente":{"documento":121212121,"primer_nombre":"Jose","primer_apellido":"Rodriguez","email":"jose.luis2020rodriguez.a@gmail.com","telefono":"3138621212","direccion":"calle 14 # 2","sexo":"Masculino","fecha_nacimiento":"2016-06-22T05:00:00.000000Z","grupo_sanguineo":"A+","registro_profesional":null,"nit":"900123456-5","id_rol":5,"id_estado":1,"created_at":"2026-03-22T02:53:09.000000Z","updated_at":"2026-03-22T03:50:49.000000Z","id_especialidad":null,"segundo_nombre":"Luis","segundo_apellido":"Avila","id_farmacia":null,"examenes":false,"id_consultorio":null,"id_tipo_documento":2,"edad":9},"medico":{"documento":11047812,"primer_nombre":"Andres","primer_apellido":"Avila","email":"medico@gmail.com","telefono":"3122111111","direccion":"calle 14 # 2-41","sexo":"Masculino","fecha_nacimiento":"2007-07-19T05:00:00.000000Z","grupo_sanguineo":null,"registro_profesional":"121221211","nit":"900123456-5","id_rol":4,"id_estado":1,"created_at":"2026-03-22T02:49:41.000000Z","updated_at":"2026-03-22T02:59:54.000000Z","id_especialidad":1,"segundo_nombre":null,"segundo_apellido":"Pinilla","id_farmacia":null,"examenes":false,"id_consultorio":1,"id_tipo_documento":1,"edad":18},"especialidad":{"id_especialidad":1,"especialidad":"Medicina General","id_estado":1,"created_at":null,"updated_at":null,"acceso_directo":true},"motivo_consulta":{"id_motivo":1,"motivo":"Dolor de cabeza frecuente o migra\\u00f1a","id_estado":1,"created_at":"2026-03-20T19:51:19.416298Z","updated_at":"2026-03-20T19:51:19.416298Z"},"historial_detalle":null}	2026-03-24 17:21:31	2026-03-24 17:21:31
6	11021221	citas	9	{"id_cita":25,"doc_paciente":121212121,"doc_medico":11047812,"fecha":"2026-03-25","hora_inicio":"10:30:00","hora_fin":"11:00:00","motivo":null,"id_estado":9,"created_at":"2026-03-24T18:59:10.000000Z","updated_at":"2026-03-24T18:59:10.000000Z","recordatorio_enviado":false,"tipo_evento":"consulta","id_especialidad":1,"id_examen":null,"id_motivo":11,"estado":{"id_estado":9,"nombre_estado":"Agendada"},"paciente":{"documento":121212121,"primer_nombre":"Jose","primer_apellido":"Rodriguez","email":"jose.luis2020rodriguez.a@gmail.com","telefono":"3138621212","direccion":"calle 14 # 2","sexo":"Masculino","fecha_nacimiento":"2016-06-22T05:00:00.000000Z","grupo_sanguineo":"A+","registro_profesional":null,"nit":"900123456-5","id_rol":5,"id_estado":1,"created_at":"2026-03-22T02:53:09.000000Z","updated_at":"2026-03-22T03:50:49.000000Z","id_especialidad":null,"segundo_nombre":"Luis","segundo_apellido":"Avila","id_farmacia":null,"examenes":false,"id_consultorio":null,"id_tipo_documento":2,"edad":9},"medico":{"documento":11047812,"primer_nombre":"Andres","primer_apellido":"Avila","email":"medico@gmail.com","telefono":"3122111111","direccion":"calle 14 # 2-41","sexo":"Masculino","fecha_nacimiento":"2007-07-19T05:00:00.000000Z","grupo_sanguineo":null,"registro_profesional":"121221211","nit":"900123456-5","id_rol":4,"id_estado":1,"created_at":"2026-03-22T02:49:41.000000Z","updated_at":"2026-03-22T02:59:54.000000Z","id_especialidad":1,"segundo_nombre":null,"segundo_apellido":"Pinilla","id_farmacia":null,"examenes":false,"id_consultorio":1,"id_tipo_documento":1,"edad":18},"especialidad":{"id_especialidad":1,"especialidad":"Medicina General","id_estado":1,"created_at":null,"updated_at":null,"acceso_directo":true},"motivo_consulta":{"id_motivo":11,"motivo":"Dolor en articulaciones (rodillas, hombros, etc.)","id_estado":1,"created_at":"2026-03-20T19:51:19.416298Z","updated_at":"2026-03-20T19:51:19.416298Z"},"historial_detalle":null}	2026-03-25 10:07:40	2026-03-25 10:07:40
7	11021221	citas	1	{"id_cita":23,"doc_paciente":121212121,"doc_medico":11047812,"fecha":"2026-03-23","hora_inicio":"16:00:00","hora_fin":"16:30:00","motivo":null,"id_estado":10,"created_at":"2026-03-23T20:26:31.000000Z","updated_at":"2026-03-23T21:25:30.000000Z","recordatorio_enviado":false,"tipo_evento":"consulta","id_especialidad":1,"id_examen":null,"id_motivo":1,"estado":{"id_estado":10,"nombre_estado":"Atendida"},"paciente":{"documento":121212121,"primer_nombre":"Jose","primer_apellido":"Rodriguez","email":"jose.luis2020rodriguez.a@gmail.com","telefono":"3138621212","direccion":"calle 14 # 2","sexo":"Masculino","fecha_nacimiento":"2016-06-22T05:00:00.000000Z","grupo_sanguineo":"A+","registro_profesional":null,"nit":"900123456-5","id_rol":5,"id_estado":1,"created_at":"2026-03-22T02:53:09.000000Z","updated_at":"2026-03-22T03:50:49.000000Z","id_especialidad":null,"segundo_nombre":"Luis","segundo_apellido":"Avila","id_farmacia":null,"examenes":false,"id_consultorio":null,"id_tipo_documento":2,"edad":9},"medico":{"documento":11047812,"primer_nombre":"Andres","primer_apellido":"Avila","email":"medico@gmail.com","telefono":"3122111111","direccion":"calle 14 # 2-41","sexo":"Masculino","fecha_nacimiento":"2007-07-19T05:00:00.000000Z","grupo_sanguineo":null,"registro_profesional":"121221211","nit":"900123456-5","id_rol":4,"id_estado":1,"created_at":"2026-03-22T02:49:41.000000Z","updated_at":"2026-03-22T02:59:54.000000Z","id_especialidad":1,"segundo_nombre":null,"segundo_apellido":"Pinilla","id_farmacia":null,"examenes":false,"id_consultorio":1,"id_tipo_documento":1,"edad":18},"especialidad":{"id_especialidad":1,"especialidad":"Medicina General","id_estado":1,"created_at":null,"updated_at":null,"acceso_directo":true},"motivo_consulta":{"id_motivo":1,"motivo":"Dolor de cabeza frecuente o migra\\u00f1a","id_estado":1,"created_at":"2026-03-20T19:51:19.416298Z","updated_at":"2026-03-20T19:51:19.416298Z"},"historial_detalle":{"id_detalle":8,"id_historial":3,"id_cita":23,"diagnostico":"asma leve","tratamiento":"acetaminofen","notas_medicas":null,"observaciones":"el paciente tiene asma","created_at":"2026-03-23T21:25:29.000000Z","updated_at":"2026-03-23T21:25:29.000000Z","subjetivo":"Dolor de cabeza frecuente o migra\\u00f1a","signos_vitales":{"fc":123,"fr":34,"peso":30,"talla":1.23,"temperatura":45,"ta_sistolica":121,"saturacion_o2":70,"ta_diastolica":120},"enfermedades":[{"codigo_icd":"J45","nombre":"Asma","descripcion":"Enfermedad inflamatoria cr\\u00f3nica de las v\\u00edas respiratorias que causa episodios de disnea, sibilancias y tos. Desencadenada por al\\u00e9rgenos, ejercicio o infecciones. Generalmente reversible con tratamiento.","created_at":"2026-03-19T18:04:11.855890Z","updated_at":"2026-03-19T18:04:11.855890Z","pivot":{"historial_detalle_id":8,"enfermedad_codigo_icd":"J45"}}]}}	2026-03-25 10:32:07	2026-03-25 10:32:07
8	11021221	citas	9	{"id_cita":25,"doc_paciente":121212121,"doc_medico":11047812,"fecha":"2026-03-25","hora_inicio":"10:30:00","hora_fin":"11:00:00","motivo":null,"id_estado":9,"created_at":"2026-03-24T18:59:10.000000Z","updated_at":"2026-03-24T18:59:10.000000Z","recordatorio_enviado":false,"tipo_evento":"consulta","id_especialidad":1,"id_examen":null,"id_motivo":11,"estado":{"id_estado":9,"nombre_estado":"Agendada"},"paciente":{"documento":121212121,"primer_nombre":"Jose","primer_apellido":"Rodriguez","email":"jose.luis2020rodriguez.a@gmail.com","telefono":"3138621212","direccion":"calle 14 # 2","sexo":"Masculino","fecha_nacimiento":"2016-06-22T05:00:00.000000Z","grupo_sanguineo":"A+","registro_profesional":null,"nit":"900123456-5","id_rol":5,"id_estado":1,"created_at":"2026-03-22T02:53:09.000000Z","updated_at":"2026-03-22T03:50:49.000000Z","id_especialidad":null,"segundo_nombre":"Luis","segundo_apellido":"Avila","id_farmacia":null,"examenes":false,"id_consultorio":null,"id_tipo_documento":2,"edad":9},"medico":{"documento":11047812,"primer_nombre":"Andres","primer_apellido":"Avila","email":"medico@gmail.com","telefono":"3122111111","direccion":"calle 14 # 2-41","sexo":"Masculino","fecha_nacimiento":"2007-07-19T05:00:00.000000Z","grupo_sanguineo":null,"registro_profesional":"121221211","nit":"900123456-5","id_rol":4,"id_estado":1,"created_at":"2026-03-22T02:49:41.000000Z","updated_at":"2026-03-22T02:59:54.000000Z","id_especialidad":1,"segundo_nombre":null,"segundo_apellido":"Pinilla","id_farmacia":null,"examenes":false,"id_consultorio":1,"id_tipo_documento":1,"edad":18},"especialidad":{"id_especialidad":1,"especialidad":"Medicina General","id_estado":1,"created_at":null,"updated_at":null,"acceso_directo":true},"motivo_consulta":{"id_motivo":11,"motivo":"Dolor en articulaciones (rodillas, hombros, etc.)","id_estado":1,"created_at":"2026-03-20T19:51:19.416298Z","updated_at":"2026-03-20T19:51:19.416298Z"},"historial_detalle":null}	2026-03-25 10:33:18	2026-03-25 10:33:18
9	11021221	pqrs	1	{"id_pqr":1,"nombre_usuario":"Jose Luis","email":"joseluis1409rodriguez@gmail.com","telefono":"3138623104","asunto":"Informaci\\u00f3n General","mensaje":"holaaaaaaa","respuesta":"holaaa joseeee","id_estado":10}	2026-03-25 10:51:31	2026-03-25 10:51:31
\.


--
-- Data for Name: inventario_farmacia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventario_farmacia (id_inventario, nit_farmacia, id_presentacion, stock_actual, created_at, updated_at) FROM stdin;
1	298765432-1	1	236	2026-03-10 19:41:48	2026-03-19 18:51:45
2	298765432-1	2	1177	2026-03-10 20:11:32	2026-03-27 10:48:24
\.


--
-- Data for Name: job_batches; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.job_batches (id, name, total_jobs, pending_jobs, failed_jobs, failed_job_ids, options, cancelled_at, created_at, finished_at) FROM stdin;
\.


--
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.jobs (id, queue, payload, attempts, reserved_at, available_at, created_at) FROM stdin;
21	default	{"uuid":"f128e083-484f-48b6-98f5-daea300ba191","displayName":"App\\\\Events\\\\SystemActivityEvent","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Broadcasting\\\\BroadcastEvent","command":"O:38:\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\":16:{s:5:\\"event\\";O:30:\\"App\\\\Events\\\\SystemActivityEvent\\":2:{s:4:\\"item\\";a:5:{s:2:\\"id\\";i:114;s:5:\\"title\\";s:27:\\"Usuario creado: Juan Garcia\\";s:4:\\"type\\";s:4:\\"blue\\";s:4:\\"icon\\";s:10:\\"person_add\\";s:4:\\"time\\";s:15:\\"hace 0 segundos\\";}s:11:\\"channelName\\";s:10:\\"admin-feed\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:7:\\"backoff\\";N;s:13:\\"maxExceptions\\";N;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:12:\\"messageGroup\\";N;s:12:\\"deduplicator\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;}"},"createdAt":1773428184,"delay":null}	0	\N	1773428184	1773428184
22	default	{"uuid":"e09cd69c-3247-45de-a48e-39b92549bdba","displayName":"App\\\\Events\\\\SystemActivityEvent","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Broadcasting\\\\BroadcastEvent","command":"O:38:\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\":16:{s:5:\\"event\\";O:30:\\"App\\\\Events\\\\SystemActivityEvent\\":2:{s:4:\\"item\\";a:5:{s:2:\\"id\\";i:115;s:5:\\"title\\";s:28:\\"Usuario editado: Juan Garcia\\";s:4:\\"type\\";s:6:\\"orange\\";s:4:\\"icon\\";s:15:\\"manage_accounts\\";s:4:\\"time\\";s:15:\\"hace 0 segundos\\";}s:11:\\"channelName\\";s:10:\\"admin-feed\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:7:\\"backoff\\";N;s:13:\\"maxExceptions\\";N;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:12:\\"messageGroup\\";N;s:12:\\"deduplicator\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;}"},"createdAt":1773428273,"delay":null}	0	\N	1773428273	1773428273
23	default	{"uuid":"6b41e300-6ae9-4e4a-b0ee-02d6602d5cab","displayName":"App\\\\Events\\\\SystemActivityEvent","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Broadcasting\\\\BroadcastEvent","command":"O:38:\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\":16:{s:5:\\"event\\";O:30:\\"App\\\\Events\\\\SystemActivityEvent\\":2:{s:4:\\"item\\";a:5:{s:2:\\"id\\";i:116;s:5:\\"title\\";s:44:\\"Cita agendada: Juan Rodriguez — 2026-03-14\\";s:4:\\"type\\";s:4:\\"teal\\";s:4:\\"icon\\";s:15:\\"event_available\\";s:4:\\"time\\";s:15:\\"hace 0 segundos\\";}s:11:\\"channelName\\";s:10:\\"admin-feed\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:7:\\"backoff\\";N;s:13:\\"maxExceptions\\";N;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:12:\\"messageGroup\\";N;s:12:\\"deduplicator\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;}"},"createdAt":1773439727,"delay":null}	0	\N	1773439727	1773439727
24	default	{"uuid":"8b2af854-f585-405e-99b0-4205babb7c34","displayName":"App\\\\Events\\\\SystemActivityEvent","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Broadcasting\\\\BroadcastEvent","command":"O:38:\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\":16:{s:5:\\"event\\";O:30:\\"App\\\\Events\\\\SystemActivityEvent\\":2:{s:4:\\"item\\";a:5:{s:2:\\"id\\";i:117;s:5:\\"title\\";s:44:\\"Cita agendada: Juan Rodriguez — 2026-03-14\\";s:4:\\"type\\";s:4:\\"teal\\";s:4:\\"icon\\";s:15:\\"event_available\\";s:4:\\"time\\";s:15:\\"hace 0 segundos\\";}s:11:\\"channelName\\";s:10:\\"admin-feed\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:7:\\"backoff\\";N;s:13:\\"maxExceptions\\";N;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:12:\\"messageGroup\\";N;s:12:\\"deduplicator\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;}"},"createdAt":1773440923,"delay":null}	0	\N	1773440923	1773440923
25	default	{"uuid":"0d79463e-6c1d-4798-9230-18c659c7030e","displayName":"App\\\\Events\\\\SystemActivityEvent","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Broadcasting\\\\BroadcastEvent","command":"O:38:\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\":16:{s:5:\\"event\\";O:30:\\"App\\\\Events\\\\SystemActivityEvent\\":2:{s:4:\\"item\\";a:5:{s:2:\\"id\\";i:118;s:5:\\"title\\";s:44:\\"Cita agendada: Juan Rodriguez — 2026-03-16\\";s:4:\\"type\\";s:4:\\"teal\\";s:4:\\"icon\\";s:15:\\"event_available\\";s:4:\\"time\\";s:15:\\"hace 0 segundos\\";}s:11:\\"channelName\\";s:10:\\"admin-feed\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:7:\\"backoff\\";N;s:13:\\"maxExceptions\\";N;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:12:\\"messageGroup\\";N;s:12:\\"deduplicator\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;}"},"createdAt":1773627569,"delay":null}	0	\N	1773627569	1773627569
26	default	{"uuid":"fb398728-cfc0-4aa3-a701-dfb06bec971c","displayName":"App\\\\Events\\\\SystemActivityEvent","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Broadcasting\\\\BroadcastEvent","command":"O:38:\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\":16:{s:5:\\"event\\";O:30:\\"App\\\\Events\\\\SystemActivityEvent\\":2:{s:4:\\"item\\";a:5:{s:2:\\"id\\";i:119;s:5:\\"title\\";s:44:\\"Cita agendada: Juan Rodriguez — 2026-03-16\\";s:4:\\"type\\";s:4:\\"teal\\";s:4:\\"icon\\";s:15:\\"event_available\\";s:4:\\"time\\";s:15:\\"hace 0 segundos\\";}s:11:\\"channelName\\";s:10:\\"admin-feed\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:7:\\"backoff\\";N;s:13:\\"maxExceptions\\";N;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:12:\\"messageGroup\\";N;s:12:\\"deduplicator\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;}"},"createdAt":1773675855,"delay":null}	0	\N	1773675855	1773675855
27	default	{"uuid":"35ec97e2-7414-408c-8f26-b24629d5d42c","displayName":"App\\\\Events\\\\SystemActivityEvent","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Broadcasting\\\\BroadcastEvent","command":"O:38:\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\":16:{s:5:\\"event\\";O:30:\\"App\\\\Events\\\\SystemActivityEvent\\":2:{s:4:\\"item\\";a:5:{s:2:\\"id\\";i:120;s:5:\\"title\\";s:44:\\"Cita agendada: Juan Rodriguez — 2026-03-18\\";s:4:\\"type\\";s:4:\\"teal\\";s:4:\\"icon\\";s:15:\\"event_available\\";s:4:\\"time\\";s:15:\\"hace 0 segundos\\";}s:11:\\"channelName\\";s:10:\\"admin-feed\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:7:\\"backoff\\";N;s:13:\\"maxExceptions\\";N;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:12:\\"messageGroup\\";N;s:12:\\"deduplicator\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;}"},"createdAt":1773675916,"delay":null}	0	\N	1773675916	1773675916
28	default	{"uuid":"227fe9e6-da0e-4480-a2bb-4597a987fa09","displayName":"App\\\\Mail\\\\RecetaEntregadaMail","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Mail\\\\SendQueuedMailable","command":"O:34:\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\":17:{s:8:\\"mailable\\";O:28:\\"App\\\\Mail\\\\RecetaEntregadaMail\\":7:{s:8:\\"paciente\\";O:45:\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\":5:{s:5:\\"class\\";s:18:\\"App\\\\Models\\\\Usuario\\";s:2:\\"id\\";i:12345671;s:9:\\"relations\\";a:0:{}s:10:\\"connection\\";s:5:\\"pgsql\\";s:15:\\"collectionClass\\";N;}s:6:\\"receta\\";O:45:\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\":5:{s:5:\\"class\\";s:17:\\"App\\\\Models\\\\Receta\\";s:2:\\"id\\";i:2;s:9:\\"relations\\";a:3:{i:0;s:8:\\"detalles\\";i:1;s:16:\\"historialDetalle\\";i:2;s:21:\\"historialDetalle.cita\\";}s:10:\\"connection\\";s:5:\\"pgsql\\";s:15:\\"collectionClass\\";N;}s:21:\\"medicamentoDespachado\\";s:17:\\"Paracetamol 500mg\\";s:8:\\"cantidad\\";i:30;s:8:\\"farmacia\\";O:45:\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\":5:{s:5:\\"class\\";s:19:\\"App\\\\Models\\\\Farmacia\\";s:2:\\"id\\";s:11:\\"298765432-1\\";s:9:\\"relations\\";a:0:{}s:10:\\"connection\\";s:5:\\"pgsql\\";s:15:\\"collectionClass\\";N;}s:2:\\"to\\";a:1:{i:0;a:2:{s:4:\\"name\\";N;s:7:\\"address\\";s:31:\\"joseluis1409rodriguez@gmail.com\\";}}s:6:\\"mailer\\";s:4:\\"smtp\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:13:\\"maxExceptions\\";N;s:17:\\"shouldBeEncrypted\\";b:0;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:12:\\"messageGroup\\";N;s:12:\\"deduplicator\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;s:3:\\"job\\";N;}"},"createdAt":1773946309,"delay":null}	0	\N	1773946309	1773946309
29	default	{"uuid":"36743eb8-b3d2-4e19-8e55-0d17a9d046f5","displayName":"App\\\\Events\\\\SystemActivityEvent","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Broadcasting\\\\BroadcastEvent","command":"O:38:\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\":16:{s:5:\\"event\\";O:30:\\"App\\\\Events\\\\SystemActivityEvent\\":2:{s:4:\\"item\\";a:5:{s:2:\\"id\\";i:121;s:5:\\"title\\";s:28:\\"Usuario editado: David Gomez\\";s:4:\\"type\\";s:6:\\"orange\\";s:4:\\"icon\\";s:15:\\"manage_accounts\\";s:4:\\"time\\";s:15:\\"hace 0 segundos\\";}s:11:\\"channelName\\";s:10:\\"admin-feed\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:7:\\"backoff\\";N;s:13:\\"maxExceptions\\";N;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:12:\\"messageGroup\\";N;s:12:\\"deduplicator\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;}"},"createdAt":1773947226,"delay":null}	0	\N	1773947226	1773947226
30	default	{"uuid":"2a474a00-1c03-4a6d-9da2-e527a92fc8ef","displayName":"App\\\\Events\\\\SystemActivityEvent","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Broadcasting\\\\BroadcastEvent","command":"O:38:\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\":16:{s:5:\\"event\\";O:30:\\"App\\\\Events\\\\SystemActivityEvent\\":2:{s:4:\\"item\\";a:5:{s:2:\\"id\\";i:122;s:5:\\"title\\";s:31:\\"Usuario editado: Juan Rodriguez\\";s:4:\\"type\\";s:6:\\"orange\\";s:4:\\"icon\\";s:15:\\"manage_accounts\\";s:4:\\"time\\";s:15:\\"hace 0 segundos\\";}s:11:\\"channelName\\";s:10:\\"admin-feed\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:7:\\"backoff\\";N;s:13:\\"maxExceptions\\";N;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:12:\\"messageGroup\\";N;s:12:\\"deduplicator\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;}"},"createdAt":1773973275,"delay":null}	0	\N	1773973275	1773973275
31	default	{"uuid":"65644c2c-956a-4575-b910-f2602212fa5f","displayName":"App\\\\Events\\\\SystemActivityEvent","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Broadcasting\\\\BroadcastEvent","command":"O:38:\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\":16:{s:5:\\"event\\";O:30:\\"App\\\\Events\\\\SystemActivityEvent\\":2:{s:4:\\"item\\";a:5:{s:2:\\"id\\";i:123;s:5:\\"title\\";s:44:\\"Cita agendada: Juan Rodriguez — 2026-03-21\\";s:4:\\"type\\";s:4:\\"teal\\";s:4:\\"icon\\";s:15:\\"event_available\\";s:4:\\"time\\";s:15:\\"hace 0 segundos\\";}s:11:\\"channelName\\";s:10:\\"admin-feed\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:7:\\"backoff\\";N;s:13:\\"maxExceptions\\";N;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:12:\\"messageGroup\\";N;s:12:\\"deduplicator\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;}"},"createdAt":1774031995,"delay":null}	0	\N	1774031996	1774031996
32	default	{"uuid":"d2b81ce1-f314-4b0c-936e-cab1c65c5dde","displayName":"App\\\\Events\\\\SystemActivityEvent","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Broadcasting\\\\BroadcastEvent","command":"O:38:\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\":16:{s:5:\\"event\\";O:30:\\"App\\\\Events\\\\SystemActivityEvent\\":2:{s:4:\\"item\\";a:5:{s:2:\\"id\\";i:124;s:5:\\"title\\";s:44:\\"Cita agendada: Juan Rodriguez — 2026-03-21\\";s:4:\\"type\\";s:4:\\"teal\\";s:4:\\"icon\\";s:15:\\"event_available\\";s:4:\\"time\\";s:15:\\"hace 0 segundos\\";}s:11:\\"channelName\\";s:10:\\"admin-feed\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:7:\\"backoff\\";N;s:13:\\"maxExceptions\\";N;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:12:\\"messageGroup\\";N;s:12:\\"deduplicator\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;}"},"createdAt":1774033783,"delay":null}	0	\N	1774033783	1774033783
33	default	{"uuid":"5077b471-0eb1-401a-9056-190e2bbfb2f0","displayName":"App\\\\Events\\\\SystemActivityEvent","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Broadcasting\\\\BroadcastEvent","command":"O:38:\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\":16:{s:5:\\"event\\";O:30:\\"App\\\\Events\\\\SystemActivityEvent\\":2:{s:4:\\"item\\";a:5:{s:2:\\"id\\";i:125;s:5:\\"title\\";s:26:\\"Licencia creada: Semestral\\";s:4:\\"type\\";s:4:\\"teal\\";s:4:\\"icon\\";s:3:\\"add\\";s:4:\\"time\\";s:15:\\"hace 0 segundos\\";}s:11:\\"channelName\\";s:15:\\"superadmin-feed\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:7:\\"backoff\\";N;s:13:\\"maxExceptions\\";N;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:12:\\"messageGroup\\";N;s:12:\\"deduplicator\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;}"},"createdAt":1774040431,"delay":null}	0	\N	1774040431	1774040431
34	default	{"uuid":"2043ab75-3671-41e2-ab8d-ff7107d594d9","displayName":"App\\\\Events\\\\SystemActivityEvent","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Broadcasting\\\\BroadcastEvent","command":"O:38:\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\":16:{s:5:\\"event\\";O:30:\\"App\\\\Events\\\\SystemActivityEvent\\":2:{s:4:\\"item\\";a:5:{s:2:\\"id\\";i:126;s:5:\\"title\\";s:27:\\"Licencia creada: Trimestral\\";s:4:\\"type\\";s:4:\\"teal\\";s:4:\\"icon\\";s:3:\\"add\\";s:4:\\"time\\";s:15:\\"hace 0 segundos\\";}s:11:\\"channelName\\";s:15:\\"superadmin-feed\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:7:\\"backoff\\";N;s:13:\\"maxExceptions\\";N;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:12:\\"messageGroup\\";N;s:12:\\"deduplicator\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;}"},"createdAt":1774040649,"delay":null}	0	\N	1774040649	1774040649
35	default	{"uuid":"51e9e712-27b1-4378-bdda-c870a945033f","displayName":"App\\\\Events\\\\SystemActivityEvent","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Broadcasting\\\\BroadcastEvent","command":"O:38:\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\":16:{s:5:\\"event\\";O:30:\\"App\\\\Events\\\\SystemActivityEvent\\":2:{s:4:\\"item\\";a:5:{s:2:\\"id\\";i:127;s:5:\\"title\\";s:28:\\"Usuario creado: Juan Ramirez\\";s:4:\\"type\\";s:4:\\"blue\\";s:4:\\"icon\\";s:10:\\"person_add\\";s:4:\\"time\\";s:15:\\"hace 0 segundos\\";}s:11:\\"channelName\\";s:10:\\"admin-feed\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:7:\\"backoff\\";N;s:13:\\"maxExceptions\\";N;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:12:\\"messageGroup\\";N;s:12:\\"deduplicator\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;}"},"createdAt":1774041396,"delay":null}	0	\N	1774041396	1774041396
36	default	{"uuid":"acd08813-2ea1-475c-b547-8fa3f95a7428","displayName":"App\\\\Events\\\\SystemActivityEvent","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Broadcasting\\\\BroadcastEvent","command":"O:38:\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\":16:{s:5:\\"event\\";O:30:\\"App\\\\Events\\\\SystemActivityEvent\\":2:{s:4:\\"item\\";a:5:{s:2:\\"id\\";i:128;s:5:\\"title\\";s:42:\\"Cita agendada: Juan Ramirez — 2026-03-23\\";s:4:\\"type\\";s:4:\\"teal\\";s:4:\\"icon\\";s:15:\\"event_available\\";s:4:\\"time\\";s:15:\\"hace 0 segundos\\";}s:11:\\"channelName\\";s:10:\\"admin-feed\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:7:\\"backoff\\";N;s:13:\\"maxExceptions\\";N;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:12:\\"messageGroup\\";N;s:12:\\"deduplicator\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;}"},"createdAt":1774041532,"delay":null}	0	\N	1774041532	1774041532
37	default	{"uuid":"b1793b86-81eb-437f-81b0-552fbfd8fcd3","displayName":"App\\\\Events\\\\SystemActivityEvent","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Broadcasting\\\\BroadcastEvent","command":"O:38:\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\":16:{s:5:\\"event\\";O:30:\\"App\\\\Events\\\\SystemActivityEvent\\":2:{s:4:\\"item\\";a:5:{s:2:\\"id\\";i:129;s:5:\\"title\\";s:42:\\"Cita agendada: Juan Ramirez — 2026-03-25\\";s:4:\\"type\\";s:4:\\"teal\\";s:4:\\"icon\\";s:15:\\"event_available\\";s:4:\\"time\\";s:15:\\"hace 0 segundos\\";}s:11:\\"channelName\\";s:10:\\"admin-feed\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:7:\\"backoff\\";N;s:13:\\"maxExceptions\\";N;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:12:\\"messageGroup\\";N;s:12:\\"deduplicator\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;}"},"createdAt":1774042972,"delay":null}	0	\N	1774042972	1774042972
38	default	{"uuid":"fe67cb6a-7f20-42dd-92d4-8f3a97264fda","displayName":"App\\\\Events\\\\SystemActivityEvent","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Broadcasting\\\\BroadcastEvent","command":"O:38:\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\":16:{s:5:\\"event\\";O:30:\\"App\\\\Events\\\\SystemActivityEvent\\":2:{s:4:\\"item\\";a:5:{s:2:\\"id\\";i:130;s:5:\\"title\\";s:33:\\"Usuario creado: Alejandro Diagama\\";s:4:\\"type\\";s:4:\\"blue\\";s:4:\\"icon\\";s:10:\\"person_add\\";s:4:\\"time\\";s:15:\\"hace 0 segundos\\";}s:11:\\"channelName\\";s:10:\\"admin-feed\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:7:\\"backoff\\";N;s:13:\\"maxExceptions\\";N;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:12:\\"messageGroup\\";N;s:12:\\"deduplicator\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;}"},"createdAt":1774129451,"delay":null}	0	\N	1774129451	1774129451
39	default	{"uuid":"1e4998f3-a411-4869-8e04-c6f8319a1153","displayName":"App\\\\Events\\\\SystemActivityEvent","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Broadcasting\\\\BroadcastEvent","command":"O:38:\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\":16:{s:5:\\"event\\";O:30:\\"App\\\\Events\\\\SystemActivityEvent\\":2:{s:4:\\"item\\";a:5:{s:2:\\"id\\";i:131;s:5:\\"title\\";s:28:\\"Usuario creado: Andres Avila\\";s:4:\\"type\\";s:4:\\"blue\\";s:4:\\"icon\\";s:10:\\"person_add\\";s:4:\\"time\\";s:15:\\"hace 0 segundos\\";}s:11:\\"channelName\\";s:10:\\"admin-feed\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:7:\\"backoff\\";N;s:13:\\"maxExceptions\\";N;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:12:\\"messageGroup\\";N;s:12:\\"deduplicator\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;}"},"createdAt":1774129781,"delay":null}	0	\N	1774129781	1774129781
40	default	{"uuid":"d78ec0c0-7b54-44a8-8423-1fa2fffbf531","displayName":"App\\\\Events\\\\SystemActivityEvent","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Broadcasting\\\\BroadcastEvent","command":"O:38:\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\":16:{s:5:\\"event\\";O:30:\\"App\\\\Events\\\\SystemActivityEvent\\":2:{s:4:\\"item\\";a:5:{s:2:\\"id\\";i:132;s:5:\\"title\\";s:30:\\"Usuario creado: Jose Rodriguez\\";s:4:\\"type\\";s:4:\\"blue\\";s:4:\\"icon\\";s:10:\\"person_add\\";s:4:\\"time\\";s:15:\\"hace 0 segundos\\";}s:11:\\"channelName\\";s:10:\\"admin-feed\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:7:\\"backoff\\";N;s:13:\\"maxExceptions\\";N;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:12:\\"messageGroup\\";N;s:12:\\"deduplicator\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;}"},"createdAt":1774129989,"delay":null}	0	\N	1774129989	1774129989
41	default	{"uuid":"c4526f88-b4f6-4bb9-bfa9-be14e6ca9e72","displayName":"App\\\\Events\\\\SystemActivityEvent","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Broadcasting\\\\BroadcastEvent","command":"O:38:\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\":16:{s:5:\\"event\\";O:30:\\"App\\\\Events\\\\SystemActivityEvent\\":2:{s:4:\\"item\\";a:5:{s:2:\\"id\\";i:133;s:5:\\"title\\";s:27:\\"Usuario creado: Nubia Avila\\";s:4:\\"type\\";s:4:\\"blue\\";s:4:\\"icon\\";s:10:\\"person_add\\";s:4:\\"time\\";s:15:\\"hace 0 segundos\\";}s:11:\\"channelName\\";s:10:\\"admin-feed\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:7:\\"backoff\\";N;s:13:\\"maxExceptions\\";N;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:12:\\"messageGroup\\";N;s:12:\\"deduplicator\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;}"},"createdAt":1774130101,"delay":null}	0	\N	1774130101	1774130101
42	default	{"uuid":"ea1f5e37-450a-4510-baaa-bb9a24a2a932","displayName":"App\\\\Events\\\\SystemActivityEvent","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Broadcasting\\\\BroadcastEvent","command":"O:38:\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\":16:{s:5:\\"event\\";O:30:\\"App\\\\Events\\\\SystemActivityEvent\\":2:{s:4:\\"item\\";a:5:{s:2:\\"id\\";i:134;s:5:\\"title\\";s:29:\\"Usuario editado: Andres Avila\\";s:4:\\"type\\";s:6:\\"orange\\";s:4:\\"icon\\";s:15:\\"manage_accounts\\";s:4:\\"time\\";s:15:\\"hace 0 segundos\\";}s:11:\\"channelName\\";s:10:\\"admin-feed\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:7:\\"backoff\\";N;s:13:\\"maxExceptions\\";N;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:12:\\"messageGroup\\";N;s:12:\\"deduplicator\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;}"},"createdAt":1774130394,"delay":null}	0	\N	1774130394	1774130394
43	default	{"uuid":"7527838d-666e-4120-a3df-73de5277ad2c","displayName":"App\\\\Events\\\\SystemActivityEvent","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Broadcasting\\\\BroadcastEvent","command":"O:38:\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\":16:{s:5:\\"event\\";O:30:\\"App\\\\Events\\\\SystemActivityEvent\\":2:{s:4:\\"item\\";a:5:{s:2:\\"id\\";i:135;s:5:\\"title\\";s:28:\\"Usuario editado: Nubia Avila\\";s:4:\\"type\\";s:6:\\"orange\\";s:4:\\"icon\\";s:15:\\"manage_accounts\\";s:4:\\"time\\";s:15:\\"hace 0 segundos\\";}s:11:\\"channelName\\";s:10:\\"admin-feed\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:7:\\"backoff\\";N;s:13:\\"maxExceptions\\";N;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:12:\\"messageGroup\\";N;s:12:\\"deduplicator\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;}"},"createdAt":1774130433,"delay":null}	0	\N	1774130433	1774130433
44	default	{"uuid":"46a9f025-dca5-4f34-9c81-9e871c5214c2","displayName":"App\\\\Events\\\\SystemActivityEvent","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Broadcasting\\\\BroadcastEvent","command":"O:38:\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\":16:{s:5:\\"event\\";O:30:\\"App\\\\Events\\\\SystemActivityEvent\\":2:{s:4:\\"item\\";a:5:{s:2:\\"id\\";i:136;s:5:\\"title\\";s:34:\\"Usuario editado: Alejandro Diagama\\";s:4:\\"type\\";s:6:\\"orange\\";s:4:\\"icon\\";s:15:\\"manage_accounts\\";s:4:\\"time\\";s:15:\\"hace 0 segundos\\";}s:11:\\"channelName\\";s:10:\\"admin-feed\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:7:\\"backoff\\";N;s:13:\\"maxExceptions\\";N;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:12:\\"messageGroup\\";N;s:12:\\"deduplicator\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;}"},"createdAt":1774130456,"delay":null}	0	\N	1774130456	1774130456
45	default	{"uuid":"beb442ad-70fb-457b-861c-d010b868a449","displayName":"App\\\\Events\\\\SystemActivityEvent","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Broadcasting\\\\BroadcastEvent","command":"O:38:\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\":16:{s:5:\\"event\\";O:30:\\"App\\\\Events\\\\SystemActivityEvent\\":2:{s:4:\\"item\\";a:5:{s:2:\\"id\\";i:137;s:5:\\"title\\";s:29:\\"Usuario creado: Jorge Ramirez\\";s:4:\\"type\\";s:4:\\"blue\\";s:4:\\"icon\\";s:10:\\"person_add\\";s:4:\\"time\\";s:15:\\"hace 0 segundos\\";}s:11:\\"channelName\\";s:10:\\"admin-feed\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:7:\\"backoff\\";N;s:13:\\"maxExceptions\\";N;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:12:\\"messageGroup\\";N;s:12:\\"deduplicator\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;}"},"createdAt":1774130551,"delay":null}	0	\N	1774130551	1774130551
46	default	{"uuid":"2a8f1f67-fe77-4d0d-a8b5-70ce0b43a9a7","displayName":"App\\\\Events\\\\SystemActivityEvent","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Broadcasting\\\\BroadcastEvent","command":"O:38:\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\":16:{s:5:\\"event\\";O:30:\\"App\\\\Events\\\\SystemActivityEvent\\":2:{s:4:\\"item\\";a:5:{s:2:\\"id\\";i:138;s:5:\\"title\\";s:31:\\"Usuario editado: Jose Rodriguez\\";s:4:\\"type\\";s:6:\\"orange\\";s:4:\\"icon\\";s:15:\\"manage_accounts\\";s:4:\\"time\\";s:15:\\"hace 0 segundos\\";}s:11:\\"channelName\\";s:10:\\"admin-feed\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:7:\\"backoff\\";N;s:13:\\"maxExceptions\\";N;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:12:\\"messageGroup\\";N;s:12:\\"deduplicator\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;}"},"createdAt":1774133449,"delay":null}	0	\N	1774133449	1774133449
47	default	{"uuid":"6728eb28-7945-468f-b22e-97d63e69543e","displayName":"App\\\\Events\\\\SystemActivityEvent","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Broadcasting\\\\BroadcastEvent","command":"O:38:\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\":16:{s:5:\\"event\\";O:30:\\"App\\\\Events\\\\SystemActivityEvent\\":2:{s:4:\\"item\\";a:5:{s:2:\\"id\\";i:139;s:5:\\"title\\";s:44:\\"Cita agendada: Jose Rodriguez — 2026-03-22\\";s:4:\\"type\\";s:4:\\"teal\\";s:4:\\"icon\\";s:15:\\"event_available\\";s:4:\\"time\\";s:15:\\"hace 0 segundos\\";}s:11:\\"channelName\\";s:10:\\"admin-feed\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:7:\\"backoff\\";N;s:13:\\"maxExceptions\\";N;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:12:\\"messageGroup\\";N;s:12:\\"deduplicator\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;}"},"createdAt":1774139417,"delay":null}	0	\N	1774139417	1774139417
48	default	{"uuid":"a493d6da-cc56-480f-aeee-614363f5deac","displayName":"App\\\\Events\\\\SystemActivityEvent","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Broadcasting\\\\BroadcastEvent","command":"O:38:\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\":16:{s:5:\\"event\\";O:30:\\"App\\\\Events\\\\SystemActivityEvent\\":2:{s:4:\\"item\\";a:5:{s:2:\\"id\\";i:140;s:5:\\"title\\";s:28:\\"Usuario creado: Sandra Avila\\";s:4:\\"type\\";s:4:\\"blue\\";s:4:\\"icon\\";s:10:\\"person_add\\";s:4:\\"time\\";s:15:\\"hace 0 segundos\\";}s:11:\\"channelName\\";s:10:\\"admin-feed\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:7:\\"backoff\\";N;s:13:\\"maxExceptions\\";N;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:12:\\"messageGroup\\";N;s:12:\\"deduplicator\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;}"},"createdAt":1774142120,"delay":null}	0	\N	1774142120	1774142120
49	default	{"uuid":"6ba43241-c454-4b31-9f07-bc8987fc9a26","displayName":"App\\\\Events\\\\SystemActivityEvent","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Broadcasting\\\\BroadcastEvent","command":"O:38:\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\":16:{s:5:\\"event\\";O:30:\\"App\\\\Events\\\\SystemActivityEvent\\":2:{s:4:\\"item\\";a:5:{s:2:\\"id\\";i:141;s:5:\\"title\\";s:44:\\"Cita agendada: Jose Rodriguez — 2026-03-22\\";s:4:\\"type\\";s:4:\\"teal\\";s:4:\\"icon\\";s:15:\\"event_available\\";s:4:\\"time\\";s:15:\\"hace 0 segundos\\";}s:11:\\"channelName\\";s:10:\\"admin-feed\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:7:\\"backoff\\";N;s:13:\\"maxExceptions\\";N;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:12:\\"messageGroup\\";N;s:12:\\"deduplicator\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;}"},"createdAt":1774152959,"delay":null}	0	\N	1774152959	1774152959
50	default	{"uuid":"7e0b8a16-9dab-46b1-8df9-d44e28b1ebab","displayName":"App\\\\Events\\\\SystemActivityEvent","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Broadcasting\\\\BroadcastEvent","command":"O:38:\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\":16:{s:5:\\"event\\";O:30:\\"App\\\\Events\\\\SystemActivityEvent\\":2:{s:4:\\"item\\";a:5:{s:2:\\"id\\";i:142;s:5:\\"title\\";s:44:\\"Cita agendada: Jose Rodriguez — 2026-03-23\\";s:4:\\"type\\";s:4:\\"teal\\";s:4:\\"icon\\";s:15:\\"event_available\\";s:4:\\"time\\";s:15:\\"hace 0 segundos\\";}s:11:\\"channelName\\";s:10:\\"admin-feed\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:7:\\"backoff\\";N;s:13:\\"maxExceptions\\";N;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:12:\\"messageGroup\\";N;s:12:\\"deduplicator\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;}"},"createdAt":1774217709,"delay":null}	0	\N	1774217710	1774217710
51	default	{"uuid":"69d69c0a-71ac-43c9-bea5-7a9ecc610697","displayName":"App\\\\Events\\\\SystemActivityEvent","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Broadcasting\\\\BroadcastEvent","command":"O:38:\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\":16:{s:5:\\"event\\";O:30:\\"App\\\\Events\\\\SystemActivityEvent\\":2:{s:4:\\"item\\";a:5:{s:2:\\"id\\";i:143;s:5:\\"title\\";s:44:\\"Cita agendada: Jose Rodriguez — 2026-03-23\\";s:4:\\"type\\";s:4:\\"teal\\";s:4:\\"icon\\";s:15:\\"event_available\\";s:4:\\"time\\";s:15:\\"hace 0 segundos\\";}s:11:\\"channelName\\";s:10:\\"admin-feed\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:7:\\"backoff\\";N;s:13:\\"maxExceptions\\";N;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:12:\\"messageGroup\\";N;s:12:\\"deduplicator\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;}"},"createdAt":1774285975,"delay":null}	0	\N	1774285975	1774285975
52	default	{"uuid":"77f8dc5a-def8-4ff1-8119-09b477a8c486","displayName":"App\\\\Events\\\\SystemActivityEvent","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Broadcasting\\\\BroadcastEvent","command":"O:38:\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\":16:{s:5:\\"event\\";O:30:\\"App\\\\Events\\\\SystemActivityEvent\\":2:{s:4:\\"item\\";a:5:{s:2:\\"id\\";i:144;s:5:\\"title\\";s:44:\\"Cita agendada: Jose Rodriguez — 2026-03-23\\";s:4:\\"type\\";s:4:\\"teal\\";s:4:\\"icon\\";s:15:\\"event_available\\";s:4:\\"time\\";s:15:\\"hace 0 segundos\\";}s:11:\\"channelName\\";s:10:\\"admin-feed\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:7:\\"backoff\\";N;s:13:\\"maxExceptions\\";N;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:12:\\"messageGroup\\";N;s:12:\\"deduplicator\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;}"},"createdAt":1774290986,"delay":null}	0	\N	1774290986	1774290986
53	default	{"uuid":"7bc548a6-3e79-4f91-a20e-b75a1a95c145","displayName":"App\\\\Events\\\\SystemActivityEvent","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Broadcasting\\\\BroadcastEvent","command":"O:38:\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\":16:{s:5:\\"event\\";O:30:\\"App\\\\Events\\\\SystemActivityEvent\\":2:{s:4:\\"item\\";a:5:{s:2:\\"id\\";i:145;s:5:\\"title\\";s:44:\\"Cita agendada: Jose Rodriguez — 2026-03-23\\";s:4:\\"type\\";s:4:\\"teal\\";s:4:\\"icon\\";s:15:\\"event_available\\";s:4:\\"time\\";s:15:\\"hace 0 segundos\\";}s:11:\\"channelName\\";s:10:\\"admin-feed\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:7:\\"backoff\\";N;s:13:\\"maxExceptions\\";N;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:12:\\"messageGroup\\";N;s:12:\\"deduplicator\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;}"},"createdAt":1774295453,"delay":null}	0	\N	1774295453	1774295453
54	default	{"uuid":"11dada2e-afc9-4b0d-83fa-871af1f710cb","displayName":"App\\\\Events\\\\SystemActivityEvent","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Broadcasting\\\\BroadcastEvent","command":"O:38:\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\":16:{s:5:\\"event\\";O:30:\\"App\\\\Events\\\\SystemActivityEvent\\":2:{s:4:\\"item\\";a:5:{s:2:\\"id\\";i:146;s:5:\\"title\\";s:36:\\"Cita cancelada — fecha: 2026-03-23\\";s:4:\\"type\\";s:3:\\"red\\";s:4:\\"icon\\";s:10:\\"event_busy\\";s:4:\\"time\\";s:15:\\"hace 0 segundos\\";}s:11:\\"channelName\\";s:10:\\"admin-feed\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:7:\\"backoff\\";N;s:13:\\"maxExceptions\\";N;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:12:\\"messageGroup\\";N;s:12:\\"deduplicator\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;}"},"createdAt":1774295498,"delay":null}	0	\N	1774295498	1774295498
55	default	{"uuid":"6f9fd837-4355-4738-9f88-9210d4c0f4b0","displayName":"App\\\\Events\\\\SystemActivityEvent","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Broadcasting\\\\BroadcastEvent","command":"O:38:\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\":16:{s:5:\\"event\\";O:30:\\"App\\\\Events\\\\SystemActivityEvent\\":2:{s:4:\\"item\\";a:5:{s:2:\\"id\\";i:147;s:5:\\"title\\";s:44:\\"Cita agendada: Jose Rodriguez — 2026-03-23\\";s:4:\\"type\\";s:4:\\"teal\\";s:4:\\"icon\\";s:15:\\"event_available\\";s:4:\\"time\\";s:15:\\"hace 0 segundos\\";}s:11:\\"channelName\\";s:10:\\"admin-feed\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:7:\\"backoff\\";N;s:13:\\"maxExceptions\\";N;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:12:\\"messageGroup\\";N;s:12:\\"deduplicator\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;}"},"createdAt":1774297593,"delay":null}	0	\N	1774297593	1774297593
56	default	{"uuid":"43c02970-2369-4606-8d26-9c6649dc656c","displayName":"App\\\\Events\\\\SystemActivityEvent","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Broadcasting\\\\BroadcastEvent","command":"O:38:\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\":16:{s:5:\\"event\\";O:30:\\"App\\\\Events\\\\SystemActivityEvent\\":2:{s:4:\\"item\\";a:5:{s:2:\\"id\\";i:148;s:5:\\"title\\";s:44:\\"Cita agendada: Jose Rodriguez — 2026-03-25\\";s:4:\\"type\\";s:4:\\"teal\\";s:4:\\"icon\\";s:15:\\"event_available\\";s:4:\\"time\\";s:15:\\"hace 0 segundos\\";}s:11:\\"channelName\\";s:10:\\"admin-feed\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:7:\\"backoff\\";N;s:13:\\"maxExceptions\\";N;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:12:\\"messageGroup\\";N;s:12:\\"deduplicator\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;}"},"createdAt":1774378757,"delay":null}	0	\N	1774378757	1774378757
57	default	{"uuid":"1a8fd6ab-7651-4471-a6f6-fc44804a0f18","displayName":"App\\\\Events\\\\SystemActivityEvent","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Broadcasting\\\\BroadcastEvent","command":"O:38:\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\":16:{s:5:\\"event\\";O:30:\\"App\\\\Events\\\\SystemActivityEvent\\":2:{s:4:\\"item\\";a:5:{s:2:\\"id\\";i:149;s:5:\\"title\\";s:44:\\"Cita agendada: Jose Rodriguez — 2026-04-03\\";s:4:\\"type\\";s:4:\\"teal\\";s:4:\\"icon\\";s:15:\\"event_available\\";s:4:\\"time\\";s:15:\\"hace 0 segundos\\";}s:11:\\"channelName\\";s:10:\\"admin-feed\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:7:\\"backoff\\";N;s:13:\\"maxExceptions\\";N;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:12:\\"messageGroup\\";N;s:12:\\"deduplicator\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;}"},"createdAt":1774549196,"delay":null}	0	\N	1774549196	1774549196
58	default	{"uuid":"f19bb1dd-ca1d-4fd7-a214-6f59a5046398","displayName":"App\\\\Events\\\\SystemActivityEvent","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Broadcasting\\\\BroadcastEvent","command":"O:38:\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\":16:{s:5:\\"event\\";O:30:\\"App\\\\Events\\\\SystemActivityEvent\\":2:{s:4:\\"item\\";a:5:{s:2:\\"id\\";i:150;s:5:\\"title\\";s:44:\\"Cita agendada: Jose Rodriguez — 2026-03-27\\";s:4:\\"type\\";s:4:\\"teal\\";s:4:\\"icon\\";s:15:\\"event_available\\";s:4:\\"time\\";s:15:\\"hace 0 segundos\\";}s:11:\\"channelName\\";s:10:\\"admin-feed\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:7:\\"backoff\\";N;s:13:\\"maxExceptions\\";N;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:12:\\"messageGroup\\";N;s:12:\\"deduplicator\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;}"},"createdAt":1774563067,"delay":null}	0	\N	1774563067	1774563067
59	default	{"uuid":"ffdbf292-0523-445c-ad46-8e0bf8a226f5","displayName":"App\\\\Mail\\\\RecetaEntregadaMail","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Mail\\\\SendQueuedMailable","command":"O:34:\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\":17:{s:8:\\"mailable\\";O:28:\\"App\\\\Mail\\\\RecetaEntregadaMail\\":7:{s:8:\\"paciente\\";O:45:\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\":5:{s:5:\\"class\\";s:18:\\"App\\\\Models\\\\Usuario\\";s:2:\\"id\\";i:121212121;s:9:\\"relations\\";a:0:{}s:10:\\"connection\\";s:5:\\"pgsql\\";s:15:\\"collectionClass\\";N;}s:6:\\"receta\\";O:45:\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\":5:{s:5:\\"class\\";s:17:\\"App\\\\Models\\\\Receta\\";s:2:\\"id\\";i:6;s:9:\\"relations\\";a:3:{i:0;s:8:\\"detalles\\";i:1;s:16:\\"historialDetalle\\";i:2;s:21:\\"historialDetalle.cita\\";}s:10:\\"connection\\";s:5:\\"pgsql\\";s:15:\\"collectionClass\\";N;}s:21:\\"medicamentoDespachado\\";s:16:\\"Ibuprofeno 500mg\\";s:8:\\"cantidad\\";i:30;s:8:\\"farmacia\\";O:45:\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\":5:{s:5:\\"class\\";s:19:\\"App\\\\Models\\\\Farmacia\\";s:2:\\"id\\";s:11:\\"298765432-1\\";s:9:\\"relations\\";a:0:{}s:10:\\"connection\\";s:5:\\"pgsql\\";s:15:\\"collectionClass\\";N;}s:2:\\"to\\";a:1:{i:0;a:2:{s:4:\\"name\\";N;s:7:\\"address\\";s:34:\\"jose.luis2020rodriguez.a@gmail.com\\";}}s:6:\\"mailer\\";s:4:\\"smtp\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:13:\\"maxExceptions\\";N;s:17:\\"shouldBeEncrypted\\";b:0;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:12:\\"messageGroup\\";N;s:12:\\"deduplicator\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;s:3:\\"job\\";N;}"},"createdAt":1774626509,"delay":null}	0	\N	1774626509	1774626509
\.


--
-- Data for Name: lote_medicamento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lote_medicamento (id_lote, id_presentacion, nit_farmacia, fecha_vencimiento, stock_actual, created_at, updated_at) FROM stdin;
2	2	298765432-1	2026-03-20	1000	2026-03-10 20:11:32	2026-03-10 20:11:51
1	1	298765432-1	2026-03-26	270	2026-03-10 19:41:48	2026-03-19 18:51:45
4	2	298765432-1	2026-08-27	7	2026-03-27 10:28:02	2026-03-27 10:28:02
3	2	298765432-1	2026-03-31	170	2026-03-27 10:26:50	2026-03-27 10:48:24
\.


--
-- Data for Name: medicamento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.medicamento (id_medicamento, nombre, descripcion, id_categoria, id_estado, created_at, updated_at) FROM stdin;
1	Acetaminofen	Pastillas de Acetaminofen	2	1	2026-03-10 19:09:58	2026-03-10 19:09:58
3	Ibuprofeno	xxxxx	1	2	2026-03-10 20:10:30	2026-03-19 03:31:33
4	Amoxicilina	medicamento muy efectivo	3	1	2026-03-19 03:54:17	2026-03-19 03:54:17
2	Paracetamol	Paracetamol en pastas	2	1	2026-03-10 19:37:57	2026-03-19 03:57:54
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.migrations (id, migration, batch) FROM stdin;
1	2026_02_11_041917_create_personal_access_tokens_table	1
2	2026_02_12_031848_create_activities_table	2
3	0001_01_01_000000_create_users_table	3
4	0001_01_01_000001_create_cache_table	3
5	0001_01_01_000002_create_jobs_table	3
6	2025_10_13_214855_create_products_table	3
7	2026_01_31_223325_add_citas_table	3
9	2026_02_18_021702_create_especialidades_table	4
10	2026_02_21_232038_add_segundo_nombre_y_apellido_to_usuario_table	5
11	2026_03_11_000001_create_notificacion_table	6
12	2026_03_11_120000_add_recordatorio_enviado_to_cita_table	7
13	2026_03_11_140000_add_soap_fields_to_historial_detalle	8
14	2026_03_12_200634_add_unique_constraints_to_clinics_tables	9
15	2026_03_12_220924_add_tipo_evento_to_cita_table	10
16	2026_03_16_000001_add_habitos_alergias_to_historial_clinico	11
17	2026_03_16_220341_create_historial_enfermedads_table	12
18	2026_03_17_040942_modify_remision_table_add_categoria_examen_ayuno	13
19	2026_03_18_020132_create_historial_reportes_table	14
20	2026_03_16_000002_add_cantidad_dispensar_to_receta_detalle	15
21	2026_03_17_222049_add_id_cita_to_remision_table	16
22	2026_03_23_145500_drop_unique_constraint_from_cita	17
23	2026_03_25_105651_add_timestamps_to_pqr_table	18
24	2026_03_26_172000_add_archivo_adjunto_to_pqr_table	19
\.


--
-- Data for Name: motivo_consulta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.motivo_consulta (id_motivo, motivo, id_estado, created_at, updated_at) FROM stdin;
2	Fiebre sin causa aparente	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
3	Dolor abdominal o malestar digestivo	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
4	Tos persistente o dificultad respiratoria leve	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
5	Dolor de garganta o irritación al tragar	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
6	Resfriado común o síntomas gripales	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
7	Diarrea o alteraciones intestinales	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
8	Náuseas o vómitos recurrentes	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
9	Dolor muscular o corporal general	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
10	Dolor lumbar o de espalda	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
11	Dolor en articulaciones (rodillas, hombros, etc.)	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
12	Lesión leve o golpe reciente	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
13	Revisión médica general o chequeo preventivo	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
14	Control de enfermedades crónicas (diabetes, hipertensión)	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
15	Cansancio excesivo o fatiga constante	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
16	Mareos o sensación de desmayo	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
17	Problemas de sueño (insomnio, sueño irregular)	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
18	Ansiedad o crisis de angustia	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
19	Síntomas de depresión o tristeza persistente	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
20	Estrés laboral o académico	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
21	Problemas emocionales o personales	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
22	Dificultades en relaciones interpersonales	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
23	Problemas de conducta en niños	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
24	Control de crecimiento y desarrollo infantil	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
25	Vacunación o esquema de vacunas	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
26	Erupciones en la piel o alergias	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
27	Picazón o irritación cutánea	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
28	Heridas leves o infecciones superficiales	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
29	Dolor dental o molestias bucales	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
30	Sangrado nasal ocasional	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
31	Problemas visuales leves (visión borrosa, cansancio ocular)	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
32	Dolor de oído o molestias auditivas	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
33	Congestión nasal o sinusitis leve	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
34	Control prenatal básico	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
35	Alteraciones menstruales o dolor menstrual	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
36	Infecciones urinarias leves	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
37	Dolor al orinar o cambios urinarios	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
38	Control de peso o asesoría nutricional	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
39	Obesidad o sobrepeso	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
40	Pérdida de peso sin causa clara	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
41	Problemas de alimentación en niños	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
42	Dolor en el pecho leve no urgente	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
43	Palpitaciones o ritmo cardíaco irregular leve	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
44	Seguimiento post enfermedad reciente	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
45	Reacciones alérgicas leves	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
46	Consulta por hábitos saludables	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
47	Problemas de concentración o atención	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
48	Cambios de humor frecuentes	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
49	Evaluación médica para actividad física o deporte	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
50	Consulta general sin síntoma específico (orientación médica)	1	2026-03-20 14:51:19.416298	2026-03-20 14:51:19.416298
51	Otro	1	2026-03-23 20:49:00.421401	2026-03-23 20:49:00.421401
1	Dolor de cabeza frecuente o migraña	2	2026-03-20 14:51:19.416298	2026-03-27 17:22:18
\.


--
-- Data for Name: movimiento_inventario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.movimiento_inventario (id_movimiento, id_lote, tipo_movimiento, cantidad, fecha, documento, motivo, created_at, updated_at, id_dispensacion) FROM stdin;
1	1	Ingreso	1500	2026-03-10	12345671	Compra a proveedor	2026-03-10 19:41:48	2026-03-10 19:41:48	\N
2	1	Salida	1200	2026-03-10	12345671	Perdida	2026-03-10 19:42:31	2026-03-10 19:42:31	\N
3	2	Ingreso	3000	2026-03-10	12345671	xxxx	2026-03-10 20:11:32	2026-03-10 20:11:32	\N
4	2	Salida	2000	2026-03-10	12345671	xxxxx	2026-03-10 20:11:51	2026-03-10 20:11:51	\N
6	3	Ingreso	200	2026-03-27	11111111	Reponer stock	2026-03-27 10:26:50	2026-03-27 10:26:50	\N
7	4	Ingreso	7	2026-03-27	11111111	Reponer stock	2026-03-27 10:28:02	2026-03-27 10:28:02	\N
8	3	Salida	30	2026-03-27	11111111	Dispensación de receta #6	2026-03-27 10:48:24	2026-03-27 10:48:24	2
\.


--
-- Data for Name: notificacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notificacion (id_notificacion, doc_usuario, id_cita, titulo, mensaje, tipo, leida, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.password_reset_tokens (email, token, created_at) FROM stdin;
\.


--
-- Data for Name: personal_access_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.personal_access_tokens (id, tokenable_type, tokenable_id, name, token, abilities, last_used_at, expires_at, created_at, updated_at) FROM stdin;
1	App\\Models\\Usuario	123456789	auth_token	6587b471fefc8704f77dad1a7bd199b48ab2f7a86b2f69b706c9d5dc94168d7c	["*"]	\N	\N	2026-02-11 04:20:52	2026-02-11 04:20:52
2	App\\Models\\Usuario	123456789	auth_token	b4d2f9b3602b9c78cc8912a95cd0f5324a073dc2a504a0a764f65a215a9f3a0c	["*"]	\N	\N	2026-02-11 04:21:29	2026-02-11 04:21:29
3	App\\Models\\Usuario	12891212	auth_token	a263448ea4063c241b337b629d24e83e7d37502f1e832e377ce0f9dfddef2433	["*"]	\N	\N	2026-02-11 17:10:02	2026-02-11 17:10:02
4	App\\Models\\Usuario	1234567	auth_token	9182628b42d880bfd72f1b818eb7ccde2dee2d568c69919b7c0fcf4499d157ea	["*"]	\N	\N	2026-02-11 17:40:50	2026-02-11 17:40:50
5	App\\Models\\Usuario	1234567	auth_token	0a726ca901e624d2e5ed330dbb86e55b5002bf514b10ed6da3d88b8846cadeb6	["*"]	\N	\N	2026-02-11 18:08:19	2026-02-11 18:08:19
6	App\\Models\\Superadmin	123456789	superadmin_auth_token	41b6adc66b84030927beeecb5a5520d86425d8364fc8094567cf1dea15233024	["*"]	\N	\N	2026-02-11 21:20:24	2026-02-11 21:20:24
35	App\\Models\\Usuario	123	auth_token	2c6334ad63ed13de1ff10d7cbeb6a11faedd01b5e4f12402017b6c6d30281016	["*"]	2026-02-18 22:06:15	\N	2026-02-18 20:58:32	2026-02-18 22:06:15
7	App\\Models\\Superadmin	123456789	superadmin_auth_token	cdec03117947d1e669ab48e6103594861501793b167f48424af8cf60d7215b78	["*"]	2026-02-11 21:30:31	\N	2026-02-11 21:30:29	2026-02-11 21:30:31
20	App\\Models\\Superadmin	123456789	superadmin_auth_token	9e1075862031ecd7c33368ac8bd38b6bba505d56615a4d0e93fe06a0b5c41559	["*"]	2026-02-15 19:01:45	\N	2026-02-15 14:41:59	2026-02-15 19:01:45
13	App\\Models\\Superadmin	123456789	superadmin_auth_token	b5fbda8c2217c1cfa72affa22450854fcfb2fe91a0fb3c8124824b60e4d9664b	["*"]	2026-02-12 19:45:52	\N	2026-02-12 17:55:57	2026-02-12 19:45:52
32	App\\Models\\Superadmin	123456789	superadmin_auth_token	010affdf73aae10309824c9be3f668a4112daf66bef8bc131ae131619fc1f3ac	["*"]	2026-02-18 17:41:13	\N	2026-02-18 14:21:01	2026-02-18 17:41:13
25	App\\Models\\Superadmin	123456789	superadmin_auth_token	b8788ab7192bb4101b8ba44523676db5388d0076ab633932bc34d603a2ef0be1	["*"]	2026-02-16 19:59:50	\N	2026-02-16 19:03:37	2026-02-16 19:59:50
9	App\\Models\\Usuario	123456	auth_token	f0de0b6f7339a19d86d35bae10e8263fe204d5c72586b84d4e2af36100970c88	["*"]	\N	\N	2026-02-11 21:40:23	2026-02-11 21:40:23
21	App\\Models\\Superadmin	123456789	superadmin_auth_token	4d287267c5a26efb09d6c8c4baaa31a5040f4fed5b616608814b78f72a6aec60	["*"]	2026-02-16 17:34:32	\N	2026-02-16 02:43:32	2026-02-16 17:34:32
8	App\\Models\\Superadmin	123456789	superadmin_auth_token	080ab9e0897b98c79c20059e8919cc82d56cb7605c17ec766d7fd26005137258	["*"]	2026-02-11 21:51:52	\N	2026-02-11 21:32:59	2026-02-11 21:51:52
10	App\\Models\\Superadmin	123456789	superadmin_auth_token	f3a5cf8b47f7f13382630d5f05bc641e6def5be4b9e802326d0dd7895193a82c	["*"]	2026-02-11 22:09:41	\N	2026-02-11 22:09:39	2026-02-11 22:09:41
18	App\\Models\\Usuario	1234564	auth_token	18bc6c8ee622329c16a91e8bc36a0c0cf88ff0770b6f4910158fcf8271fd6494	["*"]	\N	\N	2026-02-13 18:42:50	2026-02-13 18:42:50
22	App\\Models\\Superadmin	123456789	superadmin_auth_token	5b515c246a926fd073641dc96aacea7c6cc729a0d77c13f0b299aa61b75a05bf	["*"]	2026-02-16 17:35:17	\N	2026-02-16 17:35:15	2026-02-16 17:35:17
14	App\\Models\\Superadmin	123456789	superadmin_auth_token	70e04ab8d957fc6da50571a5b2bde2236c03204d7481533709766ad69f3bfe52	["*"]	2026-02-12 21:03:50	\N	2026-02-12 20:05:43	2026-02-12 21:03:50
31	App\\Models\\Usuario	123456	auth_token	90a7783b57d2965288cae2b33edbb21b47347684bcda512787c5c7f78e1026e8	["*"]	2026-02-18 14:18:47	\N	2026-02-17 02:15:16	2026-02-18 14:18:47
11	App\\Models\\Superadmin	123456789	superadmin_auth_token	5bb0fdbb6a4d552b5b381e9b909ff332decbbf91c895b1d7b42e7109f52b927b	["*"]	2026-02-12 04:02:39	\N	2026-02-12 02:54:52	2026-02-12 04:02:39
12	App\\Models\\Usuario	1234567	auth_token	f35ca0941e7724a44d8bdad44e868283b244baa07a8b5e2c3a761fcdb0b1020f	["*"]	\N	\N	2026-02-12 14:21:03	2026-02-12 14:21:03
23	App\\Models\\Superadmin	123456789	superadmin_auth_token	e2654739f26b372f8bc07c37967136006fc9bec7eccdc3a113f3867295c98e69	["*"]	2026-02-16 18:31:45	\N	2026-02-16 17:57:18	2026-02-16 18:31:45
16	App\\Models\\Superadmin	123456789	superadmin_auth_token	7c03cfcd128f6b02256b6ed680bf02989d5be6471e7d87b034ef295b4df90283	["*"]	2026-02-13 03:59:29	\N	2026-02-13 02:59:26	2026-02-13 03:59:29
17	App\\Models\\Superadmin	123456789	superadmin_auth_token	0a43ccc9146a8400d78f6dc42a2f57debdd4f7a7e94ceb175cd6cc6b0a03141b	["*"]	2026-02-13 19:55:01	\N	2026-02-13 15:51:44	2026-02-13 19:55:01
15	App\\Models\\Superadmin	123456789	superadmin_auth_token	7b264412d2f5a6a3faffff555f2c0826efe47fda643ff632a69d3a563a29a7a3	["*"]	2026-02-13 02:46:17	\N	2026-02-13 02:30:42	2026-02-13 02:46:17
19	App\\Models\\Superadmin	123456789	superadmin_auth_token	a9d3fd6e17b070096e87d0da607bc8918cea900406ae99a1e6746c1e80beb509	["*"]	2026-02-15 03:44:24	\N	2026-02-15 02:56:27	2026-02-15 03:44:24
28	App\\Models\\Usuario	123456	auth_token	32363cda1629abfd01ee104d300b2f8c20132a4d8aa6a60db0546cc67d55b4d0	["*"]	\N	\N	2026-02-16 21:06:22	2026-02-16 21:06:22
34	App\\Models\\Superadmin	123456789	superadmin_auth_token	6632ff0cc039d39461632de28f119ad786ab2f139ee7880b9fcdc759f81d229b	["*"]	2026-02-18 22:03:22	\N	2026-02-18 20:36:26	2026-02-18 22:03:22
24	App\\Models\\Superadmin	123456789	superadmin_auth_token	7dffe3cba39330f445e78e8b99bfa7f10fd2cc161d1d260ed3d28a7fe05aa2eb	["*"]	2026-02-16 18:48:14	\N	2026-02-16 18:46:44	2026-02-16 18:48:14
26	App\\Models\\Usuario	123456	auth_token	037eb57d4d45ed1cc71ee53d83b0843bc83476d9e312b7764ce1236cd1e28317	["*"]	\N	\N	2026-02-16 19:48:44	2026-02-16 19:48:44
27	App\\Models\\Superadmin	123456789	superadmin_auth_token	781e0df92021b46abb6cca23df7a7258fa6a1550d4ba813b668b593641823853	["*"]	2026-02-16 21:46:17	\N	2026-02-16 21:04:51	2026-02-16 21:46:17
29	App\\Models\\Usuario	123456	auth_token	701457ddd40ddbd31632bc9244fff1db1d76ba03150422a30aaa701917d65329	["*"]	\N	\N	2026-02-16 21:58:44	2026-02-16 21:58:44
30	App\\Models\\Usuario	123456	auth_token	4bda8bb71b45a5dbd0a5dc631ec9054516fa60f4c432e60cafa50f1ecaf847c3	["*"]	\N	\N	2026-02-17 01:39:23	2026-02-17 01:39:23
37	App\\Models\\Superadmin	123456789	superadmin_auth_token	020903951634cb5f337cd7dee31c62a69506bcf4d6987c65321b16e464b62a63	["*"]	2026-02-23 14:09:51	\N	2026-02-23 14:09:47	2026-02-23 14:09:51
36	App\\Models\\Superadmin	123456789	superadmin_auth_token	c1232d8c0528123503093a72da6236e28852ebe58aee7ffa12322821ce121366	["*"]	2026-02-23 01:31:27	\N	2026-02-20 19:51:31	2026-02-23 01:31:27
39	App\\Models\\Superadmin	123456789	superadmin_auth_token	4dc84afde88f810b2cc51aa4ad1411f099e47b0f6c7023604794c5f34760bc2c	["*"]	2026-02-23 17:07:13	\N	2026-02-23 15:59:03	2026-02-23 17:07:13
38	App\\Models\\Superadmin	123456789	superadmin_auth_token	92f75261e03805d5b16167d4f419442dd66e7ed4b53b9616e9a88ec8f7e91966	["*"]	2026-02-23 15:49:53	\N	2026-02-23 15:49:50	2026-02-23 15:49:53
41	App\\Models\\Superadmin	123456789	superadmin_auth_token	3d2a192dbdb02891248be696bb3ef33a3f29fba55ad9525f6ac13a830a88fa2b	["*"]	2026-02-24 03:07:47	\N	2026-02-24 02:51:16	2026-02-24 03:07:47
40	App\\Models\\Superadmin	123456789	superadmin_auth_token	01c65d17e20131ed6165dee7441362706b0fef50de7ce890d36ddc897a347b46	["*"]	2026-02-23 22:31:26	\N	2026-02-23 19:32:51	2026-02-23 22:31:26
42	App\\Models\\Superadmin	123456789	superadmin_auth_token	16cc49f8638d4cae56610aec1ee83618e47709c472d28bfa79174da9d6ae3b75	["*"]	2026-02-24 20:04:50	\N	2026-02-24 16:57:39	2026-02-24 20:04:50
104	App\\Models\\Usuario	12345671	auth_token	4bed8b5f81d27265ffcd1b4621e475e66a2b1fca51a34566f529dc09749a24c4	["*"]	2026-03-18 15:32:34	\N	2026-03-17 17:43:42	2026-03-18 15:32:34
71	App\\Models\\Superadmin	123456789	superadmin_auth_token	fea73be68c6d28306ee910f468d23f2a5d291f65b77be109a4a0cc29b4aef59f	["*"]	2026-03-05 03:28:38	\N	2026-03-04 19:04:46	2026-03-05 03:28:38
44	App\\Models\\Superadmin	123456789	superadmin_auth_token	fc677f00b80859570ea3f0dd7c7499f9f72b41e3795358a7ed096de8c27a9c55	["*"]	2026-02-25 03:16:16	\N	2026-02-24 21:19:15	2026-02-25 03:16:16
74	App\\Models\\Superadmin	123456789	superadmin_auth_token	16a0a792deaefabbddf2e13fe926936e713899a9385c3b0f0870209561915d09	["*"]	2026-03-07 00:47:28	\N	2026-03-06 17:53:52	2026-03-07 00:47:28
146	App\\Models\\Usuario	12345671	auth_token	4c5f5d7fd7279affba36b45d746bb44e73f4ed99886e4d8c2cfccf227497c464	["*"]	2026-03-27 20:58:53	\N	2026-03-27 11:05:43	2026-03-27 20:58:53
78	App\\Models\\Superadmin	123456789	superadmin_auth_token	575ee37d9e30e729f7c64cfdaa7289bdd725ef99893613e83ad43137bb5955ad	["*"]	2026-03-08 16:25:21	\N	2026-03-08 15:50:28	2026-03-08 16:25:21
153	App\\Models\\Usuario	12345671	auth_token	6771c7a8ff55da7c888d81754e2a418dae6d75bc56434ccd6bdd070bd5f6437a	["*"]	2026-03-27 17:22:18	\N	2026-03-27 17:00:35	2026-03-27 17:22:18
57	App\\Models\\Superadmin	123456789	superadmin_auth_token	0f7dbedd94f6db6dfcc28f98432479db11188d5dbc4ecc5d68500f1d609ffbf7	["*"]	2026-02-27 00:56:59	\N	2026-02-27 00:56:53	2026-02-27 00:56:59
67	App\\Models\\Usuario	1234567896	auth_token	dd26497ab25ca11afbdf1c1f02489d6a0b420f963970821dff11ea8011a3100f	["*"]	2026-03-05 19:08:04	\N	2026-03-03 18:01:46	2026-03-05 19:08:04
61	App\\Models\\Usuario	90123123	auth_token	24eba1a2a84918fcf5191bae1ef05e7064f6071e23c606b12bfa93bf039bc78f	["*"]	\N	\N	2026-02-27 22:35:03	2026-02-27 22:35:03
48	App\\Models\\Usuario	1111111	auth_token	971105c799eacac44465f0ea17a0f9a910af3716053da0159f09711d7cdd7b4b	["*"]	\N	\N	2026-02-25 19:27:01	2026-02-25 19:27:01
45	App\\Models\\Usuario	123	auth_token	0d0be4b48d2b071bfc83d8ae9dd16ace1a4061489a17c7458cf6c9ec58614763	["*"]	2026-02-24 21:51:04	\N	2026-02-24 21:49:03	2026-02-24 21:51:04
62	App\\Models\\Superadmin	123456789	superadmin_auth_token	67b7304211ac3e2ff0e42fc19ccbd84a87850eb0a65297740fabeba399cb21a1	["*"]	2026-02-28 00:47:39	\N	2026-02-27 22:36:21	2026-02-28 00:47:39
55	App\\Models\\Usuario	1234567	auth_token	a92b210f3d9a197245fce014e49cbe4c44546f218a719e2c14327ad49fc75702	["*"]	2026-02-25 22:08:41	\N	2026-02-25 22:08:24	2026-02-25 22:08:41
63	App\\Models\\Superadmin	123456789	superadmin_auth_token	8e1c895a2bbcb37c61a9a8b889a9ceab4d88f4afc54a95a011682df1fbdf2635	["*"]	2026-03-01 16:08:00	\N	2026-03-01 15:09:43	2026-03-01 16:08:00
68	App\\Models\\Superadmin	123456789	superadmin_auth_token	cdab068cdea58f20aef8c0de8634879b1935bf83f4b5527e4ac27e9e830427ce	["*"]	\N	\N	2026-03-04 18:52:48	2026-03-04 18:52:48
69	App\\Models\\Superadmin	123456789	superadmin_auth_token	bc99e1207c52f897ab3faa250cc48276b69ce16f49f72779f7491909a31e0de3	["*"]	\N	\N	2026-03-04 18:53:36	2026-03-04 18:53:36
77	App\\Models\\Usuario	12345672	auth_token	ea0a3a0fb128da69f92fce3c90fdff92481e2952521f273a7ebf3bd90341a4fb	["*"]	2026-03-08 15:49:38	\N	2026-03-06 19:31:16	2026-03-08 15:49:38
64	App\\Models\\Usuario	90123123	auth_token	e5420e4b7b704f4a784c5e303039b7f8634365e6dccb23f53baa38468fc53135	["*"]	2026-03-02 02:48:25	\N	2026-03-01 16:09:15	2026-03-02 02:48:25
66	App\\Models\\Usuario	1234567896	auth_token	37df4a5a549320bfe477e3f0e0f0a2570379b8f2f7b76d83338ee30a4fd8e86c	["*"]	\N	\N	2026-03-03 18:01:15	2026-03-03 18:01:15
107	App\\Models\\Usuario	12345671	auth_token	e55426d5e14f6ad19cf9bfa903b0d2e92133e7d3333cea414090c01a9c5e15aa	["*"]	2026-03-20 02:21:17	\N	2026-03-19 19:08:39	2026-03-20 02:21:17
99	App\\Models\\Usuario	1104698901	auth_token	44d58b192939a4a41d67818bbc50019b23f7ffd69a8f6ddeb990162b862598ab	["*"]	2026-03-16 18:11:08	\N	2026-03-16 15:40:21	2026-03-16 18:11:08
79	App\\Models\\Usuario	12345671	auth_token	f6589d862b6453587a598d5d3cb44a31654e81af7c871807c1c1173628aafa0a	["*"]	2026-03-09 18:08:09	\N	2026-03-09 18:05:20	2026-03-09 18:08:09
70	App\\Models\\Superadmin	123456789	superadmin_auth_token	c8d8f35cc83cd0ddbde76bc63cc249f53fdd2ecf86b651caca59e2cea504dc27	["*"]	\N	\N	2026-03-04 19:04:06	2026-03-04 19:04:06
97	App\\Models\\Usuario	1104698901	auth_token	e656f894c59143a3f587205e0c50eda3a8298b980a66d0a2418266abbcc1b2f0	["*"]	2026-03-16 02:20:29	\N	2026-03-16 01:16:39	2026-03-16 02:20:29
118	App\\Models\\Usuario	121212121	auth_token	8b84a6f1ec141dc448bffc730fc568f3a6c3affb81de754136b497d3923dadce	["*"]	2026-03-22 04:16:56	\N	2026-03-22 00:32:38	2026-03-22 04:16:56
111	App\\Models\\Superadmin	123456789	superadmin_auth_token	4c1ab9037bc5144ad51ae4a1bbaa55fe764c5325c7faea5f10c83857297fbc75	["*"]	2026-03-21 02:15:24	\N	2026-03-20 17:37:58	2026-03-21 02:15:24
113	App\\Models\\Usuario	200000001	auth_token	3cb052c829dab609367eb776a7034762fd5e551e388b17275360eb8fe4c0bd7c	["*"]	2026-03-21 02:15:33	\N	2026-03-20 20:01:03	2026-03-21 02:15:33
114	App\\Models\\Usuario	110234567	auth_token	741e010949ea002f59470cee4f236ea025349ce729d3f3209632c4f8824c50ca	["*"]	2026-03-21 02:15:33	\N	2026-03-20 21:18:10	2026-03-21 02:15:33
112	App\\Models\\Usuario	12345671	auth_token	f5908dad8a48254b5a947f878f63f628bf3ae353923e08c781184340035eec3d	["*"]	2026-03-20 19:36:16	\N	2026-03-20 18:36:06	2026-03-20 19:36:16
125	App\\Models\\Usuario	110345212	auth_token	2e4196b4a255209da3028b4557c88ee3c3ecf4695cabe4ce60d79ba6eff2f6c5	["*"]	2026-03-24 00:04:45	\N	2026-03-23 21:29:24	2026-03-24 00:04:45
130	App\\Models\\Usuario	12345671	auth_token	b8496927ecd633bf2a98b2e9dba96ac9bb80695d190bf1638fc6a6f4db27aecc	["*"]	2026-03-25 17:09:38	\N	2026-03-24 15:24:39	2026-03-25 17:09:38
121	App\\Models\\Usuario	121212121	auth_token	fc05cd16bc7fc5a9b595b6be8459a23e99a274a787cbe9a554c54bf8037aacf9	["*"]	2026-03-23 00:12:32	\N	2026-03-22 22:14:39	2026-03-23 00:12:32
131	App\\Models\\Usuario	11021221	auth_token	61269abef0dc4ccce55d75ba35daaf9490642202696f982ffa529003dde25a3b	["*"]	2026-03-25 10:21:26	\N	2026-03-24 17:00:41	2026-03-25 10:21:26
132	App\\Models\\Usuario	11021221	auth_token	914dc5f8db66f393eb722560cc201b0cf9d4e89af9a0e9017c5798ae70d14f52	["*"]	2026-03-25 22:18:00	\N	2026-03-25 10:21:53	2026-03-25 22:18:00
123	App\\Models\\Usuario	121212121	auth_token	5ca24f596f35d5bd4d7a15a6fc4b16e57f34c8cae3c144175ae0363ad962feae	["*"]	2026-03-25 13:28:39	\N	2026-03-23 16:26:40	2026-03-25 13:28:39
\.


--
-- Data for Name: pqr; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pqr (id_pqr, nombre_usuario, email, telefono, asunto, mensaje, respuesta, id_estado, created_at, updated_at, archivo_adjunto) FROM stdin;
1	Jose Luis	joseluis1409rodriguez@gmail.com	3138623104	Información General	holaaaaaaa	holaaa joseeee	10	2026-03-25 10:57:38	2026-03-25 10:57:38	\N
2	jose luis	joseluis1409rodriguez@gmail.com	3122111111	Información General	necesito un reporte de usuarios	ya te lo envio	10	2026-03-26 17:25:08	2026-03-26 17:25:36	pqrs_adjuntos/1774563936_cita_26.pdf
3	jose luis	joseluis1409rodriguez@gmail.com	3138623104	Información General	adadsdadsdad	\N	13	2026-03-27 13:55:49	2026-03-27 13:55:49	\N
\.


--
-- Data for Name: presentacion_medicamento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.presentacion_medicamento (id_presentacion, id_medicamento, id_concentracion, id_forma_farmaceutica, created_at, updated_at, precio_unitario) FROM stdin;
1	2	1	1	2026-03-10 19:37:57	2026-03-10 19:37:57	2000
2	3	1	1	2026-03-10 20:10:30	2026-03-10 20:10:30	3000
\.


--
-- Data for Name: prioridad; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.prioridad (id_prioridad, prioridad, id_estado, created_at, updated_at) FROM stdin;
1	Normal	1	2026-03-01 19:57:14	2026-03-06 16:48:56
2	Baja	1	2026-03-06 16:49:15	2026-03-06 16:50:22
3	Alta	1	2026-03-06 16:50:31	2026-03-06 16:50:31
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, description, price, stock, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: receta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.receta (id_receta, id_detalle_cita, fecha_vencimiento, id_estado, created_at, updated_at) FROM stdin;
5	8	2026-04-22	13	2026-03-23 16:25:30	2026-03-23 16:25:30
6	12	2026-04-25	15	2026-03-26 13:37:37	2026-03-27 10:48:24
\.


--
-- Data for Name: receta_detalle; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.receta_detalle (id_detalle_receta, id_receta, id_presentacion, dosis, frecuencia, duracion, observaciones, created_at, updated_at, nit_farmacia, cantidad_dispensar) FROM stdin;
5	5	2	2 pastillas	8 horas	2026-03-25	xxx	2026-03-23 16:25:30	2026-03-23 16:25:30	298765432-1	45
6	6	2	1 pasta	cada 10 horas	2026-03-31	nada que notificar	2026-03-26 13:37:37	2026-03-26 13:37:37	298765432-1	30
\.


--
-- Data for Name: remision; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.remision (id_remision, id_detalle_cita, tipo_remision, id_especialidad, id_examen, id_prioridad, notas, id_estado, created_at, updated_at, id_categoria_examen, requiere_ayuno, id_cita) FROM stdin;
6	8	cita	6	\N	1	necesita una citologia	12	2026-03-23 16:25:30	2026-03-23 16:25:30	\N	f	24
7	8	examen	\N	1	1	axamenes fisicos normales	12	2026-03-23 16:25:30	2026-03-23 16:25:30	1	t	\N
11	12	cita	1	\N	3	xxxxxxx	12	2026-03-26 13:37:37	2026-03-26 13:37:37	\N	f	30
\.


--
-- Data for Name: respaldo_empresa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.respaldo_empresa (id_respaldo, nit_empresa, nombre_representante, documento_representante, telefono_representante, email_representante, fecha_respaldo) FROM stdin;
1	909090909-1	cesar	90909090	3211231222	esquivel7809@gmail.com	2026-03-12 16:06:41.833159
2	900123456-5	bbssss	9999992	3124567800	xxxx@gmail.com	2026-03-20 16:05:32.878114
\.


--
-- Data for Name: rol; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rol (id_rol, tipo_usu, id_estado) FROM stdin;
1	Super Admin	1
2	Admin	1
3	personal Administrativo	1
4	Medico	1
5	Paciente	1
6	Farmaceutico	1
8	x	1
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sessions (id, user_id, ip_address, user_agent, payload, last_activity) FROM stdin;
1rDKufxxJYhaf4I1Y7ldGorK10gdYeL5yNLaWSh4	\N	127.0.0.1	Mozilla/5.0 (Windows NT; Windows NT 10.0; es-MX) WindowsPowerShell/5.1.26100.7705	YTozOntzOjY6Il90b2tlbiI7czo0MDoibFZJSDZOeHFzNjEwTkMxNDlzTTRMS1RyN3RNUHNzRXhwM3BzZ2FOZyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=	1771903033
ZmqGWPH4Wt9zXFupl1kUbmmUHBGsJSb4990sEBp2	\N	127.0.0.1	Mozilla/5.0 (Windows NT; Windows NT 10.0; es-MX) WindowsPowerShell/5.1.26100.7705	YTozOntzOjY6Il90b2tlbiI7czo0MDoiemxQM1l1MWFOOXhiVmE3TWk0ZXZNMGh0NFpreUhadmk3dnhMbGFZWCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=	1771903067
3D7Q1rOfisyyrHnee25gC4F7ZTkxyth6cjKI2T5R	\N	127.0.0.1	Mozilla/5.0 (Windows NT; Windows NT 10.0; es-MX) WindowsPowerShell/5.1.26100.7705	YTozOntzOjY6Il90b2tlbiI7czo0MDoidlFTN0tPd3JDWms2ZFpJbXBZSFhvU05QR1M3TFJqVElrUFc4aUVScSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=	1771903292
\.


--
-- Data for Name: solicitud_cita; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.solicitud_cita (id_solicitud, id_especialidad, fecha_preferida, motivo, id_estado, id_cita, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: superadmin; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.superadmin (documento, nombre, usuario, email, contrasena, id_rol, created_at, updated_at) FROM stdin;
123456789	Super Admin	admin	joseluis1409rodriguez@gmail.com	$2y$12$bPsev0/PbVZa4qjUr5vCxegOSBNha8t0UGQfl8mUb.IC8NuiKxw2e	1	2026-02-11 21:11:20	2026-03-06 17:53:29
\.


--
-- Data for Name: tipo_cita; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tipo_cita (id_tipo_cita, tipo, id_estado, created_at, updated_at, acceso_directo) FROM stdin;
3	Especialista	1	2026-03-06 16:51:12	2026-03-06 16:51:12	f
8	Cardiología	1	2026-03-13 19:15:16	2026-03-13 19:15:16	f
9	Dermatología	1	2026-03-13 19:15:16	2026-03-13 19:15:16	f
10	Oftalmología	1	2026-03-13 19:15:16	2026-03-13 19:15:16	f
11	Nutrición y Dietética	1	2026-03-13 19:15:16	2026-03-13 19:15:16	f
13	Fisioterapia	1	2026-03-13 19:15:16	2026-03-13 19:15:16	f
4	Medicina General	1	2026-03-13 19:15:16	2026-03-13 19:15:16	t
5	Odontología	1	2026-03-13 19:15:16	2026-03-13 19:15:16	t
6	Pediatría	1	2026-03-13 19:15:16	2026-03-13 19:15:16	t
7	Ginecología	1	2026-03-13 19:15:16	2026-03-13 19:15:16	t
12	Psicología	1	2026-03-13 19:15:16	2026-03-13 19:15:16	t
14	Psiquiatria	1	\N	\N	t
\.


--
-- Data for Name: tipo_documento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tipo_documento (id_tipo_documento, tipo_documento, id_estado, created_at, updated_at) FROM stdin;
1	Cedula de Ciudadania	1	\N	\N
2	Tarjeta de Identidad	1	\N	\N
3	Cedula Extranjeria	1	2026-03-21 14:05:41.06305	2026-03-21 14:05:41.06305
\.


--
-- Data for Name: tipo_licencia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tipo_licencia (id_tipo_licencia, tipo, descripcion, duracion_meses, precio, id_estado, created_at, updated_at) FROM stdin;
23	Anual	Licencia de un año	12	1500000.00	1	2026-02-25 21:19:10	2026-03-06 18:39:43
28	Semestral	Licencia de 6 meses	6	800000.00	1	2026-03-20 21:00:23	2026-03-20 21:00:23
29	Trimestral	Licencia de 3 meses	3	450000.00	1	2026-03-20 21:04:09	2026-03-20 21:04:09
\.


--
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario (documento, primer_nombre, primer_apellido, email, telefono, direccion, sexo, fecha_nacimiento, grupo_sanguineo, contrasena, registro_profesional, nit, id_rol, id_estado, created_at, updated_at, id_especialidad, segundo_nombre, segundo_apellido, id_farmacia, examenes, id_consultorio, id_tipo_documento) FROM stdin;
11111111	Nubia	Avila	farmaceutico@gmail.com	3121212121	carrera 50 143 - 39	Femenino	2007-06-06	\N	$2y$12$4ocVmFAtV7ckf6B65Duvluj08RYQYowq03he7JIN42xm3cc74sTGO	\N	900123456-5	6	1	2026-03-21 21:55:01	2026-03-21 22:00:33	\N	Jhoana	Pinilla	900123456-7	f	\N	1
110345212	Alejandro	Diagama	examenes@gmail.com	3124564322	calle 14 # 2-42	Masculino	2006-06-06	\N	$2y$12$PTFKNFvbx2oWP/i2apcNHukekgbe6e7OPJo3FsCQX9E8R.PsdFBIO	\N	900123456-5	3	1	2026-03-21 21:44:03	2026-03-21 22:00:56	\N	\N	Avila	\N	t	\N	1
11021221	Jorge	Ramirez	personal@gmail.com	3125121610	calle 14 # 2-42	Masculino	2001-10-17	\N	$2y$12$MvhWhlYMn.vjaiiSAl6h9.I6uIWLSn8JZCWok6nJc74euRJbWDTZ6	\N	900123456-5	3	1	2026-03-21 22:02:30	2026-03-21 22:02:30	\N	\N	\N	\N	f	\N	1
121212121	Jose	Rodriguez	jose.luis2020rodriguez.a@gmail.com	3138621212	calle 14 # 2	Masculino	2016-06-22	A+	$2y$12$9qhr2UOICVKcqW09Mmhr1e1osmri1RxvRjonC4NFTbgBjZEWnt0yC	\N	900123456-5	5	1	2026-03-21 21:53:09	2026-03-21 22:50:49	\N	Luis	Avila	\N	f	\N	2
11047812	Andres	Avila	medico@gmail.com	3122111111	calle 14 # 2-41	Masculino	2007-07-19	\N	$2y$12$TDWIrvDy/6e.1g6zwOA1Uuh5nZYIsSWD3DUltTldAklYxj21KhBoe	121221211	900123456-5	4	1	2026-03-21 21:49:41	2026-03-21 21:59:54	1	\N	Pinilla	\N	f	1	1
12121211	Sandra	Avila	especialista@gmail.com	3121224443	calle 14 # 2-42	Femenino	1998-06-09	\N	$2y$12$WpcR03Fp6wrgcKSOOSKz0efCnWVuk4r/Kt4w5RyTLerPyM7s447gq	121211111	900123456-5	4	1	2026-03-22 01:15:20	2026-03-22 01:15:20	6	Rocio	\N	\N	f	3	1
12345671	Juan	Rodriguez	joseluis1409rodriguez@gmail.com	3123213433	calle 34	Masculino	2004-02-17	A+	$2y$12$PQIZW8CuDOUxDSf9RagxIeN5VH7It2sBoeU4AJWooytVxU7lAbD4G	\N	900123456-5	2	1	2026-03-06 18:22:03	2026-03-27 16:46:53	1	Jose	Martinez	298765432-1	f	2	1
\.


--
-- Name: activities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.activities_id_seq', 150, true);


--
-- Name: categoria_examen_id_categoria_examen_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categoria_examen_id_categoria_examen_seq', 3, true);


--
-- Name: categoria_medicamento_id_categoria_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categoria_medicamento_id_categoria_seq', 3, true);


--
-- Name: cita_id_cita_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cita_id_cita_seq', 31, true);


--
-- Name: concentracion_id_concentracion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.concentracion_id_concentracion_seq', 2, true);


--
-- Name: consultorio_id_consultorio_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.consultorio_id_consultorio_seq', 5, true);


--
-- Name: detalle_medicamento_id_detalle_medicamento_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.detalle_medicamento_id_detalle_medicamento_seq', 6, true);


--
-- Name: dispensacion_farmacia_id_dispensacion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.dispensacion_farmacia_id_dispensacion_seq', 2, true);


--
-- Name: especialidad_id_especialidad_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.especialidad_id_especialidad_seq', 11, true);


--
-- Name: estado_id_estado_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.estado_id_estado_seq', 17, true);


--
-- Name: examen_id_examen_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.examen_id_examen_seq', 1, true);


--
-- Name: failed_jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.failed_jobs_id_seq', 4, true);


--
-- Name: forma_farmaceutica_id_forma_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.forma_farmaceutica_id_forma_seq', 3, true);


--
-- Name: historial_clinico_id_historial_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historial_clinico_id_historial_seq', 3, true);


--
-- Name: historial_detalle_id_detalle_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historial_detalle_id_detalle_seq', 13, true);


--
-- Name: historial_enfermedads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historial_enfermedads_id_seq', 13, true);


--
-- Name: historial_reportes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historial_reportes_id_seq', 18, true);


--
-- Name: inventario_farmacia_id_inventario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventario_farmacia_id_inventario_seq', 2, true);


--
-- Name: jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jobs_id_seq', 59, true);


--
-- Name: lote_medicamento_id_lote_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lote_medicamento_id_lote_seq', 4, true);


--
-- Name: medicamento_id_medicamento_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.medicamento_id_medicamento_seq', 4, true);


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.migrations_id_seq', 24, true);


--
-- Name: motivo_consulta_id_motivo_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.motivo_consulta_id_motivo_seq', 51, true);


--
-- Name: movimiento_inventario_id_movimiento_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.movimiento_inventario_id_movimiento_seq', 8, true);


--
-- Name: notificacion_id_notificacion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notificacion_id_notificacion_seq', 1, false);


--
-- Name: orden_medicamento_id_orden_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orden_medicamento_id_orden_seq', 6, true);


--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.personal_access_tokens_id_seq', 153, true);


--
-- Name: pqr_id_pqr_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pqr_id_pqr_seq', 3, true);


--
-- Name: presentacion_medicamento_id_presentacion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.presentacion_medicamento_id_presentacion_seq', 2, true);


--
-- Name: prioridad_id_prioridad_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.prioridad_id_prioridad_seq', 3, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 1, false);


--
-- Name: remision_id_remision_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.remision_id_remision_seq', 11, true);


--
-- Name: respaldo_empresa_id_respaldo_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.respaldo_empresa_id_respaldo_seq', 2, true);


--
-- Name: rol_id_rol_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rol_id_rol_seq', 8, true);


--
-- Name: solicitud_cita_id_solicitud_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.solicitud_cita_id_solicitud_seq', 1, false);


--
-- Name: tipo_cita_id_tipo_cita_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tipo_cita_id_tipo_cita_seq', 14, true);


--
-- Name: tipo_documento_id_tipo_documento_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tipo_documento_id_tipo_documento_seq', 3, true);


--
-- Name: tipo_licencia_id_tipo_licencia_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tipo_licencia_id_tipo_licencia_seq', 29, true);


--
-- Name: Historial_admins Historial_admins_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Historial_admins"
    ADD CONSTRAINT "Historial_admins_pkey" PRIMARY KEY (documento);


--
-- Name: activities activities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_pkey PRIMARY KEY (id);


--
-- Name: cache_locks cache_locks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cache_locks
    ADD CONSTRAINT cache_locks_pkey PRIMARY KEY (key);


--
-- Name: cache cache_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cache
    ADD CONSTRAINT cache_pkey PRIMARY KEY (key);


--
-- Name: categoria_examen categoria_examen_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria_examen
    ADD CONSTRAINT categoria_examen_pkey PRIMARY KEY (id_categoria_examen);


--
-- Name: categoria_medicamento categoria_medicamento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria_medicamento
    ADD CONSTRAINT categoria_medicamento_pkey PRIMARY KEY (id_categoria);


--
-- Name: cita cita_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cita
    ADD CONSTRAINT cita_pkey PRIMARY KEY (id_cita);


--
-- Name: ciudad ciudad_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ciudad
    ADD CONSTRAINT ciudad_pkey PRIMARY KEY (codigo_postal);


--
-- Name: concentracion concentracion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.concentracion
    ADD CONSTRAINT concentracion_pkey PRIMARY KEY (id_concentracion);


--
-- Name: consultorio consultorio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consultorio
    ADD CONSTRAINT consultorio_pkey PRIMARY KEY (id_consultorio);


--
-- Name: departamento departamento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departamento
    ADD CONSTRAINT departamento_pkey PRIMARY KEY ("codigo_DANE");


--
-- Name: dispensacion_farmacia dispensacion_farmacia_id_detalle_receta_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dispensacion_farmacia
    ADD CONSTRAINT dispensacion_farmacia_id_detalle_receta_key UNIQUE (id_detalle_receta);


--
-- Name: dispensacion_farmacia dispensacion_farmacia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dispensacion_farmacia
    ADD CONSTRAINT dispensacion_farmacia_pkey PRIMARY KEY (id_dispensacion);


--
-- Name: empresa empresa_documento_representante_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa
    ADD CONSTRAINT empresa_documento_representante_key UNIQUE (documento_representante);


--
-- Name: empresa empresa_email_representante_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa
    ADD CONSTRAINT empresa_email_representante_key UNIQUE (email_representante);


--
-- Name: empresa_licencia empresa_licencia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_licencia
    ADD CONSTRAINT empresa_licencia_pkey PRIMARY KEY (id_empresa_licencia);


--
-- Name: empresa empresa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa
    ADD CONSTRAINT empresa_pkey PRIMARY KEY (nit);


--
-- Name: enfermedades enfermedades_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enfermedades
    ADD CONSTRAINT enfermedades_pkey PRIMARY KEY (codigo_icd);


--
-- Name: especialidad especialidad_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.especialidad
    ADD CONSTRAINT especialidad_pkey PRIMARY KEY (id_especialidad);


--
-- Name: estado estado_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado
    ADD CONSTRAINT estado_pkey PRIMARY KEY (id_estado);


--
-- Name: examen examen_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.examen
    ADD CONSTRAINT examen_pkey PRIMARY KEY (id_examen);


--
-- Name: failed_jobs failed_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_pkey PRIMARY KEY (id);


--
-- Name: failed_jobs failed_jobs_uuid_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_uuid_unique UNIQUE (uuid);


--
-- Name: farmacia farmacia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.farmacia
    ADD CONSTRAINT farmacia_pkey PRIMARY KEY (nit);


--
-- Name: forma_farmaceutica forma_farmaceutica_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forma_farmaceutica
    ADD CONSTRAINT forma_farmaceutica_pkey PRIMARY KEY (id_forma);


--
-- Name: historial_clinico historial_clinico_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_clinico
    ADD CONSTRAINT historial_clinico_pkey PRIMARY KEY (id_historial);


--
-- Name: historial_detalle historial_detalle_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_detalle
    ADD CONSTRAINT historial_detalle_pkey PRIMARY KEY (id_detalle);


--
-- Name: historial_enfermedades historial_enfermedad_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_enfermedades
    ADD CONSTRAINT historial_enfermedad_unique UNIQUE (historial_detalle_id, enfermedad_codigo_icd);


--
-- Name: historial_enfermedades historial_enfermedads_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_enfermedades
    ADD CONSTRAINT historial_enfermedads_pkey PRIMARY KEY (id);


--
-- Name: historial_reportes historial_reportes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_reportes
    ADD CONSTRAINT historial_reportes_pkey PRIMARY KEY (id);


--
-- Name: inventario_farmacia inventario_farmacia_nit_farmacia_id_presentacion_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventario_farmacia
    ADD CONSTRAINT inventario_farmacia_nit_farmacia_id_presentacion_key UNIQUE (nit_farmacia, id_presentacion);


--
-- Name: inventario_farmacia inventario_farmacia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventario_farmacia
    ADD CONSTRAINT inventario_farmacia_pkey PRIMARY KEY (id_inventario);


--
-- Name: job_batches job_batches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_batches
    ADD CONSTRAINT job_batches_pkey PRIMARY KEY (id);


--
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- Name: lote_medicamento lote_medicamento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lote_medicamento
    ADD CONSTRAINT lote_medicamento_pkey PRIMARY KEY (id_lote);


--
-- Name: medicamento medicamento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medicamento
    ADD CONSTRAINT medicamento_pkey PRIMARY KEY (id_medicamento);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: motivo_consulta motivo_consulta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.motivo_consulta
    ADD CONSTRAINT motivo_consulta_pkey PRIMARY KEY (id_motivo);


--
-- Name: movimiento_inventario movimiento_inventario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_inventario
    ADD CONSTRAINT movimiento_inventario_pkey PRIMARY KEY (id_movimiento);


--
-- Name: notificacion notificacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificacion
    ADD CONSTRAINT notificacion_pkey PRIMARY KEY (id_notificacion);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (email);


--
-- Name: personal_access_tokens personal_access_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal_access_tokens
    ADD CONSTRAINT personal_access_tokens_pkey PRIMARY KEY (id);


--
-- Name: personal_access_tokens personal_access_tokens_token_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal_access_tokens
    ADD CONSTRAINT personal_access_tokens_token_unique UNIQUE (token);


--
-- Name: pqr pqr_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pqr
    ADD CONSTRAINT pqr_pkey PRIMARY KEY (id_pqr);


--
-- Name: presentacion_medicamento presentacion_medicamento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.presentacion_medicamento
    ADD CONSTRAINT presentacion_medicamento_pkey PRIMARY KEY (id_presentacion);


--
-- Name: prioridad prioridad_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prioridad
    ADD CONSTRAINT prioridad_pkey PRIMARY KEY (id_prioridad);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: receta_detalle receta_detalle_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receta_detalle
    ADD CONSTRAINT receta_detalle_pkey PRIMARY KEY (id_detalle_receta);


--
-- Name: receta receta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receta
    ADD CONSTRAINT receta_pkey PRIMARY KEY (id_receta);


--
-- Name: remision remision_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.remision
    ADD CONSTRAINT remision_pkey PRIMARY KEY (id_remision);


--
-- Name: respaldo_empresa respaldo_empresa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.respaldo_empresa
    ADD CONSTRAINT respaldo_empresa_pkey PRIMARY KEY (id_respaldo);


--
-- Name: rol rol_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol
    ADD CONSTRAINT rol_pkey PRIMARY KEY (id_rol);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: solicitud_cita solicitud_cita_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitud_cita
    ADD CONSTRAINT solicitud_cita_pkey PRIMARY KEY (id_solicitud);


--
-- Name: superadmin superadmin_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.superadmin
    ADD CONSTRAINT superadmin_email_key UNIQUE (email);


--
-- Name: superadmin superadmin_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.superadmin
    ADD CONSTRAINT superadmin_pkey PRIMARY KEY (documento);


--
-- Name: superadmin superadmin_usuario_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.superadmin
    ADD CONSTRAINT superadmin_usuario_key UNIQUE (usuario);


--
-- Name: tipo_cita tipo_cita_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_cita
    ADD CONSTRAINT tipo_cita_pkey PRIMARY KEY (id_tipo_cita);


--
-- Name: tipo_documento tipo_documento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_documento
    ADD CONSTRAINT tipo_documento_pkey PRIMARY KEY (id_tipo_documento);


--
-- Name: tipo_licencia tipo_licencia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_licencia
    ADD CONSTRAINT tipo_licencia_pkey PRIMARY KEY (id_tipo_licencia);


--
-- Name: historial_clinico uq_historial_clinico_id_paciente; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_clinico
    ADD CONSTRAINT uq_historial_clinico_id_paciente UNIQUE (id_paciente);


--
-- Name: historial_detalle uq_historial_detalle_id_cita; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_detalle
    ADD CONSTRAINT uq_historial_detalle_id_cita UNIQUE (id_cita);


--
-- Name: usuario usuario_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_email_key UNIQUE (email);


--
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (documento);


--
-- Name: idx_cita_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cita_fecha ON public.cita USING btree (fecha);


--
-- Name: idx_enfermedades_nombre; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_enfermedades_nombre ON public.enfermedades USING gin (to_tsvector('spanish'::regconfig, nombre));


--
-- Name: idx_inventario_farmacia_presentacion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventario_farmacia_presentacion ON public.inventario_farmacia USING btree (nit_farmacia, id_presentacion);


--
-- Name: idx_lote_farmacia_presentacion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lote_farmacia_presentacion ON public.lote_medicamento USING btree (nit_farmacia, id_presentacion);


--
-- Name: idx_lote_vencimiento; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lote_vencimiento ON public.lote_medicamento USING btree (id_presentacion, fecha_vencimiento);


--
-- Name: idx_lote_vencimiento_alerta; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lote_vencimiento_alerta ON public.lote_medicamento USING btree (fecha_vencimiento);


--
-- Name: idx_lotes_con_stock; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lotes_con_stock ON public.lote_medicamento USING btree (id_presentacion, fecha_vencimiento) WHERE (stock_actual > 0);


--
-- Name: idx_movimiento_dispensacion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_movimiento_dispensacion ON public.movimiento_inventario USING btree (id_dispensacion);


--
-- Name: idx_movimiento_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_movimiento_fecha ON public.movimiento_inventario USING btree (fecha);


--
-- Name: idx_movimiento_lote; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_movimiento_lote ON public.movimiento_inventario USING btree (id_lote);


--
-- Name: idx_movimiento_lote_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_movimiento_lote_fecha ON public.movimiento_inventario USING btree (id_lote, fecha);


--
-- Name: idx_movimiento_tipo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_movimiento_tipo ON public.movimiento_inventario USING btree (tipo_movimiento);


--
-- Name: jobs_queue_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX jobs_queue_index ON public.jobs USING btree (queue);


--
-- Name: personal_access_tokens_tokenable_type_tokenable_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX personal_access_tokens_tokenable_type_tokenable_id_index ON public.personal_access_tokens USING btree (tokenable_type, tokenable_id);


--
-- Name: sessions_last_activity_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sessions_last_activity_index ON public.sessions USING btree (last_activity);


--
-- Name: sessions_user_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sessions_user_id_index ON public.sessions USING btree (user_id);


--
-- Name: cita trg_prevent_past_cita_edit; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_prevent_past_cita_edit BEFORE UPDATE ON public.cita FOR EACH ROW EXECUTE FUNCTION public.prevent_past_cita_edit();


--
-- Name: usuario trigger_historial_admins; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_historial_admins AFTER INSERT ON public.usuario FOR EACH ROW EXECUTE FUNCTION public.guardar_historial_admins();


--
-- Name: empresa trigger_respaldo_empresa; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_respaldo_empresa BEFORE UPDATE ON public.empresa FOR EACH ROW EXECUTE FUNCTION public.guardar_historial_empresa();


--
-- Name: categoria_examen categoria_examen_id_estado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria_examen
    ADD CONSTRAINT categoria_examen_id_estado_fkey FOREIGN KEY (id_estado) REFERENCES public.estado(id_estado) NOT VALID;


--
-- Name: categoria_medicamento categoria_medicamento_id_estado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria_medicamento
    ADD CONSTRAINT categoria_medicamento_id_estado_fkey FOREIGN KEY (id_estado) REFERENCES public.estado(id_estado) NOT VALID;


--
-- Name: cita cita_doc_medico_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cita
    ADD CONSTRAINT cita_doc_medico_fkey FOREIGN KEY (doc_medico) REFERENCES public.usuario(documento);


--
-- Name: cita cita_doc_paciente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cita
    ADD CONSTRAINT cita_doc_paciente_fkey FOREIGN KEY (doc_paciente) REFERENCES public.usuario(documento);


--
-- Name: cita cita_id_especialidad_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cita
    ADD CONSTRAINT cita_id_especialidad_foreign FOREIGN KEY (id_especialidad) REFERENCES public.especialidad(id_especialidad) ON DELETE SET NULL;


--
-- Name: cita cita_id_estado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cita
    ADD CONSTRAINT cita_id_estado_fkey FOREIGN KEY (id_estado) REFERENCES public.estado(id_estado);


--
-- Name: cita cita_id_examen_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cita
    ADD CONSTRAINT cita_id_examen_foreign FOREIGN KEY (id_examen) REFERENCES public.examen(id_examen) ON DELETE SET NULL;


--
-- Name: cita cita_id_motivo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cita
    ADD CONSTRAINT cita_id_motivo_fkey FOREIGN KEY (id_motivo) REFERENCES public.motivo_consulta(id_motivo) NOT VALID;


--
-- Name: ciudad ciudad_id_departamento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ciudad
    ADD CONSTRAINT ciudad_id_departamento_fkey FOREIGN KEY (id_departamento) REFERENCES public.departamento("codigo_DANE");


--
-- Name: ciudad ciudad_id_estado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ciudad
    ADD CONSTRAINT ciudad_id_estado_fkey FOREIGN KEY (id_estado) REFERENCES public.estado(id_estado) NOT VALID;


--
-- Name: departamento departamento_id_estado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departamento
    ADD CONSTRAINT departamento_id_estado_fkey FOREIGN KEY (id_estado) REFERENCES public.estado(id_estado) NOT VALID;


--
-- Name: receta_detalle detalle_medicamento_id_receta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receta_detalle
    ADD CONSTRAINT detalle_medicamento_id_receta_fkey FOREIGN KEY (id_receta) REFERENCES public.receta(id_receta) NOT VALID;


--
-- Name: dispensacion_farmacia dispensacion_farmacia_documento_farmaceutico_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dispensacion_farmacia
    ADD CONSTRAINT dispensacion_farmacia_documento_farmaceutico_fkey FOREIGN KEY (documento_farmaceutico) REFERENCES public.usuario(documento);


--
-- Name: dispensacion_farmacia dispensacion_farmacia_id_detalle_receta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dispensacion_farmacia
    ADD CONSTRAINT dispensacion_farmacia_id_detalle_receta_fkey FOREIGN KEY (id_detalle_receta) REFERENCES public.receta_detalle(id_detalle_receta) NOT VALID;


--
-- Name: dispensacion_farmacia dispensacion_farmacia_id_estado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dispensacion_farmacia
    ADD CONSTRAINT dispensacion_farmacia_id_estado_fkey FOREIGN KEY (id_estado) REFERENCES public.estado(id_estado);


--
-- Name: dispensacion_farmacia dispensacion_farmacia_nit_farmacia_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dispensacion_farmacia
    ADD CONSTRAINT dispensacion_farmacia_nit_farmacia_fkey FOREIGN KEY (nit_farmacia) REFERENCES public.farmacia(nit);


--
-- Name: empresa empresa_id_ciudad_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa
    ADD CONSTRAINT empresa_id_ciudad_fkey FOREIGN KEY (id_ciudad) REFERENCES public.ciudad(codigo_postal);


--
-- Name: empresa empresa_id_estado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa
    ADD CONSTRAINT empresa_id_estado_fkey FOREIGN KEY (id_estado) REFERENCES public.estado(id_estado);


--
-- Name: empresa_licencia empresa_licencia_id_estado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_licencia
    ADD CONSTRAINT empresa_licencia_id_estado_fkey FOREIGN KEY (id_estado) REFERENCES public.estado(id_estado);


--
-- Name: empresa_licencia empresa_licencia_id_tipo_licencia_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_licencia
    ADD CONSTRAINT empresa_licencia_id_tipo_licencia_fkey FOREIGN KEY (id_tipo_licencia) REFERENCES public.tipo_licencia(id_tipo_licencia);


--
-- Name: empresa_licencia empresa_licencia_nit_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_licencia
    ADD CONSTRAINT empresa_licencia_nit_fkey FOREIGN KEY (nit) REFERENCES public.empresa(nit);


--
-- Name: especialidad especialidad_id_estado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.especialidad
    ADD CONSTRAINT especialidad_id_estado_fkey FOREIGN KEY (id_estado) REFERENCES public.estado(id_estado) NOT VALID;


--
-- Name: examen examen_id_categoria_examen_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.examen
    ADD CONSTRAINT examen_id_categoria_examen_fkey FOREIGN KEY (id_categoria_examen) REFERENCES public.categoria_examen(id_categoria_examen);


--
-- Name: farmacia farmacia_id_estado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.farmacia
    ADD CONSTRAINT farmacia_id_estado_fkey FOREIGN KEY (id_estado) REFERENCES public.estado(id_estado) NOT VALID;


--
-- Name: farmacia farmacia_nit_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.farmacia
    ADD CONSTRAINT farmacia_nit_empresa_fkey FOREIGN KEY (nit_empresa) REFERENCES public.empresa(nit) NOT VALID;


--
-- Name: examen fk_examen_estado; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.examen
    ADD CONSTRAINT fk_examen_estado FOREIGN KEY (id_estado) REFERENCES public.estado(id_estado);


--
-- Name: examen fk_examen_paciente; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.examen
    ADD CONSTRAINT fk_examen_paciente FOREIGN KEY (doc_paciente) REFERENCES public.usuario(documento);


--
-- Name: receta_detalle fk_nit_farmacia; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receta_detalle
    ADD CONSTRAINT fk_nit_farmacia FOREIGN KEY (nit_farmacia) REFERENCES public.farmacia(nit);


--
-- Name: historial_clinico historial_clinico_id_paciente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_clinico
    ADD CONSTRAINT historial_clinico_id_paciente_fkey FOREIGN KEY (id_paciente) REFERENCES public.usuario(documento);


--
-- Name: historial_detalle historial_detalle_id_cita_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_detalle
    ADD CONSTRAINT historial_detalle_id_cita_fkey FOREIGN KEY (id_cita) REFERENCES public.cita(id_cita);


--
-- Name: historial_detalle historial_detalle_id_historial_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_detalle
    ADD CONSTRAINT historial_detalle_id_historial_fkey FOREIGN KEY (id_historial) REFERENCES public.historial_clinico(id_historial);


--
-- Name: historial_enfermedades historial_enfermedads_enfermedad_codigo_icd_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_enfermedades
    ADD CONSTRAINT historial_enfermedads_enfermedad_codigo_icd_foreign FOREIGN KEY (enfermedad_codigo_icd) REFERENCES public.enfermedades(codigo_icd) ON DELETE CASCADE;


--
-- Name: historial_enfermedades historial_enfermedads_historial_detalle_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_enfermedades
    ADD CONSTRAINT historial_enfermedads_historial_detalle_id_foreign FOREIGN KEY (historial_detalle_id) REFERENCES public.historial_detalle(id_detalle) ON DELETE CASCADE;


--
-- Name: historial_reportes historial_reportes_id_usuario_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_reportes
    ADD CONSTRAINT historial_reportes_id_usuario_foreign FOREIGN KEY (id_usuario) REFERENCES public.usuario(documento) ON DELETE SET NULL;


--
-- Name: prioridad id_estado; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prioridad
    ADD CONSTRAINT id_estado FOREIGN KEY (id_estado) REFERENCES public.estado(id_estado) NOT VALID;


--
-- Name: inventario_farmacia inventario_farmacia_id_presentacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventario_farmacia
    ADD CONSTRAINT inventario_farmacia_id_presentacion_fkey FOREIGN KEY (id_presentacion) REFERENCES public.presentacion_medicamento(id_presentacion) NOT VALID;


--
-- Name: inventario_farmacia inventario_farmacia_nit_farmacia_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventario_farmacia
    ADD CONSTRAINT inventario_farmacia_nit_farmacia_fkey FOREIGN KEY (nit_farmacia) REFERENCES public.farmacia(nit);


--
-- Name: lote_medicamento lote_medicamento_id_presentacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lote_medicamento
    ADD CONSTRAINT lote_medicamento_id_presentacion_fkey FOREIGN KEY (id_presentacion) REFERENCES public.presentacion_medicamento(id_presentacion);


--
-- Name: lote_medicamento lote_medicamento_nit_farmacia_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lote_medicamento
    ADD CONSTRAINT lote_medicamento_nit_farmacia_fkey FOREIGN KEY (nit_farmacia) REFERENCES public.farmacia(nit);


--
-- Name: medicamento medicamento_id_categoria_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medicamento
    ADD CONSTRAINT medicamento_id_categoria_fkey FOREIGN KEY (id_categoria) REFERENCES public.categoria_medicamento(id_categoria);


--
-- Name: medicamento medicamento_id_estado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medicamento
    ADD CONSTRAINT medicamento_id_estado_fkey FOREIGN KEY (id_estado) REFERENCES public.estado(id_estado);


--
-- Name: motivo_consulta motivo_consulta_id_estado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.motivo_consulta
    ADD CONSTRAINT motivo_consulta_id_estado_fkey FOREIGN KEY (id_estado) REFERENCES public.estado(id_estado);


--
-- Name: movimiento_inventario movimiento_inventario_documento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_inventario
    ADD CONSTRAINT movimiento_inventario_documento_fkey FOREIGN KEY (documento) REFERENCES public.usuario(documento);


--
-- Name: movimiento_inventario movimiento_inventario_id_dispensacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_inventario
    ADD CONSTRAINT movimiento_inventario_id_dispensacion_fkey FOREIGN KEY (id_dispensacion) REFERENCES public.dispensacion_farmacia(id_dispensacion) NOT VALID;


--
-- Name: movimiento_inventario movimiento_inventario_id_lote_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_inventario
    ADD CONSTRAINT movimiento_inventario_id_lote_fkey FOREIGN KEY (id_lote) REFERENCES public.lote_medicamento(id_lote) NOT VALID;


--
-- Name: notificacion notificacion_doc_usuario_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificacion
    ADD CONSTRAINT notificacion_doc_usuario_foreign FOREIGN KEY (doc_usuario) REFERENCES public.usuario(documento) ON DELETE CASCADE;


--
-- Name: notificacion notificacion_id_cita_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificacion
    ADD CONSTRAINT notificacion_id_cita_foreign FOREIGN KEY (id_cita) REFERENCES public.cita(id_cita) ON DELETE SET NULL;


--
-- Name: pqr pqr_id_estado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pqr
    ADD CONSTRAINT pqr_id_estado_fkey FOREIGN KEY (id_estado) REFERENCES public.estado(id_estado);


--
-- Name: presentacion_medicamento presentacion_medicamento_id_concentracion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.presentacion_medicamento
    ADD CONSTRAINT presentacion_medicamento_id_concentracion_fkey FOREIGN KEY (id_concentracion) REFERENCES public.concentracion(id_concentracion) NOT VALID;


--
-- Name: presentacion_medicamento presentacion_medicamento_id_forma_farmaceutica_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.presentacion_medicamento
    ADD CONSTRAINT presentacion_medicamento_id_forma_farmaceutica_fkey FOREIGN KEY (id_forma_farmaceutica) REFERENCES public.forma_farmaceutica(id_forma) NOT VALID;


--
-- Name: presentacion_medicamento presentacion_medicamento_id_medicamento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.presentacion_medicamento
    ADD CONSTRAINT presentacion_medicamento_id_medicamento_fkey FOREIGN KEY (id_medicamento) REFERENCES public.medicamento(id_medicamento);


--
-- Name: receta_detalle receta_detalle_id_presentacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receta_detalle
    ADD CONSTRAINT receta_detalle_id_presentacion_fkey FOREIGN KEY (id_presentacion) REFERENCES public.presentacion_medicamento(id_presentacion) NOT VALID;


--
-- Name: receta receta_id_detalle_cita_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receta
    ADD CONSTRAINT receta_id_detalle_cita_fkey FOREIGN KEY (id_detalle_cita) REFERENCES public.historial_detalle(id_detalle);


--
-- Name: receta receta_id_estado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receta
    ADD CONSTRAINT receta_id_estado_fkey FOREIGN KEY (id_estado) REFERENCES public.estado(id_estado);


--
-- Name: remision remision_id_categoria_examen_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.remision
    ADD CONSTRAINT remision_id_categoria_examen_foreign FOREIGN KEY (id_categoria_examen) REFERENCES public.categoria_examen(id_categoria_examen) ON DELETE RESTRICT;


--
-- Name: remision remision_id_cita_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.remision
    ADD CONSTRAINT remision_id_cita_foreign FOREIGN KEY (id_cita) REFERENCES public.cita(id_cita) ON DELETE SET NULL;


--
-- Name: remision remision_id_detalle_cita_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.remision
    ADD CONSTRAINT remision_id_detalle_cita_fkey FOREIGN KEY (id_detalle_cita) REFERENCES public.historial_detalle(id_detalle);


--
-- Name: remision remision_id_especialidad_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.remision
    ADD CONSTRAINT remision_id_especialidad_fkey FOREIGN KEY (id_especialidad) REFERENCES public.especialidad(id_especialidad);


--
-- Name: remision remision_id_estado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.remision
    ADD CONSTRAINT remision_id_estado_fkey FOREIGN KEY (id_estado) REFERENCES public.estado(id_estado);


--
-- Name: remision remision_id_examen_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.remision
    ADD CONSTRAINT remision_id_examen_fkey FOREIGN KEY (id_examen) REFERENCES public.examen(id_examen);


--
-- Name: remision remision_id_prioridad_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.remision
    ADD CONSTRAINT remision_id_prioridad_fkey FOREIGN KEY (id_prioridad) REFERENCES public.prioridad(id_prioridad);


--
-- Name: rol rol_id_estado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol
    ADD CONSTRAINT rol_id_estado_fkey FOREIGN KEY (id_estado) REFERENCES public.estado(id_estado) NOT VALID;


--
-- Name: solicitud_cita solicitud_cita_id_cita_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitud_cita
    ADD CONSTRAINT solicitud_cita_id_cita_fkey FOREIGN KEY (id_cita) REFERENCES public.cita(id_cita);


--
-- Name: solicitud_cita solicitud_cita_id_especialidad_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitud_cita
    ADD CONSTRAINT solicitud_cita_id_especialidad_fkey FOREIGN KEY (id_especialidad) REFERENCES public.especialidad(id_especialidad);


--
-- Name: solicitud_cita solicitud_cita_id_estado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitud_cita
    ADD CONSTRAINT solicitud_cita_id_estado_fkey FOREIGN KEY (id_estado) REFERENCES public.estado(id_estado);


--
-- Name: superadmin superadmin_id_rol_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.superadmin
    ADD CONSTRAINT superadmin_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES public.rol(id_rol);


--
-- Name: tipo_cita tipo_cita_id_estado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_cita
    ADD CONSTRAINT tipo_cita_id_estado_fkey FOREIGN KEY (id_estado) REFERENCES public.estado(id_estado) NOT VALID;


--
-- Name: tipo_documento tipo_documento_id_estado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_documento
    ADD CONSTRAINT tipo_documento_id_estado_fkey FOREIGN KEY (id_estado) REFERENCES public.estado(id_estado) NOT VALID;


--
-- Name: tipo_licencia tipo_licencia_id_estado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_licencia
    ADD CONSTRAINT tipo_licencia_id_estado_fkey FOREIGN KEY (id_estado) REFERENCES public.estado(id_estado);


--
-- Name: usuario usuario_id_consultorio_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_id_consultorio_fkey FOREIGN KEY (id_consultorio) REFERENCES public.consultorio(id_consultorio) NOT VALID;


--
-- Name: usuario usuario_id_especialidad_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_id_especialidad_fkey FOREIGN KEY (id_especialidad) REFERENCES public.especialidad(id_especialidad) NOT VALID;


--
-- Name: usuario usuario_id_estado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_id_estado_fkey FOREIGN KEY (id_estado) REFERENCES public.estado(id_estado);


--
-- Name: usuario usuario_id_farmacia_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_id_farmacia_fkey FOREIGN KEY (id_farmacia) REFERENCES public.farmacia(nit) NOT VALID;


--
-- Name: usuario usuario_id_rol_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES public.rol(id_rol);


--
-- Name: usuario usuario_id_tipo_documento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_id_tipo_documento_fkey FOREIGN KEY (id_tipo_documento) REFERENCES public.tipo_documento(id_tipo_documento) NOT VALID;


--
-- Name: usuario usuario_nit_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nit_fkey FOREIGN KEY (nit) REFERENCES public.empresa(nit);


--
-- PostgreSQL database dump complete
--

\unrestrict onbxibOf4za8v6oGu93bA6x6p32MLEF19g5HvNW34FZ10aJgkC8CwFtdFOrUC3Z

