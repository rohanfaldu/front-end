import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { BarChart } from "@mui/x-charts/BarChart";

export default function CommentChart() {
  const [duration, setDuration] = useState("weekly");
  const [uData, setUData] = useState([]);
  const [xLabels, setXLabels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const TOKEN = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchUData = async (daysBefore) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${API_URL}/api/dashboard/get-comments`,
        { day_before: daysBefore },
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      const userLikedData = response.data.data || [];
      if (userLikedData.length === 0) {
        setError("No data available for the selected period.");
        setUData([]);
        setXLabels([]);
      } else {
        setUData(userLikedData.map((item) => item.count));
        setXLabels(userLikedData.map((item) => item.date));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data. Please try again.");
      setUData([]);
      setXLabels([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    let daysBefore = 7;
    if (duration === "monthly") daysBefore = 30;
    if (duration === "yearly") daysBefore = 365;

    if (TOKEN && API_URL) {
      fetchUData(daysBefore);
    } else {
      setError("Missing API credentials.");
    }
  }, [duration]);

  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: "10px", display: "flex", justifyContent: "end" }}>
        <select value={duration} onChange={(e) => setDuration(e.target.value)}>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {loading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <BarChart
          height={300}
          series={[{ data: uData, label: "Likes", id: "uvId", color: "#00ABC4" }]}
          xAxis={[{ data: xLabels, scaleType: "band", tickLabelStyle: { angle: 45, textAnchor: "start" } }]}
        />
      )}
    </div>
  );
}


