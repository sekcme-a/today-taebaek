import { createServerSupabaseClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";

// 기사 고정 4개로 설정
const SeperateArticles = async ({ rangeStart, rangeEnd }) => {
  const supabase = await createServerSupabaseClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("title, thumbnail_text, images, id")
    .eq("is_headline", false)
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .range(rangeStart, rangeEnd);

  if (articles && articles.length === 4)
    return (
      <section className="grid grid-cols-1 md:grid-cols-2 px-4 md:px-0">
        <Link href={`/article/${articles[0].id}`} aria-label="기사로 이동">
          <div className="cursor-pointer hover:text-green-200 border-r-[0.5px] border-[#7a7a7a] md:pr-4 mb-4 md:mb-0 group">
            <div className="relative w-full aspect-[5/2]">
              <Image
                src={articles[0].images[0] ?? "/images/logo.png"}
                alt={articles[0].title ?? "투데이태백 로고"}
                className={`${
                  articles[0].images[0] ? "object-cover" : "object-contain"
                } rounded-md bg-white `}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <h5 className="mt-2 text-xl font-bold line-clamp-2 break-keep">
              {articles[0].title}
            </h5>
            <p className="mt-2 text-sm text-gray-400 group-hover:text-green-200">
              {articles[0]?.thumbnail_text?.trimEnd()}...
            </p>
          </div>
        </Link>

        <div className="ml-0 md:ml-4">
          {articles.slice(1).map((article, index) => (
            <Link
              key={index}
              href={`/article/${article.id}`}
              aria-label="기사로 이동"
            >
              <div
                className={`w-full flex py-4 border-b-[0.5px] border-[#7a7a7a] hover:text-green-200 group ${
                  articles.slice(1).length - 1 === index ? "md:border-0" : ""
                }`}
              >
                <div className="w-2/3 pr-4">
                  <h5 className="text-lg font-bold line-clamp-2 break-keep">
                    {article.title}
                  </h5>
                  <p className="mt-2 text-sm text-gray-400 line-clamp-2 group-hover:text-green-200 ">
                    {article.thumbnail_text?.trimEnd()}...
                  </p>
                </div>
                <div className="w-1/3 relative aspect-[3/1]">
                  <Image
                    src={article.images[0] ?? "/images/logo.png"}
                    alt={article.title ?? "투데이태백 로고"}
                    className={`${
                      article.images[0] ? "object-cover" : "object-contain"
                    } rounded-md bg-white `}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    );
};

export default SeperateArticles;
