import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getStats } from "../api/game";

export default function LineCharts() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getStats(2025, 5).then((res) => {
      setData(convertStatsToChartData(res.data));
    });
  }, []);

  function convertStatsToChartData(stats) {
    return Object.values(stats.categories).map((cat) => ({
      name: cat.name,
      responseTime: cat.avg_response_time,
    }));
  }

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
          dataKey="responseTime"
          name="평균 반응시간(ms)"
          stroke="#A0D2F5"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
