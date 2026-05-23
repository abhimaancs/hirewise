export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'

const jobs = [
  { title:'Frontend Engineer', company:'Razorpay', location:'Bangalore', type:'Full-time', salary:'₹18–28 LPA', skills:['React','TypeScript','GraphQL'], color:'#2563eb', posted:'2 days ago' },
  { title:'SDE Intern', company:'Swiggy', location:'Remote', type:'Internship', salary:'₹50K/month', skills:['Node.js','React','MongoDB'], color:'#f97316', posted:'1 day ago' },
  { title:'Backend Engineer', company:'Zepto', location:'Mumbai', type:'Full-time', salary:'₹15–22 LPA', skills:['Go','PostgreSQL','Kafka'], color:'#8b5cf6', posted:'3 days ago' },
  { title:'Full Stack Developer', company:'CRED', location:'Bangalore', type:'Full-time', salary:'₹20–35 LPA', skills:['React','Node.js','AWS'], color:'#6366f1', posted:'5 days ago' },
  { title:'iOS Developer', company:'Meesho', location:'Bangalore', type:'Full-time', salary:'₹16–24 LPA', skills:['Swift','Xcode','UIKit'], color:'#ec4899', posted:'1 week ago' },
  { title:'Data Engineer', company:'Groww', location:'Bangalore', type:'Full-time', salary:'₹18–26 LPA', skills:['Python','Spark','Airflow'], color:'#10b981', posted:'2 days ago' },
  { title:'DevOps Engineer', company:'PhonePe', location:'Bangalore', type:'Full-time', salary:'₹20–32 LPA', skills:['Kubernetes','Docker','AWS'], color:'#7c3aed', posted:'4 days ago' },
  { title:'Product Designer', company:'Freshworks', location:'Chennai', type:'Full-time', salary:'₹14–20 LPA', skills:['Figma','Design Systems','Prototyping'], color:'#06b6d4', posted:'6 days ago' },
  { title:'ML Engineer', company:'BrowserStack', location:'Mumbai', type:'Full-time', salary:'₹22–35 LPA', skills:['Python','PyTorch','MLOps'], color:'#f59e0b', posted:'3 days ago' },
  { title:'React Native Developer', company:'Postman', location:'Remote', type:'Full-time', salary:'₹16–26 LPA', skills:['React Native','JavaScript','REST APIs'], color:'#ef4444', posted:'1 week ago' },
  { title:'Site Reliability Engineer', company:'Chargebee', location:'Chennai', type:'Full-time', salary:'₹18–28 LPA', skills:['Linux','Terraform','GCP'], color:'#818cf8', posted:'2 days ago' },
  { title:'Backend Intern', company:'Hasura', location:'Remote', type:'Internship', salary:'₹40K/month', skills:['Go','GraphQL','PostgreSQL'], color:'#1e40af', posted:'5 days ago' },
]

