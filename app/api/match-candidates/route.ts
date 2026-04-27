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

    const prompt = `You are an expert recruiter.

Score candidates for this job.

JOB:
${job.title}
Skills: ${job.required_skills?.join(', ')}

CANDIDATES:
${candidates.map((c: any) => `
ID: ${c.id}
Skills: ${c.skills?.join(', ') || 'none'}
Experience: ${c.experience_years ?? 0}
`).join('\n')}

Return ONLY JSON array like:
[
 { "candidate_id": "1", "match_score": 80, "match_reason": "Good fit" }
]`

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

    // 🔍 Extract text safely
    const parts = data?.candidates?.[0]?.content?.parts || []
    const text = parts.map((p: any) => p.text || '').join('').trim()

    console.log("AI TEXT:", text)

    // ❌ If AI gives nothing → fallback immediately
    if (!text) {
      return NextResponse.json({
        matches: candidates.map((c: any) => ({
          job: c,
          match_score: 50,
          match_reason: "Fallback (AI empty)"
        }))
      })
    }

    // 🧹 Clean response
    const cleaned = text.replace(/```json|```/g, '').trim()

    let scores: any = null

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

    // ❌ If still invalid → fallback
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
    const matches = scores.map((score: any) => ({
      job: candidates.find((c: any) => c.id === score.candidate_id),
      match_score: score.match_score,
      match_reason: score.match_reason
    }))

    return NextResponse.json({ matches })

  } catch (error: any) {
    console.error("FINAL ERROR:", error)

    // ✅ Absolute fallback (never crash)
    return NextResponse.json({
      matches: [],
      error: "Something went wrong, but app is safe"
    })
  }
}