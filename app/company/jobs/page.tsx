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
  const [form, setForm] = useState({ title:'', description:'', location:'', salary_range:'', job_type:'full-time', skills:'' })

  useEffect(() => {
    const checkAuth = async () => {
      const { data:{ session } } = await supabase.auth.getSession()
      if (!session) { window.location.href='/login'; return }
      loadJobs(session.user.id)
    }
    checkAuth()
  }, [])

  const loadJobs = async (uid: string) => {
    const { data } = await supabase.from('jobs').select('*').eq('company_id',uid).order('created_at',{ ascending:false })
    setJobs(data||[])
    setLoading(false)
  }

  const handlePost = async () => {
    if (!form.title||!form.description||!form.location) { alert('Please fill in title, description and location'); return }
    setPosting(true)
    const { data:{ session } } = await supabase.auth.getSession()
    if (!session) return
    await supabase.from('jobs').insert({ company_id:session.user.id, title:form.title, description:form.description, location:form.location, salary_range:form.salary_range, job_type:form.job_type, required_skills:form.skills.split(',').map(s=>s.trim()).filter(Boolean), is_active:true })
    setShowForm(false)
    setForm({ title:'', description:'', location:'', salary_range:'', job_type:'full-time', skills:'' })
    loadJobs(session.user.id)
    setPosting(false)
  }

  const toggleJob = async (job: Job) => {
    const { data:{ session } } = await supabase.auth.getSession()
    if (!session) return
    await supabase.from('jobs').update({ is_active:!job.is_active }).eq('id',job.id)
    loadJobs(session.user.id)
  }

  const lbl = { fontSize:11, fontWeight:700, color:'#6b7280', textTransform:'uppercase' as const, letterSpacing:'0.06em', marginBottom:6, display:'block' }

  return (
    <>
      <Navbar userRole="company"/>
      <div style={{ maxWidth:900, margin:'0 auto', padding:'2rem 1.5rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem' }}>
          <div>
            <h1 style={{ fontSize:22, fontWeight:800, color:'#fff', letterSpacing:'-0.5px', marginBottom:4 }}>My Job Posts</h1>
            <p style={{ fontSize:13, color:'#6b7280' }}>AI matches candidates to your jobs automatically</p>
          </div>
          <button onClick={()=>setShowForm(true)} style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 18px', background:'#6366f1', border:'none', borderRadius:9, color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'Inter,sans-serif', boxShadow:'0 0 20px rgba(99,102,241,0.25)' }}>
            <Plus size={15}/> Post a job
          </button>
        </div>

        {showForm && (
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(99,102,241,0.3)', borderRadius:18, padding:'1.5rem', marginBottom:'1.5rem' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem' }}>
              <span style={{ fontSize:15, fontWeight:700, color:'#f1f1f1' }}>New job post</span>
              <X size={18} style={{ cursor:'pointer', color:'#6b7280' }} onClick={()=>setShowForm(false)}/>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div style={{ marginBottom:12 }}><label style={lbl}>Job title *</label><input placeholder="e.g. Frontend Engineer" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
              <div style={{ marginBottom:12 }}><label style={lbl}>Location *</label><input placeholder="Bangalore / Remote" value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/></div>
              <div style={{ marginBottom:12 }}><label style={lbl}>Salary range</label><input placeholder="e.g. ₹12–18 LPA" value={form.salary_range} onChange={e=>setForm({...form,salary_range:e.target.value})}/></div>
              <div style={{ marginBottom:12 }}>
                <label style={lbl}>Job type</label>
                <select value={form.job_type} onChange={e=>setForm({...form,job_type:e.target.value})}>
                  <option value="full-time">Full-time</option>
                  <option value="internship">Internship</option>
                  <option value="remote">Remote</option>
                  <option value="part-time">Part-time</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom:12 }}><label style={lbl}>Required skills (comma separated)</label><input placeholder="React, TypeScript, Node.js" value={form.skills} onChange={e=>setForm({...form,skills:e.target.value})}/></div>
            <div style={{ marginBottom:14 }}><label style={lbl}>Job description *</label><textarea rows={4} placeholder="Describe the role, responsibilities, and requirements..." value={form.description} onChange={e=>setForm({...form,description:e.target.value})} style={{ resize:'vertical' }}/></div>
            <button onClick={handlePost} disabled={posting||!form.title} style={{ width:'100%', padding:11, background:'#6366f1', border:'none', borderRadius:9, color:'#fff', fontSize:14, fontWeight:700, cursor:posting?'not-allowed':'pointer', fontFamily:'Inter,sans-serif', display:'flex', alignItems:'center', justifyContent:'center', gap:8, opacity:posting?0.7:1 }}>
              {posting&&<Loader2 size={15} style={{ animation:'spin 1s linear infinite' }}/>}
              {posting?'Posting...':'Post job'}
            </button>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign:'center', padding:'3rem', color:'#6b7280' }}>
            <Loader2 size={24} style={{ animation:'spin 1s linear infinite' }}/>
          </div>
        ) : jobs.length===0 ? (
          <div style={{ textAlign:'center', padding:'4rem', color:'#6b7280' }}>
            <Briefcase size={40} style={{ marginBottom:12, opacity:0.2 }}/>
            <p style={{ fontSize:15, fontWeight:700, color:'#e5e7eb', marginBottom:6 }}>No jobs posted yet</p>
            <p style={{ fontSize:13 }}>Post your first job to start finding candidates</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {jobs.map(job => (
              <div key={job.id} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, padding:'1.25rem', display:'flex', alignItems:'center', gap:'1.25rem', transition:'all 0.2s' }}
                onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.borderColor='rgba(99,102,241,0.3)' }}
                onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.07)' }}
              >
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                    <span style={{ fontWeight:700, fontSize:15, color:'#f1f1f1', letterSpacing:'-0.2px' }}>{job.title}</span>
                    <span style={{ background:job.is_active?'rgba(16,185,129,0.12)':'rgba(255,255,255,0.05)', color:job.is_active?'#34d399':'#6b7280', border:`1px solid ${job.is_active?'rgba(16,185,129,0.25)':'rgba(255,255,255,0.08)'}`, borderRadius:20, fontSize:11, fontWeight:700, padding:'2px 8px' }}>
                      {job.is_active?'Active':'Paused'}
                    </span>
                  </div>
                  <div style={{ fontSize:13, color:'#6b7280', marginBottom:8 }}>
                    {job.location} · {job.job_type}{job.salary_range?` · ${job.salary_range}`:''}
                  </div>
                  <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                    {job.required_skills?.slice(0,5).map(s=>(
                      <span key={s} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'#9ca3af', borderRadius:7, fontSize:11, padding:'2px 7px' }}>{s}</span>
                    ))}
                  </div>
                </div>
                <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                  <a href={`/company/candidates?job=${job.id}`} style={{ textDecoration:'none' }}>
                    <button style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', background:'rgba(99,102,241,0.15)', border:'1px solid rgba(99,102,241,0.25)', borderRadius:8, color:'#818cf8', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
                      <Users size={13}/> Candidates
                    </button>
                  </a>
                  <button onClick={()=>toggleJob(job)} style={{ padding:'7px 14px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, color:'#9ca3af', fontSize:12, cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
                    {job.is_active?'Pause':'Activate'}
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
