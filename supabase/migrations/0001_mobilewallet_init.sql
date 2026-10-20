-- Schéma dédié au projet MobileWallet.
-- PRIVÉ : ne PAS l'ajouter aux "Exposed schemas" de la Data API.
-- Accès uniquement en connexion Postgres directe (serveur), via le pooler.
-- Consultable dans le Table Editor du dashboard Supabase.

create schema if not exists mobilewallet;

-- Table des leads (soumissions des 3 formulaires)
create table if not exists mobilewallet.leads (
    id             bigint generated always as identity primary key,
    type           text not null check (type in ('contact', 'presentation', 'documentation')),
    name           text not null,
    email          text not null,
    country        text,
    phone          text,
    message        text,
    lang           text not null default 'fr',   -- langue du site au moment de la demande
    doc_lang       text,                          -- langue du PDF choisie (presentation/documentation)
    ip             text,
    user_agent     text,
    download_token text unique,                   -- jeton du lien de téléchargement tracé
    download_count integer not null default 0,
    downloaded_at  timestamptz,
    created_at     timestamptz not null default now()
);
create index if not exists leads_type_idx    on mobilewallet.leads (type);
create index if not exists leads_created_idx on mobilewallet.leads (created_at desc);

-- Un enregistrement par clic de téléchargement (détail : qui, quand, IP)
create table if not exists mobilewallet.downloads (
    id         bigint generated always as identity primary key,
    lead_id    bigint not null references mobilewallet.leads(id) on delete cascade,
    ip         text,
    user_agent text,
    created_at timestamptz not null default now()
);
create index if not exists downloads_lead_idx on mobilewallet.downloads (lead_id);
