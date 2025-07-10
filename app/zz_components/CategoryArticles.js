import { createServerSupabaseClient } from "@/utils/supabase/server";
import CategoryArticle from "./CategoryArticle";

const CategoryArticles = async () => {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("settings")
    .select("data")
    .eq("type", "main_article_category_ids")
    .single();

  return (
    <section>
      <h4 className="text-2xl font-bold mb-3 mt-14 ml-4 md:ml-0">
        카테고리 별 뉴스
      </h4>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.data?.map((categoryId) => (
          <CategoryArticle key={categoryId} categoryId={categoryId} />
        ))}
      </ul>
    </section>
  );
};
export default CategoryArticles;
