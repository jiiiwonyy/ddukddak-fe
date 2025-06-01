import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getStats } from "../api/game";

export default function BarCharts() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    // 지난달 계산 (1월이면 작년 12월)
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;

    Promise.all([
      getStats(year, month), // 이번 달
      getStats(prevYear, prevMonth), // 지난달
    ]).then(([thisRes, prevRes]) => {
      const thisMonth = convertStatsToChartData(thisRes.data, "이번달");
      const lastMonth = convertStatsToChartData(prevRes.data, "지난달");
      setData(mergeChartData(thisMonth, lastMonth));
    });
  }, []);

  // monthLabel: "이번달" 또는 "지난달"
  function convertStatsToChartData(stats, monthLabel) {
    return Object.entries(stats.categories).map(([key, cat]) => ({
      categoryKey: key,
      name: cat.name,
      [monthLabel]: cat.avg_accuracy,
    }));
  }

  // 카테고리별로 두 달 데이터 병합
  function mergeChartData(thisMonth, lastMonth) {
    const map = {};
    [...thisMonth, ...lastMonth].forEach((item) => {
      if (!map[item.categoryKey]) {
        map[item.categoryKey] = { name: item.name };
      }
      if (item["이번달"] !== undefined)
        map[item.categoryKey]["이번달"] = item["이번달"];
      if (item["지난달"] !== undefined)
        map[item.categoryKey]["지난달"] = item["지난달"];
    });
    return Object.values(map);
  }

  return (
    <ResponsiveContainer width="100%" height="100%" className="body1">
      <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="이번달" name="이번달 정확도(%)" fill="#A0D2F5" />
        <Bar dataKey="지난달" name="지난달 정확도(%)" fill="#BDBDBD" />
      </BarChart>
    </ResponsiveContainer>
  );
}
