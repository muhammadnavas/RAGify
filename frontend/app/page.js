"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [storing, setStoring] = useState(false);
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [viewMode, setViewMode] = useState("content");
  const [activeTab, setActiveTab] = useState("upload");
  const [indexStats, setIndexStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [topK, setTopK] = useState(5);

  // Fetch index stats on mount and after storing
  const fetchIndexStats = async () => {
    try {
      const response = await fetch("http://localhost:8000/index-stats/");
      const data = await response.json();
      setIndexStats(data);
    } catch (err) {
      console.error("Failed to fetch index stats:", err);
    }
  };

  useEffect(() => {
    fetchIndexStats();
  }, []);

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
    setSuccess(null);

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

  const handleStoreEmbeddings = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setStoring(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/store-embeddings/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Failed: ${response.statusText}`);
      }

      const data = await response.json();
      setSuccess(`Stored ${data.chunks_stored} chunks from "${data.filename}" using ${data.embedding_model}`);
      fetchIndexStats();
    } catch (err) {
      setError(err.message || "An error occurred while storing embeddings");
    } finally {
      setStoring(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a search query");
      return;
    }

    setSearching(true);
    setError(null);
    setSearchResults(null);

    try {
      const response = await fetch("http://localhost:8000/search/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery, top_k: topK }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Search failed: ${response.statusText}`);
      }

      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      setError(err.message || "An error occurred during search");
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 p-8 font-sans dark:bg-black">
      <div className="w-full max-w-5xl">
        <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-white">
          RAGify
        </h1>
        <p className="mb-6 text-zinc-600 dark:text-zinc-400">
          PDF Retrieval Augmented Generation Pipeline
        </p>

        {/* Index Stats Card */}
        <div className="mb-6 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold opacity-90">Vector Index Status</h2>
              {indexStats?.indexed ? (
                <div className="mt-2 flex items-center gap-6">
                  <div>
                    <p className="text-3xl font-bold">{indexStats.total_documents}</p>
                    <p className="text-sm opacity-75">Vectors Stored</p>
                  </div>
                  <div className="h-12 w-px bg-white/30"></div>
                  <div>
                    <p className="text-lg font-medium">{indexStats.embedding_model}</p>
                    <p className="text-sm opacity-75">{indexStats.embedding_dimensions}D embeddings</p>
                  </div>
                </div>
              ) : (
                <p className="mt-2 text-sm opacity-75">No documents indexed yet</p>
              )}
            </div>
            <div className="rounded-full bg-white/20 p-4">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 flex rounded-lg bg-white p-1 shadow dark:bg-zinc-900">
          {["upload", "search"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-md px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              {tab === "upload" ? "📄 Upload & Index" : "🔍 Semantic Search"}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-4 text-sm text-red-700 dark:bg-red-900 dark:text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg bg-green-100 p-4 text-sm text-green-700 dark:bg-green-900 dark:text-green-300">
            ✓ {success}
          </div>
        )}

        {/* Upload Tab */}
        {activeTab === "upload" && (
          <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-zinc-900">
            <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
              Upload PDF Document
            </h2>

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

            <div className="flex gap-3">
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="flex-1 rounded-lg bg-zinc-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-zinc-700 focus:outline-none focus:ring-4 focus:ring-zinc-300 disabled:cursor-not-allowed disabled:bg-zinc-400"
              >
                {uploading ? "Processing..." : "Preview Chunks"}
              </button>
              <button
                onClick={handleStoreEmbeddings}
                disabled={!file || storing}
                className="flex-1 rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-zinc-400"
              >
                {storing ? "Storing..." : "Store Embeddings"}
              </button>
            </div>

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

                {result.chunk_settings && (
                  <div className="mb-4 flex gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                    <span>Chunk size: {result.chunk_settings.chunk_size} chars</span>
                    <span>Overlap: {result.chunk_settings.overlap} chars</span>
                  </div>
                )}

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

                {viewMode === "content" && (
                  <div className="max-h-96 overflow-y-auto rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800">
                    <pre className="whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
                      {result.content}
                    </pre>
                  </div>
                )}

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
          </div>
        )}

        {/* Search Tab */}
        {activeTab === "search" && (
          <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-zinc-900">
            <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
              Semantic Search
            </h2>

            {!indexStats?.indexed ? (
              <div className="rounded-lg bg-yellow-50 p-6 text-center dark:bg-yellow-900/20">
                <div className="text-4xl mb-2">📭</div>
                <p className="text-yellow-700 dark:text-yellow-300">
                  No documents indexed yet. Upload a PDF first!
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Search Query
                  </label>
                  <textarea
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter your question or search terms..."
                    className="w-full rounded-lg border border-zinc-300 bg-zinc-50 p-3 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                    rows={3}
                  />
                </div>

                <div className="mb-4 flex items-center gap-4">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Top K Results:
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={topK}
                    onChange={(e) => setTopK(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="w-8 text-center text-sm font-medium text-zinc-900 dark:text-white">
                    {topK}
                  </span>
                </div>

                <button
                  onClick={handleSearch}
                  disabled={!searchQuery.trim() || searching}
                  className="w-full rounded-lg bg-purple-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:cursor-not-allowed disabled:bg-zinc-400"
                >
                  {searching ? "Searching..." : "Search Documents"}
                </button>

                {searchResults && (
                  <div className="mt-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                        Results for: "{searchResults.query}"
                      </h3>
                      <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                        {searchResults.total_results} matches
                      </span>
                    </div>

                    <div className="space-y-4">
                      {searchResults.results.map((result, idx) => (
                        <div
                          key={idx}
                          className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800"
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <span className="rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                              #{idx + 1}
                            </span>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                Source: {result.source}
                              </span>
                              <div className="flex items-center gap-1">
                                <div 
                                  className="h-2 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                                  style={{ width: "60px" }}
                                >
                                  <div 
                                    className="h-2 rounded-full bg-zinc-300 dark:bg-zinc-600"
                                    style={{ 
                                      width: `${(1 - result.similarity_score) * 100}%`,
                                      marginLeft: `${result.similarity_score * 100}%`
                                    }}
                                  ></div>
                                </div>
                                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                  {(result.similarity_score * 100).toFixed(1)}%
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-zinc-700 dark:text-zinc-300">
                            {result.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
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
