import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { generateEmbedding } from '@/lib/utils/embeddings';

const SIMILARITY_THRESHOLD = 0.5;
const FALLBACK_SIMILARITY_THRESHOLD = 0.25;
const NUM_RESULTS = 5;
const KEYWORD_RESULT_LIMIT = 25;
const MAX_CONTEXT_CHARS = 8000;

type SimilarChunk = {
  id: string;
  document_id: string;
  chunk_text: string;
  chunk_index: number;
  similarity?: number;
  keywordScore?: number;
};

type DocumentSource = {
  id: string;
  file_name: string;
};

type MatchedExcerpt = {
  source: string;
  text: string;
};

function extractSearchTerms(message: string): string[] {
  const normalized = message.toLowerCase();
  const terms = new Set<string>();

  for (const match of normalized.matchAll(/error\s*(?:code)?\s*[:#-]?\s*([a-z0-9-]+)/g)) {
    const code = match[1];
    terms.add(code);
    terms.add(`error code: ${code}`);
    terms.add(`error code ${code}`);
    terms.add(`code: ${code}`);
  }

  for (const term of normalized.match(/[a-z0-9-]{2,}/g) ?? []) {
    if (!['what', 'does', 'mean', 'from', 'file', 'document', 'according', 'uploaded'].includes(term)) {
      terms.add(term);
    }
  }

  return [...terms]
    .map((term) => term.replace(/[^a-z0-9: -]/g, '').trim())
    .filter(Boolean)
    .slice(0, 10);
}

function getKeywordScore(chunkText: string, terms: string[]): number {
  const text = chunkText.toLowerCase();
  return terms.reduce((score, term) => {
    const codeMatch = term.match(/^(?:error code:?|code:)\s*([a-z0-9-]+)$/);
    if (codeMatch) {
      const escapedCode = codeMatch[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const codePattern = new RegExp(`(?:error\\s+code|code):?\\s*${escapedCode}\\b`, 'i');
      return codePattern.test(chunkText) ? score + 8 : score;
    }

    if (/^[0-9]+$/.test(term)) {
      const numberPattern = new RegExp(`\\b${term}\\b`);
      return numberPattern.test(text) ? score + 1 : score;
    }

    if (text.includes(term)) {
      return score + (term.includes(' ') || term.includes(':') ? 4 : 1);
    }

    return score;
  }, 0);
}

function mergeChunks(chunks: SimilarChunk[]): SimilarChunk[] {
  const byId = new Map<string, SimilarChunk>();

  for (const chunk of chunks) {
    const existing = byId.get(chunk.id);
    if (!existing) {
      byId.set(chunk.id, chunk);
      continue;
    }

    byId.set(chunk.id, {
      ...existing,
      ...chunk,
      similarity: Math.max(existing.similarity ?? 0, chunk.similarity ?? 0),
      keywordScore: Math.max(existing.keywordScore ?? 0, chunk.keywordScore ?? 0),
    });
  }

  return [...byId.values()].sort((a, b) => {
    const keywordDifference = (b.keywordScore ?? 0) - (a.keywordScore ?? 0);
    if (keywordDifference !== 0) return keywordDifference;

    return (b.similarity ?? 0) - (a.similarity ?? 0);
  });
}

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
    let sources: DocumentSource[] = [];
    let excerpts: MatchedExcerpt[] = [];

    // Generate an embedding for document search. If this fails for a transient
    // reason, continue the chat without knowledge-base context.
    try {
      const messageEmbedding = await generateEmbedding(message);
      const searchChunks = (similarityThreshold: number) =>
        supabaseServer.rpc('search_document_chunks', {
          query_embedding: messageEmbedding,
          similarity_threshold: similarityThreshold,
          result_limit: NUM_RESULTS,
        });

      let { data, error: searchError } = await searchChunks(SIMILARITY_THRESHOLD);

      if (!searchError && (!data || data.length === 0)) {
        ({ data, error: searchError } = await searchChunks(FALLBACK_SIMILARITY_THRESHOLD));
      }

      if (searchError) {
        console.error('Error searching document chunks:', searchError);
      } else {
        const semanticChunks = data ?? [];
        const terms = extractSearchTerms(message);
        let keywordChunks: SimilarChunk[] = [];

        if (terms.length > 0) {
          const keywordQuery = terms
            .map((term) => `chunk_text.ilike.%${term}%`)
            .join(',');
          const { data: keywordData, error: keywordError } = await supabaseServer
            .from('document_chunks')
            .select('id, document_id, chunk_text, chunk_index')
            .or(keywordQuery)
            .limit(KEYWORD_RESULT_LIMIT);

          if (keywordError) {
            console.error('Error keyword searching document chunks:', keywordError);
          } else {
            keywordChunks = (keywordData ?? [])
              .map((chunk) => ({
                ...chunk,
                keywordScore: getKeywordScore(chunk.chunk_text, terms),
              }))
              .filter((chunk) => chunk.keywordScore > 0);
          }
        }

        similarChunks = mergeChunks([...keywordChunks, ...semanticChunks]).slice(0, NUM_RESULTS);

        const documentIds = [...new Set(similarChunks.map((chunk) => chunk.document_id))];
        if (documentIds.length > 0) {
          const { data: documents, error: documentsError } = await supabaseServer
            .from('documents')
            .select('id, file_name')
            .in('id', documentIds);

          if (documentsError) {
            console.error('Error loading source documents:', documentsError);
          } else {
            sources = documents ?? [];
          }
        }
      }
    } catch (error) {
      console.error('Error preparing document context:', error);
    }

    const sourceNameById = new Map(
      sources.map((source) => [source.id, source.file_name])
    );

    let context = '';
    if (similarChunks.length > 0) {
      const contextSections: string[] = [];
      let contextLength = 0;

      for (const chunk of similarChunks) {
          const sourceName = sourceNameById.get(chunk.document_id) ?? 'Uploaded document';
          const section = `Source: ${sourceName}\n${chunk.chunk_text}`;
          if (contextLength + section.length > MAX_CONTEXT_CHARS) break;

          contextSections.push(section);
          contextLength += section.length;
          excerpts.push({
            source: sourceName,
            text: chunk.chunk_text.slice(0, 500),
          });
      }

      context = contextSections.join('\n\n---\n\n');
    }

    // Prepare system prompt with context
    const systemPrompt = context
      ? `You are a helpful AI assistant for a knowledge base. Answer using the uploaded document excerpts below. When the excerpts contain the answer, do not say you lack access to documents. Mention the source file name when useful.\n\n${context}`
      : 'You are a helpful AI assistant for a knowledge base. No uploaded document excerpts matched this question, so say that before giving general guidance.';

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
      sources,
      excerpts,
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
