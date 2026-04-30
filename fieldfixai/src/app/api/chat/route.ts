import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { generateEmbedding } from '@/lib/utils/embeddings';

const SIMILARITY_THRESHOLD = 0.7;
const NUM_RESULTS = 5;

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Generate embedding for user message
    let messageEmbedding: number[];
    try {
      messageEmbedding = await generateEmbedding(message);
    } catch (error) {
      console.error('Error generating embedding:', error);
      return NextResponse.json(
        { error: 'Failed to process message' },
        { status: 500 }
      );
    }

    // Search for similar chunks using vector similarity
    const { data: similarChunks, error: searchError } = await supabase.rpc(
      'search_document_chunks',
      {
        embedding: messageEmbedding,
        similarity_threshold: SIMILARITY_THRESHOLD,
        limit: NUM_RESULTS,
      }
    );

    let context = '';
    if (!searchError && similarChunks && similarChunks.length > 0) {
      context = similarChunks
        .map((chunk: any) => chunk.chunk_text)
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
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      return NextResponse.json(
        { error: 'Failed to generate response' },
        { status: 500 }
      );
    }

    const openaiResponse = await response.json();
    const assistantMessage = openaiResponse.choices[0].message.content;

    // Save chat history
    const { error: historyError } = await supabase
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
    const { data: history, error } = await supabase
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
