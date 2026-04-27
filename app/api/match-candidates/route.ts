import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { job, candidates } = await req.json()

    if (!job || !candidates?.length) {
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

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_AI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            response_mime_type: "application/json"
          }
        })
      }
    )

    if (!res.ok) {
      const err = await res.text()
      console.error("Gemini Error:", res.status, err)
      throw new Error("Gemini API failed")
    }

    const data = await res.json()

    console.log("🔥 FULL GEMINI RESPONSE:", JSON.stringify(data, null, 2))

    const candidate = data?.candidates?.[0]

    let text = ''

    // ✅ Try extracting text safely
    if (candidate?.content?.parts) {
      text = candidate.content.parts
        .map((p: any) => p.text || '')
        .join('')
        .trim()
    }

    // ❌ If empty → fallback
    if (!text) {
      console.warn("Empty AI response")

      return NextResponse.json({
        matches: candidates.map((c: any) => ({
          job: c,
          match_score: 50,
          match_reason: "Fallback (AI empty)"
        }))
      })
    }

    let scores: any = null

    try {
      scores = JSON.parse(text)
    } catch {
      console.error("JSON parse failed:", text)
    }

    // ❌ If invalid → fallback
    if (!Array.isArray(scores)) {
      return NextResponse.json({
        matches: candidates.map((c: any) => ({
          job: c,
          match_score: 50,
          match_reason: "Fallback (AI format issue)"
        }))
      })
    }

    // ✅ Map results
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
    console.error("SERVER ERROR:", error)

    return NextResponse.json(
      { matches: [], error: error.message },
      { status: 500 }
    )
  }
}