'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'
import { Plus, X, Loader2, CheckCircle, Upload } from 'lucide-react'

export default function ProfilePage() {
  const supabase = createClient()
  const [profile, setProfile] = useState<any>({})
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [parsing, setParsing] = useState(false)
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
      const { data: c } = await supabase.from('candidate_profiles').select('*').eq('id', uid).single()
      setProfile({ ...p, ...c })
      setSkills(c?.skills || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const profileStrength = () => {
    let score = 0
    if (profile.name) score += 20
    if (profile.college) score += 20
    if (profile.bio) score += 20
    if (skills.length >= 3) score += 20
    if (profile.location) score += 20
    return score
  }

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setParsing(true)
    try {
      const text = await file.text()
      const res = await fetch('/api/parse-resume', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ resumeText: text }) })
      const { data } = await res.json()
      if (data) {
        setProfile((prev: any) => ({ ...prev, bio: data.bio, experience_years: data.experience_years }))
        if (data.skills?.length) setSkills(data.skills)
      }
    } catch (err) { console.error(err) }
    finally { setParsing(false) }
  }

  const addSkill = () => {
    const t = newSkill.trim()
    if (t && !skills.includes(t)) { setSkills([...skills, t]); setNewSkill('') }
  }

  const handleSave = async () => {
    if (!userId) return
    setSaving(true)
    try {
      await supabase.from('profiles').update({ name: profile.name }).eq('id', userId)
      const { error } = await supabase.from('candidate_profiles').upsert({ id: userId, college: profile.college || '', skills, experience_years: profile.experience_years || 0, bio: profile.bio || '', location: profile.location || '' })
      if (error) throw error
      setSaved(true); setTimeout(() => setSaved(false), 2500)
    } catch (err) { console.error(err); alert('Failed to save. Please try again.') }
    finally { setSaving(false) }
  }

  const strength = profileStrength()

  if (loading) return (
    <>
      <Navbar userRole="candidate" />
      <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
        <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    </>
  )

  return (
    <>
      <Navbar userRole="candidate" />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>My Profile</h1>
            <p style={{ fontSize: 13, color: '#888' }}>Complete your profile for better AI matches</p>
          </div>
          <button onClick={handleSave} disabled={saving} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
            background: saved ? '#ecfdf5' : '#6366f1',
            border: saved ? '1px solid #a7f3d0' : 'none',
            borderRadius: 10, color: saved ? '#059669' : '#fff',
            fontSize: 13, fontWeight: 500, cursor: saving ? 'not-allowed' : 'pointer',
            fontFamily: 'Inter, sans-serif', opacity: saving ? 0.7 : 1
          }}>
            {saving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : saved ? <CheckCircle size={14} /> : null}
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save profile'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '1rem' }}>
          {/* Left sidebar */}
          <div>
            <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 16, padding: '1.25rem', marginBottom: '1rem', textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '50%', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 22, fontWeight: 700 }}>
                {profile.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{profile.name || 'Your name'}</div>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 12 }}>{profile.college || 'Add your college'}</div>
              <div style={{ height: 1, background: '#f0f0f0', marginBottom: 12 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                <span style={{ color: '#888' }}>Profile strength</span>
                <span style={{ fontWeight: 600, color: strength >= 80 ? '#059669' : '#6366f1' }}>{strength}%</span>
              </div>
              <div style={{ height: 6, background: '#f0f0f0', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${strength}%`, height: '100%', background: strength >= 80 ? '#10b981' : '#6366f1', borderRadius: 3, transition: 'width 0.3s' }} />
              </div>
            </div>

            {/* Resume upload */}
            <label style={{ display: 'block', background: '#fff', border: '1px dashed #c7d2fe', borderRadius: 14, padding: '1rem', cursor: 'pointer', textAlign: 'center' }}>
              <div style={{ marginBottom: 6 }}>
                {parsing ? <Loader2 size={20} color="#6366f1" style={{ animation: 'spin 1s linear infinite', margin: '0 auto' }} /> : <Upload size={20} color="#6366f1" style={{ margin: '0 auto' }} />}
              </div>
              <div style={{ fontSize: 12, fontWeight: 500, color: '#6366f1', marginBottom: 2 }}>{parsing ? 'Reading resume...' : 'Upload resume'}</div>
              <div style={{ fontSize: 11, color: '#888' }}>AI extracts skills automatically</div>
              <input type="file" accept=".txt" onChange={handleResumeUpload} style={{ display: 'none' }} />
            </label>
          </div>

          {/* Main content */}
          <div>
            <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 16, padding: '1.25rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Basic Info</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Full name</div>
                  <input value={profile.name || ''} onChange={e => setProfile({ ...profile, name: e.target.value })} placeholder="Your name" />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Location</div>
                  <input value={profile.location || ''} onChange={e => setProfile({ ...profile, location: e.target.value })} placeholder="Chennai, India" />
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>College</div>
                <input value={profile.college || ''} onChange={e => setProfile({ ...profile, college: e.target.value })} placeholder="Anna University, Chennai" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Experience (yrs)</div>
                  <input type="number" min="0" value={profile.experience_years || 0} onChange={e => setProfile({ ...profile, experience_years: parseInt(e.target.value) || 0 })} />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Bio</div>
                  <input value={profile.bio || ''} onChange={e => setProfile({ ...profile, bio: e.target.value })} placeholder="2–3 sentences about yourself..." />
                </div>
              </div>
            </div>

            <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 16, padding: '1.25rem' }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Skills — used for AI matching</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 12, minHeight: 36 }}>
                {skills.map(skill => (
                  <span key={skill} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#eef2ff', color: '#6366f1', border: '1px solid #c7d2fe', borderRadius: 20, fontSize: 12, padding: '4px 10px', margin: '3px', fontWeight: 500 }}>
                    {skill} <X size={11} style={{ cursor: 'pointer' }} onClick={() => setSkills(skills.filter(s => s !== skill))} />
                  </span>
                ))}
                {skills.length === 0 && <span style={{ fontSize: 13, color: '#bbb' }}>No skills added yet</span>}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill()} placeholder="Type a skill and press Enter (e.g. React, C++, DSA)" />
                <button onClick={addSkill} style={{ padding: '0 14px', background: '#6366f1', border: 'none', borderRadius: 10, color: '#fff', cursor: 'pointer', flexShrink: 0 }}>
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
