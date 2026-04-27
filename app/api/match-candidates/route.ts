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
Do NOT include any explanation.

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
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GOOGLE_AI_KEY}`,
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

      console.log("🔥 FULL RESPONSE:", JSON.stringify(data, null, 2))

      // 🔍 Extract text safely
      const text =
        data?.candidates?.[0]?.content?.parts
          ?.map((p: any) => p.text || '')
          .join('')
          .trim() || ''

      console.log("🧠 RAW TEXT:", text)

      // 🔥 FIXED PARSING (handles messy AI output)
      if (text) {
  try {
    // 1️⃣ Try direct parse
    scores = JSON.parse(text)
  } catch {
    try {
      // 2️⃣ Remove markdown + retry
      const cleaned = text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim()

      scores = JSON.parse(cleaned)
    } catch {
      // 3️⃣ Extract JSON array from messy text
      const match = text.match(/\[[\s\S]*\]/)
      if (match) {
        try {
          scores = JSON.parse(match[0])
        } catch (err) {
          console.error("FINAL PARSE FAIL:", err)
        }
      }
    }
  }
}

    } catch (err) {
      console.error("AI ERROR:", err)
    }

    // 🛡️ fallback if AI fails
    if (!Array.isArray(scores) || scores.length === 0) {
      console.warn("⚠️ Using fallback scoring")

      scores = candidates.map((c: any, i: number) => ({
        candidate_id: c.id,
        match_score: 60 - i * 5,
        match_reason: "Fallback scoring"
      }))
    }

    // ✅ map results safely
    const matches = scores.map((score: any, i: number) => {
      const matched = candidates.find(
        (c: any) => String(c.id) === String(score.candidate_id)
      )

      return {
        job: matched || candidates[i] || candidates[0],
        match_score: score.match_score ?? 50,
        match_reason: score.match_reason || "No reason"
      }
    })

    return NextResponse.json({ matches })

  } catch (error: any) {
    console.error("SERVER ERROR:", error)

    return NextResponse.json({
      matches: [],
      error: error.message
    })
  }
}