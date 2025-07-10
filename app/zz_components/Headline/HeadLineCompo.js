import Image from "next/image";
import Link from "next/link";

const HeadlineCompo = ({ article, key }) => {
  return (
    <Link href={`/article/${article?.id}`} aria-label="기사로 이동">
      <article
        className="flex-[5] flex flex-col md:flex-row gap-4 w-full cursor-pointer hover:text-green-200 group"
        key={key}
      >
        <div className="flex-[2]">
          <div className="lg:h-60 h-60 relative flex items-center justify-center">
            <Image
              src={article?.images[0] ?? "/images/logo.png"}
              alt={article?.title ?? "투데이태백 로고"}
              width={200}
              height={200}
              className="h-full w-auto object-cover"
            />
          </div>
        </div>

        <div className="flex-[3] flex items-center justify-center ">
          <div className="">
            <h3 className="text-2xl px-3 text-center md:px-0 md:text-left md:text-4xl font-bold break-keep leading-tight line-clamp-2">
              {article?.title}
            </h3>
            <div className="hidden md:block">
              <p className="mt-5 line-clamp-4 text-md text-gray-400 group-hover:text-green-200 ">
                {article?.content}
              </p>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default HeadlineCompo;
