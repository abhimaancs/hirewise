'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'
import { Profile } from '@/types'
import { MessageSquare, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface ConvRow {
  id: string
  candidate_id: string
  company_id: string
  created_at: string
  other: Profile | null
  last_message: string | null
}

export default function ConversationsPage() {
  const supabase = createClient()
  const [convs, setConvs] = useState<ConvRow[]>([])
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<'candidate' | 'company' | null>(null)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        window.location.href = '/login'
        return
      }
      setAuthChecked(true)
      loadConvs(session.user.id)
    }
    checkAuth()
  }, [])

  const loadConvs = async (uid: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles').select('role').eq('id', uid).single()
      setUserRole(profile?.role)

      const { data: conversations } = await supabase
        .from('conversations')
        .select('*')
        .or(`candidate_id.eq.${uid},company_id.eq.${uid}`)
        .order('created_at', { ascending: false })

      if (!conversations?.length) { setLoading(false); return }

      const enriched: ConvRow[] = await Promise.all(
        conversations.map(async (conv) => {
          const otherId = conv.candidate_id === uid ? conv.company_id : conv.candidate_id
          const { data: other } = await supabase
            .from('profiles').select('*').eq('id', otherId).single()
          const { data: lastMsg } = await supabase
            .from('messages').select('content')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false }).limit(1).single()
          return { ...conv, other: other || null, last_message: lastMsg?.content || null }
        })
      )
      setConvs(enriched)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!authChecked) return (
    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
      <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
    </div>
  )

  return (
    <>
      <Navbar userRole={userRole} />
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-syne)', fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>
          Messages
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
          Your conversations with {userRole === 'candidate' ? 'companies' : 'candidates'}
        </p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
            <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : convs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
            <MessageSquare size={40} style={{ marginBottom: '1rem', opacity: 0.4 }} />
            <p>No messages yet.</p>
            <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
              {userRole === 'candidate'
                ? 'Apply to jobs to start conversations with companies.'
                : 'Message candidates from the candidates page.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {convs.map(conv => (
              <Link key={conv.id} href={`/chat/${conv.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'var(--card)', border: '1px solid var(--border)',
                  borderRadius: '14px', padding: '1rem 1.25rem',
                  display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer'
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-syne)', fontWeight: 700, color: '#fff'
                  }}>
                    {conv.other?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                      {conv.other?.name || 'Unknown'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {conv.last_message || 'No messages yet — start the conversation!'}
                    </div>
                  </div>
                  <MessageSquare size={16} color="var(--muted)" style={{ flexShrink: 0 }} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
