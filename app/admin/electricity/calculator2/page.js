"use client";

import { createBrowserSupabaseClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import { ROOM } from "./room";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { COLUMNS } from "./columns"; // 총합 DataGrid용
import { muiDataGridKoreanText } from "./muiDataGridKo";

const Calculator = () => {
  const supabase = createBrowserSupabaseClient();
  const [openDialog, setOpenDialog] = useState("");
  const [roomHistories, setRoomHistories] = useState({});
  const [rows, setRows] = useState([]);
  const [rowsDetail, setRowsDetail] = useState([]);

  const [kwh, setKwh] = useState("");
  const [date, setDate] = useState("");
  const [startUsage, setStartUsage] = useState(null);
  const [endUsage, setEndUsage] = useState(null);

  const [roomUsage, setRoomUsage] = useState({});
  const [selectedUsages, setSelectedUsages] = useState({});

  const [title, setTitle] = useState("");

  const numberFormat = (num) => new Intl.NumberFormat().format(num);

  const timestamptzToYYYYMMDD = (ts) => {
    const date = new Date(ts);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
  };

  useEffect(() => {
    if (openDialog !== "") {
      const fetchHistory = async () => {
        const { data } = await supabase
          .from("electricity_usages")
          .select("*")
          .eq("room", openDialog)
          .order("used_at", { ascending: true });

        if (data) {
          setRoomHistories((prev) => ({
            ...prev,
            [openDialog]: data,
          }));
        }
      };
      fetchHistory();
      setStartUsage(null);
      setEndUsage(null);
    }
  }, [openDialog]);

  const calculateMonthlyUsage = (start, end, allHistory) => {
    const filtered = allHistory
      .filter(
        (item) =>
          new Date(item.used_at) >= new Date(start.used_at) &&
          new Date(item.used_at) <= new Date(end.used_at)
      )
      .sort((a, b) => new Date(a.used_at) - new Date(b.used_at));

    // 시작/끝 포함해서 계산할 레코드 배열
    const records = [
      start,
      ...filtered.filter((f) => f.id !== start.id && f.id !== end.id),
      end,
    ];

    let monthlyUsage = {};

    for (let i = 0; i < records.length - 1; i++) {
      const current = records[i];
      const next = records[i + 1];

      // 두 지점 사용량 차이
      const used = next.kwh - current.kwh;

      const curDate = new Date(current.used_at);
      const nextDate = new Date(next.used_at);

      // ✅ next가 "그 달의 1일"인 경우 → 분리 기준으로 사용
      if (nextDate.getDate() === 1) {
        const month = curDate.getMonth() + 1;
        monthlyUsage[month] = (monthlyUsage[month] || 0) + used;
      }
      // ✅ current가 "그 달의 1일"인 경우 → 다음 달 사용량으로 처리
      else if (curDate.getDate() === 1) {
        const month = curDate.getMonth() + 1;
        monthlyUsage[month] = (monthlyUsage[month] || 0) + used;
      }
      // ✅ 일반 구간은 그냥 next의 달로 처리
      else {
        const month = nextDate.getMonth() + 1;
        monthlyUsage[month] = (monthlyUsage[month] || 0) + used;
      }
    }

    return monthlyUsage;
  };

  const handleSelectUsage = (item) => {
    let newStart = startUsage;
    let newEnd = endUsage;

    if (!startUsage) newStart = item;
    else if (!endUsage) newEnd = item;
    else {
      newStart = item;
      newEnd = null;
    }

    setStartUsage(newStart);
    setEndUsage(newEnd);

    if (newStart && newEnd) {
      const monthly = calculateMonthlyUsage(
        newStart,
        newEnd,
        roomHistories[openDialog] || []
      );
      setRoomUsage((prev) => ({
        ...prev,
        [openDialog]: monthly,
      }));
      setSelectedUsages((prev) => ({
        ...prev,
        [openDialog]: { startUsage: newStart, endUsage: newEnd },
      }));
    }
  };

  const handleCalculateAll = async () => {
    if (Object.keys(selectedUsages).length === 0) return;

    const { data: settings, error } = await supabase
      .from("electricity_settings")
      .select("*");
    if (error) {
      console.error(error);
      return;
    }

    const newRows = [];
    const detailData = {};
    const detailFields = [
      "전력사용량(kWh)",
      "기본요금",
      "전력량요금",
      "기후환경요금",
      "연료비조정액",
      "공공전기요금",
      "전기요금계",
      "부가가치세",
      "전력기금",
      "TV수신료",
      "총금액(1원단위 절사)",
    ];

    detailFields.forEach((f) => {
      detailData[f] = { id: f };
    });

    const withDetail = (total, arr) =>
      arr && arr.length > 1
        ? `${numberFormat(total)} (${arr.join("+")})`
        : numberFormat(total);

    Object.entries(selectedUsages).forEach(
      ([room, { startUsage, endUsage }]) => {
        const monthlyUsage = calculateMonthlyUsage(
          startUsage,
          endUsage,
          roomHistories[room] || []
        );

        let energy = 0,
          gihu = 0,
          fuel = 0,
          gonggong = 0,
          fund = 0,
          total_kwh = 0;

        // ✅ 기본요금, TV수신료는 전체에서 1번만 적용
        let basicPriceTotal = 0;
        let tvTotal = 0;

        const monthlyTotals = [];
        const energyArr = [];
        const gihuArr = [];
        const kwhArr = [];
        const fuelArr = [];
        const gonggongArr = [];
        const vatArr = [];
        const fundArr = [];
        const totalBeforeTaxArr = [];

        // 월별 요금 계산 (기본요금, TV 제외)
        Object.entries(monthlyUsage).forEach(([monthStr, kwhUsed]) => {
          const month = parseInt(monthStr);
          const setting = settings.find((s) => s.month === month);
          if (!setting) {
            console.warn(`${month}월의 요금 설정이 없습니다.`);
            return;
          }

          const en = Math.floor(kwhUsed * setting.price_per_kwh);
          const gi = Math.floor(kwhUsed * setting.gihu);
          const fu = Math.floor(kwhUsed * setting.fuel);
          const subtotal = en + gi + fu;
          const gg = Math.floor(subtotal * (setting.gonggong / 100));
          const fuFund = Math.floor(subtotal * (setting.fund / 100));

          // ⚡ 기본요금, TV수신료는 월별로 더하지 않음 (전체에서 1회 적용)
          const totalBeforeTaxM = en + gi + fu + gg;
          const vatM = Math.floor(totalBeforeTaxM * 0.1);
          const totalM = Math.floor(totalBeforeTaxM + vatM + fuFund);

          monthlyTotals.push(numberFormat(totalM));
          energyArr.push(numberFormat(en));
          gihuArr.push(numberFormat(gi));
          kwhArr.push(numberFormat(kwhUsed));
          fuelArr.push(numberFormat(fu));
          gonggongArr.push(numberFormat(gg));
          vatArr.push(numberFormat(vatM));
          fundArr.push(numberFormat(fuFund));
          totalBeforeTaxArr.push(numberFormat(totalBeforeTaxM));

          energy += en;
          gihu += gi;
          fuel += fu;
          gonggong += gg;
          fund += fuFund;
          total_kwh += kwhUsed;

          // ✅ 하나의 월 설정값에서 기본요금과 TV를 1번만 가져옴
          if (basicPriceTotal === 0) {
            basicPriceTotal = setting.basic_price;
          }
          if (tvTotal === 0) {
            tvTotal = setting.tv;
          }
        });

        const vat = Math.floor(
          (basicPriceTotal + energy + gihu + fuel + gonggong) * 0.1
        );
        const finalTotal =
          Math.floor(
            (basicPriceTotal +
              energy +
              gihu +
              fuel +
              gonggong +
              vat +
              fund +
              tvTotal) /
              10
          ) * 10;

        const displayTotal = numberFormat(finalTotal);

        newRows.push({
          id: `${room}_${Date.now()}`,
          room,
          kwh: total_kwh,
          price: numberFormat(finalTotal),
        });

        detailData["전력사용량(kWh)"][room] = withDetail(total_kwh, kwhArr);
        detailData["기본요금"][room] = numberFormat(basicPriceTotal); // ✅ 1번만
        detailData["전력량요금"][room] = withDetail(energy, energyArr);
        detailData["기후환경요금"][room] = withDetail(gihu, gihuArr);
        detailData["연료비조정액"][room] = withDetail(fuel, fuelArr);
        detailData["공공전기요금"][room] = withDetail(gonggong, gonggongArr);
        detailData["전기요금계"][room] = numberFormat(
          energy + gihu + fuel + gonggong + basicPriceTotal,
          totalBeforeTaxArr
        );
        detailData["부가가치세"][room] = numberFormat(vat, vatArr);
        detailData["전력기금"][room] = withDetail(fund, fundArr);
        detailData["TV수신료"][room] = numberFormat(tvTotal); // ✅ 1번만
        detailData["총금액(1원단위 절사)"][room] = displayTotal;
      }
    );

    setRows(newRows);
    setRowsDetail(Object.values(detailData));
  };

  const columnsDetail = [
    { field: "id", headerName: "항목", flex: 1 },
    ...Object.keys(selectedUsages).map((r) => ({
      field: r,
      headerName: r,
      flex: 1,
    })),
  ];

  return (
    <div className="p-4 relative overflow-hidden w-screen">
      <h1 className="text-2xl font-bold mb-4">전기세 계산기</h1>
      <p className="mb-4">방별 사용량을 계산하고 DataGrid로 표시합니다.</p>

      <div className="mt-5 grid grid-cols-4 gap-3">
        {ROOM.map((room) => (
          <div
            key={room}
            className="border-[1px] p-3 rounded-lg cursor-pointer flex justify-between hover:bg-gray-900 transition-colors"
            onClick={() => setOpenDialog(room)}
          >
            <span>{room}</span>
            {roomUsage[room] && (
              <strong>
                {Object.entries(roomUsage[room])
                  .map(([m, u]) => `${m}월 ${numberFormat(u)}kWh`)
                  .join(", ")}
              </strong>
            )}
          </div>
        ))}
      </div>

      <Button
        variant="contained"
        className="mt-4"
        fullWidth
        onClick={handleCalculateAll}
        disabled={Object.keys(selectedUsages).length === 0}
      >
        선택된 방 사용량 계산
      </Button>

      {/* 총합 DataGrid */}
      <DataGrid
        columns={COLUMNS}
        rows={rows}
        className="mt-5"
        autoHeight
        localeText={muiDataGridKoreanText}
        showToolbar
        slotProps={{
          toolbar: {
            csvOptions: {
              fileName: `전기세_${new Date().toLocaleDateString()}`,
            },
          },
        }}
      />

      {/* 상세 요금 DataGrid */}
      <DataGrid
        columns={columnsDetail}
        rows={rowsDetail}
        className="mt-5"
        autoHeight
        localeText={muiDataGridKoreanText}
        showToolbar
        slotProps={{
          toolbar: {
            csvOptions: {
              fileName: `전기세 상세_${new Date().toLocaleDateString()}`,
            },
          },
        }}
        getRowClassName={(params) =>
          params.row.id === "전기요금계"
            ? "bg-gray-700"
            : params.row.id === "총금액(1원단위 절사)"
            ? "bg-blue-900"
            : ""
        }
      />

      <TextField
        variant="outlined"
        label="제목"
        fullWidth
        className="mt-4"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Button
        variant="contained"
        className="mt-4"
        fullWidth
        disabled={!title.trim()}
        onClick={async () => {
          const { error } = await supabase.from("electricity_historys").insert({
            title: title.trim(),
            data: rows,
            data_detail: rowsDetail,
          });

          if (error) {
            console.error("저장 실패:", error.message);
          } else {
            alert("저장되었습니다.");
            setTitle("");
          }
        }}
      >
        저장
      </Button>

      {/* Dialog */}
      <Dialog open={!!openDialog} onClose={() => setOpenDialog("")} fullWidth>
        <DialogTitle>{openDialog} 전기 측정 선택</DialogTitle>
        <DialogContent>
          <p className="font-bold">측정 기록 선택 (시작/종료)</p>
          <p className="font-bold">*반드시 1달씩 측정해주세요!</p>
          <div className="mt-2 space-y-1">
            {(roomHistories[openDialog] || []).map((item, index) => (
              <div className="flex" key={index}>
                <div
                  className={`border-[1px] border-gray-300 p-1 pl-3 rounded-lg cursor-pointer transition-colors flex-1 ${
                    startUsage?.id === item.id || endUsage?.id === item.id
                      ? "bg-blue-200"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleSelectUsage(item)}
                >
                  <p>
                    측정일: {timestamptzToYYYYMMDD(item.used_at)}{" "}
                    <strong className="ml-5">누적 {item.kwh} kWh</strong>
                  </p>
                </div>
                <Button
                  variant="text"
                  color="error"
                  onClick={async () => {
                    if (!confirm("정말로 삭제하시겠습니까?")) return;
                    // Supabase에서 삭제
                    const { error } = await supabase
                      .from("electricity_usages")
                      .delete()
                      .eq("id", item.id);

                    if (!error) {
                      // 상태에서도 제거
                      setRoomHistories((prev) => ({
                        ...prev,
                        [openDialog]: prev[openDialog].filter(
                          (i) => i.id !== item.id
                        ),
                      }));

                      // 선택되어 있던 경우 초기화
                      if (startUsage?.id === item.id) setStartUsage(null);
                      if (endUsage?.id === item.id) setEndUsage(null);
                    } else {
                      console.error("삭제 실패:", error.message);
                    }
                  }}
                >
                  삭제
                </Button>
              </div>
            ))}
          </div>

          <hr className="my-4" />

          <p>측정 추가</p>
          <TextField
            variant="outlined"
            label="누적 kWh"
            className="mt-2"
            fullWidth
            value={kwh}
            onChange={(e) => setKwh(e.target.value)}
          />
          <TextField
            variant="outlined"
            label="측정 날짜 (YYYYMMDD)"
            className="mt-2"
            fullWidth
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Button
            variant="contained"
            className="mt-2"
            disabled={!kwh || !date}
            fullWidth
            onClick={async () => {
              if (kwh.trim() === "") {
                alert("유효한 kWh 값을 입력해주세요.");
                return;
              }
              if (!/^\d{8}$/.test(date)) {
                alert("날짜는 YYYYMMDD 형식으로 입력해주세요.");
                return;
              }
              const formatted = `${date.slice(0, 4)}-${date.slice(
                4,
                6
              )}-${date.slice(6, 8)}`;
              const dateObj = new Date(formatted);
              const { error } = await supabase
                .from("electricity_usages")
                .insert([
                  { room: openDialog, kwh: parseFloat(kwh), used_at: dateObj },
                ]);
              if (!error) {
                setRoomHistories((prev) => ({
                  ...prev,
                  [openDialog]: [
                    {
                      room: openDialog,
                      kwh: parseFloat(kwh),
                      used_at: dateObj,
                    },
                    ...(prev[openDialog] || []),
                  ],
                }));
                setKwh("");
                setDate("");
              }
            }}
          >
            추가
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calculator;
