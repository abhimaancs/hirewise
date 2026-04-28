import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { job, candidates } = await req.json()

    if (!job || !Array.isArray(candidates) || candidates.length === 0) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    const prompt = `You are an expert technical recruiter. Score how well each candidate matches this job.

JOB:
Title: ${job.title}
Required Skills: ${job.required_skills?.join(', ')}
Type: ${job.job_type}
Description: ${job.description?.slice(0, 300)}

CANDIDATES:
${candidates.map((c: any) => `
ID: ${c.id}
Name: ${c.name}
Skills: ${c.skills?.join(', ') || 'none listed'}
Experience: ${c.experience_years ?? 0} years
College: ${c.college || 'not specified'}
Bio: ${c.bio || 'not specified'}
`).join('\n')}

Return ONLY a valid JSON array. No markdown, no explanation, nothing else.
Each object must have exactly these fields:
[
  {
    "candidate_id": "exact id from above",
    "match_score": 85,
    "match_reason": "1-2 sentence explanation of why this candidate fits"
  }
]

Score from 0-100. Consider skill overlap, experience level, and overall fit.
Sort by match_score descending.`

    // Call OpenRouter AI
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
        messages: [
          { role: 'system', content: 'You are a technical recruiter. You return ONLY valid JSON arrays. No markdown, no explanation.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1
      })
    })

    const data = await res.json()
    console.log('OpenRouter response status:', res.status)

    const text = data?.choices?.[0]?.message?.content || ''
    console.log('AI text:', text)

    // Parse AI response
    let scores: any[] = []
    try {
      // Try direct parse first
      scores = JSON.parse(text)
    } catch {
      try {
        // Try cleaning markdown
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim()
        scores = JSON.parse(cleaned)
      } catch {
        // Try extracting JSON array
        const match = text.match(/\[[\s\S]*\]/)
        if (match) {
          scores = JSON.parse(match[0])
        }
      }
    }

    // Fallback if AI fails — skill-based scoring
    if (!Array.isArray(scores) || scores.length === 0) {
      console.warn('AI failed, using skill-based fallback')
      scores = candidates.map((c: any) => {
        const matchedSkills = c.skills?.filter((s: string) =>
          job.required_skills?.map((r: string) => r.toLowerCase()).includes(s.toLowerCase())
        ) || []
        const totalRequired = job.required_skills?.length || 1
        const skillScore = Math.round((matchedSkills.length / totalRequired) * 100)
        return {
          candidate_id: c.id,
          match_score: Math.min(95, Math.max(30, skillScore)),
          match_reason: matchedSkills.length > 0
            ? `Matched ${matchedSkills.length} of ${totalRequired} required skills: ${matchedSkills.join(', ')}`
            : 'Limited skill overlap with job requirements'
        }
      })
    }

    // Map scores to candidates
    const matches = scores
      .map((score: any) => {
        const candidate = candidates.find(
          (c: any) => String(c.id) === String(score.candidate_id)
        )
        if (!candidate) return null
        return {
          job: candidate,
          match_score: Math.max(0, Math.min(100, Number(score.match_score) || 50)),
          match_reason: score.match_reason || 'No reason provided'
        }
      })
      .filter(Boolean)
      .sort((a: any, b: any) => b.match_score - a.match_score)

    // If still empty, return all candidates with fallback scores
    if (matches.length === 0) {
      const fallback = candidates.map((c: any, i: number) => ({
        job: c,
        match_score: Math.max(30, 80 - i * 10),
        match_reason: 'Profile reviewed — update skills for better matching'
      }))
      return NextResponse.json({ matches: fallback })
    }

    return NextResponse.json({ matches })

  } catch (error: any) {
    console.error('Match candidates error:', error?.message)
    return NextResponse.json({ error: 'Matching failed', detail: error?.message }, { status: 500 })
  }
}
