-- =============================================================================
-- Migration: Allow candidates to withdraw pending applications
-- =============================================================================
-- Run this in: Supabase Dashboard → SQL Editor
--
-- This adds a DELETE RLS policy on the applications table so that candidates
-- can delete their own applications ONLY while status = 'applied'.
-- Once a company has shortlisted or rejected an application the candidate
-- can no longer delete it — this is enforced both here and in the app code.
--
-- After withdrawal the unique (candidate_id, job_id) constraint is released,
-- so the candidate can reapply to the same job from scratch.
-- =============================================================================

create policy "Candidates can withdraw their own pending applications"
  on applications
  for delete
  using (
    auth.uid() = candidate_id
    AND status = 'applied'
  );
