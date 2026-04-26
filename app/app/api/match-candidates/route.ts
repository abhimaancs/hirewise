import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { job, candidates } = await req.json()

    if (!job || !candidates?.length) {
      return NextResponse.json({ error: 'Missing job or candidates' }, { status: 400 })
    }

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: `You are an expert technical recruiter. Score how well each candidate matches this job.

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
College: ${c.college || 'not specified'}
`).join('\n')}

Return ONLY a valid JSON array, no markdown:
[
  {
    "candidate_id": "id here",
    "match_score": 88,
    "match_reason": "Strong React and Node.js skills match well."
  }
]`
        }
      ]
    })

    const content = message.content[0]
    if (content.type !== 'text') throw new Error('Unexpected response type')

    // Clean response in case of markdown
    const cleaned = content.text.replace(/```json|```/g, '').trim()
    const scores = JSON.parse(cleaned)

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
    return NextResponse.json({ 
      error: 'Matching failed', 
      detail: error?.message || String(error)
    }, { status: 500 })
  }
}
