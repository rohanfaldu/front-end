import * as React from "react";
import { useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";

export default function MessageChart() {
  const [duration, setDuration] = useState("weekly");

  // Static Data for Pie Chart
  const pieData = {
    weekly: [
      { id: 0, value: 87, label: "Incoming messages", color: "#FFAB00" },
      { id: 1, value: 57, label: "responses sent", color: "#EE6C6C" },
    ],
    monthly: [
      { id: 0, value: 167, label: "Incoming messages", color: "#FFAB00" },
      { id: 1, value: 107, label: "responses sent", color: "#EE6C6C" },
    ],
    yearly: [
      { id: 0, value: 254, label: "Incoming messages", color: "#FFAB00" },
      { id: 1, value: 217, label: "responses sent", color: "#EE6C6C" },
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