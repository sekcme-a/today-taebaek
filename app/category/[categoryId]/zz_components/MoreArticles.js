"use client";

import ArticleThumbnail from "@/components/ArticleThumbnail";
import { createBrowserSupabaseClient } from "@/utils/supabase/client";
import { useState } from "react";

const MoreArticles = ({ initialPageSize, categoryId }) => {
  const PAGE_SIZE = 9;
  const [articles, setArticles] = useState([]);
  const [isEnd, setIsEnd] = useState(false);

  const onMoreClick = async () => {
    const supabase = await createBrowserSupabaseClient();
    const { data } = await supabase
      .from("articles")
      .select("title, thumbnail_text, images, id")
      .eq("is_published", true)
      .eq("category_id", categoryId)
      .order("created_at", { ascending: false })
      .range(
        initialPageSize + articles.length,
        initialPageSize + articles.length - 1 + PAGE_SIZE
      );
    if (!data || data.length < PAGE_SIZE) setIsEnd(true);
    if (data) setArticles((prev) => [...prev, ...data]);
  };

  return (
    <div>
      <ul>
        {articles?.map((article, index) => {
          return (
            <ArticleThumbnail key={index} article={article} /> // Use the ArticleThumbnail component
          );
        })}
      </ul>
      {!isEnd && (
        <div className="flex justify-center mt-8">
          <button
            onClick={onMoreClick}
            className="border border-white rounded-md px-4 py-1 
              text-white bg-transparent 
              hover:bg-white hover:text-black 
              transition-colors duration-500"
          >
            <p className="text-sm font-semibold">기사 더보기 +</p>
          </button>
        </div>
      )}
    </div>
  );
};

export default MoreArticles;
