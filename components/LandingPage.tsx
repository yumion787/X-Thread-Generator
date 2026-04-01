"use client";

import Link from "next/link";
import { Sparkles, Zap, Brain, AlignLeft, ArrowDown, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";


interface LandingPageProps {
  url: string;
  setUrl: (url: string) => void;
  onLoginClick: () => void;
  onBuyClick: () => void;
  buyLoading: boolean;
}

export function LandingPage({ url, setUrl, onLoginClick, onBuyClick, buyLoading }: LandingPageProps) {
  const { user } = useAuth();

  function handleHeroSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (url) localStorage.setItem("pending_url", url);
    onLoginClick();
  }

  return (
    <div className="flex flex-col">
      {/* ① HERO */}
      <section className="relative overflow-hidden bg-gray-950 text-white">
        <div className="absolute inset-0 bg-linear-to-br from-blue-950 via-gray-950 to-gray-950 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-100 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-4 pt-20 pb-16 sm:pt-28 sm:pb-24 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium px-3 py-1.5 rounded-full mb-8">
            <Sparkles size={12} />
            AIがXスレッドを自動生成
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight tracking-tight mb-4">
            ブログを書いたら、
            <br />
            <span className="text-blue-400">5秒でXへ。</span>
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl mb-12">
            URLを貼るだけでスレッド完成。
          </p>

          <form onSubmit={handleHeroSubmit} className="max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/your-article"
                required
                className="flex-1 rounded-xl border border-gray-700 bg-gray-900 px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="rounded-xl bg-blue-500 hover:bg-blue-400 text-white px-6 py-3.5 text-sm font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Sparkles size={15} />
                無料ではじめる
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Googleアカウントでログイン後、無料クレジット3回分をプレゼント
            </p>
          </form>
        </div>

        <div className="relative flex justify-center pb-8 text-gray-700 animate-bounce">
          <ArrowDown size={20} />
        </div>
      </section>

      {/* ② PAIN POINTS */}
      <section className="bg-slate-50 py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-4">Pain Points</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            ブログを書き終えた後のX宣伝、<br className="hidden sm:block" />
            ぶっちゃけ面倒じゃないですか？
          </h2>
          <p className="text-gray-500 text-sm sm:text-base mb-12">
            せっかく良い記事を書いても、宣伝まで手が回らない。そんな悩みを解決します。
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                emoji: "😩",
                title: "140文字の壁",
                desc: "長い記事を140文字に収める調整作業に、毎回30分以上かけていませんか？",
              },
              {
                emoji: "🤯",
                title: "プロンプト地獄",
                desc: "「いい感じにして」では伝わらない。ChatGPTへの指示を考えるのが、もはや本業に。",
              },
              {
                emoji: "⏰",
                title: "宣伝まで手が回らない",
                desc: "記事を書き終えた達成感で力尽きて、結局そのまま埋もれていく。",
              },
            ].map(({ emoji, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl border border-gray-200 p-6 text-left shadow-sm">
                <div className="text-3xl mb-3">{emoji}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ③ FEATURES */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-4">Features</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-12">
            3つの強みで、あなたの発信を加速する
          </h2>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: <Zap size={22} className="text-blue-500" />,
                title: "圧倒的なタイパ",
                desc: "URLを貼ってボタンを押すだけ。手動で20分かかる作業が5秒で終わります。",
              },
              {
                icon: <Brain size={22} className="text-blue-500" />,
                title: "プロンプト不要",
                desc: "Xのトレンドを学習済み。AIへの指示を考える必要すらありません。",
              },
              {
                icon: <AlignLeft size={22} className="text-blue-500" />,
                title: "140文字の壁を突破",
                desc: "独自アルゴリズムで、Xに最適な文字数と構成を自動調整します。",
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="rounded-2xl bg-blue-50 border border-blue-100 p-6 text-left">
                <div className="w-10 h-10 rounded-xl bg-white border border-blue-100 flex items-center justify-center mb-4 shadow-sm">
                  {icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ④ COMPARISON */}
      <section className="bg-slate-50 py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-4">Comparison</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-12">
            他の方法との違い
          </h2>

          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-5 py-4 text-left font-semibold text-gray-500 w-1/4">比較項目</th>
                  <th className="px-5 py-4 text-center font-semibold text-gray-500">自力</th>
                  <th className="px-5 py-4 text-center font-semibold text-gray-500">ChatGPT</th>
                  <th className="px-5 py-4 text-center font-bold text-blue-600 bg-blue-50/50">X Thread Generator</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "作業時間", self: "20〜30分", chatgpt: "5〜10分", xtg: "約5秒", highlight: true },
                  { label: "手軽さ", self: "URL→手作業で要約", chatgpt: "プロンプトを毎回考える", xtg: "URLを貼るだけ", highlight: true },
                  { label: "X最適化", self: "△ 自分で調整", chatgpt: "△ 指示次第", xtg: "◎ 自動で最適化", highlight: true },
                  { label: "コスト", self: "無料（時間コスト大）", chatgpt: "月$20〜", xtg: "¥300 / 10回", highlight: false },
                ].map(({ label, self, chatgpt, xtg, highlight }) => (
                  <tr key={label} className="border-b border-gray-100 last:border-0">
                    <td className="px-5 py-4 text-left font-medium text-gray-700">{label}</td>
                    <td className="px-5 py-4 text-center text-gray-500">{self}</td>
                    <td className="px-5 py-4 text-center text-gray-500">{chatgpt}</td>
                    <td className={`px-5 py-4 text-center font-semibold bg-blue-50/50 ${highlight ? "text-blue-600" : "text-gray-700"}`}>
                      {xtg}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ⑤ PRICING */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-4">Pricing</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">シンプルな料金体系</h2>
          <p className="text-gray-500 text-sm mb-12">まずは無料枠でお試しください。気に入ったら追加購入できます。</p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <div className="flex-1 max-w-xs mx-auto sm:mx-0 rounded-2xl border border-gray-200 p-8 text-left shadow-sm">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">無料</p>
              <p className="text-3xl font-extrabold text-gray-900 mb-1">¥0</p>
              <p className="text-sm text-gray-500 mb-6">新規登録特典</p>
              <ul className="space-y-2 text-sm text-gray-600 mb-8">
                <li className="flex items-center gap-2"><Check size={14} className="text-green-500 shrink-0" />3回分のクレジット</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-green-500 shrink-0" />全機能が使える</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-green-500 shrink-0" />クレジットカード不要</li>
              </ul>
              <button
                onClick={onLoginClick}
                className="w-full rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 text-sm transition-colors cursor-pointer"
              >
                無料ではじめる
              </button>
            </div>

            <div className="flex-1 max-w-xs mx-auto sm:mx-0 rounded-2xl border-2 border-blue-500 p-8 text-left shadow-lg relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                ベータ版特別価格
              </div>
              <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-2">追加購入</p>
              <div className="flex items-baseline gap-1 mb-1">
                <p className="text-3xl font-extrabold text-gray-900">¥300</p>
                <p className="text-sm text-gray-500">/ 10回分</p>
              </div>
              <p className="text-sm text-gray-500 mb-6">1回あたり30円</p>
              <ul className="space-y-2 text-sm text-gray-600 mb-8">
                <li className="flex items-center gap-2"><Check size={14} className="text-blue-500 shrink-0" />クレジット10回分を即時付与</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-blue-500 shrink-0" />使い切ったら追加購入OK</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-blue-500 shrink-0" />Stripeによる安全な決済</li>
              </ul>
              <button
                onClick={onBuyClick}
                disabled={buyLoading}
                className="w-full rounded-xl bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-3 text-sm transition-colors cursor-pointer"
              >
                {buyLoading ? "移動中..." : "購入する"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-4 bg-white">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-3 text-xs text-gray-400">
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
