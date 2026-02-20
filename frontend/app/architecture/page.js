"use client";

export default function Architecture() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-8 font-sans dark:bg-black">
      <div className="w-full max-w-4xl rounded-lg bg-white p-8 shadow-lg dark:bg-zinc-900">
        <h1 className="mb-8 text-center text-2xl font-bold text-zinc-900 dark:text-white">
          RAGify - Architecture Flow
        </h1>

        {/* Request/Response Flow Diagram */}
        <div className="relative mx-auto max-w-3xl">
          <h2 className="mb-6 text-lg font-semibold text-zinc-700 dark:text-zinc-300">
            Request/Response Flow
          </h2>

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
                    {"{ filename, content: \"...\" }"}
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

        {/* Component Details */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {/* Frontend Details */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
            <h3 className="mb-3 font-semibold text-blue-700 dark:text-blue-300">
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
                <span>Display extracted text content</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">●</span>
                <span>Error handling & loading states</span>
              </li>
            </ul>
          </div>

          {/* Backend Details */}
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-950">
            <h3 className="mb-3 font-semibold text-orange-700 dark:text-orange-300">
              Backend (FastAPI)
            </h3>
            <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
              <li className="flex items-start gap-2">
                <span className="text-orange-500">●</span>
                <span>CORS enabled for localhost:3000</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500">●</span>
                <span>POST /upload-pdf/ endpoint</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500">●</span>
                <span>Save PDF to uploaded_pdfs/</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500">●</span>
                <span>Extract text with pdfplumber</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Data Flow Steps */}
        <div className="mt-8">
          <h3 className="mb-4 font-semibold text-zinc-700 dark:text-zinc-300">
            Data Flow Steps
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
            {[
              "1. Select PDF",
              "2. Click Upload",
              "3. FormData POST",
              "4. Save File",
              "5. Extract Text",
              "6. Return JSON",
              "7. Display Content",
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="rounded-full bg-zinc-200 px-3 py-1 dark:bg-zinc-700 dark:text-zinc-300">
                  {step}
                </span>
                {i < 6 && (
                  <span className="text-zinc-400 dark:text-zinc-600">→</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            ← Back to Upload
          </a>
        </div>
      </div>
    </div>
  );
}
