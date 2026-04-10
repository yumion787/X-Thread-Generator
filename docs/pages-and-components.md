# ページ・コンポーネント一覧

## ページ一覧

| URL | ファイル | 種類 | 概要 |
|-----|---------|------|------|
| `/` | `app/page.tsx` | Client | 認証状態で LandingPage / Generator を切り替え |
| `/history` | `app/history/page.tsx` | Server | 履歴一覧（未認証時は `/` にリダイレクト） |
| `/terms` | `app/terms/page.tsx` | Static | 利用規約 |
| `/privacy` | `app/privacy/page.tsx` | Static | プライバシーポリシー |
| `/legal` | `app/legal/page.tsx` | Static | 特定商取引法に基づく表記 |
| `/auth/callback` | `app/auth/callback/route.ts` | API | OAuth認証コールバック |

## API エンドポイント

| メソッド | URL | ファイル | 概要 |
|---------|-----|---------|------|
| POST | `/api/generate-thread` | `app/api/generate-thread/route.ts` | AIスレッド生成 |
| POST | `/api/stripe/checkout` | `app/api/stripe/checkout/route.ts` | 決済セッション作成 |
| POST | `/api/stripe/webhook` | `app/api/stripe/webhook/route.ts` | 決済完了Webhook |

---

## コンポーネント一覧

### Header.tsx

**役割**: 全ページ共通ヘッダー

| 状態 | 表示内容 |
|------|---------|
| ロード中 | スケルトンUI（hydrationミスマッチ防止） |
| 未認証 | Googleログインボタン |
| 認証済み（md以上） | クレジットバッジ + アバター + ドロップダウン |
| 認証済み（md未満） | アバター + ドロップダウン（クレジットは非表示） |

**ドロップダウン内容**:
1. ユーザー名（truncate）
2. クレジット残数（残数≤1で購入ボタン表示）
3. 生成履歴へのリンク
4. ログアウトボタン（確認ダイアログ付き）

**Props**: `onLoginClick: () => void`, `onBuyClick: () => void`

---

### Generator.tsx

**役割**: ログイン済みユーザー向けスレッド生成画面

**機能**:
- URLフォーム入力 + 「生成する」ボタン
- クレジット切れ警告バナー（購入ボタン付き）
- ローディングスピナー
- エラーメッセージ
- 生成結果の一覧表示（`EditablePost` のリスト）
- 「全てコピー」ボタン
- フッター

**Props**: `url`, `setUrl`, `onBuyClick`, `buyLoading`

---

### LandingPage.tsx

**役割**: 未認証ユーザー向けランディングページ

**セクション構成**:
1. **Hero**: ダークテーマ、メインコピー、URLフォーム（送信するとログイン誘導）
2. **Pain Points**: 3カード（140文字の壁 / プロンプト地獄 / 宣伝まで手が回らない）
3. **Features**: 3カード（タイパ / プロンプト不要 / 140文字最適化）
4. **Comparison**: 比較表（自力 / ChatGPT / 本サービス）
5. **Pricing**: 料金2プラン（¥0 / ¥300）
6. **Footer**: 法的リンク + コピーライト

**Props**: `url`, `setUrl`, `onLoginClick`, `onBuyClick`, `buyLoading`

---

### LoginModal.tsx

**役割**: Googleログインのモーダル

**表示内容**:
- Googleログインボタン
- 「初回ログインで3回分無料」の説明文

**Props**: `isOpen: boolean`, `onClose: () => void`

---

### CreditBadge.tsx

**役割**: ヘッダーに表示するクレジット残数バッジ

| 残数 | 表示 |
|------|------|
| 2以上 | 青色バッジ「残り N 回」 |
| 1以下 | 赤色バッジ「残り N 回」+ 「購入する」リンク |

**Props**: `credits: number | null`, `onBuy: () => void`

---

### EditablePost.tsx

**役割**: 個別ポストの表示・編集・コピー

**機能**:
- インデックス番号バッジ（青丸）
- textarea（動的行数 = `text.split("\n").length + 1`、最低3行）
- 文字数カウンター（140文字超過で赤色）
- 個別コピーボタン（コピー後2秒間「済み」表示）

**Props**: `index: number`, `content: string`

---

### HistoryClient.tsx（app/history/）

**役割**: 履歴ページのクライアント側UI

**コンポーネント構造**:
```
HistoryClient
└── ThreadCard（1スレッドにつき1つ）
    ├── アコーディオントグル（ホスト名・URL・日時・件数）
    ├── 削除ボタン（Trash2アイコン）
    └── 展開時
        ├── EditablePost × N
        └── 「このURLで再生成」アウトラインボタン
```

**機能**:
- スレッド削除: confirm → Supabase delete → 楽観的State更新
- 再生成: `router.push('/?url=...')` で Generator に遷移

---

## AuthContext / useAuth

**ファイル**: `contexts/AuthContext.tsx` / `hooks/useAuth.ts`

```typescript
const { user, credits, loading, signIn, signOut, refreshCredits } = useAuth();
```

| プロパティ | 型 | 説明 |
|-----------|------|------|
| `user` | `User \| null` | Supabase ユーザーオブジェクト |
| `credits` | `number \| null` | クレジット残数 |
| `loading` | `boolean` | 認証確認中フラグ |
| `signIn()` | `() => Promise<void>` | Google OAuth ログイン |
| `signOut()` | `() => Promise<void>` | ログアウト + `/` リダイレクト |
| `refreshCredits()` | `() => void` | DBから最新クレジットを再取得 |

**使用場所**:
- `components/Header.tsx`
- `components/Generator.tsx`
- `components/LoginModal.tsx`
- `app/page.tsx`（認証分岐）
