import ArticleThumbnail from "@/components/ArticleThumbnail";
import { createServerSupabaseClient } from "@/utils/supabase/server";

const BreakingNews = async () => {
  const supabase = await createServerSupabaseClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("images, title, content, id")
    .eq("is_breaking_news", true)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (articles.length > 0)
    return (
      <section>
        {articles?.map((article, index) => (
          <ArticleThumbnail
            article={article}
            fullArticle={article.content}
            key={index}
            isBreakingNews={true}
          /> // Use the ArticleThumbnail component
        ))}
      </section>
    );
};
export default BreakingNews;
