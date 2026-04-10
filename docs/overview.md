# X Thread Generator - サービス概要

## サービスについて

ブログ記事のURLを入力するだけで、X（Twitter）用のスレッド投稿を自動生成するSaaSサービス。

- **サービス名**: X Thread Generator
- **URL**: https://x-thread-ai.com
- **ターゲット**: ブログを書いている20〜30代のキャリア・発信系コンテンツクリエイター

## 解決する課題

| 課題 | 解決策 |
|------|--------|
| 記事を140文字に収める調整が手間 | AIが自動で文字数を最適化 |
| ChatGPTへのプロンプトを毎回考える必要がある | プロンプト不要、URLを貼るだけ |
| ブログを書いた後に宣伝まで手が回らない | 5秒でXスレッドが完成 |

## ビジネスモデル

- **無料枠**: 新規登録で3クレジットを付与
- **課金**: ¥300 / 10クレジット（Stripe決済）
- **消費**: スレッド生成1回につき1クレジット

## 技術スタック

| カテゴリ | 採用技術 |
|----------|---------|
| フロントエンド | Next.js 16 / React 19 / TypeScript / Tailwind CSS v4 |
| 認証 | Supabase Auth（Google OAuth 2.0） |
| データベース | Supabase PostgreSQL（RLS対応） |
| AI生成 | Anthropic Claude Sonnet 4.6 |
| スクレイピング | Cheerio |
| 決済 | Stripe（一回払い） |
| 分析 | Google Analytics 4（`@next/third-parties`） |
| デプロイ | Vercel |
