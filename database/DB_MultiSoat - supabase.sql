--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.5

-- Started on 2025-07-12 17:38:29

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 275 (class 1259 OID 17291)
-- Name: access_status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.access_status (
    id integer NOT NULL,
    description text
);


ALTER TABLE public.access_status OWNER TO postgres;

--
-- TOC entry 274 (class 1259 OID 17290)
-- Name: access_status_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.access_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.access_status_id_seq OWNER TO postgres;

--
-- TOC entry 3843 (class 0 OID 0)
-- Dependencies: 274
-- Name: access_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.access_status_id_seq OWNED BY public.access_status.id;


--
-- TOC entry 295 (class 1259 OID 17394)
-- Name: app_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.app_user (
    id integer NOT NULL,
    auth_id uuid,
    role_id integer,
    person_data_id integer,
    organization_id integer,
    first_name character varying(100),
    last_name character varying(100),
    phone character varying(20),
    email character varying(100),
    photo character varying(100),
    access_status_id integer,
    created_by integer,
    updated_by integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.app_user OWNER TO postgres;

--
-- TOC entry 294 (class 1259 OID 17393)
-- Name: app_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.app_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.app_user_id_seq OWNER TO postgres;

--
-- TOC entry 3846 (class 0 OID 0)
-- Dependencies: 294
-- Name: app_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.app_user_id_seq OWNED BY public.app_user.id;


--
-- TOC entry 303 (class 1259 OID 17457)
-- Name: certificate; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.certificate (
    id integer NOT NULL,
    company_id integer,
    certificate_type_id integer,
    certificate_number character varying(100),
    amount double precision,
    payment_type_id integer,
    certificate_status_id integer,
    certificate_category_id integer,
    hierarchy_id integer,
    created_by integer,
    updated_by integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.certificate OWNER TO postgres;

--
-- TOC entry 289 (class 1259 OID 17352)
-- Name: certificate_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.certificate_category (
    id integer NOT NULL,
    description text
);


ALTER TABLE public.certificate_category OWNER TO postgres;

--
-- TOC entry 288 (class 1259 OID 17351)
-- Name: certificate_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.certificate_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.certificate_category_id_seq OWNER TO postgres;

--
-- TOC entry 3850 (class 0 OID 0)
-- Dependencies: 288
-- Name: certificate_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.certificate_category_id_seq OWNED BY public.certificate_category.id;


--
-- TOC entry 302 (class 1259 OID 17456)
-- Name: certificate_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.certificate_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.certificate_id_seq OWNER TO postgres;

--
-- TOC entry 3852 (class 0 OID 0)
-- Dependencies: 302
-- Name: certificate_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.certificate_id_seq OWNED BY public.certificate.id;


--
-- TOC entry 279 (class 1259 OID 17309)
-- Name: certificate_status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.certificate_status (
    id integer NOT NULL,
    description text
);


ALTER TABLE public.certificate_status OWNER TO postgres;

--
-- TOC entry 278 (class 1259 OID 17308)
-- Name: certificate_status_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.certificate_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.certificate_status_id_seq OWNER TO postgres;

--
-- TOC entry 3855 (class 0 OID 0)
-- Dependencies: 278
-- Name: certificate_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.certificate_status_id_seq OWNED BY public.certificate_status.id;


--
-- TOC entry 287 (class 1259 OID 17343)
-- Name: certificate_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.certificate_type (
    id integer NOT NULL,
    description text
);


ALTER TABLE public.certificate_type OWNER TO postgres;

--
-- TOC entry 286 (class 1259 OID 17342)
-- Name: certificate_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.certificate_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.certificate_type_id_seq OWNER TO postgres;

--
-- TOC entry 3858 (class 0 OID 0)
-- Dependencies: 286
-- Name: certificate_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.certificate_type_id_seq OWNED BY public.certificate_type.id;


--
-- TOC entry 299 (class 1259 OID 17438)
-- Name: client; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.client (
    id integer NOT NULL,
    person_data_id integer,
    client_type_id integer
);


ALTER TABLE public.client OWNER TO postgres;

--
-- TOC entry 298 (class 1259 OID 17437)
-- Name: client_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.client_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.client_id_seq OWNER TO postgres;

--
-- TOC entry 3861 (class 0 OID 0)
-- Dependencies: 298
-- Name: client_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.client_id_seq OWNED BY public.client.id;


--
-- TOC entry 283 (class 1259 OID 17327)
-- Name: client_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.client_type (
    id integer NOT NULL,
    description character varying(100)
);


ALTER TABLE public.client_type OWNER TO postgres;

--
-- TOC entry 282 (class 1259 OID 17326)
-- Name: client_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.client_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.client_type_id_seq OWNER TO postgres;

--
-- TOC entry 3864 (class 0 OID 0)
-- Dependencies: 282
-- Name: client_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.client_type_id_seq OWNED BY public.client_type.id;


--
-- TOC entry 277 (class 1259 OID 17300)
-- Name: finance_status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.finance_status (
    id integer NOT NULL,
    description text
);


ALTER TABLE public.finance_status OWNER TO postgres;

--
-- TOC entry 276 (class 1259 OID 17299)
-- Name: finance_status_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.finance_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.finance_status_id_seq OWNER TO postgres;

--
-- TOC entry 3867 (class 0 OID 0)
-- Dependencies: 276
-- Name: finance_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.finance_status_id_seq OWNED BY public.finance_status.id;


--
-- TOC entry 297 (class 1259 OID 17416)
-- Name: hierarchy; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hierarchy (
    id integer NOT NULL,
    company_id integer,
    distributor_id integer,
    point_of_sale_id integer
);


ALTER TABLE public.hierarchy OWNER TO postgres;

--
-- TOC entry 296 (class 1259 OID 17415)
-- Name: hierarchy_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hierarchy_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hierarchy_id_seq OWNER TO postgres;

--
-- TOC entry 3870 (class 0 OID 0)
-- Dependencies: 296
-- Name: hierarchy_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hierarchy_id_seq OWNED BY public.hierarchy.id;


--
-- TOC entry 307 (class 1259 OID 17516)
-- Name: income; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.income (
    id integer NOT NULL,
    sale_id integer,
    commission_amount numeric(10,2),
    total_installments integer,
    finance_status_id integer,
    collection_date timestamp without time zone,
    created_by integer,
    updated_by integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.income OWNER TO postgres;

--
-- TOC entry 306 (class 1259 OID 17515)
-- Name: income_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.income_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.income_id_seq OWNER TO postgres;

--
-- TOC entry 3873 (class 0 OID 0)
-- Dependencies: 306
-- Name: income_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.income_id_seq OWNED BY public.income.id;


--
-- TOC entry 309 (class 1259 OID 17533)
-- Name: installment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.installment (
    id integer NOT NULL,
    income_id integer,
    installment_number integer,
    amount numeric,
    due_date timestamp without time zone,
    finance_status_id integer,
    created_by integer,
    updated_by integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.installment OWNER TO postgres;

--
-- TOC entry 308 (class 1259 OID 17532)
-- Name: installment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.installment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.installment_id_seq OWNER TO postgres;

--
-- TOC entry 3876 (class 0 OID 0)
-- Dependencies: 308
-- Name: installment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.installment_id_seq OWNED BY public.installment.id;


--
-- TOC entry 293 (class 1259 OID 17370)
-- Name: organization; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.organization (
    id integer NOT NULL,
    organization_type_id integer,
    organization_data_id integer,
    name character varying(100),
    document_number character varying(20),
    ubigeo character(6),
    address character varying(100),
    location character varying(100),
    zone_id character varying(20),
    phone character varying(20),
    email character varying(100),
    photo character varying(100),
    website character varying(100),
    contact_name character varying(100),
    contact_email character varying(100),
    contact_phone character varying(20),
    permission_id integer,
    access_status_id integer,
    created_by integer,
    updated_by integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.organization OWNER TO postgres;

--
-- TOC entry 292 (class 1259 OID 17369)
-- Name: organization_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.organization_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.organization_id_seq OWNER TO postgres;

--
-- TOC entry 3879 (class 0 OID 0)
-- Dependencies: 292
-- Name: organization_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.organization_id_seq OWNED BY public.organization.id;


--
-- TOC entry 273 (class 1259 OID 17284)
-- Name: organization_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.organization_type (
    id integer NOT NULL,
    description character varying(100)
);


ALTER TABLE public.organization_type OWNER TO postgres;

--
-- TOC entry 272 (class 1259 OID 17283)
-- Name: organization_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.organization_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.organization_type_id_seq OWNER TO postgres;

--
-- TOC entry 3882 (class 0 OID 0)
-- Dependencies: 272
-- Name: organization_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.organization_type_id_seq OWNED BY public.organization_type.id;


--
-- TOC entry 285 (class 1259 OID 17334)
-- Name: payment_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_type (
    id integer NOT NULL,
    description text
);


ALTER TABLE public.payment_type OWNER TO postgres;

--
-- TOC entry 284 (class 1259 OID 17333)
-- Name: payment_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payment_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payment_type_id_seq OWNER TO postgres;

--
-- TOC entry 3885 (class 0 OID 0)
-- Dependencies: 284
-- Name: payment_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payment_type_id_seq OWNED BY public.payment_type.id;


--
-- TOC entry 271 (class 1259 OID 17277)
-- Name: permission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permission (
    id integer NOT NULL,
    block_1 boolean,
    block_2 boolean,
    block_3 boolean,
    block_4 boolean
);


ALTER TABLE public.permission OWNER TO postgres;

--
-- TOC entry 270 (class 1259 OID 17276)
-- Name: permission_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.permission_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.permission_id_seq OWNER TO postgres;

--
-- TOC entry 3888 (class 0 OID 0)
-- Dependencies: 270
-- Name: permission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.permission_id_seq OWNED BY public.permission.id;


--
-- TOC entry 269 (class 1259 OID 17270)
-- Name: role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role (
    id integer NOT NULL,
    description character varying(50)
);


ALTER TABLE public.role OWNER TO postgres;

--
-- TOC entry 268 (class 1259 OID 17269)
-- Name: role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.role_id_seq OWNER TO postgres;

--
-- TOC entry 3891 (class 0 OID 0)
-- Dependencies: 268
-- Name: role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.role_id_seq OWNED BY public.role.id;


--
-- TOC entry 305 (class 1259 OID 17494)
-- Name: sale; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sale (
    id integer NOT NULL,
    certificate_id integer,
    amount double precision,
    client_id integer,
    vehicle_id integer,
    start_date timestamp without time zone,
    end_date timestamp without time zone,
    photo character varying(100),
    created_by integer,
    updated_by integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.sale OWNER TO postgres;

--
-- TOC entry 304 (class 1259 OID 17493)
-- Name: sale_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sale_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sale_id_seq OWNER TO postgres;

--
-- TOC entry 3894 (class 0 OID 0)
-- Dependencies: 304
-- Name: sale_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sale_id_seq OWNED BY public.sale.id;


--
-- TOC entry 301 (class 1259 OID 17450)
-- Name: vehicle; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehicle (
    id integer NOT NULL,
    vehicle_data_id integer
);


ALTER TABLE public.vehicle OWNER TO postgres;

--
-- TOC entry 300 (class 1259 OID 17449)
-- Name: vehicle_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vehicle_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vehicle_id_seq OWNER TO postgres;

--
-- TOC entry 3897 (class 0 OID 0)
-- Dependencies: 300
-- Name: vehicle_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vehicle_id_seq OWNED BY public.vehicle.id;


--
-- TOC entry 281 (class 1259 OID 17318)
-- Name: visit_control_status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.visit_control_status (
    id integer NOT NULL,
    description text
);


ALTER TABLE public.visit_control_status OWNER TO postgres;

--
-- TOC entry 280 (class 1259 OID 17317)
-- Name: visit_control_status_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.visit_control_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.visit_control_status_id_seq OWNER TO postgres;

--
-- TOC entry 3900 (class 0 OID 0)
-- Dependencies: 280
-- Name: visit_control_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.visit_control_status_id_seq OWNED BY public.visit_control_status.id;


--
-- TOC entry 291 (class 1259 OID 17361)
-- Name: zone; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.zone (
    id integer NOT NULL,
    description text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    created_by integer,
    updated_by integer
);


ALTER TABLE public.zone OWNER TO postgres;

--
-- TOC entry 290 (class 1259 OID 17360)
-- Name: zone_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.zone_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.zone_id_seq OWNER TO postgres;

--
-- TOC entry 3903 (class 0 OID 0)
-- Dependencies: 290
-- Name: zone_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.zone_id_seq OWNED BY public.zone.id;


--
-- TOC entry 3562 (class 2604 OID 17294)
-- Name: access_status id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.access_status ALTER COLUMN id SET DEFAULT nextval('public.access_status_id_seq'::regclass);


--
-- TOC entry 3572 (class 2604 OID 17397)
-- Name: app_user id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.app_user ALTER COLUMN id SET DEFAULT nextval('public.app_user_id_seq'::regclass);


--
-- TOC entry 3576 (class 2604 OID 17460)
-- Name: certificate id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificate ALTER COLUMN id SET DEFAULT nextval('public.certificate_id_seq'::regclass);


--
-- TOC entry 3569 (class 2604 OID 17355)
-- Name: certificate_category id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificate_category ALTER COLUMN id SET DEFAULT nextval('public.certificate_category_id_seq'::regclass);


--
-- TOC entry 3564 (class 2604 OID 17312)
-- Name: certificate_status id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificate_status ALTER COLUMN id SET DEFAULT nextval('public.certificate_status_id_seq'::regclass);


--
-- TOC entry 3568 (class 2604 OID 17346)
-- Name: certificate_type id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificate_type ALTER COLUMN id SET DEFAULT nextval('public.certificate_type_id_seq'::regclass);


--
-- TOC entry 3574 (class 2604 OID 17441)
-- Name: client id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client ALTER COLUMN id SET DEFAULT nextval('public.client_id_seq'::regclass);


--
-- TOC entry 3566 (class 2604 OID 17330)
-- Name: client_type id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client_type ALTER COLUMN id SET DEFAULT nextval('public.client_type_id_seq'::regclass);


--
-- TOC entry 3563 (class 2604 OID 17303)
-- Name: finance_status id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.finance_status ALTER COLUMN id SET DEFAULT nextval('public.finance_status_id_seq'::regclass);


--
-- TOC entry 3573 (class 2604 OID 17419)
-- Name: hierarchy id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hierarchy ALTER COLUMN id SET DEFAULT nextval('public.hierarchy_id_seq'::regclass);


--
-- TOC entry 3578 (class 2604 OID 17519)
-- Name: income id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.income ALTER COLUMN id SET DEFAULT nextval('public.income_id_seq'::regclass);


--
-- TOC entry 3579 (class 2604 OID 17536)
-- Name: installment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.installment ALTER COLUMN id SET DEFAULT nextval('public.installment_id_seq'::regclass);


--
-- TOC entry 3571 (class 2604 OID 17373)
-- Name: organization id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organization ALTER COLUMN id SET DEFAULT nextval('public.organization_id_seq'::regclass);


--
-- TOC entry 3561 (class 2604 OID 17287)
-- Name: organization_type id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organization_type ALTER COLUMN id SET DEFAULT nextval('public.organization_type_id_seq'::regclass);


--
-- TOC entry 3567 (class 2604 OID 17337)
-- Name: payment_type id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_type ALTER COLUMN id SET DEFAULT nextval('public.payment_type_id_seq'::regclass);


--
-- TOC entry 3560 (class 2604 OID 17280)
-- Name: permission id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permission ALTER COLUMN id SET DEFAULT nextval('public.permission_id_seq'::regclass);


--
-- TOC entry 3559 (class 2604 OID 17273)
-- Name: role id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role ALTER COLUMN id SET DEFAULT nextval('public.role_id_seq'::regclass);


--
-- TOC entry 3577 (class 2604 OID 17497)
-- Name: sale id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sale ALTER COLUMN id SET DEFAULT nextval('public.sale_id_seq'::regclass);


--
-- TOC entry 3575 (class 2604 OID 17453)
-- Name: vehicle id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle ALTER COLUMN id SET DEFAULT nextval('public.vehicle_id_seq'::regclass);


--
-- TOC entry 3565 (class 2604 OID 17321)
-- Name: visit_control_status id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visit_control_status ALTER COLUMN id SET DEFAULT nextval('public.visit_control_status_id_seq'::regclass);


--
-- TOC entry 3570 (class 2604 OID 17364)
-- Name: zone id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zone ALTER COLUMN id SET DEFAULT nextval('public.zone_id_seq'::regclass);


--
-- TOC entry 3802 (class 0 OID 17291)
-- Dependencies: 275
-- Data for Name: access_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.access_status VALUES (4, 'Eliminado');
INSERT INTO public.access_status VALUES (3, 'Suspendido');
INSERT INTO public.access_status VALUES (2, 'Habilitado');
INSERT INTO public.access_status VALUES (1, 'Creado');


--
-- TOC entry 3822 (class 0 OID 17394)
-- Dependencies: 295
-- Data for Name: app_user; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3830 (class 0 OID 17457)
-- Dependencies: 303
-- Data for Name: certificate; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3816 (class 0 OID 17352)
-- Dependencies: 289
-- Data for Name: certificate_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.certificate_category VALUES (1, 'Público');
INSERT INTO public.certificate_category VALUES (2, 'Taxi');
INSERT INTO public.certificate_category VALUES (3, 'Urbano');
INSERT INTO public.certificate_category VALUES (4, 'Turismo');
INSERT INTO public.certificate_category VALUES (5, 'Escolar');


--
-- TOC entry 3806 (class 0 OID 17309)
-- Dependencies: 279
-- Data for Name: certificate_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.certificate_status VALUES (1, 'Creado');
INSERT INTO public.certificate_status VALUES (2, 'Asignado');
INSERT INTO public.certificate_status VALUES (3, 'Vendido');
INSERT INTO public.certificate_status VALUES (4, 'Suspendido');
INSERT INTO public.certificate_status VALUES (5, 'De baja');


--
-- TOC entry 3814 (class 0 OID 17343)
-- Dependencies: 287
-- Data for Name: certificate_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.certificate_type VALUES (1, 'Físico');
INSERT INTO public.certificate_type VALUES (2, 'Electrónico');


--
-- TOC entry 3826 (class 0 OID 17438)
-- Dependencies: 299
-- Data for Name: client; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3810 (class 0 OID 17327)
-- Dependencies: 283
-- Data for Name: client_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.client_type VALUES (1, 'Persona Natural');
INSERT INTO public.client_type VALUES (2, 'Persona Jurídica');


--
-- TOC entry 3804 (class 0 OID 17300)
-- Dependencies: 277
-- Data for Name: finance_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.finance_status VALUES (1, 'Pendiente');
INSERT INTO public.finance_status VALUES (2, 'Amortizando');
INSERT INTO public.finance_status VALUES (3, 'Pagado');
INSERT INTO public.finance_status VALUES (4, 'Vencido');


--
-- TOC entry 3824 (class 0 OID 17416)
-- Dependencies: 297
-- Data for Name: hierarchy; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3834 (class 0 OID 17516)
-- Dependencies: 307
-- Data for Name: income; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3836 (class 0 OID 17533)
-- Dependencies: 309
-- Data for Name: installment; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3820 (class 0 OID 17370)
-- Dependencies: 293
-- Data for Name: organization; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3800 (class 0 OID 17284)
-- Dependencies: 273
-- Data for Name: organization_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.organization_type VALUES (1, 'Empresa');
INSERT INTO public.organization_type VALUES (2, 'Distribuidor');
INSERT INTO public.organization_type VALUES (3, 'Punto de Venta');


--
-- TOC entry 3812 (class 0 OID 17334)
-- Dependencies: 285
-- Data for Name: payment_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.payment_type VALUES (1, 'Efectivo');
INSERT INTO public.payment_type VALUES (2, 'Transferencia bancaria');
INSERT INTO public.payment_type VALUES (3, 'Yape');
INSERT INTO public.payment_type VALUES (4, 'Plin');


--
-- TOC entry 3798 (class 0 OID 17277)
-- Dependencies: 271
-- Data for Name: permission; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3796 (class 0 OID 17270)
-- Dependencies: 269
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3832 (class 0 OID 17494)
-- Dependencies: 305
-- Data for Name: sale; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3828 (class 0 OID 17450)
-- Dependencies: 301
-- Data for Name: vehicle; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3808 (class 0 OID 17318)
-- Dependencies: 281
-- Data for Name: visit_control_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.visit_control_status VALUES (1, 'Programado');
INSERT INTO public.visit_control_status VALUES (2, 'Visitado');


--
-- TOC entry 3818 (class 0 OID 17361)
-- Dependencies: 291
-- Data for Name: zone; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3905 (class 0 OID 0)
-- Dependencies: 274
-- Name: access_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.access_status_id_seq', 4, true);


--
-- TOC entry 3906 (class 0 OID 0)
-- Dependencies: 294
-- Name: app_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.app_user_id_seq', 1, false);


--
-- TOC entry 3907 (class 0 OID 0)
-- Dependencies: 288
-- Name: certificate_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.certificate_category_id_seq', 5, true);


--
-- TOC entry 3908 (class 0 OID 0)
-- Dependencies: 302
-- Name: certificate_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.certificate_id_seq', 1, false);


--
-- TOC entry 3909 (class 0 OID 0)
-- Dependencies: 278
-- Name: certificate_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.certificate_status_id_seq', 5, true);


--
-- TOC entry 3910 (class 0 OID 0)
-- Dependencies: 286
-- Name: certificate_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.certificate_type_id_seq', 2, true);


--
-- TOC entry 3911 (class 0 OID 0)
-- Dependencies: 298
-- Name: client_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.client_id_seq', 1, false);


--
-- TOC entry 3912 (class 0 OID 0)
-- Dependencies: 282
-- Name: client_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.client_type_id_seq', 2, true);


--
-- TOC entry 3913 (class 0 OID 0)
-- Dependencies: 276
-- Name: finance_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.finance_status_id_seq', 4, true);


--
-- TOC entry 3914 (class 0 OID 0)
-- Dependencies: 296
-- Name: hierarchy_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hierarchy_id_seq', 1, false);


--
-- TOC entry 3915 (class 0 OID 0)
-- Dependencies: 306
-- Name: income_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.income_id_seq', 1, false);


--
-- TOC entry 3916 (class 0 OID 0)
-- Dependencies: 308
-- Name: installment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.installment_id_seq', 1, false);


--
-- TOC entry 3917 (class 0 OID 0)
-- Dependencies: 292
-- Name: organization_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.organization_id_seq', 1, false);


--
-- TOC entry 3918 (class 0 OID 0)
-- Dependencies: 272
-- Name: organization_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.organization_type_id_seq', 3, true);


--
-- TOC entry 3919 (class 0 OID 0)
-- Dependencies: 284
-- Name: payment_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payment_type_id_seq', 4, true);


--
-- TOC entry 3920 (class 0 OID 0)
-- Dependencies: 270
-- Name: permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.permission_id_seq', 1, false);


--
-- TOC entry 3921 (class 0 OID 0)
-- Dependencies: 268
-- Name: role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.role_id_seq', 1, false);


--
-- TOC entry 3922 (class 0 OID 0)
-- Dependencies: 304
-- Name: sale_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sale_id_seq', 1, false);


--
-- TOC entry 3923 (class 0 OID 0)
-- Dependencies: 300
-- Name: vehicle_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vehicle_id_seq', 1, false);


--
-- TOC entry 3924 (class 0 OID 0)
-- Dependencies: 280
-- Name: visit_control_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.visit_control_status_id_seq', 2, true);


--
-- TOC entry 3925 (class 0 OID 0)
-- Dependencies: 290
-- Name: zone_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.zone_id_seq', 1, false);


--
-- TOC entry 3587 (class 2606 OID 17298)
-- Name: access_status access_status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.access_status
    ADD CONSTRAINT access_status_pkey PRIMARY KEY (id);


--
-- TOC entry 3607 (class 2606 OID 17399)
-- Name: app_user app_user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.app_user
    ADD CONSTRAINT app_user_pkey PRIMARY KEY (id);


--
-- TOC entry 3601 (class 2606 OID 17359)
-- Name: certificate_category certificate_category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificate_category
    ADD CONSTRAINT certificate_category_pkey PRIMARY KEY (id);


--
-- TOC entry 3615 (class 2606 OID 17462)
-- Name: certificate certificate_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificate
    ADD CONSTRAINT certificate_pkey PRIMARY KEY (id);


--
-- TOC entry 3591 (class 2606 OID 17316)
-- Name: certificate_status certificate_status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificate_status
    ADD CONSTRAINT certificate_status_pkey PRIMARY KEY (id);


--
-- TOC entry 3599 (class 2606 OID 17350)
-- Name: certificate_type certificate_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificate_type
    ADD CONSTRAINT certificate_type_pkey PRIMARY KEY (id);


--
-- TOC entry 3611 (class 2606 OID 17443)
-- Name: client client_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT client_pkey PRIMARY KEY (id);


--
-- TOC entry 3595 (class 2606 OID 17332)
-- Name: client_type client_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client_type
    ADD CONSTRAINT client_type_pkey PRIMARY KEY (id);


--
-- TOC entry 3589 (class 2606 OID 17307)
-- Name: finance_status finance_status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.finance_status
    ADD CONSTRAINT finance_status_pkey PRIMARY KEY (id);


--
-- TOC entry 3609 (class 2606 OID 17421)
-- Name: hierarchy hierarchy_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hierarchy
    ADD CONSTRAINT hierarchy_pkey PRIMARY KEY (id);


--
-- TOC entry 3619 (class 2606 OID 17521)
-- Name: income income_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.income
    ADD CONSTRAINT income_pkey PRIMARY KEY (id);


--
-- TOC entry 3621 (class 2606 OID 17540)
-- Name: installment installment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.installment
    ADD CONSTRAINT installment_pkey PRIMARY KEY (id);


--
-- TOC entry 3605 (class 2606 OID 17377)
-- Name: organization organization_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organization
    ADD CONSTRAINT organization_pkey PRIMARY KEY (id);


--
-- TOC entry 3585 (class 2606 OID 17289)
-- Name: organization_type organization_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organization_type
    ADD CONSTRAINT organization_type_pkey PRIMARY KEY (id);


--
-- TOC entry 3597 (class 2606 OID 17341)
-- Name: payment_type payment_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_type
    ADD CONSTRAINT payment_type_pkey PRIMARY KEY (id);


--
-- TOC entry 3583 (class 2606 OID 17282)
-- Name: permission permission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permission
    ADD CONSTRAINT permission_pkey PRIMARY KEY (id);


--
-- TOC entry 3581 (class 2606 OID 17275)
-- Name: role role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_pkey PRIMARY KEY (id);


--
-- TOC entry 3617 (class 2606 OID 17499)
-- Name: sale sale_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sale
    ADD CONSTRAINT sale_pkey PRIMARY KEY (id);


--
-- TOC entry 3613 (class 2606 OID 17455)
-- Name: vehicle vehicle_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle
    ADD CONSTRAINT vehicle_pkey PRIMARY KEY (id);


--
-- TOC entry 3593 (class 2606 OID 17325)
-- Name: visit_control_status visit_control_status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visit_control_status
    ADD CONSTRAINT visit_control_status_pkey PRIMARY KEY (id);


--
-- TOC entry 3603 (class 2606 OID 17368)
-- Name: zone zone_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zone
    ADD CONSTRAINT zone_pkey PRIMARY KEY (id);


--
-- TOC entry 3625 (class 2606 OID 17410)
-- Name: app_user app_user_access_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.app_user
    ADD CONSTRAINT app_user_access_status_id_fkey FOREIGN KEY (access_status_id) REFERENCES public.access_status(id);


--
-- TOC entry 3626 (class 2606 OID 17405)
-- Name: app_user app_user_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.app_user
    ADD CONSTRAINT app_user_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organization(id);


--
-- TOC entry 3627 (class 2606 OID 17400)
-- Name: app_user app_user_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.app_user
    ADD CONSTRAINT app_user_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.role(id);


--
-- TOC entry 3632 (class 2606 OID 17483)
-- Name: certificate certificate_certificate_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificate
    ADD CONSTRAINT certificate_certificate_category_id_fkey FOREIGN KEY (certificate_category_id) REFERENCES public.certificate_category(id);


--
-- TOC entry 3633 (class 2606 OID 17478)
-- Name: certificate certificate_certificate_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificate
    ADD CONSTRAINT certificate_certificate_status_id_fkey FOREIGN KEY (certificate_status_id) REFERENCES public.certificate_status(id);


--
-- TOC entry 3634 (class 2606 OID 17468)
-- Name: certificate certificate_certificate_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificate
    ADD CONSTRAINT certificate_certificate_type_id_fkey FOREIGN KEY (certificate_type_id) REFERENCES public.certificate_type(id);


--
-- TOC entry 3635 (class 2606 OID 17463)
-- Name: certificate certificate_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificate
    ADD CONSTRAINT certificate_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.organization(id);


--
-- TOC entry 3636 (class 2606 OID 17488)
-- Name: certificate certificate_hierarchy_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificate
    ADD CONSTRAINT certificate_hierarchy_id_fkey FOREIGN KEY (hierarchy_id) REFERENCES public.hierarchy(id);


--
-- TOC entry 3637 (class 2606 OID 17473)
-- Name: certificate certificate_payment_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificate
    ADD CONSTRAINT certificate_payment_type_id_fkey FOREIGN KEY (payment_type_id) REFERENCES public.payment_type(id);


--
-- TOC entry 3631 (class 2606 OID 17444)
-- Name: client client_client_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT client_client_type_id_fkey FOREIGN KEY (client_type_id) REFERENCES public.client_type(id);


--
-- TOC entry 3628 (class 2606 OID 17422)
-- Name: hierarchy hierarchy_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hierarchy
    ADD CONSTRAINT hierarchy_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.organization(id);


--
-- TOC entry 3629 (class 2606 OID 17427)
-- Name: hierarchy hierarchy_distributor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hierarchy
    ADD CONSTRAINT hierarchy_distributor_id_fkey FOREIGN KEY (distributor_id) REFERENCES public.app_user(id);


--
-- TOC entry 3630 (class 2606 OID 17432)
-- Name: hierarchy hierarchy_point_of_sale_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hierarchy
    ADD CONSTRAINT hierarchy_point_of_sale_id_fkey FOREIGN KEY (point_of_sale_id) REFERENCES public.organization(id);


--
-- TOC entry 3641 (class 2606 OID 17527)
-- Name: income income_finance_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.income
    ADD CONSTRAINT income_finance_status_id_fkey FOREIGN KEY (finance_status_id) REFERENCES public.finance_status(id);


--
-- TOC entry 3642 (class 2606 OID 17522)
-- Name: income income_sale_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.income
    ADD CONSTRAINT income_sale_id_fkey FOREIGN KEY (sale_id) REFERENCES public.sale(id);


--
-- TOC entry 3643 (class 2606 OID 17546)
-- Name: installment installment_finance_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.installment
    ADD CONSTRAINT installment_finance_status_id_fkey FOREIGN KEY (finance_status_id) REFERENCES public.finance_status(id);


--
-- TOC entry 3644 (class 2606 OID 17541)
-- Name: installment installment_income_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.installment
    ADD CONSTRAINT installment_income_id_fkey FOREIGN KEY (income_id) REFERENCES public.income(id);


--
-- TOC entry 3622 (class 2606 OID 17388)
-- Name: organization organization_access_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organization
    ADD CONSTRAINT organization_access_status_id_fkey FOREIGN KEY (access_status_id) REFERENCES public.access_status(id);


--
-- TOC entry 3623 (class 2606 OID 17378)
-- Name: organization organization_organization_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organization
    ADD CONSTRAINT organization_organization_type_id_fkey FOREIGN KEY (organization_type_id) REFERENCES public.organization_type(id);


--
-- TOC entry 3624 (class 2606 OID 17383)
-- Name: organization organization_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organization
    ADD CONSTRAINT organization_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permission(id);


--
-- TOC entry 3638 (class 2606 OID 17500)
-- Name: sale sale_certificate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sale
    ADD CONSTRAINT sale_certificate_id_fkey FOREIGN KEY (certificate_id) REFERENCES public.certificate(id);


--
-- TOC entry 3639 (class 2606 OID 17505)
-- Name: sale sale_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sale
    ADD CONSTRAINT sale_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- TOC entry 3640 (class 2606 OID 17510)
-- Name: sale sale_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sale
    ADD CONSTRAINT sale_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicle(id);


--
-- TOC entry 3842 (class 0 OID 0)
-- Dependencies: 275
-- Name: TABLE access_status; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.access_status TO anon;
GRANT ALL ON TABLE public.access_status TO authenticated;
GRANT ALL ON TABLE public.access_status TO service_role;


--
-- TOC entry 3844 (class 0 OID 0)
-- Dependencies: 274
-- Name: SEQUENCE access_status_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.access_status_id_seq TO anon;
GRANT ALL ON SEQUENCE public.access_status_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.access_status_id_seq TO service_role;


--
-- TOC entry 3845 (class 0 OID 0)
-- Dependencies: 295
-- Name: TABLE app_user; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.app_user TO anon;
GRANT ALL ON TABLE public.app_user TO authenticated;
GRANT ALL ON TABLE public.app_user TO service_role;


--
-- TOC entry 3847 (class 0 OID 0)
-- Dependencies: 294
-- Name: SEQUENCE app_user_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.app_user_id_seq TO anon;
GRANT ALL ON SEQUENCE public.app_user_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.app_user_id_seq TO service_role;


--
-- TOC entry 3848 (class 0 OID 0)
-- Dependencies: 303
-- Name: TABLE certificate; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.certificate TO anon;
GRANT ALL ON TABLE public.certificate TO authenticated;
GRANT ALL ON TABLE public.certificate TO service_role;


--
-- TOC entry 3849 (class 0 OID 0)
-- Dependencies: 289
-- Name: TABLE certificate_category; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.certificate_category TO anon;
GRANT ALL ON TABLE public.certificate_category TO authenticated;
GRANT ALL ON TABLE public.certificate_category TO service_role;


--
-- TOC entry 3851 (class 0 OID 0)
-- Dependencies: 288
-- Name: SEQUENCE certificate_category_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.certificate_category_id_seq TO anon;
GRANT ALL ON SEQUENCE public.certificate_category_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.certificate_category_id_seq TO service_role;


--
-- TOC entry 3853 (class 0 OID 0)
-- Dependencies: 302
-- Name: SEQUENCE certificate_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.certificate_id_seq TO anon;
GRANT ALL ON SEQUENCE public.certificate_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.certificate_id_seq TO service_role;


--
-- TOC entry 3854 (class 0 OID 0)
-- Dependencies: 279
-- Name: TABLE certificate_status; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.certificate_status TO anon;
GRANT ALL ON TABLE public.certificate_status TO authenticated;
GRANT ALL ON TABLE public.certificate_status TO service_role;


--
-- TOC entry 3856 (class 0 OID 0)
-- Dependencies: 278
-- Name: SEQUENCE certificate_status_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.certificate_status_id_seq TO anon;
GRANT ALL ON SEQUENCE public.certificate_status_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.certificate_status_id_seq TO service_role;


--
-- TOC entry 3857 (class 0 OID 0)
-- Dependencies: 287
-- Name: TABLE certificate_type; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.certificate_type TO anon;
GRANT ALL ON TABLE public.certificate_type TO authenticated;
GRANT ALL ON TABLE public.certificate_type TO service_role;


--
-- TOC entry 3859 (class 0 OID 0)
-- Dependencies: 286
-- Name: SEQUENCE certificate_type_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.certificate_type_id_seq TO anon;
GRANT ALL ON SEQUENCE public.certificate_type_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.certificate_type_id_seq TO service_role;


--
-- TOC entry 3860 (class 0 OID 0)
-- Dependencies: 299
-- Name: TABLE client; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.client TO anon;
GRANT ALL ON TABLE public.client TO authenticated;
GRANT ALL ON TABLE public.client TO service_role;


--
-- TOC entry 3862 (class 0 OID 0)
-- Dependencies: 298
-- Name: SEQUENCE client_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.client_id_seq TO anon;
GRANT ALL ON SEQUENCE public.client_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.client_id_seq TO service_role;


--
-- TOC entry 3863 (class 0 OID 0)
-- Dependencies: 283
-- Name: TABLE client_type; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.client_type TO anon;
GRANT ALL ON TABLE public.client_type TO authenticated;
GRANT ALL ON TABLE public.client_type TO service_role;


--
-- TOC entry 3865 (class 0 OID 0)
-- Dependencies: 282
-- Name: SEQUENCE client_type_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.client_type_id_seq TO anon;
GRANT ALL ON SEQUENCE public.client_type_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.client_type_id_seq TO service_role;


--
-- TOC entry 3866 (class 0 OID 0)
-- Dependencies: 277
-- Name: TABLE finance_status; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.finance_status TO anon;
GRANT ALL ON TABLE public.finance_status TO authenticated;
GRANT ALL ON TABLE public.finance_status TO service_role;


--
-- TOC entry 3868 (class 0 OID 0)
-- Dependencies: 276
-- Name: SEQUENCE finance_status_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.finance_status_id_seq TO anon;
GRANT ALL ON SEQUENCE public.finance_status_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.finance_status_id_seq TO service_role;


--
-- TOC entry 3869 (class 0 OID 0)
-- Dependencies: 297
-- Name: TABLE hierarchy; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.hierarchy TO anon;
GRANT ALL ON TABLE public.hierarchy TO authenticated;
GRANT ALL ON TABLE public.hierarchy TO service_role;


--
-- TOC entry 3871 (class 0 OID 0)
-- Dependencies: 296
-- Name: SEQUENCE hierarchy_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.hierarchy_id_seq TO anon;
GRANT ALL ON SEQUENCE public.hierarchy_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.hierarchy_id_seq TO service_role;


--
-- TOC entry 3872 (class 0 OID 0)
-- Dependencies: 307
-- Name: TABLE income; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.income TO anon;
GRANT ALL ON TABLE public.income TO authenticated;
GRANT ALL ON TABLE public.income TO service_role;


--
-- TOC entry 3874 (class 0 OID 0)
-- Dependencies: 306
-- Name: SEQUENCE income_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.income_id_seq TO anon;
GRANT ALL ON SEQUENCE public.income_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.income_id_seq TO service_role;


--
-- TOC entry 3875 (class 0 OID 0)
-- Dependencies: 309
-- Name: TABLE installment; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.installment TO anon;
GRANT ALL ON TABLE public.installment TO authenticated;
GRANT ALL ON TABLE public.installment TO service_role;


--
-- TOC entry 3877 (class 0 OID 0)
-- Dependencies: 308
-- Name: SEQUENCE installment_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.installment_id_seq TO anon;
GRANT ALL ON SEQUENCE public.installment_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.installment_id_seq TO service_role;


--
-- TOC entry 3878 (class 0 OID 0)
-- Dependencies: 293
-- Name: TABLE organization; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.organization TO anon;
GRANT ALL ON TABLE public.organization TO authenticated;
GRANT ALL ON TABLE public.organization TO service_role;


--
-- TOC entry 3880 (class 0 OID 0)
-- Dependencies: 292
-- Name: SEQUENCE organization_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.organization_id_seq TO anon;
GRANT ALL ON SEQUENCE public.organization_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.organization_id_seq TO service_role;


--
-- TOC entry 3881 (class 0 OID 0)
-- Dependencies: 273
-- Name: TABLE organization_type; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.organization_type TO anon;
GRANT ALL ON TABLE public.organization_type TO authenticated;
GRANT ALL ON TABLE public.organization_type TO service_role;


--
-- TOC entry 3883 (class 0 OID 0)
-- Dependencies: 272
-- Name: SEQUENCE organization_type_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.organization_type_id_seq TO anon;
GRANT ALL ON SEQUENCE public.organization_type_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.organization_type_id_seq TO service_role;


--
-- TOC entry 3884 (class 0 OID 0)
-- Dependencies: 285
-- Name: TABLE payment_type; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.payment_type TO anon;
GRANT ALL ON TABLE public.payment_type TO authenticated;
GRANT ALL ON TABLE public.payment_type TO service_role;


--
-- TOC entry 3886 (class 0 OID 0)
-- Dependencies: 284
-- Name: SEQUENCE payment_type_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.payment_type_id_seq TO anon;
GRANT ALL ON SEQUENCE public.payment_type_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.payment_type_id_seq TO service_role;


--
-- TOC entry 3887 (class 0 OID 0)
-- Dependencies: 271
-- Name: TABLE permission; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.permission TO anon;
GRANT ALL ON TABLE public.permission TO authenticated;
GRANT ALL ON TABLE public.permission TO service_role;


--
-- TOC entry 3889 (class 0 OID 0)
-- Dependencies: 270
-- Name: SEQUENCE permission_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.permission_id_seq TO anon;
GRANT ALL ON SEQUENCE public.permission_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.permission_id_seq TO service_role;


--
-- TOC entry 3890 (class 0 OID 0)
-- Dependencies: 269
-- Name: TABLE role; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.role TO anon;
GRANT ALL ON TABLE public.role TO authenticated;
GRANT ALL ON TABLE public.role TO service_role;


--
-- TOC entry 3892 (class 0 OID 0)
-- Dependencies: 268
-- Name: SEQUENCE role_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.role_id_seq TO anon;
GRANT ALL ON SEQUENCE public.role_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.role_id_seq TO service_role;


--
-- TOC entry 3893 (class 0 OID 0)
-- Dependencies: 305
-- Name: TABLE sale; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.sale TO anon;
GRANT ALL ON TABLE public.sale TO authenticated;
GRANT ALL ON TABLE public.sale TO service_role;


--
-- TOC entry 3895 (class 0 OID 0)
-- Dependencies: 304
-- Name: SEQUENCE sale_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.sale_id_seq TO anon;
GRANT ALL ON SEQUENCE public.sale_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.sale_id_seq TO service_role;


--
-- TOC entry 3896 (class 0 OID 0)
-- Dependencies: 301
-- Name: TABLE vehicle; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.vehicle TO anon;
GRANT ALL ON TABLE public.vehicle TO authenticated;
GRANT ALL ON TABLE public.vehicle TO service_role;


--
-- TOC entry 3898 (class 0 OID 0)
-- Dependencies: 300
-- Name: SEQUENCE vehicle_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.vehicle_id_seq TO anon;
GRANT ALL ON SEQUENCE public.vehicle_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.vehicle_id_seq TO service_role;


--
-- TOC entry 3899 (class 0 OID 0)
-- Dependencies: 281
-- Name: TABLE visit_control_status; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.visit_control_status TO anon;
GRANT ALL ON TABLE public.visit_control_status TO authenticated;
GRANT ALL ON TABLE public.visit_control_status TO service_role;


--
-- TOC entry 3901 (class 0 OID 0)
-- Dependencies: 280
-- Name: SEQUENCE visit_control_status_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.visit_control_status_id_seq TO anon;
GRANT ALL ON SEQUENCE public.visit_control_status_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.visit_control_status_id_seq TO service_role;


--
-- TOC entry 3902 (class 0 OID 0)
-- Dependencies: 291
-- Name: TABLE zone; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.zone TO anon;
GRANT ALL ON TABLE public.zone TO authenticated;
GRANT ALL ON TABLE public.zone TO service_role;


--
-- TOC entry 3904 (class 0 OID 0)
-- Dependencies: 290
-- Name: SEQUENCE zone_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.zone_id_seq TO anon;
GRANT ALL ON SEQUENCE public.zone_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.zone_id_seq TO service_role;


-- Completed on 2025-07-12 17:38:58

--
-- PostgreSQL database dump complete
--

