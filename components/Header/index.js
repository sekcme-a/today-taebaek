import Image from "next/image";
import CategoryNav from "./CategoryNav";
import Link from "next/link";
import ProfileButton from "./ProfileButton";

const Header = ({ selectedCategoryId, hasH1 }) => {
  const CATEGORIES = [
    { name: "정치", id: 1 },
    { name: "경제", id: 2 },
    { name: "사회", id: 3 },
    { name: "문화", id: 4 },
    { name: "스포츠", id: 5 },
    { name: "IT/과학", id: 7 },
    { name: "생활/문화", id: 8 },
    { name: "여행/레저", id: 9 },
  ];

  const todayDateToString = () => {
    const date = new Date();

    const year = date.getFullYear() + "년";
    const month = date.getMonth() + 1 + "월";
    const day = date.getDate() + "일";

    const weekday = new Intl.DateTimeFormat("ko-KR", {
      weekday: "short",
    }).format(date);

    return `${year} ${month} ${day}(${weekday})`;
  };

  return (
    <header>
      <div className="h-1/6 flex flex-col items-center pb-5 mt-2 relative">
        {/* Logo 영역 */}
        <div className="w-3/5 sm:w-1/2 md:w-[360px]">
          <Link href="/" aria-label="홈으로 이동">
            <Image
              src="/images/logo_white.png"
              alt="투데이태백 로고"
              width={360}
              height={130}
              className="w-full h-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* 날짜 + 사이트명 */}
        <div className="absolute bottom-0 right-0 text-xs hidden md:flex items-center">
          {hasH1 ? <h1>투데이태백</h1> : <p>투데이태백</p>}
          <time className="ml-1" dateTime={new Date().toISOString()}>
            {todayDateToString()}
          </time>
        </div>

        {/* 네비게이션 */}
      </div>
      <nav
        className="w-full flex justify-between items-center border-t-white border-b-gray-500 border-t-[2px] border-b-[0.2px]"
        aria-label="카테고리 내비게이션"
      >
        {/* <div className="w-full">
          <hr className="w-full bg-white h-0.5 border-none" />
          <CategoryNav {...{ selectedCategoryId }} />

          <hr className="w-full bg-gray-500 h-[0.2px] border-none" />
        </div> */}
        <div className="flex-1  overflow-x-scroll whitespace-nowrap scrollbar-none">
          <CategoryNav {...{ selectedCategoryId }} />
        </div>
        <ProfileButton />
      </nav>
    </header>
  );
};

export default Header;
