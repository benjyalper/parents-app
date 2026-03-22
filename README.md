# הורים כשותפים — Parents as Partners

A calm, warm co-parenting communication app built with Next.js, TypeScript, Tailwind CSS, Prisma, and PostgreSQL.

---

## Quick start — local development

### 1. Install dependencies
```bash
cd parents-app
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
# Edit .env.local and fill in DATABASE_URL (see below)
```

Local PostgreSQL example:
```
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/parents_app"
```

### 3. Create the database (first time)
```bash
# Apply migrations and create the schema
npm run db:deploy      # or: npx prisma migrate dev --name init

# Seed demo data
npm run db:seed
```

### 4. Start the dev server
```bash
npm run dev
# → http://localhost:3000
```

---

## Pushing to GitHub

```bash
# From the parents-app directory
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

> ⚠️ Never commit `.env.local`. It is in `.gitignore`.

---

## Deploying on Railway

### Step 1 — Create a Railway project

1. Go to [railway.app](https://railway.app) and sign in.
2. Click **New Project → Deploy from GitHub repo**.
3. Connect your GitHub account and select the repository.

### Step 2 — Add a PostgreSQL database

1. In your Railway project, click **+ New → Database → Add PostgreSQL**.
2. Once created, click the Postgres service → **Variables** tab.
3. Copy the `DATABASE_URL` value.

### Step 3 — Set environment variables

In your Railway web service (the Next.js app):
1. Go to **Variables** tab.
2. Add: `DATABASE_URL` = the value from step 2.

Railway automatically sets `PORT`. You do **not** need to set it.

### Step 4 — Set the build/start commands

Railway auto-detects Next.js. If you need to override:

| Setting       | Value                             |
|---------------|-----------------------------------|
| Build command | `npm run build`                   |
| Start command | `npm run start`                   |

`npm run build` runs `prisma generate && next build`.

### Step 5 — Run migrations in production

After first deploy (or after any schema change), open the Railway **Shell** tab for your service and run:

```bash
npx prisma migrate deploy
npm run db:seed   # optional: seed demo data
```

> **Why `migrate deploy` and not `migrate dev`?**
> `migrate dev` is for local development — it creates migration files and may reset the DB.
> `migrate deploy` applies existing migration files to production safely.

### Step 6 — Deploy

Push a commit to `main` and Railway will auto-deploy.

---

## Environment variables reference

| Variable       | Required | Description                                |
|----------------|----------|--------------------------------------------|
| `DATABASE_URL` | ✅ Yes   | Full PostgreSQL connection string           |

For future features (add when ready):

| Variable                   | Required | Description                      |
|----------------------------|----------|----------------------------------|
| `GOOGLE_CLIENT_ID`         | No       | Google Calendar OAuth            |
| `GOOGLE_CLIENT_SECRET`     | No       | Google Calendar OAuth            |
| `CLOUDINARY_CLOUD_NAME`    | No       | Image upload via Cloudinary      |
| `CLOUDINARY_API_KEY`       | No       | Cloudinary                       |
| `CLOUDINARY_API_SECRET`    | No       | Cloudinary                       |

---

## Prisma workflow

```bash
# Generate client (after schema changes)
npm run db:generate

# Create and apply a new migration (local dev)
npx prisma migrate dev --name describe_your_change

# Apply migrations in production
npm run db:deploy

# Seed the database
npm run db:seed

