export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'

const companies = [
  { name:'Razorpay', industry:'Fintech', location:'Bangalore', size:'1,000–5,000', jobs:4, color:'#2563eb', desc:'India\'s leading payment gateway, building financial infrastructure for businesses.' },
  { name:'Swiggy', industry:'Food Tech', location:'Bangalore', size:'5,000–10,000', jobs:7, color:'#f97316', desc:'India\'s on-demand delivery platform serving millions of orders daily.' },
  { name:'Zepto', industry:'Quick Commerce', location:'Mumbai', size:'1,000–5,000', jobs:3, color:'#8b5cf6', desc:'10-minute grocery delivery startup disrupting the quick commerce space.' },
  { name:'CRED', industry:'Fintech', location:'Bangalore', size:'500–1,000', jobs:5, color:'#6366f1', desc:'Members-only credit card bill payment platform with exclusive rewards.' },
  { name:'Meesho', industry:'E-Commerce', location:'Bangalore', size:'5,000–10,000', jobs:6, color:'#ec4899', desc:'Social commerce platform empowering millions of small businesses across India.' },
  { name:'Groww', industry:'Fintech', location:'Bangalore', size:'1,000–5,000', jobs:4, color:'#10b981', desc:'India\'s largest investment platform for stocks, mutual funds and more.' },
  { name:'PhonePe', industry:'Payments', location:'Bangalore', size:'5,000+', jobs:8, color:'#7c3aed', desc:'UPI-based payments app serving 500M+ registered users across India.' },
  { name:'BrowserStack', industry:'Dev Tools', location:'Mumbai', size:'1,000–5,000', jobs:3, color:'#f59e0b', desc:'Cloud-based testing platform used by developers at 50,000+ companies.' },
  { name:'Postman', industry:'Dev Tools', location:'Bangalore', size:'500–1,000', jobs:2, color:'#ef4444', desc:'API development platform used by 30M+ developers worldwide.' },
  { name:'Freshworks', industry:'SaaS', location:'Chennai', size:'5,000+', jobs:9, color:'#06b6d4', desc:'Global SaaS company building CRM, ITSM and customer support tools.' },
  { name:'Chargebee', industry:'SaaS', location:'Chennai', size:'500–1,000', jobs:3, color:'#818cf8', desc:'Subscription billing and revenue management for SaaS companies globally.' },
  { name:'Hasura', industry:'Dev Tools', location:'Bangalore', size:'100–500', jobs:2, color:'#1e40af', desc:'Instant GraphQL APIs on your data. Open-source and loved by developers.' },
]

