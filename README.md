# HireWise — AI Job Matching Platform

A full-stack job marketplace where AI semantically matches candidates to jobs based on their actual skills and resume — not just keywords.

## Tech Stack

- **Next.js 14** (App Router)
- **Supabase** (Auth + PostgreSQL + Realtime)
- **Anthropic Claude API** (Resume parsing + Job matching)
- **TypeScript + Tailwind CSS**
- **Vercel** (Deployment)

---

## Setup Instructions

### 1. Clone and install

```bash
git clone <your-repo>
cd hirewise
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free project
2. Go to **SQL Editor** and paste the contents of `supabase-schema.sql` and run it
3. Go to **Settings > API** and copy your keys

### 3. Set up environment variables

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

Get your Anthropic API key from [console.anthropic.com](https://console.anthropic.com)

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
hirewise/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── login/page.tsx            # Login
│   ├── signup/page.tsx           # Signup (candidate + company)
│   ├── jobs/page.tsx             # AI-matched jobs (candidate)
│   ├── profile/page.tsx          # Candidate profile + resume upload
│   ├── company/
│   │   ├── jobs/page.tsx         # Company job posts
│   │   └── candidates/page.tsx   # AI-ranked candidates
│   └── api/
│       ├── parse-resume/route.ts # Claude parses resume
│       └── match-jobs/route.ts   # Claude matches jobs to candidate
├── components/
│   └── layout/Navbar.tsx
├── lib/
│   └── supabase.ts
├── types/index.ts
└── supabase-schema.sql
```

## Key Features

- **AI Resume Parsing** — Upload a resume, Claude extracts skills, experience, and bio automatically
- **Semantic Job Matching** — Claude scores each job 0–100 based on how well the candidate fits, with a human-readable reason
- **Two-sided marketplace** — Separate flows for candidates and companies
- **Direct messaging** — Real-time chat between candidates and companies via Supabase Realtime
- **Role-based auth** — Supabase handles auth, profiles stored with `candidate` or `company` role

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Add your environment variables in the Vercel dashboard under **Settings > Environment Variables**.

---

## Next features to build

- [ ] Real-time chat (Supabase Realtime already set up in schema)
- [ ] AI-generated cover letters per job
- [ ] Company candidate ranking page
- [ ] Email notifications on new matches
- [ ] Resume PDF upload (Supabase Storage)
