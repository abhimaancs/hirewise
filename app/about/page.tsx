export const dynamic = 'force-dynamic'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'

export default function AboutPage() {
  return (
    <>
      <Navbar userRole={null} />
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fadeUp .5s ease forwards}
        .fade-up-1{animation:fadeUp .5s .1s ease both}
        .fade-up-2{animation:fadeUp .5s .2s ease both}
        .team-card{transition:all .25s}
        .team-card:hover{border-color:rgba(99,102,241,.4)!important;transform:translateY(-3px)!important}
      `}</style>

      <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,pointerEvents:'none',zIndex:0}}>
        <div style={{position:'absolute',top:'-10%',right:'20%',width:500,height:500,background:'radial-gradient(circle,rgba(99,102,241,.05) 0%,transparent 70%)'}}/>
      </div>

      <div style={{maxWidth:900,margin:'0 auto',padding:'4rem 2rem',position:'relative',zIndex:1}}>

        {/* Header */}
        <div className="fade-up" style={{textAlign:'center',marginBottom:'4rem'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'rgba(99,102,241,.1)',border:'1px solid rgba(99,102,241,.25)',borderRadius:999,padding:'5px 14px',fontSize:12,color:'#818cf8',fontWeight:700,marginBottom:16}}>
            ✦ About HireWise
          </div>
          <h1 style={{fontSize:'clamp(2rem,4vw,3rem)',fontWeight:900,color:'#fff',letterSpacing:'-1.5px',marginBottom:14}}>
            Built to fix hiring
          </h1>
          <p style={{fontSize:15,color:'#6b7280',maxWidth:560,margin:'0 auto',lineHeight:1.8}}>
            HireWise was built because the current hiring process is broken. Candidates apply to hundreds of jobs blindly. Companies wade through hundreds of irrelevant resumes. AI can fix this.
          </p>
        </div>

        {/* Mission */}
        <div className="fade-up-1" style={{background:'rgba(255,255,255,.02)',border:'1px solid rgba(99,102,241,.2)',borderRadius:20,padding:'2.5rem',marginBottom:'3rem',boxShadow:'0 0 40px rgba(99,102,241,.06)'}}>
          <div style={{fontSize:11,fontWeight:800,color:'#818cf8',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:12}}>Our Mission</div>
          <div style={{fontSize:22,fontWeight:800,color:'#fff',letterSpacing:'-.5px',marginBottom:14,lineHeight:1.3}}>
            Match the right people to the right roles — using AI, not luck.
          </div>
          <p style={{fontSize:14,color:'#6b7280',lineHeight:1.8}}>
            We believe your next job shouldn't depend on knowing the right person or optimising your resume for a keyword scanner. It should depend on your actual skills, your real experience, and your genuine fit for a role. That's what HireWise is built to achieve.
          </p>
        </div>

        {/* Values */}
        <div className="fade-up-2" style={{marginBottom:'3rem'}}>
          <div style={{fontSize:20,fontWeight:800,color:'#fff',letterSpacing:'-.5px',marginBottom:'1.5rem',textAlign:'center'}}>What we believe in</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:14}}>
            {[
              ['🎯','Accuracy over volume','One great match beats 100 irrelevant ones. We optimise for fit, not for engagement.'],
              ['🔍','Transparency','You should know why you matched a job. We show you the reasons, not just the score.'],
              ['⚡','Speed','The hiring process takes too long. AI can compress weeks of work into seconds.'],
              ['🔒','Privacy','Your resume and data belong to you. We never sell or share your profile.'],
            ].map(([ic,tt,dc])=>(
              <div key={tt as string} style={{background:'rgba(255,255,255,.02)',border:'1px solid rgba(255,255,255,.07)',borderRadius:16,padding:'1.25rem'}}>
                <div style={{fontSize:22,marginBottom:10}}>{ic as string}</div>
                <div style={{fontSize:14,fontWeight:700,color:'#f1f1f1',marginBottom:6}}>{tt as string}</div>
                <div style={{fontSize:13,color:'#6b7280',lineHeight:1.65}}>{dc as string}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div style={{background:'rgba(255,255,255,.02)',border:'1px solid rgba(255,255,255,.07)',borderRadius:20,padding:'2rem',marginBottom:'3rem'}}>
          <div style={{fontSize:16,fontWeight:700,color:'#f1f1f1',marginBottom:16}}>Built with</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
            {[['Next.js','#fff'],['Supabase','#34d399'],['OpenRouter AI','#818cf8'],['TypeScript','#3b82f6'],['Vercel','#fff'],['PostgreSQL','#34d399']].map(([tech,color])=>(
              <span key={tech} style={{background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',borderRadius:8,fontSize:12,padding:'5px 12px',color,fontWeight:600}}>{tech}</span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{textAlign:'center',padding:'2.5rem',background:'rgba(99,102,241,.06)',border:'1px solid rgba(99,102,241,.15)',borderRadius:20}}>
          <div style={{fontSize:20,fontWeight:800,color:'#fff',letterSpacing:'-.5px',marginBottom:8}}>Want to try it?</div>
          <div style={{fontSize:13,color:'#6b7280',marginBottom:'1.25rem'}}>Sign up free and see your AI job matches in under 2 minutes.</div>
          <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/signup">
              <button style={{padding:'11px 24px',background:'#6366f1',border:'none',borderRadius:10,color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'Inter,sans-serif',boxShadow:'0 0 20px rgba(99,102,241,.3)'}}>Get started →</button>
            </Link>
            <Link href="/how-it-works">
              <button style={{padding:'11px 24px',background:'transparent',border:'1px solid rgba(255,255,255,.1)',borderRadius:10,color:'#9ca3af',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'Inter,sans-serif'}}>How it works</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
