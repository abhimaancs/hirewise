'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'
import { JobMatch, CandidateProfile } from '@/types'
import { Loader2, Zap, Briefcase, CheckCircle, Search } from 'lucide-react'

export default function JobsPage() {
  const supabase = createClient()
  const [matches, setMatches] = useState<JobMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [matching, setMatching] = useState(false)
  const [filter, setFilter] = useState<'all'|'remote'|'internship'>('all')
  const [search, setSearch] = useState('')
  const [profile, setProfile] = useState<CandidateProfile|null>(null)
  const [appliedJobs, setAppliedJobs] = useState<string[]>([])
  const [applying, setApplying] = useState<string|null>(null)
  const [userId, setUserId] = useState<string|null>(null)

  useEffect(() => { load() }, [])

  const load = async () => {
    try {
      const { data:{ session } } = await supabase.auth.getSession()
      if (!session) { window.location.href='/login'; return }
      setUserId(session.user.id)
      const { data:p } = await supabase.from('profiles').select('*').eq('id',session.user.id).single()
      const { data:c } = await supabase.from('candidate_profiles').select('*').eq('id',session.user.id).single()
      const candidate = {...p,...c} as CandidateProfile
      setProfile(candidate)
      const { data:apps } = await supabase.from('applications').select('job_id').eq('candidate_id',session.user.id)
      if (apps) setAppliedJobs(apps.map((a:any)=>a.job_id))
      const { data:jobs } = await supabase.from('jobs').select('*').eq('is_active',true).limit(20)
      if (!jobs?.length) { setLoading(false); return }
      setMatching(true)
      const res = await fetch('/api/match-jobs',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({candidate,jobs}) })
      const { matches:m } = await res.json()
      setMatches(m||[])
    } catch(err) { console.error(err) }
    finally { setLoading(false); setMatching(false) }
  }

  const handleApply = async (jobId:string) => {
    if (!userId||appliedJobs.includes(jobId)) return
    setApplying(jobId)
    try {
      const { error } = await supabase.from('applications').insert({ candidate_id:userId, job_id:jobId, status:'applied' })
      if (error&&error.code!=='23505') throw error
      setAppliedJobs(prev=>[...prev,jobId])
    } catch(err:any) { alert('Failed to apply: '+(err?.message||'Please try again')) }
    finally { setApplying(null) }
  }

  const filtered = matches.filter(m => {
    if (filter==='remote') return m.job.job_type==='remote'
    if (filter==='internship') return m.job.job_type==='internship'
    if (search) return m.job.title.toLowerCase().includes(search.toLowerCase()) || m.job.required_skills?.some((s:string)=>s.toLowerCase().includes(search.toLowerCase()))
    return true
  })

  const colors:Record<string,string> = {'G':'#4285f4','R':'#2563eb','S':'#f97316','Z':'#8b5cf6','T':'#059669','F':'#dc2626','A':'#d97706','M':'#0891b2'}
  const scoreColor=(s:number)=>s>=85?'#34d399':s>=70?'#818cf8':'#9ca3af'
  const scoreBg=(s:number)=>s>=85?'rgba(16,185,129,0.15)':s>=70?'rgba(99,102,241,0.15)':'rgba(255,255,255,0.06)'
  const scoreBorder=(s:number)=>s>=85?'rgba(16,185,129,0.3)':s>=70?'rgba(99,102,241,0.3)':'rgba(255,255,255,0.1)'

  return (
    <>
      <Navbar userRole="candidate" />
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'2rem 1.5rem' }}>
        {profile && (
          <div style={{ background:'rgba(99,102,241,0.08)', border:'1px solid rgba(99,102,241,0.2)', borderRadius:14, padding:'1rem 1.25rem', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:36, height:36, background:'#6366f1', borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              {matching?<Loader2 size={16} color="#fff" style={{ animation:'spin 1s linear infinite' }}/>:<Zap size={16} color="#fff"/>}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:'#e5e7eb' }}>{matching?'AI is matching jobs...':'AI matched '+matches.length+' jobs for you'}</div>
              <div style={{ fontSize:12, color:'#6b7280' }}>{profile.skills?.length?'Based on: '+profile.skills.slice(0,4).join(', '):'Add skills for better matches'}</div>
            </div>
            {appliedJobs.length>0&&<div style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color:'#34d399', fontWeight:600, background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.25)', borderRadius:20, padding:'4px 10px' }}><CheckCircle size={12}/>{appliedJobs.length} applied</div>}
            <a href="/profile" style={{ textDecoration:'none' }}><button style={{ padding:'6px 12px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, fontSize:12, color:'#9ca3af', cursor:'pointer', fontFamily:'Inter,sans-serif', fontWeight:500 }}>Update profile</button></a>
          </div>
        )}

        <div style={{ display:'flex', gap:8, marginBottom:'1.5rem', alignItems:'center', flexWrap:'wrap' }}>
          {(['all','remote','internship'] as const).map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{ padding:'7px 16px', borderRadius:20, border:'1px solid', borderColor:filter===f?'#6366f1':'rgba(255,255,255,0.1)', background:filter===f?'#6366f1':'transparent', color:filter===f?'#fff':'#9ca3af', fontSize:13, fontWeight:filter===f?600:500, cursor:'pointer', fontFamily:'Inter,sans-serif', textTransform:'capitalize' }}>{f}</button>
          ))}
          <div style={{ marginLeft:'auto', position:'relative' }}>
            <Search size={13} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#4b5563' }}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search roles or skills..." style={{ paddingLeft:30, width:210, fontSize:13 }}/>
          </div>
        </div>

        {loading?(
          <div style={{ textAlign:'center', padding:'5rem', color:'#6b7280' }}>
            <Loader2 size={28} style={{ animation:'spin 1s linear infinite', marginBottom:14 }}/>
            <p style={{ fontSize:14 }}>Finding your matches...</p>
          </div>
        ):filtered.length===0?(
          <div style={{ textAlign:'center', padding:'5rem', color:'#6b7280' }}>
            <Briefcase size={44} style={{ marginBottom:14, opacity:0.25 }}/>
            <p style={{ fontSize:16, fontWeight:700, color:'#e5e7eb', marginBottom:6 }}>No jobs found</p>
            <p style={{ fontSize:13 }}><a href="/profile" style={{ color:'#818cf8', fontWeight:600 }}>Complete your profile</a> to get AI matches</p>
          </div>
        ):(
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:14 }}>
            {filtered.map(({job,match_score,match_reason})=>{
              const isApplied=appliedJobs.includes(job.id)
              const isApplying=applying===job.id
              const initial=job.title[0].toUpperCase()
              const color=colors[initial]||'#6366f1'
              return (
                <div key={job.id} style={{ background:'rgba(255,255,255,0.03)', border:`1px solid ${isApplied?'rgba(16,185,129,0.25)':'rgba(255,255,255,0.07)'}`, borderRadius:18, padding:'1.25rem', transition:'all 0.25s' }}
                  onMouseEnter={e=>{ const el=e.currentTarget as HTMLElement; el.style.borderColor='rgba(99,102,241,0.35)'; el.style.background='rgba(255,255,255,0.05)'; el.style.transform='translateY(-2px)' }}
                  onMouseLeave={e=>{ const el=e.currentTarget as HTMLElement; el.style.borderColor=isApplied?'rgba(16,185,129,0.25)':'rgba(255,255,255,0.07)'; el.style.background='rgba(255,255,255,0.03)'; el.style.transform='none' }}
                >
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                    <div style={{ width:44, height:44, borderRadius:12, background:`${color}20`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, color, fontSize:16 }}>{initial}</div>
                    <div style={{ background:scoreBg(match_score), color:scoreColor(match_score), border:`1px solid ${scoreBorder(match_score)}`, borderRadius:20, fontSize:11, fontWeight:700, padding:'3px 9px' }}>{match_score}% match</div>
                  </div>
                  <div style={{ fontSize:15, fontWeight:700, color:'#f1f1f1', marginBottom:3, letterSpacing:'-0.2px' }}>{job.title}</div>
                  <div style={{ fontSize:12, color:'#6b7280', marginBottom:10 }}>{job.location} · <span style={{ textTransform:'capitalize' }}>{job.job_type}</span></div>
                  <div style={{ fontSize:12, color:'#9ca3af', lineHeight:1.6, marginBottom:12, background:'rgba(255,255,255,0.03)', borderRadius:9, padding:'8px 10px', borderLeft:'2px solid rgba(99,102,241,0.4)' }}>✦ {match_reason}</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:14 }}>
                    {job.required_skills?.slice(0,4).map((s:string)=><span key={s} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'#9ca3af', borderRadius:7, fontSize:11, padding:'3px 8px', fontWeight:500 }}>{s}</span>)}
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontSize:14, fontWeight:700, color:'#818cf8', letterSpacing:'-0.3px' }}>{job.salary_range||'Salary not listed'}</span>
                    <button onClick={()=>handleApply(job.id)} disabled={isApplied||isApplying} style={{ display:'flex', alignItems:'center', gap:5, padding:'8px 16px', borderRadius:9, border:'none', background:isApplied?'rgba(16,185,129,0.15)':'#6366f1', color:isApplied?'#34d399':'#fff', fontSize:13, fontWeight:700, cursor:isApplied?'default':'pointer', fontFamily:'Inter,sans-serif' }}>
                      {isApplying?<Loader2 size={13} style={{ animation:'spin 1s linear infinite' }}/>:isApplied?<><CheckCircle size={13}/>Applied</>:'Apply →'}
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
