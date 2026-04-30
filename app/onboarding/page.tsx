'use client'
import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function OnboardingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isCompany = searchParams.get('role') === 'company'

  const steps = isCompany ? [
    { num: 1, title: 'Complete company profile', desc: 'Add your company details and description', href: '/company/profile' },
    { num: 2, title: 'Post your first job', desc: 'Add required skills and job description', href: '/company/jobs' },
    { num: 3, title: 'Find candidates', desc: 'AI ranks the best candidates for your role', href: '/company/candidates' },
  ] : [
    { num: 1, title: 'Complete your profile', desc: 'Add your skills, college and bio', href: '/profile' },
    { num: 2, title: 'Upload your resume', desc: 'AI will extract your skills automatically', href: '/profile' },
    { num: 3, title: 'Browse AI matches', desc: 'See jobs ranked by your fit score', href: '/jobs' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f8f7f4', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 64, height: 64, background: '#ecfdf5', borderRadius: 20, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🎉</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', marginBottom: 8 }}>Welcome to HireWise!</div>
          <div style={{ fontSize: 14, color: '#888' }}>
            {isCompany ? "You're 3 steps away from finding the perfect candidates" : "You're 3 steps away from finding your perfect job match"}
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          {steps.map(step => (
            <Link key={step.num} href={step.href} style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#fff', border: '1px solid #e8e8e8', borderRadius: 14,
                padding: '1rem 1.25rem', marginBottom: 10,
                display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer'
              }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#6366f1', flexShrink: 0 }}>{step.num}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a1a', marginBottom: 2 }}>{step.title}</div>
                  <div style={{ fontSize: 13, color: '#888' }}>{step.desc}</div>
                </div>
                <span style={{ color: '#6366f1', fontSize: 16 }}>→</span>
              </div>
            </Link>
          ))}
        </div>

        <button onClick={() => router.push(steps[0].href)} style={{
          width: '100%', padding: '13px', background: '#6366f1', border: 'none',
          borderRadius: 12, color: '#fff', fontSize: 15, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'Inter, sans-serif', marginBottom: 10
        }}>
          {isCompany ? 'Complete company profile →' : 'Complete my profile →'}
        </button>

        <button onClick={() => router.push(isCompany ? '/company/jobs' : '/jobs')} style={{
          width: '100%', padding: '12px', background: 'transparent',
          border: '1px solid #e8e8e8', borderRadius: 12, color: '#888',
          fontSize: 14, cursor: 'pointer', fontFamily: 'Inter, sans-serif'
        }}>Skip for now</button>
      </div>
    </div>
  )
}

export default function OnboardingPage() {
  return <Suspense><OnboardingContent /></Suspense>
}
