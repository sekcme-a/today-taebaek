import { TextField, Button } from "@mui/material";
import { useState } from "react";

const MyPlace = () => {
  const [text, setText] = useState("");
  return (
    <>
      <h1 className="font-bold text-2xl">마이 플레이스 블로그 리뷰 작성</h1>

      <p className="mt-10 text-lg">
        {`1. "파트원 사진 모음" 폴더에 들어가 사진을 5~15장 이내로 선택해 "사용한
        파트원 사진 모음" 으로 이동시킵니다.`}
      </p>
      <p className="mt-20 text-lg">
        {`2. 마이 플레이스에 이동해 "블로그 리뷰" 버튼을 클릭해준다.`}
      </p>
      <p className="mt-1 text-sm">아이디: MY01048913765 비밀번호 동일</p>
      <Button
        variant="contained"
        onClick={() => window.open("http://m-place.kr", "_blank")}
        fullWidth
        className="mt-1"
      >
        마이플레이스로 이동
      </Button>

      <p className="mt-20 text-lg">
        {`3. 이미지 불러오기 버튼을 클릭해 "사용한 파트원 사진 모음" 폴더 중
        오늘자 선택한 사진들을 업로드하고, 원하는 순서대로 정렬한다.`}
      </p>
      <p className="mt-20 text-lg mb-1">
        {`4. 아래 형식과 같이 입력해준 후, 복사하기 클릭하고 챗지피티에
        작성해달라고 한다.`}
      </p>
      <p className="text-sm mt-1 whitespace-pre-line mb-4">{`[1번] 펜션 방 내부 사진. 깨끗함 강조\n\n[2번] 토끼들 사진. 토끼들이 귀엽고, 사장님이 친절하게 보여줬다.`}</p>
      <TextField
        value={text}
        onChange={(e) => setText(e.target.value)}
        multiline
        rows={9}
        fullWidth
      />
      <Button
        variant="contained"
        onClick={() =>
          navigator.clipboard.writeText(
            `아래의 사진들을 바탕으로 “블로그 후기 작성 가이드라인”을 만들어줘. 실제 블로그 후기의 말투를 사용해. [n번] 옆의 문구는 사진 설명이야. 각 사진 순서대로 이야기를 만들고, 아래의 사진 설명은 지우지마. 전체 내용이 700자 이내여야 하며, 형식을 수정하지 마.\n\n${text}`
          )
        }
        fullWidth
        className="mt-5"
      >
        복사하기
      </Button>
      <Button
        variant="contained"
        onClick={() => window.open("https://chatgpt.com/", "_blank")}
        fullWidth
        className="mt-2"
        color="secondary"
      >
        챗지피티로 이동
      </Button>

      <p className="mt-20 text-lg mb-1">
        {`5. 챗지피티가 대답한 내용을 복사 후, 마이플레이스의 "작성 가이드라인"
        부분에 붙혀넣기 해주고, 아래 "필수문구 복사하기" 버튼을 클릭 후,
        마이플레이스 "작성 가이드라인" 최상단에 붙혀넣기 해준다.`}
      </p>
      <Button
        variant="contained"
        onClick={() =>
          navigator.clipboard.writeText(
            `* 차량 번호판, 얼굴은 꼭 모자이크 처리 부탁드립니다.
*  ‘소정의 원고료’ 문구는 넣지 말아주세요.
*  아래 내용은 참고용입니다. 문구를 그대로 쓰실 필요는 없고, 블로그 스타일에 맞게 자유롭게 풀어주셔도 됩니다.`
          )
        }
        fullWidth
        className="mt-1"
      >
        필수문구 복사하기
      </Button>

      <p className="mt-20 text-lg mb-1">
        {`6. 마이플레이스에 "썸네일 이미지 번호"를 선택하고, 제출해준다.`}
      </p>
    </>
  );
};

export default MyPlace;
