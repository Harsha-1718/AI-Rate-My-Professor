// /pages/api/queryPinecone.js

import { Pinecone } from '@pinecone-database/pinecone';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in your environment variables
});

export async function POST(req) {
  try {
    const { query } = await req.json();

    // Step 1: Convert the query into a vector using OpenAI's text-embedding model
    const queryVector = await encodeQueryToVector(query);
   

    // Step 2: Initialize the Pinecone client
   

    const index = pc.Index('rag'); // Replace 'professors' with your actual Pinecone index name

    // Step 3: Query Pinecone for similar vectors
    const queryResponse = await index.namespace("ns1").query({
      vector: queryVector, // The vector generated from the user's query
      topK: 1, // Adjust this number based on how many top results you want
      includeMetadata: true, // Include metadata like the professor's name, university, etc.
    });

    const results = queryResponse.matches.map((match) => ({
      score: match.score,
      professor: match.metadata, // The metadata you stored when upserting data into Pinecone
    }));
   
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error querying Pinecone:', error);
    return NextResponse.json({ message: 'Error querying Pinecone', error }, { status: 500 });
  }
}

// Function to convert the user's query into an embedding vector using OpenAI
async function encodeQueryToVector(query) {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002', // OpenAI's text embedding model
      input: query,
    });

    const vector = response.data[0].embedding;
    return vector;
  } catch (error) {
    console.error('Error generating embedding from OpenAI:', error);
    throw new Error('Failed to generate embedding');
  }
}
