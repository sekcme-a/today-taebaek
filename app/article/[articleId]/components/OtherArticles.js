import ArticleThumbnail from "@/components/ArticleThumbnail";
import { createServerSupabaseClient } from "@/utils/supabase/server";

const OtherArticles = async ({ withoutArticleId }) => {
  const supabase = await createServerSupabaseClient();

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const { data } = await supabase
    .from("articles")
    .select("title, thumbnail_text, images, id")
    .neq("id", withoutArticleId)
    .gte("created_at", oneMonthAgo.toISOString())
    .limit(5);

  return (
    <section>
      <h3 className="ml-4 md:ml-0 text-xl font-bold">다른 기사 보기</h3>
      {data?.map((item, index) => {
        return <ArticleThumbnail key={index} article={item} />;
      })}
    </section>
  );
};

export default OtherArticles;
