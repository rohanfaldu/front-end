import * as React from "react";
import { useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";

export default function CallChart() {
  const [duration, setDuration] = useState("weekly");

  // Static Data for Pie Chart
  const pieData = {
    weekly: [
      { id: 0, value: 77, label: "Call made", color: "#00ABC4" },
      { id: 1, value: 27, label: "Successful call", color: "#2EC400" },
    ],
    monthly: [
      { id: 0, value: 127, label: "Call made", color: "#00ABC4" },
      { id: 1, value: 50, label: "Successful call", color: "#2EC400" },
    ],
    yearly: [
      { id: 0, value: 157, label: "Call made", color: "#00ABC4" },
      { id: 1, value: 77, label: "Successful call", color: "#2EC400" },
    ],
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: "10px", display: "flex", justifyContent: "end" }}>
        <select value={duration} onChange={(e) => setDuration(e.target.value)}>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <PieChart
        series={[{
          data: pieData[duration],
          innerRadius: 90,
          outerRadius: 150,
          paddingAngle: 5,
          cornerRadius: 5,
          startAngle: -135,
          endAngle: 225,
          cx: 550,
          cy: 150,
        }]}
        width={1000}
        height={400}
      />
    </div>
  );
}