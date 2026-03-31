"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Copy, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/Header";
import { LoginModal } from "@/components/LoginModal";
import { EditablePost } from "@/components/EditablePost";

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

function SearchParamsHandler({
  onToast,
  onUrl,
}: {
  onToast: (msg: string, ms: number) => void;
  onUrl: (url: string) => void;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { refreshCredits } = useAuth();

  useEffect(() => {
    const payment = searchParams.get("payment");
    if (payment === "success") {
      onToast("購入が完了しました！クレジットが追加されます。", 4000);
      refreshCredits();
      router.replace("/");
    } else if (payment === "cancel") {
      onToast("購入がキャンセルされました。", 3000);
      router.replace("/");
    }

    const urlParam = searchParams.get("url");
    if (urlParam) {
      onUrl(urlParam);
      router.replace("/");
      return;
    }

    // ログイン後に localStorage の pending_url を復元
    const pendingUrl = localStorage.getItem("pending_url");
    if (pendingUrl) {
      onUrl(pendingUrl);
      localStorage.removeItem("pending_url");
    }
  }, [searchParams]);

  return null;
}

export default function Home() {
  const { user, credits, refreshCredits } = useAuth();
  const [url, setUrl] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [copiedAll, setCopiedAll] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);

  function showToast(msg: string, ms: number) {
    setToast(msg);
    setTimeout(() => setToast(""), ms);
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!user) {
      if (url) localStorage.setItem("pending_url", url);
      setShowLoginModal(true);
      return;
    }

    if (credits !== null && credits <= 0) {
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
        if (res.status === 401) {
          setShowLoginModal(true);
          return;
        }
        setError(data.error || "エラーが発生しました");
        return;
      }

      setPosts(data.posts);
      refreshCredits();
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  async function handleBuy() {
    setBuyLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setError("決済ページへの遷移に失敗しました");
    } finally {
      setBuyLoading(false);
    }
  }

  async function handleCopyAll() {
    const all = posts.map((p) => p.content).join("\n\n");
    await navigator.clipboard.writeText(all);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  }

  const noCredits = user && credits !== null && credits <= 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="absolute top-0 left-0 right-0 h-64 bg-linear-to-b from-blue-50 to-transparent pointer-events-none" />

      <Header
        onLoginClick={() => setShowLoginModal(true)}
        onBuyClick={handleBuy}
      />

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

        {/* Credit warning */}
        {noCredits && (
          <div className="mb-6 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 flex items-center justify-between">
            <p className="text-sm text-amber-700">クレジットがなくなりました</p>
            <button
              onClick={handleBuy}
              disabled={buyLoading}
              className="text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              {buyLoading ? "移動中..." : "10回分 / ¥300"}
            </button>
          </div>
        )}

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
              disabled={loading || !!noCredits}
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
                {copiedAll ? (
                  <><Check size={12} />コピーしました！</>
                ) : (
                  <><Copy size={12} />全てコピー</>
                )}
              </button>
            </div>

            {posts.map((post) => (
              <EditablePost key={post.index} index={post.index} content={post.content} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative border-t border-gray-200 py-6 px-4">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-3 text-xs text-gray-400">
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
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
            <Link href="/terms" className="hover:text-gray-600 transition-colors">利用規約</Link>
            <span className="text-gray-200">|</span>
            <Link href="/privacy" className="hover:text-gray-600 transition-colors">プライバシーポリシー</Link>
            <span className="text-gray-200">|</span>
            <Link href="/legal" className="hover:text-gray-600 transition-colors">特定商取引法に基づく表記</Link>
          </div>
          <p>© {new Date().getFullYear()} X Thread Generator</p>
        </div>
      </footer>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      <Suspense>
        <SearchParamsHandler onToast={showToast} onUrl={setUrl} />
      </Suspense>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-5 py-3 rounded-full shadow-lg z-50 whitespace-nowrap">
          {toast}
        </div>
      )}
    </div>
  );
}
