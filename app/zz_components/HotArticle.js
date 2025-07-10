import { createServerSupabaseClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";

const HotArticle = async ({ pageSize = 15 }) => {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("articles")
    .select("id, title, images")
    .eq("is_published", true)
    .limit(pageSize);
  return (
    <section className="pl-4 pr-4 md:pr-0">
      <h2 className="text-xl font-bold mt-4 italic"># 최근 많이 본 뉴스</h2>
      <ul>
        {data?.map((item) => (
          <Link
            key={item.id}
            href={`/article/${item.id}`}
            aria-label="기사로 이동"
          >
            <li className="flex items-center mt-2 py-2 hover:text-green-200">
              <div className="w-1/3 aspect-[5/3] relative">
                <Image
                  src={item.images[0] ?? "/images/logo.png"}
                  alt={item.title ?? "투데이태백 로고"}
                  className={`${
                    item.images[0] ? "object-cover" : "object-contain"
                  } rounded-md bg-white `}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="ml-2 w-2/3">
                <h3 className="text-md font-semibold line-clamp-2 break-keep">
                  {item.title}
                </h3>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </section>
  );
};

export default HotArticle;
