import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { candidate, job } = await req.json()

    const message = await anthropic.messages.create({
      model: 'claude-opus-4-5-20251101',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Write a professional, concise cover letter for this candidate applying to this job.

CANDIDATE:
Name: ${candidate.name}
Skills: ${candidate.skills?.join(', ')}
Experience: ${candidate.experience_years} years
College: ${candidate.college || 'not specified'}
Bio: ${candidate.bio || 'not specified'}

JOB:
Title: ${job.title}
Company: ${job.company_name || 'the company'}
Required Skills: ${job.required_skills?.join(', ')}
Description: ${job.description?.slice(0, 300)}

Write a 3-paragraph cover letter:
1. Opening — express enthusiasm for the specific role
2. Middle — highlight 2-3 relevant skills/experiences that match the job
3. Closing — call to action, professional sign-off

Tone: professional but human. Not generic. Max 200 words. Start directly with "Dear Hiring Manager,"`
        }
      ]
    })

    const content = message.content[0]
    if (content.type !== 'text') throw new Error('Unexpected response')

    return NextResponse.json({ coverLetter: content.text })

  } catch (error) {
    console.error('Cover letter error:', error)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}
