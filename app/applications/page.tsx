'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'
import { Loader2, Briefcase, MessageSquare, CheckCircle, Clock, XCircle } from 'lucide-react'

interface Application {
  id: string
  job_id: string
  status: 'applied' | 'shortlisted' | 'rejected'
  applied_at: string
  job: {
    id: string
    title: string
    location: string
    job_type: string
    salary_range: string
    required_skills: string[]
    company_id: string
  } | null
  company: { name: string } | null
}

export default function ApplicationsPage() {
  const supabase = createClient()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'applied' | 'shortlisted' | 'rejected'>('all')
  const [userId, setUserId] = useState<string | null>(null)
  const [startingChat, setStartingChat] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { window.location.href = '/login'; return }
      setUserId(session.user.id)
      loadApplications(session.user.id)
    }
    checkAuth()
  }, [])

  const loadApplications = async (uid: string) => {
    try {
      const { data: apps, error } = await supabase
        .from('applications')
        .select('*')
        .eq('candidate_id', uid)
        .order('applied_at', { ascending: false })

      if (error) throw error
      if (!apps?.length) { setLoading(false); return }

      // Get job details for each application
      const enriched = await Promise.all(
        apps.map(async (app: any) => {
          const { data: job } = await supabase.from('jobs').select('*').eq('id', app.job_id).single()
          const { data: company } = job
            ? await supabase.from('profiles').select('name').eq('id', job.company_id).single()
            : { data: null }
          return { ...app, job: job || null, company: company || null }
        })
      )
      setApplications(enriched)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const startChat = async (companyId: string, jobId: string) => {
    if (!userId) return
    setStartingChat(companyId)
    try {
      const { data: existing } = await supabase.from('conversations')
        .select('id').eq('candidate_id', userId).eq('company_id', companyId).maybeSingle()
      let convId = existing?.id
      if (!convId) {
        const { data: newConv } = await supabase.from('conversations').insert({
          candidate_id: userId, company_id: companyId, job_id: jobId
        }).select('id').single()
        convId = newConv?.id
      }
      window.location.href = `/chat/${convId}`
    } catch (err) {
      console.error(err)
    } finally {
      setStartingChat(null)
    }
  }

  const filtered = applications.filter(a => filter === 'all' || a.status === filter)

  const statusConfig = {
    applied: { icon: <Clock size={13} />, bg: '#eff6ff', color: '#3b82f6', border: '#bfdbfe', label: 'Applied' },
    shortlisted: { icon: <CheckCircle size={13} />, bg: '#ecfdf5', color: '#059669', border: '#a7f3d0', label: 'Shortlisted' },
    rejected: { icon: <XCircle size={13} />, bg: '#fef2f2', color: '#dc2626', border: '#fecaca', label: 'Rejected' },
  }

  const counts = {
    all: applications.length,
    applied: applications.filter(a => a.status === 'applied').length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  }

  return (
    <>
      <Navbar userRole="candidate" />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>My Applications</h1>
          <p style={{ fontSize: 13, color: '#888' }}>Track the status of all your job applications</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: '1.5rem' }}>
          {[
            { label: 'Total', count: counts.all, color: '#6366f1', bg: '#eef2ff' },
            { label: 'Applied', count: counts.applied, color: '#3b82f6', bg: '#eff6ff' },
            { label: 'Shortlisted', count: counts.shortlisted, color: '#059669', bg: '#ecfdf5' },
            { label: 'Rejected', count: counts.rejected, color: '#dc2626', bg: '#fef2f2' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: s.color, marginBottom: 4 }}>{s.count}</div>
              <div style={{ fontSize: 12, color: '#888' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem' }}>
          {(['all', 'applied', 'shortlisted', 'rejected'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '6px 14px', borderRadius: 20, border: '1px solid',
              borderColor: filter === f ? '#6366f1' : '#e8e8e8',
              background: filter === f ? '#6366f1' : '#fff',
              color: filter === f ? '#fff' : '#888',
              fontSize: 12, fontWeight: 500, cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', textTransform: 'capitalize'
            }}>
              {f} {f !== 'all' && `(${counts[f]})`}
            </button>
          ))}
        </div>

        {/* Applications list */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
            <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', marginBottom: 12 }} />
            <p style={{ fontSize: 14 }}>Loading your applications...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
            <Briefcase size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
            <p style={{ fontSize: 15, fontWeight: 500, color: '#1a1a1a', marginBottom: 6 }}>
              {filter === 'all' ? 'No applications yet' : `No ${filter} applications`}
            </p>
            <p style={{ fontSize: 13, marginBottom: '1rem' }}>
              {filter === 'all' ? 'Start applying to jobs to track them here' : `You have no ${filter} applications`}
            </p>
            {filter === 'all' && (
              <a href="/jobs" style={{ textDecoration: 'none' }}>
                <button style={{ padding: '9px 20px', background: '#6366f1', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                  Browse jobs →
                </button>
              </a>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map(app => {
              const status = statusConfig[app.status]
              return (
                <div key={app.id} style={{
                  background: '#fff', border: '1px solid #e8e8e8',
                  borderRadius: 14, padding: '1.25rem',
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                  transition: 'all 0.2s'
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#c7d2fe'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#e8e8e8'}
                >
                  {/* Company initial */}
                  <div style={{
                    width: 44, height: 44, borderRadius: 10, background: '#eef2ff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, color: '#6366f1', fontSize: 16, flexShrink: 0
                  }}>
                    {app.job?.title[0] || '?'}
                  </div>

                  {/* Job details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, fontSize: 15, color: '#1a1a1a' }}>
                        {app.job?.title || 'Job no longer available'}
                      </span>
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        background: status.bg, color: status.color,
                        border: `1px solid ${status.border}`,
                        borderRadius: 20, fontSize: 11, fontWeight: 600, padding: '2px 8px'
                      }}>
                        {status.icon} {status.label}
                      </div>
                    </div>

                    <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
                      {app.company?.name && `${app.company.name} · `}
                      {app.job?.location && `${app.job.location} · `}
                      {app.job?.job_type && `${app.job.job_type}`}
                      {app.job?.salary_range && ` · ${app.job.salary_range}`}
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
                      {app.job?.required_skills?.slice(0, 4).map(s => (
                        <span key={s} style={{ background: '#f3f4f6', color: '#6b7280', borderRadius: 6, fontSize: 11, padding: '2px 7px' }}>{s}</span>
                      ))}
                    </div>

                    <div style={{ fontSize: 12, color: '#aaa' }}>
                      Applied {new Date(app.applied_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>

                    {/* Shortlisted message */}
                    {app.status === 'shortlisted' && (
                      <div style={{ marginTop: 10, background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#059669', fontWeight: 500 }}>
                        🎉 You've been shortlisted! The company may reach out soon.
                      </div>
                    )}

                    {/* Rejected message */}
                    {app.status === 'rejected' && (
                      <div style={{ marginTop: 10, background: '#fef9f9', border: '1px solid #fecaca', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#dc2626' }}>
                        This application was not selected. Keep applying!
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {app.job && app.status !== 'rejected' && (
                    <button
                      onClick={() => startChat(app.job!.company_id, app.job_id)}
                      disabled={startingChat === app.job.company_id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '7px 14px', background: '#6366f1',
                        border: 'none', borderRadius: 8, color: '#fff',
                        fontSize: 12, fontWeight: 500, cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif', flexShrink: 0
                      }}>
                      {startingChat === app.job.company_id
                        ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />
                        : <MessageSquare size={12} />}
                      Message
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
