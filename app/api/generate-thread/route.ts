import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import * as cheerio from "cheerio";
import { createClient } from "@/lib/supabase/server";

const client = new Anthropic();

async function fetchPageContent(url: string): Promise<string> {
  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ThreadGeneratorBot/1.0)",
      },
    });
  } catch {
    throw new Error("URLへの接続に失敗しました。URLが正しいか確認してください。");
  }

  if (response.status === 404) {
    throw new Error("ページが見つかりませんでした（404）。URLが正しいか確認してください。");
  }
  if (response.status === 403) {
    throw new Error("アクセスが拒否されました（403）。このページは取得できません。");
  }
  if (!response.ok) {
    throw new Error(`ページの取得に失敗しました（${response.status}）。URLを確認してください。`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  $("script, style, nav, header, footer, aside, .sidebar, .ads, .advertisement").remove();

  let content = $("article").text();
  if (!content.trim()) content = $("main").text();
  if (!content.trim()) content = $("body").text();

  return content.replace(/\s+/g, " ").trim().slice(0, 8000);
}

export async function POST(request: NextRequest) {
  try {
    // 認証チェック
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
    }

    const { url, mode = "thread", tone = "casual" } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URLが必要です" }, { status: 400 });
    }

    const validModes = ["thread", "single"];
    const validTones = ["casual", "business", "provocative"];
    if (!validModes.includes(mode)) {
      return NextResponse.json({ error: "無効なモードです" }, { status: 400 });
    }
    if (!validTones.includes(tone)) {
      return NextResponse.json({ error: "無効なトーンです" }, { status: 400 });
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "無効なURLです" }, { status: 400 });
    }

    // クレジット残高チェック（消費前に確認）
    const { data: profile } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", user.id)
      .single();

    if (!profile || profile.credits <= 0) {
      return NextResponse.json({ error: "クレジットが不足しています" }, { status: 402 });
    }

    // 記事取得（クレジット消費前）
    let articleContent: string;
    try {
      articleContent = await fetchPageContent(url);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "記事の取得に失敗しました";
      return NextResponse.json({ error: msg }, { status: 422 });
    }

    if (articleContent.length < 200) {
      return NextResponse.json(
        { error: "記事の内容が不足しているため、スレッドを生成できません。別のURLをお試しください。" },
        { status: 422 }
      );
    }

    // クレジットをアトミックに消費（生成直前）
    const { data: newCredits, error: creditError } = await supabase
      .rpc("consume_credit", { p_user_id: user.id });

    if (creditError || newCredits === null) {
      return NextResponse.json({ error: "クレジットが不足しています" }, { status: 402 });
    }

    // トーン別の指示を組み立て
    const toneInstructions: Record<string, string> = {
      casual: `【トーン・スタイル】
- 親しみやすく、フランクな口調（ですます調ベース、ところどころ砕けた表現OK）
- 絵文字を適度に使い、テンポよく読める文体
- 難しい専門用語は使わず、噛み砕いた表現に置き換える
  例）社会保険料 → 「手取りが減る理由」、インフレ → 「物価が上がる」 など`,
      business: `【トーン・スタイル】
- 信頼感のある、丁寧なビジネス口調（ですます調）
- データや根拠を重視し、論理的で説得力のある文体
- 専門用語は必要に応じて使うが、初見でもわかるよう補足を添える
- 絵文字は控えめに（1〜2個程度）`,
      provocative: `【トーン・スタイル】
- 読者の常識を覆すような、強めの切り口
- 「知らないと損」「まだ○○してるの？」のような煽り表現を活用
- 断定的な言い回しで、思わず反応したくなる文体
- 数字やインパクトのある事実を前面に出す`,
    };

    const toneText = toneInstructions[tone] || toneInstructions.casual;

    // モード別のプロンプトを組み立て
    let promptContent: string;

    if (mode === "single") {
      // 単一ポスト生成モード: 3パターン生成
      promptContent = `以下のブログ記事を読んで、X（Twitter）用の単一ポスト（1投稿）を3パターン作成してください。

【重要ルール】
- 入力された内容がブログ記事として不適切な場合（記事内容が存在しない、意味のあるテキストが読み取れない等）は、生成を中断し、以下のJSONのみを返すこと：
  {"error": "ブログ記事として認識できる内容がありませんでした"}

【記事内容】
${articleContent}

【ターゲット】
20〜30代のキャリアや将来のお金に不安を感じている社会人

${toneText}

【構成ルール】
- 3パターンそれぞれ異なる切り口で作成する：
  パターン1: 記事の最もインパクトのある数字や事実をフックにする
  パターン2: 読者の悩みや疑問に寄り添う問いかけ型
  パターン3: 意外性のある主張や逆説で興味を引く型
- 各パターンとも、最後に記事URLへの誘導を含める
- 誘導URLは必ず「${url}」を使う

【フォーマットルール】
- 1ポストは最大140文字以内
- スマホで読みやすいよう、2〜3行ごとに空行（\\n\\n）を入れる
- ハッシュタグは2〜3個

【出力形式】
以下のJSON形式のみで出力してください（他のテキストは一切不要）：
{
  "posts": [
    {"index": 1, "content": "パターン1のポスト内容"},
    {"index": 2, "content": "パターン2のポスト内容"},
    {"index": 3, "content": "パターン3のポスト内容"}
  ]
}`;
    } else {
      // スレッド生成モード（従来）
      promptContent = `以下のブログ記事を読んで、X（Twitter）用の連投スレッドを作成してください。

【重要ルール】
- 入力された内容がブログ記事として不適切な場合（記事内容が存在しない、意味のあるテキストが読み取れない等）は、生成を中断し、以下のJSONのみを返すこと：
  {"error": "ブログ記事として認識できる内容がありませんでした"}

【記事内容】
${articleContent}

【ターゲット】
20〜30代のキャリアや将来のお金に不安を感じている社会人

${toneText}

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
}`;
    }

    let responseText: string;
    try {
      const message = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 2048,
        messages: [
          {
            role: "user",
            content: promptContent,
          },
        ],
      });

      responseText = message.content[0].type === "text" ? message.content[0].text : "";
    } catch {
      // AI呼び出し失敗時はクレジットを返還
      await supabase
        .from("profiles")
        .update({ credits: newCredits + 1 })
        .eq("id", user.id);

      return NextResponse.json(
        { error: "AI生成中にエラーが発生しました。しばらくしてから再試行してください。" },
        { status: 500 }
      );
    }

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      // パース失敗時はクレジットを返還
      await supabase
        .from("profiles")
        .update({ credits: newCredits + 1 })
        .eq("id", user.id);

      return NextResponse.json(
        { error: "AIの応答を解析できませんでした。再試行してください。" },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // AIが記事不適切と判定した場合はクレジットを返還
    if (parsed.error) {
      await supabase
        .from("profiles")
        .update({ credits: newCredits + 1 })
        .eq("id", user.id);

      return NextResponse.json({ error: parsed.error }, { status: 422 });
    }

    // 履歴を保存
    const { data: thread } = await supabase
      .from("threads")
      .insert({ user_id: user.id, url, posts: parsed.posts, mode, tone })
      .select("id")
      .single();

    return NextResponse.json({
      ...parsed,
      thread_id: thread?.id,
      credits_remaining: newCredits,
    });
  } catch (error) {
    console.error("Error generating thread:", error);
    const message = error instanceof Error ? error.message : "不明なエラーが発生しました";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
