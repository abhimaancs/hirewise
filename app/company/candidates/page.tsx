'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'
import { CandidateProfile, Job, JobMatch } from '@/types'
import { Loader2, MessageSquare, Star, MapPin, Briefcase, ChevronDown } from 'lucide-react'

function CandidatesContent() {
  const supabase = createClient()
  const searchParams = useSearchParams()
  const jobId = searchParams.get('job')

  const [jobs, setJobs] = useState<Job[]>([])
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [matches, setMatches] = useState<JobMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [matching, setMatching] = useState(false)
  const [startingChat, setStartingChat] = useState<string | null>(null)

  useEffect(() => { loadJobs() }, [])
  useEffect(() => { if (selectedJob) matchCandidates(selectedJob) }, [selectedJob])

  const loadJobs = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase.from('jobs').select('*')
      .eq('company_id', user.id).eq('is_active', true).order('created_at', { ascending: false })

    setJobs(data || [])

    // Auto-select job from query param or first job
    const target = data?.find(j => j.id === jobId) || data?.[0]
    if (target) setSelectedJob(target)
    else setLoading(false)
  }

  const matchCandidates = async (job: Job) => {
    setMatching(true)
    setMatches([])
    try {
      // Fetch all candidates
      const { data: profiles } = await supabase.from('profiles').select('*').eq('role', 'candidate')
      const { data: candidateDetails } = await supabase.from('candidate_profiles').select('*')

      if (!profiles?.length) { setMatching(false); setLoading(false); return }

      const candidates: CandidateProfile[] = profiles.map(p => ({
        ...p,
        ...(candidateDetails?.find(c => c.id === p.id) || {})
      }))

      // AI match
      const res = await fetch('/api/match-candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job, candidates })
      })
      const { matches: aiMatches } = await res.json()
      setMatches(aiMatches || [])
    } catch (err) {
      console.error(err)
    } finally {
      setMatching(false)
      setLoading(false)
    }
  }

  const startChat = async (candidateId: string) => {
    setStartingChat(candidateId)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Create or find existing conversation
    const { data: existing } = await supabase.from('conversations')
      .select('id').eq('candidate_id', candidateId).eq('company_id', user.id)
      .eq('job_id', selectedJob?.id).single()

    let convId = existing?.id
    if (!convId) {
      const { data: newConv } = await supabase.from('conversations').insert({
        candidate_id: candidateId, company_id: user.id, job_id: selectedJob?.id
      }).select('id').single()
      convId = newConv?.id
    }

    window.location.href = `/chat/${convId}`
    setStartingChat(null)
  }

  const scoreColor = (score: number) =>
    score >= 85 ? '#10b981' : score >= 70 ? '#4f8ef7' : '#6b7280'

  const scoreBg = (score: number) =>
    score >= 85 ? 'rgba(16,185,129,0.12)' : score >= 70 ? 'rgba(79,142,247,0.12)' : 'rgba(107,114,128,0.12)'

  return (
    <>
      <Navbar userRole="company" />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--font-syne)', fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>
            AI-Ranked Candidates
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
            Select a job to see candidates ranked by AI match score
          </p>
        </div>

        {/* Job selector */}
        {jobs.length > 0 && (
          <div style={{ position: 'relative', marginBottom: '1.5rem', maxWidth: '400px' }}>
            <select
              value={selectedJob?.id || ''}
              onChange={e => {
                const job = jobs.find(j => j.id === e.target.value)
                if (job) setSelectedJob(job)
              }}
              style={{ paddingRight: '2.5rem', appearance: 'none', cursor: 'pointer' }}
            >
              {jobs.map(job => (
                <option key={job.id} value={job.id}>{job.title} — {job.location}</option>
              ))}
            </select>
            <ChevronDown size={16} style={{
              position: 'absolute', right: '0.75rem', top: '50%',
              transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none'
            }} />
          </div>
        )}

        {/* AI matching banner */}
        {matching && (
          <div style={{
            background: 'rgba(79,142,247,0.08)', border: '1px solid rgba(79,142,247,0.2)',
            borderRadius: '14px', padding: '1.25rem 1.5rem', marginBottom: '1.5rem',
            display: 'flex', alignItems: 'center', gap: '1rem'
          }}>
            <Loader2 size={18} color="var(--accent)" style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }} />
            <div>
              <strong style={{ display: 'block', fontSize: '0.875rem', color: '#fff' }}>
                AI is ranking candidates for "{selectedJob?.title}"
              </strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                Analyzing skills, experience, and fit...
              </span>
            </div>
          </div>
        )}

        {/* Results */}
        {loading || matching ? null : matches.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
            <Briefcase size={40} style={{ marginBottom: '1rem', opacity: 0.4 }} />
            <p style={{ marginBottom: '0.5rem' }}>No candidates found yet.</p>
            <p style={{ fontSize: '0.8rem' }}>Candidates will appear here once they sign up and add skills.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {matches.map(({ job, match_score, match_reason }, i) => {
              const candidate = job as any as CandidateProfile
              return (
                <div key={candidate.id} style={{
                  background: 'var(--card)', border: '1px solid var(--border)',
                  borderRadius: '16px', padding: '1.5rem',
                  display: 'flex', alignItems: 'flex-start', gap: '1.25rem'
                }}>
                  {/* Rank */}
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    background: i === 0 ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.06)',
                    border: `1px solid ${i === 0 ? 'rgba(245,158,11,0.3)' : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700,
                    color: i === 0 ? '#fbbf24' : 'var(--muted)'
                  }}>
                    {i === 0 ? <Star size={14} fill="#fbbf24" color="#fbbf24" /> : `#${i + 1}`}
                  </div>

                  {/* Avatar */}
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
                    background: `linear-gradient(135deg, var(--accent), var(--accent2))`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1rem', color: '#fff'
                  }}>
                    {candidate.name?.[0]?.toUpperCase() || '?'}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
                      <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, color: '#fff' }}>
                        {candidate.name}
                      </span>
                      <div style={{
                        background: scoreBg(match_score),
                        color: scoreColor(match_score),
                        border: `1px solid ${scoreColor(match_score)}40`,
                        borderRadius: '999px', fontSize: '0.7rem',
                        padding: '0.2rem 0.6rem', fontWeight: 600
                      }}>
                        {match_score}% match
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                      {candidate.college && <span>🎓 {candidate.college}</span>}
                      {candidate.location && <span><MapPin size={12} style={{ display: 'inline' }} /> {candidate.location}</span>}
                      {candidate.experience_years !== undefined && (
                        <span>💼 {candidate.experience_years === 0 ? 'Fresher' : `${candidate.experience_years}y exp`}</span>
                      )}
                    </div>

                    {/* Match reason */}
                    <p style={{
                      fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.6,
                      background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
                      borderRadius: '8px', padding: '0.6rem 0.875rem', marginBottom: '0.75rem'
                    }}>
                      ✦ {match_reason}
                    </p>

                    {/* Skills */}
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {candidate.skills?.slice(0, 6).map((skill: string) => (
                        <span key={skill} style={{
                          background: 'rgba(79,142,247,0.08)', border: '1px solid rgba(79,142,247,0.2)',
                          color: 'var(--accent)', borderRadius: '999px',
                          fontSize: '0.7rem', padding: '0.2rem 0.6rem'
                        }}>{skill}</span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button
                      onClick={() => startChat(candidate.id)}
                      disabled={startingChat === candidate.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '0.5rem 1rem', background: 'var(--accent)',
                        border: 'none', borderRadius: '8px', color: '#fff',
                        fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'var(--font-dm)',
                        whiteSpace: 'nowrap'
                      }}>
                      {startingChat === candidate.id
                        ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />
                        : <MessageSquare size={13} />}
                      Message
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

export default function CandidatesPage() {
  return <Suspense><CandidatesContent /></Suspense>
}
