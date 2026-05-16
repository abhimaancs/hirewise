'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [role, setRole] = useState<'candidate'|'company'>(searchParams.get('role')==='company'?'company':'candidate')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name:'', email:'', password:'', college:'', company_name:'', location:'' })
  const supabase = createClient()

  const handleSubmit = async () => {
    if (!form.name||!form.email||!form.password) { setError('Please fill in all fields'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true); setError('')
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({ email:form.email, password:form.password })
      if (authError) throw authError
      const userId = authData.user?.id
      if (!userId) throw new Error('User creation failed')
      const { error: profileError } = await supabase.from('profiles').insert({ id:userId, role, name:form.name, email:form.email })
      if (profileError) throw new Error(profileError.message)
      if (role === 'candidate') {
        await supabase.from('candidate_profiles').insert({ id:userId, college:form.college||'', skills:[], experience_years:0, location:form.location||'' })
        router.push('/onboarding')
      } else {
        await supabase.from('company_profiles').insert({ id:userId, company_name:form.company_name||form.name, location:form.location||'' })
        router.push('/onboarding?role=company')
      }
      router.refresh()
    } catch (err:any) { setError(err.message||'Something went wrong') }
    finally { setLoading(false) }
  }

  const lbl = { fontSize:11, fontWeight:700, color:'#6b7280', textTransform:'uppercase' as const, letterSpacing:'0.06em', marginBottom:6, display:'block' }

  return (
    <div style={{ minHeight:'100vh', background:'#0d0d14', display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem' }}>
      <div style={{ width:'100%', maxWidth:440 }}>
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <Link href="/" style={{ textDecoration:'none' }}>
            <div style={{ fontSize:22, fontWeight:900, color:'#fff', letterSpacing:'-0.5px', marginBottom:12 }}>Hire<span style={{ color:'#818cf8' }}>Wise</span></div>
          </Link>
          <div style={{ fontSize:24, fontWeight:800, color:'#fff', letterSpacing:'-1px', marginBottom:6 }}>Create your account</div>
          <div style={{ fontSize:14, color:'#6b7280' }}>Join HireWise and find your perfect match</div>
        </div>

        {/* Role toggle */}
        <div style={{ display:'flex', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, padding:4, marginBottom:'1.25rem' }}>
          {(['candidate','company'] as const).map(r => (
            <button key={r} onClick={() => setRole(r)} style={{ flex:1, padding:9, borderRadius:9, border:'none', background:role===r?'#6366f1':'transparent', color:role===r?'#fff':'#6b7280', fontSize:13, fontWeight:role===r?700:500, cursor:'pointer', fontFamily:'Inter,sans-serif', transition:'all 0.2s' }}>
              {r==='candidate'?"I'm a candidate":"I'm a company"}
            </button>
          ))}
        </div>

        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:22, padding:'1.75rem' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
            <div><label style={lbl}>Full name</label><input placeholder="Abhi B." value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
            <div><label style={lbl}>Location</label><input placeholder="Chennai, India" value={form.location} onChange={e=>setForm({...form,location:e.target.value})} /></div>
          </div>
          <div style={{ marginBottom:12 }}><label style={lbl}>Email</label><input type="email" placeholder="you@email.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
          <div style={{ marginBottom:12 }}><label style={lbl}>Password</label><input type="password" placeholder="Min. 6 characters" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} /></div>
          {role==='candidate'
            ? <div style={{ marginBottom:16 }}><label style={lbl}>College</label><input placeholder="Anna University, Chennai" value={form.college} onChange={e=>setForm({...form,college:e.target.value})} /></div>
            : <div style={{ marginBottom:16 }}><label style={lbl}>Company name</label><input placeholder="Acme Corp" value={form.company_name} onChange={e=>setForm({...form,company_name:e.target.value})} /></div>
          }

          {error && <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:9, padding:'10px 12px', color:'#f87171', fontSize:13, marginBottom:14 }}>{error}</div>}

          <button onClick={handleSubmit} disabled={loading} style={{ width:'100%', padding:12, background:'#6366f1', border:'none', borderRadius:11, color:'#fff', fontSize:14, fontWeight:700, cursor:loading?'not-allowed':'pointer', fontFamily:'Inter,sans-serif', display:'flex', alignItems:'center', justifyContent:'center', gap:8, opacity:loading?0.7:1, boxShadow:'0 0 20px rgba(99,102,241,0.3)', letterSpacing:'-0.2px' }}>
            {loading && <Loader2 size={16} style={{ animation:'spin 1s linear infinite' }} />}
            {loading ? 'Creating account...' : 'Create account →'}
          </button>

          <p style={{ textAlign:'center', fontSize:13, color:'#6b7280', marginTop:16 }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color:'#818cf8', fontWeight:700, textDecoration:'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return <Suspense><SignupForm /></Suspense>
}
