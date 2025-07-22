"use client";

import { TextField, Typography } from "@mui/material";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const Noye = () => {
  const [P, setP] = useState(""); // 대출금
  const [r, setr] = useState(""); // 연이자율
  const [N, setN] = useState(""); // 상환기간

  // 추가 납입 관련
  const [extraStart, setExtraStart] = useState(""); // N개월차부터
  const [extraMonths, setExtraMonths] = useState(""); // X개월 동안
  const [extraAmount, setExtraAmount] = useState(""); // Y만원씩

  const generateSchedule = () => {
    const principal = parseFloat(P);
    const annualRate = parseFloat(r);
    const months = parseInt(N);

    const extraStartMonth = parseInt(extraStart);
    const extraDuration = parseInt(extraMonths);
    const extra = parseFloat(extraAmount) * 10000; // 만원 → 원

    if (
      isNaN(principal) ||
      isNaN(annualRate) ||
      isNaN(months) ||
      principal <= 0 ||
      annualRate < 0 ||
      months <= 0
    ) {
      return null;
    }

    const i = annualRate / 1200;
    const pow = Math.pow(1 + i, months);
    const A = (principal * i * pow) / (pow - 1); // 월 납입금

    let balance = principal;
    const schedule = [];

    for (let m = 1; m <= months && balance > 0; m++) {
      const interest = balance * i;
      const principalPayment = A - interest;

      // 추가 납입 기간이면 추가 상환
      const isExtraMonth =
        !isNaN(extraStartMonth) &&
        !isNaN(extraDuration) &&
        m >= extraStartMonth &&
        m < extraStartMonth + extraDuration;

      const extraPayment = isExtraMonth ? extra : 0;
      const totalPrincipal = principalPayment + extraPayment;

      balance -= totalPrincipal;

      schedule.push({
        month: m,
        payment: A + extraPayment,
        interest,
        principal: totalPrincipal,
        balance: balance > 0 ? balance : 0,
      });

      if (balance <= 0) break; // 조기상환 시 종료
    }

    return schedule;
  };

  const schedule = generateSchedule();

  const format = (v) =>
    v.toLocaleString(undefined, {
      maximumFractionDigits: 2,
    });

  return (
    <div className="p-5 max-w-4xl space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <TextField
          value={P}
          onChange={(e) => setP(e.target.value)}
          label="대출금 (원)"
          size="small"
          type="number"
          fullWidth
        />
        <TextField
          value={r}
          onChange={(e) => setr(e.target.value)}
          label="연 이자율 (%)"
          size="small"
          type="number"
          fullWidth
        />
        <TextField
          value={N}
          onChange={(e) => setN(e.target.value)}
          label="상환기간 (개월)"
          size="small"
          type="number"
          fullWidth
        />
        <TextField
          value={extraStart}
          onChange={(e) => setExtraStart(e.target.value)}
          label="추가 시작월 (N개월차)"
          size="small"
          type="number"
          fullWidth
        />
        <TextField
          value={extraMonths}
          onChange={(e) => setExtraMonths(e.target.value)}
          label="추가 납입 개월 (X개월)"
          size="small"
          type="number"
          fullWidth
        />
        <TextField
          value={extraAmount}
          onChange={(e) => setExtraAmount(e.target.value)}
          label="매월 추가금액 (만원)"
          size="small"
          type="number"
          fullWidth
        />
      </div>

      {schedule ? (
        <>
          <Typography variant="h6" className="mt-4">
            📊 상환 그래프 (잔액 기준)
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={schedule}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v) => `${(v / 10000).toFixed(0)}만원`} />
              <Tooltip
                formatter={(value) =>
                  `${parseFloat(value).toLocaleString()} 원`
                }
              />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#8884d8"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>

          <Typography variant="h6" className="mt-4">
            상환 스케줄
          </Typography>
          <div className="overflow-auto">
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-gray-100 text-black">
                  <th className="border px-2 py-1">회차</th>
                  <th className="border px-2 py-1">납입금</th>
                  <th className="border px-2 py-1">이자</th>
                  <th className="border px-2 py-1">원금</th>
                  <th className="border px-2 py-1">잔액</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((item) => (
                  <tr key={item.month} className="text-center">
                    <td className="border px-2 py-1">
                      {item.month} ({Math.floor(item.month / 12)}년차
                      {item.month % 12 !== 0 ? ` ${item.month % 12}개월` : ""})
                    </td>
                    <td className="border px-2 py-1">
                      {(Math.round(item.payment / 100) * 100).toLocaleString()}
                    </td>
                    <td className="border px-2 py-1">
                      {(Math.round(item.interest / 100) * 100).toLocaleString()}
                    </td>
                    <td className="border px-2 py-1">
                      {(
                        Math.round(item.principal / 100) * 100
                      ).toLocaleString()}
                    </td>
                    <td className="border px-2 py-1">
                      {(Math.round(item.balance / 100) * 100).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <Typography color="error">유효한 값을 입력해주세요.</Typography>
      )}
    </div>
  );
};

export default Noye;
