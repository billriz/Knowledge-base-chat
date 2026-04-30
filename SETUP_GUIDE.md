# FieldFix AI - Setup & Configuration Guide

## Overview

Your knowledge base application now includes:
- ✅ AI-powered chatbot using OpenAI's GPT-3.5
- ✅ Document upload and management (PDF, DOCX, TXT, MD, JSON)
- ✅ Semantic search with vector embeddings
- ✅ Retrieval Augmented Generation (RAG) for context-aware responses
- ✅ Chat history tracking
- ✅ Beautiful, responsive UI

## Prerequisites

1. **Supabase Account** - [Create free account](https://supabase.com)
2. **OpenAI API Key** - [Get API key](https://platform.openai.com/api-keys)
3. **Node.js 18+** - [Download](https://nodejs.org)

## Step-by-Step Setup

### 1. Configure Supabase

#### 1.1 Set up pgvector extension
1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **SQL Editor**
4. Run this command to enable vector support:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

#### 1.2 Create database tables
1. In **SQL Editor**, paste the entire contents of `supabase/migrations/001_create_knowledge_base_tables.sql`
2. Click **Execute**
3. Then paste contents of `supabase/migrations/002_create_search_function.sql`
4. Click **Execute**

### 2. Set Environment Variables

Create a `.env.local` file in the `fieldfixai` directory:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# OpenAI
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_OPENAI_EMBEDDING_MODEL=text-embedding-3-small
```

**Where to find these values:**
- **SUPABASE_URL & ANON_KEY**: Supabase Dashboard → Settings → API
- **OPENAI_API_KEY**: OpenAI Dashboard → API Keys

### 3. Install Dependencies

```bash
cd fieldfixai
npm install
```

### 4. Run the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Features Guide

### 🗣️ Chat Interface
- Ask questions about your uploaded documents
- Get AI-powered answers with cited sources
- Full conversation history
- Real-time streaming responses

### 📄 Document Management
- Upload PDF, DOCX, TXT, MD, or JSON files
- Drag & drop upload support
- Automatic text extraction and chunking
- Vector embedding generation
- Delete documents from knowledge base
- View upload date and file size

### 🔍 Smart Search
- Semantic similarity search using embeddings
- Retrieves relevant document chunks
- Context-aware responses
- Shows number of sources used

## API Endpoints

### POST `/api/documents`
Upload a new document
```json
{
  "file": "File object"
}
```

### GET `/api/documents`
Get all uploaded documents

### DELETE `/api/documents/[id]`
Delete a document by ID

### POST `/api/chat`
Send a chat message
```json
{
  "message": "Your question here"
}
```

Response:
```json
{
  "message": "AI response...",
  "contextsUsed": 3
}
```

### GET `/api/chat`
Get chat history (last 50 messages)

## Database Schema

### documents
Stores metadata for uploaded files
- `id`: UUID primary key
- `file_name`: Document filename
- `file_type`: MIME type
- `file_size`: Size in bytes
- `storage_path`: File location
- `created_at`: Upload timestamp

### document_chunks
Stores text chunks with embeddings
- `id`: UUID primary key
- `document_id`: Reference to document
- `chunk_text`: Text content
- `chunk_index`: Position in document
- `embedding`: vector(1536) - OpenAI embedding
- `metadata`: Additional info

### chat_history
Stores all chat messages
- `id`: UUID primary key
- `message`: Message content
- `role`: 'user' or 'assistant'
- `document_ids`: Referenced documents
- `created_at`: Message timestamp

## File Size Limits & Formats

| Format | Max Size | Support |
|--------|----------|---------|
| PDF | 50 MB | ✅ Full |
| DOCX/DOC | 50 MB | ✅ Full |
| TXT | 50 MB | ✅ Full |
| Markdown | 50 MB | ✅ Full |
| JSON | 50 MB | ✅ Full |

## Troubleshooting

### "API key not found" error
- Ensure `.env.local` file exists with correct keys
- Restart the dev server after updating env vars
- Check keys don't have extra spaces

### "Failed to process file" error
- Verify file format is supported
- Check file isn't corrupted
- Ensure file size < 50MB

### "pgvector extension not found"
- Run `CREATE EXTENSION IF NOT EXISTS vector;` in Supabase SQL Editor
- Ensure you have admin access to Supabase project

### Chat responses are slow
- First request may take longer due to embedding generation
- Subsequent requests should be faster
- Check OpenAI API rate limits

### No results from document search
- Ensure documents are fully uploaded
- Verify embeddings were generated (check Supabase)
- Try asking different questions
- Add more documents for better coverage

## Performance Tips

1. **Chunk Size**: Currently set to 1000 characters with 200 overlap
   - Adjust in `src/lib/utils/documentProcessor.ts` if needed
   
2. **Embedding Model**: Using `text-embedding-3-small`
   - Change to `text-embedding-3-large` for better accuracy (more expensive)

3. **Search Results**: Currently returns top 5 results
   - Adjust `NUM_RESULTS` in `src/app/api/chat/route.ts`

4. **Caching**: Consider adding Redis for chat history caching
   - Modify `useChat` hook in `src/hooks/useChat.ts`

## Deployment Options

### Vercel (Recommended)
```bash
npm run build
# Push to GitHub and connect to Vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build
CMD ["npm", "start"]
```

### Self-hosted
```bash
npm run build
npm start
```

## Security Considerations

1. **API Keys**: Keep OPENAI_API_KEY server-side only
2. **Rate Limiting**: Add rate limiting to API routes in production
3. **Authentication**: Consider adding user auth with Supabase Auth
4. **Data**: Enable database encryption in Supabase
5. **CORS**: Configure CORS properly for production domain

## Next Steps

1. ✅ Set up Supabase and OpenAI
2. ✅ Configure environment variables
3. ✅ Run development server
4. ✅ Upload your first document
5. ✅ Test the chatbot
6. ✅ (Optional) Deploy to production

## Support & Resources

- [Supabase Docs](https://supabase.com/docs)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Vector Search Guide](https://supabase.com/docs/guides/database/extensions/pgvector)

## License

MIT

---

**Questions?** Check the troubleshooting section or review the code comments for detailed implementation details.
