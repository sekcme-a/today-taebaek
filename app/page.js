import Header from "@/components/Header";
import Headline from "./zz_components/Headline";
import RecentNews from "./zz_components/RecentNews";
import HotArticle from "./zz_components/HotArticle";
import CategoryArticles from "./zz_components/CategoryArticles";
import BreakingNews from "./zz_components/BreakingNews";
import EditorPick from "./zz_components/EditorPick";
import SeperateArticles from "./zz_components/SeperateArticles";
import MontlyHotArticles from "./zz_components/MonthlyHotArticles";
import Footer from "@/components/Footer";
import LeftBody from "@/components/LeftBody";

const Home = () => {
  return (
    <main className="lg:mx-[5%]">
      <Header hasH1 />
      <div className="w-full flex justify-center">
        <div className="w-full">
          <div className="py-4 md:flex">
            <div className="w-full md:w-3/4">
              <div className="mt-4" />
              <Headline />
              <div className="mt-4" />
              <BreakingNews />
              <div className="mt-4" />
              <RecentNews rangeStart={0} rangeEnd={4} />
              <div className="mt-9" />
              <SeperateArticles rangeStart={5} rangeEnd={8} />
              <div className="mt-4" />
              <RecentNews rangeStart={9} rangeEnd={13} />
              <div className="mt-4" />
              <CategoryArticles />
              <div className="mt-9" />
              <RecentNews rangeStart={14} rangeEnd={17} />
            </div>
            <div className="w-full md:w-1/4">
              <LeftBody />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default Home;
