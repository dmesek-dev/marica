# Marica slavi 360 mjeseci 🪩

Animirana rođendanska pozivnica + RSVP. Gosti otvore "kuvertu", jave dolaze li
i što bi pili; odgovori se spremaju u Supabase, a slavljenica ih vidi na `/admin`.

- **Stack:** Next.js (App Router) + React — spremno za Vercel.
- **Baza:** Supabase (Postgres).
- **Mobile-first:** dizajnirano za mobitel (svi dobivaju link na mobu).

## Rute
- `/` — pozivnica s animacijama (kuverta, konfeti, disko kugle, RSVP forma).
- `/admin` — zaštićen lozinkom, popis svih odgovora + statistika.
- `/api/rsvp` — POST endpoint koji sprema odgovor (dedup po imenu).

## Postavljanje (lokalno)

```bash
npm install
cp .env.example .env.local   # popuni vrijednosti
npm run dev                  # http://localhost:3000
```

### 1. Supabase
1. Napravi projekt na [supabase.com](https://supabase.com).
2. **SQL Editor → New query** → zalijepi `supabase/schema.sql` → **Run**.
3. **Project Settings → API** → prepiši:
   - `Project URL` → `SUPABASE_URL`
   - `service_role` ključ (secret) → `SUPABASE_SERVICE_ROLE_KEY`

> Service-role ključ se koristi **samo** na serveru (route handleri / server
> komponente) i nikad se ne šalje u browser. RLS je uključen bez javnih
> policy-a, pa anon pristup podacima nije moguć.

### 2. Env varijable
U `.env.local`:

```
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_PASSWORD=neka-tajna-lozinka
```

## Deploy na Vercel
1. Push repo na GitHub.
2. [vercel.com](https://vercel.com) → **New Project** → importaj repo (Next.js se
   detektira automatski).
3. **Settings → Environment Variables** → dodaj `SUPABASE_URL`,
   `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD` (za Production i Preview).
4. **Deploy.**

## Sadržaj pozivnice
- Datum: **29.8.2026. od 21h**
- Lokacija: **Downstairs, Krešićeva 32** (terminali Borongaj — niz stepenice kod Mlinara)

Tekst/datum se mijenjaju u `app/page.js`. Slika je `public/marica-cutout-v3.png`
(zamijeni je za drugu ako želiš — zadrži isto ime ili promijeni `src` u `app/page.js`).
