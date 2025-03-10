import * as React from "react";
import { useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";

export default function ViewChart() {
  const [duration, setDuration] = useState("weekly");

  // Static Data
  const staticData = {
    weekly: {
      uData: [20, 25, 18, 30, 35, 28, 40],
      xLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    monthly: {
      uData: [200, 220, 250, 230, 270, 290, 300, 280, 260, 240],
      xLabels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Week 8", "Week 9", "Week 10"],
    },
    yearly: {
      uData: [1000, 1200, 1350, 1500, 1600, 1800, 1750, 1900, 2000, 2200, 2300, 2500],
      xLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    },
  };

  const { uData, xLabels } = staticData[duration];

  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: "10px", display: "flex", justifyContent: "end" }}>
        <select value={duration} onChange={(e) => setDuration(e.target.value)}>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <BarChart
        height={300}
        series={[{ data: uData, label: "Views", id: "uvId", color: "#FF4906" }]}
        xAxis={[{ data: xLabels, scaleType: "band", tickLabelStyle: { angle: 45, textAnchor: "start" } }]}
      />
    </div>
  );
}
