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
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { window.location.href = '/login'; return }
      setUserId(session.user.id)
      loadProfile(session.user.id)
    }
    checkAuth()
  }, [])

  const loadProfile = async (uid: string) => {
    try {
      const { data: p } = await supabase.from('profiles').select('*').eq('id', uid).single()
      const { data: c } = await supabase.from('company_profiles').select('*').eq('id', uid).single()
      setProfile({ ...p, ...c })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!userId) return
    setSaving(true)
    try {
      await supabase.from('profiles').update({ name: profile.name }).eq('id', userId)
      await supabase.from('company_profiles').upsert({
        id: userId,
        company_name: profile.company_name || '',
        website: profile.website || '',
        description: profile.description || '',
        location: profile.location || ''
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      console.error(err)
      alert('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const s = {
    section: { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.25rem' } as React.CSSProperties,
    label: { display: 'block', fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.4rem' } as React.CSSProperties,
    group: { marginBottom: '1rem' } as React.CSSProperties,
  }

  if (loading) return (
    <>
      <Navbar userRole="company" />
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
        <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    </>
  )

  return (
    <>
      <Navbar userRole="company" />
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-syne)', fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>Company Profile</h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>Update your company details</p>
          </div>
          <button onClick={handleSave} disabled={saving} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '0.625rem 1.25rem',
            background: saved ? 'rgba(16,185,129,0.2)' : 'var(--accent)',
            border: saved ? '1px solid var(--green)' : 'none',
            borderRadius: '8px', color: saved ? 'var(--green)' : '#fff',
            fontSize: '0.875rem', cursor: saving ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-dm)', opacity: saving ? 0.7 : 1
          }}>
            {saving ? <Loader2 size={14} /> : saved ? <CheckCircle size={14} /> : null}
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save profile'}
          </button>
        </div>

        <div style={s.section}>
          <div style={{ fontFamily: 'var(--font-syne)', fontSize: '0.9rem', fontWeight: 600, color: '#fff', marginBottom: '1rem' }}>
            Company Info
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div style={s.group}>
              <label style={s.label}>Contact name</label>
              <input value={profile.name || ''} onChange={e => setProfile({ ...profile, name: e.target.value })} placeholder="Your name" />
            </div>
            <div style={s.group}>
              <label style={s.label}>Company name</label>
              <input value={profile.company_name || ''} onChange={e => setProfile({ ...profile, company_name: e.target.value })} placeholder="Acme Corp" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div style={s.group}>
              <label style={s.label}>Location</label>
              <input value={profile.location || ''} onChange={e => setProfile({ ...profile, location: e.target.value })} placeholder="Bangalore, India" />
            </div>
            <div style={s.group}>
              <label style={s.label}>Website</label>
              <input value={profile.website || ''} onChange={e => setProfile({ ...profile, website: e.target.value })} placeholder="https://yourcompany.com" />
            </div>
          </div>
          <div style={s.group}>
            <label style={s.label}>Company description</label>
            <textarea value={profile.description || ''} onChange={e => setProfile({ ...profile, description: e.target.value })}
              placeholder="Tell candidates about your company, culture, and what you're building..."
              rows={4} style={{ resize: 'vertical' }} />
          </div>
        </div>

      </div>
    </>
  )
}
