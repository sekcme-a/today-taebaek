import EditorPick from "@/app/zz_components/EditorPick";
import HotArticle from "@/app/zz_components/HotArticle";
import MontlyHotArticles from "@/app/zz_components/MonthlyHotArticles";

const LeftBody = () => {
  return (
    <>
      <HotArticle />
      <div className="mt-10" />
      <MontlyHotArticles categoryId={1} categoryName="정치" />
      <div className="mt-10" />
      <EditorPick />
    </>
  );
};

export default LeftBody;
