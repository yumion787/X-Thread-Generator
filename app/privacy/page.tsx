import Link from "next/link";

export const metadata = {
  title: "プライバシーポリシー | X Thread Generator",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/" className="text-sm text-blue-500 hover:text-blue-700 transition-colors">
            ← トップへ戻る
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-8">プライバシーポリシー</h1>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-8 text-sm text-gray-700 leading-relaxed">

          <p>
            X Thread Generator（以下「本サービス」）は、ユーザーの個人情報の取り扱いについて、以下のとおりプライバシーポリシーを定めます。
          </p>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">第1条（取得する情報）</h2>
            <p className="mb-2">本サービスは、以下の情報を取得します。</p>

            <h3 className="font-medium text-gray-800 mt-4 mb-2">■ Google認証で取得する情報</h3>
            <p>Googleアカウントでのログイン時に、Google OAuth 2.0 を通じて以下の情報を取得します。</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
              <li>メールアドレス</li>
              <li>表示名（氏名）</li>
              <li>プロフィール画像のURL</li>
            </ul>
            <p className="mt-2 text-gray-500 text-xs">
              ※ パスワードは取得・保存しません。認証はGoogle側で行われます。
            </p>

            <h3 className="font-medium text-gray-800 mt-4 mb-2">■ 利用データ</h3>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
              <li>生成したスレッドの内容・生成元URL・生成日時</li>
              <li>クレジットの残数・購入履歴</li>
            </ul>

            <h3 className="font-medium text-gray-800 mt-4 mb-2">■ アクセス情報</h3>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
              <li>IPアドレス、ブラウザの種類、アクセス日時などのログ情報</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">第2条（情報の利用目的）</h2>
            <p>取得した情報は、以下の目的にのみ使用します。</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
              <li>ユーザー認証およびアカウント管理</li>
              <li>本サービスの機能提供（スレッド生成・履歴管理・クレジット管理）</li>
              <li>決済処理および購入履歴の管理</li>
              <li>サービスの改善・障害対応</li>
              <li>利用規約違反の調査・対応</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">第3条（第三者への提供）</h2>
            <p>
              本サービスは、以下の場合を除き、ユーザーの個人情報を第三者に提供しません。
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
              <li>ユーザーの同意がある場合</li>
              <li>法令に基づく場合</li>
              <li>人の生命・身体・財産の保護のために必要な場合</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">第4条（利用する外部サービス）</h2>

            <h3 className="font-medium text-gray-800 mt-3 mb-2">■ Supabase（データ保存・認証）</h3>
            <p className="text-gray-600">
              ユーザー情報、生成履歴、クレジット情報の保存にSupabaseを使用しています。
              Supabaseのプライバシーポリシーは
              <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline ml-1">こちら</a>
              をご確認ください。
            </p>

            <h3 className="font-medium text-gray-800 mt-4 mb-2">■ Stripe（決済処理）</h3>
            <p className="text-gray-600">
              クレジットの購入にはStripeを使用しています。クレジットカード番号等の決済情報はStripeが管理し、本サービスのサーバーには保存されません。
              Stripeのプライバシーポリシーは
              <a href="https://stripe.com/jp/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline ml-1">こちら</a>
              をご確認ください。
            </p>

            <h3 className="font-medium text-gray-800 mt-4 mb-2">■ Anthropic（AIテキスト生成）</h3>
            <p className="text-gray-600">
              スレッド生成にAnthropicのClaude APIを使用しています。生成のためにユーザーが入力したURLのページ内容がAPIに送信されます。
              個人情報は送信されません。Anthropicのプライバシーポリシーは
              <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline ml-1">こちら</a>
              をご確認ください。
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">第5条（Cookie・ローカルストレージ）</h2>
            <p>
              本サービスは、セッション管理のためにCookieおよびローカルストレージを使用します。
              ブラウザの設定によりCookieを無効にすることができますが、その場合、本サービスの一部機能が利用できなくなる場合があります。
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">第6条（情報の開示・訂正・削除）</h2>
            <p>
              ユーザーは、自身の個人情報の開示、訂正、削除を請求することができます。
              アカウントを削除することで、保存されているデータは削除されます。
              その他のご要望については、お問い合わせ先までご連絡ください。
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">第7条（プライバシーポリシーの変更）</h2>
            <p>
              本ポリシーの内容は、ユーザーへの通知なく変更することがあります。
              変更後のプライバシーポリシーは、本ページに掲載した時点から効力を生じるものとします。
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">第8条（お問い合わせ）</h2>
            <p>
              本ポリシーに関するお問い合わせは、
              <a
                href="https://x.com/yumion3_enmo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline mx-1"
              >
                X（@yumion3_enmo）
              </a>
              までお願いします。
            </p>
          </section>

          <p className="text-xs text-gray-400 pt-4 border-t border-gray-100">
            制定日：2026年4月1日
          </p>
        </div>
      </div>
    </div>
  );
}
