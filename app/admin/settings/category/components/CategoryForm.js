"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { updateCategory, addCategory } from "../service";

import { TextField, Button } from "@mui/material";

export default function CategoryForm({ selected, onFinish }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [order, setOrder] = useState(1);

  useEffect(() => {
    if (selected) {
      setName(selected.name);
      setOrder(selected.order);
    } else {
      setName("");
      setOrder(1);
    }
  }, [selected]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (selected) {
        return updateCategory(selected.id, name, order);
      } else {
        return addCategory(name, order);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      onFinish();
    },
  });

  const handleSubmit = () => {
    if (!name.trim()) {
      alert("카테고리 이름을 입력해 주세요!");
      return;
    } else if (!order.trim()) {
      alert("순서를 입력해주세요");
      return;
    }
    mutation.mutate();
  };

  return (
    <div className="mt-5">
      <p variant="h6" color="blue-gray" className="mb-1 font-bold text-lg">
        {selected ? "카테고리 수정" : "카테고리 추가"}
      </p>
      <p>*순서는 자연수로 입력해야합니다. 숫자대로 정렬됩니다.</p>
      <div className="flex gap-2 mt-5">
        <div className="flex-1">
          <TextField
            label="카테고리 이름"
            value={name}
            fullWidth
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="flex-1">
          <TextField
            label="순서"
            fullWidth
            type="number"
            value={order}
            onChange={(e) =>
              setOrder(e.target.value === "" ? "" : Number(e.target.value))
            }
            required
          />
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-2">
        {selected && (
          <Button variant="contained" color="error" onClick={onFinish}>
            취소
          </Button>
        )}
        <Button
          variant="contained"
          onClick={handleSubmit}
          loading={mutation.isPending}
        >
          {selected ? "수정" : "추가"}
        </Button>
      </div>
    </div>
  );
}
