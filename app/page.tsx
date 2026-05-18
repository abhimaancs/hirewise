export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'

export default function HomePage() {
  return (
    <>
      <Navbar userRole={null} />

      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.6;transform:scale(.95)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
        @keyframes glow{0%,100%{box-shadow:0 0 20px rgba(99,102,241,.25)}50%{box-shadow:0 0 40px rgba(99,102,241,.5)}}
        @keyframes barGrow{from{width:0}to{width:var(--w)}}
        .fade-up{animation:fadeUp .5s ease forwards}
        .fade-up-1{animation:fadeUp .5s .1s ease both}
        .fade-up-2{animation:fadeUp .5s .2s ease both}
        .fade-up-3{animation:fadeUp .5s .3s ease both}
        .fade-up-4{animation:fadeUp .5s .4s ease both}
        .fade-up-5{animation:fadeUp .5s .5s ease both}
        .glow-btn{animation:glow 3s ease-in-out infinite}
        .badge-dot{width:6px;height:6px;background:#818cf8;border-radius:50%;display:inline-block;animation:pulse 2s infinite;margin-right:6px}
        .ai-item{animation:slideIn .4s ease forwards;opacity:0}
        .ai-item:nth-child(1){animation-delay:.2s}
        .ai-item:nth-child(2){animation-delay:.5s}
        .ai-item:nth-child(3){animation-delay:.8s}
        .ai-item:nth-child(4){animation-delay:1.1s}
        .bar-fill{animation:barGrow .9s ease forwards}
        .feature-card{transition:all .25s;cursor:default}
        .feature-card:hover{border-color:rgba(99,102,241,.35)!important;transform:translateY(-3px)!important;box-shadow:0 8px 30px rgba(0,0,0,.3)!important}
        .btn-hero:hover{transform:translateY(-3px)!important}
        .btn-outline:hover{background:rgba(255,255,255,.06)!important;transform:translateY(-1px)!important}
        .cta-btn:hover{transform:translateY(-2px)!important}
        .nav-a:hover{color:#e5e7eb!important}
        .db-link:hover{background:rgba(255,255,255,.04)!important;color:#9ca3af!important}
      `}</style>

      {/* Hero */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'3rem',alignItems:'center',padding:'5rem 2.5rem 3rem',maxWidth:1200,margin:'0 auto'}}>
        
        {/* Left */}
        <div>
          <div className="fade-up" style={{display:'inline-flex',alignItems:'center',gap:6,background:'rgba(99,102,241,.1)',border:'1px solid rgba(99,102,241,.25)',borderRadius:999,padding:'5px 14px',fontSize:12,color:'#818cf8',fontWeight:700,marginBottom:'1.5rem'}}>
            <span className="badge-dot"/>AI-Powered Hiring Platform
          </div>

          <h1 className="fade-up-1" style={{fontSize:'clamp(2.2rem,4vw,3.5rem)',fontWeight:900,lineHeight:1.05,color:'#fff',marginBottom:'1rem',letterSpacing:'-2px'}}>
            Hire Smarter<br/>
            <span style={{background:'linear-gradient(135deg,#818cf8,#a78bfa)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>with AI</span>
          </h1>

          <p className="fade-up-2" style={{fontSize:15,color:'#6b7280',lineHeight:1.8,marginBottom:'2rem',maxWidth:400}}>
            HireWise uses AI to understand resumes, match the right talent to the right roles, and help companies build amazing teams.
          </p>

          <div className="fade-up-3" style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:'2.5rem'}}>
            <Link href="/signup">
              <button className="btn-hero glow-btn" style={{padding:'13px 28px',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',border:'none',borderRadius:12,color:'#fff',fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:'Inter,sans-serif',boxShadow:'0 0 30px rgba(99,102,241,.35)',transition:'all .25s'}}>
                Find Jobs →
              </button>
            </Link>
            <Link href="/signup?role=company">
              <button className="btn-outline" style={{padding:'13px 28px',background:'transparent',border:'1px solid rgba(255,255,255,.15)',borderRadius:12,color:'#d1d5db',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'Inter,sans-serif',transition:'all .2s'}}>
                I'm a Recruiter
              </button>
            </Link>
          </div>

          <div className="fade-up-4" style={{display:'flex',gap:10,flexWrap:'wrap'}}>
            {[
              ['🤖','AI Resume Parsing','Extract skills instantly'],
              ['🎯','Semantic Matching','Beyond keyword search'],
              ['💬','Direct Messaging','No recruiters needed'],
            ].map(([icon,title,desc])=>(
              <div key={title as string} style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',borderRadius:12,padding:'10px 14px',display:'flex',alignItems:'center',gap:8,flex:1,minWidth:120}}>
                <span style={{fontSize:16}}>{icon as string}</span>
                <div>
                  <div style={{fontSize:11,fontWeight:700,color:'#e5e7eb',marginBottom:2}}>{title as string}</div>
                  <div style={{fontSize:10,color:'#6b7280'}}>{desc as string}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Dashboard */}
        <div className="fade-up-5" style={{background:'rgba(255,255,255,.02)',border:'1px solid rgba(255,255,255,.08)',borderRadius:20,overflow:'hidden',position:'relative'}}>
          <div style={{position:'absolute',top:-80,right:-80,width:250,height:250,background:'radial-gradient(circle,rgba(99,102,241,.07) 0%,transparent 70%)',pointerEvents:'none'}}/>

          {/* DB Header */}
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'.875rem 1.25rem',borderBottom:'1px solid rgba(255,255,255,.06)',position:'relative',zIndex:1}}>
            <div style={{width:26,height:26,background:'linear-gradient(135deg,#6366f1,#8b5cf6)',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:12,color:'#fff'}}>H</div>
            <div style={{flex:1,marginLeft:'.875rem'}}>
              <div style={{fontSize:13,fontWeight:700,color:'#fff'}}>Welcome back, Rahul 👋</div>
              <div style={{fontSize:10,color:'#6b7280'}}>Here's your hiring overview</div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:6}}>
              <div style={{position:'relative',width:24,height:24,background:'rgba(255,255,255,.06)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11}}>
                🔔<div style={{position:'absolute',top:3,right:3,width:5,height:5,background:'#ef4444',borderRadius:'50%'}}/>
              </div>
              <div style={{width:26,height:26,borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:800,fontSize:9}}>RK</div>
              <div style={{fontSize:10,color:'#9ca3af'}}><div style={{color:'#e5e7eb',fontWeight:600,fontSize:11}}>Rahul Kumar</div>TechStartup India</div>
            </div>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'100px 1fr',position:'relative',zIndex:1}}>
            {/* Sidebar */}
            <div style={{background:'rgba(255,255,255,.02)',borderRight:'1px solid rgba(255,255,255,.06)',padding:'.875rem .625rem'}}>
              {[['🏠','Overview',true],['💼','Jobs',false],['👥','Candidates',false],['💬','Messages',false],['📊','Analytics',false],['⚙️','Settings',false]].map(([ic,lb,ac])=>(
                <div key={lb as string} className={!(ac)?'db-link':''} style={{display:'flex',alignItems:'center',gap:5,padding:'6px 8px',borderRadius:7,fontSize:10,color:(ac)?'#818cf8':'#6b7280',background:(ac)?'rgba(99,102,241,.15)':'transparent',fontWeight:(ac)?600:400,cursor:'pointer',marginBottom:2}}>
                  <span>{ic as string}</span><span>{lb as string}</span>
                </div>
              ))}
            </div>

            {/* Main */}
            <div style={{padding:'.875rem'}}>
              {/* KPIs */}
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:6,marginBottom:'.875rem'}}>
                {[['💼','Active Jobs','8','↑ 2 this week'],['👥','Applicants','143','↑ 31 this week'],['🎯','Avg. Match','76%','↑ 4% this week'],['✅','Hired','3','↑ 1 this week']].map(([ic,lb,vl,tr])=>(
                  <div key={lb as string} style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.07)',borderRadius:10,padding:'.625rem .75rem'}}>
                    <div style={{fontSize:13,marginBottom:4}}>{ic as string}</div>
                    <div style={{fontSize:8,color:'#6b7280',marginBottom:3}}>{lb as string}</div>
                    <div style={{fontSize:15,fontWeight:800,color:'#fff',letterSpacing:'-.5px'}}>{vl as string}</div>
                    <div style={{fontSize:8,color:'#34d399',marginTop:2}}>{tr as string}</div>
                  </div>
                ))}
              </div>

              {/* Bottom */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                {/* Left: donut + skill bars */}
                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                  {/* Donut */}
                  <div style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.07)',borderRadius:10,padding:'.75rem'}}>
                    <div style={{fontSize:10,fontWeight:700,color:'#e5e7eb',marginBottom:'.625rem'}}>Match Distribution</div>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <svg width="56" height="56" viewBox="0 0 56 56">
                        <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="8"/>
                        <circle cx="28" cy="28" r="22" fill="none" stroke="#6366f1" strokeWidth="8" strokeDasharray="55 83" strokeDashoffset="0" strokeLinecap="round"/>
                        <circle cx="28" cy="28" r="22" fill="none" stroke="#10b981" strokeWidth="8" strokeDasharray="44 83" strokeDashoffset="-55" strokeLinecap="round"/>
                        <circle cx="28" cy="28" r="22" fill="none" stroke="#f59e0b" strokeWidth="8" strokeDasharray="22 83" strokeDashoffset="-99" strokeLinecap="round"/>
                        <circle cx="28" cy="28" r="22" fill="none" stroke="#ef4444" strokeWidth="8" strokeDasharray="10 83" strokeDashoffset="-121" strokeLinecap="round"/>
                        <text x="28" y="26" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="800">143</text>
                        <text x="28" y="34" textAnchor="middle" fill="#6b7280" fontSize="6">Total</text>
                      </svg>
                      <div style={{flex:1}}>
                        {[['#6366f1','80-100%','39%'],['#10b981','60-80%','31%'],['#f59e0b','40-60%','18%'],['#ef4444','0-40%','12%']].map(([c,l,v])=>(
                          <div key={l} style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:4}}>
                            <div style={{display:'flex',alignItems:'center',gap:4}}>
                              <div style={{width:6,height:6,borderRadius:'50%',background:c as string}}/>
                              <span style={{fontSize:8,color:'#9ca3af'}}>{l}</span>
                            </div>
                            <span style={{fontSize:8,fontWeight:700,color:'#e5e7eb'}}>{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Skill bars */}
                  <div style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.07)',borderRadius:10,padding:'.75rem'}}>
                    <div style={{fontSize:10,fontWeight:700,color:'#e5e7eb',marginBottom:'.625rem'}}>Top Skills in Demand</div>
                    {[['React','78%','linear-gradient(90deg,#6366f1,#8b5cf6)'],['Node.js','65%','linear-gradient(90deg,#06b6d4,#3b82f6)'],['Python','52%','linear-gradient(90deg,#10b981,#06b6d4)'],['TypeScript','44%','linear-gradient(90deg,#f59e0b,#ef4444)']].map(([sk,pct,bg])=>(
                      <div key={sk as string} style={{display:'flex',alignItems:'center',gap:6,marginBottom:5}}>
                        <span style={{fontSize:9,color:'#9ca3af',width:48,textAlign:'right',flexShrink:0}}>{sk as string}</span>
                        <div style={{flex:1,height:5,background:'rgba(255,255,255,.06)',borderRadius:3,overflow:'hidden'}}>
                          <div className="bar-fill" style={{height:'100%',borderRadius:3,background:bg as string,width:pct as string}}/>
                        </div>
                        <span style={{fontSize:9,fontWeight:700,color:'#e5e7eb',width:26}}>{pct as string}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: candidates + AI feed */}
                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                  {/* Candidates */}
                  <div style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.07)',borderRadius:10,padding:'.75rem'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'.625rem'}}>
                      <span style={{fontSize:10,fontWeight:700,color:'#e5e7eb'}}>Top Matched</span>
                      <span style={{fontSize:9,color:'#818cf8',cursor:'pointer'}}>View all</span>
                    </div>
                    {[['AB','Abhi C S','SDE Intern','94%','linear-gradient(135deg,#6366f1,#8b5cf6)','#34d399','rgba(16,185,129,.15)'],['PK','Priya Kumar','Full Stack Dev','88%','linear-gradient(135deg,#06b6d4,#3b82f6)','#34d399','rgba(16,185,129,.15)'],['RM','Rahul M','Backend Eng.','71%','linear-gradient(135deg,#f59e0b,#ef4444)','#818cf8','rgba(99,102,241,.15)']].map(([i,n,r,s,bg,sc,sbg])=>(
                      <div key={n as string} style={{display:'flex',alignItems:'center',gap:6,marginBottom:7}}>
                        <div style={{width:24,height:24,borderRadius:'50%',background:bg as string,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:800,fontSize:9,flexShrink:0}}>{i as string}</div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:10,fontWeight:600,color:'#e5e7eb'}}>{n as string}</div>
                          <div style={{fontSize:8,color:'#6b7280'}}>{r as string}</div>
                        </div>
                        <div style={{background:sbg as string,color:sc as string,borderRadius:6,fontSize:10,fontWeight:800,padding:'1px 6px'}}>{s as string}</div>
                      </div>
                    ))}
                  </div>

                  {/* AI Feed */}
                  <div style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.07)',borderRadius:10,padding:'.75rem'}}>
                    <div style={{fontSize:10,fontWeight:700,color:'#e5e7eb',marginBottom:'.625rem'}}>AI Activity</div>
                    {[
                      ['#34d399','Resume Parsed','Abhi C S · 9 skills extracted'],
                      ['#818cf8','94% Match Found','Abhi matched SDE Intern role'],
                      ['#fbbf24','AI Recommendation','2 new candidates for Backend role'],
                      ['#34d399','Shortlisted','Priya K. moved to shortlist'],
                    ].map(([dot,title,desc],i)=>(
                      <div key={i} className="ai-item" style={{display:'flex',alignItems:'flex-start',gap:6,padding:'5px 6px',background:'rgba(255,255,255,.02)',border:'1px solid rgba(255,255,255,.05)',borderRadius:7,marginBottom:5}}>
                        <div style={{width:6,height:6,borderRadius:'50%',background:dot as string,marginTop:2,flexShrink:0}}/>
                        <div style={{fontSize:9,color:'#9ca3af',lineHeight:1.4}}><strong style={{fontWeight:600,color:'#e5e7eb'}}>{title}</strong> — {desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trusted by */}
      <div style={{padding:'2.5rem',borderTop:'1px solid rgba(255,255,255,.06)',borderBottom:'1px solid rgba(255,255,255,.06)',textAlign:'center',background:'rgba(255,255,255,.01)'}}>
        <div style={{fontSize:11,fontWeight:700,color:'#2d2d3a',letterSpacing:'.15em',textTransform:'uppercase',marginBottom:'1.5rem'}}>TRUSTED BY COMPANIES OF ALL SIZES</div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'3rem',flexWrap:'wrap'}}>
          {['Microsoft','Google','Airbnb','Spotify','Notion','Slack'].map(c=>(
            <div key={c} style={{fontSize:16,fontWeight:700,color:'#2d2d3a',letterSpacing:'-.3px'}}>{c}</div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{padding:'4rem 2.5rem',maxWidth:1200,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:'2.5rem'}}>
          <div style={{fontSize:26,fontWeight:900,color:'#fff',letterSpacing:'-1px',marginBottom:8}}>Built different from day one</div>
          <div style={{fontSize:14,color:'#6b7280'}}>Every feature designed around AI-first matching</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:14}}>
          {[
            ['🤖','rgba(99,102,241,.15)','AI-Powered Matching','We go beyond keywords to semantically match real skills and experience to the right roles.'],
            ['📄','rgba(139,92,246,.15)','Resume Understanding','Our AI reads and understands resumes like a human, extracting skills, context and intent.'],
            ['💬','rgba(6,182,212,.15)','Direct Messaging','Connect and chat directly with hiring managers within the platform. No middlemen.'],
            ['🛡️','rgba(16,185,129,.15)','Secure & Reliable','Enterprise-grade security with row-level data protection and full audit trails.'],
          ].map(([ic,bg,tt,dc])=>(
            <div key={tt as string} className="feature-card" style={{background:'rgba(255,255,255,.02)',border:'1px solid rgba(255,255,255,.07)',borderRadius:18,padding:'1.5rem'}}>
              <div style={{width:44,height:44,borderRadius:12,background:bg as string,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,marginBottom:14}}>{ic as string}</div>
              <div style={{fontSize:15,fontWeight:700,color:'#f1f1f1',marginBottom:8,letterSpacing:'-.2px'}}>{tt as string}</div>
              <div style={{fontSize:13,color:'#6b7280',lineHeight:1.65}}>{dc as string}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Split CTA */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,maxWidth:1200,margin:'0 auto',padding:'0 2.5rem 4rem'}}>
        <div style={{background:'rgba(99,102,241,.08)',border:'1px solid rgba(99,102,241,.2)',borderRadius:22,padding:'2.25rem',position:'relative',overflow:'hidden'}}>
          <div style={{fontSize:11,fontWeight:800,color:'#818cf8',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:14}}>For Candidates</div>
          <div style={{fontSize:22,fontWeight:800,color:'#fff',marginBottom:10,letterSpacing:'-.8px',lineHeight:1.2}}>Find your perfect role faster</div>
          <div style={{fontSize:13,color:'#6b7280',lineHeight:1.8,marginBottom:'1.5rem'}}>Upload your resume, add your skills, and let AI find jobs where you're genuinely the best fit.</div>
          <Link href="/signup">
            <button className="cta-btn" style={{padding:'11px 24px',background:'#6366f1',border:'none',borderRadius:10,color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'Inter,sans-serif',boxShadow:'0 0 20px rgba(99,102,241,.3)',transition:'all .2s'}}>Get started →</button>
          </Link>
        </div>
        <div style={{background:'rgba(16,185,129,.06)',border:'1px solid rgba(16,185,129,.2)',borderRadius:22,padding:'2.25rem'}}>
          <div style={{fontSize:11,fontWeight:800,color:'#34d399',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:14}}>For Companies</div>
          <div style={{fontSize:22,fontWeight:800,color:'#fff',marginBottom:10,letterSpacing:'-.8px',lineHeight:1.2}}>Find the right candidate fast</div>
          <div style={{fontSize:13,color:'#6b7280',lineHeight:1.8,marginBottom:'1.5rem'}}>Post a job and AI instantly ranks all candidates by how well they fit your requirements.</div>
          <Link href="/signup?role=company">
            <button className="cta-btn" style={{padding:'11px 24px',background:'#059669',border:'none',borderRadius:10,color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'Inter,sans-serif',boxShadow:'0 0 20px rgba(16,185,129,.3)',transition:'all .2s'}}>Post a job →</button>
          </Link>
        </div>
      </div>

      {/* Final CTA */}
      <div style={{textAlign:'center',padding:'5rem 2rem',borderTop:'1px solid rgba(255,255,255,.06)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:500,height:500,background:'radial-gradient(circle,rgba(99,102,241,.06) 0%,transparent 70%)',pointerEvents:'none'}}/>
        <div style={{fontSize:30,fontWeight:900,color:'#fff',letterSpacing:'-1.5px',marginBottom:8,position:'relative',zIndex:1}}>Ready to hire smarter?</div>
        <div style={{fontSize:14,color:'#6b7280',marginBottom:'1.75rem',position:'relative',zIndex:1}}>Join thousands of candidates and companies on HireWise</div>
        <Link href="/signup">
          <button className="glow-btn" style={{padding:'14px 40px',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',border:'none',borderRadius:14,color:'#fff',fontSize:16,fontWeight:800,cursor:'pointer',fontFamily:'Inter,sans-serif',position:'relative',zIndex:1,transition:'all .25s'}}>
            Get started free →
          </button>
        </Link>
      </div>
    </>
  )
}
