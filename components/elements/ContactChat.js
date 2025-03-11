import * as React from "react";
import { useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";

export default function ContactChart() {
  const [duration, setDuration] = useState("weekly");

  // Static Data
  const staticData = {
    weekly: {
      uData: [10, 15, 8, 20, 25, 18, 30],
      xLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    monthly: {
      uData: [100, 120, 150, 130, 170, 190, 200, 180, 160, 140],
      xLabels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Week 8", "Week 9", "Week 10"],
    },
    yearly: {
      uData: [500, 600, 750, 820, 910, 1020, 980, 1150, 1200, 1350, 1400, 1500],
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
        series={[{ data: uData, label: "Contact", id: "uvId", color: "#00ABC4" }]}
        xAxis={[{ data: xLabels, scaleType: "band", tickLabelStyle: { angle: 45, textAnchor: "start" } }]}
      />
    </div>
  );
}
