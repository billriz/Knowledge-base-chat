# Quick Reference - Common Commands & Issues

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Environment Setup

### 1. Create `.env.local` file
```bash
# In the fieldfixai directory
cp .env.local.example .env.local
```

### 2. Edit `.env.local` with your values
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
OPENAI_API_KEY=sk-xxx...
NEXT_PUBLIC_OPENAI_EMBEDDING_MODEL=text-embedding-3-small
```

## Supabase Setup Checklist

- [ ] Enabled pgvector extension
- [ ] Created documents table
- [ ] Created document_chunks table  
- [ ] Created chat_history table
- [ ] Created search_document_chunks function
- [ ] Got Supabase URL and Anon Key

## OpenAI Setup Checklist

- [ ] Created OpenAI account
- [ ] Generated API key
- [ ] Verified billing is enabled
- [ ] Added key to `.env.local`

## Common Issues & Fixes

### "ModuleNotFoundError: No module named 'pdf2image'"
**Solution**: Delete `node_modules` and reinstall
```bash
rm -rf node_modules
npm install
```

### "Cannot find module 'openai'"
**Solution**: Install missing dependency
```bash
npm install openai
```

### "SUPABASE_URL is not defined"
**Solution**: Ensure `.env.local` exists and server is restarted
```bash
# Check file exists
ls -la .env.local

# Restart server (Ctrl+C then)
npm run dev
```

### "API key expired or invalid"
**Solution**: Generate new OpenAI API key
1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Update `.env.local`
4. Restart server

### "pgvector extension not found"
**Solution**: Enable in Supabase SQL Editor
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### Upload fails with "Unsupported file type"
**Supported types**: PDF, DOCX, DOC, TXT, MD, JSON
- Check file has correct extension
- Ensure file is under 50MB
- Try uploading from /documents page

### Chat returns empty responses
**Check**:
1. At least one document is uploaded
2. Document processed successfully
3. Supabase chat_history table exists
4. OpenAI API key is valid and has credits

### Vector similarity search returns no results
**Solutions**:
1. Upload more documents
2. Ask questions related to uploaded content
3. Check document_chunks table has data:
   ```sql
   SELECT COUNT(*) FROM document_chunks;
   ```

## File Locations Reference

| File | Purpose |
|------|---------|
| `fieldfixai/.env.local` | Environment variables (secrets) |
| `fieldfixai/src/app/page.tsx` | Home page |
| `fieldfixai/src/app/documents/page.tsx` | Document manager |
| `fieldfixai/src/app/api/` | API endpoints |
| `fieldfixai/src/hooks/` | React hooks (chat, upload, docs) |
| `fieldfixai/src/components/` | React components |
| `fieldfixai/supabase/migrations/` | Database SQL |

## Port Configuration

- **Development**: http://localhost:3000 (default)
- **Change port**: `npm run dev -- -p 3001`

## Database Queries (Supabase SQL)

### Check documents
```sql
SELECT * FROM documents;
```

### Check document chunks
```sql
SELECT COUNT(*) as chunk_count, document_id FROM document_chunks GROUP BY document_id;
```

### Check chat history
```sql
SELECT * FROM chat_history ORDER BY created_at DESC LIMIT 10;
```

### Test vector search
```sql
SELECT * FROM search_document_chunks(
  (SELECT embedding FROM document_chunks LIMIT 1)::vector,
  0.7,
  5
);
```

### Clear chat history
```sql
DELETE FROM chat_history;
```

### Delete all documents and chunks
```sql
DELETE FROM documents;  -- cascades to document_chunks
```

## Performance Tips

1. **Larger documents**?: Adjust chunk size in `documentProcessor.ts`
2. **Slow responses**?: Check OpenAI API rate limits
3. **Many documents**?: Add database indexes (already in migrations)
4. **Memory issues**?: Reduce `NUM_RESULTS` in chat API route

## Deployment Checklist

- [ ] `.env.local` NOT committed to git
- [ ] All environment variables configured
- [ ] Database migrations run
- [ ] pgvector extension enabled
- [ ] Build completes without errors: `npm run build`
- [ ] Test in production build: `npm start`
- [ ] Vercel/hosting configured
- [ ] CORS settings configured
- [ ] OpenAI rate limits checked

## Getting Help

1. Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions
2. Review [Supabase Docs](https://supabase.com/docs)
3. Check [OpenAI API Docs](https://platform.openai.com/docs/api-reference)
4. Review browser console for error messages
5. Check server logs in terminal

## Useful Links

- Supabase Dashboard: https://app.supabase.com
- OpenAI API Keys: https://platform.openai.com/api-keys
- Next.js Docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
