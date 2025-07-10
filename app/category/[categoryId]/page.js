import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Headline from "./zz_components/Headline";
import HotArticle from "@/app/zz_components/HotArticle";
import MontlyHotArticles from "@/app/zz_components/MonthlyHotArticles";
import EditorPick from "@/app/zz_components/EditorPick";
import LeftBody from "@/components/LeftBody";
import RecentArticles from "./zz_components/RecentArticles";
import { createMetadata } from "@/utils/metadata";
import { createServerSupabaseClient } from "@/utils/supabase/server";

export async function generateMetadata({ params }) {
  const { categoryId } = params;
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("categories")
    .select("name")
    .eq("id", categoryId)
    .maybeSingle();

  const DESCRIPTION = [
    {
      name: "정치",
      description: "강원 태백 정치 소식과 시정 이슈를 전합니다.",
    },
    {
      name: "경제",
      description: "지역 경제 동향과 산업, 일자리 정보를 제공합니다.",
    },
    {
      name: "사회",
      description: "태백의 사회 현안과 사건·사고 뉴스를 다룹니다.",
    },
    {
      name: "문화",
      description: "태백의 문화 소식과 전통, 예술 이야기를 전합니다.",
    },
    {
      name: "스포츠",
      description: "지역 스포츠 경기와 선수 소식을 신속히 전달합니다.",
    },
    {
      name: "IT/과학",
      description: "기술과 과학 뉴스, 디지털 트렌드를 소개합니다.",
    },
    {
      name: "생활/문화",
      description: "태백 시민의 생활 정보와 문화 트렌드를 전합니다.",
    },
    {
      name: "여행/레저",
      description: "태백의 명소, 여행지, 레저 정보를 안내합니다.",
    },
    {
      name: "미담",
      description: "훈훈한 지역 미담과 아름다운 이야기들을 소개합니다.",
    },
    {
      name: "행사/축제",
      description: "태백의 축제·행사 정보를 생생하게 전달합니다.",
    },
  ];

  const description = DESCRIPTION.find((item) => item.name === data?.name);

  return createMetadata({
    title: data.name,
    description: description.description ?? "",
    url: `/category/${categoryId}`,
  });
}

const Category = ({ params }) => {
  const { categoryId } = params;

  return (
    <main className="lg:mx-[5%]">
      <Header selectedCategoryId={categoryId} />
      <div className="w-full flex justify-center px-3 md:px-0">
        <div className="w-full pt-6 ">
          <Headline {...{ categoryId }} />
          <div className="py-4 md:flex mt-5">
            <div className="w-full md:w-3/4">
              <RecentArticles {...{ categoryId }} />
            </div>
            <div className="w-full md:w-1/4">
              <MontlyHotArticles categoryId={categoryId} withoutBorder />
              <div className="mt-10" />
              <HotArticle pageSize={7} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default Category;
