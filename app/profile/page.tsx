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
      if (!session) {
        window.location.href = '/login'
        return
      }
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
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setParsing(true)
    try {
      const text = await file.text()
      const res = await fetch('/api/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: text })
      })
      const { data } = await res.json()
      if (data) {
        setProfile((prev: any) => ({ ...prev, bio: data.bio, experience_years: data.experience_years }))
        if (data.skills?.length) setSkills(data.skills)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setParsing(false)
    }
  }

  const addSkill = () => {
    const trimmed = newSkill.trim()
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed])
      setNewSkill('')
    }
  }

  const removeSkill = (skill: string) => setSkills(skills.filter(s => s !== skill))

  const handleSave = async () => {
    if (!userId) return
    setSaving(true)
    try {
      await supabase.from('profiles')
        .update({ name: profile.name })
        .eq('id', userId)

      const { error } = await supabase.from('candidate_profiles')
        .upsert({
          id: userId,
          college: profile.college || '',
          skills: skills,
          experience_years: profile.experience_years || 0,
          bio: profile.bio || '',
          location: profile.location || ''
        })

      if (error) throw error
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      console.error('Save error:', err)
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
      <Navbar userRole="candidate" />
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
        <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    </>
  )

  return (
    <>
      <Navbar userRole="candidate" />
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-syne)', fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>My Profile</h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>Better profile = better AI matches</p>
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

        {/* Resume Upload */}
        <div style={s.section}>
          <div style={{ fontFamily: 'var(--font-syne)', fontSize: '0.9rem', fontWeight: 600, color: '#fff', marginBottom: '1rem' }}>
            Resume — AI extracts your skills automatically
          </div>
          <label style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '1rem', border: '1px dashed var(--border)',
            borderRadius: '10px', cursor: 'pointer', color: 'var(--muted)', fontSize: '0.875rem'
          }}>
            {parsing
              ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
              : <Upload size={18} />}
            {parsing ? 'AI is reading your resume...' : 'Upload resume (.txt file)'}
            <input type="file" accept=".txt" onChange={handleResumeUpload} style={{ display: 'none' }} />
          </label>
        </div>

        {/* Basic Info */}
        <div style={s.section}>
          <div style={{ fontFamily: 'var(--font-syne)', fontSize: '0.9rem', fontWeight: 600, color: '#fff', marginBottom: '1rem' }}>
            Basic Info
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div style={s.group}>
              <label style={s.label}>Full name</label>
              <input value={profile.name || ''} onChange={e => setProfile({ ...profile, name: e.target.value })} placeholder="Your name" />
            </div>
            <div style={s.group}>
              <label style={s.label}>Location</label>
              <input value={profile.location || ''} onChange={e => setProfile({ ...profile, location: e.target.value })} placeholder="Chennai, India" />
            </div>
          </div>
          <div style={s.group}>
            <label style={s.label}>College / University</label>
            <input value={profile.college || ''} onChange={e => setProfile({ ...profile, college: e.target.value })} placeholder="Anna University, Chennai" />
          </div>
          <div style={s.group}>
            <label style={s.label}>Experience (years)</label>
            <input type="number" min="0" value={profile.experience_years || 0}
              onChange={e => setProfile({ ...profile, experience_years: parseInt(e.target.value) || 0 })} />
          </div>
          <div style={s.group}>
            <label style={s.label}>Bio</label>
            <textarea value={profile.bio || ''} onChange={e => setProfile({ ...profile, bio: e.target.value })}
              placeholder="2–3 sentences about yourself..." rows={3} style={{ resize: 'vertical' }} />
          </div>
        </div>

        {/* Skills */}
        <div style={s.section}>
          <div style={{ fontFamily: 'var(--font-syne)', fontSize: '0.9rem', fontWeight: 600, color: '#fff', marginBottom: '1rem' }}>
            Skills — used for AI job matching
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            {skills.map(skill => (
              <div key={skill} style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                background: 'rgba(79,142,247,0.1)', border: '1px solid rgba(79,142,247,0.25)',
                color: 'var(--accent)', borderRadius: '999px', fontSize: '0.75rem', padding: '0.25rem 0.75rem'
              }}>
                {skill}
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeSkill(skill)} />
              </div>
            ))}
            {skills.length === 0 && (
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>No skills added yet. Add some below!</p>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              value={newSkill}
              onChange={e => setNewSkill(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addSkill()}
              placeholder="Type a skill and press Enter (e.g. React, C++, DSA)"
            />
            <button onClick={addSkill} style={{
              padding: '0 1rem', background: 'var(--accent)', border: 'none',
              borderRadius: '8px', color: '#fff', cursor: 'pointer', flexShrink: 0
            }}>
              <Plus size={16} />
            </button>
          </div>
        </div>

      </div>
    </>
  )
}
