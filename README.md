# TTSY Education

A full-stack K-5 STEM learning MVP built with Next.js App Router, TypeScript, Tailwind CSS, Supabase Auth, Supabase Postgres, Zod, and React Hook Form.

Students can sign up directly, join classes, browse courses by grade, work through videos, quizzes, and games in order, and see saved progress. Educators can create classes, share join codes, and monitor student growth. Admins can create/edit/publish lessons and manage questions.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth and Postgres
- Supabase SSR cookie session helpers
- Zod validation
- React Hook Form
- Server Actions for auth, quiz saving, and admin mutations

## Local Setup

1. Install dependencies:

```bash
npm install
```

On this Windows shell, use `npm.cmd install` if PowerShell blocks `npm.ps1`.

2. Create `.env.local` from `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-or-anon-key
```

3. In Supabase SQL Editor, run:

```sql
-- first
-- paste supabase/schema.sql

-- second
-- paste supabase/seed.sql
```

If you already ran an older version of the schema, run `schema.sql` again so the educator and classroom tables are added.

4. Start the app:

```bash
npm run dev
```

## Roles

Public signup now supports:

- `student`
- `educator`

Admin accounts are still created manually. To make an account an admin:

1. Sign up once through `/signup`.
2. Run this in Supabase SQL Editor, replacing the email:

```sql
update public.profiles
set role = 'admin'
where email = 'admin@example.com';
```

3. Log out and log back in. The admin account can access `/admin`.

## Seeded Lessons

The seed script creates:

- Grade 1 Math: Addition within 10, Subtraction within 10
- Grade 3 Math: Intro to Multiplication, Division as Equal Groups
- Grade 5 Science: States of Matter, Simple Forces

Each lesson includes a video URL, thumbnail, estimated minutes, quiz questions, and topic-linked practice/game sections in the app.

## Useful Commands

```bash
npm run lint
npm run build
npm run dev
```

## Security Notes

- Row-level security is enabled for all app tables.
- Students can only read/write their own profiles, attempts, and progress.
- Authenticated students can read published lessons and questions.
- Unpublished lessons and all content mutations are admin-only.
- Server Actions still re-check authentication and role before writing data.

## Deploying to Vercel

Set the same environment variables in Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Then deploy normally. The database schema and seed data must be applied to the Supabase project before students can use the app.

### Custom domain checklist

1. Import the repo into Vercel and let the first production deploy finish.
2. In Vercel project settings, open `Domains` and add your custom domain.
3. Add the DNS records Vercel asks for at your domain registrar.
4. In Supabase Auth, set `Site URL` to your production domain.
5. In Supabase Auth, add redirect URLs for local and preview environments if needed.
6. Test signup, login, and any email-based auth flow from the live URL.
