"use client";

import Link from "next/link";
import { useState } from "react";
import { Sparkles, Zap, Brain, MessageSquare, MessagesSquare, Share2, Palette, ArrowDown, Check, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";


interface LandingPageProps {
  url: string;
  setUrl: (url: string) => void;
  onLoginClick: () => void;
  onBuyClick: () => void;
  buyLoading: boolean;
}

const DEMO_POSTS = [
  { index: 1, content: "「会社員エンジニアの平均年収は約550万円」\n\nでも、フリーランスに転向した人の\n平均は約880万円以上。\nその差、約330万円。\n\n「自分には無理」と思っている方ほど、\nまずこの現実を知ってほしいです。" },
  { index: 2, content: "フリーランスエンジニア市場は今、追い風です📈\n\n市場規模は10年で約1.6倍に拡大。\nしかも企業の約60%が\n「フリーランスをもっと活用したい」と回答。\n\n需要が供給を上回っている、\n今がチャンスです。" },
  { index: 3, content: "独立のタイミングの目安は\n「実務経験3年」です。\n\n経験1年 → 月単価 約37〜40万円\n経験3年 → 月単価 約60〜65万円\n経験5年 → 月単価 80万円以上\n\n3年を境に単価が大きく跳ね上がります。\n焦らず経験を積むのが実は近道です。" },
  { index: 4, content: "独立への最もリスクが低い進め方👇\n\n①自分の市場価値を無料で診断する\n②副業や週末案件で小さく実績を作る\n③開業届・保険・税金の準備を整える\n④エージェントを複数登録して案件獲得\n\n退職前に動くのがポイントです！" },
  { index: 5, content: "フリーランスエンジニアへの\n完全ロードマップを、\n6年の経験をもとにまとめました。\n\n詳しくはこちら👇\nhttps://yumion3blog.com/aim-for-freelance-engineer/\n\n#フリーランスエンジニア #エンジニア転職 #キャリア" },
];

function DemoPost({ index, content }: { index: number; content: string }) {
  return (
    <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-4">
      <div className="flex items-start gap-3">
        <span className="shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold mt-0.5">
          {index}
        </span>
        <p className="flex-1 text-sm text-gray-800 leading-relaxed whitespace-pre-line">{content}</p>
      </div>
    </div>
  );
}

export function LandingPage({ url, setUrl, onLoginClick, onBuyClick, buyLoading }: LandingPageProps) {
  const { user } = useAuth();
  const [showAllPosts, setShowAllPosts] = useState(false);

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
            AIがXの投稿を自動生成
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight tracking-tight mb-4">
            ブログを書いたら、
            <br />
            <span className="text-blue-400">5秒でXへ。</span>
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl mb-4">
            URLを貼るだけ。スレッドも単一ポストも、好みのトーンで。
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-gray-800/50 border border-gray-700/50 px-3 py-1.5 rounded-full">
              <MessagesSquare size={12} className="text-blue-400" />
              スレッド連投
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-gray-800/50 border border-gray-700/50 px-3 py-1.5 rounded-full">
              <MessageSquare size={12} className="text-blue-400" />
              単一ポスト3案
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-gray-800/50 border border-gray-700/50 px-3 py-1.5 rounded-full">
              <Palette size={12} className="text-blue-400" />
              3つのトーン
            </span>
          </div>

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

      {/* ② DEMO — ビフォーアフター */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-4">Demo</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              URLを入れるだけで、この仕上がり
            </h2>
            <p className="text-gray-500 text-sm sm:text-base">
              実際の生成イメージをご覧ください
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 items-start">
            {/* Before — ブログ記事 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Input</span>
                <span className="text-xs text-gray-300">— ブログ記事URL</span>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <div className="flex-1 bg-white rounded-md border border-gray-200 px-3 py-1.5 ml-2">
                    <p className="text-xs text-gray-400 truncate">https://yumion3blog.com/aim-for-freelance-engineer/</p>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-3">フリーランスエンジニアになるには？完全ロードマップ</h3>
                <div className="space-y-2 text-sm text-gray-500 leading-relaxed">
                  <p>会社員エンジニアの平均年収は約550万円。一方、フリーランスに転向した人の平均は約880万円以上——その差は約330万円にもなります。</p>
                  <p>フリーランスエンジニア市場は10年で約1.6倍に拡大しており、企業の約60%が「フリーランスをもっと活用したい」と回答。独立のタイミングや必要なスキル、リスクの低い始め方まで...</p>
                  <p className="text-gray-300">（以下、約5,000文字の記事本文が続く）</p>
                </div>
              </div>
            </div>

            {/* After — 生成されたスレッド */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Output</span>
                <span className="text-xs text-gray-300">— Xスレッド（5投稿）</span>
              </div>
              <div className="space-y-3">
                {(showAllPosts ? DEMO_POSTS : DEMO_POSTS.slice(0, 3)).map((post) => (
                  <DemoPost key={post.index} index={post.index} content={post.content} />
                ))}

                {!showAllPosts && (
                  <button
                    onClick={() => setShowAllPosts(true)}
                    className="w-full flex items-center justify-center gap-1.5 text-sm text-blue-500 hover:text-blue-700 font-medium py-3 rounded-xl border border-dashed border-blue-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors cursor-pointer"
                  >
                    <ChevronDown size={16} />
                    残り{DEMO_POSTS.length - 3}件を表示
                  </button>
                )}
                {showAllPosts && (
                  <button
                    onClick={() => setShowAllPosts(false)}
                    className="w-full flex items-center justify-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 font-medium py-2 transition-colors cursor-pointer"
                  >
                    <ChevronUp size={16} />
                    閉じる
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 text-sm text-gray-500 mb-4">
              <ArrowRight size={14} className="text-blue-500" />
              この変換がわずか5秒。まずは無料で試してみてください。
            </div>
            <div>
              <button
                onClick={onLoginClick}
                className="rounded-xl bg-blue-500 hover:bg-blue-400 text-white px-8 py-3.5 text-sm font-bold transition-colors inline-flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-500/20"
              >
                <Sparkles size={15} />
                無料ではじめる
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ③ FEATURES */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-4">Features</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-12">
            必要な機能が、すべて揃っています
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: <Zap size={22} className="text-blue-500" />,
                title: "5秒で生成完了",
                desc: "URLを貼ってボタンを押すだけ。手動で20分かかる作業が5秒で終わります。",
              },
              {
                icon: <MessagesSquare size={22} className="text-blue-500" />,
                title: "スレッド & 単一ポスト",
                desc: "連投スレッドはもちろん、1投稿で完結するポストも3案まとめて生成。用途に合わせて選べます。",
              },
              {
                icon: <Palette size={22} className="text-blue-500" />,
                title: "3つのトーン選択",
                desc: "カジュアル・ビジネス・煽り系の3トーンから選択。同じ記事でも、雰囲気を変えて何度でも生成できます。",
              },
              {
                icon: <Brain size={22} className="text-blue-500" />,
                title: "プロンプト不要",
                desc: "Xに最適化された文章をAIが自動生成。プロンプトを考える必要はありません。",
              },
              {
                icon: <Share2 size={22} className="text-blue-500" />,
                title: "ワンクリックでシェア",
                desc: "生成したスレッドはシェアリンクで共有OK。チームやSNSで簡単にシェアできます。",
              },
              {
                icon: <MessageSquare size={22} className="text-blue-500" />,
                title: "編集 & コピー",
                desc: "生成後に自分の言葉で微調整して、ワンクリックでクリップボードにコピー。そのままXに投稿できます。",
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
                  { label: "出力形式", self: "1パターン", chatgpt: "指示が必要", xtg: "スレッド＋単一ポスト3案", highlight: true },
                  { label: "トーン選択", self: "×", chatgpt: "△ 毎回指示", xtg: "◎ 3トーンをワンクリック", highlight: true },
                  { label: "シェア機能", self: "×", chatgpt: "×", xtg: "◎ URLで即シェア", highlight: true },
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
                <li className="flex items-center gap-2"><Check size={14} className="text-green-500 shrink-0" />スレッド & 単一ポスト両対応</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-green-500 shrink-0" />3つのトーン選択</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-green-500 shrink-0" />シェアリンク生成</li>
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
                <li className="flex items-center gap-2"><Check size={14} className="text-blue-500 shrink-0" />無料プランと同じ全機能</li>
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
