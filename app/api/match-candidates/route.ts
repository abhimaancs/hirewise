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

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You output only valid JSON." },
          { role: "user", content: prompt }
        ],
        temperature: 0.2
      })
    })

    const data = await res.json()

    const text = data?.choices?.[0]?.message?.content || ""

    let scores: any = null

    try {
      scores = JSON.parse(text)
    } catch {
      const match = text.match(/\[[\s\S]*\]/)
      if (match) scores = JSON.parse(match[0])
    }

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
    console.error(error)
    return NextResponse.json({ matches: [], error: error.message })
  }
}