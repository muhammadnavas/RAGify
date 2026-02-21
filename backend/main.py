from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from fastapi.responses import JSONResponse
import shutil
import pdfplumber
# Load .env for local development if python-dotenv is available
try:
    from dotenv import load_dotenv
    load_dotenv(override=True)
except Exception:
    pass
from typing import List, Optional
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from pydantic import BaseModel
import numpy as np
import requests
# Optional official Google Generative AI SDK
try:
    from google import genai
    HAS_GENAI = True
except Exception:
    HAS_GENAI = False

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

# OpenAI removed — backend will use Gemini only

# Gemini / Google Generative API settings (optional)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "models/flash-2.5")
# Force using Gemini by default (only Gemini provider will be used)
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "gemini").lower()

# If the official SDK is installed and we have a key, initialize a client
genai_client = None
if HAS_GENAI and GEMINI_API_KEY:
    try:
        genai_client = genai.Client(api_key=GEMINI_API_KEY)
    except Exception:
        genai_client = None


def generate_with_gemini(prompt: str, model: str = None, api_key: str = None) -> str:
    """Generate text using Gemini. Prefer the official `google-genai` SDK (if available),
    trying a list of SDK model names first. If the SDK is not available or an SDK call fails,
    fall back to REST v1 endpoints for model-specific and generic generation.
    """
    api_key = api_key or GEMINI_API_KEY
    preferred = model or GEMINI_MODEL
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY (or GOOGLE_API_KEY) not set")

    # Prepare SDK model candidates (SDK uses names like 'gemini-2.5-flash')
    sdk_candidates = []
    # If preferred looks like 'models/xxx', try to convert to SDK-style name
    if preferred and preferred.startswith("models/"):
        name = preferred.split("/", 1)[1]
        # Common mapping heuristics
        sdk_candidates.append(name.replace("-", "-"))
    # Add known/commonly-available SDK model names
    sdk_candidates.extend([
        "gemini-2.5-flash",
        "gemini-2.5-pro",
        "gemini-2.5",
        "gemini-1.0",
        "chat-bison-001",
        "text-bison-001",
    ])

    last_err = None

    # Try using official SDK if available
    if genai_client is not None:
        for sdk_model in [m for m in sdk_candidates if m]:
            try:
                # `generate_content` expects model and contents (string or list)
                resp = genai_client.models.generate_content(model=sdk_model, contents=prompt)
                # SDK response often has `.text` attribute
                return getattr(resp, "text", str(resp))
            except Exception as e:
                last_err = f"SDK model={sdk_model} error={str(e)}"
                # try next sdk model
                continue

    # Fallback: try REST v1 endpoints for model-specific and generic generation
    rest_model_candidates = [preferred, "models/text-bison-001", "models/chat-bison-001", "models/flash-2.5"]
    for m in [x for x in rest_model_candidates if x]:
        endpoints = [
            f"https://generativelanguage.googleapis.com/v1/{m}:generate?key={api_key}",
            f"https://generativelanguage.googleapis.com/v1/models:generate?key={api_key}",
        ]
        for url in endpoints:
            try:
                if "/models:generate" in url:
                    body = {"model": m, "prompt": {"text": prompt}, "temperature": 0.0, "maxOutputTokens": 512}
                else:
                    body = {"prompt": {"text": prompt}, "temperature": 0.0, "maxOutputTokens": 512}

                resp = requests.post(url, json=body, timeout=30)
                resp.raise_for_status()
                data = resp.json()

                if isinstance(data.get("candidates"), list) and len(data["candidates"]) > 0:
                    cand = data["candidates"][0]
                    return cand.get("content") or cand.get("output") or cand.get("text") or str(cand)
                if "output" in data:
                    return data["output"]
                if "results" in data and isinstance(data["results"], list) and len(data["results"]) > 0:
                    r = data["results"][0]
                    return r.get("content") or r.get("output") or str(r)

                return str(data)

            except requests.HTTPError as e:
                resp = e.response
                status = resp.status_code if resp is not None else None
                body = resp.text if resp is not None else str(e)
                last_err = f"model={m} url={url} status={status} body={body}"
                if status == 404:
                    continue
                raise HTTPException(status_code=502, detail=f"Gemini API HTTP error: {last_err}")
            except Exception as e:
                last_err = str(e)
                continue

    detail = last_err if last_err is not None else "unknown error"
    raise HTTPException(status_code=502, detail=(
        "Gemini API unreachable; attempted SDK and REST models/endpoints failed. "
        f"Last error: {detail}. Ensure your API key has access to the requested model and that the model name is correct."
    ))

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
    """Retrieve top-k chunks from FAISS and generate an answer using Gemini (Google Generative)."""
    global vectorstore

    if vectorstore is None:
        raise HTTPException(
            status_code=400,
            detail="No documents indexed yet. Upload a PDF and store embeddings using /store-embeddings/"
        )

    # Only Gemini is supported in this deployment
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=400, detail="GEMINI_API_KEY (or GOOGLE_API_KEY) not set on server")

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


        # Generate using Gemini (Flash 2.5)
        answer_text = generate_with_gemini(user_prompt, model=GEMINI_MODEL)

        return JSONResponse(content={"answer": answer_text, "matches": matches}, status_code=200)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")