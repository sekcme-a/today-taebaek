"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCategories, deleteCategory } from "../service";
import { useEffect } from "react";
import { useState } from "react";
import { Button, TextField } from "@mui/material";

export default function CategoryList({ onEdit }) {
  const [pw, setPw] = useState("");
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  useEffect(() => {
    console.log("카테고리 목록:", data);
  }, [data]);

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => queryClient.invalidateQueries(["categories"]),
  });

  const handleDelete = async (id) => {
    if (!confirm("정말 삭제하시겠습니까? 삭제하지 않는것이 좋습니다.")) return;
    if (!pw) {
      alert("비밀번호를 입력해주세요.");
      return;
    }
    if (pw !== "010913") {
      alert("비밀번호가 틀립니다.");
      return;
    }

    deleteMutation.mutate(id);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <ul>
      {data?.map((cat) => (
        <li key={cat.id} className="py-1 border-b-1 border-gray-200 py-2">
          <p className="mr-4 inline">
            {cat.name} (순서: {cat.order})
          </p>
          <Button variant="contained" onClick={() => onEdit(cat)}>
            편집
          </Button>
          <Button
            variant="contained"
            onClick={() => handleDelete(cat.id)}
            color="error"
            className="ml-3"
          >
            삭제
          </Button>
        </li>
      ))}

      <div className="mb-4" />

      <TextField
        fullWidth
        label="비밀번호"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        password
      />
    </ul>
  );
}
