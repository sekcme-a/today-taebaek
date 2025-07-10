"use client";

import { Button } from "@mui/material";
import ArticleList from "./zz_components/ArticleList";
import Pagination from "./zz_components/Pagination";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/utils/supabase/client";

const Articles = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold">기사 관리</h1>
      <Button
        variant="contained"
        className="mt-4"
        onClick={() => router.push("/admin/articles/new")}
      >
        새 기사 작성
      </Button>
      {/* <Button
        variant="contained"
        className="mt-4"
        onClick={async () => {
          const supabase = createBrowserSupabaseClient();
          const { error } = await supabase
            .from("articles")
            .update({
              title:
                "태백시청소년수련시설, 부산진구 부전청소년센터와 함께\n‘부산다움&우리다움 속으로’ 프로그램 진행",
              view_count: 500,
            })
            // .update({ view_count: 1000 })
            .eq("id", "ed848199-7fdf-4964-a793-b668530cf6c9");
          console.log(error);
        }}
      >
        새 기사 작성
      </Button> */}
      <div className="mt-4" />
      {/* <Suspense fallback={<div>데이터를 받아오고 있습니다...</div>}>
        <ArticleList />
      </Suspense> */}

      <ArticleList page={page} />
      <Pagination {...{ page, setPage }} />
    </div>
  );
};

export default Articles;
