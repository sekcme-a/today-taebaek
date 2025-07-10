import { Button } from "@mui/material";

const TodayTaebaek = () => {
  return (
    <>
      <h1 className="font-bold text-2xl">투데이 태백 이메일 보도기사 업로드</h1>

      <p className="mt-10 text-lg">
        {`1. 다음 메일에서 전날의 보도자료들을 다운로드한다.`}
      </p>
      <Button
        variant="contained"
        onClick={() => window.open("https://mail.daum.net/top/F_138", "_blank")}
        fullWidth
        className="mt-1"
      >
        DAUM으로 이동
      </Button>
      <p className="mt-10 text-lg">2. 보도자료 추출에 이동해준다.</p>
      <Button
        variant="contained"
        onClick={() => window.open("/admin/articles/bodo", "_blank")}
        fullWidth
        className="mt-1"
      >
        보도자료 추출 로 이동
      </Button>
      <p className="mt-10 text-lg">
        3. 보도기사 파일을 열고, ctrl+a 로 전체 선택 후, 붙혀넣기
      </p>
      <p className="mt-10 text-lg">
        4. 이미지들을 드래그해서 업로드 후, 추출 버튼 클릭
      </p>
      <p className="mt-10 text-lg">
        {`5. 추출된 결과 확인 후, "일괄 저장하기" 클릭`}
      </p>
      <p className="mt-10 text-lg">
        6. 기사 목록에 들어가서 카테고리 등 선택 후 게재.
      </p>
      <Button
        variant="contained"
        onClick={() => window.open("/admin/articles", "_blank")}
        fullWidth
        className="mt-1"
      >
        기사관리로 이동
      </Button>
    </>
  );
};

export default TodayTaebaek;
