import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'

export default function HomePage() {
  return (
    <>
      <Navbar userRole={null} />

      {/* Hero */}
      <div style={{ padding: '5rem 2rem 4rem', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'rgba(79,142,247,0.1)', border: '1px solid rgba(79,142,247,0.3)',
          borderRadius: '999px', padding: '0.35rem 1rem',
          fontSize: '0.75rem', color: 'var(--accent)', marginBottom: '1.5rem'
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
          AI-Powered Job Matching
        </div>

        <h1 style={{
          fontFamily: 'var(--font-syne)', fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 800, lineHeight: 1.1, color: '#fff', marginBottom: '1.25rem'
        }}>
          Find jobs that actually<br />
          <span style={{ color: 'var(--accent)' }}>match your skills</span>
        </h1>

        <p style={{ fontSize: '1.1rem', color: 'var(--muted)', maxWidth: '560px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
          HireWise uses AI to semantically match your resume and skills to the right roles — not just keywords.
          Direct communication with companies, zero noise.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
          <Link href="/signup">
            <button style={{
              padding: '0.75rem 2rem', background: 'var(--accent)', border: 'none',
              borderRadius: '10px', color: '#fff', fontSize: '1rem', fontWeight: 500,
              cursor: 'pointer', fontFamily: 'var(--font-dm)'
            }}>Find my matches →</button>
          </Link>
          <Link href="/signup?role=company">
            <button style={{
              padding: '0.75rem 2rem', background: 'transparent',
              border: '1px solid var(--border)', borderRadius: '10px',
              color: '#fff', fontSize: '1rem', cursor: 'pointer', fontFamily: 'var(--font-dm)'
            }}>Post a job</button>
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[['2.4K+', 'Active jobs'], ['89%', 'Match accuracy'], ['340+', 'Companies hiring']].map(([num, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-syne)', fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>{num}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {[
            { icon: '🤖', color: 'rgba(79,142,247,0.15)', title: 'AI Resume Parsing', desc: 'Upload your resume once. Our AI extracts skills, experience, and context automatically.' },
            { icon: '🎯', color: 'rgba(16,185,129,0.15)', title: 'Semantic Matching', desc: 'Goes beyond keywords — understands your actual capabilities and matches accordingly.' },
            { icon: '💬', color: 'rgba(124,58,237,0.15)', title: 'Direct Messaging', desc: 'Talk directly with hiring managers. No recruiters, no gatekeepers.' },
            { icon: '⚡', color: 'rgba(245,158,11,0.15)', title: 'AI Cover Letters', desc: 'One-click AI-generated cover letters tailored to each job you apply for.' },
          ].map(f => (
            <div key={f.title} style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: '14px', padding: '1.25rem'
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8, background: f.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '0.75rem', fontSize: 16
              }}>{f.icon}</div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#fff', marginBottom: '0.4rem' }}>{f.title}</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Footer */}
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: '2rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
          Ready to find your match?
        </h2>
        <Link href="/signup">
          <button style={{
            padding: '0.875rem 2.5rem', background: 'var(--accent)', border: 'none',
            borderRadius: '10px', color: '#fff', fontSize: '1rem', fontWeight: 500,
            cursor: 'pointer', fontFamily: 'var(--font-dm)'
          }}>Get started free →</button>
        </Link>
      </div>
    </>
  )
}
