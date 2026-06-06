export type UserRole = 'candidate' | 'company'

export type ApplicationStatus = 'applied' | 'shortlisted' | 'rejected'

export interface Profile {
  id: string
  user_id: string
  role: UserRole
  name: string
  email: string
  avatar_url?: string
  created_at: string
}

export interface CandidateProfile extends Profile {
  role: 'candidate'
  college?: string
  skills: string[]
  experience_years: number
  resume_url?: string
  resume_text?: string
  bio?: string
  location?: string
}

/** Minimal company info returned from a profiles table join */
export interface CompanyInfo {
  name: string
  email: string
}

export interface CompanyProfile extends Profile {
  role: 'company'
  company_name: string
  website?: string
  description?: string
  location?: string
}

export interface Job {
  id: string
  company_id: string
  title: string
  description: string
  required_skills: string[]
  location: string
  salary_range?: string
  job_type: 'full-time' | 'part-time' | 'internship' | 'remote'
  is_active: boolean
  created_at: string
  company?: CompanyProfile
}

export interface JobMatch {
  job: Job
  match_score: number
  match_reason: string
}

/** A raw application row from the applications table */
export interface Application {
  id: string
  candidate_id: string
  job_id: string
  status: ApplicationStatus
  applied_at: string
}

/** Application enriched with job and company data (used on the applications page) */
export interface EnrichedApplication extends Application {
  job: (Job & { company: Pick<Profile, 'name'> | null }) | null
}

/** An applicant row as loaded on the company candidates page */
export interface EnrichedApplicant extends Application {
  candidate: Profile | null
  candidate_details: CandidateProfile | null
}

/** A candidate match result as returned by /api/match-candidates */
export interface CandidateMatch {
  job: CandidateProfile   // named 'job' by the API response shape — holds candidate data
  match_score: number
  match_reason: string
}

/** Profile form state on the candidate profile page */
export interface ProfileForm {
  name?: string
  college?: string
  bio?: string
  location?: string
  experience_years?: number
  skills?: string[]
  resume_url?: string
}

/** Status badge config used in the applications and candidates pages */
export interface StatusStyle {
  bg: string
  color: string
  border: string
}

/** Status badge config with label and icon (applications page) */
export interface StatusConfig extends StatusStyle {
  icon: React.ReactNode
  label: string
}

/** A single nav link entry used in the mobile drawer */
export interface NavLink {
  href: string
  label: string
  icon?: React.ReactNode
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  created_at: string
}

export interface Conversation {
  id: string
  candidate_id: string
  company_id: string
  job_id?: string
  created_at: string
  candidate?: CandidateProfile
  company?: CompanyProfile
  last_message?: Message
}