# Open Prisma Studio (visual DB browser)
npm run db:studio
```

---

## How to customize

### Change the app name
Edit `src/config/app.config.ts` → `appName` and `appNameEn`.

### Rename the two people
1. Update the seed file `prisma/seed.ts` → change `name` values.
2. Re-run `npm run db:seed` (or update rows directly in the DB).
3. Or update `APP_CONFIG.personAFallbackHe` etc. in `src/config/app.config.ts`.

### Add more sayings
Insert rows into the `Saying` table:
```sql
INSERT INTO "Saying" (id, "textHe", "textEn", active, "createdAt")
VALUES (gen_random_uuid(), 'טקסט בעברית', 'English text', true, now());
```
Or use Prisma Studio (`npm run db:studio`).

### Add more images
Insert rows into the `DailyImage` table with any external image URL (Unsplash, Cloudinary, etc.).

### Add a new navigation tab
1. Create the page: `src/app/your-tab/page.tsx`
2. Add an entry to `APP_CONFIG.navTabs` in `src/config/app.config.ts`
3. Add translation strings to `src/translations/he.ts` and `en.ts`
4. Add the key to `TAB_KEYS` in `src/components/Navbar.tsx`

### Replace the background image
The daily image comes from the `DailyImage` table. Update the `imageUrl` column with your image URL.
For local images, you would need cloud storage (see below).

---

## Image / cloud storage

Currently, all images are external URLs (Unsplash placeholders).

**To add Cloudinary upload later:**
1. Install: `npm install cloudinary`
2. Add env vars: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
3. Create `src/lib/cloudinary.ts`
4. Add an upload API route at `src/app/api/upload/route.ts`
5. Update `DailyImage.imageUrl` with the returned Cloudinary URL
6. Add `res.cloudinary.com` to `next.config.js` `remotePatterns` (already prepared)

**Do not** use Next.js's `/public` folder for user-uploaded images on Railway — Railway has an ephemeral filesystem and files will be lost on redeploy.

---

## Google Calendar integration (future)

The weekly calendar strip in the גבולות page is built to accept real events.

To enable Google Calendar:
1. Create a project at [console.cloud.google.com](https://console.cloud.google.com).
2. Enable the Google Calendar API.
3. Create OAuth 2.0 credentials.
4. Add env vars: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`.
5. Create `src/lib/google-calendar.ts` — a service that fetches events using the OAuth token.
6. Pass events to `<WeekCalendar events={events} />` (the component is ready to receive them).

The service layer placeholder is at `src/lib/google-calendar.ts` (create this file when ready).

---

## Tech stack

| Layer      | Choice                     |
|------------|----------------------------|
| Framework  | Next.js 13 (App Router)    |
| Language   | TypeScript                 |
| Styling    | Tailwind CSS               |
| Database   | PostgreSQL                 |
| ORM        | Prisma                     |
| Deployment | Railway                    |

---

## Project structure

```
parents-app/
├── prisma/
│   ├── schema.prisma        # Database schema — edit to change data models
│   └── seed.ts              # Demo data seed script
├── src/
│   ├── app/                 # Next.js App Router pages + API routes
│   │   ├── api/
│   │   │   ├── daily/       # GET: daily saying + image
│   │   │   ├── hurt-entries/# GET + POST: hurt entries
│   │   │   ├── boundaries/  # GET + POST: boundary messages
│   │   │   └── participants/# GET: list participants
│   │   ├── hurt/            # נפגעתי ממך page
│   │   ├── boundaries/      # גבולות page
│   │   ├── layout.tsx       # Root layout (navbar, providers)
│   │   └── page.tsx         # Home / hero page
│   ├── components/
│   │   ├── ui/Modal.tsx     # Reusable modal dialog
│   │   ├── Navbar.tsx       # Fixed top navbar with language toggle
│   │   ├── HeroSection.tsx  # Full-screen hero with daily content
│   │   ├── HurtTracker.tsx  # נפגעתי ממך full page component
│   │   ├── BoundariesPage.tsx  # גבולות full page component
│   │   ├── WeekCalendar.tsx # Week strip calendar
│   │   └── LanguageToggle.tsx
│   ├── config/
│   │   └── app.config.ts    # ← Change app name, person names, tabs here
│   ├── context/
│   │   └── LanguageContext.tsx  # He/En language state + t() helper
│   ├── lib/
│   │   ├── prisma.ts        # Prisma singleton
│   │   ├── daily-selector.ts   # Deterministic daily pick algorithm
│   │   └── hebrew-calendar.ts  # Hebrew holiday lookup
│   └── translations/
│       ├── he.ts            # Hebrew strings — change all wording here
│       └── en.ts            # English strings
├── .env.example             # Copy to .env.local and fill in values
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```
