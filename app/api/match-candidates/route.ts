import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const job = body.job
    const candidates = body.candidates

    if (!job || !Array.isArray(candidates) || candidates.length === 0) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    const prompt = `
Return ONLY a JSON array.

Format:
[
  {
    "candidate_id": "string",
    "match_score": number,
    "match_reason": "short reason"
  }
]

Job Skills: ${job.required_skills?.join(', ')}

Candidates:
${candidates.map((c: any) => `
ID: ${c.id}
Skills: ${c.skills?.join(', ') || 'none'}
Experience: ${c.experience_years ?? 0}
`).join('\n')}
`

    let scores: any = null

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_AI_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.1 }
          })
        }
      )

      const data = await res.json()

      console.log("FULL RESPONSE:", JSON.stringify(data, null, 2))

      const text =
        data &&
        data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts
          ? data.candidates[0].content.parts
              .map((p: any) => p.text || '')
              .join('')
              .trim()
          : ''

      if (text) {
        try {
          scores = JSON.parse(text)
        } catch {
          const match = text.match(/\[[\s\S]*\]/)
          if (match) {
            scores = JSON.parse(match[0])
          }
        }
      }

    } catch (err) {
      console.error("AI ERROR:", err)
    }

    // fallback
    if (!Array.isArray(scores)) {
      scores = candidates.map((c: any, i: number) => ({
        candidate_id: c.id,
        match_score: 60 - i * 5,
        match_reason: "Fallback scoring"
      }))
    }

    const matches = scores.map((score: any, i: number) => {
      const matched = candidates.find(
        (c: any) => String(c.id) === String(score.candidate_id)
      )

      return {
        job: matched || candidates[i] || candidates[0],
        match_score: score.match_score || 50,
        match_reason: score.match_reason || "No reason"
      }
    })

    return NextResponse.json({ matches })

  } catch (error: any) {
    console.error("SERVER ERROR:", error)
    return NextResponse.json({ matches: [], error: error.message })
  }
}