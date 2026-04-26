'use client'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'
import { Message, Conversation, Profile } from '@/types'
import { Send, Loader2, ArrowLeft } from 'lucide-react'

export default function ChatPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const [messages, setMessages] = useState<Message[]>([])
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [otherUser, setOtherUser] = useState<Profile | null>(null)
  const [currentUser, setCurrentUser] = useState<Profile | null>(null)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadChat()
    const unsub = subscribeToMessages()
    return () => { unsub() }
  }, [params.id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadChat = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Get current user profile
    const { data: me } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    setCurrentUser(me)

    // Get conversation
    const { data: conv } = await supabase.from('conversations').select('*').eq('id', params.id).single()
    setConversation(conv)

    // Get other user
    const otherId = conv?.candidate_id === user.id ? conv?.company_id : conv?.candidate_id
    const { data: other } = await supabase.from('profiles').select('*').eq('id', otherId).single()
    setOtherUser(other)

    // Get messages
    const { data: msgs } = await supabase.from('messages')
      .select('*').eq('conversation_id', params.id).order('created_at', { ascending: true })
    setMessages(msgs || [])
    setLoading(false)
  }

  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`messages:${params.id}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'messages',
        filter: `conversation_id=eq.${params.id}`
      }, payload => {
        setMessages(prev => [...prev, payload.new as Message])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }

  const sendMessage = async () => {
    if (!text.trim() || sending || !currentUser) return
    setSending(true)
    const content = text.trim()
    setText('')

    await supabase.from('messages').insert({
      conversation_id: params.id,
      sender_id: currentUser.id,
      content
    })
    setSending(false)
  }

  const formatTime = (ts: string) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  if (loading) return (
    <>
      <Navbar userRole={currentUser?.role || null} />
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
        <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    </>
  )

  return (
    <>
      <Navbar userRole={currentUser?.role || null} />
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '1.5rem', height: 'calc(100vh - 65px)', display: 'flex', flexDirection: 'column' }}>

        {/* Chat header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.875rem',
          marginBottom: '1rem', padding: '1rem',
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: '14px'
        }}>
          <button
            onClick={() => history.back()}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: '4px' }}>
            <ArrowLeft size={18} />
          </button>

          <div style={{
            width: 38, height: 38, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.9rem', color: '#fff'
          }}>
            {otherUser?.name?.[0]?.toUpperCase()}
          </div>

          <div>
            <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>{otherUser?.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
              Online
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column',
          gap: '0.5rem', padding: '0.5rem 0', marginBottom: '1rem'
        }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.875rem', padding: '2rem' }}>
              Start the conversation! Say hi 👋
            </div>
          )}

          {messages.map((msg, i) => {
            const isMe = msg.sender_id === currentUser?.id
            const showTime = i === messages.length - 1 ||
              messages[i + 1]?.sender_id !== msg.sender_id

            return (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '75%', padding: '0.75rem 1rem',
                  borderRadius: isMe ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: isMe ? 'var(--accent)' : 'var(--card)',
                  border: isMe ? 'none' : '1px solid var(--border)',
                  color: isMe ? '#fff' : '#e2e8f0',
                  fontSize: '0.875rem', lineHeight: 1.6
                }}>
                  {msg.content}
                </div>
                {showTime && (
                  <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '0.25rem', padding: '0 4px' }}>
                    {formatTime(msg.created_at)}
                  </div>
                )}
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{
          display: 'flex', gap: '0.625rem', alignItems: 'center',
          padding: '0.75rem', background: 'var(--card)',
          border: '1px solid var(--border)', borderRadius: '14px'
        }}>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Type a message..."
            style={{ flex: 1, background: 'transparent', border: 'none', padding: '0.25rem 0', fontSize: '0.875rem' }}
          />
          <button
            onClick={sendMessage}
            disabled={!text.trim() || sending}
            style={{
              width: 36, height: 36, borderRadius: '8px',
              background: text.trim() ? 'var(--accent)' : 'rgba(255,255,255,0.06)',
              border: 'none', cursor: text.trim() ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s', flexShrink: 0
            }}>
            {sending
              ? <Loader2 size={15} color="#fff" style={{ animation: 'spin 1s linear infinite' }} />
              : <Send size={15} color={text.trim() ? '#fff' : 'var(--muted)'} />}
          </button>
        </div>
      </div>
    </>
  )
}
