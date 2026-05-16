'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { LogOut, User, Search, Briefcase, MessageSquare, LayoutDashboard } from 'lucide-react'

interface NavbarProps {
  userRole?: 'candidate' | 'company' | null
}

const s = {
  nav: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 2.5rem', height:'64px', background:'rgba(13,13,20,0.95)', borderBottom:'1px solid rgba(255,255,255,0.06)', position:'sticky' as const, top:0, zIndex:100, backdropFilter:'blur(12px)' },
  logoIcon: { width:32, height:32, background:'#6366f1', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:16, color:'#fff' },
  logoText: { fontSize:17, fontWeight:800, color:'#fff', letterSpacing:'-0.3px', textDecoration:'none' },
  link: { fontSize:13, color:'#9ca3af', textDecoration:'none', fontWeight:500, display:'flex', alignItems:'center', gap:5, transition:'color 0.2s' },
  btnGhost: { display:'flex', alignItems:'center', gap:6, padding:'7px 14px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:9, color:'#d1d5db', fontSize:13, cursor:'pointer', fontFamily:'Inter,sans-serif', fontWeight:500 },
  btnPrimary: { padding:'8px 18px', background:'#6366f1', border:'none', borderRadius:9, color:'#fff', fontSize:13, cursor:'pointer', fontFamily:'Inter,sans-serif', fontWeight:700, boxShadow:'0 0 20px rgba(99,102,241,0.25)' },
}

export default function Navbar({ userRole }: NavbarProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav style={s.nav}>
      <Link href="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:10 }}>
        <div style={s.logoIcon}>H</div>
        <span style={s.logoText}>Hire<span style={{ color:'#818cf8' }}>Wise</span></span>
      </Link>

      <div style={{ display:'flex', alignItems:'center', gap:'1.75rem' }}>
        {userRole === 'candidate' && (
          <>
            <Link href="/jobs" style={s.link}><Search size={13}/>Find Jobs</Link>
            <Link href="/applications" style={s.link}><Briefcase size={13}/>Applications</Link>
            <Link href="/conversations" style={s.link}><MessageSquare size={13}/>Messages</Link>
          </>
        )}
        {userRole === 'company' && (
          <>
            <Link href="/company/jobs" style={s.link}><LayoutDashboard size={13}/>My Jobs</Link>
            <Link href="/company/candidates" style={s.link}><Search size={13}/>Candidates</Link>
            <Link href="/conversations" style={s.link}><MessageSquare size={13}/>Messages</Link>
          </>
        )}
        {!userRole && (
          <>
            <Link href="/jobs" style={s.link}>Jobs</Link>
            <Link href="#" style={s.link}>Companies</Link>
            <Link href="#" style={s.link}>How it Works</Link>
            <Link href="#" style={s.link}>Pricing</Link>
          </>
        )}
      </div>

      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
        {userRole ? (
          <>
            <Link href={userRole === 'candidate' ? '/profile' : '/company/profile'} style={{ textDecoration:'none' }}>
              <button style={s.btnGhost}><User size={13}/>Profile</button>
            </Link>
            <button onClick={handleSignOut} style={{ ...s.btnGhost, color:'#6b7280' }}>
              <LogOut size={13}/>
            </button>
          </>
        ) : (
          <>
            <Link href="/signup?role=company">
              <button style={s.btnGhost}>⚡ For Employers</button>
            </Link>
            <Link href="/signup">
              <button style={s.btnPrimary}>Get Started</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
