import { NextResponse } from "next/server";
import OpenAI from "openai";

// System prompt for the AI, providing guidelines on how to respond to users
const systemPrompt = `You are a Rate My Professor assistant, dedicated to helping students find the best professors and classes. For each user question, identify the top professor that best matches the query and use that information to provide a relevant answer. Maintain context for follow-up questions to ensure they relate to the previously discussed professor. If the question is unrelated to professors or classes, politely respond with, 'Sorry, I’m here to assist you with professor-related inquiries.' Please ensure your responses are concise and focused on the professor or class information.`;

// POST function to handle incoming requests
export async function POST(req) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); // Create a new instance of the OpenAI client
  const data = await req.json(); // Parse the JSON body of the incoming request

  // Create a chat completion request to the OpenAI API
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: systemPrompt }, ...data], // Include the system prompt and user messages
    model: "gpt-4", // Specify the model to use
    stream: true, // Enable streaming responses
  });

  // Create a ReadableStream to handle the streaming response
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder(); // Create a TextEncoder to convert strings to Uint8Array
      try {
        // Iterate over the streamed chunks of the response
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content; // Extract the content from the chunk
          if (content) {
            const text = encoder.encode(content); // Encode the content to Uint8Array
            controller.enqueue(text); // Enqueue the encoded text to the stream
          }
        }
      } catch (err) {
        controller.error(err); // Handle any errors that occur during streaming
      } finally {
        controller.close(); // Close the stream when done
      }
    },
  });

  return new NextResponse(stream); // Return the stream as the response
}
