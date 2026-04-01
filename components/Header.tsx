"use client";

import { useSyncExternalStore, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { LogOut, History, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { CreditBadge } from "@/components/CreditBadge";

// SSRではfalse、クライアントではtrueを返すことでhydrationミスマッチを防ぐ
function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

interface HeaderProps {
  onLoginClick: () => void;
  onBuyClick: () => void;
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function Avatar({ avatarUrl, name }: { avatarUrl?: string; name?: string }) {
  const initial = (name ?? "?")[0].toUpperCase();

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name ?? "avatar"}
        className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200"
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div className="w-8 h-8 rounded-full bg-blue-500 text-white text-sm font-bold flex items-center justify-center ring-2 ring-gray-200">
      {initial}
    </div>
  );
}

export function Header({ onLoginClick, onBuyClick }: HeaderProps) {
  const { user, credits, loading, signOut } = useAuth();
  const mounted = useIsMounted();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const name = (user?.user_metadata?.full_name ?? user?.email) as string | undefined;

  // ドロップダウン外クリックで閉じる
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="relative z-10 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1.5 font-bold text-gray-900 text-sm hover:opacity-80 transition-opacity"
        >
          <XIcon className="w-4 h-4" />
          Thread Generator
        </Link>

        <div className="flex items-center gap-3">
          {!mounted || loading ? (
            <div className="h-8 w-24 bg-gray-200 rounded-lg animate-pulse" />
          ) : user ? (
            <>
              {/* md以上のみ: クレジットバッジ */}
              <div className="hidden md:block">
                <CreditBadge credits={credits} onBuy={onBuyClick} />
              </div>

              {/* アバター + ドロップダウン */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-1 cursor-pointer rounded-full focus:outline-none"
                  aria-expanded={dropdownOpen}
                >
                  <Avatar avatarUrl={avatarUrl} name={name} />
                  <ChevronDown
                    size={14}
                    className={`text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-gray-200 shadow-lg py-1 z-50">
                    {/* ユーザー名 */}
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs font-medium text-gray-700 truncate">{name}</p>
                    </div>

                    {/* クレジット */}
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">クレジット残数</p>
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm font-semibold ${
                            credits !== null && credits <= 1 ? "text-red-500" : "text-gray-800"
                          }`}
                        >
                          {credits ?? "-"} 回
                        </span>
                        {credits !== null && credits <= 1 && (
                          <button
                            onClick={() => { setDropdownOpen(false); onBuyClick(); }}
                            className="text-xs text-blue-500 hover:text-blue-700 font-medium cursor-pointer"
                          >
                            購入する
                          </button>
                        )}
                      </div>
                    </div>

                    {/* 履歴 */}
                    <Link
                      href="/history"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <History size={14} className="text-gray-400" />
                      生成履歴
                    </Link>

                    {/* ログアウト */}
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        if (window.confirm("ログアウトしますか？")) signOut();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <LogOut size={14} className="text-gray-400" />
                      ログアウト
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button
              onClick={onLoginClick}
              className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium px-3 py-1.5 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <GoogleIcon />
              <span className="hidden sm:inline">Googleでログイン</span>
              <span className="sm:hidden">ログイン</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
