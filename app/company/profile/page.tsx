'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'
import { Loader2, CheckCircle } from 'lucide-react'

export default function CompanyProfilePage() {
  const supabase = createClient()
  const [profile, setProfile] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [userId, setUserId] = useState<string|null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const { data:{ session } } = await supabase.auth.getSession()
      if (!session) { window.location.href='/login'; return }
      setUserId(session.user.id)
      loadProfile(session.user.id)
    }
    checkAuth()
  }, [])

  const loadProfile = async (uid: string) => {
    try {
      const { data:p } = await supabase.from('profiles').select('*').eq('id',uid).single()
      const { data:c } = await supabase.from('company_profiles').select('*').eq('id',uid).single()
      setProfile({...p,...c})
    } catch(err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleSave = async () => {
    if (!userId) return
    setSaving(true)
    try {
      await supabase.from('profiles').update({ name:profile.name }).eq('id',userId)
      await supabase.from('company_profiles').upsert({ id:userId, company_name:profile.company_name||'', website:profile.website||'', description:profile.description||'', location:profile.location||'' })
      setSaved(true); setTimeout(()=>setSaved(false),2500)
    } catch(err) { console.error(err); alert('Failed to save') }
    finally { setSaving(false) }
  }

  const lbl = { fontSize:11, fontWeight:700, color:'#6b7280', textTransform:'uppercase' as const, letterSpacing:'0.06em', marginBottom:6, display:'block' }

  if (loading) return (
    <>
      <Navbar userRole="company"/>
      <div style={{ textAlign:'center', padding:'5rem', color:'#6b7280' }}>
        <Loader2 size={28} style={{ animation:'spin 1s linear infinite' }}/>
      </div>
    </>
  )

  return (
    <>
      <Navbar userRole="company"/>
      <div style={{ maxWidth:700, margin:'0 auto', padding:'2rem 1.5rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem' }}>
          <div>
            <h1 style={{ fontSize:22, fontWeight:800, color:'#fff', letterSpacing:'-0.5px', marginBottom:4 }}>Company Profile</h1>
            <p style={{ fontSize:13, color:'#6b7280' }}>Update your company details</p>
          </div>
          <button onClick={handleSave} disabled={saving} style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 18px', background:saved?'rgba(16,185,129,0.15)':'#6366f1', border:saved?'1px solid rgba(16,185,129,0.3)':'none', borderRadius:10, color:saved?'#34d399':'#fff', fontSize:13, fontWeight:700, cursor:saving?'not-allowed':'pointer', fontFamily:'Inter,sans-serif', opacity:saving?0.7:1 }}>
            {saving?<Loader2 size={14} style={{ animation:'spin 1s linear infinite' }}/>:saved?<CheckCircle size={14}/>:null}
            {saving?'Saving...':saved?'Saved!':'Save profile'}
          </button>
        </div>

        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:18, padding:'1.5rem' }}>
          <div style={{ fontSize:14, fontWeight:700, color:'#f1f1f1', marginBottom:16 }}>Company Info</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
            <div><label style={lbl}>Contact name</label><input value={profile.name||''} onChange={e=>setProfile({...profile,name:e.target.value})} placeholder="Your name"/></div>
            <div><label style={lbl}>Company name</label><input value={profile.company_name||''} onChange={e=>setProfile({...profile,company_name:e.target.value})} placeholder="Acme Corp"/></div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
            <div><label style={lbl}>Location</label><input value={profile.location||''} onChange={e=>setProfile({...profile,location:e.target.value})} placeholder="Bangalore, India"/></div>
            <div><label style={lbl}>Website</label><input value={profile.website||''} onChange={e=>setProfile({...profile,website:e.target.value})} placeholder="https://yourcompany.com"/></div>
          </div>
          <div><label style={lbl}>Company description</label>
            <textarea value={profile.description||''} onChange={e=>setProfile({...profile,description:e.target.value})} placeholder="Tell candidates about your company, culture, and what you're building..." rows={4} style={{ resize:'vertical' }}/>
          </div>
        </div>
      </div>
    </>
  )
}
