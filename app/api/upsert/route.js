import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import { loadEnvConfig } from "@next/env";
import path from "path";
import { Pinecone } from '@pinecone-database/pinecone';

const envPath = path.resolve(process.cwd());
loadEnvConfig(envPath);

export async function POST(req) {
  try {
    // Initialize Pinecone Client
    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

    // Use Pinecone client to check or create the index
    const indexName = "rag";
    const listIndexes = await pc.listIndexes();
    
    // Ensure listIndexes is an array (as Pinecone's response may vary)
    const listIndexNames = Array.isArray(listIndexes) ? listIndexes : listIndexes.indexes.map(index => index.name);
    

    if (!listIndexNames.includes(indexName)) {
      await pc.createIndex({
        name: indexName,
        dimension: 1536,
        metric: "cosine",
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-east-1'
          }
        }
      });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const data = await req.json(); // Parse JSON body
    
    const combinedReviewText = data.reviews.map(review => review.reviewText).join(" ");

    // Generate embedding using combined review text and professor's information
    const response = await client.embeddings.create({
      input: combinedReviewText + data.professorInfo.name + data.professorInfo.rating + data.professorInfo.department,
      model: "text-embedding-ada-002",
    });

    const embedding = response.data[0].embedding;
  
    // Create a single entry with professor metadata and review embedding
    const processedData = {
      id: data.professorInfo.name,
      values: embedding,
      metadata: {
        name: data.professorInfo.name,
        rating: data.professorInfo.rating,
        department: data.professorInfo.department,
        university: data.professorInfo.university,
        reviews: data.reviews.map(review => review.reviewText), // Store reviews as metadata
      }
    };

    // Ensure vectors is an array
    const vectors = [processedData];
   
    const pineconeIndex = pc.index(indexName);

    // Perform the upsert operation
    const upsertResponse = await pineconeIndex.namespace('ns1').upsert(
      vectors // Add your namespace here if you are using one
    );
      
    return NextResponse.json({
      vectors:vectors
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
