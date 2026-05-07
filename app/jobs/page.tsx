'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'
import { Job, JobMatch, CandidateProfile } from '@/types'
import { Loader2, Zap, Briefcase, CheckCircle } from 'lucide-react'

export default function JobsPage() {
  const supabase = createClient()
  const [matches, setMatches] = useState<JobMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [matching, setMatching] = useState(false)
  const [filter, setFilter] = useState<'all' | 'remote' | 'internship'>('all')
  const [profile, setProfile] = useState<CandidateProfile | null>(null)
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set())
  const [applying, setApplying] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => { loadJobsAndMatch() }, [])

  const loadJobsAndMatch = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { window.location.href = '/login'; return }
      setUserId(session.user.id)

      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
      const { data: candidateData } = await supabase.from('candidate_profiles').select('*').eq('id', session.user.id).single()
      const candidate = { ...profileData, ...candidateData } as CandidateProfile
      setProfile(candidate)

      // Get existing applications
      const { data: existingApps } = await supabase
        .from('applications')
        .select('job_id')
        .eq('candidate_id', session.user.id)
      if (existingApps) {
        setAppliedJobs(new Set(existingApps.map(a => a.job_id)))
      }

      const { data: jobs } = await supabase.from('jobs').select('*').eq('is_active', true).limit(20)
      if (!jobs?.length) { setLoading(false); return }

      setMatching(true)
      const res = await fetch('/api/match-jobs', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidate, jobs })
      })
      const { matches: aiMatches } = await res.json()
      setMatches(aiMatches || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false); setMatching(false)
    }
  }

  const handleApply = async (jobId: string) => {
    if (!userId || appliedJobs.has(jobId)) return
    setApplying(jobId)
    try {
      const { error } = await supabase.from('applications').insert({
        candidate_id: userId,
        job_id: jobId,
        status: 'applied'
      })
      if (error) throw error
      setAppliedJobs(prev => new Set(Array.from(prev).concat(jobId)))
    } catch (err) {
      console.error('Apply error:', err)
      alert('Failed to apply. Please try again.')
    } finally {
      setApplying(null)
    }
  }

  const filtered = matches.filter(m => {
    if (filter === 'remote') return m.job.job_type === 'remote'
    if (filter === 'internship') return m.job.job_type === 'internship'
    return true
  })

  const scoreColor = (s: number) => s >= 85 ? '#059669' : s >= 70 ? '#6366f1' : '#888'
  const scoreBg = (s: number) => s >= 85 ? '#ecfdf5' : s >= 70 ? '#eef2ff' : '#f5f5f5'
  const scoreBorder = (s: number) => s >= 85 ? '#a7f3d0' : s >= 70 ? '#c7d2fe' : '#e8e8e8'

  return (
    <>
      <Navbar userRole="candidate" />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* AI Banner */}
        {profile && (
          <div style={{
            background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)',
            border: '1px solid #c7d2fe', borderRadius: 14,
            padding: '1rem 1.25rem', marginBottom: '1.5rem',
            display: 'flex', alignItems: 'center', gap: 12
          }}>
            <div style={{ width: 36, height: 36, background: '#6366f1', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {matching ? <Loader2 size={16} color="#fff" style={{ animation: 'spin 1s linear infinite' }} /> : <Zap size={16} color="#fff" />}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>
                {matching ? 'AI is matching jobs to your profile...' : `AI matched ${matches.length} jobs for you`}
              </div>
              <div style={{ fontSize: 13, color: '#888' }}>
                Based on: {profile.skills?.slice(0, 4).join(', ') || 'Add skills to your profile for better matches'}
              </div>
            </div>
            <a href="/profile" style={{ marginLeft: 'auto', textDecoration: 'none' }}>
              <button style={{ padding: '6px 12px', background: '#fff', border: '1px solid #e8e8e8', borderRadius: 8, fontSize: 12, color: '#444', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                Update profile
              </button>
            </a>
          </div>
        )}

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem' }}>
          {(['all', 'remote', 'internship'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '6px 16px', borderRadius: 20, border: '1px solid',
              borderColor: filter === f ? '#6366f1' : '#e8e8e8',
              background: filter === f ? '#6366f1' : '#fff',
              color: filter === f ? '#fff' : '#888',
              fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              textTransform: 'capitalize'
            }}>{f}</button>
          ))}
          {appliedJobs.size > 0 && (
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#059669' }}>
              <CheckCircle size={14} /> {appliedJobs.size} applied
            </div>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
            <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', marginBottom: 12 }} />
            <p style={{ fontSize: 14 }}>Finding your matches...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
            <Briefcase size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
            <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>No jobs found</p>
            <p style={{ fontSize: 13 }}><a href="/profile" style={{ color: '#6366f1' }}>Complete your profile</a> to get AI matches</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
            {filtered.map(({ job, match_score, match_reason }) => {
              const isApplied = appliedJobs.has(job.id)
              const isApplying = applying === job.id
              return (
                <div key={job.id} style={{
                  background: '#fff', border: `1px solid ${isApplied ? '#a7f3d0' : '#e8e8e8'}`,
                  borderRadius: 16, padding: '1.25rem', transition: 'all 0.2s',
                  position: 'relative'
                }}
                  onMouseEnter={e => { if (!isApplied) (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(99,102,241,0.08)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}
                >
                  {/* Applied badge */}
                  {isApplied && (
                    <div style={{ position: 'absolute', top: 12, right: 12, background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', borderRadius: 20, fontSize: 11, fontWeight: 600, padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CheckCircle size={11} /> Applied
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#6366f1', fontSize: 15 }}>
                      {job.title[0]}
                    </div>
                    {!isApplied && (
                      <div style={{ background: scoreBg(match_score), color: scoreColor(match_score), border: `1px solid ${scoreBorder(match_score)}`, borderRadius: 20, fontSize: 11, fontWeight: 600, padding: '3px 8px', alignSelf: 'flex-start' }}>
                        {match_score}% match
                      </div>
                    )}
                  </div>

                  <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a', marginBottom: 3 }}>{job.title}</div>
                  <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>{job.location} · {job.job_type}</div>
                  <p style={{ fontSize: 12, color: '#999', lineHeight: 1.5, marginBottom: 10, background: '#fafafa', borderRadius: 8, padding: '8px 10px' }}>✦ {match_reason}</p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 14 }}>
                    {job.required_skills?.slice(0, 4).map((s: string) => (
                      <span key={s} style={{ background: '#f3f4f6', color: '#6b7280', borderRadius: 6, fontSize: 11, padding: '3px 7px' }}>{s}</span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#6366f1' }}>{job.salary_range || 'Salary not listed'}</span>
                    <button
                      onClick={() => handleApply(job.id)}
                      disabled={isApplied || isApplying}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '7px 16px', borderRadius: 8, border: 'none',
                        background: isApplied ? '#f0fdf4' : '#6366f1',
                        color: isApplied ? '#059669' : '#fff',
                        fontSize: 13, fontWeight: 500,
                        cursor: isApplied ? 'default' : 'pointer',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                      {isApplying
                        ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />
                        : isApplied
                          ? <><CheckCircle size={13} /> Applied</>
                          : 'Apply →'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
