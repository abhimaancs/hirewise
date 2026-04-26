'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [role, setRole] = useState<'candidate' | 'company'>(
    searchParams.get('role') === 'company' ? 'company' : 'candidate'
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    college: '', company_name: '', location: ''
  })

  const supabase = createClient()

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all fields')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Step 1 — Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      })
      if (authError) throw authError

      const userId = authData.user?.id
      if (!userId) throw new Error('User creation failed — please try again')

      // Step 2 — Insert into profiles
      const { error: profileError } = await supabase.from('profiles').insert({
        id: userId,
        role,
        name: form.name,
        email: form.email
      })
      if (profileError) throw new Error('Profile creation failed: ' + profileError.message)

      // Step 3 — Insert role-specific profile
      if (role === 'candidate') {
        const { error: candidateError } = await supabase.from('candidate_profiles').insert({
          id: userId,
          college: form.college || '',
          skills: [],
          experience_years: 0,
          location: form.location || ''
        })
        if (candidateError) throw new Error('Candidate profile failed: ' + candidateError.message)
        router.push('/profile?new=true')
      } else {
        const { error: companyError } = await supabase.from('company_profiles').insert({
          id: userId,
          company_name: form.company_name || form.name,
          location: form.location || ''
        })
        if (companyError) throw new Error('Company profile failed: ' + companyError.message)
        router.push('/company/jobs?new=true')
      }

      router.refresh()

    } catch (err: any) {
      console.error('Signup error:', err)
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const s = {
    card: { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem' } as React.CSSProperties,
    label: { display: 'block', fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.4rem' } as React.CSSProperties,
    group: { marginBottom: '1rem' } as React.CSSProperties,
  }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'var(--font-syne)', fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
            Hire<span style={{ color: 'var(--accent)' }}>Wise</span>
          </span>
        </Link>
        <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Create your account</p>
      </div>

      {/* Role toggle */}
      <div style={{
        display: 'flex', background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: '10px', padding: '4px', marginBottom: '1.5rem'
      }}>
        {(['candidate', 'company'] as const).map(r => (
          <button key={r} onClick={() => setRole(r)} style={{
            flex: 1, padding: '0.5rem', borderRadius: '7px', border: 'none',
            background: role === r ? 'var(--accent)' : 'transparent',
            color: role === r ? '#fff' : 'var(--muted)',
            fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'var(--font-dm)',
            transition: 'all 0.2s'
          }}>
            {r === 'candidate' ? "I'm a candidate" : "I'm a company"}
          </button>
        ))}
      </div>

      <div style={s.card}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div style={s.group}>
            <label style={s.label}>Full name</label>
            <input placeholder="Abhi B." value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div style={s.group}>
            <label style={s.label}>Location</label>
            <input placeholder="Chennai, India" value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })} />
          </div>
        </div>

        <div style={s.group}>
          <label style={s.label}>Email</label>
          <input type="email" placeholder="you@email.com" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} />
        </div>

        <div style={s.group}>
          <label style={s.label}>Password (min 6 characters)</label>
          <input type="password" placeholder="••••••••" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        </div>

        {role === 'candidate' ? (
          <div style={s.group}>
            <label style={s.label}>College / University</label>
            <input placeholder="Anna University, Chennai" value={form.college}
              onChange={e => setForm({ ...form, college: e.target.value })} />
          </div>
        ) : (
          <div style={s.group}>
            <label style={s.label}>Company name</label>
            <input placeholder="e.g. Acme Corp" value={form.company_name}
              onChange={e => setForm({ ...form, company_name: e.target.value })} />
          </div>
        )}

        {error && (
          <div style={{
            background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)',
            borderRadius: '8px', padding: '0.625rem 0.875rem',
            color: '#f87171', fontSize: '0.8rem', marginBottom: '0.75rem'
          }}>
            {error}
          </div>
        )}

        <button onClick={handleSubmit} disabled={loading} style={{
          width: '100%', padding: '0.75rem', background: 'var(--accent)',
          border: 'none', borderRadius: '8px', color: '#fff',
          fontSize: '0.9rem', fontWeight: 500,
          cursor: loading ? 'not-allowed' : 'pointer',
          fontFamily: 'var(--font-dm)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          gap: '8px', opacity: loading ? 0.7 : 1
        }}>
          {loading && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
          {loading ? 'Creating account...' : 'Create account'}
        </button>

        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--muted)', marginTop: '1rem' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--accent)' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  )
}
