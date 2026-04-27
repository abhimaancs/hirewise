import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { resumeText } = await req.json()
    if (!resumeText) {
      return NextResponse.json({ error: 'No resume text provided' }, { status: 400 })
    }

    const prompt = `Extract structured information from this resume. Return ONLY valid JSON, no markdown.

Resume:
${resumeText}

Return this exact JSON structure:
{
  "name": "full name",
  "skills": ["skill1", "skill2"],
  "experience_years": 0,
  "education": "degree and college",
  "bio": "2-sentence professional summary",
  "location": "city, country"
}`

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
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const cleaned = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(cleaned)

    return NextResponse.json({ data: parsed })

  } catch (error: any) {
    console.error('Resume parse error:', error)
    return NextResponse.json({ error: 'Failed to parse resume', detail: error?.message }, { status: 500 })
  }
}
