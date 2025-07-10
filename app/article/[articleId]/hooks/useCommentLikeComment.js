// import { createBrowserSupabaseClient } from "@/utils/supabase/client";
// import { useMutation, useQueryClient } from "@tanstack/react-query";

// // {
// //   likeCount: number,
// //   dislikeCount: number,
// //   userLikeStatus: 1 | -1 | 0 // 사용자가 현재 누른 상태
// // }
// export function useCommentLikeComment({ articleId, userId }) {
//   const queryClient = useQueryClient();

//   const likeMutation = useMutation({
//     //type===1 좋아요로 변경, type===-1 싫어요로 변경, type===0 없음으로 변경
//     mutationFn: async (type) => {
//       const supabase = await createBrowserSupabaseClient();
//       if (type !== 0) {
//         const { error } = await supabase.from("comment_likes").upsert({
//           comment_id: articleId,
//           is_liked: type === 1 ? true : false,
//         });
//         if (error) throw error;
//       } else {
//         const { error } = await supabase
//           .from("comment_likes")
//           .delete()
//           .eq("comment_id", articleId)
//           .eq("user_id", userId)
//           .single();
//       }
//       return type;
//     },
//     onSuccess: (type) => {
//       queryClient.setQueryData(["commentLikesCount", articleId], (oldData) => {
//         if (!oldData) return oldData;

//         let { likeCount, dislikeCount, userLikeStatus } = oldData;

//         // 이전 상태에서 카운트를 되돌림
//         if (userLikeStatus === 1) likeCount -= 1;
//         if (userLikeStatus === -1) dislikeCount -= 1;

//         // 새 상태에 따라 카운트 증가
//         if (type === 1) likeCount += 1;
//         if (type === -1) dislikeCount += 1;

//         return {
//           likeCount,
//           dislikeCount,
//           userLikeStatus: type,
//         };
//       });
//     },
//   });
// }

import { createBrowserSupabaseClient } from "@/utils/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
/**
 * 댓글 좋아요/싫어요 카운트 및 유저 상태 조회
 */
export function useCommentLikesCount(articleId) {
  return useQuery({
    queryKey: ["commentLikesCount", articleId],
    queryFn: async () => {
      const supabase = await createBrowserSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const userId = user.id;

      // 좋아요 수
      const { count: likeCount, error: likeError } = await supabase
        .from("comment_likes")
        .select("*", { count: "exact", head: true })
        .eq("comment_id", articleId)
        .eq("is_liked", true);

      // 싫어요 수
      const { count: dislikeCount, error: dislikeError } = await supabase
        .from("comment_likes")
        .select("*", { count: "exact", head: true })
        .eq("comment_id", articleId)
        .eq("is_liked", false);

      // 유저 상태 (1: 좋아요, -1: 싫어요, 0: 없음)
      let userLikeStatus = 0;
      if (userId) {
        const { data: userLikeRow } = await supabase
          .from("comment_likes")
          .select("is_liked")
          .eq("comment_id", articleId)
          .eq("user_id", userId)
          .maybeSingle();

        if (userLikeRow) {
          userLikeStatus = userLikeRow.is_liked ? 1 : -1;
        }
      }

      if (likeError || dislikeError) throw likeError || dislikeError;

      return {
        likeCount: likeCount ?? 0,
        dislikeCount: dislikeCount ?? 0,
        userLikeStatus,
      };
    },
    staleTime: 5000, // 5초 캐시
  });
}

/**
 * 댓글 좋아요/싫어요 처리 뮤테이션
 * @param {string} articleId - 댓글 ID
 * @param {string} userId - 로그인한 사용자 ID
 */
export function useLikeComment({ articleId }) {
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    /**
     * type: 1 (좋아요), -1 (싫어요), 0 (삭제)
     */
    mutationFn: async (type) => {
      const supabase = await createBrowserSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const userId = user.id;

      if (type !== 0) {
        await supabase
          .from("comment_likes")
          .delete()
          .eq("comment_id", articleId)
          .eq("user_id", userId)
          .maybeSingle();
        const { error } = await supabase.from("comment_likes").upsert({
          comment_id: articleId,
          user_id: userId,
          is_liked: type === 1,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("comment_likes")
          .delete()
          .eq("comment_id", articleId)
          .eq("user_id", userId)
          .single();
        if (error) throw error;
      }

      return type;
    },

    onSuccess: (type) => {
      queryClient.setQueryData(["commentLikesCount", articleId], (oldData) => {
        if (!oldData) return oldData;

        let { likeCount, dislikeCount, userLikeStatus } = oldData;

        // 기존 상태 되감기
        if (userLikeStatus === 1) likeCount -= 1;
        if (userLikeStatus === -1) dislikeCount -= 1;

        // 새로운 상태 반영
        if (type === 1) likeCount += 1;
        if (type === -1) dislikeCount += 1;

        return {
          likeCount: Math.max(0, likeCount),
          dislikeCount: Math.max(0, dislikeCount),
          userLikeStatus: type,
        };
      });
    },
    onError: (e) => {
      console.log(e);
    },
  });

  return likeMutation;
}
