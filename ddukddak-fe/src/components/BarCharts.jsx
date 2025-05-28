import React, { PureComponent } from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "시간 지남력",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "공간 지남력",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "기억력",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "숫자/언어 게임",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
];

export default function BarCharts() {
  return (
    <ResponsiveContainer width="100%" height="100%" className="body1">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 5,
          left: 5,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="pv" name="지난 달" fill="#BBBBBE" />
        <Bar dataKey="uv" name="이번 달" fill="#A0D2F5" />
      </BarChart>
    </ResponsiveContainer>
  );
}
