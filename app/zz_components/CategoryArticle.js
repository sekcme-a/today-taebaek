import { createServerSupabaseClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";

const CategoryArticle = async ({ key, categoryId }) => {
  const supabase = await createServerSupabaseClient();
  const { data: category } = await supabase
    .from("categories")
    .select("name")
    .eq("id", categoryId)
    .single();

  const { data: articles } = await supabase
    .from("articles")
    .select("images, title, id")
    .eq("category_id", categoryId)
    .order("created_at", { ascending: false })
    .eq("is_published", true)
    .limit(3);

  return (
    <li key={key} className="mx-4 md:mx-0 mb-7 md:mb-0">
      <div className="border-b-[0.5px] border-[#d1d1d1] w-full" />
      <h4 className="font-bold my-4 text-lg">#{category.name}</h4>
      <ul>
        <Link href={`/article/${articles[0]?.id}`} aria-label="기사로 이동">
          <div className="w-full aspect-[2/1] relative">
            <Image
              src={articles[0]?.images[0] ?? "/images/logo.png"}
              alt={articles[0]?.title ?? "투데이태백 로고"}
              fill
              className={`${
                articles[0]?.images[0] ? "object-cover" : "object-contain"
              } rounded-md bg-white `}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </Link>
        {articles?.map((article, index) => (
          <Link
            href={`/article/${article.id}`}
            key={article.id}
            aria-label="기사로 이동"
          >
            <li
              key={article.id}
              className={`py-4 
                ${
                  index === articles.length - 1
                    ? "border-b-0 md:border-b-[0.5px]"
                    : ""
                }
              border-b-[0.5px] border-[#9a9a9a] cursor-pointer hover:text-green-200`}
            >
              <h5 className="line-clamp-2 break-keep">{article.title}</h5>
            </li>
          </Link>
        ))}
      </ul>
    </li>
  );
};

export default CategoryArticle;
