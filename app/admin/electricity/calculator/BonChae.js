import { Button, createTheme, TextField, ThemeProvider } from "@mui/material";
import { useEffect, useState } from "react";
import { ROOM } from "./room";
import { DataGrid } from "@mui/x-data-grid";
import { muiDataGridKoreanText } from "./muiDataGridKo";
import { createBrowserSupabaseClient } from "@/utils/supabase/client";
import { COLUMNS } from "../columns";

const BonChae = ({ electricity }) => {
  const supabase = createBrowserSupabaseClient();
  const lightTheme = createTheme({
    palette: {
      mode: "light",
    },
  });

  const [form, setForm] = useState({
    white201: "",
    white202: "",
    white203: "",
    white204: "",
    white205: "",
    white206: "",
    white301: "",
    white302: "",
    white303: "",
    white304: "",
    white305: "",
    white306: "",
    blue101: "",
    blue102: "",
    blue103: "",
    blue104: "",
    blue105: "",
    blue106: "",
    blue201: "",
    blue202: "",
    blue203: "",
    blue204: "",
    blue205: "",
    blue206: "",
    blue301: "",
    blue302: "",
    blue303: "",
    blue304: "",
    blue305: "",
    blue306: "",
  });
  const [pricePerkWh, setPricePerkWh] = useState(0);
  const [rows, setRows] = useState([]);

  const handleFormChange = (field) => (event) => {
    const value = event.target.value;
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    const pricePerkWh = Math.floor(
      parseInt(electricity.price) / parseInt(electricity.kwh)
    );
    setPricePerkWh(pricePerkWh);
  }, [electricity]);

  function convertRoomName(str) {
    // 색상 이름은 영어에서 한글로 변환
    const colorMap = {
      white: "화이트",
      black: "블랙",
      blue: "블루",
      red: "레드",
      green: "그린",
      yellow: "옐로우",
      pink: "핑크",
      orange: "오렌지",
      purple: "퍼플",
      gray: "그레이",
      brown: "브라운",
    };

    // 색상 영문자와 숫자 분리
    const match = str.match(/^([a-zA-Z]+)(\d+)$/);
    if (!match) return str; // 매칭 실패 시 원본 반환

    const [, colorEng, number] = match;
    const colorKor = colorMap[colorEng.toLowerCase()] || colorEng;

    return `${colorKor} ${number}호`;
  }

  const handleCalulate = () => {
    const rooms = Object.keys(form);
    const electricityUsedRooms = rooms.filter((room) => form[room] !== "");
    const rows = electricityUsedRooms.map((room) => {
      return {
        id: room,
        room: convertRoomName(room),
        kwh: `${form[room]}kWh`,
        price: `${Math.floor(form[room] * pricePerkWh)}원`,
      };
    });

    setRows([
      ...rows,
      {
        id: "total",
        room: "총 합계(10원 단위 절사)",
        kwh: `${electricityUsedRooms.reduce(
          (acc, room) => acc + parseInt(form[room] || 0),
          0
        )}kWh`,
        price: `${
          Math.floor(
            electricityUsedRooms.reduce(
              (acc, room) =>
                acc + Math.floor(parseInt(form[room] || 0) * pricePerkWh),
              0
            ) / 100
          ) * 100
        }원`,
      },
    ]);
  };

  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState("");
  const handleSave = async () => {
    if (!title) {
      alert("제목을 입력해주세요.");
      return;
    }
    setIsSaving(true);
    const { error } = await supabase.from("electricity_historys").insert({
      title,
      data: rows,
    });
    if (error) {
      alert("전기세 저장에 실패했습니다. 다시 시도해주세요.");
      console.error("Error saving electricity history:", error);
      setIsSaving(false);
      return;
    }
    alert("전기세가 저장되었습니다.");
    setIsSaving(false);
    setTitle("");
  };

  if (electricity.kwh && electricity.price)
    return (
      <>
        <div>
          <p className="mt-4">
            {pricePerkWh}원/1kWh{" "}
            {`(${electricity.kwh}kwh / ${electricity.price}원 / ${electricity.date})`}
          </p>
          {/* <p className="mt-4">{`우리 전기세 총 ${
            parseInt(form.totalkWh) - usedkWh
          }kWh / ${(parseInt(form.totalkWh) - usedkWh) * pricePerkWh}원`}</p> */}
          <div className="grid grid-cols-4 gap-3 mt-4">
            {ROOM.map((room) => (
              <div className="" key={room}>
                <TextField
                  variant="outlined"
                  label={`${room} 전기 사용량 (kWh)`}
                  value={form[room]}
                  onChange={handleFormChange(room)}
                  fullWidth
                />
              </div>
            ))}
          </div>
          <Button
            variant="contained"
            className="mt-4"
            fullWidth
            onClick={handleCalulate}
          >
            계산
          </Button>

          {/* <ThemeProvider theme={lightTheme}> */}
          <DataGrid
            columns={COLUMNS}
            rows={rows}
            className="mt-5"
            showToolbar
            localeText={muiDataGridKoreanText}
            slotProps={{
              toolbar: {
                csvOptions: {
                  fileName: `전기세_${new Date().toLocaleDateString()}`,
                },
              },
            }}
          />
          {/* </ThemeProvider> */}

          <TextField
            variant="outlined"
            label="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            className="mt-4"
          />
          <Button
            variant="contained"
            className="mt-4"
            fullWidth
            onClick={handleSave}
            disabled={isSaving}
          >
            저장
          </Button>
        </div>
      </>
    );
};

export default BonChae;
