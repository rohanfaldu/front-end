import * as React from "react";
import { useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";

export default function MessageChart() {
  const [duration, setDuration] = useState("weekly");

  // Static Data for Pie Chart
  const pieData = {
    weekly: [
      { id: 0, value: 87, label: "Incoming messages", color: "#00ABC4" },
      { id: 1, value: 57, label: "responses sent", color: "#2EC400" },
    ],
    monthly: [
      { id: 0, value: 167, label: "Incoming messages", color: "#00ABC4" },
      { id: 1, value: 107, label: "responses sent", color: "#2EC400" },
    ],
    yearly: [
      { id: 0, value: 254, label: "Incoming messages", color: "#00ABC4" },
      { id: 1, value: 217, label: "responses sent", color: "#2EC400" },
    ],
  };
  const valueFormatter = (value) => `${value}%`;
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
         width={1000}
         height={400}
        series={[
          {
            data: pieData[duration],
            innerRadius: 90,
            arcLabel: (params) => valueFormatter(params.value), // Show percentage on slices
            arcLabelMinAngle: 20, // Only show labels if slice is large enough
          },
        ]}
        skipAnimation={false} // Keep animations enabled
      />
    </div>
  );
}