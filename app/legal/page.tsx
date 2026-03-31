import Link from "next/link";

export const metadata = {
  title: "特定商取引法に基づく表記 | X Thread Generator",
};

const items: { label: string; value: string }[] = [
  { label: "事業者名", value: "yumionblog" },
  { label: "運営責任者", value: "yumion" },
  { label: "所在地", value: "請求があった場合に遅滞なく開示いたします" },
  { label: "電話番号", value: "請求があった場合に遅滞なく開示いたします" },
  { label: "メールアドレス", value: "service.yumion@gmail.com" },
  { label: "販売URL", value: "https://x-thread-ai.com" },
  {
    label: "販売価格",
    value: "クレジット10回分：¥300（税込）\n※価格は予告なく変更する場合があります。",
  },
  {
    label: "代金の支払い方法",
    value: "クレジットカード（Visa / Mastercard / American Express / JCB）\n※Stripeによる決済処理",
  },
  {
    label: "代金の支払い時期",
    value: "購入手続き完了時に即時決済",
  },
  {
    label: "商品・サービスの引渡し時期",
    value: "決済完了後、即時にクレジットをアカウントへ付与",
  },
  {
    label: "返品・キャンセルについて",
    value:
      "デジタルコンテンツ（クレジット）の性質上、購入完了後の返品・返金・キャンセルはお受けできません。\nただし、当方の責に帰すべき事由により正常にクレジットが付与されなかった場合は、個別に対応いたします。",
  },
  {
    label: "動作環境",
    value:
      "インターネット接続環境が必要です。推奨ブラウザ：Chrome / Safari / Firefox / Edge（各最新版）",
  },
];

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/" className="text-sm text-blue-500 hover:text-blue-700 transition-colors">
            ← トップへ戻る
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">特定商取引法に基づく表記</h1>
        <p className="text-xs text-gray-400 mb-8">
          <span className="text-gray-500 font-medium">特定商取引法に基づき、サービスに関する重要事項をご案内いたします。</span>
        </p>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {items.map(({ label, value }, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <th className="text-left align-top font-medium text-gray-600 px-5 py-4 w-36 sm:w-44 shrink-0 border-b border-gray-100">
                    {label}
                  </th>
                  <td className="align-top text-gray-800 px-5 py-4 border-b border-gray-100 whitespace-pre-line">
                    {value.includes("[") ? (
                      <span className="text-amber-600">{value}</span>
                    ) : (
                      value
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-gray-400 mt-6 text-center">
          制定日：2026年4月1日
        </p>
      </div>
    </div>
  );
}
