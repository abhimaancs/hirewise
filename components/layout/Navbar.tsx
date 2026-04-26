'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { LogOut, Briefcase, User } from 'lucide-react'

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

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '1rem 2rem', borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, background: 'rgba(10,15,30,0.9)',
      backdropFilter: 'blur(12px)', zIndex: 100
    }}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <span style={{ fontFamily: 'var(--font-syne)', fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
          Hire<span style={{ color: 'var(--accent)' }}>Wise</span>
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {userRole === 'candidate' && (
          <>
            <Link href="/jobs" style={{ fontSize: '0.875rem', color: 'var(--muted)', textDecoration: 'none' }}>Find Jobs</Link>
            <Link href="/conversations" style={{ fontSize: '0.875rem', color: 'var(--muted)', textDecoration: 'none' }}>Messages</Link>
            <Link href="/profile" style={{ fontSize: '0.875rem', color: 'var(--muted)', textDecoration: 'none' }}>My Profile</Link>
          </>
        )}
        {userRole === 'company' && (
          <>
            <Link href="/company/jobs" style={{ fontSize: '0.875rem', color: 'var(--muted)', textDecoration: 'none' }}>My Jobs</Link>
            <Link href="/company/candidates" style={{ fontSize: '0.875rem', color: 'var(--muted)', textDecoration: 'none' }}>Candidates</Link>
            <Link href="/conversations" style={{ fontSize: '0.875rem', color: 'var(--muted)', textDecoration: 'none' }}>Messages</Link>
          </>
        )}

        {userRole ? (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Link href={userRole === 'candidate' ? '/profile' : '/company/profile'}>
              <button style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '0.5rem 1rem', background: 'var(--card)',
                border: '1px solid var(--border)', borderRadius: '8px',
                color: '#fff', fontSize: '0.875rem', cursor: 'pointer'
              }}>
                <User size={14} /> Profile
              </button>
            </Link>
            <button onClick={handleSignOut} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '0.5rem 1rem', background: 'transparent',
              border: '1px solid var(--border)', borderRadius: '8px',
              color: 'var(--muted)', fontSize: '0.875rem', cursor: 'pointer'
            }}>
              <LogOut size={14} /> Sign out
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link href="/login">
              <button style={{
                padding: '0.5rem 1.25rem', background: 'transparent',
                border: '1px solid var(--border)', borderRadius: '8px',
                color: '#fff', fontSize: '0.875rem', cursor: 'pointer'
              }}>Sign in</button>
            </Link>
            <Link href="/signup">
              <button style={{
                padding: '0.5rem 1.25rem', background: 'var(--accent)',
                border: 'none', borderRadius: '8px',
                color: '#fff', fontSize: '0.875rem', cursor: 'pointer'
              }}>Get started</button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
