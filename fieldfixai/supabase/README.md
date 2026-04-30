# Supabase Setup Instructions

## Prerequisites
- Supabase account and project
- pgvector extension enabled

## Steps to Set Up

1. **Enable pgvector extension**
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Run:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

2. **Create tables**
   - Copy the SQL from `001_create_knowledge_base_tables.sql`
   - Paste it into the SQL Editor in your Supabase dashboard
   - Execute the query

3. **Create search function**
   - Copy the SQL from `002_create_search_function.sql`
   - Paste it into the SQL Editor in your Supabase dashboard
   - Execute the query

3. **Set up storage bucket (optional, for file persistence)**
   - Go to Storage in your Supabase dashboard
   - Create a new bucket named `documents`
   - Update the storage rules as needed

## Environment Variables

Add these to your `.env.local` file:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_OPENAI_EMBEDDING_MODEL=text-embedding-3-small
```

## Table Schema

### documents
- `id`: UUID - Primary key
- `file_name`: TEXT - Name of the uploaded file
- `file_type`: TEXT - MIME type (application/pdf, text/plain, etc.)
- `file_size`: INTEGER - File size in bytes
- `storage_path`: TEXT - Path in Supabase storage
- `created_at`: TIMESTAMP - When document was uploaded
- `updated_at`: TIMESTAMP - Last update time

### document_chunks
- `id`: UUID - Primary key
- `document_id`: UUID - Foreign key to documents
- `chunk_text`: TEXT - Text content of the chunk
- `chunk_index`: INTEGER - Sequential index of chunk
- `embedding`: vector(1536) - OpenAI embedding vector
- `metadata`: JSONB - Additional metadata
- `created_at`: TIMESTAMP - Creation time

### chat_history
- `id`: UUID - Primary key
- `message`: TEXT - Chat message content
- `role`: TEXT - 'user' or 'assistant'
- `document_ids`: UUID[] - Referenced documents
- `created_at`: TIMESTAMP - Message time
