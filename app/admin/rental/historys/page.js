"use client";

import { useState, useEffect } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { createBrowserSupabaseClient } from "@/utils/supabase/client";
import { muiDataGridKoreanText } from "../../electricity/calculator2/muiDataGridKo";

export default function RentalHistory() {
  const supabase = createBrowserSupabaseClient();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    const { data: rentalData, error } = await supabase
      .from("rental_historys")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error(error);
    else setData(rentalData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const { error } = await supabase
      .from("rental_historys")
      .delete()
      .eq("id", id);
    if (error) console.error(error);
    else fetchData();
  };

  const handleEdit = (row) => {
    setSelectedRow(row);
    setOpenEdit(true);
  };

  const handleEditSubmit = async () => {
    const { error } = await supabase
      .from("rental_historys")
      .update(selectedRow)
      .eq("id", selectedRow.id);
    if (error) console.error(error);
    else {
      setOpenEdit(false);
      setSelectedRow(null);
      fetchData();
    }
  };

  const handleChange = (field, value) => {
    setSelectedRow({ ...selectedRow, [field]: value });
  };

  const columns = [
    { field: "title", headerName: "제목", width: 100 },
    { field: "room_number", headerName: "방 호수", width: 100 },
    { field: "tenant_name", headerName: "성함", width: 150 },
    { field: "phone_number", headerName: "전화번호", width: 150 },
    { field: "occupants", headerName: "인원", type: "number", width: 80 },
    {
      field: "rent_price",
      headerName: "월세 가격",
      type: "number",
      width: 120,
    },
    {
      field: "start_date",
      headerName: "월세 시작일",
      type: "date",
      width: 150,
      valueGetter: (params) => (params.value ? new Date(params.value) : null),
    },
    { field: "realtor_name", headerName: "부동산 명", width: 150 },
    { field: "deposit", headerName: "보증금", type: "number", width: 120 },
    {
      field: "tax_invoice_status",
      headerName: "세금계산서",
      width: 120,
      renderCell: (params) => (params.value ? "예" : "아니오"),
    },
    { field: "payment_day", headerName: "입금일", type: "number", width: 80 },
    {
      field: "utility_bill_status",
      headerName: "전기세 계산서",
      width: 120,
      renderCell: (params) => (params.value ? "예" : "아니오"),
    },
    {
      field: "payment_status",
      headerName: "입금 상태",
      width: 100,
      renderCell: (params) =>
        params.value === true
          ? "입금완료"
          : params.value === false
          ? "미입금"
          : "-",
    },
    { field: "memo", headerName: "메모", flex: 1 },
    { field: "additional_memo", headerName: "추가 메모", flex: 1 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          key="edit"
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleEdit(params.row)}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDelete(params.id)}
        />,
      ],
    },
  ];

  return (
    <div style={{ height: 700, width: "100%" }} className="p-4">
      <DataGrid
        rows={data}
        columns={columns}
        loading={loading}
        getRowId={(row) => row.id}
        pageSize={10}
        rowsPerPageOptions={[10, 20, 50]}
        localeText={muiDataGridKoreanText}
        showToolbar
        slotProps={{
          toolbar: {
            csvOptions: {
              fileName: `월세 기록 `,
            },
          },
        }}
      />

      {/* 수정 다이얼로그 */}
      {/* 수정 다이얼로그 */}
      <Dialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Rental</DialogTitle>
        <DialogContent>
          {selectedRow && (
            <>
              <TextField
                margin="dense"
                label="제목"
                fullWidth
                value={selectedRow.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
              />
              <TextField
                margin="dense"
                label="방 호수"
                fullWidth
                value={selectedRow.room_number || ""}
                onChange={(e) => handleChange("room_number", e.target.value)}
              />
              <TextField
                margin="dense"
                label="성함"
                fullWidth
                value={selectedRow.tenant_name || ""}
                onChange={(e) => handleChange("tenant_name", e.target.value)}
              />
              <TextField
                margin="dense"
                label="전화번호"
                fullWidth
                value={selectedRow.phone_number || ""}
                onChange={(e) => handleChange("phone_number", e.target.value)}
              />
              <TextField
                margin="dense"
                label="인원"
                type="number"
                fullWidth
                value={selectedRow.occupants || ""}
                onChange={(e) =>
                  handleChange("occupants", parseInt(e.target.value))
                }
              />
              <TextField
                margin="dense"
                label="월세 가격"
                type="number"
                fullWidth
                value={selectedRow.rent_price || ""}
                onChange={(e) =>
                  handleChange("rent_price", parseInt(e.target.value))
                }
              />
              <TextField
                margin="dense"
                label="월세 시작일"
                type="date"
                fullWidth
                value={
                  selectedRow.start_date
                    ? selectedRow.start_date.split("T")[0]
                    : ""
                }
                onChange={(e) => handleChange("start_date", e.target.value)}
              />
              <TextField
                margin="dense"
                label="부동산 명"
                fullWidth
                value={selectedRow.realtor_name || ""}
                onChange={(e) => handleChange("realtor_name", e.target.value)}
              />
              <TextField
                margin="dense"
                label="보증금"
                type="number"
                fullWidth
                value={selectedRow.deposit || ""}
                onChange={(e) =>
                  handleChange("deposit", parseInt(e.target.value))
                }
              />
              <TextField
                margin="dense"
                label="입금일"
                type="number"
                fullWidth
                value={selectedRow.payment_day || ""}
                onChange={(e) =>
                  handleChange("payment_day", parseInt(e.target.value))
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedRow.tax_invoice_status || false}
                    onChange={(e) =>
                      handleChange("tax_invoice_status", e.target.checked)
                    }
                  />
                }
                label="세금계산서"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedRow.utility_bill_status || false}
                    onChange={(e) =>
                      handleChange("utility_bill_status", e.target.checked)
                    }
                  />
                }
                label="전기세 계산서"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedRow.payment_status || false}
                    onChange={(e) =>
                      handleChange("payment_status", e.target.checked)
                    }
                  />
                }
                label="입금 상태"
              />
              <TextField
                margin="dense"
                label="메모"
                fullWidth
                value={selectedRow.memo || ""}
                onChange={(e) => handleChange("memo", e.target.value)}
              />
              <TextField
                margin="dense"
                label="추가 메모"
                fullWidth
                value={selectedRow.additional_memo || ""}
                onChange={(e) =>
                  handleChange("additional_memo", e.target.value)
                }
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
