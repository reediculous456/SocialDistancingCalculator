--
-- PostgreSQL database dump
--

-- Dumped from database version 12.2 (Debian 12.2-2.pgdg100+1)
-- Dumped by pg_dump version 12.2 (Debian 12.2-2.pgdg100+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
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
-- Name: addresses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.addresses (
    id integer NOT NULL,
    street1 text NOT NULL,
    street2 text,
    city text NOT NULL,
    state_id integer NOT NULL,
    zip_code text NOT NULL,
    latitude text NOT NULL,
    longitude text NOT NULL
);


--
-- Name: addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.addresses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: addresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.addresses_id_seq OWNED BY public.addresses.id;


--
-- Name: buildings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.buildings (
    id integer NOT NULL,
    name text NOT NULL,
    campus_id integer NOT NULL,
    address_id integer NOT NULL,
    code text NOT NULL,
    number integer NOT NULL,
    active boolean NOT NULL
);


--
-- Name: buildings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.buildings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: buildings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.buildings_id_seq OWNED BY public.buildings.id;


--
-- Name: campuses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.campuses (
    id integer NOT NULL,
    name text NOT NULL,
    code text NOT NULL,
    active boolean NOT NULL
);


--
-- Name: campuses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.campuses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: campuses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.campuses_id_seq OWNED BY public.campuses.id;


--
-- Name: change_request_status_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.change_request_status_types (
    id integer NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL
);


--
-- Name: change_request_status_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.change_request_status_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: change_request_status_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.change_request_status_types_id_seq OWNED BY public.change_request_status_types.id;


--
-- Name: change_request_statuses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.change_request_statuses (
    id integer NOT NULL,
    change_request_id integer NOT NULL,
    status_id integer NOT NULL,
    comment text NOT NULL,
    created_by integer NOT NULL,
    created_on timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: change_request_statuses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.change_request_statuses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: change_request_statuses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.change_request_statuses_id_seq OWNED BY public.change_request_statuses.id;


--
-- Name: change_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.change_requests (
    id integer NOT NULL,
    attributes json NOT NULL,
    created_by integer NOT NULL,
    created_on timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    floor_id integer NOT NULL,
    deleted_on timestamp with time zone,
    deleted_by integer
);


--
-- Name: change_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.change_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: change_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.change_requests_id_seq OWNED BY public.change_requests.id;


--
-- Name: current_change_request_statuses; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.current_change_request_statuses AS
 SELECT max(change_request_statuses.id) AS change_request_status_id,
    change_request_statuses.change_request_id
   FROM public.change_request_statuses
  GROUP BY change_request_statuses.change_request_id;


--
-- Name: urns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.urns (
    id integer NOT NULL,
    urn_string text NOT NULL,
    file_name text NOT NULL,
    uploaded_on timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    uploaded_by integer NOT NULL,
    floor_id integer NOT NULL
);


--
-- Name: current_urns; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.current_urns AS
 SELECT urns.floor_id,
    max(urns.id) AS urn_id
   FROM public.urns
  GROUP BY urns.floor_id;


--
-- Name: floor_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.floor_types (
    id integer NOT NULL,
    code text NOT NULL,
    name text NOT NULL
);


--
-- Name: floor_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.floor_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: floor_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.floor_types_id_seq OWNED BY public.floor_types.id;


--
-- Name: floors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.floors (
    id integer NOT NULL,
    fname text NOT NULL,
    building_id integer NOT NULL,
    floor_type_id integer NOT NULL,
    active boolean NOT NULL
);


--
-- Name: floors_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.floors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: floors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.floors_id_seq OWNED BY public.floors.id;


--
-- Name: freeform_markups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.freeform_markups (
    id integer NOT NULL,
    urn_id integer,
    type_id integer NOT NULL,
    attributes json NOT NULL,
    x double precision,
    y double precision,
    width double precision,
    height double precision,
    size double precision,
    created_by integer NOT NULL,
    created_on timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_by integer,
    deleted_on timestamp with time zone
);


--
-- Name: freeform_markups_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.freeform_markups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: freeform_markups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.freeform_markups_id_seq OWNED BY public.freeform_markups.id;


--
-- Name: markup_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.markup_types (
    id integer NOT NULL,
    name text NOT NULL
);


--
-- Name: markup_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.markup_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: markup_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.markup_types_id_seq OWNED BY public.markup_types.id;


--
-- Name: polylines; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.polylines (
    id integer NOT NULL,
    urn_id integer NOT NULL,
    object_id integer NOT NULL,
    handle text NOT NULL,
    area numeric NOT NULL
);


--
-- Name: polylines_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.polylines_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: polylines_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.polylines_id_seq OWNED BY public.polylines.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    code text NOT NULL,
    name text NOT NULL
);


--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: states; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.states (
    id integer NOT NULL,
    name text NOT NULL,
    abbreviation text NOT NULL
);


--
-- Name: states_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.states_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: states_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.states_id_seq OWNED BY public.states.id;


--
-- Name: urns_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.urns_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: urns_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.urns_id_seq OWNED BY public.urns.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    username text NOT NULL,
    role_id integer DEFAULT 2 NOT NULL,
    active boolean DEFAULT true NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: addresses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addresses ALTER COLUMN id SET DEFAULT nextval('public.addresses_id_seq'::regclass);


--
-- Name: buildings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.buildings ALTER COLUMN id SET DEFAULT nextval('public.buildings_id_seq'::regclass);


--
-- Name: campuses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campuses ALTER COLUMN id SET DEFAULT nextval('public.campuses_id_seq'::regclass);


--
-- Name: change_request_status_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.change_request_status_types ALTER COLUMN id SET DEFAULT nextval('public.change_request_status_types_id_seq'::regclass);


--
-- Name: change_request_statuses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.change_request_statuses ALTER COLUMN id SET DEFAULT nextval('public.change_request_statuses_id_seq'::regclass);


--
-- Name: change_requests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.change_requests ALTER COLUMN id SET DEFAULT nextval('public.change_requests_id_seq'::regclass);


--
-- Name: floor_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.floor_types ALTER COLUMN id SET DEFAULT nextval('public.floor_types_id_seq'::regclass);


--
-- Name: floors id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.floors ALTER COLUMN id SET DEFAULT nextval('public.floors_id_seq'::regclass);


--
-- Name: freeform_markups id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.freeform_markups ALTER COLUMN id SET DEFAULT nextval('public.freeform_markups_id_seq'::regclass);


--
-- Name: markup_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.markup_types ALTER COLUMN id SET DEFAULT nextval('public.markup_types_id_seq'::regclass);


--
-- Name: polylines id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.polylines ALTER COLUMN id SET DEFAULT nextval('public.polylines_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: states id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.states ALTER COLUMN id SET DEFAULT nextval('public.states_id_seq'::regclass);


--
-- Name: urns id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.urns ALTER COLUMN id SET DEFAULT nextval('public.urns_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: addresses addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (id);


--
-- Name: buildings buildings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.buildings
    ADD CONSTRAINT buildings_pkey PRIMARY KEY (id);


--
-- Name: campuses campuses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campuses
    ADD CONSTRAINT campuses_pkey PRIMARY KEY (id);


--
-- Name: change_request_status_types change_request_status_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.change_request_status_types
    ADD CONSTRAINT change_request_status_types_pkey PRIMARY KEY (id);


--
-- Name: change_request_statuses change_request_statuses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.change_request_statuses
    ADD CONSTRAINT change_request_statuses_pkey PRIMARY KEY (id);


--
-- Name: change_requests change_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.change_requests
    ADD CONSTRAINT change_requests_pkey PRIMARY KEY (id);


--
-- Name: floor_types floor_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.floor_types
    ADD CONSTRAINT floor_types_pkey PRIMARY KEY (id);


--
-- Name: floors floors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.floors
    ADD CONSTRAINT floors_pkey PRIMARY KEY (id);


--
-- Name: freeform_markups freeform_markups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.freeform_markups
    ADD CONSTRAINT freeform_markups_pkey PRIMARY KEY (id);


--
-- Name: markup_types markup_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.markup_types
    ADD CONSTRAINT markup_types_pkey PRIMARY KEY (id);


--
-- Name: polylines polylines_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.polylines
    ADD CONSTRAINT polylines_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: states states_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.states
    ADD CONSTRAINT states_pkey PRIMARY KEY (id);


--
-- Name: urns urns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.urns
    ADD CONSTRAINT urns_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: addresses addresses_state_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_state_id_fkey FOREIGN KEY (state_id) REFERENCES public.states(id);


--
-- Name: buildings buildings_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.buildings
    ADD CONSTRAINT buildings_address_id_fkey FOREIGN KEY (address_id) REFERENCES public.addresses(id);


--
-- Name: buildings buildings_campus_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.buildings
    ADD CONSTRAINT buildings_campus_id_fkey FOREIGN KEY (campus_id) REFERENCES public.campuses(id);


--
-- Name: change_request_statuses change_request_statuses_change_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.change_request_statuses
    ADD CONSTRAINT change_request_statuses_change_request_id_fkey FOREIGN KEY (change_request_id) REFERENCES public.change_requests(id);


--
-- Name: change_request_statuses change_request_statuses_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.change_request_statuses
    ADD CONSTRAINT change_request_statuses_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: change_request_statuses change_request_statuses_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.change_request_statuses
    ADD CONSTRAINT change_request_statuses_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.change_request_status_types(id);


--
-- Name: change_requests change_requests_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.change_requests
    ADD CONSTRAINT change_requests_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: change_requests change_requests_deleted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.change_requests
    ADD CONSTRAINT change_requests_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES public.users(id);


--
-- Name: change_requests change_requests_floor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.change_requests
    ADD CONSTRAINT change_requests_floor_id_fkey FOREIGN KEY (floor_id) REFERENCES public.floors(id);


--
-- Name: floors floors_building_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.floors
    ADD CONSTRAINT floors_building_id_fkey FOREIGN KEY (building_id) REFERENCES public.buildings(id);


--
-- Name: floors floors_floor_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.floors
    ADD CONSTRAINT floors_floor_type_id_fkey FOREIGN KEY (floor_type_id) REFERENCES public.floor_types(id);


--
-- Name: freeform_markups freeform_markups_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.freeform_markups
    ADD CONSTRAINT freeform_markups_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: freeform_markups freeform_markups_deleted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.freeform_markups
    ADD CONSTRAINT freeform_markups_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES public.users(id);


--
-- Name: freeform_markups freeform_markups_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.freeform_markups
    ADD CONSTRAINT freeform_markups_type_id_fkey FOREIGN KEY (type_id) REFERENCES public.markup_types(id);


--
-- Name: freeform_markups freeform_markups_urn_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.freeform_markups
    ADD CONSTRAINT freeform_markups_urn_id_fkey FOREIGN KEY (urn_id) REFERENCES public.urns(id);


--
-- Name: polylines polylines_urn_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.polylines
    ADD CONSTRAINT polylines_urn_id_fkey FOREIGN KEY (urn_id) REFERENCES public.urns(id);


--
-- Name: urns urns_floor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.urns
    ADD CONSTRAINT urns_floor_id_fkey FOREIGN KEY (floor_id) REFERENCES public.floors(id);


--
-- Name: urns urns_uploaded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.urns
    ADD CONSTRAINT urns_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.users(id);


--
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- PostgreSQL database dump complete
--

