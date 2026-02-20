from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from fastapi.responses import JSONResponse
import shutil
import pdfplumber
from typing import List
from langchain_text_splitters import RecursiveCharacterTextSplitter

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


def chunk_text(text: str) -> List[dict]:
    """
    Split text into overlapping chunks using LangChain's RecursiveCharacterTextSplitter.
    
    Args:
        text: The text to split
    
    Returns:
        List of chunk dictionaries with id, text, and metadata
    """
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