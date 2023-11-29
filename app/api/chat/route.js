import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const runtime = 'edge'

export async function POST(req) {
  const { prompt } = await req.json()

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    stream: true,
    temperature: 0.6,
    max_tokens: 300,
    messages: [
      // {
      //   role: 'system',
      //   content: 'You are a scheduling assistant, aware of exact dates in the calendar year.',
      // },
      {
        role: 'user',
        content: prompt,
      },
    ],
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}