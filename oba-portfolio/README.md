# Oba Jafojo — Actor Portfolio

A clean, minimal, media-first portfolio site for actor **Oba Jafojo**, with a
password-protected admin panel so he can swap photos, reel, bio, and credits
himself — no code required.

- **Framework:** Next.js 15 (App Router) + React
- **Styling:** Tailwind CSS (no other UI libraries)
- **Media hosting:** Cloudinary (free tier)
- **Admin login + saved content:** Supabase (free tier)
- **Hosting:** Vercel (free tier)

> **It runs with zero configuration.** With no accounts and no environment
> variables, the site is fully live on built-in placeholder headshots, a sample
> reel, and sample credits. That means you can **deploy first and get a live
> link today**, then connect Cloudinary + Supabase whenever you're ready and
> replace everything through the admin panel.

---

## Quick start (local)

```bash
# 1. Install dependencies
npm install

# 2. Run it
npm run dev
```

Open <http://localhost:3000> — the portfolio is live on placeholder content.
The admin panel lives at <http://localhost:3000/admin> (it will say "not
connected" until you add Supabase below).

---

## One-click deploy to Vercel

Push this folder to a GitHub repo, then either import it at
[vercel.com/new](https://vercel.com/new), or use this button after replacing
`YOUR_GITHUB_USERNAME/YOUR_REPO` with your repo:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO)

Vercel auto-detects Next.js. No environment variables are required for the first
deploy — you'll get a live URL immediately on placeholder content. Add the env
vars later (Vercel → Project → Settings → Environment Variables) to turn on the
admin panel and real uploads, then redeploy.

**This is the link to submit for the Gray Media internship by Aug 16.**

---

## Full setup — turn on the admin panel and real uploads

Do this once to let Oba log in and manage the site. About 15 minutes.

### 1. Create a Cloudinary account (free) — for photos & video

1. Sign up at [cloudinary.com](https://cloudinary.com/users/register_free).
2. On the dashboard, copy your **Cloud name**.
3. Create an **unsigned upload preset** so the admin panel can upload directly
   from the browser:
   - Settings (gear icon) → **Upload** → scroll to **Upload presets** →
     **Add upload preset**.
   - Set **Signing Mode** to **Unsigned**.
   - Save, and copy the **preset name**.

You now have `NEXT_PUBLIC_CLOUDINARY_NAME` and
`NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`.

### 2. Create a Supabase project (free) — for login & saved content

1. Sign up at [supabase.com](https://supabase.com) and create a new project
   (pick any database password; you won't need it here).
2. When it's ready, go to **Project Settings → API** and copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret)
3. Go to **SQL Editor → New query**, paste the contents of
   [`scripts/supabase-schema.sql`](scripts/supabase-schema.sql), and click
   **Run**. This creates the `site_content` table with the right security rules.

### 3. Add your environment variables

Copy the example file and fill it in:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_CLOUDINARY_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-unsigned-preset

SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

SUPABASE_SERVICE_ROLE_KEY=eyJ...     # secret — used only by the setup script

ADMIN_EMAIL=oba@example.com
ADMIN_PASSWORD=choose-a-strong-password
```

> The `SUPABASE_URL`/`SUPABASE_ANON_KEY` values are duplicated with a
> `NEXT_PUBLIC_` prefix on purpose: the server reads the plain names, the browser
> admin panel reads the `NEXT_PUBLIC_` ones.

### 4. Create the admin login and seed content

```bash
npm run setup-admin
```

This creates the admin user from `ADMIN_EMAIL` / `ADMIN_PASSWORD` and fills the
database with the placeholder content so the admin panel opens ready to edit.
(Re-running it just resets the password; it won't overwrite real edits.)

### 5. Run and log in

```bash
npm run dev
```

Visit <http://localhost:3000/admin>, sign in, and start replacing content.

### 6. Put the same env vars on Vercel

In Vercel → your project → **Settings → Environment Variables**, add every
variable from `.env.local` **except** you can skip `ADMIN_EMAIL`/
`ADMIN_PASSWORD` (those are only for the local setup script). Redeploy. The live
site now has a working admin panel.

---

## Using the admin panel

Go to `/admin` and sign in. Tabs across the top:

- **General** — name, tagline, location, hero background image.
- **About** — bio, headshot, and the stats grid (height, voice type, etc.).
- **Photos** — drag & drop headshots (uploads to Cloudinary), reorder with the
  arrows, delete, and edit captions.
- **Reel** — paste a YouTube/Vimeo link or a Cloudinary video URL, or upload an
  `.mp4` directly. Set a poster image and caption.
- **Resume** — add/reorder/delete acting credits (grouped by category),
  training, and special skills. Optionally link a downloadable PDF.
- **Contact** — email, phone, Actors Access link, social links, footer text.

Click **Save changes**. The public site refreshes within about 30 seconds.

> **Tip for photos & hero image:** upload a photo in the **Photos** tab first,
> then copy its URL into the **hero background** or **headshot** field.

---

## Project structure

```
app/
  layout.js          Fonts (Playfair + Inter), metadata
  page.js            Public portfolio (server component, fetches content)
  admin/page.js      Admin route (client)
  globals.css        Tailwind + small animations
components/
  Nav, Hero, About, Gallery, Reel, Resume, Contact, Footer, Reveal, SectionHeading
  admin/             AdminApp, LoginForm, Dashboard, PhotoManager, fields
lib/
  defaultContent.js  Placeholder content + merge helper (the data shape)
  getContent.js      Server fetch with graceful fallback
  supabaseClient.js  Browser Supabase client
  cloudinary.js      Unsigned browser uploads
  video.js           YouTube/Vimeo/file URL parsing
scripts/
  supabase-schema.sql  Table + row-level security
  setup-admin.mjs      Create admin user + seed content
```

---

## Notes

- No `localStorage`/`sessionStorage` — auth session is handled by Supabase.
- Images lazy-load; the hero image is prioritized for a fast first paint.
- Mobile-first and responsive from phone to desktop.
- The admin route is set to `noindex`; only the public site is indexed.