export default function BrowseJobsPage() {
  return (
    <>
      <Navbar userRole={null} />
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fadeUp .5s ease forwards}
        .fade-up-1{animation:fadeUp .5s .1s ease both}
        .fade-up-2{animation:fadeUp .5s .2s ease both}
        .job-card{transition:all .25s}
        .job-card:hover{border-color:rgba(99,102,241,.4)!important;transform:translateY(-2px)!important;box-shadow:0 8px 30px rgba(0,0,0,.3)!important}
        .apply-btn{transition:all .2s}
        .apply-btn:hover{background:#6366f1!important;color:#fff!important;border-color:#6366f1!important}
        .filter-btn{transition:all .2s}
        .filter-btn:hover{border-color:rgba(99,102,241,.4)!important;color:#e5e7eb!important}
        .back-btn{transition:all .2s}
        .back-btn:hover{color:#e5e7eb!important;border-color:rgba(255,255,255,.2)!important}
        @media(max-width:768px){.jobs-grid{grid-template-columns:1fr!important}}
      `}</style>

      <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,pointerEvents:'none',zIndex:0}}>
        <div style={{position:'absolute',top:'-10%',right:'10%',width:500,height:500,background:'radial-gradient(circle,rgba(99,102,241,.05) 0%,transparent 70%)'}}/>
      </div>

      <div style={{maxWidth:1100,margin:'0 auto',padding:'2.5rem 2rem',position:'relative',zIndex:1}}>

        {/* Back button */}
        <Link href="/" style={{textDecoration:'none'}}>
          <button className="back-btn" style={{display:'inline-flex',alignItems:'center',gap:6,padding:'7px 14px',background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',borderRadius:9,color:'#9ca3af',fontSize:13,fontWeight:500,cursor:'pointer',fontFamily:'Inter,sans-serif',marginBottom:'2rem'}}>
            ← Back
          </button>
        </Link>

        {/* Header */}
        <div className="fade-up" style={{marginBottom:'2rem'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'rgba(99,102,241,.1)',border:'1px solid rgba(99,102,241,.25)',borderRadius:999,padding:'5px 14px',fontSize:12,color:'#818cf8',fontWeight:700,marginBottom:16}}>
            💼 {jobs.length} jobs available
          </div>
          <h1 style={{fontSize:'clamp(1.8rem,4vw,2.75rem)',fontWeight:900,color:'#fff',letterSpacing:'-1.5px',marginBottom:10}}>
            Browse open positions
          </h1>
          <p style={{fontSize:14,color:'#6b7280',maxWidth:500,lineHeight:1.7}}>
            Sign up to get AI-matched to the best roles for your skills. The right job finds you.
          </p>
        </div>

        {/* Search + filters */}
        <div className="fade-up-1" style={{marginBottom:'1.5rem'}}>
          <div style={{display:'flex',gap:10,marginBottom:12,flexWrap:'wrap'}}>
            <div style={{position:'relative',flex:1,minWidth:200}}>
              <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#4b5563',fontSize:14}}>🔍</span>
              <input placeholder="Search by role, skill, or company..." style={{paddingLeft:36,background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',borderRadius:10,color:'#f1f1f1',fontSize:14,height:44}}/>
            </div>
            <Link href="/signup">
              <button style={{padding:'0 24px',height:44,background:'#6366f1',border:'none',borderRadius:10,color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'Inter,sans-serif',boxShadow:'0 0 20px rgba(99,102,241,.3)',whiteSpace:'nowrap'}}>
                Get AI matches →
              </button>
            </Link>
          </div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {['All','Full-time','Internship','Remote','Bangalore','Mumbai','Chennai'].map((f,i)=>(
              <button key={f} className="filter-btn" style={{padding:'6px 14px',borderRadius:20,border:`1px solid ${i===0?'#6366f1':'rgba(255,255,255,.1)'}`,background:i===0?'#6366f1':'transparent',color:i===0?'#fff':'#9ca3af',fontSize:12,fontWeight:500,cursor:'pointer',fontFamily:'Inter,sans-serif',whiteSpace:'nowrap'}}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* AI Match Banner */}
        <div className="fade-up-1" style={{background:'rgba(99,102,241,.08)',border:'1px solid rgba(99,102,241,.2)',borderRadius:14,padding:'1rem 1.25rem',marginBottom:'1.5rem',display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
          <div style={{width:36,height:36,background:'#6366f1',borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0}}>✦</div>
          <div style={{flex:1,minWidth:200}}>
            <div style={{fontSize:13,fontWeight:700,color:'#e5e7eb'}}>Sign up to unlock AI matching</div>
            <div style={{fontSize:12,color:'#6b7280'}}>Upload your resume and see which jobs match your skills — with % scores and reasons</div>
          </div>
          <Link href="/signup">
            <button style={{padding:'7px 16px',background:'#6366f1',border:'none',borderRadius:8,color:'#fff',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'Inter,sans-serif',whiteSpace:'nowrap'}}>Try for free</button>
          </Link>
        </div>

        {/* Jobs grid */}
        <div className="jobs-grid fade-up-2" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:14}}>
          {jobs.map(job => (
            <div key={`${job.title}-${job.company}`} className="job-card" style={{background:'rgba(255,255,255,.02)',border:'1px solid rgba(255,255,255,.07)',borderRadius:18,padding:'1.25rem'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
                <div style={{width:44,height:44,borderRadius:12,background:`${job.color}20`,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,color:job.color,fontSize:16}}>{job.company[0]}</div>
                <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4}}>
                  <span style={{background:'rgba(255,255,255,.06)',color:'#9ca3af',borderRadius:20,fontSize:10,fontWeight:600,padding:'2px 8px',textTransform:'capitalize'}}>{job.type}</span>
                  <span style={{fontSize:10,color:'#4b5563'}}>{job.posted}</span>
                </div>
              </div>
              <div style={{fontSize:15,fontWeight:700,color:'#f1f1f1',marginBottom:3,letterSpacing:'-.2px'}}>{job.title}</div>
              <div style={{fontSize:12,color:'#6b7280',marginBottom:10}}>{job.company} · 📍 {job.location}</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:5,marginBottom:14}}>
                {job.skills.map(s=>(
                  <span key={s} style={{background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.08)',color:'#9ca3af',borderRadius:7,fontSize:11,padding:'3px 8px',fontWeight:500}}>{s}</span>
                ))}
              </div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontSize:14,fontWeight:700,color:'#818cf8',letterSpacing:'-.3px'}}>{job.salary}</span>
                <Link href="/signup">
                  <button className="apply-btn" style={{padding:'7px 14px',background:'rgba(99,102,241,.12)',border:'1px solid rgba(99,102,241,.25)',borderRadius:8,color:'#818cf8',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'Inter,sans-serif'}}>
                    Apply →
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{textAlign:'center',marginTop:'3rem',padding:'2.5rem',background:'rgba(99,102,241,.06)',border:'1px solid rgba(99,102,241,.15)',borderRadius:20}}>
          <div style={{fontSize:20,fontWeight:800,color:'#fff',letterSpacing:'-.5px',marginBottom:8}}>Get matched to the right job with AI</div>
          <div style={{fontSize:13,color:'#6b7280',marginBottom:'1.25rem'}}>Don't apply blindly. Sign up and let AI show you where you genuinely fit best.</div>
          <Link href="/signup">
            <button style={{padding:'11px 28px',background:'#6366f1',border:'none',borderRadius:10,color:'#fff',fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:'Inter,sans-serif',boxShadow:'0 0 20px rgba(99,102,241,.3)'}}>
              Get AI matches →
            </button>
          </Link>
        </div>
      </div>
    </>
  )
}
