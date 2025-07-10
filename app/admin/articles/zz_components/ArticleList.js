import { useState } from "react";
import {
  fetchArticlesWithPage,
  publishArticle,
  updateBreakingNews,
  updateEditorPick,
  updateHeadline,
} from "../service";
import { useEffect } from "react";
import Link from "next/link";
import { Button, Checkbox } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const ArticleList = ({ page }) => {
  const [filter, setFilter] = useState("");
  const queryClient = useQueryClient();
  const { data: articles, isLoading } = useQuery({
    queryKey: ["articles", page, filter],
    queryFn: () => fetchArticlesWithPage(page, filter),
  });
  const publishedMutation = useMutation({
    mutationFn: ({ id, isPublished }) => publishArticle(id, isPublished),
    onSuccess: () => queryClient.invalidateQueries(["articles", page, filter]),
  });
  const headlineMutation = useMutation({
    mutationFn: ({ id, isHeadline }) => updateHeadline(id, isHeadline),
    onSuccess: () => queryClient.invalidateQueries(["articles", page, filter]),
  });
  const editorPickMutation = useMutation({
    mutationFn: ({ id, isEditorPick }) => updateEditorPick(id, isEditorPick),
    onSuccess: () => queryClient.invalidateQueries(["articles", page, filter]),
  });
  const breakingNewsMutation = useMutation({
    mutationFn: ({ id, isBreakingNews }) =>
      updateBreakingNews(id, isBreakingNews),
    onSuccess: () => queryClient.invalidateQueries(["articles", page, filter]),
  });

  // const [articles, setArticles] = useState([]);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   fetchArticles(page);
  // }, [page]);
  // const fetchArticles = async (page) => {
  //   const articles = await fetchArticlesWithPage(page);
  //   setArticles(articles);
  //   setLoading(false);
  // };

  const onCheck = (isChecked, type) => {
    if (isChecked) setFilter(type);
    else setFilter("");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex flex-wrap items-center">
        <Checkbox
          checked={filter === "is_headline"}
          onChange={(e) => onCheck(e.target.checked, "is_headline")}
        />
        <p>헤드라인 만</p>
        <Checkbox
          checked={filter === "is_editor_pick"}
          onChange={(e) => onCheck(e.target.checked, "is_editor_pick")}
        />
        <p>에디터픽 만</p>
        <Checkbox
          checked={filter === "is_breaking_news"}
          onChange={(e) => onCheck(e.target.checked, "is_breaking_news")}
        />
        <p>속보 만</p>
      </div>
      {articles?.map((article) => (
        <div
          key={article.id}
          className="p-4 border-b cursor-pointer 
            hover:bg-gray-400 hover:bg-opacity-50
              flex justify-between flex-col md:flex-row
            "
        >
          <Link href={`/admin/articles/${article.id}`} key={article.id}>
            <div>
              <h2 className="text-lg font-bold">{article.title}</h2>
              <p className="text-sm">
                {new Date(article.created_at).toLocaleDateString()}
              </p>
              <div className="flex items-center">
                {article.is_headline && (
                  <p className="text-purple-300 mr-4 font-bold">헤드라인</p>
                )}
                {article.is_breaking_news && (
                  <p className="text-purple-300 mr-4 font-bold">속보</p>
                )}
                {article.is_editor_pick && (
                  <p className="text-purple-300 mr-4 font-bold">에디터 픽</p>
                )}
                {!article.category_id && (
                  <p className="text-red-300 mr-4 ">카테고리 없음</p>
                )}
                <p
                  className={`${
                    article.is_published ? "text-green-300" : "text-red-300"
                  } mr-4`}
                >
                  {article.is_published ? "게제 중" : "미게재"}
                </p>
                {!article.images ||
                  (article.images.length === 0 && (
                    <p className="text-red-300">이미지 없음</p>
                  ))}
              </div>
            </div>
          </Link>
          <div className="mt-4">
            <Button
              variant="contained"
              onClick={() =>
                headlineMutation.mutate({
                  id: article.id,
                  isHeadline: article.is_headline,
                })
              }
              disabled={headlineMutation.isPending}
              className={`mr-3 ${
                article.is_headline ? "bg-purple-500" : "bg-purple-300"
              }`}
            >
              {article.is_headline ? "헤드라인 해제" : "헤드라인으로"}
            </Button>
            <Button
              variant="contained"
              onClick={() =>
                editorPickMutation.mutate({
                  id: article.id,
                  isEditorPick: article.is_editor_pick,
                })
              }
              disabled={editorPickMutation.isPending}
              className={`mr-3 ${
                article.is_editor_pick ? "bg-purple-500" : "bg-purple-300"
              }`}
            >
              {article.is_editor_pick ? "에디터픽 해제" : "에디터픽으로"}
            </Button>
            <Button
              variant="contained"
              onClick={() =>
                breakingNewsMutation.mutate({
                  id: article.id,
                  isBreakingNews: article.is_breaking_news,
                })
              }
              disabled={breakingNewsMutation.isPending}
              className={`mr-3 ${
                article.is_breaking_news ? "bg-purple-500" : "bg-purple-300"
              }`}
            >
              {article.is_breaking_news ? "속보 취소" : "속보로"}
            </Button>
            <Button
              variant="contained"
              onClick={() =>
                publishedMutation.mutate({
                  id: article.id,
                  isPublished: article.is_published,
                })
              }
              disabled={publishedMutation.isPending}
              className={`mr-3 ${
                article.is_published ? "bg-red-300" : "bg-blue-300"
              }`}
            >
              {article.is_published ? "게재 취소" : "게재하기"}
            </Button>
          </div>
        </div>
      ))}
    </>
  );
};

export default ArticleList;
