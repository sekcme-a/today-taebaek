import { Button } from "@mui/material";

const InternetNews = () => {
  // const onButtonClick = () => {
  //   const urls = [
  //     "http://www.asinews.co.kr/adm/news/addArticleForm.do?vStartP=123415184",
  //     "/admin/crawling/ansan",
  //     "http://www.shinews.co.kr/adm/news/addArticleForm.do?vStartP=123415184",
  //     "/admin/crawling",
  //   ];

  //   for (const url of urls) {
  //     window.open(url, "_blank");
  //   }
  // };

  const urls = [
    { label: "시흥 크롤링", url: "/admin/crawling" },
    {
      label: "시흥뉴스 작성",
      url: "http://www.shinews.co.kr/adm/news/addArticleForm.do?vStartP=123415184",
    },
    { label: "안산 크롤링", url: "/admin/crawling/ansan" },

    {
      label: "안산뉴스 작성",
      url: "http://www.asinews.co.kr/adm/news/addArticleForm.do?vStartP=123415184",
    },
  ];

  return (
    <>
      <h1 className="font-bold text-2xl">인터넷 뉴스 업로드</h1>

      <p className="mt-10 text-lg">
        {`1. 아래의 버튼을 누르고, 순서대로 탭의 1,2,3,4번에 위치시켜줍니다.`}
      </p>
      <p className="mt-2">
        *일부러 역순으로 버튼 배치. 순서대로 클릭하면 된다.
      </p>
      {urls.map(({ label, url }) => (
        <Button
          variant="contained"
          fullWidth
          key={url}
          onClick={() => window.open(url, "_blank")}
          className="mt-2"
        >
          {label}
        </Button>
      ))}
      <p className="mt-10 text-lg">
        {`2. 안산, 시흥 크롤링 모두 날짜를 선택한 후, "크롤링" 버튼 클릭, 완료되면
        "이동" 버튼 클릭`}
      </p>
      <p className="mt-10 text-lg">
        {`3. 인터넷뉴스 작성페이지에서 "파일 업로드" 를 클릭해, 초기 파일 업로드
        경로가 "다운로드" 폴더이며, 좌측 최상단에 위치하는지 확인.`}
      </p>
      <p className="text-sm">
        {`*위 상태가 아니라면, "파일 업로드" 클릭 > "다운로드" 폴더 클릭 > 아무 사진이나 선택 > 창 위치를 좌측 최상단으로 위치 > 업로드(확인)`}
      </p>
      <p className="mt-10 text-lg">
        {`4. "심플 핫키" 실행시킨 후, 컴퓨터 화면에 홈페이지만 보이게 한 후, CTRL
        + F8 클릭`}
      </p>
      <p className="text-sm">
        {`* CTRL + F8 : 안산+시흥 업로드, CTRL + F6 : 안산 업로드, CTRL + F7 : 시흥 업로드, F12 : 비상정지`}
      </p>
    </>
  );
};

export default InternetNews;
