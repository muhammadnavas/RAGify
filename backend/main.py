from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from fastapi.responses import JSONResponse
import shutil
import pdfplumber
from typing import List, Optional
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from pydantic import BaseModel
import openai
import numpy as np

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploaded_pdfs"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Chunking configuration
CHUNK_SIZE = 500  # characters per chunk
CHUNK_OVERLAP = 100  # overlap between chunks

# Initialize LangChain text splitter
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=CHUNK_SIZE,
    chunk_overlap=CHUNK_OVERLAP,
    length_function=len,
    separators=["\n\n", "\n", ". ", "! ", "? ", ", ", " ", ""]
)

# Initialize HuggingFace embeddings
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)

# FAISS index directory
FAISS_INDEX_DIR = "faiss_index"
os.makedirs(FAISS_INDEX_DIR, exist_ok=True)

# Global vectorstore (loaded on startup if exists)
vectorstore: Optional[FAISS] = None

def load_vectorstore():
    """Load existing FAISS index if available"""
    global vectorstore
    index_path = os.path.join(FAISS_INDEX_DIR, "index.faiss")
    if os.path.exists(index_path):
        vectorstore = FAISS.load_local(
            FAISS_INDEX_DIR, 
            embeddings,
            allow_dangerous_deserialization=True
        )
        return True
    return False

# Try loading existing index on startup
load_vectorstore()

# Initialize OpenAI if key provided
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if OPENAI_API_KEY:
    openai.api_key = OPENAI_API_KEY

# Request models
class SearchRequest(BaseModel):
    query: str
    top_k: int = 5

def chunk_text(text: str) -> List[dict]:
    if not text or not text.strip():
        return []
    
    # Use LangChain to split text
    docs = text_splitter.create_documents([text])
    
    chunks = []
    for i, doc in enumerate(docs):
        chunks.append({
            "id": i,
            "text": doc.page_content,
            "length": len(doc.page_content)
        })
    return chunks


@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI backend!"}

@app.post("/upload-pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    try:
        # Save the uploaded file
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Parse the PDF
        with pdfplumber.open(file_path) as pdf:
            text = "\n".join([page.extract_text() or "" for page in pdf.pages])

        # Chunk the extracted text
        chunks = chunk_text(text)

        return JSONResponse(content={
            "filename": file.filename,
            "content": text,
            "chunks": chunks,
            "total_chunks": len(chunks),
            "chunk_settings": {
                "chunk_size": CHUNK_SIZE,
                "overlap": CHUNK_OVERLAP
            }
        }, status_code=200)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@app.post("/store-embeddings/")
async def store_embeddings(file: UploadFile = File(...)):
    """Upload PDF, chunk it, and store embeddings in FAISS"""
    global vectorstore
    
    try:
        # Save the uploaded file
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Parse the PDF
        with pdfplumber.open(file_path) as pdf:
            text = "\n".join([page.extract_text() or "" for page in pdf.pages])

        if not text.strip():
            raise HTTPException(status_code=400, detail="No text found in PDF")

        # Create LangChain documents from chunks
        docs = text_splitter.create_documents(
            [text],
            metadatas=[{"source": file.filename}]
        )

        # Create or update FAISS index
        if vectorstore is None:
            vectorstore = FAISS.from_documents(docs, embeddings)
        else:
            vectorstore.add_documents(docs)

        # Save to disk
        vectorstore.save_local(FAISS_INDEX_DIR)

        return JSONResponse(content={
            "message": "Embeddings stored successfully",
            "filename": file.filename,
            "chunks_stored": len(docs),
            "embedding_model": EMBEDDING_MODEL
        }, status_code=200)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@app.post("/search/")
async def search(request: SearchRequest):
    """Search for similar chunks using semantic similarity"""
    global vectorstore
    
    if vectorstore is None:
        raise HTTPException(
            status_code=400, 
            detail="No documents indexed yet. Upload a PDF first using /store-embeddings/"
        )
    
    try:
        # Perform similarity search
        results = vectorstore.similarity_search_with_score(
            request.query, 
            k=request.top_k
        )
        
        # Format results
        search_results = []
        for doc, score in results:
            search_results.append({
                "text": doc.page_content,
                "source": doc.metadata.get("source", "unknown"),
                "similarity_score": float(1 - score)  # Convert distance to similarity
            })
        
        return JSONResponse(content={
            "query": request.query,
            "results": search_results,
            "total_results": len(search_results)
        }, status_code=200)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@app.get("/index-stats/")
async def get_index_stats():
    """Get statistics about the FAISS index"""
    global vectorstore
    
    if vectorstore is None:
        return JSONResponse(content={
            "indexed": False,
            "message": "No documents indexed yet"
        }, status_code=200)
    
    return JSONResponse(content={
        "indexed": True,
        "total_documents": vectorstore.index.ntotal,
        "embedding_model": EMBEDDING_MODEL,
        "embedding_dimensions": 384  # all-MiniLM-L6-v2 dimension
    }, status_code=200)


@app.post("/answer/")
async def answer(request: SearchRequest):
    """Retrieve top-k chunks from FAISS and generate an answer using OpenAI ChatCompletion."""
    global vectorstore

    if vectorstore is None:
        raise HTTPException(
            status_code=400,
            detail="No documents indexed yet. Upload a PDF and store embeddings using /store-embeddings/"
        )

    if not OPENAI_API_KEY:
        raise HTTPException(status_code=400, detail="OPENAI_API_KEY not set on server")

    try:
        results = vectorstore.similarity_search_with_score(request.query, k=request.top_k)

        # Build context and matches
        context_parts = []
        matches = []
        for doc, score in results:
            text = doc.page_content
            source = doc.metadata.get("source", "unknown")
            context_parts.append(f"[Source: {source}] {text}")
            matches.append({"text": text, "source": source, "score": float(1 - score)})

        system_prompt = (
            "You are a helpful assistant. Use only the provided context to answer the question. "
            "If the information is not present, say you don't know. Cite sources by filename where relevant."
        )

        user_prompt = f"Context:\n\n{chr(10).join(context_parts)}\n\nQuestion: {request.query}\n\nAnswer concisely and cite sources."

        chat_resp = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            max_tokens=512,
            temperature=0.0,
        )

        answer_text = chat_resp["choices"][0]["message"]["content"].strip()

        return JSONResponse(content={"answer": answer_text, "matches": matches}, status_code=200)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")