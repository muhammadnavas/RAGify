# RAGify

A full-stack **Retrieval-Augmented Generation (RAG)** application that enables intelligent document querying and answer generation. Upload PDFs, build semantic search indexes, and get AI-powered answers grounded in your documents.

## Overview

RAGify is a modern RAG prototype that combines document management, semantic search, and generative AI. It allows users to:

1. **Upload PDF documents** through an intuitive web interface
2. **Index documents** using embeddings for semantic similarity search
3. **Query documents** with natural language questions
4. **Generate answers** using Google Gemini, grounded in retrieved document content

The application consists of a **FastAPI backend** for document processing and retrieval, and a **Next.js frontend** for user interaction.

---

## Features

- 📄 **PDF Upload & Processing**: Extract and chunk text from PDF documents automatically
- 🔍 **Semantic Search**: Find relevant document excerpts using FAISS vector similarity
- 🤖 **AI-Powered Answers**: Generate contextual answers using Google Gemini API
- 💾 **Persistent Indexing**: FAISS indexes are saved and loaded from disk
- 🌐 **Modern Web UI**: Next.js frontend with responsive design using Tailwind CSS
- 📊 **Index Statistics**: Monitor indexed documents and embeddings metadata
- ⚡ **REST API**: Complete API for programmatic access to all features
- 🔐 **CORS Support**: Cross-origin requests enabled for frontend-backend communication

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                      │
│          React UI for uploads, search, and results          │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  Backend (FastAPI)                          │
├─────────────────────────────────────────────────────────────┤
│  • PDF Ingestion & Text Extraction (pdfplumber)            │
│  • Text Chunking (LangChain RecursiveCharacterTextSplitter) │
│  • Embeddings Generation (HuggingFace all-MiniLM-L6-v2)    │
│  • Vector Storage (FAISS)                                   │
│  • Semantic Search & Retrieval                             │
│  • Answer Generation (Google Gemini API)                    │
└─────────────────────────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ↓                ↓                ↓
    uploaded_pdfs    faiss_index      Gemini API
    (PDFs)           (Indexes)        (Generation)
```

### Data Flow

1. **Document Upload**: User uploads PDF → Backend stores file & extracts text
2. **Indexing**: Text is chunked → Each chunk is embedded → Embeddings stored in FAISS
3. **Search**: User query is embedded → Similar chunks retrieved from FAISS
4. **Generation**: Retrieved chunks + query → Gemini API generates answer

---

## Prerequisites

- **Python 3.9+** (recommended 3.10 or 3.11)
- **Node.js 18+** with npm or yarn
- **Google Gemini API Key** (from Google AI Studio or Cloud Console)
- **Git** (optional, for cloning the repository)

### System Requirements

- **Disk Space**: At least 1GB for dependencies and indexes
- **RAM**: Minimum 2GB (4GB+ recommended for larger document sets)
- **Internet**: Required for API calls and initial dependency downloads

---

## Installation

### Backend Setup

1. **Create a Python virtual environment**:
   ```bash
   cd backend
   python -m venv venv
   ```

2. **Activate the virtual environment**:
   
   - **Windows (CMD)**:
     ```bash
     venv\Scripts\activate
     ```
   
   - **Windows (PowerShell)**:
     ```bash
     venv\Scripts\Activate.ps1
     ```
   
   - **macOS/Linux**:
     ```bash
     source venv/bin/activate
     ```

3. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

   This installs:
   - `fastapi` - Web framework
   - `uvicorn` - ASGI server
   - `pdfplumber` - PDF text extraction
   - `langchain` - LLM framework
   - `faiss-cpu` - Vector database
   - `sentence-transformers` - Embeddings
   - `requests` - HTTP client
   - And additional supporting libraries

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install Node dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

   This installs Next.js, React, TailwindCSS, and ESLint.

---

## Configuration

### Backend Configuration

Environment variables can be set in a `.env` file in the `backend/` directory:

```env
# Google Gemini API Configuration
GEMINI_API_KEY=your-api-key-here
GEMINI_MODEL=models/flash-2.5
LLM_PROVIDER=gemini

# FastAPI Settings (optional)
UPLOAD_DIR=uploaded_pdfs
FAISS_INDEX_DIR=faiss_index
```

#### Getting a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Click "Get API key" → "Create API key in new project"
3. Copy your API key
4. Add it to `.env`: `GEMINI_API_KEY=your-key-here`

#### Chunking Configuration

Edit `backend/main.py` to adjust:
```python
CHUNK_SIZE = 500        # Characters per chunk
CHUNK_OVERLAP = 100     # Overlap between chunks
```

Smaller chunks: More precise retrieval but more API calls
Larger chunks: Broader context but may contain irrelevant info

#### Embedding Model

Default: `all-MiniLM-L6-v2` (384 dimensions, fast, efficient)

To change in `backend/main.py`:
```python
EMBEDDING_MODEL = "all-mpnet-base-v2"  # Better quality, slower
```

### Frontend Configuration

Backend URL is configured in Next.js app. Default: `http://localhost:8000`

To change the API endpoint, update frontend API calls in:
- `frontend/app/page.js` - Main chat interface
- `frontend/app/visualize/page.js` - Visualization page (if exists)

---

## Running the Application

### Start the Backend

With the virtual environment activated:

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Expected output:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

**Endpoints available at**: `http://localhost:8000`
**Interactive API docs**: `http://localhost:8000/docs`

### Start the Frontend

In a new terminal:

```bash
cd frontend
npm run dev
# or
yarn dev
```

Expected output:
```
  ▲ Next.js 16.1.6
  - Local:        http://localhost:3000
```

**UI available at**: `http://localhost:3000`

### Access the Application

