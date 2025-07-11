"use client";

import HyunsurChuigo from "@/components/HyunsurChuigo";
import { createBrowserSupabaseClient } from "@/utils/supabase/client";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useEffect, useState } from "react";
import BonChae from "./BonChae";

const Calculator = () => {
  const supabase = createBrowserSupabaseClient();

  const [pricePerkWh, setPricePerkWh] = useState(0);
  const [usedkWh, setUsedkWh] = useState(0);

  const [saveForm, setSaveForm] = useState({
    kwh: "",
    price: "",
    date: "",
    type: "",
  });

  const [eletectricity, setElectricity] = useState({
    kwh: "",
    price: "",
    date: "",
    type: "",
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [openGetDialog, setOpenGetDialog] = useState(false);
  const [list, setList] = useState([]);

  useEffect(() => {
    getElectricityList();
  }, []);
  const getElectricityList = async () => {
    const { data, error } = await supabase
      .from("electricity")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setList(data);
  };
  const handleSaveFormChange = (field) => (event) => {
    const value = event.target.value;
    setSaveForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onSaveElectricity = async () => {
    const { error } = await supabase.from("electricity").insert(saveForm);

    if (error) {
      console.error("Error saving electricity data:", error);
      alert("전기세 저장에 실패했습니다. 다시 시도해주세요.");
      return;
    }
    setSaveForm((prev) => ({
      ...prev,
      kwh: "",
      price: "",
      date: prev.date,
      type: "",
    }));
    alert("전기세가 저장되었습니다.");
  };

  return (
    <div className="p-4 relative overflow-hidden w-screen">
      <h1 className="text-3xl font-bold mb-4">전기세 계산기</h1>
      <p className="mb-4">
        전기세를 계산하는 아주 전문적이고 멋있고 대단한 현서의 작품입니다.
      </p>
      <Button variant="outlined" onClick={() => setOpenDialog(true)}>
        전기세 저장하기
      </Button>
      <Button
        variant="outlined"
        className="ml-4"
        onClick={() => setOpenGetDialog(true)}
      >
        총 전기세 불러오기
      </Button>

      <BonChae electricity={eletectricity} />

      {/* <p className="mt-4">{`1kWh 당 요금 ${pricePerkWh}원`}</p>
      <p className="mt-4">{`월세 전기세 총 ${usedkWh}kWh / ${
        usedkWh * pricePerkWh
      }원`}</p> */}

      <HyunsurChuigo />
      <HyunsurChuigo />
      <HyunsurChuigo />
      <HyunsurChuigo />
      <HyunsurChuigo />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle>전기세 저장</DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-3 mt-2">
            <TextField
              variant="outlined"
              label="총kWh"
              value={saveForm.kwh}
              onChange={handleSaveFormChange("kwh")}
              fullWidth
            />
            <TextField
              variant="outlined"
              label="총 전기세"
              value={saveForm.price}
              onChange={handleSaveFormChange("price")}
              fullWidth
            />
            <TextField
              variant="outlined"
              label="전기세 사용 날짜"
              value={saveForm.date}
              onChange={handleSaveFormChange("date")}
              fullWidth
            />
            <TextField
              variant="outlined"
              label="동 (화이트, 블루)"
              value={saveForm.type}
              onChange={handleSaveFormChange("type")}
              fullWidth
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>취소</Button>
          <Button
            variant="contained"
            onClick={() => {
              onSaveElectricity();
              setOpenDialog(false);
            }}
          >
            저장
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openGetDialog}
        onClose={() => setOpenGetDialog(false)}
        fullWidth
      >
        <DialogTitle>전기세 불러오기</DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-3 mt-2">
            {list.map((item) => (
              <div
                key={item.id}
                className="border p-2 rounded hover:bg-gray-800 cursor-pointer"
                onClick={() => {
                  setElectricity({
                    kwh: item.kwh,
                    price: item.price,
                    date: item.date,
                    type: item.type,
                  });
                  setOpenGetDialog(false);
                }}
              >
                <p>{`총 kWh: ${item.kwh}`}</p>
                <p>{`총 전기세: ${item.price}원`}</p>
                <p>{`사용 날짜: ${item.date}`}</p>
                <p>{`동: ${item.type}`}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calculator;
