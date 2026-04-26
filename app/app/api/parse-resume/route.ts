import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { resumeText } = await req.json()

    if (!resumeText) {
      return NextResponse.json({ error: 'No resume text provided' }, { status: 400 })
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
    return NextResponse.json({ data: parsed })

  } catch (error) {
    console.error('Resume parse error:', error)
    return NextResponse.json({ error: 'Failed to parse resume' }, { status: 500 })
  }
}
