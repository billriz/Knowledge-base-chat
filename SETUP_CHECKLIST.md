# Setup Checklist - Get Your AI Chatbot Running

Follow this checklist to get your knowledge base up and running!

## Phase 1: Preparation (5 minutes)

- [X] You have a Supabase account (or create at [supabase.com](https://supabase.com))
- [X] You have an OpenAI API key (or get one at [platform.openai.com](https://platform.openai.com/api-keys))
- [X] OpenAI account has billing enabled

## Phase 2: Supabase Setup (10 minutes)

### Create Project
- [X] Create a new Supabase project
- [X] Wait for project to be ready
- [X] Note your project URL and anon key (Settings → API)

### Enable pgvector
- [X] Go to SQL Editor in Supabase
- [X] Run: `CREATE EXTENSION IF NOT EXISTS vector;`
- [X] Click Execute
- [X] See "Success" message

### Create Database Tables
- [X] In SQL Editor, open file: `fieldfixai/supabase/migrations/001_create_knowledge_base_tables.sql`
- [X] Copy all the SQL
- [X] Paste into Supabase SQL Editor
- [X] Click Execute
- [X] See "Success" message

### Create Search Function
- [X] In SQL Editor, open file: `fieldfixai/supabase/migrations/002_create_search_function.sql`
- [X] Copy all the SQL
- [X] Paste into Supabase SQL Editor
- [X] Click Execute
- [X] See "Success" message

## Phase 3: Configuration (5 minutes)

### Create Environment File
```bash
cd fieldfixai
cp .env.local.example .env.local
```
- [x] File `.env.local` created in `fieldfixai` folder

### Add Supabase Keys
- [x] Open `fieldfixai/.env.local` in editor 002.3
- [x] Go to Supabase Dashboard → Settings → API
- [x] Copy "Project URL" → paste as `NEXT_PUBLIC_SUPABASE_URL`
- [x] Copy "anon public" key → paste as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Add OpenAI Key
- [X] Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- [X] Click "Create new secret key"
- [X] Copy the key
- [X] Open `.env.local`
- [X] Paste as `OPENAI_API_KEY=sk-...`
- [X] Save file

### Verify Configuration
```bash
# Check file exists and has values
cat .env.local
```
- [X] See all four variables populated:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `OPENAI_API_KEY`
  - `NEXT_PUBLIC_OPENAI_EMBEDDING_MODEL`

## Phase 4: Local Development (5 minutes)

### Install & Run
```bash
cd fieldfixai
npm install    # Verify dependencies
npm run build  # Test build
npm run dev    # Start server
```
- [X]`npm install` completes without errors
- [X] `npm run build` shows "✓ Compiled successfully"
- [X] `npm run dev` shows "ready - started server on 0.0.0.0:3000"

### Open in Browser
- [ ] Open http://localhost:3000
- [ ] See FieldFix AI home page with two cards
- [ ] Cards say "Chat with Your Knowledge Base" and "Manage Documents"

## Phase 5: Test Document Upload (5 minutes)

### Upload a Test Document
- [ ] Click "Manage Documents" button
- [ ] Create a test file (e.g., `test.txt` with some content)
- [ ] Click upload area or drag file
- [ ] Click "Upload" button
- [ ] See success message with chunk count
- [ ] Document appears in the list below

### Test Multiple Formats (Optional)
- [ ] Try uploading a PDF
- [ ] Try uploading a Word document (.docx)
- [ ] Try uploading markdown file (.md)
- [ ] All should show in document list

## Phase 6: Test Chatbot (5 minutes)

### Start a Conversation
- [ ] Go back to home page or click "Start Chatting"
- [ ] Type a question related to your uploaded document
- [ ] Example: "What was the main topic of the document?"
- [ ] Press Enter or click Send button
- [ ] Wait for AI response (first request may take 5-10 seconds)

### Verify RAG is Working
- [ ] Response should reference content from your document
- [ ] Should see "Used X source(s)" indicator
- [ ] Response should be relevant to document content

### Test Multiple Questions
- [ ] Ask different questions about the document
- [ ] Ask follow-up questions
- [ ] Ask questions NOT in document (should say "I don't know")

## Phase 7: Troubleshooting

### If build fails:
- [ ] Delete `node_modules` folder
- [ ] Run `npm install`
- [ ] Run `npm run build` again
- [ ] Check error messages in terminal

### If server won't start:
- [ ] Check `.env.local` file exists with all values
- [ ] Verify no syntax errors in `.env.local`
- [ ] Kill previous process: `Ctrl+C` then `npm run dev`

### If upload fails:
- [ ] Check file is supported format (PDF, DOCX, TXT, MD, JSON)
- [ ] Check file is under 50MB
- [ ] Check OpenAI API key is valid

### If chat returns empty response:
- [ ] Ensure document was uploaded successfully
- [ ] Check that embedding was created (check Supabase)
- [ ] Verify OpenAI API key has credits
- [ ] Try asking more specific questions

### If database errors appear:
- [ ] Verify pgvector extension is enabled
- [ ] Verify all SQL migrations were run
- [ ] Check Supabase connection string is correct
- [ ] See QUICK_REFERENCE.md for SQL debugging

## Phase 8: Next Steps (Optional)

- [ ] Upload your real documents
- [ ] Test with actual use cases
- [ ] Deploy to Vercel (see SETUP_GUIDE.md)
- [ ] Share with team members
- [ ] Monitor OpenAI API costs

## Documentation Reference

- **SETUP_GUIDE.md** - Detailed setup instructions
- **QUICK_REFERENCE.md** - Troubleshooting & commands
- **IMPLEMENTATION_SUMMARY.md** - What was built
- **supabase/README.md** - Database schema

## Support

If stuck:
1. Check QUICK_REFERENCE.md for your issue
2. Review the SETUP_GUIDE.md relevant section
3. Check browser console for errors (F12)
4. Check terminal output for error messages
5. See IMPLEMENTATION_SUMMARY.md for architecture details

---

✅ **Checklist Complete?** You're ready to chat with your AI knowledge base!

If any step failed, check the Troubleshooting section or refer to the documentation files.

**Questions? See the docs!** 📚
