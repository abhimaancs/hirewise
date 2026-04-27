import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { job, candidates } = await req.json()

    if (!job || !candidates?.length) {
      return NextResponse.json(
        { error: 'Missing job or candidates' },
        { status: 400 }
      )
    }

    const prompt = `You are an expert technical recruiter.

Score how well each candidate matches the job.

JOB:
Title: ${job.title}
Required Skills: ${job.required_skills?.join(', ')}
Type: ${job.job_type}
Description: ${job.description?.slice(0, 300)}

CANDIDATES:
${candidates
  .map(
    (c: any, i: number) => `
Candidate ${i + 1} (id: ${c.id}):
Name: ${c.name}
Skills: ${c.skills?.join(', ') || 'none listed'}
Experience: ${c.experience_years ?? 0} years
`
  )
  .join('\n')}

Return ONLY a pure JSON array.

STRICT RULES:
- Do NOT include markdown
- Do NOT include explanations
- Do NOT include text before or after
- Response MUST start with [ and end with ]

Format:
[
  {
    "candidate_id": "id here",
    "match_score": 88,
    "match_reason": "Short explanation"
  }
]`

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_AI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            response_mime_type: "application/json"
          }
        })
      }
    )

    const data = await res.json()

    // 🔍 Extract text safely from Gemini response
    const parts = data?.candidates?.[0]?.content?.parts || []
    const text = parts.map((p: any) => p.text || '').join('').trim()

    if (!text) {
      console.error("EMPTY GEMINI RESPONSE:", data)
      throw new Error("Empty response from AI")
    }

    // 🧹 Clean markdown if present
    const cleaned = text.replace(/```json|```/g, '').trim()

    let scores

    try {
      // ✅ Try parsing directly
      scores = JSON.parse(cleaned)
    } catch {
      // 🔁 Fallback: extract JSON array manually
      const jsonMatch = cleaned.match(/\[[\s\S]*\]/)

      if (!jsonMatch) {
        console.error("RAW GEMINI RESPONSE:", cleaned)
        throw new Error('No JSON array found in response')
      }

      scores = JSON.parse(jsonMatch[0])
    }

    if (!Array.isArray(scores)) {
      console.error("INVALID FORMAT:", scores)
      throw new Error("Response is not an array")
    }

    // 🔗 Map scores to candidates
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

    return NextResponse.json(
      {
        error: 'Matching failed',
        detail: error?.message || 'Unknown error'
      },
      { status: 500 }
    )
  }
}