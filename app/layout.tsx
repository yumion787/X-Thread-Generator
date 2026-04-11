import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "X Thread Generator | ブログ記事からXスレッドを5秒で自動生成",
    template: "%s | X Thread Generator",
  },
  description:
    "ブログ記事のURLを貼るだけで、AIがX（Twitter）用のスレッド投稿を自動生成。プロンプト不要・140文字最適化・約5秒で完成。無料で3回お試しいただけます。",
  keywords: [
    "ブログ Xスレッド 変換",
    "ブログ Twitter 宣伝 自動化",
    "X スレッド 自動生成",
    "ブログ SNS 拡散",
    "Twitter スレッド 作成 ツール",
    "AI ブログ要約",
    "X投稿 自動化",
    "ブログ記事 Twitter投稿",
  ],
  openGraph: {
    title: "X Thread Generator | ブログを書いたら、5秒でXへ。",
    description:
      "URLを貼るだけでAIがXスレッドを自動生成。プロンプト不要で140文字に最適化。無料で3回お試しいただけます。",
    type: "website",
    locale: "ja_JP",
    siteName: "X Thread Generator",
  },
  twitter: {
    card: "summary_large_image",
    title: "X Thread Generator | ブログを書いたら、5秒でXへ。",
    description:
      "URLを貼るだけでAIがXスレッドを自動生成。プロンプト不要で140文字に最適化。無料で3回お試しいただけます。",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "X Thread Generator",
              description:
                "ブログ記事のURLを貼るだけで、AIがX（Twitter）用のスレッド投稿を自動生成するツール",
              applicationCategory: "UtilityApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "JPY",
                description: "無料で3回お試し。追加は¥300/10回",
              },
            }),
          }}
        />
      </body>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </html>
  );
}
