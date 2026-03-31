import Link from "next/link";

export const metadata = {
  title: "利用規約 | X Thread Generator",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/" className="text-sm text-blue-500 hover:text-blue-700 transition-colors">
            ← トップへ戻る
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-8">利用規約</h1>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-8 text-sm text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">第1条（適用）</h2>
            <p>
              本利用規約（以下「本規約」）は、X Thread Generator（以下「本サービス」）の利用条件を定めるものです。
              ユーザーの皆さまには、本規約に従って本サービスをご利用いただきます。
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">第2条（利用登録）</h2>
            <p>
              本サービスはGoogleアカウントによるOAuth認証を通じて利用登録を行います。
              登録申請者が以下のいずれかに該当する場合、利用登録をお断りすることがあります。
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
              <li>虚偽の事項を届け出た場合</li>
              <li>本規約に違反したことがある者からの申請である場合</li>
              <li>その他、運営者が利用登録を相当でないと判断した場合</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">第3条（クレジットと課金）</h2>
            <p>
              本サービスはクレジット制を採用しており、スレッド生成1回につき1クレジットを消費します。
              新規登録時には3クレジットを無料で付与します。クレジットの追加購入は本サービス内の決済画面から行えます。
              購入済みクレジットの払い戻しは原則としてお断りしています。詳細は特定商取引法に基づく表記をご確認ください。
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">第4条（禁止事項）</h2>
            <p>ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
              <li>法令または公序良俗に違反する行為</li>
              <li>犯罪行為に関連する行為</li>
              <li>著作権・商標権・プライバシーなど第三者の権利を侵害する行為</li>
              <li>本サービスのサーバーやネットワークに過度な負荷をかける行為</li>
              <li>本サービスの運営を妨害するおそれのある行為</li>
              <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
              <li>不正アクセスをし、またはこれを試みる行為</li>
              <li>本サービスを通じて、有害なコンテンツを生成・拡散する行為</li>
              <li>その他、運営者が不適切と判断する行為</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">第5条（本サービスの提供の停止等）</h2>
            <p>
              運営者は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができます。
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
              <li>本サービスにかかるコンピュータシステムの保守点検または更新を行う場合</li>
              <li>地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合</li>
              <li>コンピュータまたは通信回線等が事故により停止した場合</li>
              <li>その他、運営者が本サービスの提供が困難と判断した場合</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">第6条（著作権）</h2>
            <p>
              本サービスによって生成されたコンテンツの著作権は、ユーザーが入力した元記事の著作権者に帰属します。
              ユーザーは、入力するURLの記事について、必要な権利または許諾を有していることを保証するものとします。
              運営者は、生成されたコンテンツに関するいかなる責任も負いません。
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">第7条（免責事項）</h2>
            <p>
              運営者は、本サービスに関して、ユーザーと他のユーザーまたは第三者との間において生じた取引、連絡または紛争等について一切責任を負いません。
              また、本サービスが提供するAI生成コンテンツの正確性・完全性・有用性等について、いかなる保証も行いません。
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">第8条（サービス内容の変更等）</h2>
            <p>
              運営者は、ユーザーに通知することなく、本サービスの内容を変更しまたは本サービスの提供を中止することができるものとし、
              これによってユーザーに生じた損害について一切の責任を負いません。
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">第9条（準拠法・裁判管轄）</h2>
            <p>
              本規約の解釈にあたっては、日本法を準拠法とします。
              本サービスに関して紛争が生じた場合には、運営者の所在地を管轄する裁判所を専属的合意管轄とします。
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
