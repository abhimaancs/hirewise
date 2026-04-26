'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'
import { Job, JobMatch, CandidateProfile } from '@/types'
import { Briefcase, MapPin, Clock, Zap, Loader2 } from 'lucide-react'

export default function JobsPage() {
  const supabase = createClient()
  const [matches, setMatches] = useState<JobMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [matching, setMatching] = useState(false)
  const [filter, setFilter] = useState<'all' | 'remote' | 'internship'>('all')
  const [profile, setProfile] = useState<CandidateProfile | null>(null)

  useEffect(() => {
    loadJobsAndMatch()
  }, [])

  const loadJobsAndMatch = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get candidate profile + skills
      const { data: profileData } = await supabase
        .from('profiles').select('*').eq('id', user.id).single()
      const { data: candidateData } = await supabase
        .from('candidate_profiles').select('*').eq('id', user.id).single()

      const candidate = { ...profileData, ...candidateData } as CandidateProfile
      setProfile(candidate)

      // Fetch all active jobs
      const { data: jobs } = await supabase
        .from('jobs')
        .select('*, company:company_profiles(company_name, location)')
        .eq('is_active', true)
        .limit(20)

      if (!jobs?.length) { setLoading(false); return }

      // AI match
      setMatching(true)
      const res = await fetch('/api/match-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidate, jobs })
      })
      const { matches: aiMatches } = await res.json()
      setMatches(aiMatches || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
      setMatching(false)
    }
  }

  const filtered = matches.filter(m => {
    if (filter === 'remote') return m.job.job_type === 'remote'
    if (filter === 'internship') return m.job.job_type === 'internship'
    return true
  })

  const scoreColor = (score: number) => score >= 85 ? 'var(--green)' : score >= 70 ? 'var(--accent)' : 'var(--muted)'

  return (
    <>
      <Navbar userRole="candidate" />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem' }}>

        {/* AI banner */}
        {profile && (
          <div style={{
            background: 'rgba(79,142,247,0.08)', border: '1px solid rgba(79,142,247,0.2)',
            borderRadius: '14px', padding: '1.25rem 1.5rem', marginBottom: '2rem',
            display: 'flex', alignItems: 'center', gap: '1rem'
          }}>
            <div style={{
              width: 36, height: 36, background: 'var(--accent)', borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              {matching ? <Loader2 size={16} color="#fff" /> : <Zap size={16} color="#fff" />}
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '0.875rem', color: '#fff' }}>
                {matching ? 'AI is matching jobs to your profile...' : `AI matched ${matches.length} jobs for you`}
              </strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                Based on your skills: {profile.skills?.join(', ') || 'Update your profile to get better matches'}
              </span>
            </div>
          </div>
        )}

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {(['all', 'remote', 'internship'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '0.5rem 1.25rem', borderRadius: '8px', border: '1px solid var(--border)',
              background: filter === f ? 'var(--accent)' : 'var(--card)',
              color: filter === f ? '#fff' : 'var(--muted)',
              fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'var(--font-dm)',
              textTransform: 'capitalize'
            }}>{f}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
            <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
            <p>Loading jobs...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
            <Briefcase size={40} style={{ marginBottom: '1rem', opacity: 0.4 }} />
            <p>No jobs found. <a href="/profile" style={{ color: 'var(--accent)' }}>Update your profile</a> to get matches.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {filtered.map(({ job, match_score, match_reason }) => (
              <div key={job.id} style={{
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: '14px', padding: '1.25rem', cursor: 'pointer',
                transition: 'all 0.2s'
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = 'var(--card-hover)'
                  ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(79,142,247,0.3)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'var(--card)'
                  ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: 'rgba(79,142,247,0.15)', color: 'var(--accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '0.875rem', fontFamily: 'var(--font-syne)'
                  }}>
                    {job.title[0]}
                  </div>
                  <div style={{
                    background: 'rgba(16,185,129,0.15)', color: scoreColor(match_score),
                    border: `1px solid rgba(16,185,129,0.3)`, borderRadius: '999px',
                    fontSize: '0.7rem', padding: '0.2rem 0.6rem', fontWeight: 500,
                    alignSelf: 'flex-start'
                  }}>
                    {match_score}% match
                  </div>
                </div>

                <div style={{ fontFamily: 'var(--font-syne)', fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: '0.25rem' }}>
                  {job.title}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>
                  {(job as any).company?.company_name} · {job.location}
                </div>

                <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                  {match_reason}
                </p>

                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  {job.required_skills.slice(0, 4).map(skill => (
                    <span key={skill} style={{
                      background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)',
                      borderRadius: '6px', fontSize: '0.7rem', padding: '0.2rem 0.5rem', color: '#cbd5e1'
                    }}>{skill}</span>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--accent)', fontWeight: 500 }}>
                    {job.salary_range || 'Salary not listed'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'capitalize' }}>
                    {job.job_type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
