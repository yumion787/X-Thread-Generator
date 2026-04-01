"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Sparkles, Copy, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { EditablePost } from "@/components/EditablePost";

interface Post {
  index: number;
  content: string;
}


interface GeneratorProps {
  url: string;
  setUrl: (url: string) => void;
  onBuyClick: () => void;
  buyLoading: boolean;
}

export function Generator({ url, setUrl, onBuyClick, buyLoading }: GeneratorProps) {
  const { credits, refreshCredits } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedAll, setCopiedAll] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const noCredits = credits !== null && credits <= 0;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (noCredits) {
      setError("クレジットが不足しています。購入してください。");
      return;
    }

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
      refreshCredits();
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopyAll() {
    const all = posts.map((p) => p.content).join("\n\n");
    await navigator.clipboard.writeText(all);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  }

  return (
    <div className="flex flex-col flex-1">
      <main className="flex-1 bg-slate-50">
        <div className="max-w-2xl mx-auto px-4 py-12">
          {/* タイトル */}
          <div className="text-center mb-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              スレッドを生成する
            </h1>
            <p className="text-gray-500 text-sm">
              ブログ記事のURLを入力して、Xスレッドを自動生成
            </p>
          </div>

          {/* クレジット切れ警告 */}
          {noCredits && (
            <div className="mb-6 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 flex items-center justify-between">
              <p className="text-sm text-amber-700">クレジットがなくなりました</p>
              <button
                onClick={onBuyClick}
                disabled={buyLoading}
                className="text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                {buyLoading ? "移動中..." : "10回分 / ¥300"}
              </button>
            </div>
          )}

          {/* フォーム */}
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/your-article"
                required
                className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
              <button
                type="submit"
                disabled={loading || noCredits}
                className="rounded-xl bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-3 text-sm font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shadow-sm"
              >
                <Sparkles size={15} />
                {loading ? "生成中..." : "生成する"}
              </button>
            </div>
          </form>

          {/* ローディング */}
          {loading && (
            <div className="flex flex-col items-center gap-3 py-16 text-gray-500">
              <div className="h-8 w-8 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin" />
              <p className="text-sm">記事を解析してスレッドを生成しています...</p>
            </div>
          )}

          {/* エラー */}
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* 結果 */}
          {posts.length > 0 && (
            <div ref={resultsRef} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-700">
                  {posts.length}件のポストを生成しました
                </h2>
                <button
                  onClick={handleCopyAll}
                  className="text-xs text-blue-500 hover:text-blue-700 font-medium transition-colors cursor-pointer flex items-center gap-1"
                >
                  {copiedAll ? <><Check size={12} />コピーしました！</> : <><Copy size={12} />全てコピー</>}
                </button>
              </div>
              {posts.map((post) => (
                <EditablePost key={post.index} index={post.index} content={post.content} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-4 bg-white">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-3 text-xs text-gray-400">
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
            <Link href="/terms" className="hover:text-gray-600 transition-colors">利用規約</Link>
            <span className="text-gray-200">|</span>
            <Link href="/privacy" className="hover:text-gray-600 transition-colors">プライバシーポリシー</Link>
            <span className="text-gray-200">|</span>
            <Link href="/legal" className="hover:text-gray-600 transition-colors">特定商取引法に基づく表記</Link>
          </div>
          <p>© {new Date().getFullYear()} X Thread Generator</p>
        </div>
      </footer>
    </div>
  );
}
