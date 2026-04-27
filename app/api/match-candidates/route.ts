import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { job, candidates } = await req.json()

    if (!job || !candidates?.length) {
      return NextResponse.json({ error: 'Missing job or candidates' }, { status: 400 })
    }

    const prompt = `You are an expert technical recruiter. Score how well each candidate matches this job.


JOB:
Title: ${job.title}
Required Skills: ${job.required_skills?.join(', ')}
Type: ${job.job_type}
Description: ${job.description?.slice(0, 300)}

CANDIDATES:
${candidates.map((c: any, i: number) => `
Candidate ${i + 1} (id: ${c.id}):
Name: ${c.name}
Skills: ${c.skills?.join(', ') || 'none listed'}
Experience: ${c.experience_years ?? 0} years
`).join('\n')}

Return ONLY a valid JSON array, no markdown:
[
  {
    "candidate_id": "id here",
    "match_score": 88,
    "match_reason": "Strong React and Node.js skills match well."
  }
]`

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
const jsonMatch = cleaned.match(/\[[\s\S]*\]/)
if (!jsonMatch) throw new Error('No JSON array found in response: ' + cleaned)
const scores = JSON.parse(jsonMatch[0])

    const matches = scores
      .map((score: any) => ({
        job: candidates.find((c: any) => c.id === score.candidate_id),
        match_score: score.match_score,
        match_reason: score.match_reason
      }))
      .filter((m: any) => m.job)
      .sort((a: any, b: any) => b.match_score - a.match_score)

    return NextResponse.json({ matches })

  } catch (error: any) {
    console.error('Candidate matching error:', error)
    return NextResponse.json({ error: 'Matching failed', detail: error?.message }, { status: 500 })
  }
}
