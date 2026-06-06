# HireWise — AI-Powered Job Matching Platform

> A full-stack hiring platform that uses LLM-based semantic matching to connect candidates with the right roles — and give companies ranked, scored applicants automatically.

**Live Demo → [hirewise-henna.vercel.app](https://hirewise-henna.vercel.app)**

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [Screenshots](#screenshots)
- [Demo Flow](#demo-flow)
- [Local Setup](#local-setup)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)

---

## Overview

HireWise is a two-sided hiring platform built for the Indian internship and early-career market. Candidates build a structured profile, upload their resume, and get AI-generated match scores against every active job. Companies post roles and receive a ranked list of candidates scored by the same AI.

The matching engine calls a Mistral-7B model via OpenRouter, scores profiles against job requirements on a 0–100 scale, and returns a plain-language reason for each match. If the LLM call fails, a deterministic skill-overlap fallback ensures the app never returns an empty result.

---

## Features

### For Candidates
- **Profile builder** — name, skills (tag input), experience, college, bio, location
- **PDF resume upload** — stored in Supabase Storage, publicly linked for companies to view
- **AI match scores** — every job card shows a 0–100% match with a one-line reason
- **Job detail page** — full description, required skills with matched skills highlighted green, sticky apply sidebar
- **One-click apply / withdraw** — with inline confirmation before withdrawal
- **Application tracker** — status board showing Applied / Shortlisted / Rejected with date
- **AI cover letter** — one-click generation tailored to a specific job
- **Direct messaging** — real-time chat with hiring managers, no recruiters

### For Companies
- **Job posting** — title, description, location, type, salary range, required skills
- **Pause / activate** — toggle job visibility without deleting
- **AI candidate ranking** — ranked list of applicants scored against the job
- **Status management** — move applications from Applied → Shortlisted / Rejected
- **Direct messaging** — message shortlisted candidates

### Platform
- Email + password auth (Supabase Auth)
- Role-based routing — candidates and companies see different nav and dashboards
- Row-level security on every table — users can only read and write their own data
- Responsive layout — single-column below 768px
- Active nav highlighting — current route highlighted with indigo underline

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser (Next.js 14)                    │
│                                                                  │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │  Public  │  │  Candidate   │  │        Company           │  │
│  │  /       │  │  /jobs       │  │  /company/jobs           │  │
│  │  /browse │  │  /jobs/[id]  │  │  /company/candidates     │  │
│  │  /about  │  │  /profile    │  │  /company/profile        │  │
│  └──────────┘  │  /applications│  └──────────────────────────┘  │
│                │  /conversations│                                │
│                └──────────────┘                                  │
└─────────────────────────┬───────────────────────────────────────┘
                          │ fetch / supabase-js
          ┌───────────────┼────────────────┐
          │               │                │
          ▼               ▼                ▼
  ┌───────────────┐  ┌──────────┐  ┌─────────────────┐
  │  Next.js API  │  │ Supabase │  │  Supabase       │
  │  Route Handlers│  │  Auth    │  │  Storage        │
  │               │  │  (email) │  │  (resumes/)     │
  │  /api/match-  │  └──────────┘  └─────────────────┘
  │    jobs       │
  │  /api/match-  │  ┌─────────────────────────────────┐
  │    candidates │  │       Supabase Postgres          │
  │  /api/cover-  │  │                                  │
  │    letter     │  │  profiles · candidate_profiles   │
  └───────┬───────┘  │  jobs · applications             │
          │          │  conversations · messages         │
          ▼          └─────────────────────────────────┘
  ┌───────────────┐
  │  OpenRouter   │
  │  API          │
  │  (Mistral-7B  │
  │   Instruct)   │
  └───────────────┘
```

**Data flow for AI matching:**
1. Candidate's profile (skills, experience, bio) + job list sent to `/api/match-jobs`
2. Route builds a structured prompt and calls `mistralai/mistral-7b-instruct` via OpenRouter
3. Model returns a JSON array of `{ job_id, match_score, match_reason }`
4. If the model response is invalid JSON, a regex extractor attempts recovery
5. If extraction fails, a deterministic skill-overlap scorer runs as final fallback
6. Sorted results returned to the client and rendered on job cards

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Inline CSS (custom dark design system) |
| Auth | Supabase Auth (email + password) |
| Database | Supabase Postgres (with RLS) |
| File Storage | Supabase Storage |
| AI / LLM | Mistral-7B Instruct via OpenRouter API |
| Icons | Lucide React |
| Fonts | Syne + DM Sans (Google Fonts) |
| Deployment | Vercel |

---

## Database Schema

All tables have Row Level Security enabled. Policies are documented in `/migrations/`.

### `profiles`
Core identity table created by Supabase Auth trigger.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | Primary key — matches `auth.users.id` |
| `email` | `text` | User's email |
| `name` | `text` | Display name |
| `role` | `text` | `'candidate'` or `'company'` |
| `created_at` | `timestamptz` | Auto |

### `candidate_profiles`
Extended profile for candidates. Drives AI matching.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | FK → `profiles.id` |
| `skills` | `text[]` | Array of skill strings |
| `experience_years` | `int` | Years of experience |
| `college` | `text` | University name |
| `bio` | `text` | Short bio |
| `location` | `text` | City / remote |
| `resume_url` | `text` | Public URL from Supabase Storage |

### `jobs`
Job postings created by companies.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | Primary key |
| `company_id` | `uuid` | FK → `profiles.id` |
| `title` | `text` | Job title |
| `description` | `text` | Full description |
| `required_skills` | `text[]` | Used by matching engine |
| `job_type` | `text` | `full-time / internship / remote / part-time` |
| `location` | `text` | |
| `salary_range` | `text` | Display string e.g. `₹12–18 LPA` |
| `is_active` | `bool` | Controls visibility to candidates |
| `created_at` | `timestamptz` | Auto |

### `applications`
Tracks every candidate–job application with status lifecycle.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | Primary key |
| `candidate_id` | `uuid` | FK → `profiles.id` |
| `job_id` | `uuid` | FK → `jobs.id` |
| `status` | `text` | `applied → shortlisted / rejected` |
| `applied_at` | `timestamptz` | Auto |

Unique constraint on `(candidate_id, job_id)` — one application per job. Candidates can withdraw while `status = 'applied'`; shortlisted/rejected applications are locked.

### `conversations` + `messages`
Real-time direct messaging between candidates and companies.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | Primary key |
| `candidate_id` | `uuid` | FK → `profiles.id` |
| `company_id` | `uuid` | FK → `profiles.id` |
| `job_id` | `uuid` | FK → `jobs.id` |
| `created_at` | `timestamptz` | Auto |

---

## Screenshots

> Replace these placeholders with actual screenshots.

### Landing Page
![Landing Page](docs/screenshots/landing.png)

### Candidate — AI Job Matches
![Jobs Page](docs/screenshots/jobs.png)

### Job Detail with Match Score
![Job Detail](docs/screenshots/job-detail.png)

### Application Tracker
![Applications](docs/screenshots/applications.png)

### Company — Candidate Rankings
![Company Candidates](docs/screenshots/company-candidates.png)

### Candidate Profile Builder
![Profile](docs/screenshots/profile.png)

---

## Demo Flow

### As a Candidate
1. Sign up at `/signup` — select **Candidate**
2. Complete your profile at `/profile` — add skills (e.g. React, Node.js, TypeScript), experience, college
3. Optionally upload a PDF resume
4. Go to `/jobs` — AI scores and ranks all active jobs against your profile
5. Click any job card to open the detail page — see your match %, matched skills highlighted
6. Hit **Apply →** — application recorded with status `applied`
7. Check `/applications` to track status changes

### As a Company
1. Sign up at `/signup?role=company` — select **Company**
2. Complete company profile at `/company/profile`
3. Post a job at `/company/jobs` — add title, description, required skills
4. Go to `/company/candidates` — AI ranks all applicants by fit score
5. Shortlist or reject candidates — status updates reflect instantly on the candidate's side
6. Message shortlisted candidates directly via `/conversations`

---

## Local Setup

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works)
- An [OpenRouter](https://openrouter.ai) API key (free credits available)

### 1. Clone and install

```bash
git clone https://github.com/abhimaancs/hirewise.git
cd hirewise
npm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
```

Fill in your values — see [Environment Variables](#environment-variables) below.

### 3. Set up the database

Run the following in your Supabase project's **SQL Editor** (Dashboard → SQL Editor):

```sql
-- 1. Core tables (profiles, jobs, candidate_profiles, conversations, messages)
--    These are created by Supabase Auth + your initial schema setup.

-- 2. Applications table + RLS policies
-- Copy and run: migrations/add_applications_table.sql

-- 3. Withdraw policy
-- Copy and run: migrations/add_withdraw_policy.sql
```

### 4. Set up Supabase Storage

In your Supabase Dashboard → **Storage**:
1. Create a new bucket named `resumes`
2. Set it to **Public**
3. Add this RLS policy (SQL Editor):

```sql
-- Allow authenticated users to upload their own resume
create policy "Candidates can upload own resume"
  on storage.objects for insert
  with check (
    bucket_id = 'resumes'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow public read
create policy "Public can view resumes"
  on storage.objects for select
  using (bucket_id = 'resumes');
```

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Service role key (not currently used in routes) |
| `OPENROUTER_API_KEY` | ✅ | OpenRouter key for Mistral-7B matching. Without this, AI matching silently falls back to skill-overlap scoring. |

Get Supabase keys: Dashboard → Settings → API
Get OpenRouter key: [openrouter.ai/keys](https://openrouter.ai/keys)

---

## Project Structure

```
hirewise/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout (fonts, metadata)
│   ├── globals.css               # Dark theme base styles
│   ├── login/                    # Auth pages
│   ├── signup/
│   ├── onboarding/               # Post-signup setup flow
│   ├── profile/                  # Candidate profile builder
│   ├── jobs/
│   │   ├── page.tsx              # AI-ranked job feed
│   │   └── [id]/page.tsx         # Job detail + apply
│   ├── applications/             # Candidate application tracker
│   ├── conversations/            # Message inbox
│   ├── chat/[id]/                # Individual conversation
│   ├── browse-jobs/              # Public job board (no auth)
│   ├── company/
│   │   ├── jobs/                 # Post and manage jobs
│   │   ├── candidates/           # AI-ranked applicant list
│   │   └── profile/              # Company profile
│   └── api/
│       ├── match-jobs/           # LLM scoring: candidate ↔ jobs
│       ├── match-candidates/     # LLM scoring: job ↔ candidates
│       └── cover-letter/         # LLM cover letter generation
├── components/
│   └── layout/
│       └── Navbar.tsx            # Responsive nav with active route highlighting
├── lib/
│   └── supabase.ts               # Supabase browser client
├── migrations/
│   ├── add_applications_table.sql
│   └── add_withdraw_policy.sql
└── types/                        # Shared TypeScript interfaces
```

---

## License

MIT
