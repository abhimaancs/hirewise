'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'
import { MessageSquare, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function ConversationsPage() {
  const supabase = createClient()
  const [convs, setConvs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<'candidate'|'company'|null>(null)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const { data:{ session } } = await supabase.auth.getSession()
      if (!session) { window.location.href='/login'; return }
      setAuthChecked(true)
      loadConvs(session.user.id)
    }
    checkAuth()
  }, [])

  const loadConvs = async (uid: string) => {
    try {
      const { data:profile } = await supabase.from('profiles').select('role').eq('id',uid).single()
      setUserRole(profile?.role)
      const { data:conversations } = await supabase.from('conversations').select('*').or(`candidate_id.eq.${uid},company_id.eq.${uid}`).order('created_at',{ ascending:false })
      if (!conversations?.length) { setLoading(false); return }
      const enriched = await Promise.all(conversations.map(async (conv:any) => {
        const otherId = conv.candidate_id===uid ? conv.company_id : conv.candidate_id
        const { data:other } = await supabase.from('profiles').select('*').eq('id',otherId).single()
        const { data:lastMsg } = await supabase.from('messages').select('content,created_at').eq('conversation_id',conv.id).order('created_at',{ ascending:false }).limit(1).single()
        return { ...conv, other:other||null, last_message:lastMsg?.content||null, last_time:lastMsg?.created_at||conv.created_at }
      }))
      setConvs(enriched)
    } catch(err) { console.error(err) }
    finally { setLoading(false) }
  }

  const timeAgo = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime()
    const mins = Math.floor(diff/60000)
    if (mins<1) return 'just now'
    if (mins<60) return `${mins}m ago`
    const hrs = Math.floor(mins/60)
    if (hrs<24) return `${hrs}h ago`
    return new Date(ts).toLocaleDateString()
  }

  if (!authChecked) return (
    <div style={{ textAlign:'center', padding:'4rem', color:'#6b7280' }}>
      <Loader2 size={24} style={{ animation:'spin 1s linear infinite' }}/>
    </div>
  )

  return (
    <>
      <Navbar userRole={userRole}/>
      <div style={{ maxWidth:700, margin:'0 auto', padding:'2rem 1.5rem' }}>
        <div style={{ marginBottom:'1.5rem' }}>
          <h1 style={{ fontSize:22, fontWeight:800, color:'#fff', letterSpacing:'-0.5px', marginBottom:4 }}>Messages</h1>
          <p style={{ fontSize:13, color:'#6b7280' }}>Your conversations with {userRole==='candidate'?'companies':'candidates'}</p>
        </div>

        {loading ? (
          <div style={{ textAlign:'center', padding:'4rem', color:'#6b7280' }}>
            <Loader2 size={24} style={{ animation:'spin 1s linear infinite', marginBottom:12 }}/>
          </div>
        ) : convs.length===0 ? (
          <div style={{ textAlign:'center', padding:'5rem', color:'#6b7280' }}>
            <MessageSquare size={44} style={{ marginBottom:14, opacity:0.2 }}/>
            <p style={{ fontSize:16, fontWeight:700, color:'#e5e7eb', marginBottom:6 }}>No messages yet</p>
            <p style={{ fontSize:13 }}>{userRole==='candidate'?'Apply to jobs to start conversations':'Message candidates from the candidates page'}</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {convs.map((conv:any) => (
              <Link key={conv.id} href={`/chat/${conv.id}`} style={{ textDecoration:'none' }}>
                <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, padding:'1rem 1.25rem', display:'flex', alignItems:'center', gap:14, cursor:'pointer', transition:'all 0.2s' }}
                  onMouseEnter={e=>{ const el=e.currentTarget as HTMLElement; el.style.borderColor='rgba(99,102,241,0.35)'; el.style.background='rgba(255,255,255,0.05)' }}
                  onMouseLeave={e=>{ const el=e.currentTarget as HTMLElement; el.style.borderColor='rgba(255,255,255,0.07)'; el.style.background='rgba(255,255,255,0.03)' }}
                >
                  <div style={{ width:46, height:46, borderRadius:'50%', flexShrink:0, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, color:'#fff', fontSize:17 }}>
                    {conv.other?.name?.[0]?.toUpperCase()||'?'}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:700, color:'#e5e7eb', fontSize:14, marginBottom:3 }}>{conv.other?.name||'Unknown'}</div>
                    <div style={{ fontSize:13, color:'#6b7280', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {conv.last_message||'Start the conversation!'}
                    </div>
                  </div>
                  <div style={{ fontSize:11, color:'#4b5563', flexShrink:0 }}>{timeAgo(conv.last_time)}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
