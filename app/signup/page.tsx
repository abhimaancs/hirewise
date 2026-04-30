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
  const [form, setForm] = useState({ name: '', email: '', password: '', college: '', company_name: '', location: '' })
  const supabase = createClient()

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) { setError('Please fill in all fields'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true); setError('')
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({ email: form.email, password: form.password })
      if (authError) throw authError
      const userId = authData.user?.id
      if (!userId) throw new Error('User creation failed')
      const { error: profileError } = await supabase.from('profiles').insert({ id: userId, role, name: form.name, email: form.email })
      if (profileError) throw new Error('Profile creation failed: ' + profileError.message)
      if (role === 'candidate') {
        await supabase.from('candidate_profiles').insert({ id: userId, college: form.college || '', skills: [], experience_years: 0, location: form.location || '' })
        router.push('/onboarding')
      } else {
        await supabase.from('company_profiles').insert({ id: userId, company_name: form.company_name || form.name, location: form.location || '' })
        router.push('/onboarding?role=company')
      }
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f7f4', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 48, height: 48, background: '#6366f1', borderRadius: 14, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: 20, fontWeight: 700 }}>H</span>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>Create your account</div>
          <div style={{ fontSize: 14, color: '#888' }}>Join HireWise and find your perfect match</div>
        </div>

        {/* Role toggle */}
        <div style={{ display: 'flex', background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: 4, marginBottom: '1.25rem' }}>
          {(['candidate', 'company'] as const).map(r => (
            <button key={r} onClick={() => setRole(r)} style={{
              flex: 1, padding: '8px', borderRadius: 9, border: 'none',
              background: role === r ? '#6366f1' : 'transparent',
              color: role === r ? '#fff' : '#888',
              fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s'
            }}>
              {r === 'candidate' ? "I'm a candidate" : "I'm a company"}
            </button>
          ))}
        </div>

        <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 16, padding: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Full name</div>
              <input placeholder="Abhi B." value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Location</div>
              <input placeholder="Chennai, India" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Email</div>
            <input type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Password</div>
            <input type="password" placeholder="Min. 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>

          {role === 'candidate' ? (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>College</div>
              <input placeholder="Anna University, Chennai" value={form.college} onChange={e => setForm({ ...form, college: e.target.value })} />
            </div>
          ) : (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Company name</div>
              <input placeholder="Acme Corp" value={form.company_name} onChange={e => setForm({ ...form, company_name: e.target.value })} />
            </div>
          )}

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 12px', color: '#dc2626', fontSize: 13, marginBottom: 14 }}>{error}</div>
          )}

          <button onClick={handleSubmit} disabled={loading} style={{
            width: '100%', padding: '12px', background: '#6366f1', border: 'none',
            borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 500,
            cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            opacity: loading ? 0.7 : 1
          }}>
            {loading && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
            {loading ? 'Creating account...' : 'Create account →'}
          </button>

          <p style={{ textAlign: 'center', fontSize: 13, color: '#888', marginTop: 14 }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return <Suspense><SignupForm /></Suspense>
}
