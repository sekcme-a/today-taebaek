import ArticleThumbnail from "@/components/ArticleThumbnail";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";

const RecentNews = async ({ rangeStart, rangeEnd }) => {
  const supabase = await createServerSupabaseClient();
  // const { data: headlineArticles } = await supabase
  //   .from("articles")
  //   .select("title, images, id")
  //   .eq("is_headline", true)
  //   .order("created_at", { ascending: false });

  const { data: articles } = await supabase
    .from("articles")
    .select("title, thumbnail_text, images, id")
    .eq("is_headline", false)
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .range(rangeStart, rangeEnd);

  return (
    <ul>
      {articles?.map((article, index) => {
        return (
          <ArticleThumbnail key={index} article={article} /> // Use the ArticleThumbnail component
        );
      })}
    </ul>
  );
};

export default RecentNews;
