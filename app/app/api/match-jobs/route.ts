import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { candidate, jobs } = await req.json()

    if (!candidate || !jobs?.length) {
      return NextResponse.json({ error: 'Missing candidate or jobs' }, { status: 400 })
    }

    const prompt = `You are a smart job matching AI. Score how well this candidate matches each job.

CANDIDATE:
Name: ${candidate.name}
Skills: ${candidate.skills?.join(', ')}
Experience: ${candidate.experience_years} years
College: ${candidate.college || 'not specified'}
Bio: ${candidate.bio || 'not specified'}

JOBS:
${jobs.map((j: any, i: number) => `
Job ${i + 1} (id: ${j.id}):
Title: ${j.title}
Required Skills: ${j.required_skills?.join(', ')}
Description: ${j.description?.slice(0, 200)}
Type: ${j.job_type}
`).join('\n')}

Return ONLY a valid JSON array, no markdown:
[
  {
    "job_id": "job id here",
    "match_score": 85,
    "match_reason": "Strong React and TypeScript skills align with requirements."
  }
]

Score 0-100. Sort by score descending.`

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_AI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    )

    const data = await res.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const cleaned = text.replace(/```json|```/g, '').trim()
    const scores = JSON.parse(cleaned)

    const matches = scores
      .map((score: any) => ({
        job: jobs.find((j: any) => j.id === score.job_id),
        match_score: score.match_score,
        match_reason: score.match_reason
      }))
      .filter((m: any) => m.job)
      .sort((a: any, b: any) => b.match_score - a.match_score)

    return NextResponse.json({ matches })

  } catch (error: any) {
    console.error('Matching error:', error)
    return NextResponse.json({ error: 'Matching failed', detail: error?.message }, { status: 500 })
  }
}
