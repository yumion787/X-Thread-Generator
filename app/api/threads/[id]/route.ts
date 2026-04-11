import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

// シェアページ用: 認証不要でスレッドを取得する公開API
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "IDが必要です" }, { status: 400 });
  }

  // Service Roleで取得（RLSをバイパス）
  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: thread, error } = await supabase
    .from("threads")
    .select("id, url, posts, created_at")
    .eq("id", id)
    .single();

  if (error || !thread) {
    return NextResponse.json({ error: "スレッドが見つかりません" }, { status: 404 });
  }

  return NextResponse.json(thread);
}
