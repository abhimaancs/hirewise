export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'

export default function HowItWorksPage() {
  return (
    <>
      <Navbar userRole={null} />

      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
        @keyframes slideIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
        .fade-up{animation:fadeUp .5s ease forwards}
        .fade-up-1{animation:fadeUp .5s .1s ease both}
        .fade-up-2{animation:fadeUp .5s .2s ease both}
        .fade-up-3{animation:fadeUp .5s .3s ease both}
        .fade-up-4{animation:fadeUp .5s .4s ease both}
        .step-card{transition:all .3s!important}
        .step-card:hover{transform:translateY(-3px)!important;box-shadow:0 12px 40px rgba(0,0,0,.3)!important}
        .faq-item{transition:all .2s!important}
        .faq-item:hover{border-color:rgba(99,102,241,.3)!important;background:rgba(255,255,255,.04)!important}
        .cta-btn{transition:all .2s!important}
        .cta-btn:hover{transform:translateY(-2px)!important;filter:brightness(1.1)!important}
        .ai-dot{animation:pulse 2s infinite}
        .ai-item{animation:slideIn .4s ease both}
        .ai-item:nth-child(1){animation-delay:.1s}
        .ai-item:nth-child(2){animation-delay:.3s}
        .ai-item:nth-child(3){animation-delay:.5s}
        @media(max-width:768px){
          .steps-grid{grid-template-columns:1fr!important}
          .compare-grid{grid-template-columns:1fr!important}
          .roles-grid{grid-template-columns:1fr!important}
        }
      `}</style>

      <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,pointerEvents:'none',zIndex:0}}>
        <div style={{position:'absolute',top:'-10%',left:'20%',width:500,height:500,background:'radial-gradient(circle,rgba(99,102,241,.05) 0%,transparent 70%)'}}/>
        <div style={{position:'absolute',bottom:'10%',right:'10%',width:400,height:400,background:'radial-gradient(circle,rgba(16,185,129,.03) 0%,transparent 70%)'}}/>
      </div>

      <div style={{maxWidth:1100,margin:'0 auto',padding:'3rem 2rem',position:'relative',zIndex:1}}>

        {/* Header */}
        <div className="fade-up" style={{textAlign:'center',marginBottom:'4rem'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'rgba(99,102,241,.1)',border:'1px solid rgba(99,102,241,.25)',borderRadius:999,padding:'5px 14px',fontSize:12,color:'#818cf8',fontWeight:700,marginBottom:16}}>
            ✦ See how it works
          </div>
          <h1 style={{fontSize:'clamp(1.8rem,4vw,3rem)',fontWeight:900,color:'#fff',letterSpacing:'-1.5px',marginBottom:12}}>
            From resume to<br/>
            <span style={{background:'linear-gradient(135deg,#818cf8,#a78bfa)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>hired in 3 steps</span>
          </h1>
          <p style={{fontSize:15,color:'#6b7280',maxWidth:480,margin:'0 auto',lineHeight:1.8}}>
            HireWise uses AI to do what takes hours manually — in seconds. Here's exactly how it works.
          </p>
        </div>

        {/* Steps */}
        <div className="steps-grid fade-up-1" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20,marginBottom:'5rem',position:'relative'}}>
          {/* Connector */}
          <div style={{position:'absolute',top:44,left:'calc(33% + 20px)',width:'calc(34% - 40px)',height:2,background:'linear-gradient(90deg,rgba(99,102,241,.5),rgba(139,92,246,.5))',zIndex:0}}/>
          <div style={{position:'absolute',top:44,left:'calc(66% + 20px)',width:'calc(34% - 40px)',height:2,background:'linear-gradient(90deg,rgba(139,92,246,.5),rgba(16,185,129,.5))',zIndex:0}}/>

          {[
            {
              step:'01', icon:'📄', color:'#6366f1', bg:'rgba(99,102,241,.12)', border:'rgba(99,102,241,.25)',
              title:'Build your profile',
              desc:'Upload your resume or fill in your skills manually. Our AI reads your resume and automatically extracts your skills, experience level, and strengths — no manual work needed.',
              demo:(
                <div style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.07)',borderRadius:10,padding:'10px 12px',marginTop:14}}>
                  <div style={{fontSize:10,color:'#6b7280',marginBottom:8}}>📎 resume.pdf uploaded</div>
                  <div style={{fontSize:10,fontWeight:600,color:'#e5e7eb',marginBottom:6}}>Skills extracted:</div>
                  <div style={{display:'flex',flexWrap:'wrap',gap:4,marginBottom:8}}>
                    {['React','Node.js','TypeScript','DSA','MongoDB','C++'].map(s=>(
                      <span key={s} style={{background:'rgba(99,102,241,.12)',color:'#818cf8',border:'1px solid rgba(99,102,241,.2)',borderRadius:20,fontSize:10,padding:'2px 8px',fontWeight:600}}>{s}</span>
                    ))}
                  </div>
                  <div style={{fontSize:10,color:'#34d399',display:'flex',alignItems:'center',gap:5}}>
                    <span className="ai-dot" style={{width:6,height:6,background:'#34d399',borderRadius:'50%',display:'inline-block'}}/>
                    Resume Parsed Successfully — 9 skills found
                  </div>
                </div>
              )
            },
            {
              step:'02', icon:'🤖', color:'#8b5cf6', bg:'rgba(139,92,246,.12)', border:'rgba(139,92,246,.25)',
              title:'AI finds your matches',
              desc:'Our AI semantically understands your profile — not just keywords. It scores every available job from 0 to 100 based on how well your skills, experience, and context match the role.',
              demo:(
                <div style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.07)',borderRadius:10,padding:'10px 12px',marginTop:14}}>
                  <div style={{fontSize:10,fontWeight:600,color:'#e5e7eb',marginBottom:8}}>Your top matches:</div>
                  {[['Razorpay · SDE Intern','94%','#34d399','rgba(16,185,129,.15)'],['Swiggy · Full Stack Dev','88%','#34d399','rgba(16,185,129,.15)'],['Zepto · Backend Eng.','71%','#818cf8','rgba(99,102,241,.15)']].map(([job,score,sc,sbg])=>(
                    <div key={job} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'5px 0',borderBottom:'1px solid rgba(255,255,255,.05)'}}>
                      <span style={{fontSize:10,color:'#9ca3af'}}>{job}</span>
                      <span style={{background:sbg,color:sc,borderRadius:6,fontSize:10,fontWeight:800,padding:'1px 7px'}}>{score}</span>
                    </div>
                  ))}
                  <div style={{fontSize:10,color:'#818cf8',marginTop:8}}>✦ Matched on: React, Node.js, MongoDB</div>
                </div>
              )
            },
            {
              step:'03', icon:'💬', color:'#10b981', bg:'rgba(16,185,129,.12)', border:'rgba(16,185,129,.25)',
              title:'Apply & connect directly',
              desc:'Apply with one click and chat directly with hiring managers. No recruiters, no gatekeepers, no waiting weeks for a response. Real conversations that lead to real offers.',
              demo:(
                <div style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.07)',borderRadius:10,padding:'10px 12px',marginTop:14}}>
                  <div className="ai-item" style={{display:'flex',alignItems:'flex-start',gap:6,marginBottom:8}}>
                    <div style={{width:20,height:20,borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:8,fontWeight:800,flexShrink:0}}>R</div>
                    <div style={{background:'rgba(255,255,255,.06)',borderRadius:'8px 8px 8px 2px',padding:'5px 8px',fontSize:10,color:'#e5e7eb',lineHeight:1.4}}>Hi! You matched 94% with our SDE Intern role 🎉</div>
                  </div>
                  <div className="ai-item" style={{display:'flex',alignItems:'flex-start',gap:6,justifyContent:'flex-end'}}>
                    <div style={{background:'#6366f1',borderRadius:'8px 8px 2px 8px',padding:'5px 8px',fontSize:10,color:'#fff',lineHeight:1.4}}>Excited! When can we schedule a call?</div>
                    <div style={{width:20,height:20,borderRadius:'50%',background:'linear-gradient(135deg,#10b981,#06b6d4)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:8,fontWeight:800,flexShrink:0}}>A</div>
                  </div>
                </div>
              )
            }
          ].map(s => (
            <div key={s.step} className="step-card" style={{background:'rgba(255,255,255,.02)',border:`1px solid ${s.border}`,borderRadius:20,padding:'1.5rem',position:'relative',zIndex:1,boxShadow:`0 0 30px ${s.bg}`}}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
                <div style={{width:40,height:40,borderRadius:11,background:s.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>{s.icon}</div>
                <span style={{fontSize:11,fontWeight:800,color:s.color,letterSpacing:'.1em'}}>{s.step}</span>
              </div>
              <div style={{fontSize:16,fontWeight:700,color:'#f1f1f1',marginBottom:8,letterSpacing:'-.3px'}}>{s.title}</div>
              <div style={{fontSize:13,color:'#6b7280',lineHeight:1.7}}>{s.desc}</div>
              {s.demo}
            </div>
          ))}
        </div>

        {/* For candidates vs companies */}
        <div className="fade-up-2" style={{marginBottom:'5rem'}}>
          <div style={{textAlign:'center',marginBottom:'2rem'}}>
            <div style={{fontSize:22,fontWeight:800,color:'#fff',letterSpacing:'-.5px',marginBottom:8}}>Built for both sides</div>
            <div style={{fontSize:14,color:'#6b7280'}}>Whether you're looking for a job or looking to hire</div>
          </div>
          <div className="roles-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
            <div style={{background:'rgba(99,102,241,.06)',border:'1px solid rgba(99,102,241,.2)',borderRadius:20,padding:'2rem'}}>
              <div style={{fontSize:11,fontWeight:800,color:'#818cf8',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:16}}>For Candidates</div>
              {['Upload resume → AI extracts your skills automatically','Get matched to jobs with a 0–100 AI score','See why you matched — which skills align','Apply in one click','Chat directly with hiring managers','Track all your applications in one place'].map(item=>(
                <div key={item} style={{display:'flex',alignItems:'flex-start',gap:8,marginBottom:10}}>
                  <span style={{color:'#34d399',fontSize:13,flexShrink:0,marginTop:1}}>✓</span>
                  <span style={{fontSize:13,color:'#9ca3af',lineHeight:1.5}}>{item}</span>
                </div>
              ))}
              <Link href="/signup">
                <button className="cta-btn" style={{marginTop:16,padding:'10px 22px',background:'#6366f1',border:'none',borderRadius:10,color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'Inter,sans-serif',boxShadow:'0 0 20px rgba(99,102,241,.3)'}}>
                  Get started as candidate →
                </button>
              </Link>
            </div>
            <div style={{background:'rgba(16,185,129,.05)',border:'1px solid rgba(16,185,129,.2)',borderRadius:20,padding:'2rem'}}>
              <div style={{fontSize:11,fontWeight:800,color:'#34d399',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:16}}>For Companies</div>
              {['Post jobs with required skills','AI ranks all candidates by fit score — automatically','See each candidate\'s match reason and skills','Message top candidates directly','Manage applications with shortlist / reject','Track your hiring pipeline in real time'].map(item=>(
                <div key={item} style={{display:'flex',alignItems:'flex-start',gap:8,marginBottom:10}}>
                  <span style={{color:'#34d399',fontSize:13,flexShrink:0,marginTop:1}}>✓</span>
                  <span style={{fontSize:13,color:'#9ca3af',lineHeight:1.5}}>{item}</span>
                </div>
              ))}
              <Link href="/signup?role=company">
                <button className="cta-btn" style={{marginTop:16,padding:'10px 22px',background:'#059669',border:'none',borderRadius:10,color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'Inter,sans-serif',boxShadow:'0 0 20px rgba(16,185,129,.3)'}}>
                  Get started as company →
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="fade-up-3" style={{marginBottom:'4rem'}}>
          <div style={{textAlign:'center',marginBottom:'2rem'}}>
            <div style={{fontSize:22,fontWeight:800,color:'#fff',letterSpacing:'-.5px',marginBottom:8}}>Frequently asked questions</div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {[
              ['How does AI matching work?','Our AI reads your resume and skills, then scores each job from 0–100 based on semantic similarity — meaning it understands context, not just exact keywords. React experience will match a ReactJS job even if the words differ.'],
              ['Is HireWise free to use?','Yes — signing up and finding AI matches is completely free for candidates. Companies pay to post jobs and access the candidate ranking features.'],
              ['How accurate is the AI matching?','The match score is a strong signal but not a guarantee. It considers skill overlap, experience level, and role context. We recommend applying to jobs with 70%+ match scores for best results.'],
              ['Can companies see my profile without me applying?','No — companies can only see your profile after you apply to their job or if they have an active job posting that matches your skills.'],
              ['How is this different from LinkedIn or Naukri?','LinkedIn and Naukri use keyword-based search. HireWise uses semantic AI — it understands what you can do, not just what words appear on your resume. You get ranked results with explanations, not a sea of irrelevant listings.'],
            ].map(([q,a])=>(
              <div key={q} className="faq-item" style={{background:'rgba(255,255,255,.02)',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:'1.25rem'}}>
                <div style={{fontSize:14,fontWeight:700,color:'#f1f1f1',marginBottom:8}}>{q}</div>
                <div style={{fontSize:13,color:'#6b7280',lineHeight:1.7}}>{a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="fade-up-4" style={{textAlign:'center',padding:'3rem',background:'rgba(99,102,241,.06)',border:'1px solid rgba(99,102,241,.15)',borderRadius:24,position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:400,height:400,background:'radial-gradient(circle,rgba(99,102,241,.08) 0%,transparent 70%)',pointerEvents:'none'}}/>
          <div style={{position:'relative',zIndex:1}}>
            <div style={{fontSize:26,fontWeight:900,color:'#fff',letterSpacing:'-1px',marginBottom:8}}>Ready to try it?</div>
            <div style={{fontSize:14,color:'#6b7280',marginBottom:'1.75rem'}}>Sign up in 30 seconds. No credit card required.</div>
            <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
              <Link href="/signup">
                <button className="cta-btn" style={{padding:'12px 28px',background:'#6366f1',border:'none',borderRadius:12,color:'#fff',fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:'Inter,sans-serif',boxShadow:'0 0 24px rgba(99,102,241,.35)'}}>
                  Find my matches →
                </button>
              </Link>
              <Link href="/signup?role=company">
                <button className="cta-btn" style={{padding:'12px 28px',background:'transparent',border:'1px solid rgba(255,255,255,.15)',borderRadius:12,color:'#d1d5db',fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:'Inter,sans-serif'}}>
                  Post a job
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
