-- MIGRATION DES ANCIENS LEADS (depuis l'ancienne base MySQL EasyWP).
--
-- Procédure :
-- 1. Pendant que l'ancien site EasyWP est ENCORE en ligne, ouvre la page admin
--    https://mobilewalletinc.com/api/leads.php et clique "Export CSV" (tous les types).
-- 2. Dans Supabase → Table Editor → crée la table de staging avec le bloc ci-dessous
--    (ou colle-le dans le SQL Editor), puis importe le CSV dedans
--    (Table Editor → table `_import_legacy` → Insert → Import data from CSV).
-- 3. Exécute l'INSERT ... SELECT pour transférer dans mobilewallet.leads.
-- 4. Supprime la table de staging.

-- Étape 2 : table de staging (colonnes = en-têtes du CSV de leads.php)
create table if not exists mobilewallet._import_legacy (
    id                    text,
    type                  text,
    nom                   text,
    email                 text,
    pays                  text,
    telephone             text,
    message               text,
    langue                text,
    ip                    text,
    date                  text,
    telechargements       text,
    dernier_telechargement text
);

-- Étape 3 : transfert vers la vraie table (à lancer APRÈS l'import du CSV)
insert into mobilewallet.leads
    (type, name, email, country, phone, message, lang, ip, download_count, downloaded_at, created_at)
select
    type,
    nom,
    email,
    nullif(pays, ''),
    nullif(telephone, ''),
    nullif(message, ''),
    coalesce(nullif(langue, ''), 'fr'),
    nullif(ip, ''),
    coalesce(nullif(telechargements, '')::int, 0),
    nullif(dernier_telechargement, '')::timestamptz,
    coalesce(nullif(date, '')::timestamptz, now())
from mobilewallet._import_legacy;

-- Étape 4 : nettoyage
drop table mobilewallet._import_legacy;
