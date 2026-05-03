import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { generateEmbedding } from '@/lib/utils/embeddings';

const SIMILARITY_THRESHOLD = 0.7;
const NUM_RESULTS = 5;

type SimilarChunk = {
  chunk_text: string;
};

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error('Missing OPENAI_API_KEY environment variable');
      return NextResponse.json(
        { error: 'Server configuration error: Missing OpenAI API key' },
        { status: 500 }
      );
    }

    if (!apiKey.startsWith('sk-')) {
      console.error('Invalid OPENAI_API_KEY format');
      return NextResponse.json(
        { error: 'Server configuration error: OpenAI API key must start with "sk-"' },
        { status: 500 }
      );
    }

    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    let similarChunks: SimilarChunk[] = [];

    // Generate an embedding for document search. If this fails for a transient
    // reason, continue the chat without knowledge-base context.
    try {
      const messageEmbedding = await generateEmbedding(message);
      const { data, error: searchError } = await supabaseServer.rpc(
        'search_document_chunks',
        {
          query_embedding: messageEmbedding,
          similarity_threshold: SIMILARITY_THRESHOLD,
          result_limit: NUM_RESULTS,
        }
      );

      if (searchError) {
        console.error('Error searching document chunks:', searchError);
      } else {
        similarChunks = data ?? [];
      }
    } catch (error) {
      console.error('Error preparing document context:', error);
    }

    let context = '';
    if (similarChunks.length > 0) {
      context = similarChunks
        .map((chunk: SimilarChunk) => chunk.chunk_text)
        .join('\n\n---\n\n');
    }

    // Prepare system prompt with context
    const systemPrompt = context
      ? `You are a helpful AI assistant for a knowledge base. Use the following documents to answer questions:\n\n${context}`
      : 'You are a helpful AI assistant for a knowledge base.';

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_CHAT_MODEL ?? 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      console.error('OpenAI API error:', error);
      const message =
        error?.error?.message ?? response.statusText ?? 'Unknown OpenAI API error';
      return NextResponse.json(
        { error: `Failed to generate response: ${message}` },
        { status: 500 }
      );
    }

    const openaiResponse = await response.json();
    const assistantMessage = openaiResponse.choices[0].message.content;

    // Save chat history
    const { error: historyError } = await supabaseServer
      .from('chat_history')
      .insert([
        { message, role: 'user' },
        { message: assistantMessage, role: 'assistant' },
      ]);

    if (historyError) {
      console.error('Error saving chat history:', historyError);
    }

    return NextResponse.json({
      message: assistantMessage,
      contextsUsed: similarChunks?.length || 0,
    });
  } catch (error) {
    console.error('Error in chat:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data: history, error } = await supabaseServer
      .from('chat_history')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(50);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch chat history' },
        { status: 500 }
      );
    }

    return NextResponse.json(history);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
