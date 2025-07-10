import ArticleThumbnail from "@/components/ArticleThumbnail";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import MoreArticles from "./MoreArticles";

const RecentArticles = async ({ categoryId }) => {
  const INITIAL_PAGE_SIZE = 10;
  const supabase = await createServerSupabaseClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("title, thumbnail_text, images, id")
    .eq("is_published", true)
    .eq("category_id", categoryId)
    .order("created_at", { ascending: false })
    .limit(INITIAL_PAGE_SIZE);

  return (
    <section>
      <ul>
        {articles?.map((article, index) => {
          return <ArticleThumbnail key={index} article={article} />;
        })}
      </ul>
      <MoreArticles {...{ categoryId }} initialPageSize={INITIAL_PAGE_SIZE} />
    </section>
  );
};
export default RecentArticles;
