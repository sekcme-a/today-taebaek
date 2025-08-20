"use client";

import { createBrowserSupabaseClient } from "@/utils/supabase/client";
import { Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";

const Settings = () => {
  const supabase = createBrowserSupabaseClient();
  const [list, setList] = useState([
    { month: 1 },
    { month: 2 },
    { month: 3 },
    { month: 4 },
    { month: 5 },
    { month: 6 },
    { month: 7 },
    { month: 8 },
    { month: 9 },
    { month: 10 },
    { month: 11 },
    { month: 12 },
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("electricity_settings")
      .select()
      .order("month", { ascending: true });
    if (error) {
      console.error("데이터 불러오기 실패:", error);
    } else {
      if (data && data.length > 0) setList(data);
    }
  };

  const handleChange = (index, field, value) => {
    const newList = [...list];
    // 빈 값이면 null, 숫자 변환 가능하면 숫자로
    newList[index][field] = value === "" ? null : Number(value);
    setList(newList);
  };

  const handleSave = async () => {
    const { error } = await supabase.from("electricity_settings").upsert(
      list.map((item) => ({
        month: item.month,
        basic_price: item.basic_price ?? 0,
        price_per_kwh: item.price_per_kwh ?? 0,
        gihu: item.gihu ?? 0,
        fuel: item.fuel ?? 0,
        fund: item.fund ?? 0,
        gonggong: item.gonggong ?? 0,
        tv: item.tv ?? 0,
      })),
      { onConflict: ["month"] } // month 가 같으면 update
    );

    if (error) {
      console.error("저장 실패:", error);
      alert("저장 실패: " + error.message);
    } else {
      alert("저장 완료!");
      fetchData();
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">전기세 설정</h1>

      <p className="">{`kWh당 요금은 구글에 "삼천리 일반용(갑)저압" 검색 후, 표 상의 "저압전력" 보면 됩니다. `}</p>
      <p className="font-bold">{`kWh당 요금은 전기세에 큰 비율을 차지하므로, 한전에 물어보는게 가장 정확.`}</p>
      <p className="">{`기후환경요금은 구글에 "삼천리 기후환경요금" 검색 후, 맨 아래보면 나옵니다.`}</p>
      <p className="">{`연료비조정액은 구글에 "삼천리 공지사항" 검색 후, "00년 0분기 전기요금 연료비조정단가 산정내역" 게시물에 "최종 연료비조정단가" 보면됩니다.`}</p>
      <p className="mb-5">{`전력기금은 구글에 "전력기금 요율" 쳐서 기사나 블로그 내용 보면 나옵니다.`}</p>
      {list.map((item, index) => {
        return (
          <div key={item.id || index} className="mb-6 p-4 border rounded-lg">
            <h2 className="font-semibold mb-2">{item.month}월</h2>
            <div className="grid grid-cols-7 gap-4">
              <TextField
                label="kWh당 요금"
                type="number"
                value={item.price_per_kwh || ""}
                onChange={(e) =>
                  handleChange(index, "price_per_kwh", e.target.value)
                }
              />
              <TextField
                label="기후환경요금(1kWh당)"
                type="number"
                value={item.gihu || ""}
                onChange={(e) => handleChange(index, "gihu", e.target.value)}
              />
              <TextField
                label="연료비 조정액(1kWh당)"
                type="number"
                value={item.fuel || ""}
                onChange={(e) => handleChange(index, "fuel", e.target.value)}
              />
              <TextField
                label="전력기금(%)"
                type="number"
                value={item.fund || ""}
                onChange={(e) => handleChange(index, "fund", e.target.value)}
              />
              <TextField
                label="공공전기요금(%)"
                type="number"
                value={item.gonggong || ""}
                onChange={(e) =>
                  handleChange(index, "gonggong", e.target.value)
                }
              />
              {index === 0 && (
                <TextField
                  label="기본요금"
                  type="number"
                  value={item.basic_price || ""}
                  onChange={(e) =>
                    handleChange(index, "basic_price", e.target.value)
                  }
                />
              )}
              {index === 0 && (
                <TextField
                  label="TV 수신료"
                  type="number"
                  value={item.tv || ""}
                  onChange={(e) => handleChange(index, "tv", e.target.value)}
                />
              )}
            </div>
          </div>
        );
      })}

      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        fullWidth
      >
        저장하기
      </Button>
    </div>
  );
};

export default Settings;
