import * as React from "react";
import { useState, useEffect } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import axios from "axios";

export default function SimpleBarChart() {
  const [duration, setDuration] = useState("weekly");
  const [uData, setUData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [xLabels, setXLabels] = useState([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const TOKEN = localStorage.getItem('token');

  const fetchUData = async (daysBefore) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/dashboard/agencies-user-engagement`,
        { day_before: daysBefore },
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      const userLikedData = response.data.data.user_liked || [];
      const newUData = userLikedData.map((item) => item.count);
      const newLabels = userLikedData.map((item) => item.date);

      setUData(newUData);
      setXLabels(newLabels);
    } catch (error) {
      console.error("Error fetching uData:", error);
      setUData([]);
      setXLabels([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    let daysBefore = 7;
    if (duration === "monthly") daysBefore = 30;
    if (duration === "yearly") daysBefore = 365;

    fetchUData(daysBefore);
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
        <p>Loading...</p>
      ) : (
        <BarChart
          height={300}
          series={[{ data: uData, label: "Favourites", id: "uvId", color: "#FFAB00" }]}
          xAxis={[{ data: xLabels, scaleType: "band" ,
            tickLabelStyle: {
              angle: 45,
              textAnchor: 'start',
            },
          }]}
          
        />
      )}
    </div>
  );
}
