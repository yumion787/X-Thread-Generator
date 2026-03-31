"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, RefreshCw, Trash2 } from "lucide-react";
import { Header } from "@/components/Header";
import { LoginModal } from "@/components/LoginModal";
import { EditablePost } from "@/components/EditablePost";
import { createClient } from "@/lib/supabase/client";

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

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ThreadCard({
  thread,
  onRegenerate,
  onDelete,
}: {
  thread: Thread;
  onRegenerate: (url: string) => void;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const hostname = (() => {
    try { return new URL(thread.url).hostname; } catch { return thread.url; }
  })();

  function handleDelete() {
    if (window.confirm("本当に削除しますか？")) onDelete(thread.id);
  }

  return (
    <div className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center hover:bg-gray-50 transition-colors">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex-1 flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 text-left cursor-pointer min-w-0"
        >
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{hostname}</p>
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-45 sm:max-w-none">{thread.url}</p>
            <p className="text-xs text-gray-400 mt-0.5">{formatDate(thread.created_at)}</p>
          </div>
          <div className="flex items-center gap-2 ml-3 shrink-0">
            <span className="text-xs text-gray-400">{thread.posts.length}件</span>
            {open ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
          </div>
        </button>
        <button
          onClick={handleDelete}
          className="text-gray-300 hover:text-red-400 transition-colors cursor-pointer p-2 mr-2 sm:mr-3 rounded hover:bg-red-50 shrink-0"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {open && (
        <div className="border-t border-gray-100">
          <div className="px-3 py-2 sm:px-5 space-y-2">
            {thread.posts.map((post) => (
              <EditablePost key={post.index} index={post.index} content={post.content} />
            ))}
          </div>
          <div className="px-3 py-3 sm:px-5 border-t border-gray-100 bg-gray-50">
            <button
              onClick={() => onRegenerate(thread.url)}
              className="flex items-center gap-1.5 text-xs font-medium text-blue-500 border border-blue-300 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw size={12} />
              このURLで再生成
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function HistoryClient({ threads: initialThreads }: { threads: Thread[] }) {
  const router = useRouter();
  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  const [showLoginModal, setShowLoginModal] = useState(false);

  async function handleBuy() {
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  function handleRegenerate(url: string) {
    router.push(`/?url=${encodeURIComponent(url)}`);
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("threads").delete().eq("id", id);
    if (!error) setThreads((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="absolute top-0 left-0 right-0 h-64 bg-linear-to-b from-blue-50 to-transparent pointer-events-none" />

      <Header
        onLoginClick={() => setShowLoginModal(true)}
        onBuyClick={handleBuy}
      />

      <main className="relative flex-1 max-w-2xl mx-auto w-full px-4 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">生成履歴</h1>
          <Link href="/" className="text-sm text-blue-500 hover:text-blue-700 transition-colors font-medium">
            ← 新しく生成する
          </Link>
        </div>

        {threads.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-1">まだ履歴がありません。</p>
            <p className="text-gray-400 text-sm mb-6">まずはスレッドを生成してみましょう！</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              トップページへ
            </Link>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {threads.map((thread) => (
              <ThreadCard
                key={thread.id}
                thread={thread}
                onRegenerate={handleRegenerate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
}
