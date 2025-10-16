// hooks/useAddComment.ts
import { createBrowserSupabaseClient } from "@/utils/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAddComment({ articleId, parentCommentId, isChildComment }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content) => {
      const supabase = await createBrowserSupabaseClient();
      const { data, error } = await supabase
        .from("comments")
        .insert({
          article_id: articleId,
          ...(isChildComment && { parent_comment_id: parentCommentId }),
          content,
        })
        .select("*")
        .single();
      if (error) {
        console.log(error);
        throw error;
      }
      return data;
    },
    onSuccess: (newComment) => {
      // 기존 댓글 페이지들을 유지하면서, 새 댓글을 맨 앞에 추가
      queryClient.setQueryData(
        ["comments", isChildComment ? parentCommentId : articleId],
        (oldData) => {
          if (!oldData) return oldData;

          const newPages = [...oldData.pages];
          newPages[0] = [newComment, ...newPages[0]];

          return {
            ...oldData,
            pages: newPages,
          };
        }
      );

      //댓글 수 캐쉬 초기화
      queryClient.invalidateQueries(["commentCount", articleId]);
    },
  });
}
