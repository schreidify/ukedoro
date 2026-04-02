--
-- PostgreSQL database import (cleaned from Replit export)
-- Run with: npm run db:import
--

-- Drop existing objects to allow re-import
DROP TABLE IF EXISTS public.pomodoro_sessions;
DROP TABLE IF EXISTS public.settings;
DROP SEQUENCE IF EXISTS public.pomodoro_sessions_id_seq;
DROP SEQUENCE IF EXISTS public.settings_id_seq;

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
-- Name: pomodoro_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pomodoro_sessions (
    id integer NOT NULL,
    session_key character varying(255) NOT NULL,
    mode text NOT NULL,
    duration integer NOT NULL,
    completed_at timestamp without time zone DEFAULT now() NOT NULL
);

CREATE SEQUENCE public.pomodoro_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.pomodoro_sessions_id_seq OWNED BY public.pomodoro_sessions.id;

--
-- Name: settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.settings (
    id integer NOT NULL,
    session_key character varying(255) NOT NULL,
    work_duration integer DEFAULT 1500 NOT NULL,
    break_duration integer DEFAULT 300 NOT NULL,
    resource text DEFAULT 'chords'::text NOT NULL,
    accent_color character varying(16) DEFAULT 'orange'::character varying NOT NULL
);

CREATE SEQUENCE public.settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.settings_id_seq OWNED BY public.settings.id;

ALTER TABLE ONLY public.pomodoro_sessions ALTER COLUMN id SET DEFAULT nextval('public.pomodoro_sessions_id_seq'::regclass);
ALTER TABLE ONLY public.settings ALTER COLUMN id SET DEFAULT nextval('public.settings_id_seq'::regclass);

--
-- Data for Name: pomodoro_sessions
--

COPY public.pomodoro_sessions (id, session_key, mode, duration, completed_at) FROM stdin;
1	d22dd896-dae4-4c34-8672-07d73935f689	work	300	2026-02-28 23:03:43.87608
2	d22dd896-dae4-4c34-8672-07d73935f689	break	60	2026-02-28 23:04:44.693377
\.

--
-- Data for Name: settings
--

COPY public.settings (id, session_key, work_duration, break_duration, resource, accent_color) FROM stdin;
1	d22dd896-dae4-4c34-8672-07d73935f689	300	60	chords	orange
\.

SELECT pg_catalog.setval('public.pomodoro_sessions_id_seq', 2, true);
SELECT pg_catalog.setval('public.settings_id_seq', 1, true);

ALTER TABLE ONLY public.pomodoro_sessions ADD CONSTRAINT pomodoro_sessions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.settings ADD CONSTRAINT settings_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.settings ADD CONSTRAINT settings_session_key_unique UNIQUE (session_key);
