"use client";

import { useState } from "react";
import { Sparkles, Copy, Check } from "lucide-react";

interface Post {
  index: number;
  content: string;
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPosts([]);

    try {
      const res = await fetch("/api/generate-thread", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "エラーが発生しました");
        return;
      }

      setPosts(data.posts);
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy(content: string, index: number) {
    await navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  async function handleCopyAll() {
    const all = posts.map((p) => p.content).join("\n\n");
    await navigator.clipboard.writeText(all);
    setCopiedIndex(-1);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Background gradient at top */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-blue-50 to-transparent pointer-events-none" />

      <main className="relative flex-1 max-w-2xl mx-auto w-full px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            X Thread Generator
          </h1>
          <p className="text-gray-500">
            ブログ記事のURLを入力して、Xスレッドを自動生成
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/article"
              required
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-5 py-3 text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles size={15} />
              {loading ? "生成中..." : "生成"}
            </button>
          </div>
        </form>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center gap-3 py-16 text-gray-500">
            <div className="h-8 w-8 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin" />
            <p className="text-sm">記事を解析してスレッドを生成しています...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Results */}
        {posts.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-700">
                {posts.length}件のポストを生成しました
              </h2>
              <button
                onClick={handleCopyAll}
                className="text-xs text-blue-500 hover:text-blue-700 font-medium transition-colors cursor-pointer flex items-center gap-1"
              >
                {copiedIndex === -1 ? (
                  <><Check size={12} />コピーしました！</>
                ) : (
                  <><Copy size={12} />全てコピー</>
                )}
              </button>
            </div>

            {posts.map((post) => (
              <div
                key={post.index}
                className="rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold">
                      {post.index}
                    </span>
                    <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {post.content}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(post.content, post.index)}
                    className="flex-shrink-0 text-xs text-gray-400 hover:text-blue-500 transition-colors px-2 py-1 rounded hover:bg-blue-50 cursor-pointer flex items-center gap-1"
                  >
                    {copiedIndex === post.index ? (
                      <><Check size={12} />済み</>
                    ) : (
                      <><Copy size={12} />コピー</>
                    )}
                  </button>
                </div>
                <div className="mt-3 text-right">
                  <span
                    className={`text-xs ${
                      post.content.length > 140
                        ? "text-red-500"
                        : "text-gray-400"
                    }`}
                  >
                    {post.content.length} / 140文字
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative border-t border-gray-200 py-6 px-4">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-2 text-xs text-gray-400">
          <div className="flex items-center gap-4">
            <a
              href="https://x.com/yumion3_enmo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-gray-600 transition-colors"
            >
              <XIcon className="w-3 h-3" />
              フィードバックはXまで
            </a>
            <span className="text-gray-200">|</span>
            <a
              href="#"
              className="hover:text-gray-600 transition-colors"
            >
              プライバシーについて
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
