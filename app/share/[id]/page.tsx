import { Metadata } from "next";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { ShareClient } from "./ShareClient";

interface Post {
  index: number;
  content: string;
}

interface Thread {
  id: string;
  url: string;
  posts: Post[];
  created_at: string;
}

async function getThread(id: string): Promise<Thread | null> {
  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("threads")
    .select("id, url, posts, created_at")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as Thread;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const thread = await getThread(id);

  if (!thread) {
    return { title: "スレッドが見つかりません | X Thread Generator" };
  }

  // 最初のポストの冒頭を説明文に使用
  const firstPost = thread.posts[0]?.content ?? "";
  const description = firstPost.replace(/\n/g, " ").slice(0, 120);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";

  return {
    title: `Xスレッド（${thread.posts.length}投稿） | X Thread Generator`,
    description,
    openGraph: {
      title: `AIが生成したXスレッド（${thread.posts.length}投稿）`,
      description,
      type: "article",
      locale: "ja_JP",
      siteName: "X Thread Generator",
      url: `${appUrl}/share/${id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `AIが生成したXスレッド（${thread.posts.length}投稿）`,
      description,
    },
  };
}

export default async function SharePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const thread = await getThread(id);

  if (!thread) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">スレッドが見つかりません</h1>
          <p className="text-gray-500 text-sm">このスレッドは削除されたか、URLが間違っている可能性があります。</p>
        </div>
      </div>
    );
  }

  return <ShareClient thread={thread} />;
}
