import { useQuery } from "@tanstack/react-query";
import { createServerSupabaseClient } from "@/utils/supabase/server";

export function useCommentCount(postId) {
  return useQuery({
    queryKey: ["commentCount", postId],
    queryFn: async () => {
      const supabase = await createServerSupabaseClient();
      const { count, error } = await supabase
        .from("comments")
        .select("*", { count: "exact", head: true })
        .eq("post_id", postId)
        .is("parent_id", null);

      if (error) throw error;
      return count ?? 0;
    },
  });
}
