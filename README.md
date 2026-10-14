# MobileWallet — website

Marketing site for MobileWallet Incorporated, the cashin and cashout infrastructure
for Mobile Money in Africa. English at `/`, French at `/fr`.

Built with [SvelteKit](https://svelte.dev/docs/kit), Bootstrap/SCSS and
[Paraglide JS](https://paraglidejs.com) for translations. Deployed on Vercel.

```sh
npm install
npm run dev       # http://localhost:5173
npm run build     # production build
npm run check     # svelte-check / TypeScript
```

## Environment variables

Copy `.env.example` to `.env` for local development, and set the same variables in
Vercel (Project → Settings → Environment Variables).

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `RESEND_API_KEY` | yes | — | Sends the contact and presentation emails ([Resend](https://resend.com)) |
| `RESEND_FROM` | no | `MobileWallet <support@mobilewalletinc.com>` | Sender — its domain must be verified in Resend |
| `CONTACT_TO` | no | `support@mobilewalletinc.com` | Inbox for enquiries and presentation leads |
| `SITE_URL` | no | `https://mobilewalletinc.com` | Used for links and the logo inside emails |

They're declared (and validated) in `src/env.ts` and read from `$app/env/private`.

## Forms & emails

- **Contact form** (sidebar) → `POST /api/contact` → email to `CONTACT_TO`, with Reply-To set to the visitor.
- **Presentation request** (modal) → `POST /api/presentation` → the PDF is emailed to the visitor in the language they picked, and a lead notification goes to `CONTACT_TO`.
- `GET /api/download?l=fr|en` serves the PDF directly — it keeps the download links sent by the previous website working.

Both forms are validated in the browser and again on the server with the same
[Valibot](https://valibot.dev) schemas (`src/lib/forms.ts`), and are protected by a
honeypot field and a per-visitor rate limit.

Email templates live in `src/lib/server/email-templates.ts` (no dependencies, so they
can be rendered on their own). The presentation PDFs are in `src/lib/server/documents/`
and are bundled into the server code, not published as public files — replace
`presentation-en.pdf` / `presentation-fr.pdf` (and update `pages` in
`src/lib/server/documents.ts`) to change them.

## Project layout

| Path | What lives there |
| --- | --- |
| `src/routes/+page.svelte` | Home page, composed from `src/lib/components/home/*` |
| `src/routes/+layout.svelte` | Global styles, header/footer, sidebar & modal, scroll animations |
| `src/routes/api/` | Server endpoints for the forms |
| `src/lib/data/` | Page content: navigation, team, partners, operators, plans… |
| `src/lib/scss/` | Theme styles (Bootstrap based); responsive fixes in `components/_responsive.scss` |
| `static/` | Images (served as `/assets/images/...`), favicons, manifest, robots.txt |

## Translations

- Texts live in `messages/en.json` and `messages/fr.json` — add a key to both, then use it as `m.my_key()` (`import { m } from '#lib/paraglide/messages.js'`).
- The language switcher calls `setLocale()`; the choice is remembered in a cookie. Internal links go through `link()` from `src/lib/data/site.ts` so they stay in the current language.
- `src/lib/paraglide/` is generated (by the Vite plugin, or `npm run i18n`) — don't edit it.

Imports use the `#lib/*` subpath alias (see `imports` in `package.json`).
