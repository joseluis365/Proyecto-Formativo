-- PostgreSQL database dump
--

\restrict 33lUU6pg1HqN4LXrwa8RZMqSGkReav9gzV7nQ2T5QYmIQIOipQiBOnGgXRVBzJh

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
    categoria character varying(100)
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
    categoria character varying(100)
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
    fecha date NOT NULL,
    hora_inicio time without time zone NOT NULL,
    hora_fin time without time zone NOT NULL,
    motivo character varying(300),
    tipo_cita_id integer,
    id_estado integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.cita OWNER TO postgres;

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
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.ciudad OWNER TO postgres;

--
-- Name: departamento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departamento (
    "codigo_DANE" integer CONSTRAINT departamento_id_departamento_not_null NOT NULL,
    nombre character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.departamento OWNER TO postgres;

--
-- Name: detalle_medicamento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.detalle_medicamento (
    id_detalle_medicamento integer NOT NULL,
    id_orden integer NOT NULL,
    id_medicamento integer NOT NULL,
    dosis character varying(100) NOT NULL,
    frecuencia character varying(100) NOT NULL,
    duracion character varying(100) NOT NULL,
    observaciones text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.detalle_medicamento OWNER TO postgres;

--
-- Name: detalle_medicamento_id_detalle_medicamento_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.detalle_medicamento ALTER COLUMN id_detalle_medicamento ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.detalle_medicamento_id_detalle_medicamento_seq
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
    especialidad character varying(150) NOT NULL
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
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.farmacia OWNER TO postgres;

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
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.historial_detalle OWNER TO postgres;

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
-- Name: medicamento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.medicamento (
    id_medicamento integer NOT NULL,
    nombre character varying(150),
    presentacion character varying(100),
    descripcion text,
    stock_disponible integer,
    precio_unitario numeric(11,2),
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
    id_medicamento integer,
    tipo_movimiento character varying(20),
    cantidad integer,
    fecha date,
    documento integer,
    motivo character varying(200),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
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
-- Name: orden_medicamento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orden_medicamento (
    id_orden integer NOT NULL,
    id_detalle_cita integer NOT NULL,
    nit_farmacia character varying(20) NOT NULL,
    fecha_vencimiento date NOT NULL,
    id_estado integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.orden_medicamento OWNER TO postgres;

--
-- Name: orden_medicamento_id_orden_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.orden_medicamento ALTER COLUMN id_orden ADD GENERATED ALWAYS AS IDENTITY (
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
-- Name: prioridad; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prioridad (
    id_prioridad integer NOT NULL,
    prioridad character varying(30)
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
-- Name: rol; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rol (
    id_rol integer NOT NULL,
    tipo_usu character varying(50)
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
    tipo character varying(50)
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
-- Name: personal_access_tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal_access_tokens ALTER COLUMN id SET DEFAULT nextval('public.personal_access_tokens_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Data for Name: activities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activities (id, title, type, icon, created_at, updated_at, channel_name) FROM stdin;
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

COPY public.categoria_examen (id_categoria_examen, categoria) FROM stdin;
\.


--
-- Data for Name: categoria_medicamento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categoria_medicamento (id_categoria, categoria) FROM stdin;
\.


--
-- Data for Name: cita; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cita (id_cita, doc_paciente, doc_medico, fecha, hora_inicio, hora_fin, motivo, tipo_cita_id, id_estado, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: ciudad; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ciudad (codigo_postal, nombre, id_departamento, created_at, updated_at) FROM stdin;
730001	Ibagué	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730024	Alpujarra	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730026	Alvarado	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730030	Ambalema	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730043	Anzoátegui	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730055	Armero	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730067	Ataco	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730124	Cajamarca	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730148	Carmen de Apicalá	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730152	Casabianca	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730168	Chaparral	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730200	Coello	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730217	Coyaima	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730226	Cunday	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730236	Dolores	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730268	Espinal	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730270	Falan	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730275	Flandes	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730283	Fresno	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730319	Guamo	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730347	Herveo	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730349	Honda	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730352	Icononzo	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730408	Lérida	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730411	Líbano	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730443	Mariquita	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730449	Melgar	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730461	Murillo	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730483	Natagaima	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730504	Ortega	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730520	Palocabildo	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730547	Piedras	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730555	Planadas	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730563	Prado	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730585	Purificación	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730616	Rioblanco	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730622	Roncesvalles	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730624	Rovira	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730671	Saldaña	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730675	San Antonio	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730678	San Luis	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730686	Santa Isabel	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730770	Suárez	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730854	Valle de San Juan	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730861	Venadillo	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730870	Villahermosa	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
730873	Villarrica	73	2026-02-18 09:16:48.909778	2026-02-18 09:16:48.909778
\.


--
-- Data for Name: departamento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departamento ("codigo_DANE", nombre, created_at, updated_at) FROM stdin;
73	Tolima	2026-02-18 09:10:51.975251	2026-02-18 09:10:51.975251
\.


--
-- Data for Name: detalle_medicamento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.detalle_medicamento (id_detalle_medicamento, id_orden, id_medicamento, dosis, frecuencia, duracion, observaciones, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: empresa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.empresa (nit, nombre, email_contacto, telefono, direccion, documento_representante, nombre_representante, telefono_representante, email_representante, id_ciudad, id_estado, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: empresa_licencia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.empresa_licencia (id_empresa_licencia, nit, id_tipo_licencia, fecha_inicio, fecha_fin, id_estado, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: especialidad; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.especialidad (id_especialidad, especialidad) FROM stdin;
1	Medicina General
2	Pediatría
3	Medicina Interna
4	Cardiología
5	Traumatología
6	Ginecología
7	Neurología
8	Neumología
9	Dermatología
10	Oftalmología
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
\.


--
-- Data for Name: examen; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.examen (id_examen, nombre, id_categoria_examen, requiere_ayuno, descripcion, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: failed_jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.failed_jobs (id, uuid, connection, queue, payload, exception, failed_at) FROM stdin;
\.


--
-- Data for Name: farmacia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.farmacia (nit, nombre, direccion, telefono, email, nombre_contacto, horario_apertura, horario_cierre, abierto_24h, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: historial_clinico; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historial_clinico (id_historial, id_paciente, antecedentes_personales, antecedentes_familiares, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: historial_detalle; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historial_detalle (id_detalle, id_historial, id_cita, diagnostico, tratamiento, notas_medicas, observaciones, created_at, updated_at) FROM stdin;
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
\.


--
-- Data for Name: medicamento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.medicamento (id_medicamento, nombre, presentacion, descripcion, stock_disponible, precio_unitario, id_categoria, id_estado, created_at, updated_at) FROM stdin;
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
\.


--
-- Data for Name: movimiento_inventario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.movimiento_inventario (id_movimiento, id_medicamento, tipo_movimiento, cantidad, fecha, documento, motivo, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: orden_medicamento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orden_medicamento (id_orden, id_detalle_cita, nit_farmacia, fecha_vencimiento, id_estado, created_at, updated_at) FROM stdin;
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
44	App\\Models\\Superadmin	123456789	superadmin_auth_token	fc677f00b80859570ea3f0dd7c7499f9f72b41e3795358a7ed096de8c27a9c55	["*"]	2026-02-25 03:16:16	\N	2026-02-24 21:19:15	2026-02-25 03:16:16
48	App\\Models\\Usuario	1111111	auth_token	971105c799eacac44465f0ea17a0f9a910af3716053da0159f09711d7cdd7b4b	["*"]	\N	\N	2026-02-25 19:27:01	2026-02-25 19:27:01
45	App\\Models\\Usuario	123	auth_token	0d0be4b48d2b071bfc83d8ae9dd16ace1a4061489a17c7458cf6c9ec58614763	["*"]	2026-02-24 21:51:04	\N	2026-02-24 21:49:03	2026-02-24 21:51:04
\.


--
-- Data for Name: prioridad; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.prioridad (id_prioridad, prioridad) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, description, price, stock, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: remision; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.remision (id_remision, id_detalle_cita, tipo_remision, id_especialidad, id_examen, id_prioridad, notas, id_estado, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: rol; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rol (id_rol, tipo_usu) FROM stdin;
1	Super Admin
2	Admin
3	personal Administrativo
4	Medico
5	Paciente
6	Farmaceutico
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
123456789	Super Admin	admin	joseluis1409rodriguez@gmail.com	$2y$12$U8Plf0TUc2nDTFCkXXuXg.lcliq6LXzs.SIyQ0wwWBg787ANQX/lm	1	2026-02-11 21:11:20	2026-02-23 19:13:08
\.


--
-- Data for Name: tipo_cita; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tipo_cita (id_tipo_cita, tipo) FROM stdin;
\.


--
-- Data for Name: tipo_licencia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tipo_licencia (id_tipo_licencia, tipo, descripcion, duracion_meses, precio, id_estado, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario (documento, primer_nombre, primer_apellido, email, telefono, direccion, sexo, fecha_nacimiento, grupo_sanguineo, contrasena, registro_profesional, nit, id_rol, id_estado, created_at, updated_at, id_especialidad, segundo_nombre, segundo_apellido) FROM stdin;
\.


--
-- Name: activities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.activities_id_seq', 85, true);


--
-- Name: categoria_examen_id_categoria_examen_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categoria_examen_id_categoria_examen_seq', 1, false);


--
-- Name: categoria_medicamento_id_categoria_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categoria_medicamento_id_categoria_seq', 1, false);


--
-- Name: cita_id_cita_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cita_id_cita_seq', 1, false);


--
-- Name: detalle_medicamento_id_detalle_medicamento_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.detalle_medicamento_id_detalle_medicamento_seq', 1, false);


--
-- Name: especialidad_id_especialidad_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.especialidad_id_especialidad_seq', 10, true);


--
-- Name: estado_id_estado_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.estado_id_estado_seq', 6, true);


--
-- Name: examen_id_examen_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.examen_id_examen_seq', 1, false);


--
-- Name: failed_jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.failed_jobs_id_seq', 1, false);


--
-- Name: historial_clinico_id_historial_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historial_clinico_id_historial_seq', 1, false);


--
-- Name: historial_detalle_id_detalle_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historial_detalle_id_detalle_seq', 1, false);


--
-- Name: jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jobs_id_seq', 1, false);


--
-- Name: medicamento_id_medicamento_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.medicamento_id_medicamento_seq', 1, false);


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.migrations_id_seq', 10, true);


--
-- Name: movimiento_inventario_id_movimiento_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.movimiento_inventario_id_movimiento_seq', 1, false);


--
-- Name: orden_medicamento_id_orden_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orden_medicamento_id_orden_seq', 1, false);


--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.personal_access_tokens_id_seq', 49, true);


--
-- Name: prioridad_id_prioridad_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.prioridad_id_prioridad_seq', 1, false);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 1, false);


--
-- Name: remision_id_remision_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.remision_id_remision_seq', 1, false);


--
-- Name: rol_id_rol_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rol_id_rol_seq', 6, true);


--
-- Name: solicitud_cita_id_solicitud_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.solicitud_cita_id_solicitud_seq', 1, false);


--
-- Name: tipo_cita_id_tipo_cita_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tipo_cita_id_tipo_cita_seq', 1, false);


--
-- Name: tipo_licencia_id_tipo_licencia_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tipo_licencia_id_tipo_licencia_seq', 22, true);


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
-- Name: departamento departamento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departamento
    ADD CONSTRAINT departamento_pkey PRIMARY KEY ("codigo_DANE");


--
-- Name: detalle_medicamento detalle_medicamento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_medicamento
    ADD CONSTRAINT detalle_medicamento_pkey PRIMARY KEY (id_detalle_medicamento);


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
-- Name: orden_medicamento orden_medicamento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orden_medicamento
    ADD CONSTRAINT orden_medicamento_pkey PRIMARY KEY (id_orden);


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
-- Name: remision remision_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.remision
    ADD CONSTRAINT remision_pkey PRIMARY KEY (id_remision);


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
-- Name: cita cita_id_estado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cita
    ADD CONSTRAINT cita_id_estado_fkey FOREIGN KEY (id_estado) REFERENCES public.estado(id_estado);


--
-- Name: cita cita_tipo_cita_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cita
    ADD CONSTRAINT cita_tipo_cita_id_fkey FOREIGN KEY (tipo_cita_id) REFERENCES public.tipo_cita(id_tipo_cita);


--
-- Name: ciudad ciudad_id_departamento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ciudad
    ADD CONSTRAINT ciudad_id_departamento_fkey FOREIGN KEY (id_departamento) REFERENCES public.departamento("codigo_DANE");


--
-- Name: detalle_medicamento detalle_medicamento_id_medicamento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_medicamento
    ADD CONSTRAINT detalle_medicamento_id_medicamento_fkey FOREIGN KEY (id_medicamento) REFERENCES public.medicamento(id_medicamento);


--
-- Name: detalle_medicamento detalle_medicamento_id_orden_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_medicamento
    ADD CONSTRAINT detalle_medicamento_id_orden_fkey FOREIGN KEY (id_orden) REFERENCES public.orden_medicamento(id_orden);


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
-- Name: examen examen_id_categoria_examen_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.examen
    ADD CONSTRAINT examen_id_categoria_examen_fkey FOREIGN KEY (id_categoria_examen) REFERENCES public.categoria_examen(id_categoria_examen);


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
-- Name: movimiento_inventario movimiento_inventario_id_medicamento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_inventario
    ADD CONSTRAINT movimiento_inventario_id_medicamento_fkey FOREIGN KEY (id_medicamento) REFERENCES public.medicamento(id_medicamento);


--
-- Name: orden_medicamento orden_medicamento_id_detalle_cita_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orden_medicamento
    ADD CONSTRAINT orden_medicamento_id_detalle_cita_fkey FOREIGN KEY (id_detalle_cita) REFERENCES public.historial_detalle(id_detalle);


--
-- Name: orden_medicamento orden_medicamento_id_estado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orden_medicamento
    ADD CONSTRAINT orden_medicamento_id_estado_fkey FOREIGN KEY (id_estado) REFERENCES public.estado(id_estado);


--
-- Name: orden_medicamento orden_medicamento_nit_farmacia_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orden_medicamento
    ADD CONSTRAINT orden_medicamento_nit_farmacia_fkey FOREIGN KEY (nit_farmacia) REFERENCES public.farmacia(nit) ON DELETE CASCADE;


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

\unrestrict 33lUU6pg1HqN4LXrwa8RZMqSGkReav9gzV7nQ2T5QYmIQIOipQiBOnGgXRVBzJh

