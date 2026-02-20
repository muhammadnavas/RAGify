"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("content"); // "content" or "chunks"

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError(null);
    } else {
      setFile(null);
      setError("Please select a valid PDF file");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setUploading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/upload-pdf/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "An error occurred during upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-8 font-sans dark:bg-black">
      <div className="w-full max-w-4xl rounded-lg bg-white p-8 shadow-lg dark:bg-zinc-900">
        <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white">
          RAGify - PDF Upload
        </h1>

        <div className="mb-6">
          <label
            htmlFor="pdf-upload"
            className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Select PDF File
          </label>
          <input
            id="pdf-upload"
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className="block w-full cursor-pointer rounded-lg border border-zinc-300 bg-zinc-50 text-sm text-zinc-900 file:mr-4 file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white file:hover:bg-blue-700 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
          />
          {file && (
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Selected: {file.name}
            </p>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-zinc-400 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          {uploading ? "Uploading..." : "Upload PDF"}
        </button>

        {error && (
          <div className="mt-4 rounded-lg bg-red-100 p-4 text-sm text-red-700 dark:bg-red-900 dark:text-red-300">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                {result.filename}
              </h2>
              {result.total_chunks > 0 && (
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                  {result.total_chunks} chunks
                </span>
              )}
            </div>

            {/* Chunk Settings Info */}
            {result.chunk_settings && (
              <div className="mb-4 flex gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                <span>Chunk size: {result.chunk_settings.chunk_size} chars</span>
                <span>Overlap: {result.chunk_settings.overlap} chars</span>
              </div>
            )}

            {/* View Toggle */}
            <div className="mb-4 flex rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
              <button
                onClick={() => setViewMode("content")}
                className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  viewMode === "content"
                    ? "bg-white text-zinc-900 shadow dark:bg-zinc-700 dark:text-white"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                Full Content
              </button>
              <button
                onClick={() => setViewMode("chunks")}
                className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  viewMode === "chunks"
                    ? "bg-white text-zinc-900 shadow dark:bg-zinc-700 dark:text-white"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                Chunks ({result.total_chunks})
              </button>
            </div>

            {/* Content View */}
            {viewMode === "content" && (
              <div className="max-h-96 overflow-y-auto rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800">
                <pre className="whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
                  {result.content}
                </pre>
              </div>
            )}

            {/* Chunks View */}
            {viewMode === "chunks" && result.chunks && (
              <div className="max-h-96 space-y-3 overflow-y-auto">
                {result.chunks.map((chunk) => (
                  <div
                    key={chunk.id}
                    className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        Chunk {chunk.id + 1}
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {chunk.length} chars
                      </span>
                    </div>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                      {chunk.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-6 text-center">
          <a
            href="/architecture"
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            View Architecture Diagram →
          </a>
        </div>
      </div>
    </div>
  );
}
