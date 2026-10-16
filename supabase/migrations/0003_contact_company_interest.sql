-- The SvelteKit contact form asks for a company and an area of interest instead of a country.
-- Older leads keep their country; both new columns stay empty for them.
alter table mobilewallet.leads add column if not exists company  text;
alter table mobilewallet.leads add column if not exists interest text;  -- franchise | bring_atm | saas | partner | other
