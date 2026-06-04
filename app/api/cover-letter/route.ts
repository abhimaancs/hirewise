import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { candidate, job } = await req.json()

    const prompt = `Write a professional, concise cover letter for this candidate applying to this job.

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

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://hirewise-henna.vercel.app',
        'X-Title': 'HireWise'
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4
      })
    })

    if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${await res.text()}`)

    const data = await res.json()
    const text = data?.choices?.[0]?.message?.content
    if (!text) throw new Error('Empty response from OpenRouter')

    return NextResponse.json({ coverLetter: text })

  } catch (error: any) {
    console.error('Cover letter error:', error?.message)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}
