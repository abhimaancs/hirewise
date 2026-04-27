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

Write a 3-paragraph cover letter. Tone: professional but human. Max 200 words. Start with "Dear Hiring Manager,"`

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
    const coverLetter = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    return NextResponse.json({ coverLetter })

  } catch (error: any) {
    console.error('Cover letter error:', error)
    return NextResponse.json({ error: 'Generation failed', detail: error?.message }, { status: 500 })
  }
}
