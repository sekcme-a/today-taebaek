import { createServerSupabaseClient } from "@/utils/supabase/server";

export async function POST(req) {
  const { articleId } = await req.json();
  const supabase = await createServerSupabaseClient();
  try {
    const { data, error } = await supabase.rpc("increment_view_count", {
      p_article_id: articleId,
    });

    if (error) {
      console.error("RPC error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to increment view count" }),
        { status: 500 }
      );
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    console.error("Unexpected error:", e);
    return new Response(JSON.stringify({ error: "Unexpected server error" }), {
      status: 500,
    });
  }
}
