"use client";

import { useState } from "react";
import MyPlace from "./components/MyPlace";
import { Button } from "@mui/material";
import MyPlace2 from "./components/MyPlace2";
import { useRouter } from "next/navigation";
import TodayTaebaek from "./components/TodayTaebaek";
import InternetNews from "./components/InternetNews";
import HyunsurChuigo from "@/components/HyunsurChuigo";

const Routine = () => {
  const router = useRouter();

  const TOTAL_STEP = 4;
  const [step, setStep] = useState(1);

  return (
    <div className="p-4">
      <HyunsurChuigo />
      <h2 className="mb-2">
        STEP {step}/{TOTAL_STEP}
      </h2>
      {step === 1 && <MyPlace />}
      {step === 2 && <MyPlace2 />}
      {step === 3 && <TodayTaebaek />}
      {step === 4 && <InternetNews />}
      <div className="flex gap-3  mt-10">
        <div className="flex-1">
          <Button
            variant="contained"
            onClick={() => setStep((prev) => prev - 1)}
            fullWidth
            disabled={step === 1}
          >
            {`< 이전`}
          </Button>
        </div>
        <div className="flex-1">
          <Button
            variant="contained"
            onClick={() => {
              if (step === TOTAL_STEP) {
                alert("수고하셨습니다.");
                router.push("/admin");
              }
              setStep((prev) => prev + 1);
            }}
            fullWidth
          >
            {`다음 >`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Routine;
