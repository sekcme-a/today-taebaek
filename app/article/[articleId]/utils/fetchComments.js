// utils/fetchComments.ts

import { createBrowserSupabaseClient } from "@/utils/supabase/client";

export async function fetchComments({
  parentId,
  isChildComment,
  initialPageSize,
  pageSize,
  sort,

  totalFetched,
  page,
  lastItemData,
}) {
  // const from =
  //   page === 0
  //     ? 0
  //     : page === 1
  //     ? initialPageSize
  //     : initialPageSize + (page - 1) * pageSize;
  // const to = page === 0 ? initialPageSize - 1 : from + pageSize - 1;

  // const from = totalFetched;
  // const to =
  //   totalFetched === 0 ? initialPageSize - 1 : totalFetched + pageSize - 1;

  try {
    const supabase = await createBrowserSupabaseClient();

    let query = supabase.from("comments").select();

    //댓글을 더보기 전에 다른 누군가가 새로운 댓글을 달았을때, 댓글을 중복으로 갖고오는것을 방지하기 위함.
    if (!sort || sort === "최신순") {
      query = query
        .order("created_at", { ascending: false })
        .limit(lastItemData?.created_at ? pageSize : initialPageSize);
      if (lastItemData?.created_at)
        query = query.lt("created_at", lastItemData?.created_at);
    }

    if (isChildComment) query = query.eq("parent_comment_id", parentId);
    else query = query.eq("article_id", parentId).is("parent_comment_id", null);

    const { data, error } = await query;

    if (error) throw error;
    return data;
  } catch (e) {
    console.log(e);
  }
}

export async function fetchCommentCount(parentId, isChildComment) {
  try {
    const supabase = await createBrowserSupabaseClient();
    let query = supabase
      .from("comments")
      .select("*", { count: "exact", head: true });

    if (isChildComment) query = query.eq("parent_comment_id", parentId);
    else query = query.eq("article_id", parentId);

    const { count, error } = await query;
    if (count) return count;
    return 0;
  } catch (e) {
    console.log(e);
  }
}
