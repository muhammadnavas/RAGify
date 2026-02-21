# RAGify

RAGify is a small full-stack Retrieval-Augmented Generation (RAG) prototype. It provides a web UI for uploading PDFs, builds a FAISS vector index from document chunks in the backend, retrieves relevant passages at query time, and generates contextual answers.

Key components
- **backend/** — FastAPI service that ingests PDFs, creates/loads a FAISS index, exposes retrieval and generation endpoints, and stores uploaded files under `backend/uploaded_pdfs`.
- **frontend/** — Next.js application that provides the user interface for uploads, querying, and visualization.

Architecture summary
- Documents are split into chunks and embedded; embeddings are stored in `backend/faiss_index/index.faiss`.
- The backend exposes REST endpoints for upload, search, and answer generation; the frontend calls these endpoints to power the UX.

Quick start (high level)
- Prepare the backend: create a Python virtual environment, install the dependencies listed in `backend/requirements.txt`, and run the FastAPI app from `backend/main.py` so the API is available.
- Prepare the frontend: install the Node dependencies in `frontend/` and run the Next.js development server to open the web UI.
- Use the web UI to upload PDFs; the backend will build/update the FAISS index and make documents searchable.

Notes
- The FAISS index and uploaded PDFs are persisted under `backend/faiss_index/` and `backend/uploaded_pdfs/` respectively.
- Adjust Python and Node versions as needed; ensure you have a compatible Python interpreter and Node.js installed.

If you'd like, I can add explicit install/run commands, API documentation for the backend endpoints, or a local development checklist.
