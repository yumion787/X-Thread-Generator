"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/Header";
import { LoginModal } from "@/components/LoginModal";
import { LandingPage } from "@/components/LandingPage";
import { Generator } from "@/components/Generator";

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

    const pendingUrl = localStorage.getItem("pending_url");
    if (pendingUrl) {
      onUrl(pendingUrl);
      localStorage.removeItem("pending_url");
    }
  }, [searchParams]);

  return null;
}

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [url, setUrl] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);
  const [toast, setToast] = useState("");

  function showToast(msg: string, ms: number) {
    setToast(msg);
    setTimeout(() => setToast(""), ms);
  }

  async function handleBuy() {
    setBuyLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      showToast("決済ページへの遷移に失敗しました", 3000);
    } finally {
      setBuyLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header onLoginClick={() => setShowLoginModal(true)} onBuyClick={handleBuy} />

      {/* 認証ロード中はスケルトンを表示 */}
      {authLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin" />
        </div>
      ) : user ? (
        <Generator url={url} setUrl={setUrl} onBuyClick={handleBuy} buyLoading={buyLoading} />
      ) : (
        <LandingPage
          url={url}
          setUrl={setUrl}
          onLoginClick={() => setShowLoginModal(true)}
          onBuyClick={handleBuy}
          buyLoading={buyLoading}
        />
      )}

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

      <Suspense>
        <SearchParamsHandler onToast={showToast} onUrl={setUrl} />
      </Suspense>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-5 py-3 rounded-full shadow-lg z-50 whitespace-nowrap">
          {toast}
        </div>
      )}
    </div>
  );
}
