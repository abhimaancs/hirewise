'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'
import { Loader2, Briefcase, MessageSquare, CheckCircle, Clock, XCircle, X } from 'lucide-react'

export default function ApplicationsPage() {
  const supabase = createClient()
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'applied' | 'shortlisted' | 'rejected'>('all')
  const [userId, setUserId] = useState<string | null>(null)
  const [startingChat, setStartingChat] = useState<string | null>(null)

  // appId that is pending withdraw confirmation
  const [confirmWithdraw, setConfirmWithdraw] = useState<string | null>(null)
  const [withdrawing, setWithdrawing] = useState<string | null>(null)

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
      const { data: apps } = await supabase
        .from('applications')
        .select('*')
        .eq('candidate_id', uid)
        .order('applied_at', { ascending: false })
      if (!apps?.length) { setLoading(false); return }
      const enriched = await Promise.all(apps.map(async (app: any) => {
        const { data: job } = await supabase.from('jobs').select('*').eq('id', app.job_id).single()
        const { data: company } = job
          ? await supabase.from('profiles').select('name').eq('id', job.company_id).single()
          : { data: null }
        return { ...app, job: job || null, company: company || null }
      }))
      setApplications(enriched)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleWithdraw = async (appId: string, jobId: string) => {
    if (!userId) return
    setWithdrawing(appId)
    setConfirmWithdraw(null)
    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', appId)
        .eq('candidate_id', userId)
        .eq('status', 'applied') // safety guard: only delete pending applications
      if (error) throw error
      // Remove from local state so UI updates instantly
      setApplications(prev => prev.filter(a => a.id !== appId))
    } catch (err: any) {
      alert('Failed to withdraw: ' + (err?.message || 'Please try again'))
    } finally {
      setWithdrawing(null)
    }
  }

  const startChat = async (companyId: string, jobId: string) => {
    if (!userId) return
    setStartingChat(companyId)
    try {
      const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .eq('candidate_id', userId)
        .eq('company_id', companyId)
        .maybeSingle()
      let convId = existing?.id
      if (!convId) {
        const { data: newConv } = await supabase
          .from('conversations')
          .insert({ candidate_id: userId, company_id: companyId, job_id: jobId })
          .select('id')
          .single()
        convId = newConv?.id
      }
      window.location.href = `/chat/${convId}`
    } catch (err) { console.error(err) }
    finally { setStartingChat(null) }
  }

  const filtered = applications.filter(a => filter === 'all' || a.status === filter)

  const statusConfig: any = {
    applied: { icon: <Clock size={12} />, bg: 'rgba(99,102,241,0.12)', color: '#818cf8', border: 'rgba(99,102,241,0.25)', label: 'Applied' },
    shortlisted: { icon: <CheckCircle size={12} />, bg: 'rgba(16,185,129,0.12)', color: '#34d399', border: 'rgba(16,185,129,0.25)', label: 'Shortlisted' },
    rejected: { icon: <XCircle size={12} />, bg: 'rgba(239,68,68,0.12)', color: '#f87171', border: 'rgba(239,68,68,0.25)', label: 'Rejected' },
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
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', marginBottom: 4 }}>My Applications</h1>
          <p style={{ fontSize: 13, color: '#6b7280' }}>Track the status of all your job applications</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: '1.5rem' }}>
          {[
            { label: 'Total', count: counts.all, color: '#818cf8' },
            { label: 'Applied', count: counts.applied, color: '#818cf8' },
            { label: 'Shortlisted', count: counts.shortlisted, color: '#34d399' },
            { label: 'Rejected', count: counts.rejected, color: '#f87171' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: s.color, marginBottom: 4, letterSpacing: '-1px' }}>{s.count}</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem' }}>
          {(['all', 'applied', 'shortlisted', 'rejected'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 14px', borderRadius: 20, border: '1px solid', borderColor: filter === f ? '#6366f1' : 'rgba(255,255,255,0.1)', background: filter === f ? '#6366f1' : 'transparent', color: filter === f ? '#fff' : '#9ca3af', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter,sans-serif', textTransform: 'capitalize' }}>
              {f}{f !== 'all' && ` (${counts[f]})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
            <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', marginBottom: 12 }} />
            <p style={{ fontSize: 14 }}>Loading your applications...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: '#6b7280' }}>
            <Briefcase size={44} style={{ marginBottom: 14, opacity: 0.2 }} />
            <p style={{ fontSize: 16, fontWeight: 700, color: '#e5e7eb', marginBottom: 6 }}>
              {filter === 'all' ? 'No applications yet' : `No ${filter} applications`}
            </p>
            <p style={{ fontSize: 13, marginBottom: '1.25rem' }}>
              {filter === 'all' ? 'Start applying to jobs to track them here' : `You have no ${filter} applications`}
            </p>
            {filter === 'all' && (
              <a href="/jobs" style={{ textDecoration: 'none' }}>
                <button style={{ padding: '9px 20px', background: '#6366f1', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>
                  Browse jobs →
                </button>
              </a>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map((app: any) => {
              const status = statusConfig[app.status]
              const canWithdraw = app.status === 'applied'
              const isWithdrawing = withdrawing === app.id
              const showConfirm = confirmWithdraw === app.id

              return (
                <div
                  key={app.id}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: 14, transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.3)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)' }}
                >
                  {/* Company initial */}
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#818cf8', fontSize: 16, flexShrink: 0 }}>
                    {app.job?.title[0] || '?'}
                  </div>

                  {/* Main content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 15, color: '#f1f1f1', letterSpacing: '-0.2px' }}>
                        {app.job?.title || 'Job no longer available'}
                      </span>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: status.bg, color: status.color, border: `1px solid ${status.border}`, borderRadius: 20, fontSize: 11, fontWeight: 700, padding: '2px 8px' }}>
                        {status.icon}{status.label}
                      </div>
                    </div>

                    <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>
                      {app.company?.name && `${app.company.name} · `}
                      {app.job?.location && `${app.job.location} · `}
                      {app.job?.job_type}
                      {app.job?.salary_range && ` · ${app.job.salary_range}`}
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
                      {app.job?.required_skills?.slice(0, 4).map((s: string) => (
                        <span key={s} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#9ca3af', borderRadius: 7, fontSize: 11, padding: '2px 7px' }}>{s}</span>
                      ))}
                    </div>

                    <div style={{ fontSize: 12, color: '#4b5563' }}>
                      Applied {new Date(app.applied_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>

                    {app.status === 'shortlisted' && (
                      <div style={{ marginTop: 10, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#34d399', fontWeight: 500 }}>
                        🎉 You've been shortlisted! The company may reach out soon.
                      </div>
                    )}
                    {app.status === 'rejected' && (
                      <div style={{ marginTop: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#f87171' }}>
                        This application was not selected. Keep applying!
                      </div>
                    )}

                    {/* Inline withdraw confirmation — shown below content */}
                    {showConfirm && (
                      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 9, padding: '8px 12px' }}>
                        <span style={{ fontSize: 12, color: '#f87171', fontWeight: 600, flex: 1 }}>
                          Withdraw this application? You can reapply later.
                        </span>
                        <button
                          onClick={() => handleWithdraw(app.id, app.job_id)}
                          style={{ fontSize: 12, fontWeight: 700, color: '#f87171', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 7, padding: '4px 12px', cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}
                        >
                          Withdraw
                        </button>
                        <button
                          onClick={() => setConfirmWithdraw(null)}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer', padding: 4 }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Right-side action buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                    {/* Message button — not shown for rejected */}
                    {app.job && app.status !== 'rejected' && (
                      <button
                        onClick={() => startChat(app.job.company_id, app.job_id)}
                        disabled={startingChat === app.job.company_id}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: '#6366f1', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}
                      >
                        {startingChat === app.job.company_id
                          ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />
                          : <MessageSquare size={12} />}
                        Message
                      </button>
                    )}

                    {/* Withdraw button — only for pending applications */}
                    {canWithdraw && !showConfirm && (
                      <button
                        onClick={() => setConfirmWithdraw(app.id)}
                        disabled={isWithdrawing}
                        style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: '#f87171', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}
                      >
                        {isWithdrawing
                          ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />
                          : <X size={12} />}
                        Withdraw
                      </button>
                    )}
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
