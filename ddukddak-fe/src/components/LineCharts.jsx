import React, { PureComponent } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
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

export default function LineCharts() {
  return (
    <ResponsiveContainer width="100%" height="100%" className="body1">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" padding={{ left: 5, right: 5 }} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="pv"
          name="지난 달"
          stroke="#BBBBBE"
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" name="이번달" dataKey="uv" stroke="#A0D2F5" />
      </LineChart>
    </ResponsiveContainer>
  );
}
