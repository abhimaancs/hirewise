import { NextRequest, NextResponse } from 'next/server'
import { getDocumentProxy, extractText } from 'unpdf'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    let resumeText: string

    if (isPdf) {
      // Extract text from PDF bytes server-side using unpdf
      const buffer = await file.arrayBuffer()
      const pdf = await getDocumentProxy(new Uint8Array(buffer))
      const { text } = await extractText(pdf, { mergePages: true })
      resumeText = text
    } else {
      // Plain text — read directly
      resumeText = await file.text()
    }

    if (!resumeText?.trim()) {
      return NextResponse.json({ error: 'Could not extract text from file' }, { status: 400 })
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

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://hirewise-henna.vercel.app',
        'X-Title': 'HireWise'
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct',
        messages: [
          { role: 'system', content: 'You return ONLY valid JSON objects. No markdown, no explanation.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1
      })
    })

    const data = await res.json()
    console.log('parse-resume OpenRouter status:', res.status)

    const text = data?.choices?.[0]?.message?.content || ''
    console.log('parse-resume AI text:', text)

    // Parse response — with markdown-stripping fallback
    let parsed: any
    try {
      parsed = JSON.parse(text)
    } catch {
      try {
        parsed = JSON.parse(text.replace(/```json|```/g, '').trim())
      } catch {
        const match = text.match(/\{[\s\S]*\}/)
        if (match) parsed = JSON.parse(match[0])
      }
    }

    if (!parsed) {
      throw new Error('Could not parse AI response as JSON')
    }

    // Return parsed fields plus the raw extracted text so the client can
    // persist it to candidate_profiles.resume_text
    return NextResponse.json({ data: parsed, resumeText })

  } catch (error: any) {
    console.error('Resume parse error:', error?.message)
    return NextResponse.json({ error: 'Failed to parse resume' }, { status: 500 })
  }
}
