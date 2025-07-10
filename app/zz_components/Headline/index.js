import { createServerSupabaseClient } from "@/utils/supabase/server";
import SwiperArticle from "./SwiperArticle";
import SeoSafeSwiper from "@/components/SeoSafeSwiper";
import HeadlineCompo from "./HeadLineCompo";
const Headline = async () => {
  const supabase = await createServerSupabaseClient();
  const { data: rawArticles } = await supabase
    .from("articles")
    .select("*")
    .eq("is_headline", true)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  const articles = JSON.parse(JSON.stringify(rawArticles));

  return (
    <>
      {/* <SwiperArticle articles={articles} /> */}
      <SeoSafeSwiper
        articles={articles ?? []}
        renderSlide={(article) => <HeadlineCompo article={article} />}
      />
    </>
  );
};

export default Headline;
