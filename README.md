# RateYourBellarmineTeacher

A production-ready RateMyProfessor-style web app for Bellarmine students to browse teachers and submit anonymous reviews.

## Project Overview

This project is built with:

- **Next.js 14 (App Router) + TypeScript**
- **Supabase (PostgreSQL)** for data storage
- **TailwindCSS** for UI styling
- **Zod** for runtime validation
- **Vercel** for deployment

Core features include:

- Teacher directory with search/filter/sort
- Teacher profile pages with review statistics
- Anonymous review submission with SHA-256 anon hash
- 24-hour submission rate limiting (5 reviews max)
- Review reporting and moderation support

## Database Setup (Supabase)

Create these tables in Supabase SQL editor:

```sql
create table if not exists teachers (
  teacher_id int primary key,
  name_en text not null,
  slug text unique not null,
  department text not null,
  photo_url text,
  photo_filename text,
  courses text[] not null default '{}',
  created_at timestamp with time zone default now()
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  teacher_id int not null references teachers(teacher_id),
  rating int not null check (rating between 1 and 5),
  difficulty int not null check (difficulty between 1 and 5),
  workload int not null check (workload between 1 and 5),
  tags text[] not null default '{}',
  comment text not null,
  anon_hash text not null,
  status text not null default 'visible' check (status in ('visible', 'hidden')),
  created_at timestamp with time zone default now()
);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references reviews(id),
  reason text not null,
  anon_hash text not null,
  created_at timestamp with time zone default now()
);
```

## Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ANON_HASH_SALT=your_strong_random_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Local Setup

```bash
npm install
npm install dotenv --save-dev
npm run dev
```

Open: `http://localhost:3000`

## Data Seeding

Teacher seed data lives in `teachers_seed.json`.

Run:

```bash
npm run seed:teachers
```

The script upserts teacher data using `teacher_id` conflict resolution.

## API Routes

- `POST /api/reviews/create` – validate and create anonymous reviews
- `POST /api/reviews/report` – submit review reports
- `GET /api/teachers` – list/filter/sort teachers with aggregated stats
- `GET /api/teacher/[slug]` – fetch one teacher and visible reviews

## Deployment (Vercel)

1. Push repository to GitHub.
2. Import project in Vercel.
3. Set environment variables in Vercel project settings.
4. Deploy.

