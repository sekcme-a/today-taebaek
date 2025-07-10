"use client";

import { createBrowserSupabaseClient } from "@/utils/supabase/client";
import { useEffect } from "react";
import { useState } from "react";
import ChildComments from "./ChildComments";

const Comment = ({ comment, key, articleId, isChild, isLastContent }) => {
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    setLoading(true);
    const supabase = await createBrowserSupabaseClient();
    const { data } = await supabase
      .from("profiles")
      .select("display_name, id")
      .eq("id", comment.author_id)
      .single();

    if (data) setAuthor(data);

    setLoading(false);
  };

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp); // ISO 문자열 → Date 객체 (자동으로 local time 반영)

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");

    return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
  }

  if (!loading && !author) return <div key={key}></div>;
  return (
    <div
      key={key}
      className={`py-5 mx-0 md:mx-3 ${
        isLastContent ? "" : "border-b-[.5px]"
      } border-b-gray-700 flex items-center`}
    >
      {isChild && (
        <i className="fa-solid fa-arrow-turn-up fa-flip-horizontal px-3"></i>
      )}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h5 className="font-semibold text-sm">{author?.display_name}</h5>
          </div>
          <i className="fa-solid fa-ellipsis-vertical"></i>
        </div>
        <p className="text-xs text-gray-400 mb-2">
          {formatTimestamp(comment?.created_at)}
        </p>
        <p>{comment.content}</p>

        {!isChild && (
          <ChildComments parentCommentId={comment.id} articleId={articleId} />
        )}
      </div>
    </div>
  );
};
export default Comment;
