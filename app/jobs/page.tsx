'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'
import { Job, JobMatch, CandidateProfile } from '@/types'
import { Loader2, Zap, Briefcase } from 'lucide-react'

export default function JobsPage() {
  const supabase = createClient()
  const [matches, setMatches] = useState<JobMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [matching, setMatching] = useState(false)
  const [filter, setFilter] = useState<'all' | 'remote' | 'internship'>('all')
  const [profile, setProfile] = useState<CandidateProfile | null>(null)

  useEffect(() => { loadJobsAndMatch() }, [])

  const loadJobsAndMatch = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { window.location.href = '/login'; return }

      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
      const { data: candidateData } = await supabase.from('candidate_profiles').select('*').eq('id', session.user.id).single()
      const candidate = { ...profileData, ...candidateData } as CandidateProfile
      setProfile(candidate)

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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
            {filtered.map(({ job, match_score, match_reason }) => (
              <div key={job.id} style={{
                background: '#fff', border: '1px solid #e8e8e8', borderRadius: 16,
                padding: '1.25rem', cursor: 'pointer', transition: 'all 0.2s'
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#c7d2fe'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(99,102,241,0.08)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e8e8e8'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#6366f1', fontSize: 15 }}>
                    {job.title[0]}
                  </div>
                  <div style={{ background: scoreBg(match_score), color: scoreColor(match_score), border: `1px solid ${scoreBorder(match_score)}`, borderRadius: 20, fontSize: 11, fontWeight: 600, padding: '3px 8px', alignSelf: 'flex-start' }}>
                    {match_score}% match
                  </div>
                </div>

                <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a', marginBottom: 3 }}>{job.title}</div>
                <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>{(job as any).company?.company_name} · {job.location}</div>
                <p style={{ fontSize: 12, color: '#999', lineHeight: 1.5, marginBottom: 10, background: '#fafafa', borderRadius: 8, padding: '8px 10px' }}>✦ {match_reason}</p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                  {job.required_skills.slice(0, 4).map(s => (
                    <span key={s} style={{ background: '#f3f4f6', color: '#6b7280', borderRadius: 6, fontSize: 11, padding: '3px 7px' }}>{s}</span>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#6366f1' }}>{job.salary_range || 'Salary not listed'}</span>
                  <span style={{ fontSize: 12, color: '#888', textTransform: 'capitalize' }}>{job.job_type}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
