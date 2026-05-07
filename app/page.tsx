import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'

export default function HomePage() {
  return (
    <>
      <Navbar userRole={null} />

      {/* Hero */}
      <div style={{ padding: '5rem 2rem 4rem', maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: '#eef2ff', border: '1px solid #c7d2fe',
          borderRadius: 999, padding: '5px 14px',
          fontSize: 12, color: '#6366f1', fontWeight: 600, marginBottom: '1.5rem'
        }}>
          ✦ AI-Powered Job Matching
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 700,
          lineHeight: 1.15, color: '#1a1a1a', marginBottom: '1.25rem',
          fontFamily: 'Inter, sans-serif'
        }}>
          Find jobs that actually<br />
          <span style={{ color: '#6366f1' }}>match your skills</span>
        </h1>

        <p style={{ fontSize: '1.05rem', color: '#555', maxWidth: '520px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
          HireWise uses AI to semantically match your profile to the right roles — not just keywords.
          Direct communication with companies, zero noise.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '4rem' }}>
          <Link href="/signup">
            <button style={{
              padding: '12px 28px', background: '#6366f1', border: 'none',
              borderRadius: 10, color: '#fff', fontSize: 15, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'Inter, sans-serif'
            }}>Find my matches →</button>
          </Link>
          <Link href="/signup?role=company">
            <button style={{
              padding: '12px 28px', background: '#fff',
              border: '1px solid #d0d0d0', borderRadius: 10,
              color: '#1a1a1a', fontSize: 15, fontWeight: 500,
              cursor: 'pointer', fontFamily: 'Inter, sans-serif'
            }}>Post a job</button>
          </Link>
        </div>

        {/* How it works */}
        <div style={{
          background: '#fff', border: '1px solid #e8e8e8', borderRadius: 16,
          padding: '2rem', maxWidth: 700, margin: '0 auto'
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
            How it works
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {[
              { step: '01', title: 'Create your profile', desc: 'Add your skills, experience and upload your resume' },
              { step: '02', title: 'AI finds your matches', desc: 'Our AI scores every job based on your actual profile' },
              { step: '03', title: 'Connect directly', desc: 'Chat with companies and get hired faster' },
            ].map(s => (
              <div key={s.step} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#6366f1', marginBottom: 8 }}>{s.step}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', marginBottom: 6 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: '#666', lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: '1rem 2rem 3rem', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a', marginBottom: 8 }}>Everything you need to get hired</div>
          <div style={{ fontSize: 14, color: '#666' }}>Built for candidates and companies looking for a smarter way to connect</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '1rem' }}>
          {[
            { icon: '🤖', bg: '#eef2ff', title: 'AI Resume Parsing', desc: 'Upload your resume and AI automatically extracts your skills and experience.' },
            { icon: '🎯', bg: '#ecfdf5', title: 'Semantic Matching', desc: 'Goes beyond keywords — understands what you actually know and can do.' },
            { icon: '💬', bg: '#fdf4ff', title: 'Direct Messaging', desc: 'Talk directly with hiring managers without going through recruiters.' },
            { icon: '📊', bg: '#fffbeb', title: 'Match Scores', desc: 'See exactly why you matched a job and what skills overlap.' },
          ].map(f => (
            <div key={f.title} style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 14, padding: '1.25rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem', fontSize: 16 }}>{f.icon}</div>
              <h4 style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', marginBottom: '0.4rem' }}>{f.title}</h4>
              <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* For candidates and companies */}
      <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: 16, padding: '2rem' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>For Candidates</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', marginBottom: 12 }}>Find your perfect role faster</div>
            <div style={{ fontSize: 13, color: '#555', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Upload your resume, add your skills, and let AI find the jobs where you're the best fit. No more applying blindly.
            </div>
            <Link href="/signup">
              <button style={{ padding: '10px 20px', background: '#6366f1', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                Get started →
              </button>
            </Link>
          </div>

          <div style={{ background: '#f0fdf4', border: '1px solid #a7f3d0', borderRadius: 16, padding: '2rem' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>For Companies</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', marginBottom: 12 }}>Find the right candidate, fast</div>
            <div style={{ fontSize: 13, color: '#555', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Post a job and AI instantly ranks all candidates by how well they fit your requirements. Message top matches directly.
            </div>
            <Link href="/signup?role=company">
              <button style={{ padding: '10px 20px', background: '#059669', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                Post a job →
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', marginBottom: 8 }}>Ready to find your match?</div>
        <div style={{ fontSize: 14, color: '#666', marginBottom: '1.5rem' }}>Join HireWise and let AI do the hard work</div>
        <Link href="/signup">
          <button style={{ padding: '13px 32px', background: '#6366f1', border: 'none', borderRadius: 10, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
            Get started free →
          </button>
        </Link>
      </div>
    </>
  )
}
