import { createServerSupabaseClient } from "@/utils/supabase/server";
import Link from "next/link";

const MontlyHotArticles = async ({
  categoryId,
  categoryName,
  withoutBorder,
}) => {
  const supabase = await createServerSupabaseClient();

  const { data: articles } = await supabase
    .from("articles")
    .select("title, thumbnail_text, images, id")
    .eq("category_id", categoryId)
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .range(0, 4);

  let catName = categoryName;

  if (!catName) {
    const { data } = await supabase
      .from("categories")
      .select("name")
      .eq("id", categoryId)
      .maybeSingle();
    catName = data?.name ?? "카테고리";
  }

  if (articles && articles.length > 0)
    return (
      <section className="pl-4 pr-4 md:pr-0">
        {!withoutBorder && <div className="border-b-2 border-white" />}
        <div className="flex items-center mt-4 mb-3">
          <h2 className="text-xl font-bold">{`이 달의 핫픽`}</h2>
          <p className="text-md ml-2 font-bold">{`#${catName}`} </p>
        </div>

        {articles?.map((article, index) => (
          <Link
            key={index}
            href={`/article/${article.id}`}
            aria-label="기사로 이동"
          >
            <div className="flex items-center py-3 hover:text-green-200">
              <p className="mr-2 text-xl ">{index + 1}. </p>
              <p className="text-md">{article.title}</p>
            </div>
          </Link>
        ))}
      </section>
    );
};
export default MontlyHotArticles;
