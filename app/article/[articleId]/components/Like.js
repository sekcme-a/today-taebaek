import {
  useCommentLikesCount,
  useLikeComment,
} from "../hooks/useCommentLikeComment";

const Like = ({ commentId }) => {
  const { data, isLoading } = useCommentLikesCount(commentId);
  const { mutate: like } = useLikeComment({
    articleId: commentId,
  });

  // if (isLoading) return <></>;

  const handleLikePress = () => {
    if (data?.userLikeStatus === 1) {
      like(0); // 좋아요 취소
    } else {
      like(1); // 좋아요 설정
    }
  };

  const handleDislikePress = () => {
    if (data?.userLikeStatus === -1) {
      like(0); // 싫어요 취소
    } else {
      like(-1); // 싫어요 설정
    }
  };

  return (
    <div className="flex items-center">
      <div
        className="flex items-center cursor-pointer"
        onClick={handleLikePress}
      >
        {data?.userLikeStatus === 1 ? (
          <i className="fa-solid fa-thumbs-up"></i>
        ) : (
          <i className="fa-regular fa-thumbs-up"></i>
        )}
        <p className="ml-1">{data?.likeCount}</p>
      </div>
      <div
        className="flex items-center ml-4 cursor-pointer"
        onClick={handleDislikePress}
      >
        {data?.userLikeStatus === -1 ? (
          <i className="fa-solid fa-thumbs-down"></i>
        ) : (
          <i className="fa-regular fa-thumbs-down"></i>
        )}
        <p className="ml-1">{data?.dislikeCount}</p>
      </div>
    </div>
  );
};

export default Like;
