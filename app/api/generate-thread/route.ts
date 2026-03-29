import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import * as cheerio from "cheerio";

const client = new Anthropic();

async function fetchPageContent(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; ThreadGeneratorBot/1.0)",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // Remove non-content elements
  $("script, style, nav, header, footer, aside, .sidebar, .ads, .advertisement").remove();

  // Extract main content from article, main, or body
  let content = $("article").text();
  if (!content.trim()) content = $("main").text();
  if (!content.trim()) content = $("body").text();

  // Normalize whitespace
  return content.replace(/\s+/g, " ").trim().slice(0, 8000);
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URLが必要です" }, { status: 400 });
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "無効なURLです" }, { status: 400 });
    }

    const articleContent = await fetchPageContent(url);

    if (!articleContent || articleContent.length < 100) {
      return NextResponse.json(
        { error: "記事の内容を取得できませんでした" },
        { status: 422 }
      );
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `以下のブログ記事を読んで、X（Twitter）用の連投スレッドを作成してください。

【記事内容】
${articleContent}

【ターゲット】
20〜30代のキャリアや将来のお金に不安を感じている社会人

【トーン・スタイル】
- 有益で親しみやすい（ですます調）
- 難しい専門用語は使わず、噛み砕いた表現に置き換える
  例）社会保険料 → 「手取りが減る理由」、インフレ → 「物価が上がる」 など

【構成ルール】
1. 1枚目（フック）：「逆説」や「具体的な数字」を使い、20〜30代の不安や好奇心に直接刺さる一文で始める
   例）「頑張って昇給しても、手取りが増えない理由があります」「給料が上がるほど損をする人が増えています」
2. 2〜8枚目（本文）：記事の核心を1ポストに1トピックで展開する
3. 最後から2枚目（まとめ）：行動を促す一言を入れる
4. 最後の1枚：記事URLへ誘導する一文 ＋ ハッシュタグ2〜3個
   誘導文例）「詳しくはこちら👇」「全部読みたい方はこちら👇」

【フォーマットルール】
- 全体で5〜10ポスト
- 1ポストは最大140文字以内
- スマホで読みやすいよう、2〜3行ごとに空行（\\n\\n）を入れる
- 各ポストは独立して読んでも意味が通るようにする
- 最後のポストの誘導URLは必ず「${url}」を使う

【出力形式】
以下のJSON形式のみで出力してください（他のテキストは一切不要）：
{
  "posts": [
    {"index": 1, "content": "ポスト内容"},
    {"index": 2, "content": "ポスト内容"}
  ]
}`,
        },
      ],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "AIの応答をパースできませんでした" },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Error generating thread:", error);
    const message = error instanceof Error ? error.message : "不明なエラー";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
