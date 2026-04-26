'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'
import { Job } from '@/types'
import { Plus, Loader2, Briefcase, Users, X } from 'lucide-react'

export default function CompanyJobsPage() {
  const supabase = createClient()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [posting, setPosting] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', location: '',
    salary_range: '', job_type: 'full-time', skills: ''
  })

  useEffect(() => { loadJobs() }, [])

  const loadJobs = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('jobs').select('*').eq('company_id', user.id).order('created_at', { ascending: false })
    setJobs(data || [])
    setLoading(false)
  }

  const handlePost = async () => {
    setPosting(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from('jobs').insert({
      company_id: user.id,
      title: form.title,
      description: form.description,
      location: form.location,
      salary_range: form.salary_range,
      job_type: form.job_type,
      required_skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      is_active: true
    })

    if (!error) {
      setShowForm(false)
      setForm({ title: '', description: '', location: '', salary_range: '', job_type: 'full-time', skills: '' })
      loadJobs()
    }
    setPosting(false)
  }

  const toggleJob = async (job: Job) => {
    await supabase.from('jobs').update({ is_active: !job.is_active }).eq('id', job.id)
    loadJobs()
  }

  const s = {
    label: { display: 'block', fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.4rem' } as React.CSSProperties,
    group: { marginBottom: '1rem' } as React.CSSProperties,
  }

  return (
    <>
      <Navbar userRole="company" />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-syne)', fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>My Job Posts</h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>AI will match candidates to your jobs automatically</p>
          </div>
          <button onClick={() => setShowForm(true)} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '0.625rem 1.25rem', background: 'var(--accent)',
            border: 'none', borderRadius: '8px', color: '#fff',
            fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'var(--font-dm)'
          }}>
            <Plus size={16} /> Post a job
          </button>
        </div>

        {/* Post job form */}
        {showForm && (
          <div style={{
            background: 'var(--card)', border: '1px solid rgba(79,142,247,0.3)',
            borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, color: '#fff' }}>New job post</span>
              <X size={18} style={{ cursor: 'pointer', color: 'var(--muted)' }} onClick={() => setShowForm(false)} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div style={s.group}>
                <label style={s.label}>Job title</label>
                <input placeholder="e.g. Frontend Engineer" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div style={s.group}>
                <label style={s.label}>Location</label>
                <input placeholder="Bangalore / Remote" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
              </div>
              <div style={s.group}>
                <label style={s.label}>Salary range</label>
                <input placeholder="e.g. ₹12–18 LPA" value={form.salary_range} onChange={e => setForm({ ...form, salary_range: e.target.value })} />
              </div>
              <div style={s.group}>
                <label style={s.label}>Job type</label>
                <select value={form.job_type} onChange={e => setForm({ ...form, job_type: e.target.value })}>
                  <option value="full-time">Full-time</option>
                  <option value="internship">Internship</option>
                  <option value="remote">Remote</option>
                  <option value="part-time">Part-time</option>
                </select>
              </div>
            </div>

            <div style={s.group}>
              <label style={s.label}>Required skills (comma separated)</label>
              <input placeholder="React, TypeScript, Node.js" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} />
            </div>

            <div style={s.group}>
              <label style={s.label}>Job description</label>
              <textarea rows={4} placeholder="Describe the role, responsibilities, and what you're looking for..." 
                value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                style={{ resize: 'vertical' }} />
            </div>

            <button onClick={handlePost} disabled={posting || !form.title} style={{
              width: '100%', padding: '0.75rem', background: 'var(--accent)',
              border: 'none', borderRadius: '8px', color: '#fff',
              fontSize: '0.9rem', cursor: posting ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-dm)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '8px', opacity: posting ? 0.7 : 1
            }}>
              {posting && <Loader2 size={16} />}
              {posting ? 'Posting...' : 'Post job + AI will find matches'}
            </button>
          </div>
        )}

        {/* Job list */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
            <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : jobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
            <Briefcase size={40} style={{ marginBottom: '1rem', opacity: 0.4 }} />
            <p>No jobs yet. Post your first job to start finding candidates.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {jobs.map(job => (
              <div key={job.id} style={{
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: '14px', padding: '1.25rem',
                display: 'flex', alignItems: 'center', gap: '1.25rem'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                    <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, color: '#fff' }}>{job.title}</span>
                    <span style={{
                      background: job.is_active ? 'rgba(16,185,129,0.15)' : 'rgba(107,114,128,0.15)',
                      color: job.is_active ? 'var(--green)' : 'var(--muted)',
                      border: `1px solid ${job.is_active ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`,
                      borderRadius: '999px', fontSize: '0.7rem', padding: '0.15rem 0.6rem'
                    }}>
                      {job.is_active ? 'Active' : 'Paused'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                    {job.location} · {job.job_type} {job.salary_range ? `· ${job.salary_range}` : ''}
                  </div>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    {job.required_skills?.slice(0, 5).map(s => (
                      <span key={s} style={{
                        background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)',
                        borderRadius: '6px', fontSize: '0.7rem', padding: '0.15rem 0.45rem', color: '#cbd5e1'
                      }}>{s}</span>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <a href={`/company/candidates?job=${job.id}`}>
                    <button style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '0.5rem 1rem', background: 'rgba(79,142,247,0.1)',
                      border: '1px solid rgba(79,142,247,0.25)', borderRadius: '8px',
                      color: 'var(--accent)', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'var(--font-dm)'
                    }}>
                      <Users size={14} /> View candidates
                    </button>
                  </a>
                  <button onClick={() => toggleJob(job)} style={{
                    padding: '0.5rem 1rem', background: 'var(--card)',
                    border: '1px solid var(--border)', borderRadius: '8px',
                    color: 'var(--muted)', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'var(--font-dm)'
                  }}>
                    {job.is_active ? 'Pause' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
