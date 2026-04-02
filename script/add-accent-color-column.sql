-- One-off migration: add focus accent column (run against existing DBs)
ALTER TABLE public.settings
  ADD COLUMN IF NOT EXISTS accent_color character varying(16) DEFAULT 'orange'::character varying NOT NULL;
