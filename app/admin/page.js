"use client";

import { Button } from "@mui/material";
// import { Button } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const router = useRouter();
  const [justify, setJustify] = useState("start");

  useEffect(() => {
    const interval = setInterval(() => {
      setJustify((prev) => (prev === "start" ? "end" : "start"));
    }, 500); // 1초마다 toggle

    return () => clearInterval(interval); // cleanup
  }, []);
  return (
    <div className="p-4">
      <Button
        onClick={() => router.push("/admin/articles")}
        variant="contained"
      >
        기사 관리
      </Button>
      <Button
        onClick={() => router.push("/admin/articles/bodo")}
        className="ml-4"
        variant="contained"
      >
        보도자료 추출
      </Button>
      <Button
        onClick={() => router.push("/admin/settings/category")}
        className="ml-4"
        variant="contained"
      >
        카테고리 관리
      </Button>
      <Button
        onClick={() => router.push("/admin/settings/mainpage")}
        className="ml-4"
        variant="contained"
      >
        메인페이지 관리
      </Button>
      <Button
        onClick={() => router.push("/admin/routine")}
        className="ml-4"
        variant="contained"
      >
        평일 루틴
      </Button>
      <Button
        onClick={() => router.push("/admin/crawling/ansan")}
        className="ml-4"
        variant="contained"
      >
        안산인터넷뉴스 업로드
      </Button>
      <Button
        onClick={() => router.push("/admin/crawling")}
        className="ml-4"
        variant="contained"
      >
        시흥인터넷뉴스 업로드
      </Button>
      <div className="mt-5">
        <Button
          onClick={() => router.push("/admin/electricity/calculator")}
          className="mr-4"
          color="secondary"
          variant="contained"
        >
          전기세 계산기
        </Button>
        <Button
          onClick={() => router.push("/admin/electricity/history")}
          className="mr-4"
          color="secondary"
          variant="contained"
        >
          전기세 기록
        </Button>
        <Button
          onClick={() => router.push("/admin/noye")}
          className="mr-4"
          color="secondary"
          variant="contained"
        >
          노예기간 계산기
        </Button>
      </div>

      <h1 className="mt-32 text-9xl font-bold text-center crazy-text">
        현서 만세
      </h1>
      {/* <h1 className="mt-32 text-9xl font-bold text-center ultimate-chaos">
        현서 만세
      </h1> */}
      {/* <div className="chaos-bg flex justify-center items-center h-screen overflow-hidden">
        <h1 className="ultimate-insanity text-9xl font-extrabold text-center uppercase">
          현서 만세
        </h1>
      </div> */}
      {/* <div className="apocalypse-bg relative w-full h-screen overflow-hidden">
        {clones.map((_, i) => (
          <h1 key={i} className={`apocalypse-text absolute`}>
            현서 만세
          </h1>
        ))}
      </div> */}
      <div
        className={`flex flex-wrap justify-${justify} transition-all duration-500 mt-10`}
      >
        {Array.from({ length: 40 }).map((_, i) => (
          <p className="text-sm mr-3" key={i}>
            {`👑 현서 만세! 👑 ヽ(＾Д＾)ﾉ`}
          </p>
        ))}
        {Array.from({ length: 40 }).map((_, i) => (
          <p className="text-sm mr-3" key={i}>
            {`＼(＾▽＾)／  🎉 현서 만세!! 🎉  ＼(＾▽＾)／`}
          </p>
        ))}
        {Array.from({ length: 40 }).map((_, i) => (
          <p className="text-sm mr-3" key={i}>
            {`🦀(ง •̀_•́)ง  현서 만세! ٩(๑❛ᴗ❛๑)۶ 🦀`}
          </p>
        ))}
        {Array.from({ length: 40 }).map((_, i) => (
          <p className="text-sm mr-3" key={i}>
            {`(｡♥‿♥｡)  현서 만세~!!  (≧◡≦) ♡`}
          </p>
        ))}
      </div>
    </div>
  );
}
