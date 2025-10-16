"use client";

import { useComments } from "../hooks/useComments";
import { useAddComment } from "../hooks/useAddComment";
import { useState } from "react";
import Comment from "./Comment";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "@material-tailwind/react";
import { createBrowserSupabaseClient } from "@/utils/supabase/client";

export default function Comments({ articleId }) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    commentCount,
    isCountLoading,
  } = useComments({
    parentId: articleId,
    isChildComment: false,
    initialPageSize: 7,
    pageSize: 5,
    sort: "최신순",
  });
  const addComment = useAddComment({ articleId });
  const [newContent, setNewContent] = useState("");

  const handleAdd = () => {
    if (!newContent.trim()) return;
    addComment.mutate(newContent);
    setNewContent("");
  };

  if (isLoading) return <p>로딩 중...</p>;

  return (
    <div className="mx-4 md:mx-0">
      {/* <input
        value={newContent}
        onChange={(e) => setNewContent(e.target.value)}
        placeholder="댓글을 입력하세요"
      /> */}
      <h4 className="font-bold text-lg">의견 {commentCount ?? "-"}개</h4>
      <div className="relative w-full mt-3 ">
        <div className="relative border border-white text-white w-full rounded ">
          <TextareaAutosize
            className="w-full bg-transparent overflow-auto 
          focus:outline-none px-2 my-2 rounded resize-none placeholder-gray-600"
            // style={{
            //   scrollbarWidth: "none", // Firefox
            //   msOverflowStyle: "none", // IE/Edge
            // }}
            rows={2}
            maxRows={5}
            placeholder={`사이트 관리 규정에 어긋나는 의견들은 예고없이 삭제될 수 있습니다.`}
            value={newContent}
            onChange={(e) => {
              if (e.target.value.length <= 300) setNewContent(e.target.value);
            }}
          />
          <div className="flex justify-between px-3 items-center mb-2">
            <p className="text-xs text-gray-300">{newContent.length}/300</p>
            <button
              onClick={handleAdd}
              className="bg-white text-black text-sm font-semibold px-3 py-1 rounded hover:bg-gray-200"
            >
              등록
            </button>
          </div>
        </div>
      </div>
      {data?.pages.flat().map((comment, index) => (
        <Comment
          key={index}
          comment={comment}
          articleId={articleId}
          isLastContent={data?.pages?.flat()?.length - 1 === index}
        />
      ))}

      {hasNextPage && (
        <div className="flex justify-center">
          <button
            onClick={() => fetchNextPage()}
            className="py-2 px-6 rounded-full border-[1px] border-gray-300 text-xs hover:bg-white hover:text-black"
          >
            댓글 더보기 +
          </button>
        </div>
      )}
    </div>
  );
}
