"use client";
import { Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import AnsanRoom from "./componets/AnsanRoom";

const todayDate = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1 필요
  const day = String(today.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
};
export default function CrawledLinks() {
  const [posts, setPosts] = useState([]);
  const [start, setStart] = useState(todayDate());
  const [end, setEnd] = useState(todayDate());
  const [startPage, setStartPage] = useState("0");
  const [loading, setLoading] = useState(false);

  const [openRoom, setOpenRoom] = useState(false);

  const handleCrawl = async () => {
    try {
      if (new Date(start) > new Date(end)) {
        alert("시작일이 종료일보다 큽니다.");
        return;
      }
      setLoading(true);
      const res = await fetch(
        `/api/ansan?start=${start}&end=${end}&page=${startPage}`
      );
      const data = await res.json();
      console.log(data);
      setPosts(data.articles);
      setLoading(false);
    } catch (e) {
      alert("너무 오래걸립니다. 시작페이지를 조정해주세요.");
      alert(e);
    }
  };

  if (openRoom) return <AnsanRoom setOpenRoom={setOpenRoom} posts={posts} />;
  return (
    <div className="p-5">
      <p>형식에 맞게! 입력해주세요.</p>
      <div className="mt-2" />
      <TextField
        fullWidth
        label="시작"
        placeholder="2025-09-13"
        value={start}
        onChange={(e) => setStart(e.target.value)}
      />
      <div className="mt-4" />
      <TextField
        fullWidth
        label="끝"
        placeholder="2025-09-13"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
      />
      <div className="mt-4" />
      <TextField
        fullWidth
        label="페이지 고정"
        placeholder="검색을 시작할 목차 페이지 고정"
        value={startPage}
        onChange={(e) => setStartPage(e.target.value)}
      />
      <div className="mt-4" />
      {/* <Button variant="contained"
        onClick={() =>
          window.open(
            "http://www.asinews.co.kr/adm/news/addArticleForm.do?vStartP=123415184",
            "_blank"
          )
        }
        fullWidth
        style={{ marginBottom: 10 }}
      >
        기사 등록 페이지 열기
      </Button> */}
      <Button
        variant="contained"
        onClick={handleCrawl}
        fullWidth
        disabled={loading}
      >
        {loading ? "받아오는 중 " : "크롤링"}
      </Button>
      {posts.length > 0 && (
        <Button
          variant="contained"
          onClick={() => setOpenRoom(true)}
          fullWidth
          className="mt-3"
        >
          이동
        </Button>
      )}
      <h1 className="text-2xl font-bold mt-10">크롤링된 링크</h1>
      <p>총{posts?.length}개</p>
      <ul>
        {posts.map((post, idx) => (
          <li key={idx} className="py-5">
            {/* <strong>{link.text}</strong>
            <br />
            <code>{link.onClick}</code> */}
            <p>{post.title}</p>
            {/* <p>{post.content}</p>
            <p>{post.images[0]}</p> */}
          </li>
        ))}
      </ul>
    </div>
  );
}