1. Open `http://localhost:3000` in your browser
2. Upload a PDF document
3. Ask questions about the document
4. Get AI-powered answers

---

## API Documentation

### Base URL
`http://localhost:8000`

### Endpoints

#### 1. **GET `/`**
Health check endpoint.

**Response:**
```json
{
  "message": "Welcome to the FastAPI backend!"
}
```

---

#### 2. **POST `/upload-pdf/`**
Upload and process a PDF file (returns chunks for preview).

**Request:**
- Form data with file upload

**Response:**
```json
{
  "filename": "document.pdf",
  "content": "Full extracted text...",
  "chunks": [
    {
      "id": 0,
      "text": "Chunk content...",
      "length": 450
    }
  ],
  "total_chunks": 12,
  "chunk_settings": {
    "chunk_size": 500,
    "overlap": 100
  }
}
```

---

#### 3. **POST `/store-embeddings/`**
Upload PDF and store embeddings in FAISS index.

**Request:**
- Form data with file upload

**Response:**
```json
{
  "message": "Embeddings stored successfully",
  "filename": "document.pdf",
  "chunks_stored": 12,
  "embedding_model": "all-MiniLM-L6-v2"
}
```

---

#### 4. **POST `/search/`**
Semantic search across indexed documents.

**Request:**
```json
{
  "query": "What is RAG?",
  "top_k": 5
}
```

**Response:**
```json
{
  "query": "What is RAG?",
  "results": [
    {
      "text": "Retrieval-Augmented Generation...",
      "source": "document.pdf",
      "similarity_score": 0.87
    }
  ],
  "total_results": 1
}
```

---

#### 5. **POST `/answer/`**
Retrieve relevant chunks and generate an answer using Gemini.

**Request:**
```json
{
  "query": "What is RAG?",
  "top_k": 5
}
```

**Response:**
```json
{
  "answer": "RAG (Retrieval-Augmented Generation) is...",
  "matches": [
    {
      "text": "Relevant excerpt...",
      "source": "document.pdf",
      "score": 0.87
    }
  ]
}
```

---

#### 6. **GET `/index-stats/`**
Get statistics about the FAISS index.

**Response (when indexed):**
```json
{
  "indexed": true,
  "total_documents": 45,
  "embedding_model": "all-MiniLM-L6-v2",
  "embedding_dimensions": 384
}
```

**Response (when empty):**
```json
{
  "indexed": false,
  "message": "No documents indexed yet"
}
```

---

## Project Structure

```
RAGify/
├── README.md                           # This file
├── backend/
│   ├── main.py                        # FastAPI application & route handlers
│   ├── requirements.txt                # Python dependencies
│   ├── uploaded_pdfs/                 # Directory for uploaded PDF files
│   ├── faiss_index/                   # Directory for FAISS indexes
│   │   ├── index.faiss               # Vector index (created on first upload)
│   │   └── index.pkl                 # Metadata (created on first upload)
│   └── __pycache__/                   # Python cache
├── frontend/
│   ├── app/
│   │   ├── layout.js                 # Root layout
│   │   ├── page.js                   # Main chat interface
│   │   ├── globals.css               # Global styles
│   │   ├── architecture/
│   │   │   └── page.js               # Architecture documentation page
│   │   └── visualize/                # Visualization (if implemented)
│   ├── public/                        # Static assets
│   ├── package.json                   # Node.js dependencies
│   ├── next.config.mjs                # Next.js configuration
│   ├── jsconfig.json                  # JavaScript/TypeScript config
│   ├── postcss.config.mjs             # PostCSS configuration
│   ├── eslint.config.mjs              # ESLint rules
│   └── tailwind.config.js             # Tailwind CSS config
└── pages/                              # Additional pages (if used)
```

---

## Technologies & Dependencies

### Backend Stack

| Technology | Purpose | Version |
|-----------|---------|---------|
| **FastAPI** | Web framework & API | Latest |
| **Uvicorn** | ASGI server | Latest |
| **Pdfplumber** | PDF text extraction | Latest |
| **LangChain** | LLM framework & utilities | Latest |
| **FAISS** | Vector similarity search | CPU version |
| **HuggingFace Transformers** | Embeddings generation | 384-dim |
| **Google Generative AI** | Answer generation | Latest |

### Frontend Stack

| Technology | Purpose | Version |
|-----------|---------|---------|
| **Next.js** | React framework | 16.1.6 |
| **React** | UI library | 19.2.3 |
| **Tailwind CSS** | Styling | 4.0 |
| **ESLint** | Code linting | 9.0 |

---

## Development Guide

### Local Development

1. **Start backend with auto-reload**:
   ```bash
   cd backend
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   uvicorn main:app --reload
   ```

2. **Start frontend with hot-reload**:
   ```bash
   cd frontend
   npm run dev
   ```

### Testing the API with cURL

```bash
# Test health check
curl http://localhost:8000

# Upload PDF for preview
curl -X POST -F "file=@document.pdf" http://localhost:8000/upload-pdf/

# Store embeddings
curl -X POST -F "file=@document.pdf" http://localhost:8000/store-embeddings/

# Search
curl -X POST http://localhost:8000/search/ \
  -H "Content-Type: application/json" \
  -d '{"query": "What is RAG?", "top_k": 5}'

# Get answer
curl -X POST http://localhost:8000/answer/ \
  -H "Content-Type: application/json" \
  -d '{"query": "What is RAG?", "top_k": 5}'

# Get index stats
curl http://localhost:8000/index-stats/
```

---

## Future Enhancements

- Multiple embedding models support
- Batch document processing
- Query result visualization
- Document metadata management
- Authentication & user sessions
- Support for other LLM providers (OpenAI, Claude, Llama)
- PDF visualization and highlighting
- Document versioning
- Advanced search filters
- Export results functionality
