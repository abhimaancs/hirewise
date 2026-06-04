import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { getDocumentProxy, extractText } from 'unpdf'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

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
      // Plain text — read directly, same as before
      resumeText = await file.text()
    }

    if (!resumeText?.trim()) {
      return NextResponse.json({ error: 'Could not extract text from file' }, { status: 400 })
    }

    const message = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Extract structured information from this resume. Return ONLY valid JSON, no markdown.

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
        }
      ]
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type')
    }

    const parsed = JSON.parse(content.text)
    // Return parsed fields plus the raw extracted text so the client can
    // persist it to candidate_profiles.resume_text
    return NextResponse.json({ data: parsed, resumeText })

  } catch (error: any) {
    console.error('Resume parse error:', error?.message)
    return NextResponse.json({ error: 'Failed to parse resume' }, { status: 500 })
  }
}
