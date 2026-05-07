'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'
import { CandidateProfile, Job } from '@/types'
import { Loader2, MessageSquare, Star, ChevronDown, Users, Briefcase } from 'lucide-react'

function CandidatesContent() {
  const supabase = createClient()
  const searchParams = useSearchParams()
  const jobId = searchParams.get('job')

  const [jobs, setJobs] = useState<Job[]>([])
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [matches, setMatches] = useState<any[]>([])
  const [applicants, setApplicants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [matching, setMatching] = useState(false)
  const [tab, setTab] = useState<'ai' | 'applicants'>('applicants')
  const [startingChat, setStartingChat] = useState<string | null>(null)

  useEffect(() => { loadJobs() }, [])
  useEffect(() => { if (selectedJob) { loadApplicants(selectedJob.id); matchCandidates(selectedJob) } }, [selectedJob])

  const loadJobs = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { window.location.href = '/login'; return }
    const { data } = await supabase.from('jobs').select('*').eq('company_id', session.user.id).eq('is_active', true).order('created_at', { ascending: false })
    setJobs(data || [])
    const target = data?.find(j => j.id === jobId) || data?.[0]
    if (target) setSelectedJob(target)
    else setLoading(false)
  }

  const loadApplicants = async (jid: string) => {
    const { data } = await supabase.from('applications')
      .select('*, candidate:profiles(*), candidate_details:candidate_profiles(*)')
      .eq('job_id', jid)
      .order('applied_at', { ascending: false })
    setApplicants(data || [])
  }

  const matchCandidates = async (job: Job) => {
    setMatching(true); setMatches([])
    try {
      const { data: profiles } = await supabase.from('profiles').select('*').eq('role', 'candidate')
      const { data: candidateDetails } = await supabase.from('candidate_profiles').select('*')
      if (!profiles?.length) { setMatching(false); setLoading(false); return }
      const candidates: CandidateProfile[] = profiles.map(p => ({ ...p, ...(candidateDetails?.find(c => c.id === p.id) || {}) }))
      const res = await fetch('/api/match-candidates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ job, candidates }) })
      const { matches: aiMatches } = await res.json()
      setMatches(aiMatches || [])
    } catch (err) { console.error(err) }
    finally { setMatching(false); setLoading(false) }
  }

  const startChat = async (candidateId: string) => {
    setStartingChat(candidateId)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const { data: existing } = await supabase.from('conversations').select('id').eq('candidate_id', candidateId).eq('company_id', session.user.id).maybeSingle()
    let convId = existing?.id
    if (!convId) {
      const { data: newConv } = await supabase.from('conversations').insert({ candidate_id: candidateId, company_id: session.user.id, job_id: selectedJob?.id }).select('id').single()
      convId = newConv?.id
    }
    window.location.href = `/chat/${convId}`
    setStartingChat(null)
  }

  const updateStatus = async (appId: string, status: string) => {
    await supabase.from('applications').update({ status }).eq('id', appId)
    if (selectedJob) loadApplicants(selectedJob.id)
  }

  const scoreColor = (s: number) => s >= 85 ? '#059669' : s >= 70 ? '#6366f1' : '#888'
  const scoreBg = (s: number) => s >= 85 ? '#ecfdf5' : s >= 70 ? '#eef2ff' : '#f5f5f5'

  const statusColors: any = {
    applied: { bg: '#eff6ff', color: '#3b82f6', border: '#bfdbfe' },
    shortlisted: { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' },
    rejected: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' }
  }

  return (
    <>
      <Navbar userRole="company" />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>Candidates</h1>
            <p style={{ fontSize: 13, color: '#888' }}>View applicants and AI-ranked matches</p>
          </div>
          {jobs.length > 0 && (
            <div style={{ position: 'relative' }}>
              <select value={selectedJob?.id || ''} onChange={e => { const j = jobs.find(j => j.id === e.target.value); if (j) setSelectedJob(j) }}
                style={{ paddingRight: '2rem', appearance: 'none', cursor: 'pointer', minWidth: 200 }}>
                {jobs.map(job => <option key={job.id} value={job.id}>{job.title}</option>)}
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#888', pointerEvents: 'none' }} />
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, background: '#f5f5f5', borderRadius: 10, padding: 4, marginBottom: '1.5rem', width: 'fit-content' }}>
          {[
            { id: 'applicants', label: `Applicants (${applicants.length})`, icon: <Users size={14} /> },
            { id: 'ai', label: 'AI Ranked', icon: <Star size={14} /> }
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id as any)} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 8, border: 'none',
              background: tab === t.id ? '#fff' : 'transparent',
              color: tab === t.id ? '#1a1a1a' : '#888',
              fontSize: 13, fontWeight: tab === t.id ? 600 : 400,
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              boxShadow: tab === t.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
            }}>{t.icon}{t.label}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
            <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : tab === 'applicants' ? (
          applicants.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
              <Users size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
              <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>No applicants yet</p>
              <p style={{ fontSize: 13 }}>Candidates who apply will appear here</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {applicants.map(app => (
                <div key={app.id} style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 14, padding: '1.25rem', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, flexShrink: 0 }}>
                    {app.candidate?.name?.[0]?.toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, fontSize: 14, color: '#1a1a1a' }}>{app.candidate?.name}</span>
                      <span style={{ background: statusColors[app.status]?.bg, color: statusColors[app.status]?.color, border: `1px solid ${statusColors[app.status]?.border}`, borderRadius: 20, fontSize: 11, fontWeight: 600, padding: '2px 8px', textTransform: 'capitalize' }}>{app.status}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>
                      Applied {new Date(app.applied_at).toLocaleDateString()}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {app.candidate_details?.skills?.slice(0, 5).map((s: string) => (
                        <span key={s} style={{ background: '#f3f4f6', color: '#6b7280', borderRadius: 6, fontSize: 11, padding: '2px 6px' }}>{s}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                    <button onClick={() => startChat(app.candidate_id)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: '#6366f1', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                      {startingChat === app.candidate_id ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <MessageSquare size={12} />} Message
                    </button>
                    <select value={app.status} onChange={e => updateStatus(app.id, e.target.value)}
                      style={{ fontSize: 12, padding: '5px 8px', borderRadius: 8, cursor: 'pointer' }}>
                      <option value="applied">Applied</option>
                      <option value="shortlisted">Shortlist</option>
                      <option value="rejected">Reject</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          // AI Ranked tab
          matching ? (
            <div style={{ background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)', border: '1px solid #c7d2fe', borderRadius: 14, padding: '1.25rem', display: 'flex', alignItems: 'center', gap: 12 }}>
              <Loader2 size={18} color="#6366f1" style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: 14, color: '#6366f1', fontWeight: 500 }}>AI is ranking candidates...</span>
            </div>
          ) : matches.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
              <Briefcase size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
              <p style={{ fontSize: 15, fontWeight: 500 }}>No candidates found yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {matches.map(({ job: candidate, match_score, match_reason }: any, i: number) => (
                <div key={candidate.id} style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 14, padding: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: i === 0 ? '#fef3c7' : '#f5f5f5', border: `1px solid ${i === 0 ? '#fcd34d' : '#e8e8e8'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: i === 0 ? '#f59e0b' : '#888', flexShrink: 0 }}>
                    {i === 0 ? <Star size={13} fill="#f59e0b" color="#f59e0b" /> : `#${i + 1}`}
                  </div>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, flexShrink: 0 }}>
                    {candidate.name?.[0]?.toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, fontSize: 14, color: '#1a1a1a' }}>{candidate.name}</span>
                      <span style={{ background: scoreBg(match_score), color: scoreColor(match_score), borderRadius: 20, fontSize: 11, fontWeight: 600, padding: '2px 8px' }}>{match_score}%</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>
                      {candidate.college && `🎓 ${candidate.college} · `}
                      {candidate.experience_years === 0 ? '💼 Fresher' : `💼 ${candidate.experience_years}y exp`}
                    </div>
                    <p style={{ fontSize: 12, color: '#999', background: '#fafafa', borderRadius: 8, padding: '6px 10px', marginBottom: 8 }}>✦ {match_reason}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {candidate.skills?.slice(0, 5).map((s: string) => (
                        <span key={s} style={{ background: '#eef2ff', color: '#6366f1', border: '1px solid #c7d2fe', borderRadius: 20, fontSize: 11, padding: '2px 8px' }}>{s}</span>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => startChat(candidate.id)} disabled={startingChat === candidate.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: '#6366f1', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif', flexShrink: 0 }}>
                    {startingChat === candidate.id ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <MessageSquare size={12} />} Message
                  </button>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </>
  )
}

export default function CandidatesPage() {
  return <Suspense><CandidatesContent /></Suspense>
}
