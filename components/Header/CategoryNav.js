import { createServerSupabaseClient } from "@/utils/supabase/server";
import Link from "next/link";

const CategoryNav = async ({ selectedCategoryId }) => {
  const supabase = await createServerSupabaseClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("order", { ascending: true });

  return (
    <ul className="flex ">
      {categories.map((item, index) => (
        <Link
          key={index}
          href={`/category/${item.id}`}
          aria-label="카테고리로 이동"
        >
          <li
            key={index}
            className="px-3 md:px-6 pt-2 text-center cursor-pointer hover:text-indigo-200 "
          >
            <p
              className={`text-md pb-1 ${
                selectedCategoryId?.toString() === item.id.toString()
                  ? "font-bold border-b-2 "
                  : ""
              }`}
            >
              {item.name}
            </p>
          </li>
        </Link>
      ))}
    </ul>
  );
};

export default CategoryNav;
