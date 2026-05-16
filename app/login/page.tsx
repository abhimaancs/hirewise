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
    setLoading(true); setError('')
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
      router.push(profile?.role === 'company' ? '/company/jobs' : '/jobs')
      router.refresh()
    } catch (err: any) { setError(err.message || 'Invalid email or password') }
    finally { setLoading(false) }
  }

  const lbl = { fontSize:11, fontWeight:700, color:'#6b7280', textTransform:'uppercase' as const, letterSpacing:'0.06em', marginBottom:6, display:'block' }

  return (
    <div style={{ minHeight:'100vh', background:'#0d0d14', display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem' }}>
      <div style={{ width:'100%', maxWidth:400 }}>
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <Link href="/" style={{ textDecoration:'none' }}>
            <div style={{ fontSize:22, fontWeight:900, color:'#fff', letterSpacing:'-0.5px', marginBottom:16 }}>
              Hire<span style={{ color:'#818cf8' }}>Wise</span>
            </div>
          </Link>
          <div style={{ fontSize:24, fontWeight:800, color:'#fff', letterSpacing:'-1px', marginBottom:6 }}>Welcome back</div>
          <div style={{ fontSize:14, color:'#6b7280' }}>Sign in to your account</div>
        </div>

        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:22, padding:'1.75rem' }}>
          <div style={{ marginBottom:14 }}>
            <label style={lbl}>Email</label>
            <input type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          </div>
          <div style={{ marginBottom:20 }}>
            <label style={lbl}>Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          </div>

          {error && (
            <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:9, padding:'10px 12px', color:'#f87171', fontSize:13, marginBottom:14 }}>{error}</div>
          )}

          <button onClick={handleLogin} disabled={loading} style={{ width:'100%', padding:12, background:'#6366f1', border:'none', borderRadius:11, color:'#fff', fontSize:14, fontWeight:700, cursor:loading?'not-allowed':'pointer', fontFamily:'Inter,sans-serif', display:'flex', alignItems:'center', justifyContent:'center', gap:8, opacity:loading?0.7:1, boxShadow:'0 0 20px rgba(99,102,241,0.3)', letterSpacing:'-0.2px' }}>
            {loading && <Loader2 size={16} style={{ animation:'spin 1s linear infinite' }} />}
            {loading ? 'Signing in...' : 'Sign in →'}
          </button>

          <p style={{ textAlign:'center', fontSize:13, color:'#6b7280', marginTop:16 }}>
            Don't have an account?{' '}
            <Link href="/signup" style={{ color:'#818cf8', fontWeight:700, textDecoration:'none' }}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
