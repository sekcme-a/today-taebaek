import Image from "next/image";
import Link from "next/link";

const ArticleThumbnail = ({ article, key, isBreakingNews, fullArticle }) => {
  return (
    <Link href={`/article/${article.id}`} key={key} aria-label="기사로 이동">
      <li
        className="flex gap-2 py-5 cursor-pointer hover:text-green-200 group
          px-3 md:px-0
          border-b-[0.5px] border-[#7a7a7a]
          "
      >
        <div className="w-1/3 md:w-1/4 aspect-[5/2] relative">
          <Image
            src={article.images[0] ?? "/images/logo.png"}
            alt={article.title ?? "투데이태백 로고"}
            fill
            className={`${
              article.images[0] ? "object-cover" : "object-contain"
            } rounded-md bg-white `}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="w-2/3 md:w-3/4 flex items-center ">
          <div className="">
            <div className="flex items-center">
              {isBreakingNews && (
                <p className="text-lg md:text-xl font-bold text-red-400 shrink-0 mr-2">{`[속보]`}</p>
              )}
              <h4 className="text-lg md:text-xl font-bold line-clamp-1 break-keep">
                {article.title}
              </h4>
            </div>
            {isBreakingNews ? (
              <p className="line-clamp-4 mt-2 text-sm leading-relaxed text-gray-400 group-hover:text-green-200">
                {fullArticle}
              </p>
            ) : (
              <p className="line-clamp-2 mt-2 text-sm leading-relaxed text-gray-400 group-hover:text-green-200">
                {article.thumbnail_text?.trimEnd()}...
              </p>
            )}
          </div>
        </div>
      </li>
    </Link>
  );
};

export default ArticleThumbnail;
