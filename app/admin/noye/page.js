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
  const [P, setP] = useState(""); // 대출금 (원)
  const [r, setr] = useState(""); // 연이자율 (%)
  const [N, setN] = useState(""); // 상환기간 (개월)

  // 추가 납입 관련
  const [extraStart, setExtraStart] = useState(""); // N개월차부터
  const [extraMonths, setExtraMonths] = useState(""); // X개월 동안
  const [extraAmount, setExtraAmount] = useState(""); // 추가금액 (원 단위)

  const generateSchedule = () => {
    const principal = parseFloat(P);
    const annualRate = parseFloat(r);
    const months = parseInt(N);

    const extraStartMonth = parseInt(extraStart);
    const extraDuration = parseInt(extraMonths);
    const extra = parseFloat(extraAmount); // 원 단위

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
    const Araw = (principal * i * pow) / (pow - 1); // 월 납입금 (소수)

    const A = Math.floor(Araw); // 월 납입금 1원 단위 버림

    let balance = principal;
    const schedule = [];

    for (let m = 1; m <= months && balance > 0; m++) {
      const interestRaw = balance * i;
      const interest = Math.floor(interestRaw); // 이자 1원 단위 버림

      const principalPayment = A - interest;

      // 추가 납입 기간이면 추가 상환
      const isExtraMonth =
        !isNaN(extraStartMonth) &&
        !isNaN(extraDuration) &&
        m >= extraStartMonth &&
        m < extraStartMonth + extraDuration;

      const extraPayment =
        isExtraMonth && !isNaN(extra) ? Math.floor(extra) : 0;
      const totalPrincipal = principalPayment + extraPayment;

      balance -= totalPrincipal;

      if (balance < 0) balance = 0; // 잔액 0 이하 방지

      schedule.push({
        month: m,
        payment: A + extraPayment,
        interest,
        principal: totalPrincipal,
        balance,
      });

      if (balance <= 0) break; // 조기상환 시 종료
    }

    return schedule;
  };

  const schedule = generateSchedule();

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
          inputProps={{ step: "1", min: "0" }}
        />
        <TextField
          value={r}
          onChange={(e) => setr(e.target.value)}
          label="연 이자율 (%)"
          size="small"
          type="number"
          fullWidth
          inputProps={{ step: "0.01", min: "0" }}
        />
        <TextField
          value={N}
          onChange={(e) => setN(e.target.value)}
          label="상환기간 (개월)"
          size="small"
          type="number"
          fullWidth
          inputProps={{ step: "1", min: "1" }}
        />
        <TextField
          value={extraStart}
          onChange={(e) => setExtraStart(e.target.value)}
          label="추가 시작월 (N개월차)"
          size="small"
          type="number"
          fullWidth
          inputProps={{ step: "1", min: "1" }}
        />
        <TextField
          value={extraMonths}
          onChange={(e) => setExtraMonths(e.target.value)}
          label="추가 납입 개월 (X개월)"
          size="small"
          type="number"
          fullWidth
          inputProps={{ step: "1", min: "0" }}
        />
        <TextField
          value={extraAmount}
          onChange={(e) => setExtraAmount(e.target.value)}
          label="매월 추가금액 (원)"
          size="small"
          type="number"
          fullWidth
          inputProps={{ step: "1", min: "0" }}
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
              <YAxis
                tickFormatter={(v) => `${(v / 10000).toFixed(0)}만원`}
                width={80}
              />
              <Tooltip
                formatter={(value) =>
                  `${value.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })} 원`
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
                      {item.payment.toLocaleString()}
                    </td>
                    <td className="border px-2 py-1">
                      {item.interest.toLocaleString()}
                    </td>
                    <td className="border px-2 py-1">
                      {item.principal.toLocaleString()}
                    </td>
                    <td className="border px-2 py-1">
                      {item.balance.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 💡 총합 계산 */}
          {(() => {
            const totalInterest = schedule.reduce(
              (acc, cur) => acc + cur.interest,
              0
            );
            const totalPrincipal = schedule.reduce(
              (acc, cur) => acc + cur.principal,
              0
            );
            const totalPayment = schedule.reduce(
              (acc, cur) => acc + cur.payment,
              0
            );

            return (
              <div className="bg-gray-100 p-4 rounded text-sm space-y-1 border text-black">
                <div>
                  💸 <strong>총 이자 납입:</strong>{" "}
                  {totalInterest.toLocaleString()} 원
                </div>
                <div>
                  💰 <strong>총 원금 납입:</strong>{" "}
                  {totalPrincipal.toLocaleString()} 원
                </div>
                <div>
                  🧾 <strong>총 납입 금액:</strong>{" "}
                  {totalPayment.toLocaleString()} 원
                </div>
              </div>
            );
          })()}
        </>
      ) : (
        <Typography color="error">유효한 값을 입력해주세요.</Typography>
      )}
    </div>
  );
};

export default Noye;
