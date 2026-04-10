# アーキテクチャ

## ディレクトリ構成

```
posts-from-blog/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # トップページ（認証分岐のオーケストレーター）
│   ├── layout.tsx                # ルートレイアウト（AuthProvider / GA4）
│   ├── globals.css
│   ├── api/
│   │   ├── generate-thread/route.ts   # AIスレッド生成
│   │   └── stripe/
│   │       ├── checkout/route.ts      # 決済セッション作成
│   │       └── webhook/route.ts       # 決済完了Webhook
│   ├── auth/callback/route.ts    # OAuth認証コールバック
│   ├── history/
│   │   ├── page.tsx              # サーバーコンポーネント（認証・データ取得）
│   │   └── HistoryClient.tsx     # クライアントコンポーネント（UI）
│   ├── terms/page.tsx
│   ├── privacy/page.tsx
│   └── legal/page.tsx
├── components/
│   ├── Header.tsx
│   ├── Generator.tsx             # ログイン済み時の生成画面
│   ├── LandingPage.tsx           # 未ログイン時のLP
│   ├── LoginModal.tsx
│   ├── CreditBadge.tsx
│   └── EditablePost.tsx
├── contexts/
│   └── AuthContext.tsx           # グローバル認証ステート（Provider + useAuth）
├── hooks/
│   └── useAuth.ts                # AuthContext の re-export
├── lib/
│   ├── stripe.ts
│   └── supabase/
│       ├── client.ts             # ブラウザ用クライアント
│       └── server.ts             # サーバー用クライアント（Cookie管理）
├── middleware.ts                 # セッション更新（全リクエスト）
└── docs/                         # ドキュメント（ソースに影響なし）
```

---

## 認証フロー

```
[ユーザー] Googleでログイン クリック
    ↓
AuthContext.signIn()
    ↓
supabase.auth.signInWithOAuth({ provider: "google" })
    ↓
[Google] 認可画面 → 承認
    ↓
[/auth/callback] exchangeCodeForSession(code)
    ↓
Supabase がセッション確立（Cookie保存）
    ↓
[/] にリダイレクト
    ↓
middleware.ts: supabase.auth.getUser() でセッション更新
    ↓
AuthContext: user / credits を取得して State 更新
```

---

## スレッド生成フロー

```
[Generator] URL入力 → 送信
    ↓
POST /api/generate-thread
    ↓
1. 認証チェック（401）
2. URL バリデーション（400）
3. クレジット残高確認
4. fetchPageContent(url)  ← Cheerio でHTML解析・テキスト抽出
5. 文字数チェック（200文字未満 → 422）
6. consume_credit RPC    ← アトミックに1消費
7. Claude API 呼び出し
8. JSON解析
9. 失敗時はクレジット返還
10. threads テーブルに保存
    ↓
[Generator] posts を表示（EditablePost）
    ↓
refreshCredits() でクレジット即時更新
```

---

## 決済フロー

```
[ユーザー] 購入ボタン クリック
    ↓
POST /api/stripe/checkout
    ↓
stripe.checkout.sessions.create({
  line_items: [STRIPE_PRICE_ID],  // ¥300 / 10回
  metadata: { user_id }
})
    ↓
Stripe ホスト決済ページへリダイレクト
    ↓
[ユーザー] カード入力 → 決済
    ↓
POST /api/stripe/webhook  ← Stripe から非同期通知
    ↓
署名検証 → checkout.session.completed
    ↓
add_credits RPC（+10クレジット、Service Role でRLSバイパス）
    ↓
[ユーザー] /?payment=success にリダイレクト
    ↓
SearchParamsHandler: トースト表示 + refreshCredits()
```

---

## 状態管理

### AuthContext（グローバル）

```typescript
{
  user: User | null,      // Supabase ユーザー
  credits: number | null, // クレジット残数
  loading: boolean,       // 認証ロード中フラグ
  signIn(),
  signOut(),
  refreshCredits()
}
```

- `AuthProvider` を `layout.tsx` に配置し全ページで共有
- `refreshCredits()` を呼ぶと `profiles` テーブルから最新値を取得し全コンポーネントが即時更新

### ローカルステート

各コンポーネントが独自に管理:
- `Generator`: `posts` / `loading` / `error` / `copiedAll`
- `HistoryClient`: `threads`（楽観的更新）
- `Header`: `dropdownOpen`

---

## データベース構成（Supabase）

### テーブル

**profiles**
| カラム | 型 | 説明 |
|--------|------|------|
| id | UUID | auth.users.id と一致 |
| credits | INTEGER | クレジット残数（初期値: 3） |
| created_at | TIMESTAMPTZ | 作成日時 |

**threads**
| カラム | 型 | 説明 |
|--------|------|------|
| id | UUID | スレッドID（gen_random_uuid） |
| user_id | UUID | profiles.id への外部キー |
| url | TEXT | 元記事URL |
| posts | JSONB | `[{"index": N, "content": "..."}]` |
| created_at | TIMESTAMPTZ | 生成日時 |

### RLS ポリシー

| テーブル | 操作 | 条件 |
|---------|------|------|
| profiles | SELECT / UPDATE | `auth.uid() = id` |
| threads | SELECT / INSERT / DELETE | `auth.uid() = user_id` |

### RPC関数

**consume_credit(p_user_id)**
- `credits > 0` の場合のみ `-1`（アトミック）
- 新しい残高を返す（更新されなければ NULL）

**add_credits(p_user_id, p_amount)**
- credits に +amount
- Stripe Webhook から Service Role で呼び出し

### トリガー

**on_auth_user_created**
- `auth.users` への INSERT 後に発火
- `profiles` に `credits = 3` でレコードを自動作成

---

## セキュリティ

| 対策 | 内容 |
|------|------|
| 認証 | Supabase Auth + Google OAuth（パスワード不要） |
| 認可 | Supabase RLS（全テーブル有効） |
| Webhook | Stripe 署名検証（`constructEvent`） |
| Service Role | サーバーサイドのみで使用、クライアントに露出しない |
| クレジット競合 | RPC でアトミック処理 |
| 個人情報 | Claude API には記事本文のみ送信（個人情報なし） |
| 決済情報 | Stripe 管理（PCI DSS準拠）、自サーバー非保持 |

---

## 環境変数

| 変数名 | 用途 | 公開 |
|--------|------|------|
| `ANTHROPIC_API_KEY` | Claude API | サーバーのみ |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL | クライアント公開 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名キー | クライアント公開 |
| `SUPABASE_SERVICE_ROLE_KEY` | RLSバイパス用 | サーバーのみ |
| `STRIPE_SECRET_KEY` | Stripe API | サーバーのみ |
| `STRIPE_WEBHOOK_SECRET` | Webhook署名検証 | サーバーのみ |
| `STRIPE_PRICE_ID` | 商品価格ID | サーバーのみ |
| `NEXT_PUBLIC_APP_URL` | リダイレクト先URL | クライアント公開 |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID | クライアント公開 |
