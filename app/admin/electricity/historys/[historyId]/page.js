"use client";

import { createBrowserSupabaseClient } from "@/utils/supabase/client";
import { createTheme, ThemeProvider } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { COLUMNS } from "../../columns";
import { muiDataGridKoreanText } from "../../calculator/muiDataGridKo";

const HistoryDetail = () => {
  const lightTheme = createTheme({
    palette: {
      mode: "light",
    },
  });
  const supabase = createBrowserSupabaseClient();
  const { historyId } = useParams();
  const [title, setTitle] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [rows, setRows] = useState([]);
  const [rowDetails, setRowDetails] = useState([]);
  const [columnsDetail, setColumnsDetail] = useState([]);
  useEffect(() => {
    fetchHistoryDetail();
  }, []);
  const fetchHistoryDetail = async () => {
    const { data, error } = await supabase
      .from("electricity_historys")
      .select("*")
      .eq("id", historyId)
      .single();
    if (error) {
      alert("전기세 기록을 불러오는 데 실패했습니다. 다시 시도해주세요.");
      console.error("Error fetching history detail:", error);
      return;
    }
    setTitle(data.title);
    setCreatedAt(new Date(data.created_at).toLocaleDateString());
    setRows(data.data || []);
    setRowDetails(data.data_detail || []);
    // id 제외하고 컬럼 이름만 가져오기
    const keys = Object.keys(data.data_detail[0]).filter((k) => k !== "id");

    // columnsDetail 생성
    const cd = [
      { field: "id", headerName: "항목", flex: 1 },
      ...keys.map((key) => ({ field: key, headerName: key, flex: 1 })),
    ];
    setColumnsDetail(cd);
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">전기세 기록 상세</h1>
      <p className="font-bold text-lg">{title}</p>
      <p className="mt-1 text-sm">{createdAt}</p>
      {/* 여기에 전기세 기록 상세 정보를 표시하는 컴포넌트를 추가하세요. */}

      <DataGrid
        columns={COLUMNS}
        rows={rows}
        className="mt-5"
        showToolbar
        localeText={muiDataGridKoreanText}
        slotProps={{
          toolbar: {
            csvOptions: {
              fileName: `전기세_${title}`,
            },
          },
        }}
      />
      {columnsDetail && (
        <DataGrid
          columns={columnsDetail}
          rows={rowDetails}
          className="mt-5"
          showToolbar
          localeText={muiDataGridKoreanText}
          slotProps={{
            toolbar: {
              csvOptions: {
                fileName: `전기세_${title}`,
              },
            },
          }}
          getRowClassName={(params) =>
            params.row.id === "전기요금계"
              ? "bg-sky-800"
              : params.row.id === "총금액"
              ? "bg-sky-900"
              : ""
          }
        />
      )}
    </div>
  );
};
export default HistoryDetail;
