# FieldFix AI - Knowledge Base Chat

A mobile-first field service troubleshooting assistant for ATM and banking equipment technicians, enhanced with an intelligent AI chatbot and document management system.

## Core Goals

1. Ask troubleshooting questions by symptom, machine type, or error code
2. Capture real-world field fixes and make them searchable  
3. Build a living knowledge base from technician experience
4. **NEW**: Leverage AI to provide instant, context-aware answers from your knowledge base
5. **NEW**: Upload and manage technical documentation, repair guides, and PDFs

## 🚀 What's New

### AI Chatbot
- Powered by OpenAI GPT-3.5
- Semantic search through all uploaded documents
- Context-aware responses based on your knowledge base
- Full chat history tracking

### Document Management
- Upload PDFs, Word documents, text files, and markdown
- Automatic text extraction and processing
- Vector embeddings for intelligent search
- Organized document library
- Drag & drop upload support

## 🎯 Features

✅ **Smart Search** - Find answers using natural language  
✅ **Document Management** - Upload and organize files  
✅ **RAG Technology** - Get answers from your documents  
✅ **Chat History** - Track all conversations  
✅ **Responsive Design** - Works on mobile and desktop  
✅ **Production Ready** - Built with Next.js and TypeScript  

## 🏃 Quick Start

```bash
cd fieldfixai
npm install
# Add .env.local with Supabase and OpenAI keys
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

- [**SETUP_GUIDE.md**](./SETUP_GUIDE.md) - Complete setup instructions
- [**fieldfixai/README.md**](./fieldfixai/README.md) - Project details
- [**fieldfixai/supabase/README.md**](./fieldfixai/supabase/README.md) - Database schema

## 🔧 Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL + pgvector)
- **AI**: OpenAI GPT-3.5 + Embeddings
- **File Processing**: PDF Parse, Mammoth (Word)

## MVP Features

- Mobile technician dashboard
- Ask by error code
- Ask by symptom
- Submit a fix
- Equipment lookup
- Admin review queue
- Approved fixes knowledge base

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Supabase
- OpenAI
- Vercel
