"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";

// Supabase 클라이언트 초기화
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const columns = [
  { field: "room_number", headerName: "방 호수", width: 100 },
  { field: "tenant_name", headerName: "성함", width: 150 },
  { field: "phone_number", headerName: "전화번호", width: 150 },
  { field: "occupants", headerName: "인원", type: "number", width: 80 },
  { field: "rent_price", headerName: "월세 가격", type: "number", width: 120 },
  {
    field: "start_date",
    headerName: "월세 시작일",
    type: "date",
    width: 150,
    valueGetter: (params) => (params ? new Date(params) : null),
  },
  { field: "realtor_name", headerName: "부동산 명", width: 150 },
  { field: "deposit", headerName: "보증금", type: "number", width: 120 },
  {
    field: "tax_invoice_status",
    headerName: "세금계산서",
    type: "boolean",
    width: 120,
  },
  { field: "payment_day", headerName: "입금일", type: "number", width: 80 },
  {
    field: "utility_bill_status",
    headerName: "전기세 계산서",
    type: "boolean",
    width: 120,
  },
  {
    field: "payment_status",
    headerName: "입금 상태",
    width: 100,
    valueGetter: (params) =>
      params ? "입금완료" : params === false ? "미입금" : "-",
  },
  { field: "memo", headerName: "메모", flex: 1 },
];

