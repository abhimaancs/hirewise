import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { job, candidates } = await req.json()

    if (!job || !Array.isArray(candidates) || candidates.length === 0) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    // 🧠 Prompt
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

    // 🤖 OpenAI API (NEW Responses API)
    const res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: prompt,
      }),
    })

    const data = await res.json()

    console.log("🔥 FULL OPENAI RESPONSE:", JSON.stringify(data, null, 2))

    // 📥 Extract AI text
    let text =
      data?.output?.[0]?.content?.[0]?.text ||
      data?.output_text || 
      ""

    console.log("🧠 AI TEXT:", text)

    let scores: any = null

    // 🧹 Robust JSON parsing
    if (text) {
      try {
        scores = JSON.parse(text)
      } catch {
        try {
          const cleaned = text
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim()

          scores = JSON.parse(cleaned)
        } catch {
          const match = text.match(/\[[\s\S]*\]/)
          if (match) {
            try {
              scores = JSON.parse(match[0])
            } catch (err) {
              console.error("❌ FINAL PARSE FAIL:", err)
            }
          }
        }
      }
    }

    // 🛑 Fallback if AI fails
    if (!Array.isArray(scores)) {
      console.warn("⚠️ Using fallback scoring")

      scores = candidates.map((c: any) => {
        const skillMatch =
          c.skills?.filter((s: string) =>
            job.required_skills?.includes(s)
          ).length || 0

        return {
          candidate_id: c.id,
          match_score: Math.min(100, 50 + skillMatch * 10),
          match_reason: "Skill-based fallback"
        }
      })
    }

    // 🔗 Map results to candidates
    const matches = scores
      .map((score: any, i: number) => {
        const matched = candidates.find(
          (c: any) => String(c.id) === String(score.candidate_id)
        )

        return {
          job: matched || candidates[i] || candidates[0],
          match_score: score.match_score || 50,
          match_reason: score.match_reason || "No reason"
        }
      })
      .sort((a: any, b: any) => b.match_score - a.match_score)

    return NextResponse.json({ matches })

  } catch (error: any) {
    console.error("💥 SERVER ERROR:", error)

    return NextResponse.json({
      matches: [],
      error: error.message || "Something went wrong"
    })
  }
}