// import OpenAI from 'openai';
// import { OpenAIStream, StreamingTextResponse } from 'ai';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export const runtime = 'edge';

// export async function POST(req) {
//   const { messages } = await req.json();
//   const response = await openai.chat.completions.create({
//     model: 'gpt-4',
//     stream: true,
//     messages,
//   });
//   const stream = OpenAIStream(response);
//   return new StreamingTextResponse(stream);
// }



// import { OpenAIStream, StreamingTextResponse } from 'ai';
// import { Configuration, OpenAIApi } from 'openai-edge';

// const config = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const openai = new OpenAIApi(config);

// export const runtime = 'edge';

// export async function POST(req) {
//   try {
//     const { prompt } = await req.json();
//     console.log('Received prompt:', prompt);

//     const response = await openai.createChatCompletion({
//       model: 'gpt-3.5-turbo',
//       stream: true,
//       messages: [
//         {
//           role: 'system',
//           content: 'You are a helpful assistant.',
//         },
//         {
//           role: 'user',
//           content: prompt,
//         },
//       ],
//     });

//     const stream = OpenAIStream(response);

//     return new StreamingTextResponse(stream);
//   } catch (error) {
//     console.error('Error processing request:', error);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: 'Internal Server Error' }),
//     };
//   }
// }


import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req) {
  const { prompt } = await req.json();

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    stream: true,
    temperature: 0.6,
    max_tokens: 300,
    messages: [
      // {
      //   role: 'system',
      //   content: 'You are a helpful assistant.',
      // },
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}