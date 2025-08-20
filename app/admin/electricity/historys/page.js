"use client";

import { createBrowserSupabaseClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const History = () => {
  const supabase = createBrowserSupabaseClient();
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchHistory();
  }, []);
  const fetchHistory = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("electricity_historys")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      alert("전기세 기록을 불러오는 데 실패했습니다. 다시 시도해주세요.");
      console.error("Error fetching history:", error);
      setIsLoading(false);
      return;
    }
    setHistory(data);
    setIsLoading(false);
  };
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">전기세 기록</h1>
      {isLoading ? (
        <p>로딩 중...</p>
      ) : history.length > 0 ? (
        <ul className="space-y-2">
          {history.map((item) => (
            <li
              key={item.id}
              className="border p-4 rounded flex justify-between items-center
              hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
              onClick={() => {
                router.push(`/admin/electricity/historys/${item.id}`);
              }}
            >
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="text-sm">
                작성일: {new Date(item.created_at).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>전기세 기록이 없습니다.</p>
      )}
    </div>
  );
};

export default History;
