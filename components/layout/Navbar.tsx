'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { LogOut, User, Search, Briefcase, MessageSquare, LayoutDashboard } from 'lucide-react'

interface NavbarProps {
  userRole?: 'candidate' | 'company' | null
}

export default function Navbar({ userRole }: NavbarProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const linkStyle = {
    fontSize: '13px',
    color: '#6b7280',
    textDecoration: 'none',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    transition: 'color 0.2s',
  }

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 2.5rem', height: '60px',
      background: 'rgba(8,8,18,0.95)', borderBottom: '1px solid rgba(255,255,255,0.06)',
      position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(20px)'
    }}>
      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: '#fff' }}>H</div>
        <span style={{ fontSize: 17, fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>
          Hire<span style={{ color: '#818cf8' }}>Wise</span>
        </span>
      </Link>

      {/* Nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
        {/* Public nav */}
        {!userRole && (
          <>
            <Link href="/browse-jobs" style={linkStyle}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#e5e7eb'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#6b7280'}>
              Jobs
            </Link>
            <Link href="/companies" style={linkStyle}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#e5e7eb'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#6b7280'}>
              Companies
            </Link>
            <Link href="/how-it-works" style={linkStyle}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#e5e7eb'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#6b7280'}>
              How it Works
            </Link>
            <Link href="/about" style={linkStyle}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#e5e7eb'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#6b7280'}>
              About
            </Link>
          </>
        )}

        {/* Candidate nav */}
        {userRole === 'candidate' && (
          <>
            <Link href="/jobs" style={linkStyle}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#e5e7eb'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#6b7280'}>
              <Search size={13} />Find Jobs
            </Link>
            <Link href="/applications" style={linkStyle}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#e5e7eb'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#6b7280'}>
              <Briefcase size={13} />Applications
            </Link>
            <Link href="/conversations" style={linkStyle}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#e5e7eb'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#6b7280'}>
              <MessageSquare size={13} />Messages
            </Link>
          </>
        )}

        {/* Company nav */}
        {userRole === 'company' && (
          <>
            <Link href="/company/jobs" style={linkStyle}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#e5e7eb'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#6b7280'}>
              <LayoutDashboard size={13} />My Jobs
            </Link>
            <Link href="/company/candidates" style={linkStyle}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#e5e7eb'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#6b7280'}>
              <Search size={13} />Candidates
            </Link>
            <Link href="/conversations" style={linkStyle}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#e5e7eb'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#6b7280'}>
              <MessageSquare size={13} />Messages
            </Link>
          </>
        )}
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {userRole ? (
          <>
            <Link href={userRole === 'candidate' ? '/profile' : '/company/profile'} style={{ textDecoration: 'none' }}>
              <button style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9,
                color: '#d1d5db', fontSize: 13, cursor: 'pointer',
                fontFamily: 'Inter,sans-serif', fontWeight: 500, transition: 'all 0.2s'
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)' }}
              >
                <User size={13} /> Profile
              </button>
            </Link>
            <button onClick={handleSignOut} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 12px', background: 'transparent',
              border: '1px solid rgba(255,255,255,0.08)', borderRadius: 9,
              color: '#6b7280', fontSize: 13, cursor: 'pointer',
              fontFamily: 'Inter,sans-serif', transition: 'all 0.2s'
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#f87171'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(239,68,68,0.3)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#6b7280'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)' }}
            >
              <LogOut size={13} />
            </button>
          </>
        ) : (
          <>
            <Link href="/login">
              <button style={{
                padding: '7px 18px', background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9,
                color: '#9ca3af', fontSize: 13, cursor: 'pointer',
                fontFamily: 'Inter,sans-serif', fontWeight: 500, transition: 'all 0.2s'
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#e5e7eb'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#9ca3af'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)' }}
              >
                Log in
              </button>
            </Link>
            <Link href="/signup">
              <button style={{
                padding: '7px 18px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                border: 'none', borderRadius: 9, color: '#fff',
                fontSize: 13, cursor: 'pointer', fontFamily: 'Inter,sans-serif',
                fontWeight: 700, boxShadow: '0 0 20px rgba(99,102,241,0.3)', transition: 'all 0.2s'
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 30px rgba(99,102,241,0.5)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(99,102,241,0.3)' }}
              >
                Get started
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
