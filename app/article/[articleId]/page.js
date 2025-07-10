import ClientBackComponent from "@/components/client/ClientBackComponent";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LeftBody from "@/components/LeftBody";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import MontlyHotArticles from "@/app/zz_components/MonthlyHotArticles";
import HotArticle from "@/app/zz_components/HotArticle";
import ArticleCompo from "./components/ArticleCompo";
import OtherArticles from "./components/OtherArticles";
import Comments from "./components/Comments";
import { generateMetadata } from "./metadata";
import HandleViewCount from "./components/HandleViewCount";

export { generateMetadata };

const Article = async ({ params }) => {
  const { articleId } = params;

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("articles")
    .select()
    .eq("id", articleId)
    .single();

  if (error || !data) {
    return <ClientBackComponent message="존재하지 않거나 삭제된 기사입니다." />;
  }

  return (
    <main className="lg:mx-[5%]">
      <Header />
      <div className="w-full flex justify-center">
        <div className="w-full">
          <div className="py-4 md:flex">
            <div className="w-full md:w-3/4">
              <div className="mt-4" />
              <ArticleCompo article={data} />
              <div className="mt-32" />
              <Comments articleId={articleId} />
              <div className="mt-32" />
              <OtherArticles withoutArticleId={articleId} />
            </div>
            <div className="w-full md:w-1/4">
              <MontlyHotArticles categoryId={data.category_id} withoutBorder />
              <div className="mt-10" />
              <HotArticle pageSize={7} />
            </div>
          </div>
        </div>
      </div>
      <HandleViewCount articleId={articleId} />
      <Footer />
    </main>
  );
};

export default Article;
