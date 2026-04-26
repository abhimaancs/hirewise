import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { Job, CandidateProfile, JobMatch } from '@/types'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { candidate, jobs }: { candidate: CandidateProfile; jobs: Job[] } = await req.json()

    if (!candidate || !jobs?.length) {
      return NextResponse.json({ error: 'Missing candidate or jobs' }, { status: 400 })
    }

    const message = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: `You are a smart job matching AI. Score how well this candidate matches each job.

CANDIDATE:
Name: ${candidate.name}
Skills: ${candidate.skills.join(', ')}
Experience: ${candidate.experience_years} years
Education: ${candidate.college || 'Not specified'}
Bio: ${candidate.bio || 'Not specified'}

JOBS:
${jobs.map((j, i) => `
Job ${i + 1} (id: ${j.id}):
Title: ${j.title}
Required Skills: ${j.required_skills.join(', ')}
Description: ${j.description.slice(0, 200)}
Type: ${j.job_type}
`).join('\n')}

Return ONLY valid JSON array, no markdown:
[
  {
    "job_id": "job id here",
    "match_score": 85,
    "match_reason": "Strong React and TypeScript skills align with requirements. 2 years experience is a good fit."
  }
]

Score from 0-100. Be accurate. Consider skill overlap, experience level, and role fit.`
        }
      ]
    })

    const content = message.content[0]
    if (content.type !== 'text') throw new Error('Unexpected response')

    const scores: { job_id: string; match_score: number; match_reason: string }[] = JSON.parse(content.text)

    const matches: JobMatch[] = scores
      .map(score => ({
        job: jobs.find(j => j.id === score.job_id)!,
        match_score: score.match_score,
        match_reason: score.match_reason
      }))
      .filter(m => m.job)
      .sort((a, b) => b.match_score - a.match_score)

    return NextResponse.json({ matches })

  } catch (error) {
    console.error('Matching error:', error)
    return NextResponse.json({ error: 'Matching failed' }, { status: 500 })
  }
}
