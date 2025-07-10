import { createServerSupabaseClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";

const Headline = async ({ categoryId }) => {
  const supabase = await createServerSupabaseClient();
  const { data: headlineArticles } = await supabase
    .from("articles")
    .select("title, images, id, thumbnail_text")
    .eq("category_id", categoryId)
    .eq("is_headline", true)
    .eq("is_published", true)
    .order("created_at", { ascending: true })
    .limit(4);

  let normalArticles = [];
  if (headlineArticles.length < 4) {
    const { data } = await supabase
      .from("articles")
      .select("title, images, id, thumbnail_text")
      .eq("category_id", categoryId)
      .eq("is_headline", false)
      .eq("is_published", true)
      .order("created_at", { ascending: true })
      .limit(4 - headlineArticles.length);
    normalArticles = data;
  }

  const articles = [...headlineArticles, ...normalArticles];

  return (
    <section className="flex flex-col md:flex-row w-full border-b-2 pb-10 pt-4 border-gray-300">
      <div className="w-full md:w-2/3 md:pr-4">
        <Link href={`/article/${articles[0]?.id}`} aria-label="기사로 이동">
          <div className="md:flex hover:text-green-200 cursor-pointer group">
            <article className="flex-1">
              <h1 className="text-2xl font-bold line-clamp-2 break-keep">
                {articles[0]?.title}
              </h1>
              <p className="mt-4 md:mt-10 text-gray-400 line-clamp-4 group-hover:text-green-200">
                {articles[0]?.thumbnail_text?.trimEnd()}...
              </p>
            </article>
            <div className="hidden md:block w-10" />
            <div className="flex-1 relative w-full aspect-[6/3] mt-5 md:mt-0">
              <Image
                src={articles[0]?.images[0] ?? "/images/logo.png"}
                alt={articles[0]?.title ?? "투데이태백 로고"}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: "cover", borderRadius: 10 }}
              />
            </div>
          </div>
        </Link>

        <div className="h-[1px] bg-gray-400 w-full my-7" />

        <Link href={`/article/${articles[1]?.id}`} aria-label="기사로 이동">
          <article className="md:flex cursor-pointer group hover:text-green-200">
            <div className="flex-1">
              <h2 className="text-2xl font-bold line-clamp-2 break-keep">
                {articles[1]?.title}
              </h2>
            </div>
            <div className="hidden md:block w-10" />
            <div className="flex-1 mt-5 md:mt-0">
              <p className="text-gray-400 line-clamp-3 group-hover:text-green-200">
                {articles[1]?.thumbnail_text?.trimEnd()}...
              </p>
            </div>
          </article>
        </Link>
      </div>

      <div className="w-full md:w-1/3 md:pl-4 flex flex-col justify-between mt-8 md:mt-0">
        <Link href={`/article/${articles[2]?.id}`} aria-label="기사로 이동">
          <article>
            <div className="flex ">
              <div className="relative w-1/3 aspect-[5/3]">
                <Image
                  src={articles[2]?.images[0] ?? "/images/logo.png"}
                  alt={articles[2]?.title ?? "투데이태백 로고"}
                  fill
                  objectFit="cover"
                  className="rounded-md"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <h3 className="ml-2 line-clamp-2 font-bold">
                {articles[2]?.title}
              </h3>
            </div>
            <p className="mt-4 text-sm text-gray-400">
              {articles[2]?.thumbnail_text}
            </p>
          </article>
        </Link>
        <Link href={`/article/${articles[3]?.id}`} aria-label="기사로 이동">
          <article className="mt-8">
            <div className="flex ">
              <div className="relative w-1/3 aspect-[5/3]">
                <Image
                  src={articles[3]?.images[0] ?? "/images/logo.png"}
                  alt={articles[3]?.title ?? "투데이태백 로고"}
                  fill
                  objectFit="cover"
                  className="rounded-md"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <h3 className="ml-2 line-clamp-2 font-bold">
                {articles[3]?.title}
              </h3>
            </div>
            <p className="mt-4 text-sm text-gray-400">
              {articles[3]?.thumbnail_text}
            </p>
          </article>
        </Link>
      </div>
    </section>
  );
};

export default Headline;
