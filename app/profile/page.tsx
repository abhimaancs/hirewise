'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'
import { Plus, X, Loader2, CheckCircle, Upload, TrendingUp, AlertCircle } from 'lucide-react'

export default function ProfilePage() {
  const supabase = createClient()
  const [profile, setProfile] = useState<any>({})
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [parsing, setParsing] = useState(false)
  const [parseError, setParseError] = useState('')
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

  const strength = () => {
    let s = 0
    if (profile.name) s += 20
    if (profile.college) s += 20
    if (profile.bio) s += 20
    if (skills.length >= 3) s += 20
    if (profile.location) s += 20
    return s
  }

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset input so the same file can be re-uploaded if needed
    e.target.value = ''

    setParsing(true)
    setParseError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/parse-resume', { method: 'POST', body: formData })
      const json = await res.json()

      if (!res.ok || json.error) {
        setParseError(json.error || 'Failed to parse resume. Please try again.')
        return
      }

      const { data, resumeText } = json

      if (data) {
        setProfile((prev: any) => ({ ...prev, bio: data.bio, experience_years: data.experience_years }))
        if (data.skills?.length) setSkills(data.skills)
      }

      // Persist the raw extracted text to candidate_profiles.resume_text
      if (userId && resumeText) {
        await supabase
          .from('candidate_profiles')
          .update({ resume_text: resumeText })
          .eq('id', userId)
      }
    } catch (err) {
      console.error(err)
      setParseError('Something went wrong. Please try again.')
    } finally {
      setParsing(false)
    }
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
    } catch (err) { console.error(err); alert('Failed to save') }
    finally { setSaving(false) }
  }

  const s = strength()
  const sLabel = s >= 80 ? 'Excellent' : s >= 60 ? 'Good' : s >= 40 ? 'Fair' : 'Needs work'
  const sColor = s >= 80 ? '#34d399' : s >= 60 ? '#818cf8' : s >= 40 ? '#fbbf24' : '#f87171'
  const lbl = { fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 6, display: 'block' }

  if (loading) return (
    <>
      <Navbar userRole="candidate" />
      <div style={{ textAlign: 'center', padding: '5rem', color: '#6b7280' }}>
        <Loader2 size={28} style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    </>
  )

  return (
    <>
      <Navbar userRole="candidate" />
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', marginBottom: 4 }}>My Profile</h1>
            <p style={{ fontSize: 13, color: '#6b7280' }}>Complete your profile for better AI matches</p>
          </div>
          <button onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: saved ? 'rgba(16,185,129,0.15)' : '#6366f1', border: saved ? '1px solid rgba(16,185,129,0.3)' : 'none', borderRadius: 10, color: saved ? '#34d399' : '#fff', fontSize: 13, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'Inter,sans-serif', opacity: saving ? 0.7 : 1 }}>
            {saving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : saved ? <CheckCircle size={14} /> : null}
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save profile'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 14 }}>
          {/* Sidebar */}
          <div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '1.25rem', marginBottom: 12, textAlign: 'center' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 26, fontWeight: 800 }}>
                {profile.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#f1f1f1', marginBottom: 3, letterSpacing: '-0.2px' }}>{profile.name || 'Your name'}</div>
              <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 16 }}>{profile.college || 'Add your college'}</div>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 14 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 4 }}><TrendingUp size={12} />Strength</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: sColor }}>{sLabel}</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${s}%`, height: '100%', background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', borderRadius: 3, transition: 'width 0.4s' }} />
              </div>
              <div style={{ fontSize: 11, color: '#4b5563', marginTop: 6 }}>{s}% complete</div>
            </div>

            {/* Upload widget */}
            <label style={{ display: 'block', background: 'rgba(255,255,255,0.02)', border: `1px dashed ${parseError ? 'rgba(239,68,68,0.4)' : 'rgba(99,102,241,0.3)'}`, borderRadius: 14, padding: '1.25rem', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.06)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)' }}
            >
              {parsing
                ? <Loader2 size={22} color="#818cf8" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 8px' }} />
                : <Upload size={22} color={parseError ? '#f87171' : '#818cf8'} style={{ margin: '0 auto 8px' }} />
              }
              <div style={{ fontSize: 13, fontWeight: 700, color: parseError ? '#f87171' : '#818cf8', marginBottom: 3 }}>
                {parsing ? 'AI reading...' : 'Upload Resume'}
              </div>
              <div style={{ fontSize: 11, color: '#6b7280', lineHeight: 1.5 }}>
                PDF or TXT — AI extracts your skills automatically
              </div>
              <input type="file" accept=".pdf,.txt" onChange={handleResumeUpload} style={{ display: 'none' }} />
            </label>

            {/* Parse error message */}
            {parseError && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginTop: 8, padding: '8px 10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 9 }}>
                <AlertCircle size={13} color="#f87171" style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 11, color: '#f87171', lineHeight: 1.5 }}>{parseError}</span>
              </div>
            )}
          </div>

          {/* Main */}
          <div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '1.25rem', marginBottom: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f1f1', marginBottom: 16, letterSpacing: '-0.2px' }}>Basic Info</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div><label style={lbl}>Full name</label><input value={profile.name || ''} onChange={e => setProfile({ ...profile, name: e.target.value })} placeholder="Your name" /></div>
                <div><label style={lbl}>Location</label><input value={profile.location || ''} onChange={e => setProfile({ ...profile, location: e.target.value })} placeholder="Chennai, India" /></div>
              </div>
              <div style={{ marginBottom: 12 }}><label style={lbl}>College / University</label><input value={profile.college || ''} onChange={e => setProfile({ ...profile, college: e.target.value })} placeholder="Anna University, Chennai" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
                <div><label style={lbl}>Experience (yrs)</label><input type="number" min="0" value={profile.experience_years || 0} onChange={e => setProfile({ ...profile, experience_years: parseInt(e.target.value) || 0 })} /></div>
                <div><label style={lbl}>Bio</label><input value={profile.bio || ''} onChange={e => setProfile({ ...profile, bio: e.target.value })} placeholder="2–3 sentences about yourself..." /></div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '1.25rem' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f1f1', marginBottom: 14, letterSpacing: '-0.2px' }}>Skills — used for AI matching</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14, minHeight: 36 }}>
                {skills.map(skill => (
                  <span key={skill} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(99,102,241,0.12)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 20, fontSize: 12, padding: '5px 11px', fontWeight: 600 }}>
                    {skill}<X size={11} style={{ cursor: 'pointer', opacity: 0.6 }} onClick={() => setSkills(skills.filter(s => s !== skill))} />
                  </span>
                ))}
                {!skills.length && <span style={{ fontSize: 13, color: '#4b5563', padding: '4px 0' }}>No skills added yet</span>}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill()} placeholder="Type a skill and press Enter (e.g. React, C++, DSA)" />
                <button onClick={addSkill} style={{ padding: '0 16px', background: '#6366f1', border: 'none', borderRadius: 10, color: '#fff', cursor: 'pointer', flexShrink: 0, fontWeight: 700, fontSize: 18 }}>+</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