export default function RentManagement() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);

  // 🐛 디버깅을 위해 현재 날짜를 저장하는 상태 추가
  const [mockDate, setMockDate] = useState(new Date());

  // 🐛 mockDate가 변경될 때마다 데이터를 다시 불러와서 로직을 실행
  useEffect(() => {
    fetchRentalsAndProcess();
  }, [mockDate]);

  // 🐛 날짜 입력 필드의 변경을 처리하는 함수
  const handleDateChange = (e) => {
    // 사용자가 YYYY-MM-DD 형식으로 입력한 날짜를 Date 객체로 변환
    const newDate = new Date(e.target.value);
    // 유효한 날짜인 경우에만 상태 업데이트
    if (!isNaN(newDate.getTime())) {
      setMockDate(newDate);
    }
  };

  const fetchRentalsAndProcess = async () => {
    const { data, error } = await supabase
      .from("rentals")
      .select("*")
      .order("room_number", { ascending: true });
    if (error) {
      console.error("Error fetching rentals:", error);
      return;
    }

    // 🐛 new Date() 대신 mockDate 상태 사용
    const today = mockDate;
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const todayDay = today.getDate();

    const updates = data.map((row) => {
      if (row.payment_day) {
        const lastDayOfMonth = new Date(
          currentYear,
          currentMonth + 1,
          0
        ).getDate();
        const dueDay = Math.min(row.payment_day, lastDayOfMonth);

        // 🐛 날짜 비교 로직에 mockDate 적용
        if (todayDay !== dueDay && row.payment_status === true) {
          return { ...row, payment_status: null };
        }

        // 🐛 날짜 비교 로직에 mockDate 적용
        if (todayDay === dueDay && row.payment_status === null) {
          return { ...row, payment_status: false };
        }
      }
      return row;
    });

    if (updates.length > 0) {
      const { error: updateError } = await supabase
        .from("rentals")
        .upsert(updates);

      if (updateError) {
        console.error("Error updating payment status:", updateError);
      } else {
        const { data: updatedData } = await supabase
          .from("rentals")
          .select("*");
        setRows(updatedData);
        return;
      }
    }

    setRows(data);
  };

  const isDueToday = (row) => {
    if (!row.payment_day) return false;

    // 🐛 new Date() 대신 mockDate 상태 사용
    const today = mockDate;
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const dueDay = Math.min(row.payment_day, lastDayOfMonth);
    const todayDay = today.getDate();

    // 🐛 날짜 비교 로직에 mockDate 적용
    return todayDay === dueDay && row.payment_status === false;
  };

  const getRowClassName = (params) => {
    return isDueToday(params.row)
      ? "bg-blue-950"
      : params.row.payment_status === false
      ? "bg-red-950"
      : "";
  };

  const handleAddClick = () => {
    setFormData({
      tax_invoice_status: false,
      utility_bill_status: false,
      payment_status: null,
    });
    setEditingId(null);
    setOpen(true);
  };

  const handleRowClick = (params) => {
    setFormData(params.row);
    setEditingId(params.row.id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await supabase.from("rentals").update(formData).eq("id", editingId);
      } else {
        await supabase.from("rentals").insert(formData);
      }
      fetchRentalsAndProcess();
      handleClose();
    } catch (error) {
      console.error("Error saving rental:", error);
    }
  };

  const handleProcessPayment = async () => {
    if (window.confirm("입금 처리를 완료하시겠습니까?")) {
      try {
        await supabase
          .from("rentals")
          .update({ payment_status: true })
          .eq("id", editingId);
        fetchRentalsAndProcess();
        handleClose();
      } catch (error) {
        console.error("Error processing payment:", error);
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm("정말로 이 방을 삭제하시겠습니까?")) {
      try {
        await supabase.from("rentals").delete().eq("id", editingId);
        fetchRentalsAndProcess();
        handleClose();
      } catch (error) {
        console.error("Error deleting rental:", error);
      }
    }
  };

  const handleEmpty = async () => {
    if (
      window.confirm(
        "정말로 이 방의 정보를 비우시겠습니까? 방 호수는 유지됩니다."
      )
    ) {
      try {
        const emptyData = {
          room_number: formData.room_number,
          tenant_name: null,
          phone_number: null,
          occupants: null,
          rent_price: null,
          start_date: null,
          realtor_name: null,
          deposit: null,
          tax_invoice_status: false,
          payment_day: null,
          utility_bill_status: false,
          payment_status: false,
          memo: null,
        };
        await supabase.from("rentals").update(emptyData).eq("id", editingId);
        fetchRentalsAndProcess();
        handleClose();
      } catch (error) {
        console.error("Error emptying rental data:", error);
      }
    }
  };

  return (
    <div style={{ height: 600, width: "100%", padding: "20px" }}>
      {/* 🐛 디버깅을 위한 날짜 조정 TextField 추가 */}
      {/* <TextField
        label="오늘의 날짜 설정 (YYYY-MM-DD)"
        type="date"
        value={mockDate.toISOString().split("T")[0]}
        onChange={handleDateChange}
        InputLabelProps={{ shrink: true }}
        style={{ marginBottom: "20px" }}
      /> */}
      <Button
        variant="contained"
        onClick={handleAddClick}
        style={{ marginBottom: "20px", marginLeft: "20px" }}
      >
        방 추가
      </Button>
      <DataGrid
        rows={rows}
        columns={columns}
        onRowClick={handleRowClick}
        getRowId={(row) => row.id}
        getRowClassName={getRowClassName}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingId ? "방 정보 편집" : "방 추가"}</DialogTitle>
        <DialogContent>
          <TextField
            label="방 호수"
            name="room_number"
            value={formData.room_number || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="성함"
            name="tenant_name"
            value={formData.tenant_name || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="전화번호"
            name="phone_number"
            value={formData.phone_number || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="인원"
            name="occupants"
            type="number"
            value={formData.occupants || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="월세 가격"
            name="rent_price"
            type="number"
            value={formData.rent_price || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="월세 시작일"
            name="start_date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.start_date ? formData.start_date.split("T")[0] : ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="부동산 명"
            name="realtor_name"
            value={formData.realtor_name || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="보증금"
            name="deposit"
            type="number"
            value={formData.deposit || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <label style={{ display: "block", marginTop: "16px" }}>
            <input
              type="checkbox"
              name="tax_invoice_status"
              checked={formData.tax_invoice_status || false}
              onChange={handleChange}
            />
            세금계산서 여부
          </label>
          <TextField
            label="입금일 (매달)"
            name="payment_day"
            type="number"
            value={formData.payment_day || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <label style={{ display: "block", marginTop: "16px" }}>
            <input
              type="checkbox"
              name="utility_bill_status"
              checked={formData.utility_bill_status || false}
              onChange={handleChange}
            />
            전기세 계산서 여부
          </label>
          <TextField
            label="메모"
            name="memo"
            value={formData.memo || ""}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          {editingId && (
            <>
              {formData.payment_status === false && (
                <Button
                  onClick={handleProcessPayment}
                  variant="contained"
                  color="success"
                  sx={{ mr: 1 }}
                >
                  입금처리
                </Button>
              )}
              <Button
                onClick={handleEmpty}
                variant="outlined"
                color="warning"
                sx={{ mr: 1 }}
              >
                방 비우기
              </Button>
              <Button
                onClick={handleDelete}
                variant="outlined"
                color="error"
                sx={{ mr: 1 }}
              >
                방 삭제
              </Button>
            </>
          )}
          <Button onClick={handleClose}>취소</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingId ? "저장" : "추가"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
