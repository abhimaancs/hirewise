-- =============================================================================
-- Migration: Add applications table
-- =============================================================================
-- Run this in: Supabase Dashboard → SQL Editor
--
-- This table is required by:
--   app/jobs/page.tsx          — candidate applies, reads applied job_ids
--   app/applications/page.tsx  — candidate tracks all own applications
--   app/company/candidates/    — company reads applicants per job, updates status
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Create the table
-- -----------------------------------------------------------------------------

create table applications (
  id           uuid                     default gen_random_uuid() primary key,
  candidate_id uuid                     not null references profiles(id) on delete cascade,
  job_id       uuid                     not null references jobs(id)     on delete cascade,
  status       text                     not null default 'applied'
                 check (status in ('applied', 'shortlisted', 'rejected')),
  applied_at   timestamp with time zone not null default now(),

  -- prevents a candidate from applying to the same job twice
  -- app/jobs/page.tsx catches error code 23505 (unique violation) on insert
  unique (candidate_id, job_id)
);

-- -----------------------------------------------------------------------------
-- 2. Index — speeds up the two most common queries:
--      .eq('candidate_id', uid)   (applications page, jobs page)
--      .eq('job_id', jid)         (company candidates page)
-- -----------------------------------------------------------------------------

create index idx_applications_candidate_id on applications (candidate_id);
create index idx_applications_job_id       on applications (job_id);

-- -----------------------------------------------------------------------------
-- 3. Enable Row Level Security
-- -----------------------------------------------------------------------------

alter table applications enable row level security;

-- -----------------------------------------------------------------------------
-- 4. RLS Policies
-- -----------------------------------------------------------------------------

-- Candidate: read own applications
-- Used by: app/applications/page.tsx  → select('*').eq('candidate_id', uid)
--          app/jobs/page.tsx          → select('job_id').eq('candidate_id', uid)
create policy "Candidates can view own applications"
  on applications
  for select
  using (auth.uid() = candidate_id);

-- Candidate: submit a new application
-- Used by: app/jobs/page.tsx → insert({ candidate_id, job_id, status:'applied' })
-- The check ensures a candidate can only insert a row for themselves.
create policy "Candidates can apply to jobs"
  on applications
  for insert
  with check (auth.uid() = candidate_id);

-- Company: read all applications for jobs they own
-- Used by: app/company/candidates/page.tsx → select('*').eq('job_id', jid)
create policy "Companies can view applications for their jobs"
  on applications
  for select
  using (
    auth.uid() in (
      select company_id from jobs where id = job_id
    )
  );

-- Company: update application status (applied → shortlisted / rejected)
-- Used by: app/company/candidates/page.tsx → update({ status }).eq('id', appId)
-- The check ensures only the company that owns the job can change status,
-- and prevents escalating status values outside the allowed set (the column
-- check constraint handles that, but we scope the update to the right owner).
create policy "Companies can update status for their job applications"
  on applications
  for update
  using (
    auth.uid() in (
      select company_id from jobs where id = job_id
    )
  )
  with check (
    auth.uid() in (
      select company_id from jobs where id = job_id
    )
  );
