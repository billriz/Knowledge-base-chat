import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { generateEmbedding } from '@/lib/utils/embeddings';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES = [
  'application/pdf',
  'text/plain',
  'text/markdown',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/json',
];

// Dynamic import to avoid build-time dependency on pdf-parse
async function getDocumentProcessor() {
  const { extractTextFromFile, chunkText } = await import('@/lib/utils/documentProcessor');
  return { extractTextFromFile, chunkText };
}

export async function POST(request: NextRequest) {
  try {
    // Check for required environment variables
    if (!process.env.OPENAI_API_KEY) {
      console.error('Missing OPENAI_API_KEY environment variable');
      return NextResponse.json(
        { error: 'Server configuration error: Missing API key' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 50MB limit' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Unsupported file type: ${file.type}. Supported types: PDF, TXT, DOCX, JSON, MD`,
        },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text from file
    let text: string;
    try {
      const { extractTextFromFile } = await getDocumentProcessor();
      text = await extractTextFromFile(buffer, file.type);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error extracting text:', errorMessage);
      return NextResponse.json(
        { error: `Failed to process file: ${errorMessage}` },
        { status: 400 }
      );
    }

    if (!text.trim()) {
      return NextResponse.json(
        { error: 'No text content found in file' },
        { status: 400 }
      );
    }

    // Insert document record
    const { data: docData, error: docError } = await supabaseServer
      .from('documents')
      .insert({
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        storage_path: `documents/${Date.now()}_${file.name}`,
      })
      .select()
      .single();

    if (docError) {
      console.error('Database error:', docError);
      return NextResponse.json(
        { error: `Failed to save document: ${docError.message}` },
        { status: 500 }
      );
    }

    // Chunk text
    const { chunkText } = await getDocumentProcessor();
    const chunks = chunkText(text);

    // Generate embeddings and insert chunks
    const chunkRecords = [];
    for (let i = 0; i < chunks.length; i++) {
      try {
        const embedding = await generateEmbedding(chunks[i]);
        chunkRecords.push({
          document_id: docData.id,
          chunk_text: chunks[i],
          chunk_index: i,
          embedding: embedding,
          metadata: {
            tokens: Math.ceil(chunks[i].length / 4), // Rough estimate
          },
        });
      } catch (error) {
        console.error(`Error generating embedding for chunk ${i}:`, error);
        // Continue with next chunk
      }
    }

    if (chunkRecords.length > 0) {
      const { error: chunksError } = await supabaseServer
        .from('document_chunks')
        .insert(chunkRecords);

      if (chunksError) {
        console.error('Error inserting chunks:', chunksError);
      }
    }

    return NextResponse.json({
      id: docData.id,
      fileName: docData.file_name,
      chunks: chunkRecords.length,
      message: 'Document uploaded and processed successfully',
    });
  } catch (error) {
    console.error('Error in upload:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data: documents, error } = await supabaseServer
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch documents' },
        { status: 500 }
      );
    }

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
