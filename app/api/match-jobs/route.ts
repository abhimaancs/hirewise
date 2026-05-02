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
Skills: ${candidate.skills?.join(', ') || 'none'}
Experience: ${candidate.experience_years ?? 0} years
College: ${candidate.college || 'not specified'}
Bio: ${candidate.bio || 'not specified'}

JOBS:
${jobs.map((j: any) => `ID: ${j.id}, Title: ${j.title}, Required Skills: ${j.required_skills?.join(', ')}, Type: ${j.job_type}`).join('\n')}

Return ONLY a valid JSON array, no markdown:
[{"job_id":"id here","match_score":85,"match_reason":"reason here"}]

Score 0-100. Sort by score descending.`

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
          { role: 'system', content: 'You return ONLY valid JSON arrays. No markdown, no explanation.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1
      })
    })

    const data = await res.json()
    const text = data?.choices?.[0]?.message?.content || ''
    console.log('match-jobs AI text:', text)

    // Parse response
    let scores: any[] = []
    try { scores = JSON.parse(text) } catch {
      try { scores = JSON.parse(text.replace(/```json|```/g, '').trim()) } catch {
        const match = text.match(/\[[\s\S]*\]/)
        if (match) scores = JSON.parse(match[0])
      }
    }

    // Fallback — skill based scoring
    if (!Array.isArray(scores) || scores.length === 0) {
      console.warn('Using fallback scoring for jobs')
      scores = jobs.map((j: any) => {
        const matched = candidate.skills?.filter((s: string) =>
          j.required_skills?.map((r: string) => r.toLowerCase()).includes(s.toLowerCase())
        ) || []
        const score = Math.min(95, Math.max(30, Math.round((matched.length / (j.required_skills?.length || 1)) * 100)))
        return {
          job_id: j.id,
          match_score: score,
          match_reason: matched.length > 0
            ? `Matched ${matched.length} skills: ${matched.join(', ')}`
            : 'Limited skill overlap with job requirements'
        }
      })
    }

    const matches = scores
      .map((score: any) => ({
        job: jobs.find((j: any) => j.id === score.job_id),
        match_score: Math.max(0, Math.min(100, Number(score.match_score) || 50)),
        match_reason: score.match_reason || 'Profile reviewed'
      }))
      .filter((m: any) => m.job)
      .sort((a: any, b: any) => b.match_score - a.match_score)

    // Final fallback — never return empty
    if (matches.length === 0) {
      return NextResponse.json({
        matches: jobs.map((j: any, i: number) => ({
          job: j,
          match_score: Math.max(30, 80 - i * 10),
          match_reason: 'Add more skills to your profile for better matching'
        }))
      })
    }

    return NextResponse.json({ matches })

  } catch (error: any) {
    console.error('match-jobs error:', error?.message)
    return NextResponse.json({ error: 'Matching failed', detail: error?.message }, { status: 500 })
  }
}
