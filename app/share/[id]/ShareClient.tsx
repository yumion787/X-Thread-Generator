"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check, Sparkles, ExternalLink } from "lucide-react";

interface Post {
  index: number;
  content: string;
}

interface Thread {
  id: string;
  url: string;
  posts: Post[];
  created_at: string;
}

export function ShareClient({ thread }: { thread: Thread }) {
  const [copiedAll, setCopiedAll] = useState(false);

  async function handleCopyAll() {
    const all = thread.posts.map((p) => p.content).join("\n\n");
    await navigator.clipboard.writeText(all);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  }

  const formattedDate = new Date(thread.created_at).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ヘッダー */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 font-bold text-gray-900 text-sm hover:opacity-80 transition-opacity"
          >
            <Sparkles size={16} className="text-blue-500" />
            X Thread Generator
          </Link>
          <Link
            href="/"
            className="text-sm text-blue-500 hover:text-blue-700 font-medium transition-colors"
          >
            自分も作ってみる →
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        {/* メタ情報 */}
        <div className="text-center mb-8">
          <p className="text-xs text-gray-400 mb-2">{formattedDate} に生成</p>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            AIが生成したXスレッド
          </h1>
          <a
            href={thread.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-blue-500 hover:text-blue-700 transition-colors"
          >
            <ExternalLink size={13} />
            元のブログ記事を読む
          </a>
        </div>

        {/* ポスト一覧 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700">
              {thread.posts.length}件のポスト
            </h2>
            <button
              onClick={handleCopyAll}
              className="text-xs text-blue-500 hover:text-blue-700 font-medium transition-colors cursor-pointer flex items-center gap-1"
            >
              {copiedAll ? (
                <>
                  <Check size={12} />
                  コピーしました！
                </>
              ) : (
                <>
                  <Copy size={12} />
                  全てコピー
                </>
              )}
            </button>
          </div>

          {thread.posts.map((post) => (
            <SharePost key={post.index} index={post.index} content={post.content} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 p-8">
            <h3 className="font-bold text-gray-900 text-lg mb-2">
              あなたのブログ記事もスレッドに変換しませんか？
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              URLを貼るだけで、AIが5秒でXスレッドを自動生成します。
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white px-8 py-3.5 text-sm font-bold transition-colors shadow-lg shadow-blue-500/20"
            >
              <Sparkles size={15} />
              無料ではじめる
            </Link>
            <p className="text-xs text-gray-400 mt-3">
              Googleアカウントでログイン後、無料クレジット3回分をプレゼント
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-4 bg-white mt-8">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-3 text-xs text-gray-400">
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
            <Link href="/terms" className="hover:text-gray-600 transition-colors">利用規約</Link>
            <span className="text-gray-200">|</span>
            <Link href="/privacy" className="hover:text-gray-600 transition-colors">プライバシーポリシー</Link>
            <span className="text-gray-200">|</span>
            <Link href="/legal" className="hover:text-gray-600 transition-colors">特定商取引法に基づく表記</Link>
          </div>
          <p>&copy; {new Date().getFullYear()} X Thread Generator</p>
        </div>
      </footer>
    </div>
  );
}

function SharePost({ index, content }: { index: number; content: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
      <div className="flex items-start gap-3">
        <span className="shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold mt-1">
          {index}
        </span>
        <p className="flex-1 text-sm text-gray-800 leading-relaxed whitespace-pre-line">
          {content}
        </p>
      </div>
      <div className="flex items-center justify-between mt-3">
        <span className={`text-xs ${content.length > 140 ? "text-red-500" : "text-gray-400"}`}>
          {content.length} / 140文字
        </span>
        <button
          onClick={handleCopy}
          className="text-xs text-gray-400 hover:text-blue-500 transition-colors px-2 py-1 rounded hover:bg-blue-50 cursor-pointer flex items-center gap-1"
        >
          {copied ? <><Check size={12} />済み</> : <><Copy size={12} />コピー</>}
        </button>
      </div>
    </div>
  );
}
