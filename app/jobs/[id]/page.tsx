'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'
import { Job, CandidateProfile } from '@/types'
import {
    Loader2, ArrowLeft, MapPin, Briefcase, DollarSign,
    Calendar, CheckCircle, X, Zap, Users
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Helpers — identical colour/score utilities used in jobs/page.tsx
// ---------------------------------------------------------------------------
const scoreColor = (s: number) => s >= 85 ? '#34d399' : s >= 70 ? '#818cf8' : '#9ca3af'
const scoreBg = (s: number) => s >= 85 ? 'rgba(16,185,129,0.15)' : s >= 70 ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.06)'
const scoreBorder = (s: number) => s >= 85 ? 'rgba(16,185,129,0.3)' : s >= 70 ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.1)'

const JOB_TYPE_LABEL: Record<string, string> = {
    'full-time': 'Full-time',
    'part-time': 'Part-time',
    'internship': 'Internship',
    'remote': 'Remote',
}

// ---------------------------------------------------------------------------

export default function JobDetailPage() {
    const params = useParams()
    const router = useRouter()
    const jobId = params?.id as string
    const supabase = createClient()

    // Data
    const [job, setJob] = useState<Job | null>(null)
    const [company, setCompany] = useState<any>(null)
    const [profile, setProfile] = useState<CandidateProfile | null>(null)
    const [userId, setUserId] = useState<string | null>(null)

    // Loading states
    const [pageLoading, setPageLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)

    // AI match (fetched on-demand — may be null if not loaded yet)
    const [matchScore, setMatchScore] = useState<number | null>(null)
    const [matchReason, setMatchReason] = useState<string | null>(null)
    const [matchedSkills, setMatchedSkills] = useState<string[]>([])
    const [loadingMatch, setLoadingMatch] = useState(false)

    // Application state
    const [appStatus, setAppStatus] = useState<string | null>(null) // 'applied'|'shortlisted'|'rejected'|null
    const [applying, setApplying] = useState(false)
    const [withdrawing, setWithdrawing] = useState(false)
    const [confirmWithdraw, setConfirmWithdraw] = useState(false)

    // ---------------------------------------------------------------------------
    // Load everything on mount
    // ---------------------------------------------------------------------------
    useEffect(() => {
        if (jobId) load()
    }, [jobId])

    const load = async () => {
        try {
            // Auth
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) { window.location.href = '/login'; return }
            setUserId(session.user.id)

            // Fetch job
            const { data: jobData, error: jobErr } = await supabase
                .from('jobs')
                .select('*')
                .eq('id', jobId)
                .single()

            if (jobErr || !jobData) { setNotFound(true); setPageLoading(false); return }
            setJob(jobData)

            // Fetch company name
            const { data: companyData } = await supabase
                .from('profiles')
                .select('name, email')
                .eq('id', jobData.company_id)
                .single()
            setCompany(companyData)

            // Candidate profile
            const { data: p } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
            const { data: c } = await supabase.from('candidate_profiles').select('*').eq('id', session.user.id).single()
            const candidate = { ...p, ...c } as CandidateProfile
            setProfile(candidate)

            // Existing application status
            const { data: appData } = await supabase
                .from('applications')
                .select('status')
                .eq('candidate_id', session.user.id)
                .eq('job_id', jobId)
                .maybeSingle()
            if (appData) setAppStatus(appData.status)

            setPageLoading(false)

            // Compute AI match in the background (non-blocking)
            if (candidate?.skills?.length) {
                fetchMatch(candidate, jobData)
            }
        } catch (err) {
            console.error(err)
            setPageLoading(false)
        }
    }

    // Run the existing match-jobs API for just this one job
    const fetchMatch = async (candidate: CandidateProfile, jobData: Job) => {
        setLoadingMatch(true)
        try {
            const res = await fetch('/api/match-jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ candidate, jobs: [jobData] })
            })
            const { matches } = await res.json()
            if (matches?.[0]) {
                setMatchScore(matches[0].match_score)
                setMatchReason(matches[0].match_reason)
                // Derive which candidate skills appear in the job's required skills
                const matched = candidate.skills?.filter(s =>
                    jobData.required_skills?.map(r => r.toLowerCase()).includes(s.toLowerCase())
                ) || []
                setMatchedSkills(matched)
            }
        } catch (err) {
            console.error('match fetch failed:', err)
        } finally {
            setLoadingMatch(false)
        }
    }

    // ---------------------------------------------------------------------------
    // Apply
    // ---------------------------------------------------------------------------
    const handleApply = async () => {
        if (!userId || appStatus) return
        setApplying(true)
        try {
            const { error } = await supabase
                .from('applications')
                .insert({ candidate_id: userId, job_id: jobId, status: 'applied' })
            if (error && error.code !== '23505') throw error
            setAppStatus('applied')
        } catch (err: any) {
            alert('Failed to apply: ' + (err?.message || 'Please try again'))
        } finally {
            setApplying(false)
        }
    }

    // ---------------------------------------------------------------------------
    // Withdraw
    // ---------------------------------------------------------------------------
    const handleWithdraw = async () => {
        if (!userId) return
        setWithdrawing(true)
        setConfirmWithdraw(false)
        try {
            const { error } = await supabase
                .from('applications')
                .delete()
                .eq('candidate_id', userId)
                .eq('job_id', jobId)
                .eq('status', 'applied')
            if (error) throw error
            setAppStatus(null)
        } catch (err: any) {
            alert('Failed to withdraw: ' + (err?.message || 'Please try again'))
        } finally {
            setWithdrawing(false)
        }
    }

    // ---------------------------------------------------------------------------
    // Shared styling constants
    // ---------------------------------------------------------------------------
    const card = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16 }
    const label = { fontSize: 11, fontWeight: 700 as const, color: '#6b7280', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }
    const colors: Record<string, string> = { G: '#4285f4', R: '#2563eb', S: '#f97316', Z: '#8b5cf6', T: '#059669', F: '#dc2626', A: '#d97706', M: '#0891b2' }

    // ---------------------------------------------------------------------------
    // Render: Loading
    // ---------------------------------------------------------------------------
    if (pageLoading) return (
        <>
            <Navbar userRole="candidate" />
            <div style={{ textAlign: 'center', padding: '6rem', color: '#6b7280' }}>
                <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', marginBottom: 16 }} />
                <p style={{ fontSize: 14 }}>Loading job details...</p>
            </div>
        </>
    )

    // ---------------------------------------------------------------------------
    // Render: Not found
    // ---------------------------------------------------------------------------
    if (notFound || !job) return (
        <>
            <Navbar userRole="candidate" />
            <div style={{ textAlign: 'center', padding: '6rem', color: '#6b7280' }}>
                <Briefcase size={48} style={{ marginBottom: 16, opacity: 0.2 }} />
                <p style={{ fontSize: 18, fontWeight: 700, color: '#e5e7eb', marginBottom: 8 }}>Job not found</p>
                <p style={{ fontSize: 13, marginBottom: '1.5rem' }}>This job may no longer be available.</p>
                <button
                    onClick={() => router.push('/jobs')}
                    style={{ padding: '9px 20px', background: '#6366f1', border: 'none', borderRadius: 9, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}
                >
                    ← Back to jobs
                </button>
            </div>
        </>
    )

    // ---------------------------------------------------------------------------
    // Derived values
    // ---------------------------------------------------------------------------
    const initial = job.title[0].toUpperCase()
    const accentColor = colors[initial] || '#6366f1'
    const canWithdraw = appStatus === 'applied'
    const postedDate = new Date(job.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

    // Status badge config
    const statusCfg: Record<string, { bg: string; color: string; border: string; label: string }> = {
        applied: { bg: 'rgba(99,102,241,0.15)', color: '#818cf8', border: 'rgba(99,102,241,0.3)', label: 'Applied' },
        shortlisted: { bg: 'rgba(16,185,129,0.15)', color: '#34d399', border: 'rgba(16,185,129,0.3)', label: 'Shortlisted 🎉' },
        rejected: { bg: 'rgba(239,68,68,0.12)', color: '#f87171', border: 'rgba(239,68,68,0.25)', label: 'Not selected' },
    }

    // ---------------------------------------------------------------------------
    // Render: Main
    // ---------------------------------------------------------------------------
    return (
        <>
            <Navbar userRole="candidate" />

            {/* Responsive styles */}
            <style>{`
                @media (max-width: 768px) {
                    .job-detail-grid { grid-template-columns: 1fr !important; }
                    .job-detail-sidebar { position: static !important; top: auto !important; }
                }
            `}</style>

            {/* Subtle background glow */}
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0 }}>
                <div style={{ position: 'absolute', top: '-5%', right: '5%', width: 600, height: 600, background: `radial-gradient(circle, ${accentColor}08 0%, transparent 70%)` }} />
            </div>

            <div style={{ maxWidth: 860, margin: '0 auto', padding: '2rem 1.5rem', position: 'relative', zIndex: 1 }}>

                {/* ── Back button ── */}
                <button
                    onClick={() => router.back()}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 9, color: '#9ca3af', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter,sans-serif', marginBottom: '1.5rem' }}
                >
                    <ArrowLeft size={14} /> Back
                </button>

                <div className="job-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16, alignItems: 'start' }}>

                    {/* ── LEFT COLUMN ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                        {/* Header card */}
                        <div style={{ ...card, padding: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: '1.25rem' }}>
                                {/* Company logo placeholder */}
                                <div style={{ width: 56, height: 56, borderRadius: 14, background: `${accentColor}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: accentColor, fontSize: 22, flexShrink: 0 }}>
                                    {initial}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f1f1f1', letterSpacing: '-0.5px', marginBottom: 4 }}>
                                        {job.title}
                                    </h1>
                                    <div style={{ fontSize: 14, color: '#9ca3af', fontWeight: 500 }}>
                                        {company?.name || 'Company'}
                                    </div>
                                </div>
                            </div>

                            {/* Meta pills row */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 20, fontSize: 12, color: '#9ca3af', padding: '5px 11px', fontWeight: 500 }}>
                                    <MapPin size={12} color="#6b7280" />{job.location}
                                </span>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 20, fontSize: 12, color: '#9ca3af', padding: '5px 11px', fontWeight: 500 }}>
                                    <Briefcase size={12} color="#6b7280" />{JOB_TYPE_LABEL[job.job_type] || job.job_type}
                                </span>
                                {job.salary_range && (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 20, fontSize: 12, color: '#818cf8', padding: '5px 11px', fontWeight: 700 }}>
                                        <DollarSign size={12} />{job.salary_range}
                                    </span>
                                )}
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 20, fontSize: 12, color: '#6b7280', padding: '5px 11px' }}>
                                    <Calendar size={12} />Posted {postedDate}
                                </span>
                            </div>
                        </div>

                        {/* Description card */}
                        <div style={{ ...card, padding: '1.5rem' }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f1f1', marginBottom: 12, letterSpacing: '-0.1px' }}>Job Description</div>
                            {job.description ? (
                                <div style={{ fontSize: 14, color: '#9ca3af', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                                    {job.description}
                                </div>
                            ) : (
                                <div style={{ fontSize: 13, color: '#4b5563', fontStyle: 'italic' }}>No description provided.</div>
                            )}
                        </div>

                        {/* Required skills card */}
                        <div style={{ ...card, padding: '1.5rem' }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f1f1', marginBottom: 12, letterSpacing: '-0.1px' }}>Required Skills</div>
                            {job.required_skills?.length ? (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                                    {job.required_skills.map(s => {
                                        const isMatched = matchedSkills.includes(s)
                                        return (
                                            <span
                                                key={s}
                                                style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: 4,
                                                    background: isMatched ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.05)',
                                                    border: `1px solid ${isMatched ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.09)'}`,
                                                    color: isMatched ? '#34d399' : '#9ca3af',
                                                    borderRadius: 8, fontSize: 12, padding: '5px 10px', fontWeight: isMatched ? 600 : 500
                                                }}
                                            >
                                                {isMatched && <CheckCircle size={11} />}
                                                {s}
                                            </span>
                                        )
                                    })}
                                </div>
                            ) : (
                                <div style={{ fontSize: 13, color: '#4b5563', fontStyle: 'italic' }}>No specific skills listed.</div>
                            )}
                            {matchedSkills.length > 0 && (
                                <div style={{ marginTop: 10, fontSize: 12, color: '#34d399' }}>
                                    ✓ You match {matchedSkills.length} of {job.required_skills?.length} required skills
                                </div>
                            )}
                        </div>

                    </div>

                    {/* ── RIGHT COLUMN ── */}
                    <div className="job-detail-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'sticky', top: '1.5rem' }}>

                        {/* Apply / status card */}
                        <div style={{ ...card, padding: '1.25rem' }}>
                            <div style={{ ...label, marginBottom: 12 }}>Application</div>

                            {/* Status badge when already applied */}
                            {appStatus && statusCfg[appStatus] && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: statusCfg[appStatus].bg, border: `1px solid ${statusCfg[appStatus].border}`, borderRadius: 10, padding: '9px 12px', marginBottom: 10 }}>
                                    <CheckCircle size={14} color={statusCfg[appStatus].color} />
                                    <span style={{ fontSize: 13, fontWeight: 700, color: statusCfg[appStatus].color }}>
                                        {statusCfg[appStatus].label}
                                    </span>
                                </div>
                            )}

                            {/* Shortlisted note */}
                            {appStatus === 'shortlisted' && (
                                <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 10, lineHeight: 1.5 }}>
                                    🎉 You've been shortlisted. The company may reach out soon.
                                </p>
                            )}

                            {/* Rejected note */}
                            {appStatus === 'rejected' && (
                                <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 10, lineHeight: 1.5 }}>
                                    This application was not selected. You can apply to other roles.
                                </p>
                            )}

                            {/* Withdraw confirmation */}
                            {confirmWithdraw && (
                                <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 9, padding: '10px 12px', marginBottom: 10 }}>
                                    <p style={{ fontSize: 12, color: '#f87171', fontWeight: 600, marginBottom: 8 }}>
                                        Withdraw this application? You can reapply later.
                                    </p>
                                    <div style={{ display: 'flex', gap: 7 }}>
                                        <button
                                            onClick={handleWithdraw}
                                            style={{ flex: 1, padding: '7px 0', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 7, color: '#f87171', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}
                                        >
                                            Yes, withdraw
                                        </button>
                                        <button
                                            onClick={() => setConfirmWithdraw(false)}
                                            style={{ flex: 1, padding: '7px 0', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: '#9ca3af', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Primary CTA — Apply */}
                            {!appStatus && (
                                <button
                                    onClick={handleApply}
                                    disabled={applying}
                                    style={{ width: '100%', padding: '11px 0', background: '#6366f1', border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 700, cursor: applying ? 'not-allowed' : 'pointer', fontFamily: 'Inter,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, opacity: applying ? 0.7 : 1 }}
                                >
                                    {applying
                                        ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />Applying...</>
                                        : 'Apply →'}
                                </button>
                            )}

                            {/* Withdraw button — only when status = applied */}
                            {canWithdraw && !confirmWithdraw && (
                                <button
                                    onClick={() => setConfirmWithdraw(true)}
                                    disabled={withdrawing}
                                    style={{ width: '100%', marginTop: 8, padding: '9px 0', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, color: '#f87171', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                                >
                                    {withdrawing
                                        ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />
                                        : <X size={13} />}
                                    Withdraw application
                                </button>
                            )}

                            {/* View all applications link */}
                            <a href="/applications" style={{ display: 'block', textAlign: 'center', marginTop: 12, fontSize: 12, color: '#6b7280', textDecoration: 'none' }}>
                                View all applications →
                            </a>
                        </div>

                        {/* AI match card */}
                        <div style={{ ...card, padding: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                                <Zap size={13} color="#818cf8" />
                                <div style={{ ...label }}>AI Match</div>
                            </div>

                            {loadingMatch ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#4b5563', fontSize: 12 }}>
                                    <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                                    Calculating match...
                                </div>
                            ) : matchScore !== null ? (
                                <>
                                    {/* Score ring / badge */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                        <div style={{ width: 52, height: 52, borderRadius: '50%', background: scoreBg(matchScore), border: `2px solid ${scoreBorder(matchScore)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <span style={{ fontSize: 14, fontWeight: 800, color: scoreColor(matchScore) }}>{matchScore}%</span>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: scoreColor(matchScore) }}>
                                                {matchScore >= 85 ? 'Strong match' : matchScore >= 70 ? 'Good match' : matchScore >= 50 ? 'Partial match' : 'Low match'}
                                            </div>
                                            <div style={{ fontSize: 11, color: '#4b5563' }}>based on your profile</div>
                                        </div>
                                    </div>

                                    {/* Reason */}
                                    {matchReason && (
                                        <div style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1.6, background: 'rgba(255,255,255,0.03)', borderRadius: 9, padding: '8px 10px', borderLeft: '2px solid rgba(99,102,241,0.4)', marginBottom: matchedSkills.length ? 10 : 0 }}>
                                            ✦ {matchReason}
                                        </div>
                                    )}

                                    {/* Matched skills */}
                                    {matchedSkills.length > 0 && (
                                        <div>
                                            <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 6, marginTop: 4 }}>Your matching skills</div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                                                {matchedSkills.map(s => (
                                                    <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: 3, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399', borderRadius: 7, fontSize: 11, padding: '3px 8px', fontWeight: 600 }}>
                                                        <CheckCircle size={9} />{s}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div style={{ fontSize: 12, color: '#4b5563', lineHeight: 1.6 }}>
                                    <a href="/profile" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>Add skills to your profile</a> to see your AI match score.
                                </div>
                            )}
                        </div>

                        {/* Job summary card */}
                        <div style={{ ...card, padding: '1.25rem' }}>
                            <div style={{ ...label, marginBottom: 12 }}>Job Summary</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Briefcase size={13} color="#4b5563" style={{ flexShrink: 0 }} />
                                    <span style={{ fontSize: 12, color: '#9ca3af' }}>{JOB_TYPE_LABEL[job.job_type] || job.job_type}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <MapPin size={13} color="#4b5563" style={{ flexShrink: 0 }} />
                                    <span style={{ fontSize: 12, color: '#9ca3af' }}>{job.location}</span>
                                </div>
                                {job.salary_range && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <DollarSign size={13} color="#4b5563" style={{ flexShrink: 0 }} />
                                        <span style={{ fontSize: 12, color: '#818cf8', fontWeight: 600 }}>{job.salary_range}</span>
                                    </div>
                                )}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Users size={13} color="#4b5563" style={{ flexShrink: 0 }} />
                                    <span style={{ fontSize: 12, color: '#9ca3af' }}>{company?.name || '—'}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Calendar size={13} color="#4b5563" style={{ flexShrink: 0 }} />
                                    <span style={{ fontSize: 12, color: '#9ca3af' }}>{postedDate}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}
