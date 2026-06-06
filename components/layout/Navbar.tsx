'use client'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { LogOut, User, Search, Briefcase, MessageSquare, LayoutDashboard } from 'lucide-react'

interface NavbarProps {
  userRole?: 'candidate' | 'company' | null
}

export default function Navbar({ userRole }: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  /**
   * Returns true when the current pathname starts with `href`.
   * e.g. /jobs/[id] → isActive('/jobs') === true
   * Special-case '/' so it only matches exactly.
   */
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

  /** Base style shared by all nav links */
  const linkBase: React.CSSProperties = {
    fontSize: '13px',
    textDecoration: 'none',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    transition: 'color 0.2s',
    position: 'relative',
    paddingBottom: '2px',
  }

  /** Merge base + active/inactive colour */
  const navLink = (href: string): React.CSSProperties => ({
    ...linkBase,
    color: isActive(href) ? '#e5e7eb' : '#6b7280',
    fontWeight: isActive(href) ? 600 : 500,
  })

  /**
   * Active indicator — a small indigo dot/line under the active link.
   * Rendered as an absolutely-positioned pseudo-element via inline span.
   */
  const ActiveDot = ({ href }: { href: string }) =>
    isActive(href) ? (
      <span style={{
        position: 'absolute',
        bottom: -14,          // sits just below the nav link, inside the 60px nav bar
        left: '50%',
        transform: 'translateX(-50%)',
        width: 18,
        height: 2,
        borderRadius: 2,
        background: 'linear-gradient(90deg,#6366f1,#8b5cf6)',
      }} />
    ) : null

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 2.5rem', height: '60px',
      background: 'rgba(8,8,18,0.95)', borderBottom: '1px solid rgba(255,255,255,0.06)',
      position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(20px)',
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
            <Link href="/browse-jobs" style={navLink('/browse-jobs')}
              onMouseEnter={e => { if (!isActive('/browse-jobs')) (e.currentTarget as HTMLElement).style.color = '#e5e7eb' }}
              onMouseLeave={e => { if (!isActive('/browse-jobs')) (e.currentTarget as HTMLElement).style.color = '#6b7280' }}>
              Jobs<ActiveDot href="/browse-jobs" />
            </Link>
            <Link href="/companies" style={navLink('/companies')}
              onMouseEnter={e => { if (!isActive('/companies')) (e.currentTarget as HTMLElement).style.color = '#e5e7eb' }}
              onMouseLeave={e => { if (!isActive('/companies')) (e.currentTarget as HTMLElement).style.color = '#6b7280' }}>
              Companies<ActiveDot href="/companies" />
            </Link>
            <Link href="/how-it-works" style={navLink('/how-it-works')}
              onMouseEnter={e => { if (!isActive('/how-it-works')) (e.currentTarget as HTMLElement).style.color = '#e5e7eb' }}
              onMouseLeave={e => { if (!isActive('/how-it-works')) (e.currentTarget as HTMLElement).style.color = '#6b7280' }}>
              How it Works<ActiveDot href="/how-it-works" />
            </Link>
            <Link href="/about" style={navLink('/about')}
              onMouseEnter={e => { if (!isActive('/about')) (e.currentTarget as HTMLElement).style.color = '#e5e7eb' }}
              onMouseLeave={e => { if (!isActive('/about')) (e.currentTarget as HTMLElement).style.color = '#6b7280' }}>
              About<ActiveDot href="/about" />
            </Link>
          </>
        )}

        {/* Candidate nav */}
        {userRole === 'candidate' && (
          <>
            {/* /jobs and /jobs/[id] both highlight Find Jobs */}
            <Link href="/jobs" style={navLink('/jobs')}
              onMouseEnter={e => { if (!isActive('/jobs')) (e.currentTarget as HTMLElement).style.color = '#e5e7eb' }}
              onMouseLeave={e => { if (!isActive('/jobs')) (e.currentTarget as HTMLElement).style.color = '#6b7280' }}>
              <Search size={13} />Find Jobs<ActiveDot href="/jobs" />
            </Link>
            <Link href="/applications" style={navLink('/applications')}
              onMouseEnter={e => { if (!isActive('/applications')) (e.currentTarget as HTMLElement).style.color = '#e5e7eb' }}
              onMouseLeave={e => { if (!isActive('/applications')) (e.currentTarget as HTMLElement).style.color = '#6b7280' }}>
              <Briefcase size={13} />Applications<ActiveDot href="/applications" />
            </Link>
            <Link href="/conversations" style={navLink('/conversations')}
              onMouseEnter={e => { if (!isActive('/conversations')) (e.currentTarget as HTMLElement).style.color = '#e5e7eb' }}
              onMouseLeave={e => { if (!isActive('/conversations')) (e.currentTarget as HTMLElement).style.color = '#6b7280' }}>
              <MessageSquare size={13} />Messages<ActiveDot href="/conversations" />
            </Link>
          </>
        )}

        {/* Company nav */}
        {userRole === 'company' && (
          <>
            <Link href="/company/jobs" style={navLink('/company/jobs')}
              onMouseEnter={e => { if (!isActive('/company/jobs')) (e.currentTarget as HTMLElement).style.color = '#e5e7eb' }}
              onMouseLeave={e => { if (!isActive('/company/jobs')) (e.currentTarget as HTMLElement).style.color = '#6b7280' }}>
              <LayoutDashboard size={13} />My Jobs<ActiveDot href="/company/jobs" />
            </Link>
            <Link href="/company/candidates" style={navLink('/company/candidates')}
              onMouseEnter={e => { if (!isActive('/company/candidates')) (e.currentTarget as HTMLElement).style.color = '#e5e7eb' }}
              onMouseLeave={e => { if (!isActive('/company/candidates')) (e.currentTarget as HTMLElement).style.color = '#6b7280' }}>
              <Search size={13} />Candidates<ActiveDot href="/company/candidates" />
            </Link>
            <Link href="/conversations" style={navLink('/conversations')}
              onMouseEnter={e => { if (!isActive('/conversations')) (e.currentTarget as HTMLElement).style.color = '#e5e7eb' }}
              onMouseLeave={e => { if (!isActive('/conversations')) (e.currentTarget as HTMLElement).style.color = '#6b7280' }}>
              <MessageSquare size={13} />Messages<ActiveDot href="/conversations" />
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
