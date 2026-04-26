export type UserRole = 'candidate' | 'company'

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
  resume_text?: string        // extracted by Claude
  bio?: string
  location?: string
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
  match_score: number           // 0–100, computed by Claude
  match_reason: string          // AI explanation of why it matched
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
