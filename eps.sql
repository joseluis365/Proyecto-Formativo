--
-- PostgreSQL database dump
--

\restrict t2LTomU0lmZadQON3VOv5ub5tRo42DkBqyCR7OEqTxHV1O3Exe2fpOM4uVTiYHd

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
    IF OLD.fecha < CURRENT_DATE THEN
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
    updated_at timestamp without time zone
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
    id_examen bigint
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
    nit_farmacia character varying
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
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
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
-- Name: historial_clinico; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historial_clinico (
    id_historial integer NOT NULL,
    id_paciente integer,
    antecedentes_personales text,
    antecedentes_familiares text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
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
-- Name: tipo_licencia tipo_licencia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_licencia
    ADD CONSTRAINT tipo_licencia_pkey PRIMARY KEY (id_tipo_licencia);


--
-- Name: cita uq_cita_medico_fecha_hora; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cita
    ADD CONSTRAINT uq_cita_medico_fecha_hora UNIQUE (doc_medico, fecha, hora_inicio);


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
-- Name: tipo_licencia tipo_licencia_id_estado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_licencia
    ADD CONSTRAINT tipo_licencia_id_estado_fkey FOREIGN KEY (id_estado) REFERENCES public.estado(id_estado);


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
-- Name: usuario usuario_nit_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nit_fkey FOREIGN KEY (nit) REFERENCES public.empresa(nit);


--
-- PostgreSQL database dump complete
--

\unrestrict t2LTomU0lmZadQON3VOv5ub5tRo42DkBqyCR7OEqTxHV1O3Exe2fpOM4uVTiYHd

