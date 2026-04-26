'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      // Get user role and redirect accordingly
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      if (profile?.role === 'company') {
        router.push('/company/jobs')
      } else {
        router.push('/jobs')
      }
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '420px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'var(--font-syne)', fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
            Hire<span style={{ color: 'var(--accent)' }}>Wise</span>
          </span>
        </Link>
        <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Welcome back</p>
      </div>

      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.4rem' }}>Email</label>
          <input type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.4rem' }}>Password</label>
          <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        </div>

        {error && <p style={{ color: '#f87171', fontSize: '0.8rem', marginBottom: '0.75rem' }}>{error}</p>}

        <button onClick={handleLogin} disabled={loading} style={{
          width: '100%', padding: '0.75rem', background: 'var(--accent)',
          border: 'none', borderRadius: '8px', color: '#fff',
          fontSize: '0.9rem', fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer',
          fontFamily: 'var(--font-dm)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: '8px', opacity: loading ? 0.7 : 1
        }}>
          {loading && <Loader2 size={16} />}
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--muted)', marginTop: '1rem' }}>
          Don't have an account?{' '}
          <Link href="/signup" style={{ color: 'var(--accent)' }}>Sign up</Link>
        </p>
      </div>
    </div>
  )
}
