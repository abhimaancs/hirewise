'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { LogOut, User } from 'lucide-react'

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
      padding: '0 2rem', height: '56px',
      background: '#fff', borderBottom: '1px solid #f0f0f0',
      position: 'sticky', top: 0, zIndex: 100
    }}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <span style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a1a' }}>
          Hire<span style={{ color: '#6366f1' }}>Wise</span>
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {userRole === 'candidate' && (
          <>
            <Link href="/jobs" style={{ fontSize: '13px', color: '#888', textDecoration: 'none' }}>Find Jobs</Link>
            <Link href="/conversations" style={{ fontSize: '13px', color: '#888', textDecoration: 'none' }}>Messages</Link>
            <Link href="/profile" style={{ fontSize: '13px', color: '#888', textDecoration: 'none' }}>Profile</Link>
          </>
        )}
        {userRole === 'company' && (
          <>
            <Link href="/company/jobs" style={{ fontSize: '13px', color: '#888', textDecoration: 'none' }}>My Jobs</Link>
            <Link href="/company/candidates" style={{ fontSize: '13px', color: '#888', textDecoration: 'none' }}>Candidates</Link>
            <Link href="/conversations" style={{ fontSize: '13px', color: '#888', textDecoration: 'none' }}>Messages</Link>
          </>
        )}

        {userRole ? (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Link href={userRole === 'candidate' ? '/profile' : '/company/profile'} style={{ textDecoration: 'none' }}>
              <button style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 12px', background: '#f5f5f5',
                border: '1px solid #e8e8e8', borderRadius: '8px',
                color: '#444', fontSize: '13px', cursor: 'pointer', fontFamily: 'Inter, sans-serif'
              }}>
                <User size={13} /> Profile
              </button>
            </Link>
            <button onClick={handleSignOut} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 12px', background: 'transparent',
              border: '1px solid #e8e8e8', borderRadius: '8px',
              color: '#888', fontSize: '13px', cursor: 'pointer', fontFamily: 'Inter, sans-serif'
            }}>
              <LogOut size={13} /> Sign out
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link href="/login">
              <button style={{
                padding: '7px 16px', background: 'transparent',
                border: '1px solid #e8e8e8', borderRadius: '8px',
                color: '#444', fontSize: '13px', cursor: 'pointer', fontFamily: 'Inter, sans-serif'
              }}>Sign in</button>
            </Link>
            <Link href="/signup">
              <button style={{
                padding: '7px 16px', background: '#6366f1',
                border: 'none', borderRadius: '8px',
                color: '#fff', fontSize: '13px', cursor: 'pointer', fontFamily: 'Inter, sans-serif'
              }}>Get started</button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
