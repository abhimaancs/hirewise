import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { Job, CandidateProfile } from '@/types'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { job, candidates }: { job: Job; candidates: CandidateProfile[] } = await req.json()

    if (!job || !candidates?.length) {
      return NextResponse.json({ error: 'Missing job or candidates' }, { status: 400 })
    }

    const message = await anthropic.messages.create({
      model: 'claude-opus-4-5-20251101',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: `You are an expert technical recruiter. Score how well each candidate matches this job.

JOB:
Title: ${job.title}
Required Skills: ${job.required_skills.join(', ')}
Type: ${job.job_type}
Description: ${job.description.slice(0, 300)}

CANDIDATES:
${candidates.map((c, i) => `
Candidate ${i + 1} (id: ${c.id}):
Name: ${c.name}
Skills: ${c.skills?.join(', ') || 'none listed'}
Experience: ${c.experience_years ?? 0} years
College: ${c.college || 'not specified'}
Bio: ${c.bio || 'not specified'}
`).join('\n')}

Return ONLY a valid JSON array, no markdown, no explanation:
[
  {
    "candidate_id": "id here",
    "match_score": 88,
    "match_reason": "Strong React and TypeScript skills match the job requirements well. Fresher but solid project experience."
  }
]

Score 0-100. Sort by score descending. Be accurate and specific in the reason (1-2 sentences).`
        }
      ]
    })

    const content = message.content[0]
    if (content.type !== 'text') throw new Error('Unexpected response')

    const scores: { candidate_id: string; match_score: number; match_reason: string }[] = JSON.parse(content.text)

    // Map scores back to candidates, use job field to carry candidate data (reusing JobMatch type)
    const matches = scores
      .map(score => ({
        job: candidates.find(c => c.id === score.candidate_id) as any,
        match_score: score.match_score,
        match_reason: score.match_reason
      }))
      .filter(m => m.job)
      .sort((a, b) => b.match_score - a.match_score)

    return NextResponse.json({ matches })

  } catch (error) {
    console.error('Candidate matching error:', error)
    return NextResponse.json({ error: 'Matching failed' }, { status: 500 })
  }
}
