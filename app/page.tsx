export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'

export default function HomePage() {
  return (
    <>
      <Navbar userRole={null} />

      {/* Hero - Split layout */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'3rem', alignItems:'center', padding:'4rem 2.5rem 3rem', maxWidth:1200, margin:'0 auto' }}>
        
        {/* Left */}
        <div>
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(99,102,241,0.12)', border:'1px solid rgba(99,102,241,0.25)', borderRadius:999, padding:'5px 14px', fontSize:12, color:'#818cf8', fontWeight:700, marginBottom:'1.5rem' }}>
            ✦ AI-Powered Hiring Platform
          </div>
          <h1 style={{ fontSize:'clamp(2.5rem,4.5vw,3.75rem)', fontWeight:900, lineHeight:1.05, color:'#fff', marginBottom:'1.25rem', letterSpacing:'-2px' }}>
            Hire Smarter<br />with <span style={{ color:'#818cf8' }}>AI</span>
          </h1>
          <p style={{ fontSize:15, color:'#9ca3af', lineHeight:1.8, marginBottom:'2rem', maxWidth:420 }}>
            HireWise uses artificial intelligence to understand resumes, match the right talent to the right roles, and help companies build amazing teams.
          </p>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:'2.5rem' }}>
            <Link href="/signup">
              <button style={{ padding:'13px 28px', background:'#6366f1', border:'none', borderRadius:12, color:'#fff', fontSize:15, fontWeight:700, cursor:'pointer', fontFamily:'Inter,sans-serif', boxShadow:'0 0 24px rgba(99,102,241,0.35)' }}>Find Jobs →</button>
            </Link>
            <Link href="/signup?role=company">
              <button style={{ padding:'13px 28px', background:'transparent', border:'1px solid rgba(255,255,255,0.15)', borderRadius:12, color:'#d1d5db', fontSize:15, fontWeight:600, cursor:'pointer', fontFamily:'Inter,sans-serif' }}>I'm a Recruiter</button>
            </Link>
          </div>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            {[
              ['🤖','AI Resume Parsing','Extract skills & experience instantly'],
              ['⚡','Smart Matching','Semantic match based on skills & context'],
              ['📊','Ranked Results','See best matches with AI match score'],
            ].map(([icon, title, desc]) => (
              <div key={title as string} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, padding:'10px 14px', display:'flex', alignItems:'center', gap:8, flex:1, minWidth:130 }}>
                <span style={{ fontSize:16 }}>{icon}</span>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:'#e5e7eb', marginBottom:2 }}>{title as string}</div>
                  <div style={{ fontSize:10, color:'#6b7280' }}>{desc as string}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Dashboard Preview */}
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, overflow:'hidden' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1rem 1.25rem', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ width:28, height:28, background:'#6366f1', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:13, color:'#fff' }}>H</div>
            <div style={{ flex:1, marginLeft:'0.875rem' }}>
              <div style={{ fontSize:14, fontWeight:700, color:'#fff' }}>Welcome back, Alex 👋</div>
              <div style={{ fontSize:11, color:'#6b7280' }}>Here's your hiring overview</div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:10 }}>AT</div>
              <div style={{ fontSize:10, color:'#9ca3af' }}>
                <div style={{ color:'#e5e7eb', fontWeight:600, fontSize:11 }}>Alex Thompson</div>
                Acme Corp.
              </div>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'110px 1fr' }}>
            <div style={{ background:'rgba(255,255,255,0.02)', borderRight:'1px solid rgba(255,255,255,0.06)', padding:'1rem 0.75rem', display:'flex', flexDirection:'column', gap:2 }}>
              {[['🏠','Overview',true],['💼','Jobs',false],['👥','Candidates',false],['💬','Messages',false],['📊','Analytics',false]].map(([icon, label, active]) => (
                <div key={label as string} style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 8px', borderRadius:8, background: active ? 'rgba(99,102,241,0.15)' : 'transparent', color: active ? '#818cf8' : '#6b7280', fontSize:11, fontWeight: active ? 600 : 400, cursor:'pointer' }}>
                  <span>{icon as string}</span><span>{label as string}</span>
                </div>
              ))}
            </div>

            <div style={{ padding:'1rem' }}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6, marginBottom:'0.875rem' }}>
                {[['💼','Active Jobs','24','↑ 12%'],['👥','Applicants','1,248','↑ 18%'],['🎯','AI Match','89%','↑ 9%'],['✅','Hires','16','↑ 14%']].map(([icon, label, val, trend]) => (
                  <div key={label as string} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'0.75rem' }}>
                    <div style={{ fontSize:14, marginBottom:4 }}>{icon as string}</div>
                    <div style={{ fontSize:9, color:'#6b7280', marginBottom:3 }}>{label as string}</div>
                    <div style={{ fontSize:16, fontWeight:800, color:'#fff', letterSpacing:'-0.5px' }}>{val as string}</div>
                    <div style={{ fontSize:9, color:'#34d399', marginTop:2 }}>{trend as string} this week</div>
                  </div>
                ))}
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
                <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'0.75rem' }}>
                  <div style={{ fontSize:11, fontWeight:700, color:'#e5e7eb', marginBottom:10 }}>AI Match Distribution</div>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:60, height:60, borderRadius:'50%', background:'conic-gradient(#6366f1 0% 42%,#10b981 42% 75%,#f59e0b 75% 92%,#ef4444 92% 100%)', position:'relative', flexShrink:0 }}>
                      <div style={{ position:'absolute', inset:8, background:'#161624', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <div style={{ textAlign:'center' }}>
                          <div style={{ fontSize:11, fontWeight:800, color:'#fff' }}>892</div>
                          <div style={{ fontSize:7, color:'#6b7280' }}>Matches</div>
                        </div>
                      </div>
                    </div>
                    <div style={{ flex:1 }}>
                      {[['#6366f1','Excellent','42%'],['#10b981','Good','33%'],['#f59e0b','Fair','17%'],['#ef4444','Poor','8%']].map(([color, label, pct]) => (
                        <div key={label as string} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                            <div style={{ width:6, height:6, borderRadius:'50%', background: color as string }} />
                            <span style={{ fontSize:9, color:'#9ca3af' }}>{label as string}</span>
                          </div>
                          <span style={{ fontSize:9, color:'#e5e7eb', fontWeight:600 }}>{pct as string}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'0.75rem' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:'#e5e7eb' }}>Top Matched</div>
                    <span style={{ fontSize:9, color:'#818cf8' }}>View all</span>
                  </div>
                  {[['SJ','Sarah Johnson','Frontend Developer','96%'],['MC','Michael Chen','Full Stack Engineer','94%'],['PP','Priya Patel','UI/UX Designer','92%']].map(([init, name, role, score]) => (
                    <div key={name as string} style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
                      <div style={{ width:26, height:26, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:9, flexShrink:0 }}>{init as string}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:10, fontWeight:600, color:'#e5e7eb' }}>{name as string}</div>
                        <div style={{ fontSize:9, color:'#6b7280' }}>{role as string}</div>
                      </div>
                      <div style={{ background:'rgba(16,185,129,0.15)', color:'#34d399', border:'1px solid rgba(16,185,129,0.25)', borderRadius:6, fontSize:10, fontWeight:800, padding:'1px 6px' }}>{score as string}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trusted by */}
      <div style={{ padding:'2.5rem', borderTop:'1px solid rgba(255,255,255,0.06)', borderBottom:'1px solid rgba(255,255,255,0.06)', textAlign:'center' }}>
        <div style={{ fontSize:11, fontWeight:700, color:'#374151', letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:'1.5rem' }}>TRUSTED BY COMPANIES OF ALL SIZES</div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'3rem', flexWrap:'wrap' }}>
          {['Microsoft','Google','Airbnb','Spotify','Notion','Slack'].map(c => (
            <div key={c} style={{ fontSize:16, fontWeight:700, color:'#374151', letterSpacing:'-0.3px' }}>{c}</div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ padding:'4rem 2.5rem', maxWidth:1200, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
          <div style={{ fontSize:26, fontWeight:900, color:'#fff', letterSpacing:'-1px', marginBottom:8 }}>Built different from day one</div>
          <div style={{ fontSize:14, color:'#6b7280' }}>Every feature designed around AI-first matching</div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:14 }}>
          {[
            ['🤖','#6366f1','AI-Powered Matching','We go beyond keywords to match real skills and experience.'],
            ['📄','#8b5cf6','Resume Understanding','Our AI reads and understands resumes like a human.'],
            ['💬','#06b6d4','Real-time Messaging','Connect and chat directly within the platform.'],
            ['🛡️','#10b981','Secure & Reliable','Your data is safe with enterprise-grade security.'],
          ].map(([icon, color, title, desc]) => (
            <div key={title as string} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:18, padding:'1.5rem' }}>
              <div style={{ width:44, height:44, borderRadius:12, background:`${color as string}20`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, marginBottom:14 }}>{icon as string}</div>
              <div style={{ fontSize:15, fontWeight:700, color:'#f1f1f1', marginBottom:8 }}>{title as string}</div>
              <div style={{ fontSize:13, color:'#6b7280', lineHeight:1.65 }}>{desc as string}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign:'center', padding:'5rem 2rem', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize:30, fontWeight:900, color:'#fff', letterSpacing:'-1.5px', marginBottom:8 }}>Ready to hire smarter?</div>
        <div style={{ fontSize:14, color:'#6b7280', marginBottom:'1.75rem' }}>Join thousands of candidates and companies on HireWise</div>
        <Link href="/signup">
          <button style={{ padding:'14px 40px', background:'#6366f1', border:'none', borderRadius:14, color:'#fff', fontSize:16, fontWeight:800, cursor:'pointer', fontFamily:'Inter,sans-serif', boxShadow:'0 0 30px rgba(99,102,241,0.35)' }}>
            Get started free →
          </button>
        </Link>
      </div>
    </>
  )
}
