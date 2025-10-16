import Image from "next/image";

const ArticleCompo = ({ article }) => {
  const formatDate = (isoString) => {
    const date = new Date(isoString);

    const pad = (n) => n.toString().padStart(2, "0");

    return (
      `${date.getFullYear()}.` +
      `${pad(date.getMonth() + 1)}.` +
      `${pad(date.getDate())} ` +
      `${pad(date.getHours())}:` +
      `${pad(date.getMinutes())}:` +
      `${pad(date.getSeconds())}`
    );
  };

  const elements = [];

  const regex = /\[\[\[(\d+)\]\]\]<<<(.*?)>>>/g;
  let lastIndex = 0;
  let match;
  let key = 0;
  console.log(article.content);

  while ((match = regex.exec(article.content)) !== null) {
    const [fullMatch, imageIndexStr, description] = match;
    const imageIndex = parseInt(imageIndexStr, 10);

    // 앞쪽 일반 텍스트 추가
    if (match.index > lastIndex) {
      const text = article.content.slice(lastIndex, match.index);
      elements.push(
        <p
          className="whitespace-pre-line mb-4 break-keep text-lg"
          key={`text-${key++}`}
        >
          {text.trim()}
        </p>
      );
    }

    // 이미지 삽입
    const imageSrc = article.images[imageIndex - 1] ?? "/images/logo.png";
    elements.push(
      <div key={`image-${key++}`} className="my-9 flex flex-col items-center">
        <div className="relative w-full max-w-xl aspect-video">
          <Image
            src={imageSrc}
            alt={
              description && description !== "" ? description : article.title
            }
            fill
            className="object-cover "
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <p className="text-sm text-gray-400 mt-2 break-keep">{description}</p>
      </div>
    );

    lastIndex = regex.lastIndex;
  }

  // 남은 텍스트 추가
  if (lastIndex < article.content.length) {
    elements.push(
      <p
        className="whitespace-pre-line mb-4 break-keep text-lg"
        key={`text-${key++}`}
      >
        {article.content.slice(lastIndex).trim()}
      </p>
    );
  }

  return (
    <article className="mx-4 md:mx-0">
      <h1 className="text-4xl font-semibold md:break-keep leading-snug">
        {article.title}
      </h1>
      <p className="text-xs text-gray-500 mt-3">
        {formatDate(article.created_at)}
      </p>
      <div className="flex items-center w-full justify-center my-10">
        <div className="relative w-full max-w-xl aspect-video">
          <Image
            src={article.images[0] ?? "/images/logo.png"}
            alt={article.title ?? "투데이태백 로고"}
            fill
            className="object-cover "
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>

      <div className="mt-10">{elements}</div>

      <p className="mt-14 text-sm text-gray-300">{article.author}</p>
    </article>
  );
};

export default ArticleCompo;
