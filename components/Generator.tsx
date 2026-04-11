"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { Sparkles, Copy, Check, MessageSquare, MessagesSquare, Share2, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { EditablePost } from "@/components/EditablePost";

type GenerateMode = "thread" | "single";
type ToneStyle = "casual" | "business" | "provocative";

const TONE_OPTIONS: { value: ToneStyle; label: string; description: string }[] = [
  { value: "casual", label: "カジュアル", description: "親しみやすく、フランクな口調" },
  { value: "business", label: "ビジネス", description: "信頼感のある、丁寧な口調" },
  { value: "provocative", label: "煽り系", description: "興味を引く、強めの口調" },
];

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
  const [copiedShare, setCopiedShare] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [mode, setMode] = useState<GenerateMode>("thread");
  const [tone, setTone] = useState<ToneStyle>("casual");
  const [showConfirm, setShowConfirm] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const noCredits = credits !== null && credits <= 0;

  // フォーム送信 → 確認ダイアログ表示
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (noCredits) {
      setError("クレジットが不足しています。購入してください。");
      return;
    }

    setShowConfirm(true);
  }

  // 確認後に実際の生成を実行
  const executeGenerate = useCallback(async () => {
    setShowConfirm(false);
    setLoading(true);
    setError("");
    setPosts([]);
    setThreadId(null);

    try {
      const res = await fetch("/api/generate-thread", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, mode, tone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "エラーが発生しました");
        return;
      }

      setPosts(data.posts);
      setThreadId(data.thread_id ?? null);
      refreshCredits();
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }, [url, mode, tone, refreshCredits]);

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
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {mode === "thread" ? "スレッドを生成する" : "ポストを生成する"}
            </h1>
            <p className="text-gray-500 text-sm">
              ブログ記事のURLを入力して、{mode === "thread" ? "Xスレッドを自動生成" : "Xポストを3パターン生成"}
            </p>
          </div>

          {/* モード選択 */}
          <div className="mb-6">
            <div className="flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setMode("thread")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  mode === "thread"
                    ? "bg-blue-500 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <MessagesSquare size={15} />
                スレッド（連投）
              </button>
              <button
                type="button"
                onClick={() => setMode("single")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  mode === "single"
                    ? "bg-blue-500 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <MessageSquare size={15} />
                単一ポスト（3案）
              </button>
            </div>
          </div>

          {/* トーン選択 */}
          <div className="mb-6">
            <p className="text-xs font-medium text-gray-500 mb-2">トーン・スタイル</p>
            <div className="grid grid-cols-3 gap-2">
              {TONE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTone(opt.value)}
                  className={`rounded-xl border py-3 px-3 text-center transition-all cursor-pointer ${
                    tone === opt.value
                      ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <p className={`text-sm font-semibold ${tone === opt.value ? "text-blue-700" : "text-gray-700"}`}>
                    {opt.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{opt.description}</p>
                </button>
              ))}
            </div>
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
                  {mode === "single"
                    ? `${posts.length}パターンのポストを生成しました`
                    : `${posts.length}件のポストを生成しました`}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyAll}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      copiedAll
                        ? "bg-green-50 text-green-600 border border-green-200"
                        : "bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100"
                    }`}
                  >
                    {copiedAll ? <><Check size={13} />コピー済み</> : <><Copy size={13} />全てコピー</>}
                  </button>
                  {threadId && (
                    <button
                      onClick={async () => {
                        const shareUrl = `${window.location.origin}/share/${threadId}`;
                        await navigator.clipboard.writeText(shareUrl);
                        setCopiedShare(true);
                        setTimeout(() => setCopiedShare(false), 2000);
                      }}
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        copiedShare
                          ? "bg-green-50 text-green-600 border border-green-200"
                          : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {copiedShare ? <><Check size={13} />コピー済み</> : <><Share2 size={13} />シェアリンク</>}
                    </button>
                  )}
                </div>
              </div>
              {posts.map((post) => (
                <EditablePost key={post.index} index={post.index} content={post.content} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 確認ダイアログ */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowConfirm(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-6">
            <button
              onClick={() => setShowConfirm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                <Sparkles size={22} className="text-blue-500" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">生成を実行しますか？</h3>
              <p className="text-sm text-gray-500 mb-1">
                クレジットを <span className="font-semibold text-gray-700">1回分</span> 消費します。
              </p>
              <p className="text-xs text-gray-400 mb-6">
                残りクレジット: {credits ?? "-"}回
              </p>

              <div className="bg-gray-50 rounded-xl p-3 mb-6 text-left">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-1.5">
                  <span className="font-medium">モード:</span>
                  <span>{mode === "thread" ? "スレッド（連投）" : "単一ポスト（3案）"}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-1.5">
                  <span className="font-medium">トーン:</span>
                  <span>{TONE_OPTIONS.find((o) => o.value === tone)?.label}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="font-medium">URL:</span>
                  <span className="truncate">{url}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 text-sm transition-colors cursor-pointer"
                >
                  キャンセル
                </button>
                <button
                  onClick={executeGenerate}
                  className="flex-1 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles size={15} />
                  生成する
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
