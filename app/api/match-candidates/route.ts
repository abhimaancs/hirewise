import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { job, candidates } = await req.json()

    if (!job || !candidates?.length) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    const prompt = `
Return ONLY a JSON array.

IMPORTANT:
- Use EXACT candidate_id values from input
- Do NOT modify IDs

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
            temperature: 0.1
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

    // 🔍 Extract text safely
    let text = ''

    if (candidate?.content?.parts) {
      text = candidate.content.parts
        .map((p: any) => p.text || '')
        .join('')
        .trim()
    }

    console.log("AI TEXT:", text)

    // ❌ If empty → fallback
    if (!text) {
      return NextResponse.json({
        matches: candidates.map((c: any) => ({
          job: c,
          match_score: 50,
          match_reason: "Fallback (AI empty)"
        }))
      })
    }

    // 🧹 Clean markdown
    const cleaned = text.replace(/```json|```/g, '').trim()

    let scores: any = null

    // 🔍 Parse JSON safely
    try {
      scores = JSON.parse(cleaned)
    } catch {
      const match = cleaned.match(/\[[\s\S]*\]/)
      if (match) {
        try {
          scores = JSON.parse(match[0])
        } catch {}
      }
    }

    console.log("AI SCORES:", scores)

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

    // ✅ Map results (FIXED ID MATCH)
    const matches = scores
      .map((score: any) => {
        const matchedCandidate = candidates.find(
          (c: any) => String(c.id) === String(score.candidate_id)
        )

        return {
          job: matchedCandidate || candidates[0], // fallback to avoid empty
          match_score: score.match_score ?? 50,
          match_reason: score.match_reason || "No reason provided"
        }
      })
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