import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { HistoryClient } from "./HistoryClient";

export default async function HistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: threads } = await supabase
    .from("threads")
    .select("id, url, posts, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return <HistoryClient threads={threads ?? []} />;
}
