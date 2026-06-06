'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { LogOut, User, Search, Briefcase, MessageSquare, LayoutDashboard, X, Menu } from 'lucide-react'
import { NavLink } from '@/types'

interface NavbarProps {
  userRole?: 'candidate' | 'company' | null
}

export default function Navbar({ userRole }: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // ── Escape key + scroll lock ──────────────────────────────────────────────
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer()
    }
    if (drawerOpen) {
      document.addEventListener('keydown', onKeyDown)
      document.body.style.overflow = 'hidden'
      // autofocus the close button once the drawer is visible
      setTimeout(() => closeButtonRef.current?.focus(), 50)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  // Close drawer on route change (handles Link navigation)
  useEffect(() => {
    setDrawerOpen(false)
  }, [pathname])

  const openDrawer = () => setDrawerOpen(true)
  const closeDrawer = () => setDrawerOpen(false)

  // ── Auth ──────────────────────────────────────────────────────────────────
  const handleSignOut = async () => {
    closeDrawer()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  // ── Active-link helpers ───────────────────────────────────────────────────
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

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

  const navLink = (href: string): React.CSSProperties => ({
    ...linkBase,
    color: isActive(href) ? '#e5e7eb' : '#6b7280',
    fontWeight: isActive(href) ? 600 : 500,
  })

  // Desktop underline indicator
  const ActiveDot = ({ href }: { href: string }) =>
    isActive(href) ? (
      <span style={{
        position: 'absolute',
        bottom: -14,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 18,
        height: 2,
        borderRadius: 2,
        background: 'linear-gradient(90deg,#6366f1,#8b5cf6)',
      }} />
    ) : null

  // ── Drawer link style (vertical layout) ──────────────────────────────────
  const drawerLink = (href: string): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '11px 16px',
    borderRadius: 10,
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: isActive(href) ? 700 : 500,
    color: isActive(href) ? '#e5e7eb' : '#9ca3af',
    background: isActive(href) ? 'rgba(99,102,241,0.12)' : 'transparent',
    borderLeft: isActive(href) ? '2px solid #6366f1' : '2px solid transparent',
    transition: 'all 0.15s',
  })

  // ── Nav link definitions ──────────────────────────────────────────────────
  const publicLinks = [
    { href: '/browse-jobs', label: 'Jobs' },
    { href: '/companies', label: 'Companies' },
    { href: '/how-it-works', label: 'How it Works' },
    { href: '/about', label: 'About' },
  ]

  const candidateLinks = [
    { href: '/jobs', label: 'Find Jobs', icon: <Search size={15} /> },
    { href: '/applications', label: 'Applications', icon: <Briefcase size={15} /> },
    { href: '/conversations', label: 'Messages', icon: <MessageSquare size={15} /> },
  ]

  const companyLinks = [
    { href: '/company/jobs', label: 'My Jobs', icon: <LayoutDashboard size={15} /> },
    { href: '/company/candidates', label: 'Candidates', icon: <Search size={15} /> },
    { href: '/conversations', label: 'Messages', icon: <MessageSquare size={15} /> },
  ]

  const activeLinks = userRole === 'candidate'
    ? candidateLinks
    : userRole === 'company'
      ? companyLinks
      : publicLinks

  const profileHref = userRole === 'candidate' ? '/profile' : '/company/profile'

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Responsive styles ── */}
      <style>{`
        .hw-desktop-links { display: flex; }
        .hw-hamburger      { display: none; }
        @media (max-width: 768px) {
          .hw-desktop-links { display: none !important; }
          .hw-hamburger      { display: flex !important; }
        }
      `}</style>

      {/* ── Main nav bar ── */}
      <nav
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 2.5rem', height: '60px',
          background: 'rgba(8,8,18,0.95)', borderBottom: '1px solid rgba(255,255,255,0.06)',
          position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(20px)',
        }}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: '#fff' }}>H</div>
          <span style={{ fontSize: 17, fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>
            Hire<span style={{ color: '#818cf8' }}>Wise</span>
          </span>
        </Link>

        {/* ── Desktop nav links ── */}
        <div className="hw-desktop-links" style={{ alignItems: 'center', gap: '1.75rem' }}>
          {!userRole && (
            <>
              {publicLinks.map(({ href, label }) => (
                <Link key={href} href={href} style={navLink(href)}
                  onMouseEnter={e => { if (!isActive(href)) (e.currentTarget as HTMLElement).style.color = '#e5e7eb' }}
                  onMouseLeave={e => { if (!isActive(href)) (e.currentTarget as HTMLElement).style.color = '#6b7280' }}>
                  {label}<ActiveDot href={href} />
                </Link>
              ))}
            </>
          )}
          {userRole === 'candidate' && (
            <>
              {candidateLinks.map(({ href, label, icon }) => (
                <Link key={href} href={href} style={navLink(href)}
                  onMouseEnter={e => { if (!isActive(href)) (e.currentTarget as HTMLElement).style.color = '#e5e7eb' }}
                  onMouseLeave={e => { if (!isActive(href)) (e.currentTarget as HTMLElement).style.color = '#6b7280' }}>
                  {icon}{label}<ActiveDot href={href} />
                </Link>
              ))}
            </>
          )}
          {userRole === 'company' && (
            <>
              {companyLinks.map(({ href, label, icon }) => (
                <Link key={href} href={href} style={navLink(href)}
                  onMouseEnter={e => { if (!isActive(href)) (e.currentTarget as HTMLElement).style.color = '#e5e7eb' }}
                  onMouseLeave={e => { if (!isActive(href)) (e.currentTarget as HTMLElement).style.color = '#6b7280' }}>
                  {icon}{label}<ActiveDot href={href} />
                </Link>
              ))}
            </>
          )}
        </div>

        {/* ── Desktop right side ── */}
        <div className="hw-desktop-links" style={{ gap: 8, alignItems: 'center' }}>
          {userRole ? (
            <>
              <Link href={profileHref} style={{ textDecoration: 'none' }}>
                <button style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 14px', background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9,
                  color: '#d1d5db', fontSize: 13, cursor: 'pointer',
                  fontFamily: 'Inter,sans-serif', fontWeight: 500, transition: 'all 0.2s',
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
                fontFamily: 'Inter,sans-serif', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#f87171'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(239,68,68,0.3)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#6b7280'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)' }}
                aria-label="Sign out"
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
                  fontFamily: 'Inter,sans-serif', fontWeight: 500, transition: 'all 0.2s',
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
                  fontWeight: 700, boxShadow: '0 0 20px rgba(99,102,241,0.3)', transition: 'all 0.2s',
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

        {/* ── Hamburger (mobile only) ── */}
        <button
          className="hw-hamburger"
          onClick={openDrawer}
          aria-label="Open navigation menu"
          aria-expanded={drawerOpen}
          aria-controls="mobile-drawer"
          style={{
            alignItems: 'center', justifyContent: 'center',
            width: 38, height: 38,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 9, cursor: 'pointer', color: '#d1d5db',
            flexShrink: 0,
          }}
        >
          <Menu size={18} />
        </button>
      </nav>

      {/* ── Backdrop ── */}
      {drawerOpen && (
        <div
          onClick={closeDrawer}
          aria-hidden="true"
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(2px)',
            zIndex: 200,
            transition: 'opacity 0.25s',
          }}
        />
      )}

      {/* ── Slide-in drawer ── */}
      <div
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        style={{
          position: 'fixed', top: 0, right: 0,
          width: 280, height: '100dvh',
          background: 'rgba(10,10,22,0.98)',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(24px)',
          zIndex: 300,
          display: 'flex', flexDirection: 'column',
          transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
          overflowY: 'auto',
        }}
      >
        {/* Drawer header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 16px', height: 60,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          <Link href="/" onClick={closeDrawer} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13, color: '#fff' }}>H</div>
            <span style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>
              Hire<span style={{ color: '#818cf8' }}>Wise</span>
            </span>
          </Link>
          <button
            ref={closeButtonRef}
            onClick={closeDrawer}
            aria-label="Close navigation menu"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 34, height: 34,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8, cursor: 'pointer', color: '#9ca3af',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav links */}
        <div style={{ padding: '12px 12px 0', flex: 1 }}>
          {activeLinks.map(({ href, label, icon }: NavLink) => (
            <Link
              key={href}
              href={href}
              onClick={closeDrawer}
              style={drawerLink(href)}
              onMouseEnter={e => {
                if (!isActive(href)) {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'
                    ; (e.currentTarget as HTMLElement).style.color = '#e5e7eb'
                }
              }}
              onMouseLeave={e => {
                if (!isActive(href)) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent'
                    ; (e.currentTarget as HTMLElement).style.color = '#9ca3af'
                }
              }}
            >
              {icon && <span style={{ color: isActive(href) ? '#818cf8' : '#6b7280', display: 'flex' }}>{icon}</span>}
              {label}
            </Link>
          ))}
        </div>

        {/* Divider + bottom actions */}
        <div style={{ padding: '12px 12px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
          {userRole ? (
            <>
              <Link
                href={profileHref}
                onClick={closeDrawer}
                style={drawerLink(profileHref)}
                onMouseEnter={e => {
                  if (!isActive(profileHref)) {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'
                      ; (e.currentTarget as HTMLElement).style.color = '#e5e7eb'
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive(profileHref)) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent'
                      ; (e.currentTarget as HTMLElement).style.color = '#9ca3af'
                  }
                }}
              >
                <span style={{ color: isActive(profileHref) ? '#818cf8' : '#6b7280', display: 'flex' }}>
                  <User size={15} />
                </span>
                Profile
              </Link>
              <button
                onClick={handleSignOut}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%', marginTop: 6,
                  padding: '11px 16px', borderRadius: 10,
                  background: 'transparent',
                  border: '1px solid rgba(239,68,68,0.2)',
                  color: '#f87171', fontSize: 14, fontWeight: 500,
                  cursor: 'pointer', fontFamily: 'Inter,sans-serif',
                  transition: 'all 0.15s', textAlign: 'left',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                aria-label="Sign out"
              >
                <LogOut size={15} />Sign out
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link href="/login" onClick={closeDrawer} style={{ textDecoration: 'none' }}>
                <button style={{
                  width: '100%', padding: '11px 0',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 10, color: '#d1d5db',
                  fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'Inter,sans-serif', transition: 'all 0.15s',
                }}>
                  Log in
                </button>
              </Link>
              <Link href="/signup" onClick={closeDrawer} style={{ textDecoration: 'none' }}>
                <button style={{
                  width: '100%', padding: '11px 0',
                  background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                  border: 'none', borderRadius: 10, color: '#fff',
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'Inter,sans-serif',
                  boxShadow: '0 0 20px rgba(99,102,241,0.3)',
                }}>
                  Get started →
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
