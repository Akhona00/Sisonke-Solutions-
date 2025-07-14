CREATE TABLE IF NOT EXISTS public.contacts
(
    id integer NOT NULL DEFAULT nextval('contacts_id_seq'::regclass),
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    service character varying(100) COLLATE pg_catalog."default" NOT NULL,
    message text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(50) COLLATE pg_catalog."default" DEFAULT 'pending'::character varying,
    CONSTRAINT contacts_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.contacts
    OWNER to postgres;

-- Index: public.idx_contacts_created_at
CREATE INDEX IF NOT EXISTS idx_contacts_created_at
    ON public.contacts USING btree
    (created_at ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: public.idx_contacts_email
CREATE INDEX IF NOT EXISTS idx_contacts_email
    ON public.contacts USING btree
    (email COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: public.idx_contacts_service
CREATE INDEX IF NOT EXISTS idx_contacts_service
    ON public.contacts USING btree
    (service COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: public.idx_contacts_status
CREATE INDEX IF NOT EXISTS idx_contacts_status
    ON public.contacts USING btree
    (status COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

    SELECT * FROM public.contacts;