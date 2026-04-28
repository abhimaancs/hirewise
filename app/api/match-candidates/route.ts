import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { job, candidates } = await req.json()

    if (!job || !Array.isArray(candidates) || candidates.length === 0) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    const prompt = `
Return ONLY a JSON array.

IMPORTANT:
- match_score MUST be between 0 and 100 (integer)

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

    // 🔥 OpenRouter API
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openrouter/auto",
        messages: [
          { role: "system", content: "You return ONLY valid JSON array." },
          { role: "user", content: prompt }
        ],
        temperature: 0.2
      })
    })

    const data = await res.json()

    console.log("🔥 OPENROUTER RESPONSE:", JSON.stringify(data, null, 2))

    const text = data?.choices?.[0]?.message?.content || ""

    console.log("🧠 AI TEXT:", text)

    let scores: any = null

    // 🧹 Robust parsing
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
              console.error("❌ PARSE FAIL:", err)
            }
          }
        }
      }
    }

    // ⚠️ Fallback if AI fails
    if (!Array.isArray(scores)) {
      console.warn("⚠️ Using fallback scoring")

      scores = candidates.map((c: any) => {
        const skillMatch =
          c.skills?.filter((s: string) =>
            job.required_skills?.includes(s)
          ).length || 0

        return {
          candidate_id: String(c.id),
          match_score: Math.min(100, 50 + skillMatch * 10),
          match_reason: "Skill-based fallback"
        }
      })
    }

    // ✅ FINAL mapping with HYBRID scoring
    const matches = scores
      .map((score: any, i: number) => {
        const matched = candidates.find(
          (c: any) => String(c.id) === String(score.candidate_id)
        )

        const candidate = matched || candidates[i] || candidates[0]

        // 🧠 1. Skill score (70%)
        const skillMatchCount =
          candidate.skills?.filter((s: string) =>
            job.required_skills?.includes(s)
          ).length || 0

        const totalSkills = job.required_skills?.length || 1

        const skillScore = (skillMatchCount / totalSkills) * 70

        // 🧠 2. Experience score (30%)
        const exp = candidate.experience_years || 0
        const expScore = Math.min(30, exp * 5)

        // 🤖 3. AI score (scaled)
        let aiScore = Number(score.match_score) || 50
        if (aiScore <= 1) aiScore *= 100

        // 🎯 FINAL score
        let finalScore = Math.round(
          skillScore + expScore + aiScore * 0.3
        )

        finalScore = Math.max(0, Math.min(100, finalScore))

        return {
          job: candidate,
          match_score: finalScore,
          match_reason: score.match_reason || "No reason"
        }
      })
      .sort((a: any, b: any) => b.match_score - a.match_score)

    return NextResponse.json({ matches })

  } catch (error: any) {
    console.error("💥 ERROR:", error)

    return NextResponse.json({
      matches: [],
      error: error.message
    })
  }
}