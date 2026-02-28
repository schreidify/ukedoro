import "dotenv/config";
import pg from "pg";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL is not set. Add it to your .env file or environment.");
  process.exit(1);
}

async function run() {
  const client = new pg.Client({ connectionString: DATABASE_URL });

  try {
    await client.connect();

    await client.query("DROP TABLE IF EXISTS public.pomodoro_sessions");
    await client.query("DROP TABLE IF EXISTS public.settings");
    await client.query("DROP SEQUENCE IF EXISTS public.pomodoro_sessions_id_seq");
    await client.query("DROP SEQUENCE IF EXISTS public.settings_id_seq");

    await client.query(`
      CREATE TABLE public.pomodoro_sessions (
        id integer NOT NULL,
        session_key character varying(255) NOT NULL,
        mode text NOT NULL,
        duration integer NOT NULL,
        completed_at timestamp without time zone DEFAULT now() NOT NULL
      )
    `);

    await client.query(`
      CREATE SEQUENCE public.pomodoro_sessions_id_seq
        AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1
    `);

    await client.query(`
      ALTER SEQUENCE public.pomodoro_sessions_id_seq OWNED BY public.pomodoro_sessions.id
    `);

    await client.query(`
      CREATE TABLE public.settings (
        id integer NOT NULL,
        session_key character varying(255) NOT NULL,
        work_duration integer DEFAULT 1500 NOT NULL,
        break_duration integer DEFAULT 300 NOT NULL,
        resource text DEFAULT 'chords'::text NOT NULL
      )
    `);

    await client.query(`
      CREATE SEQUENCE public.settings_id_seq
        AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1
    `);

    await client.query(`
      ALTER SEQUENCE public.settings_id_seq OWNED BY public.settings.id
    `);

    await client.query(`
      ALTER TABLE ONLY public.pomodoro_sessions
      ALTER COLUMN id SET DEFAULT nextval('public.pomodoro_sessions_id_seq'::regclass)
    `);

    await client.query(`
      ALTER TABLE ONLY public.settings
      ALTER COLUMN id SET DEFAULT nextval('public.settings_id_seq'::regclass)
    `);

    await client.query(`
      INSERT INTO public.pomodoro_sessions (id, session_key, mode, duration, completed_at) VALUES
      (1, 'd22dd896-dae4-4c34-8672-07d73935f689', 'work', 300, '2026-02-28 23:03:43.87608'),
      (2, 'd22dd896-dae4-4c34-8672-07d73935f689', 'break', 60, '2026-02-28 23:04:44.693377')
    `);

    await client.query(`
      INSERT INTO public.settings (id, session_key, work_duration, break_duration, resource) VALUES
      (1, 'd22dd896-dae4-4c34-8672-07d73935f689', 300, 60, 'chords')
    `);

    await client.query("SELECT pg_catalog.setval('public.pomodoro_sessions_id_seq', 2, true)");
    await client.query("SELECT pg_catalog.setval('public.settings_id_seq', 1, true)");

    await client.query(`
      ALTER TABLE ONLY public.pomodoro_sessions ADD CONSTRAINT pomodoro_sessions_pkey PRIMARY KEY (id)
    `);

    await client.query(`
      ALTER TABLE ONLY public.settings ADD CONSTRAINT settings_pkey PRIMARY KEY (id)
    `);

    await client.query(`
      ALTER TABLE ONLY public.settings ADD CONSTRAINT settings_session_key_unique UNIQUE (session_key)
    `);

    console.log("Database import complete.");
  } catch (err) {
    console.error("Import failed:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
