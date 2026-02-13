# RAGify Project

This project is a full-stack application with the following structure

- **backend/**: Contains the FastAPI backend for handling API requests.
  - `main.py`: Entry point for the FastAPI application.
  - `requirements.txt`: Python dependencies for the backend.

- **frontend/**: Contains the Next.js frontend for the user interface.
  - `package.json`: Configuration file for the Next.js project.
  - `pages/index.js`: Main page of the frontend.

## Setup Instructions

### Backend
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment:
   ```bash
   python -m venv env
   source env/bin/activate   # On Windows: .\env\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```
5. The backend will be available at `http://127.0.0.1:8000`.

### Frontend
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. The frontend will be available at `http://localhost:3000`.

### Project Overview
This project allows users to upload a PDF, split and embed its content, retrieve relevant chunks, generate accurate answers, and visualize the process. The backend is built with FastAPI, and the frontend is built with Next.js.
