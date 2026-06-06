export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'

export default function HomePage() {
  return (
    <>
      <Navbar userRole={null} />

      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.9)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}
        @keyframes glow{0%,100%{box-shadow:0 0 25px rgba(99,102,241,.3)}50%{box-shadow:0 0 50px rgba(99,102,241,.6)}}
        @keyframes barGrow{from{width:0}to{width:var(--w)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        .fade-up{animation:fadeUp .6s ease forwards}
        .fade-up-1{animation:fadeUp .6s .1s ease both}
        .fade-up-2{animation:fadeUp .6s .2s ease both}
        .fade-up-3{animation:fadeUp .6s .3s ease both}
        .fade-up-4{animation:fadeUp .6s .4s ease both}
        .fade-up-5{animation:fadeUp .6s .5s ease both}
        .glow-btn{animation:glow 3s ease-in-out infinite}
        .badge-dot{width:6px;height:6px;background:#818cf8;border-radius:50%;display:inline-block;animation:pulse 2s infinite;margin-right:6px;vertical-align:middle}
        .ai-item{animation:slideIn .4s ease forwards;opacity:0}
        .ai-item:nth-child(1){animation-delay:.2s}
        .ai-item:nth-child(2){animation-delay:.5s}
        .ai-item:nth-child(3){animation-delay:.8s}
        .ai-item:nth-child(4){animation-delay:1.1s}
        .bar-fill{animation:barGrow .9s .3s ease forwards;width:0}
        .btn-hero{transition:all .25s!important}
        .btn-hero:hover{transform:translateY(-3px)!important;box-shadow:0 0 50px rgba(99,102,241,.6)!important}
        .btn-outline-hero{transition:all .2s!important}
        .btn-outline-hero:hover{background:rgba(255,255,255,.08)!important;border-color:rgba(255,255,255,.3)!important;transform:translateY(-1px)!important}
        .feature-card{transition:all .3s!important}
        .feature-card:hover{border-color:rgba(99,102,241,.4)!important;transform:translateY(-4px)!important;box-shadow:0 12px 40px rgba(0,0,0,.4)!important}
        .step-card{transition:all .3s!important}
        .step-card:hover{border-color:rgba(99,102,241,.35)!important;transform:translateY(-3px)!important}
        .cta-btn{transition:all .2s!important}
        .cta-btn:hover{transform:translateY(-2px)!important;filter:brightness(1.1)!important}
        .db-link-h:hover{background:rgba(255,255,255,.04)!important;color:#9ca3af!important}

        @media(max-width:768px){
          .hero-grid{grid-template-columns:1fr!important;gap:2rem!important;padding:3rem 1.25rem 2rem!important}
          .dashboard{display:none!important}
          .features-grid{grid-template-columns:1fr 1fr!important}
          .split-cta{grid-template-columns:1fr!important}
          .steps-grid{grid-template-columns:1fr!important}
          .hero-title{font-size:2.5rem!important;letter-spacing:-1.5px!important}
          .hero-pills{flex-wrap:wrap!important}
          .hero-pill{min-width:calc(50% - 5px)!important}
          .trusted-logos{gap:1.5rem!important}
        }
        @media(max-width:480px){
          .features-grid{grid-template-columns:1fr!important}
          .hero-title{font-size:2rem!important}
          .nav-links-desktop{display:none!important}
        }
      `}</style>

      {/* Background glow */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '30%', width: 600, height: 600, background: 'radial-gradient(circle,rgba(99,102,241,.06) 0%,transparent 70%)' }} />
        <div style={{ position: 'absolute', top: '40%', right: '-10%', width: 500, height: 500, background: 'radial-gradient(circle,rgba(139,92,246,.04) 0%,transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '10%', width: 400, height: 400, background: 'radial-gradient(circle,rgba(16,185,129,.03) 0%,transparent 70%)' }} />
      </div>

      {/* HERO */}
      <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center', padding: '5rem 2.5rem 3rem', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Left */}
        <div>
          <div className="fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(99,102,241,.1)', border: '1px solid rgba(99,102,241,.25)', borderRadius: 999, padding: '5px 14px', fontSize: 12, color: '#818cf8', fontWeight: 700, marginBottom: '1.5rem' }}>
            <span className="badge-dot" />AI-Powered Hiring Platform
          </div>

          <h1 className="hero-title fade-up-1" style={{ fontSize: 'clamp(2.2rem,4vw,3.5rem)', fontWeight: 900, lineHeight: 1.05, color: '#fff', marginBottom: '1rem', letterSpacing: '-2px' }}>
            Hire Smarter<br />
            <span style={{ background: 'linear-gradient(135deg,#818cf8,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>with AI</span>
          </h1>

          <p className="fade-up-2" style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.8, marginBottom: '2rem', maxWidth: 400 }}>
            HireWise uses AI to match the right talent to the right roles, and help companies build amazing teams — faster.
          </p>

          <div className="fade-up-3" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            <Link href="/signup">
              <button className="btn-hero glow-btn" style={{ padding: '13px 28px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter,sans-serif', boxShadow: '0 0 30px rgba(99,102,241,.35)' }}>
                Find Jobs →
              </button>
            </Link>
            <Link href="/signup?role=company">
              <button className="btn-outline-hero" style={{ padding: '13px 28px', background: 'transparent', border: '1px solid rgba(255,255,255,.15)', borderRadius: 12, color: '#d1d5db', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>
                Post a Job
              </button>
            </Link>
          </div>

          {/* Feature pills */}
          <div className="hero-pills fade-up-4" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[['📄', 'PDF Resume Upload', 'Store your resume securely'], ['🎯', 'Semantic Matching', 'Beyond keyword search'], ['💬', 'Direct Messaging', 'No recruiters needed']].map(([ic, tt, dc]) => (
              <div key={tt as string} className="hero-pill" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 12, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 120 }}>
                <span style={{ fontSize: 15 }}>{ic as string}</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#e5e7eb', marginBottom: 1 }}>{tt as string}</div>
                  <div style={{ fontSize: 10, color: '#6b7280' }}>{dc as string}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard preview */}
        <div className="dashboard fade-up-5" style={{ background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 20, overflow: 'hidden', position: 'relative', boxShadow: '0 0 60px rgba(99,102,241,.08)' }}>
          <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, background: 'radial-gradient(circle,rgba(99,102,241,.08) 0%,transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '.875rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,.06)', position: 'relative', zIndex: 1 }}>
            <div style={{ width: 26, height: 26, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 12, color: '#fff' }}>H</div>
            <div style={{ flex: 1, marginLeft: '.875rem' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Welcome back, Rahul 👋</div>
              <div style={{ fontSize: 10, color: '#6b7280' }}>Here's your hiring overview</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ position: 'relative', width: 24, height: 24, background: 'rgba(255,255,255,.06)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>🔔<div style={{ position: 'absolute', top: 3, right: 3, width: 5, height: 5, background: '#ef4444', borderRadius: '50%' }} /></div>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 9 }}>RK</div>
              <div style={{ fontSize: 10, color: '#9ca3af' }}><div style={{ color: '#e5e7eb', fontWeight: 600, fontSize: 11 }}>Rahul Kumar</div>TechStartup India</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', position: 'relative', zIndex: 1 }}>
            <div style={{ background: 'rgba(255,255,255,.02)', borderRight: '1px solid rgba(255,255,255,.06)', padding: '.875rem .625rem' }}>
              {[['🏠', 'Overview', true], ['💼', 'Jobs', false], ['👥', 'Candidates', false], ['💬', 'Messages', false], ['📊', 'Analytics', false], ['⚙️', 'Settings', false]].map(([ic, lb, ac]) => (
                <div key={lb as string} className={!ac ? 'db-link-h' : ''} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 8px', borderRadius: 7, fontSize: 10, color: ac ? '#818cf8' : '#6b7280', background: ac ? 'rgba(99,102,241,.15)' : 'transparent', fontWeight: ac ? 600 : 400, cursor: 'pointer', marginBottom: 2 }}>
                  <span>{ic as string}</span><span>{lb as string}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: '.875rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, marginBottom: '.875rem' }}>
                {[['💼', 'Active Jobs', '8', '↑ 2 this week'], ['👥', 'Applicants', '143', '↑ 31 this week'], ['🎯', 'Avg. Match', '76%', '↑ 4% this week'], ['✅', 'Hired', '3', '↑ 1 this week']].map(([ic, lb, vl, tr]) => (
                  <div key={lb as string} style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 10, padding: '.625rem .75rem' }}>
                    <div style={{ fontSize: 13, marginBottom: 4 }}>{ic as string}</div>
                    <div style={{ fontSize: 8, color: '#6b7280', marginBottom: 3 }}>{lb as string}</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-.5px' }}>{vl as string}</div>
                    <div style={{ fontSize: 8, color: '#34d399', marginTop: 2 }}>{tr as string}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 10, padding: '.75rem' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#e5e7eb', marginBottom: '.625rem' }}>Match Distribution</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <svg width="56" height="56" viewBox="0 0 56 56">
                        <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="8" />
                        <circle cx="28" cy="28" r="22" fill="none" stroke="#6366f1" strokeWidth="8" strokeDasharray="55 83" strokeDashoffset="0" strokeLinecap="round" />
                        <circle cx="28" cy="28" r="22" fill="none" stroke="#10b981" strokeWidth="8" strokeDasharray="44 83" strokeDashoffset="-55" strokeLinecap="round" />
                        <circle cx="28" cy="28" r="22" fill="none" stroke="#f59e0b" strokeWidth="8" strokeDasharray="22 83" strokeDashoffset="-99" strokeLinecap="round" />
                        <circle cx="28" cy="28" r="22" fill="none" stroke="#ef4444" strokeWidth="8" strokeDasharray="10 83" strokeDashoffset="-121" strokeLinecap="round" />
                        <text x="28" y="26" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="800">143</text>
                        <text x="28" y="34" textAnchor="middle" fill="#6b7280" fontSize="6">Total</text>
                      </svg>
                      <div style={{ flex: 1 }}>
                        {[['#6366f1', '80-100%', '39%'], ['#10b981', '60-80%', '31%'], ['#f59e0b', '40-60%', '18%'], ['#ef4444', '0-40%', '12%']].map(([c, l, v]) => (
                          <div key={l} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: c as string }} /><span style={{ fontSize: 8, color: '#9ca3af' }}>{l}</span></div>
                            <span style={{ fontSize: 8, fontWeight: 700, color: '#e5e7eb' }}>{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 10, padding: '.75rem' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#e5e7eb', marginBottom: '.625rem' }}>Top Skills in Demand</div>
                    {[['React', '78%', 'linear-gradient(90deg,#6366f1,#8b5cf6)'], ['Node.js', '65%', 'linear-gradient(90deg,#06b6d4,#3b82f6)'], ['Python', '52%', 'linear-gradient(90deg,#10b981,#06b6d4)'], ['TypeScript', '44%', 'linear-gradient(90deg,#f59e0b,#ef4444)']].map(([sk, pct, bg]) => (
                      <div key={sk} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                        <span style={{ fontSize: 9, color: '#9ca3af', width: 48, textAlign: 'right', flexShrink: 0 }}>{sk}</span>
                        <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,.06)', borderRadius: 3, overflow: 'hidden' }}>
                          <div className="bar-fill" style={{ height: '100%', borderRadius: 3, background: bg, '--w': pct } as any} />
                        </div>
                        <span style={{ fontSize: 9, fontWeight: 700, color: '#e5e7eb', width: 26 }}>{pct}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 10, padding: '.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.625rem' }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#e5e7eb' }}>Top Matched</span>
                      <span style={{ fontSize: 9, color: '#818cf8' }}>View all</span>
                    </div>
                    {[['AB', 'Abhi C S', 'SDE Intern', '94%', 'linear-gradient(135deg,#6366f1,#8b5cf6)', '#34d399', 'rgba(16,185,129,.15)'], ['PK', 'Priya Kumar', 'Full Stack Dev', '88%', 'linear-gradient(135deg,#06b6d4,#3b82f6)', '#34d399', 'rgba(16,185,129,.15)'], ['RM', 'Rahul M', 'Backend Eng.', '71%', 'linear-gradient(135deg,#f59e0b,#ef4444)', '#818cf8', 'rgba(99,102,241,.15)']].map(([i, n, r, s, bg, sc, sbg]) => (
                      <div key={n as string} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7 }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: bg as string, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 9, flexShrink: 0 }}>{i as string}</div>
                        <div style={{ flex: 1 }}><div style={{ fontSize: 10, fontWeight: 600, color: '#e5e7eb' }}>{n as string}</div><div style={{ fontSize: 8, color: '#6b7280' }}>{r as string}</div></div>
                        <div style={{ background: sbg as string, color: sc as string, borderRadius: 6, fontSize: 10, fontWeight: 800, padding: '1px 6px' }}>{s as string}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 10, padding: '.75rem' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#e5e7eb', marginBottom: '.625rem' }}>AI Activity</div>
                    {[['#34d399', 'Profile Updated', 'Abhi C S · 5 skills added'], ['#818cf8', '94% Match Found', 'Abhi matched SDE Intern role'], ['#fbbf24', 'AI Recommendation', '2 new candidates for Backend'], ['#34d399', 'Shortlisted', 'Priya K. moved to shortlist']].map(([dot, title, desc], i) => (
                      <div key={i} className="ai-item" style={{ display: 'flex', alignItems: 'flex-start', gap: 6, padding: '5px 6px', background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.05)', borderRadius: 7, marginBottom: 5 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: dot as string, marginTop: 2, flexShrink: 0 }} />
                        <div style={{ fontSize: 9, color: '#9ca3af', lineHeight: 1.4 }}><strong style={{ fontWeight: 600, color: '#e5e7eb' }}>{title}</strong> — {desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS - Interactive Flow */}
      <div style={{ padding: '4rem 2.5rem', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.2)', borderRadius: 999, padding: '4px 12px', fontSize: 11, color: '#34d399', fontWeight: 700, marginBottom: 12 }}>
            ✦ See it in action
          </div>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: '-1px', marginBottom: 8 }}>How HireWise works</div>
          <div style={{ fontSize: 14, color: '#6b7280' }}>Three steps to your perfect match</div>
        </div>

        <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, position: 'relative' }}>
          {/* Connector lines */}
          <div style={{ position: 'absolute', top: 40, left: 'calc(33% - 10px)', width: 'calc(34% + 20px)', height: 2, background: 'linear-gradient(90deg,rgba(99,102,241,.4),rgba(99,102,241,.4))', zIndex: 0, display: 'none' }} />

          {[
            {
              step: '01', icon: '👤', color: '#6366f1', bg: 'rgba(99,102,241,.12)', border: 'rgba(99,102,241,.25)',
              title: 'Build Your Profile',
              desc: 'Add your skills, experience, and education manually. Upload your PDF resume for companies to view directly.',
              demo: (
                <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 10, padding: '10px 12px', marginTop: 12 }}>
                  <div style={{ fontSize: 10, color: '#6b7280', marginBottom: 6 }}>Profile completed</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {['React', 'Node.js', 'TypeScript', 'DSA', 'MongoDB'].map(s => (
                      <span key={s} style={{ background: 'rgba(99,102,241,.12)', color: '#818cf8', border: '1px solid rgba(99,102,241,.2)', borderRadius: 20, fontSize: 10, padding: '2px 8px', fontWeight: 600, animation: 'fadeUp .4s ease both' }}>{s}</span>
                    ))}
                  </div>
                  <div style={{ marginTop: 8, fontSize: 10, color: '#34d399', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 6, height: 6, background: '#34d399', borderRadius: '50%', display: 'inline-block' }} />
                    Profile ready — 5 skills added
                  </div>
                </div>
              )
            },
            {
              step: '02', icon: '🤖', color: '#8b5cf6', bg: 'rgba(139,92,246,.12)', border: 'rgba(139,92,246,.25)',
              title: 'AI Scores Your Matches',
              desc: 'Our AI semantically understands your profile and scores every job from 0–100 based on real fit — not just keywords.',
              demo: (
                <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 10, padding: '10px 12px', marginTop: 12 }}>
                  {[['Razorpay · SDE Intern', '94%', '#34d399', 'rgba(16,185,129,.15)'], ['Swiggy · Full Stack Dev', '88%', '#34d399', 'rgba(16,185,129,.15)'], ['Zepto · Backend Eng.', '71%', '#818cf8', 'rgba(99,102,241,.15)']].map(([job, score, sc, sbg]) => (
                    <div key={job} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
                      <span style={{ fontSize: 10, color: '#9ca3af' }}>{job}</span>
                      <span style={{ background: sbg, color: sc, borderRadius: 6, fontSize: 10, fontWeight: 800, padding: '1px 7px' }}>{score}</span>
                    </div>
                  ))}
                </div>
              )
            },
            {
              step: '03', icon: '💬', color: '#10b981', bg: 'rgba(16,185,129,.12)', border: 'rgba(16,185,129,.25)',
              title: 'Connect Directly',
              desc: 'Chat directly with hiring managers for your top matches. No recruiters, no spam, no gatekeepers.',
              demo: (
                <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 10, padding: '10px 12px', marginTop: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 6 }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 8, fontWeight: 800, flexShrink: 0 }}>R</div>
                    <div style={{ background: 'rgba(255,255,255,.06)', borderRadius: '8px 8px 8px 2px', padding: '5px 8px', fontSize: 10, color: '#e5e7eb', lineHeight: 1.4 }}>Hi! You matched 94% with our SDE Intern role 🎉</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, justifyContent: 'flex-end' }}>
                    <div style={{ background: '#6366f1', borderRadius: '8px 8px 2px 8px', padding: '5px 8px', fontSize: 10, color: '#fff', lineHeight: 1.4 }}>Excited to learn more! When can we chat?</div>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 8, fontWeight: 800, flexShrink: 0 }}>A</div>
                  </div>
                </div>
              )
            }
          ].map((s, i) => (
            <div key={s.step} className="step-card" style={{ background: 'rgba(255,255,255,.02)', border: `1px solid ${s.border}`, borderRadius: 18, padding: '1.5rem', position: 'relative', zIndex: 1, boxShadow: `0 0 30px ${s.bg}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{s.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 800, color: s.color, letterSpacing: '.1em' }}>{s.step}</div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f1f1', marginBottom: 8, letterSpacing: '-.2px' }}>{s.title}</div>
              <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.65 }}>{s.desc}</div>
              {s.demo}
              {i < 2 && <div style={{ position: 'absolute', top: '50%', right: '-28px', width: 20, height: 20, background: 'rgba(99,102,241,.2)', border: '1px solid rgba(99,102,241,.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#818cf8', zIndex: 2, transform: 'translateY(-50%)' }}>→</div>}
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link href="/signup">
            <button className="btn-hero glow-btn" style={{ padding: '13px 32px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter,sans-serif', boxShadow: '0 0 30px rgba(99,102,241,.35)' }}>
              Try it yourself — it's free →
            </button>
          </Link>
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ padding: '3rem 2.5rem', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: '-1px', marginBottom: 8 }}>Everything you need to get hired</div>
          <div style={{ fontSize: 14, color: '#6b7280' }}>Built for candidates and companies who want a smarter way to connect</div>
        </div>
        <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 14 }}>
          {[
            ['👤', 'rgba(99,102,241,.15)', 'Manual Profile Builder', 'Add your skills, experience, education and bio. Your profile drives AI matching — no parsing needed.'],
            ['🎯', 'rgba(139,92,246,.15)', 'Semantic Matching', 'Goes beyond keywords — understands context. React matches ReactJS, Backend matches Node.js.'],
            ['💬', 'rgba(6,182,212,.15)', 'Direct Messaging', 'Real-time chat with hiring managers. No middlemen, no delays, no spam.'],
            ['📊', 'rgba(245,158,11,.15)', 'Match Scores', 'See exactly why you matched a job and which of your skills align. Full transparency.'],
            ['📄', 'rgba(16,185,129,.15)', 'Cover Letter AI', 'One-click AI-generated cover letters tailored specifically to each job you apply for.'],
            ['🔒', 'rgba(239,68,68,.15)', 'Secure & Private', 'Your data is yours. Row-level security ensures only you can see your profile and applications.'],
          ].map(([ic, bg, tt, dc]) => (
            <div key={tt as string} className="feature-card" style={{ background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 18, padding: '1.5rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: bg as string, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 14 }}>{ic as string}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f1f1', marginBottom: 8, letterSpacing: '-.2px' }}>{tt as string}</div>
              <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.65 }}>{dc as string}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SPLIT CTA */}
      <div className="split-cta" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 1200, margin: '0 auto', padding: '0 2.5rem 4rem', position: 'relative', zIndex: 1 }}>
        <div style={{ background: 'rgba(99,102,241,.08)', border: '1px solid rgba(99,102,241,.2)', borderRadius: 22, padding: '2.25rem', boxShadow: '0 0 40px rgba(99,102,241,.05)' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 14 }}>For Candidates</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 10, letterSpacing: '-.8px', lineHeight: 1.2 }}>Find your perfect role faster</div>
          <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.8, marginBottom: '1.5rem' }}>Complete your profile, add your skills, and let AI find the jobs where you're genuinely the best fit. Apply in one click.</div>
          <Link href="/signup">
            <button className="cta-btn" style={{ padding: '11px 24px', background: '#6366f1', border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter,sans-serif', boxShadow: '0 0 20px rgba(99,102,241,.3)' }}>Get started →</button>
          </Link>
        </div>
        <div style={{ background: 'rgba(16,185,129,.06)', border: '1px solid rgba(16,185,129,.2)', borderRadius: 22, padding: '2.25rem', boxShadow: '0 0 40px rgba(16,185,129,.04)' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#34d399', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 14 }}>For Companies</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 10, letterSpacing: '-.8px', lineHeight: 1.2 }}>Find the right candidate fast</div>
          <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.8, marginBottom: '1.5rem' }}>Post a job and AI instantly ranks all candidates by how well they match. Message top candidates directly.</div>
          <Link href="/signup?role=company">
            <button className="cta-btn" style={{ padding: '11px 24px', background: '#059669', border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter,sans-serif', boxShadow: '0 0 20px rgba(16,185,129,.3)' }}>Post a job →</button>
          </Link>
        </div>
      </div>

      {/* FINAL CTA */}
      <div style={{ textAlign: 'center', padding: '5rem 2rem', borderTop: '1px solid rgba(255,255,255,.06)', position: 'relative', overflow: 'hidden', zIndex: 1 }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, background: 'radial-gradient(circle,rgba(99,102,241,.07) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ fontSize: 30, fontWeight: 900, color: '#fff', letterSpacing: '-1.5px', marginBottom: 8, position: 'relative', zIndex: 1 }}>Ready to hire smarter?</div>
        <div style={{ fontSize: 14, color: '#6b7280', marginBottom: '1.75rem', position: 'relative', zIndex: 1 }}>Join HireWise and let AI do the hard work</div>
        <Link href="/signup">
          <button className="btn-hero glow-btn" style={{ padding: '14px 40px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: 14, color: '#fff', fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: 'Inter,sans-serif', position: 'relative', zIndex: 1 }}>
            Get started free →
          </button>
        </Link>
      </div>
    </>
  )
}
