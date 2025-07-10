"use client";

import HyunsurChuigo from "@/components/HyunsurChuigo";
import { TextField } from "@mui/material";
import { useEffect, useState } from "react";

const Calculator = () => {
  return (
    <div className="p-4 relative overflow-hidden w-screen h-screen">
      <h1 className="text-3xl font-bold mb-4">전기세 계산기</h1>
      <p className="mb-4">
        전기세를 계산하는 도구입니다. 아래의 입력란에 전기 사용량을 입력하고
        계산 버튼을 클릭하세요.
      </p>
      <TextField variant="outlined" label="asdf" />
      <HyunsurChuigo />
    </div>
  );
};

export default Calculator;