export default function CompaniesPage() {
  return (
    <>
      <Navbar userRole={null} />
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fadeUp .5s ease forwards}
        .fade-up-1{animation:fadeUp .5s .1s ease both}
        .fade-up-2{animation:fadeUp .5s .2s ease both}
        .company-card{transition:all .25s}
        .company-card:hover{border-color:rgba(99,102,241,.4)!important;transform:translateY(-3px)!important;box-shadow:0 8px 30px rgba(0,0,0,.3)!important}
        .filter-btn{transition:all .2s}
        .filter-btn:hover{border-color:rgba(99,102,241,.4)!important;color:#e5e7eb!important}
        .view-btn{transition:all .2s}
        .view-btn:hover{background:#6366f1!important;color:#fff!important;border-color:#6366f1!important}
        .back-btn{transition:all .2s}
        .back-btn:hover{color:#e5e7eb!important;border-color:rgba(255,255,255,.2)!important}
        @media(max-width:768px){.companies-grid{grid-template-columns:1fr 1fr!important}}
        @media(max-width:480px){.companies-grid{grid-template-columns:1fr!important}}
      `}</style>

      <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,pointerEvents:'none',zIndex:0}}>
        <div style={{position:'absolute',top:'-10%',left:'20%',width:500,height:500,background:'radial-gradient(circle,rgba(99,102,241,.05) 0%,transparent 70%)'}}/>
      </div>

      <div style={{maxWidth:1100,margin:'0 auto',padding:'2.5rem 2rem',position:'relative',zIndex:1}}>

        {/* Back button */}
        <Link href="/" style={{textDecoration:'none'}}>
          <button className="back-btn" style={{display:'inline-flex',alignItems:'center',gap:6,padding:'7px 14px',background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',borderRadius:9,color:'#9ca3af',fontSize:13,fontWeight:500,cursor:'pointer',fontFamily:'Inter,sans-serif',marginBottom:'2rem'}}>
            ← Back
          </button>
        </Link>

        {/* Header */}
        <div className="fade-up" style={{textAlign:'center',marginBottom:'3rem'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'rgba(99,102,241,.1)',border:'1px solid rgba(99,102,241,.25)',borderRadius:999,padding:'5px 14px',fontSize:12,color:'#818cf8',fontWeight:700,marginBottom:16}}>
            🏢 Companies on HireWise
          </div>
          <h1 style={{fontSize:'clamp(1.8rem,4vw,2.75rem)',fontWeight:900,color:'#fff',letterSpacing:'-1.5px',marginBottom:10}}>
            Companies hiring right now
          </h1>
          <p style={{fontSize:14,color:'#6b7280',maxWidth:500,margin:'0 auto',lineHeight:1.7}}>
            These companies are actively looking for talent on HireWise. Sign up to see open roles and apply directly.
          </p>
        </div>

        {/* Industry filters */}
        <div className="fade-up-1" style={{display:'flex',gap:8,flexWrap:'wrap',justifyContent:'center',marginBottom:'2.5rem'}}>
          {['All','Fintech','Dev Tools','SaaS','E-Commerce','Food Tech','Payments'].map((ind, i) => (
            <button key={ind} className="filter-btn" style={{padding:'7px 16px',borderRadius:20,border:`1px solid ${i===0?'#6366f1':'rgba(255,255,255,.1)'}`,background:i===0?'#6366f1':'transparent',color:i===0?'#fff':'#9ca3af',fontSize:13,fontWeight:500,cursor:'pointer',fontFamily:'Inter,sans-serif'}}>
              {ind}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="companies-grid fade-up-2" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
          {companies.map(co => (
            <div key={co.name} className="company-card" style={{background:'rgba(255,255,255,.02)',border:'1px solid rgba(255,255,255,.07)',borderRadius:18,padding:'1.5rem'}}>
              <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:14}}>
                <div style={{width:48,height:48,borderRadius:12,background:`${co.color}20`,border:`1px solid ${co.color}30`,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,color:co.color,fontSize:18}}>
                  {co.name[0]}
                </div>
                <div style={{background:'rgba(16,185,129,.12)',color:'#34d399',border:'1px solid rgba(16,185,129,.25)',borderRadius:20,fontSize:11,fontWeight:700,padding:'3px 10px'}}>
                  {co.jobs} open roles
                </div>
              </div>
              <div style={{fontSize:16,fontWeight:700,color:'#f1f1f1',marginBottom:4,letterSpacing:'-.2px'}}>{co.name}</div>
              <div style={{display:'flex',gap:8,marginBottom:10,flexWrap:'wrap'}}>
                <span style={{fontSize:11,color:'#818cf8',background:'rgba(99,102,241,.1)',borderRadius:6,padding:'2px 8px',fontWeight:600}}>{co.industry}</span>
                <span style={{fontSize:11,color:'#6b7280'}}>📍 {co.location}</span>
              </div>
              <p style={{fontSize:12,color:'#6b7280',lineHeight:1.65,marginBottom:14}}>{co.desc}</p>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <span style={{fontSize:11,color:'#4b5563'}}>👥 {co.size} employees</span>
                <Link href="/signup">
                  <button className="view-btn" style={{padding:'6px 14px',background:'rgba(99,102,241,.12)',border:'1px solid rgba(99,102,241,.25)',borderRadius:8,color:'#818cf8',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'Inter,sans-serif'}}>
                    View roles →
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{textAlign:'center',marginTop:'3rem',padding:'2.5rem',background:'rgba(99,102,241,.06)',border:'1px solid rgba(99,102,241,.15)',borderRadius:20}}>
          <div style={{fontSize:20,fontWeight:800,color:'#fff',letterSpacing:'-.5px',marginBottom:8}}>Your company not listed?</div>
          <div style={{fontSize:13,color:'#6b7280',marginBottom:'1.25rem'}}>Sign up as a company and start finding the right talent with AI matching.</div>
          <Link href="/signup?role=company">
            <button style={{padding:'11px 28px',background:'#6366f1',border:'none',borderRadius:10,color:'#fff',fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:'Inter,sans-serif',boxShadow:'0 0 20px rgba(99,102,241,.3)'}}>
              Add your company →
            </button>
          </Link>
        </div>
      </div>
    </>
  )
}
