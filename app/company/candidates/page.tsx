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
  const [selectedJob, setSelectedJob] = useState<Job|null>(null)
  const [matches, setMatches] = useState<any[]>([])
  const [applicants, setApplicants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [matching, setMatching] = useState(false)
  const [tab, setTab] = useState<'applicants'|'ai'>('applicants')
  const [startingChat, setStartingChat] = useState<string|null>(null)

  useEffect(() => { loadJobs() }, [])
  useEffect(() => { if (selectedJob) { loadApplicants(selectedJob.id); matchCandidates(selectedJob) } }, [selectedJob])

  const loadJobs = async () => {
    const { data:{ session } } = await supabase.auth.getSession()
    if (!session) { window.location.href='/login'; return }
    const { data } = await supabase.from('jobs').select('*').eq('company_id',session.user.id).order('created_at',{ ascending:false })
    setJobs(data||[])
    const target = data?.find(j=>j.id===jobId)||data?.[0]
    if (target) setSelectedJob(target)
    else setLoading(false)
  }

  const loadApplicants = async (jid: string) => {
    try {
      const { data:apps } = await supabase.from('applications').select('*').eq('job_id',jid).order('applied_at',{ ascending:false })
      if (!apps?.length) { setApplicants([]); return }
      const enriched = await Promise.all(apps.map(async (app:any) => {
        const { data:candidate } = await supabase.from('profiles').select('*').eq('id',app.candidate_id).single()
        const { data:details } = await supabase.from('candidate_profiles').select('*').eq('id',app.candidate_id).single()
        return { ...app, candidate, candidate_details:details }
      }))
      setApplicants(enriched)
    } catch(err) { console.error(err) }
  }

  const matchCandidates = async (job: Job) => {
    setMatching(true); setMatches([])
    try {
      const { data:profiles } = await supabase.from('profiles').select('*').eq('role','candidate')
      const { data:details } = await supabase.from('candidate_profiles').select('*')
      if (!profiles?.length) { setMatching(false); setLoading(false); return }
      const candidates:CandidateProfile[] = profiles.map(p=>({...p,...(details?.find(c=>c.id===p.id)||{})}))
      const res = await fetch('/api/match-candidates',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({job,candidates}) })
      const { matches:m } = await res.json()
      setMatches(m||[])
    } catch(err) { console.error(err) }
    finally { setMatching(false); setLoading(false) }
  }

  const startChat = async (candidateId: string) => {
    setStartingChat(candidateId)
    const { data:{ session } } = await supabase.auth.getSession()
    if (!session) return
    const { data:existing } = await supabase.from('conversations').select('id').eq('candidate_id',candidateId).eq('company_id',session.user.id).maybeSingle()
    let convId = existing?.id
    if (!convId) {
      const { data:newConv } = await supabase.from('conversations').insert({ candidate_id:candidateId, company_id:session.user.id, job_id:selectedJob?.id }).select('id').single()
      convId = newConv?.id
    }
    window.location.href = `/chat/${convId}`
    setStartingChat(null)
  }

  const updateStatus = async (appId: string, status: string) => {
    await supabase.from('applications').update({ status }).eq('id',appId)
    if (selectedJob) loadApplicants(selectedJob.id)
  }

  const scoreColor=(s:number)=>s>=85?'#34d399':s>=70?'#818cf8':'#9ca3af'
  const scoreBg=(s:number)=>s>=85?'rgba(16,185,129,0.12)':s>=70?'rgba(99,102,241,0.12)':'rgba(255,255,255,0.06)'
  const statusColors:any = {
    applied:{ bg:'rgba(99,102,241,0.12)', color:'#818cf8', border:'rgba(99,102,241,0.25)' },
    shortlisted:{ bg:'rgba(16,185,129,0.12)', color:'#34d399', border:'rgba(16,185,129,0.25)' },
    rejected:{ bg:'rgba(239,68,68,0.12)', color:'#f87171', border:'rgba(239,68,68,0.25)' },
  }

  return (
    <>
      <Navbar userRole="company"/>
      <div style={{ maxWidth:900, margin:'0 auto', padding:'2rem 1.5rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
          <div>
            <h1 style={{ fontSize:22, fontWeight:800, color:'#fff', letterSpacing:'-0.5px', marginBottom:4 }}>Candidates</h1>
            <p style={{ fontSize:13, color:'#6b7280' }}>View applicants and AI-ranked matches</p>
          </div>
          {jobs.length>0&&(
            <div style={{ position:'relative' }}>
              <select value={selectedJob?.id||''} onChange={e=>{ const j=jobs.find(j=>j.id===e.target.value); if(j) setSelectedJob(j) }} style={{ paddingRight:'2rem', appearance:'none', cursor:'pointer', minWidth:220, color:'#f1f1f1' }}>
                {jobs.map(job=><option key={job.id} value={job.id}>{job.title}</option>)}
              </select>
              <ChevronDown size={14} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', color:'#6b7280', pointerEvents:'none' }}/>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:4, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:4, width:'fit-content', marginBottom:'1.5rem' }}>
          {[{id:'applicants',label:`Applicants (${applicants.length})`,icon:<Users size={13}/>},{id:'ai',label:'AI Ranked',icon:<Star size={13}/>}].map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id as any)} style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:8, border:'none', background:tab===t.id?'rgba(99,102,241,0.2)':'transparent', color:tab===t.id?'#818cf8':'#6b7280', fontSize:13, fontWeight:tab===t.id?700:500, cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign:'center', padding:'3rem', color:'#6b7280' }}><Loader2 size={24} style={{ animation:'spin 1s linear infinite' }}/></div>
        ) : tab==='applicants' ? (
          applicants.length===0 ? (
            <div style={{ textAlign:'center', padding:'4rem', color:'#6b7280' }}>
              <Users size={40} style={{ marginBottom:12, opacity:0.2 }}/>
              <p style={{ fontSize:15, fontWeight:700, color:'#e5e7eb', marginBottom:6 }}>No applicants yet</p>
              <p style={{ fontSize:13 }}>Candidates who apply will appear here</p>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {applicants.map((app:any)=>(
                <div key={app.id} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, padding:'1.25rem', display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, flexShrink:0 }}>
                    {app.candidate?.name?.[0]?.toUpperCase()||'?'}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                      <span style={{ fontWeight:700, fontSize:14, color:'#f1f1f1' }}>{app.candidate?.name||'Unknown'}</span>
                      <span style={{ background:statusColors[app.status]?.bg, color:statusColors[app.status]?.color, border:`1px solid ${statusColors[app.status]?.border}`, borderRadius:20, fontSize:11, fontWeight:700, padding:'2px 8px', textTransform:'capitalize' }}>{app.status}</span>
                    </div>
                    <div style={{ fontSize:12, color:'#6b7280', marginBottom:6 }}>
                      Applied {new Date(app.applied_at).toLocaleDateString()}{app.candidate_details?.college&&` · 🎓 ${app.candidate_details.college}`}
                    </div>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
                      {app.candidate_details?.skills?.slice(0,5).map((s:string)=>(
                        <span key={s} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'#9ca3af', borderRadius:7, fontSize:11, padding:'2px 6px' }}>{s}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:6, flexShrink:0 }}>
                    <button onClick={()=>startChat(app.candidate_id)} style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 12px', background:'#6366f1', border:'none', borderRadius:8, color:'#fff', fontSize:12, cursor:'pointer', fontFamily:'Inter,sans-serif', fontWeight:600 }}>
                      {startingChat===app.candidate_id?<Loader2 size={12} style={{ animation:'spin 1s linear infinite' }}/>:<MessageSquare size={12}/>} Message
                    </button>
                    <select value={app.status} onChange={e=>updateStatus(app.id,e.target.value)} style={{ fontSize:12, padding:'5px 8px', borderRadius:8, cursor:'pointer', color:'#f1f1f1' }}>
                      <option value="applied">Applied</option>
                      <option value="shortlisted">Shortlist</option>
                      <option value="rejected">Reject</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : matching ? (
          <div style={{ background:'rgba(99,102,241,0.08)', border:'1px solid rgba(99,102,241,0.2)', borderRadius:14, padding:'1.25rem', display:'flex', alignItems:'center', gap:12 }}>
            <Loader2 size={18} color="#818cf8" style={{ animation:'spin 1s linear infinite' }}/>
            <span style={{ fontSize:14, color:'#818cf8', fontWeight:600 }}>AI is ranking candidates...</span>
          </div>
        ) : matches.length===0 ? (
          <div style={{ textAlign:'center', padding:'4rem', color:'#6b7280' }}>
            <Briefcase size={40} style={{ marginBottom:12, opacity:0.2 }}/>
            <p style={{ fontSize:15, fontWeight:700, color:'#e5e7eb' }}>No candidates found yet</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {matches.map(({job:candidate,match_score,match_reason}:any,i:number)=>(
              <div key={candidate.id} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, padding:'1.25rem', display:'flex', alignItems:'flex-start', gap:14, transition:'all 0.2s' }}
                onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.borderColor='rgba(99,102,241,0.3)' }}
                onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.07)' }}
              >
                <div style={{ width:28, height:28, borderRadius:'50%', background:i===0?'rgba(245,158,11,0.15)':'rgba(255,255,255,0.05)', border:`1px solid ${i===0?'rgba(245,158,11,0.3)':'rgba(255,255,255,0.08)'}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:i===0?'#fbbf24':'#6b7280', flexShrink:0 }}>
                  {i===0?<Star size={13} fill="#fbbf24" color="#fbbf24"/>:`#${i+1}`}
                </div>
                <div style={{ width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, flexShrink:0 }}>
                  {candidate.name?.[0]?.toUpperCase()}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                    <span style={{ fontWeight:700, fontSize:14, color:'#f1f1f1' }}>{candidate.name}</span>
                    <span style={{ background:scoreBg(match_score), color:scoreColor(match_score), borderRadius:20, fontSize:11, fontWeight:700, padding:'2px 8px' }}>{match_score}%</span>
                  </div>
                  <div style={{ fontSize:12, color:'#6b7280', marginBottom:6 }}>
                    {candidate.college&&`🎓 ${candidate.college} · `}{candidate.experience_years===0?'💼 Fresher':`💼 ${candidate.experience_years}y exp`}
                  </div>
                  <p style={{ fontSize:12, color:'#9ca3af', background:'rgba(255,255,255,0.03)', borderRadius:8, padding:'6px 10px', marginBottom:8, borderLeft:'2px solid rgba(99,102,241,0.4)' }}>✦ {match_reason}</p>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
                    {candidate.skills?.slice(0,5).map((s:string)=>(
                      <span key={s} style={{ background:'rgba(99,102,241,0.1)', color:'#818cf8', border:'1px solid rgba(99,102,241,0.2)', borderRadius:20, fontSize:11, padding:'2px 8px' }}>{s}</span>
                    ))}
                  </div>
                </div>
                <button onClick={()=>startChat(candidate.id)} disabled={startingChat===candidate.id} style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', background:'#6366f1', border:'none', borderRadius:8, color:'#fff', fontSize:12, cursor:'pointer', fontFamily:'Inter,sans-serif', flexShrink:0, fontWeight:600 }}>
                  {startingChat===candidate.id?<Loader2 size={12} style={{ animation:'spin 1s linear infinite' }}/>:<MessageSquare size={12}/>} Message
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default function CandidatesPage() {
  return <Suspense><CandidatesContent /></Suspense>
}
