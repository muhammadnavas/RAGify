"use client";

export default function Architecture() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-8 font-sans dark:bg-black">
      <div className="w-full max-w-4xl rounded-lg bg-white p-8 shadow-lg dark:bg-zinc-900">
        {/* Main Title */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            RAGify
          </h1>
          <p className="mt-2 text-lg text-zinc-500 dark:text-zinc-400">
            Architecture & System Design
          </p>
          <div className="mx-auto mt-4 h-1 w-24 rounded bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500"></div>
        </div>

        {/* Section 1: Request/Response Flow */}
        <section className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
              1
            </span>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
              Request / Response Flow
            </h2>
          </div>
          <div className="relative mx-auto max-w-3xl rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-800/50">

          <div className="flex items-center justify-between gap-4">
            {/* Frontend Box */}
            <div className="flex h-28 w-36 flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-500 bg-blue-50 dark:bg-blue-950">
              <span className="font-semibold text-blue-700 dark:text-blue-300">
                Frontend
              </span>
              <span className="text-sm text-blue-600 dark:text-blue-400">
                :3000
              </span>
            </div>

            {/* Arrows and Labels */}
            <div className="flex flex-1 flex-col gap-6">
              {/* Request Arrow */}
              <div className="relative">
                <div className="flex items-center">
                  <div className="h-0.5 flex-1 bg-green-500"></div>
                  <div className="border-y-8 border-l-8 border-y-transparent border-l-green-500"></div>
                </div>
                <div className="mt-1 text-center">
                  <span className="block text-sm font-medium text-green-700 dark:text-green-400">
                    POST /upload-pdf/
                  </span>
                  <span className="block text-xs text-zinc-600 dark:text-zinc-400">
                    FormData {"{ file: <PDF> }"}
                  </span>
                </div>
              </div>

              {/* Response Arrow */}
              <div className="relative">
                <div className="flex items-center">
                  <div className="border-y-8 border-r-8 border-y-transparent border-r-purple-500"></div>
                  <div className="h-0.5 flex-1 bg-purple-500"></div>
                </div>
                <div className="mt-1 text-center">
                  <span className="block text-sm font-medium text-purple-700 dark:text-purple-400">
                    JSON Response
                  </span>
                  <span className="block text-xs text-zinc-600 dark:text-zinc-400">
                    {"{ filename, content, chunks[] }"}
                  </span>
                </div>
              </div>
            </div>

            {/* Backend Box */}
            <div className="flex h-28 w-36 flex-col items-center justify-center rounded-lg border-2 border-dashed border-orange-500 bg-orange-50 dark:bg-orange-950">
              <span className="font-semibold text-orange-700 dark:text-orange-300">
                Backend
              </span>
              <span className="text-sm text-orange-600 dark:text-orange-400">
                :8000
              </span>
            </div>
          </div>
          </div>
        </section>

        {/* Section 2: Text Chunking Pipeline */}
        <section className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-white">
              2
            </span>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
              Text Chunking Pipeline
            </h2>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-800/50">
          
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* PDF Input */}
            <div className="flex h-20 w-24 flex-col items-center justify-center rounded-lg border-2 border-red-400 bg-red-50 dark:bg-red-950">
              <span className="text-2xl">📄</span>
              <span className="text-xs font-medium text-red-700 dark:text-red-300">PDF</span>
            </div>
            
            <span className="text-xl text-zinc-400">→</span>
            
            {/* pdfplumber */}
            <div className="flex h-20 w-28 flex-col items-center justify-center rounded-lg border-2 border-yellow-400 bg-yellow-50 dark:bg-yellow-950">
              <span className="text-xs font-bold text-yellow-700 dark:text-yellow-300">pdfplumber</span>
              <span className="text-xs text-yellow-600 dark:text-yellow-400">Extract Text</span>
            </div>
            
            <span className="text-xl text-zinc-400">→</span>
            
            {/* Raw Text */}
            <div className="flex h-20 w-24 flex-col items-center justify-center rounded-lg border-2 border-zinc-400 bg-zinc-100 dark:bg-zinc-800">
              <span className="text-2xl">📝</span>
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Raw Text</span>
            </div>
            
            <span className="text-xl text-zinc-400">→</span>
            
            {/* LangChain */}
            <div className="flex h-20 w-32 flex-col items-center justify-center rounded-lg border-2 border-green-400 bg-green-50 dark:bg-green-950">
              <span className="text-xs font-bold text-green-700 dark:text-green-300">LangChain</span>
              <span className="text-xs text-green-600 dark:text-green-400">TextSplitter</span>
            </div>
            
            <span className="text-xl text-zinc-400">→</span>
            
            {/* Chunks */}
            <div className="flex h-20 w-24 flex-col items-center justify-center rounded-lg border-2 border-purple-400 bg-purple-50 dark:bg-purple-950">
              <div className="flex gap-0.5">
                <span className="text-sm">📦</span>
                <span className="text-sm">📦</span>
                <span className="text-sm">📦</span>
              </div>
              <span className="text-xs font-medium text-purple-700 dark:text-purple-300">Chunks</span>
            </div>
          </div>

          {/* Chunking Details */}
          <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-green-700 dark:text-green-300">
              <span className="text-lg">⚙️</span>
              LangChain RecursiveCharacterTextSplitter
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">Settings</h4>
                <ul className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                  <li>• chunk_size: <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-700">500</code> chars</li>
                  <li>• chunk_overlap: <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-700">100</code> chars</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">Separators (Priority)</h4>
                <ul className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                  <li>1. <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-700">\n\n</code> Paragraphs</li>
                  <li>2. <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-700">\n</code> Lines</li>
                  <li>3. <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-700">. ! ?</code> Sentences</li>
                  <li>4. <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-700">space</code> Words</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Overlap Visualization */}
          <div className="mt-4 rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-950">
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-purple-700 dark:text-purple-300">
              <span className="text-lg">📊</span>
              Overlap Visualization
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-6 w-48 rounded bg-blue-400"></div>
                <span className="text-xs text-zinc-600 dark:text-zinc-400">Chunk 1 (500 chars)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="ml-40 h-6 w-48 rounded bg-green-400"></div>
                <span className="text-xs text-zinc-600 dark:text-zinc-400">Chunk 2 (overlaps 100 chars)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="ml-80 h-6 w-48 rounded bg-orange-400"></div>
                <span className="text-xs text-zinc-600 dark:text-zinc-400">Chunk 3 (overlaps 100 chars)</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-zinc-600 dark:text-zinc-400">
              Overlap ensures context is preserved across chunk boundaries for better retrieval.
            </p>
          </div>
          </div>
        </section>

        {/* Section 3: Embeddings & LLM Retrieval */}
        <section className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-sm font-bold text-white">
              3
            </span>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
              Embeddings, Vector DB & LLM Retrieval
            </h2>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-800/50">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* Chunks */}
              <div className="flex h-20 w-24 flex-col items-center justify-center rounded-lg border-2 border-purple-400 bg-purple-50 dark:bg-purple-950">
                <div className="flex gap-0.5">
                  <span className="text-sm">📦</span>
                  <span className="text-sm">📦</span>
                  <span className="text-sm">📦</span>
                </div>
                <span className="text-xs font-medium text-purple-700 dark:text-purple-300">Chunks</span>
              </div>

              <span className="text-xl text-zinc-400">→</span>

              {/* Embeddings */}
              <div className="flex h-20 w-28 flex-col items-center justify-center rounded-lg border-2 border-teal-400 bg-teal-50 dark:bg-teal-950">
                <span className="text-xs font-bold text-teal-700 dark:text-teal-300">Embeddings</span>
                <span className="text-xs text-teal-600 dark:text-teal-400">sentence-vectors</span>
              </div>

              <span className="text-xl text-zinc-400">→</span>

              {/* Vector DB */}
              <div className="flex h-20 w-28 flex-col items-center justify-center rounded-lg border-2 border-sky-400 bg-sky-50 dark:bg-sky-950">
                <span className="text-xs font-bold text-sky-700 dark:text-sky-300">FAISS</span>
                <span className="text-xs text-sky-600 dark:text-sky-400">Vector DB</span>
              </div>

              <span className="text-xl text-zinc-400">→</span>

              {/* Query/LLM */}
              <div className="flex h-20 w-36 flex-col items-center justify-center rounded-lg border-2 border-indigo-400 bg-indigo-50 dark:bg-indigo-950">
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">LLM</span>
                <span className="text-xs text-indigo-600 dark:text-indigo-400">ChatCompletion</span>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">Endpoints</h4>
                <ul className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                  <li>• <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-700">POST /store-embeddings/</code> — chunk + store embeddings to FAISS</li>
                  <li>• <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-700">POST /search/</code> — semantic search (returns top-k chunks)</li>
                  <li>• <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-700">POST /answer/</code> — runs search + ChatCompletion to generate answer</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">Notes</h4>
                <ul className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                  <li>• Embeddings computed using a sentence-transformer or OpenAI embeddings.</li>
                  <li>• FAISS provides efficient nearest-neighbor search for top-k retrieval.</li>
                  <li>• The server builds a prompt with top-k chunks and asks the LLM to answer using only that context.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Component Details */}
        <section className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 text-sm font-bold text-white">
              3
            </span>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
              Component Architecture
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Frontend Details */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-5 dark:border-blue-800 dark:bg-blue-950">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-blue-700 dark:text-blue-300">
                <span>🖥️</span>
                Frontend (Next.js)
              </h3>
            <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-500">●</span>
                <span>File input for PDF selection</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">●</span>
                <span>FormData multipart upload</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">●</span>
                <span>Toggle: Full Content / Chunks view</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">●</span>
                <span>Display chunk cards with metadata</span>
              </li>
            </ul>
            </div>

            {/* Backend Details */}
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-5 dark:border-orange-800 dark:bg-orange-950">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-orange-700 dark:text-orange-300">
                <span>⚡</span>
                Backend (FastAPI)
              </h3>
            <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
              <li className="flex items-start gap-2">
                <span className="text-orange-500">●</span>
                <span>Save PDF to uploaded_pdfs/</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500">●</span>
                <span>Extract text with pdfplumber</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500">●</span>
                <span>Chunk text with LangChain</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500">●</span>
                <span>Return chunks array in response</span>
              </li>
            </ul>
            </div>
          </div>
        </section>

        {/* Section 4: Embeddings & Vector Store */}
        <section className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
              4
            </span>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
              Embeddings & Vector Store
            </h2>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-800/50">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* Chunks */}
              <div className="flex h-20 w-24 flex-col items-center justify-center rounded-lg border-2 border-purple-400 bg-purple-50 dark:bg-purple-950">
                <div className="flex gap-0.5">
                  <span className="text-sm">📦</span>
                  <span className="text-sm">📦</span>
                  <span className="text-sm">📦</span>
                </div>
                <span className="text-xs font-medium text-purple-700 dark:text-purple-300">Chunks</span>
              </div>
              
              <span className="text-xl text-zinc-400">→</span>
              
              {/* HuggingFace Embeddings */}
              <div className="flex h-20 w-36 flex-col items-center justify-center rounded-lg border-2 border-yellow-400 bg-yellow-50 dark:bg-yellow-950">
                <span className="text-2xl">🤗</span>
                <span className="text-xs font-bold text-yellow-700 dark:text-yellow-300">HuggingFace</span>
                <span className="text-xs text-yellow-600 dark:text-yellow-400">all-MiniLM-L6-v2</span>
              </div>
              
              <span className="text-xl text-zinc-400">→</span>
              
              {/* Vectors */}
              <div className="flex h-20 w-28 flex-col items-center justify-center rounded-lg border-2 border-cyan-400 bg-cyan-50 dark:bg-cyan-950">
                <span className="text-2xl">🔢</span>
                <span className="text-xs font-medium text-cyan-700 dark:text-cyan-300">Vectors</span>
                <span className="text-xs text-cyan-600 dark:text-cyan-400">384 dimensions</span>
              </div>
              
              <span className="text-xl text-zinc-400">→</span>
              
              {/* FAISS */}
              <div className="flex h-20 w-28 flex-col items-center justify-center rounded-lg border-2 border-blue-400 bg-blue-50 dark:bg-blue-950">
                <span className="text-2xl">🗄️</span>
                <span className="text-xs font-bold text-blue-700 dark:text-blue-300">FAISS</span>
                <span className="text-xs text-blue-600 dark:text-blue-400">Vector Store</span>
              </div>
            </div>

            {/* Embedding Details */}
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-950">
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-yellow-700 dark:text-yellow-300">
                  <span className="text-lg">🤗</span>
                  Sentence Transformers
                </h3>
                <ul className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                  <li>• Model: <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-700">all-MiniLM-L6-v2</code></li>
                  <li>• Output: 384-dimensional dense vectors</li>
                  <li>• Optimized for semantic similarity</li>
                  <li>• Fast inference on CPU</li>
                </ul>
              </div>
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-blue-700 dark:text-blue-300">
                  <span className="text-lg">🗄️</span>
                  FAISS Index
                </h3>
                <ul className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                  <li>• Facebook AI Similarity Search</li>
                  <li>• Efficient nearest neighbor search</li>
                  <li>• Persisted to <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-700">faiss_index/</code></li>
                  <li>• Supports incremental updates</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Semantic Search Flow */}
        <section className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-500 text-sm font-bold text-white">
              5
            </span>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
              Semantic Search (Retrieval)
            </h2>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-800/50">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* Query */}
              <div className="flex h-20 w-28 flex-col items-center justify-center rounded-lg border-2 border-pink-400 bg-pink-50 dark:bg-pink-950">
                <span className="text-2xl">❓</span>
                <span className="text-xs font-medium text-pink-700 dark:text-pink-300">User Query</span>
              </div>
              
              <span className="text-xl text-zinc-400">→</span>
              
              {/* Embed Query */}
              <div className="flex h-20 w-32 flex-col items-center justify-center rounded-lg border-2 border-yellow-400 bg-yellow-50 dark:bg-yellow-950">
                <span className="text-2xl">🤗</span>
                <span className="text-xs font-bold text-yellow-700 dark:text-yellow-300">Embed Query</span>
              </div>
              
              <span className="text-xl text-zinc-400">→</span>
              
              {/* FAISS Search */}
              <div className="flex h-20 w-32 flex-col items-center justify-center rounded-lg border-2 border-blue-400 bg-blue-50 dark:bg-blue-950">
                <span className="text-2xl">🔍</span>
                <span className="text-xs font-bold text-blue-700 dark:text-blue-300">FAISS Search</span>
                <span className="text-xs text-blue-600 dark:text-blue-400">k-NN lookup</span>
              </div>
              
              <span className="text-xl text-zinc-400">→</span>
              
              {/* Results */}
              <div className="flex h-20 w-28 flex-col items-center justify-center rounded-lg border-2 border-green-400 bg-green-50 dark:bg-green-950">
                <span className="text-2xl">📋</span>
                <span className="text-xs font-medium text-green-700 dark:text-green-300">Top-K Results</span>
              </div>
            </div>

            {/* Search Details */}
            <div className="mt-6 rounded-lg border border-pink-200 bg-pink-50 p-4 dark:border-pink-800 dark:bg-pink-950">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-pink-700 dark:text-pink-300">
                <span className="text-lg">🔍</span>
                Similarity Search Process
              </h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <h4 className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">1. Query Embedding</h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Convert user query to 384D vector using same embedding model
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">2. Vector Search</h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    FAISS finds nearest neighbors using L2 distance metric
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">3. Return Results</h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Return top-K chunks with similarity scores and metadata
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: API Endpoints */}
        <section className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-sm font-bold text-white">
              6
            </span>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
              API Endpoints
            </h2>
          </div>
          <div className="space-y-3">
            {/* Endpoint 1 */}
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
              <div className="flex items-center gap-3">
                <span className="rounded bg-green-100 px-2 py-1 text-xs font-bold text-green-700 dark:bg-green-900 dark:text-green-300">POST</span>
                <code className="text-sm font-medium text-zinc-800 dark:text-zinc-200">/upload-pdf/</code>
              </div>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Upload PDF, extract text, split into chunks. Returns preview without storing.
              </p>
            </div>
            {/* Endpoint 2 */}
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
              <div className="flex items-center gap-3">
                <span className="rounded bg-green-100 px-2 py-1 text-xs font-bold text-green-700 dark:bg-green-900 dark:text-green-300">POST</span>
                <code className="text-sm font-medium text-zinc-800 dark:text-zinc-200">/store-embeddings/</code>
              </div>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Upload PDF, generate embeddings, store in FAISS vector index.
              </p>
            </div>
            {/* Endpoint 3 */}
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
              <div className="flex items-center gap-3">
                <span className="rounded bg-green-100 px-2 py-1 text-xs font-bold text-green-700 dark:bg-green-900 dark:text-green-300">POST</span>
                <code className="text-sm font-medium text-zinc-800 dark:text-zinc-200">/search/</code>
              </div>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Semantic search. Body: <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-700">{"{ query, top_k }"}</code>. Returns similar chunks with scores.
              </p>
            </div>
            {/* Endpoint 4 */}
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
              <div className="flex items-center gap-3">
                <span className="rounded bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-300">GET</span>
                <code className="text-sm font-medium text-zinc-800 dark:text-zinc-200">/index-stats/</code>
              </div>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Get FAISS index statistics: total vectors, embedding model, dimensions.
              </p>
            </div>
          </div>
        </section>

        {/* Section 7: Data Flow Steps */}
        <section className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500 text-sm font-bold text-white">
              7
            </span>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
              Complete RAG Pipeline
            </h2>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-800/50">
            <h3 className="mb-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">Indexing Phase</h3>
            <div className="mb-6 flex flex-wrap items-center justify-center gap-2 text-sm">
            {[
              "📄 PDF",
              "📝 Extract",
              "✂️ Chunk",
              "🤗 Embed",
              "🗄️ Store",
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  {step}
                </span>
                {i < 4 && (
                  <span className="text-zinc-400 dark:text-zinc-600">→</span>
                )}
              </div>
            ))}
            </div>
            <h3 className="mb-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">Query Phase</h3>
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
            {[
              "❓ Query",
              "🤗 Embed",
              "🔍 Search",
              "📋 Results",
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="rounded-full bg-purple-100 px-3 py-1 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                  {step}
                </span>
                {i < 3 && (
                  <span className="text-zinc-400 dark:text-zinc-600">→</span>
                )}
              </div>
            ))}
            </div>
          </div>
        </section>

        {/* Back Link */}
        <div className="mt-4 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-4 py-2 text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            <span>←</span>
            Back to Upload
          </a>
        </div>
      </div>
    </div>
  );
}
