"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../category/service";
import { useState } from "react";
import { Checkbox, Button } from "@mui/material";
import { useEffect } from "react";
import { createBrowserSupabaseClient } from "@/utils/supabase/client";

const MainPage = () => {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const supabase = await createBrowserSupabaseClient();
    const { data } = await supabase
      .from("settings")
      .select("data")
      .eq("type", "main_article_category_ids")
      .maybeSingle();

    if (data?.data) {
      setSelectedCategories(data.data);
    }

    setInitialLoading(false);
  };
  const handleCategoryChange = (id) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter((cat) => cat !== id));
    } else {
      setSelectedCategories([...selectedCategories, id]);
    }
  };

  const [saving, setSaving] = useState(false);
  const handleSave = async () => {
    if (selectedCategories.length < 3) {
      alert("매인페이지에 노출할 카테고리는 3개 이상 선택해야합니다.");
      return;
    }
    setSaving(true);

    const supabase = await createBrowserSupabaseClient();
    const { error } = await supabase
      .from("settings")
      .update({
        data: selectedCategories,
      })
      .eq("type", "main_article_category_ids");
    if (error) {
      alert("저장 실패");
      console.error(error);
      return;
    }
    setSaving(false);
  };

  if (initialLoading) return <p>Loading...</p>;
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">메인페이지 관리</h2>
      <h3 className="text-lg font-bold">메인페이지에 노출할 카테고리 선택</h3>
      <div className="flex flex-wrap">
        {categories?.map((cat) => (
          <div key={cat.id} className="flex items-center mr-5">
            <Checkbox
              checked={selectedCategories.includes(cat.id)}
              onChange={() => handleCategoryChange(cat.id)}
            />
            <p>{cat.name}</p>
          </div>
        ))}
      </div>

      <Button variant="contained" onClick={handleSave} disabled={saving}>
        {saving ? "저장 중.." : "저장"}
      </Button>
    </div>
  );
};

export default MainPage;
