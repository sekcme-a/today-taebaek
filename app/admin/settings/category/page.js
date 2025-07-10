"use client";

import { useState } from "react";
import CategoryForm from "./components/CategoryForm";
import CategoryList from "./components/CategoryList";

export default function CategoryPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold">카테고리 관리</h1>
      <CategoryForm
        selected={selectedCategory}
        onFinish={() => setSelectedCategory(null)}
      />
      <CategoryList onEdit={setSelectedCategory} />
    </div>
  );
}
