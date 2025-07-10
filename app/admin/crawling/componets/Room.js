import { Button } from "@mui/material";
import { useState } from "react";

const Room = ({ setOpenRoom, posts }) => {
  const [page, setPage] = useState(0);

  // 담당부서 문구 빼고 기자명 삽입
  const refineContent = () => {
    const AUTHORS = [
      "송현서 기자",
      "송현서 기자",
      "송현서 기자",
      "송현서 기자",
      "김균식 기자",
    ];
    const randomNum = Math.floor(Math.random() * AUTHORS.length);

    const content = posts[page]?.content;
    const splitDamDang = content?.split("담당 부서 : ");
    const removeDamDang = splitDamDang[0];
    const addAuthor = removeDamDang + `\n\n${AUTHORS[randomNum]}`;
    return addAuthor;
  };
  return (
    <div className="p-5 pt-1">
      <Button variant="contained" onClick={() => setOpenRoom(false)} fullWidth>
        뒤로가기
      </Button>

      <p className="font-bold text-lg m-2">
        {page + 1}/{posts.length} 번째
      </p>

      <Button
        variant="contained"
        fullWidth
        style={{ height: "15vh", marginBottom: "2vh" }}
        onClick={() => navigator.clipboard.writeText(posts[page]?.title)}
      >
        제목 붙혀넣기
      </Button>
      <Button
        variant="contained"
        fullWidth
        style={{ height: "15vh", marginBottom: "2vh" }}
        onClick={() =>
          navigator.clipboard.writeText(posts[page]?.content?.split("\n")[0])
        }
      >
        내용 일부분 붙혀넣기
      </Button>
      <Button
        variant="contained"
        fullWidth
        style={{ height: "15vh", marginBottom: "2vh" }}
        onClick={() => navigator.clipboard.writeText(refineContent())}
      >
        내용 붙혀넣기
      </Button>
      <Button
        variant="contained"
        fullWidth
        style={{ height: "15vh", marginBottom: "2vh" }}
        onClick={() => window.open(posts[page]?.images[0])}
      >
        이미지 다운로드
      </Button>
      <Button
        variant="contained"
        fullWidth
        style={{ height: "15vh", marginBottom: "2vh" }}
        onClick={() => setPage((prev) => prev + 1)}
      >
        다음 페이지
      </Button>
      <Button
        variant="contained"
        fullWidth
        style={{ height: "15vh", marginBottom: "2vh", marginTop: "5vh" }}
        onClick={() => setPage((prev) => prev - 1)}
      >
        전 페이지
      </Button>
    </div>
  );
};

export default Room;
