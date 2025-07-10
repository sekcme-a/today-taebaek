import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useComments } from "../hooks/useComments";
import { useAddComment } from "../hooks/useAddComment";
import Comment from "./Comment";
import { useCommentLikesCount } from "../hooks/useCommentLikeComment";
import Like from "./Like";

const ChildComments = ({ articleId, parentCommentId }) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    commentCount,
    isCountLoading,
  } = useComments({
    parentId: parentCommentId,
    isChildComment: true,
    initialPageSize: 7,
    pageSize: 5,
    sort: "최신순",
  });
  const addComment = useAddComment({
    articleId: articleId,
    parentCommentId: parentCommentId,
    isChildComment: true,
  });

  const [isOpenChildComment, setIsOpenChildComment] = useState(false);

  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (!input.trim()) return;
    addComment.mutate(input);
    setInput("");
  };

  return (
    <>
      <div className="flex items-center justify-between mt-3">
        <p
          className="text-sm cursor-pointer"
          onClick={() => setIsOpenChildComment((prev) => !prev)}
        >
          {commentCount === 0 ? "답글 작성" : `답글 ${commentCount}개`}
        </p>
        <Like commentId={parentCommentId} />
      </div>
      {isOpenChildComment && (
        <div className="">
          <div className="relative w-full mt-3 p-1 md:p-5 bg-[#32333b]">
            <div className="border border-white text-white w-full rounded bg-[#343541]">
              <TextareaAutosize
                className="w-full  overflow-auto bg-transparent
                  focus:outline-none px-2 my-2 rounded resize-none placeholder-gray-600"
                placeholder="답글을 작성해주세요."
                value={input}
                rows={1}
                maxRows={4}
                onChange={(e) => {
                  if (e.target.value.length <= 300) setInput(e.target.value);
                }}
              />
              <div className="flex justify-between px-3 items-center mb-2">
                <p className="text-xs text-gray-300">{input.length}/300</p>
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
              isChild={true}
              isLastContent={data?.pages?.flat()?.length - 1 === index}
            />
          ))}

          {hasNextPage && (
            <div className="flex justify-center">
              <button
                onClick={() => fetchNextPage()}
                className="py-2 px-6 rounded-full border-[1px] border-gray-300 text-xs hover:bg-white hover:text-black"
              >
                답글 더보기 +
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChildComments;
